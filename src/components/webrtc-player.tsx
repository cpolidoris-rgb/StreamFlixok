'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Stream } from '@/lib/data';
import { RTC_CONFIG } from '@/lib/webrtc-config';
import { useFirestore } from '@/firebase/provider';
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import {
  Radio,
  Volume2,
  VolumeX,
  Maximize2,
  Loader2,
  AlertCircle,
  Wifi,
  Sparkles,
} from 'lucide-react';

interface WebRTCPlayerProps {
  stream: Stream;
  streamId: string;
  muted?: boolean;
}

export default function WebRTCPlayer({ stream, streamId, muted = false }: WebRTCPlayerProps) {
  const firestore = useFirestore();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [connectionState, setConnectionState] = useState<
    'connecting' | 'connected' | 'waiting_host' | 'failed' | 'ended'
  >('connecting');
  const [isAudioMuted, setIsAudioMuted] = useState(muted);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamStarted, setStreamStarted] = useState(false);

  useEffect(() => {
    if (!firestore || !streamId) return;

    let isCancelled = false;
    const viewerId = 'viewer_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    const viewerDocRef = doc(firestore, 'streams', streamId, 'webrtc_viewers', viewerId);
    const viewerCandidatesCol = collection(firestore, 'streams', streamId, 'webrtc_viewers', viewerId, 'viewer_candidates');
    const hostCandidatesCol = collection(firestore, 'streams', streamId, 'webrtc_viewers', viewerId, 'host_candidates');

    let unsubViewerDoc: (() => void) | null = null;
    let unsubHostCandidates: (() => void) | null = null;

    const initViewer = async () => {
      try {
        setConnectionState('connecting');

        const pc = new RTCPeerConnection(RTC_CONFIG);
        pcRef.current = pc;

        // Add receive-only transceivers for audio and video
        pc.addTransceiver('video', { direction: 'recvonly' });
        pc.addTransceiver('audio', { direction: 'recvonly' });

        // Remote stream incoming
        pc.ontrack = (event) => {
          if (videoRef.current && event.streams[0]) {
            videoRef.current.srcObject = event.streams[0];
            setStreamStarted(true);
            setConnectionState('connected');

            // Attempt to play with sound
            videoRef.current
              .play()
              .then(() => {
                setNeedsUserGesture(false);
              })
              .catch(() => {
                // Browser blocked autoplay with audio, mute temporarily and request click
                if (videoRef.current) {
                  videoRef.current.muted = true;
                  setIsAudioMuted(true);
                  videoRef.current.play().catch(() => {});
                  setNeedsUserGesture(true);
                }
              });
          }
        };

        // Connection state monitoring
        pc.onconnectionstatechange = () => {
          if (isCancelled) return;
          const state = pc.connectionState;
          if (state === 'connected') {
            setConnectionState('connected');
          } else if (state === 'disconnected' || state === 'failed') {
            setConnectionState('waiting_host');
          } else if (state === 'closed') {
            setConnectionState('ended');
          }
        };

        // ICE candidate collection from viewer
        pc.onicecandidate = (event) => {
          if (event.candidate && !isCancelled) {
            addDoc(viewerCandidatesCol, event.candidate.toJSON()).catch(() => {});
          }
        };

        // Create offer
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);

        if (isCancelled) return;

        // Write offer to Firestore
        await setDoc(viewerDocRef, {
          viewerOffer: {
            type: offer.type,
            sdp: offer.sdp,
          },
          connectedAt: serverTimestamp(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        });

        // Listen for Host's answer
        unsubViewerDoc = onSnapshot(viewerDocRef, async (snapshot) => {
          if (isCancelled || !snapshot.exists()) return;
          const data = snapshot.data();

          if (data?.hostAnswer && pc.signalingState !== 'stable') {
            try {
              const remoteDesc = new RTCSessionDescription(data.hostAnswer);
              await pc.setRemoteDescription(remoteDesc);
            } catch (err) {
              console.warn('Error setting host answer:', err);
            }
          }
        });

        // Listen for Host's ICE candidates
        unsubHostCandidates = onSnapshot(hostCandidatesCol, (snapshot) => {
          if (isCancelled) return;
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
              const candidateData = change.doc.data();
              try {
                if (pc.remoteDescription) {
                  await pc.addIceCandidate(new RTCIceCandidate(candidateData));
                }
              } catch (e) {
                // Ignore candidate errors if disconnected
              }
            }
          });
        });

        // Timeout fallback if host is not active
        setTimeout(() => {
          if (!isCancelled && pc.connectionState !== 'connected' && !streamStarted) {
            setConnectionState((prev) => (prev === 'connecting' ? 'waiting_host' : prev));
          }
        }, 10000);
      } catch (err) {
        console.error('WebRTC viewer initialization failed:', err);
        if (!isCancelled) setConnectionState('failed');
      }
    };

    initViewer();

    return () => {
      isCancelled = true;
      if (unsubViewerDoc) unsubViewerDoc();
      if (unsubHostCandidates) unsubHostCandidates();
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      deleteDoc(viewerDocRef).catch(() => {});
    };
  }, [firestore, streamId]);

  // Handle Unmute
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsAudioMuted(nextMuted);
    setNeedsUserGesture(false);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden group select-none"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-contain bg-black"
      />

      {/* OVERLAY: CARGANDO / CONECTANDO */}
      {connectionState === 'connecting' && (
        <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
          <div className="p-4 rounded-full bg-primary/20 border border-primary/40 text-primary mb-4 animate-pulse">
            <Radio className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black uppercase italic tracking-tight text-white mb-2">
            Conectando con la cámara en vivo...
          </h3>
          <p className="text-zinc-400 text-xs max-w-sm">
            Estableciendo señal WebRTC P2P de ultra baja latencia con <strong className="text-white">{stream.streamer}</strong>.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-zinc-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> Negociando conexión directa
          </div>
        </div>
      )}

      {/* OVERLAY: ESPERANDO AL EMISOR */}
      {connectionState === 'waiting_host' && !streamStarted && (
        <div className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center p-6 text-center z-30">
          <div className="p-4 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black uppercase italic tracking-tight text-white mb-2">
            Esperando señal del Host
          </h3>
          <p className="text-zinc-400 text-xs max-w-sm mb-4">
            El canal está registrado pero el emisor aún no ha encendido su cámara o la transmisión se encuentra pausada.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs uppercase tracking-wider transition-all"
          >
            Reintentar Conexión
          </button>
        </div>
      )}

      {/* BANNER DE ACTIVAR AUDIO POR POLÍTICA DE AUTOPLAY */}
      {needsUserGesture && connectionState === 'connected' && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = false;
                videoRef.current.play().catch(() => {});
                setIsAudioMuted(false);
                setNeedsUserGesture(false);
              }
            }}
            className="px-5 py-2.5 rounded-full bg-primary text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_30px_rgba(255,0,0,0.7)] hover:scale-105 active:scale-95 transition-all animate-bounce cursor-pointer border border-white/20"
          >
            <Volume2 className="w-4 h-4" /> Clic para activar audio en vivo
          </button>
        </div>
      )}

      {/* HUD SUPERIOR: BADGE EN VIVO + P2P WEBRTC */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,0,0.6)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" /> EN VIVO
          </div>
          <div className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-emerald-400 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5">
            <Wifi className="w-3 h-3" /> WebRTC P2P Directo
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-zinc-300 font-mono text-[10px]">
          Latencia &lt; 0.2s
        </div>
      </div>

      {/* HUD INFERIOR: CONTROLES DE REPRODUCCIÓN */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all cursor-pointer"
            title={isAudioMuted ? 'Activar Sonido' : 'Silenciar'}
          >
            {isAudioMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <span className="text-xs font-black uppercase tracking-wider text-white">
            {stream.streamer}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all cursor-pointer"
            title="Pantalla Completa"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

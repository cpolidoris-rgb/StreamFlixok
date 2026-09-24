'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Radio,
  Settings2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Share2,
  Copy,
  Users,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Sliders,
  Send,
  Camera,
} from 'lucide-react';
import AppHeader from './app-header';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore } from '@/firebase/provider';
import { collection, addDoc, serverTimestamp, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { RTC_CONFIG } from '@/lib/webrtc-config';

export default function BroadcastStudio() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'studio' | 'external'>('studio');

  // Studio State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const peerConnectionsRef = useRef<Map<string, { pc: RTCPeerConnection; unsubCandidates?: () => void }>>(new Map());

  const [isMediaReady, setIsMediaReady] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // Device lists
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');

  // Live Broadcast State
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastId, setBroadcastId] = useState<string | null>(null);
  const [broadcastDuration, setBroadcastDuration] = useState(0);
  const [liveViewers, setLiveViewers] = useState(1);
  const [capturedThumbnail, setCapturedThumbnail] = useState<string | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    streamer: user?.displayName || '',
    title: '',
    category: 'Streaming',
    description: '',
    platform: 'YouTube',
    channelOrVideoId: '',
  });

  // Chat in live studio
  const [chatMessages, setChatMessages] = useState<Array<{ user: string; text: string; time: string }>>([
    { user: 'StreamFLIX Bot', text: '¡Bienvenido al panel de control de tu transmisión en vivo!', time: 'Ahora' },
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');

  // External Form submitted
  const [externalSubmitted, setExternalSubmitted] = useState(false);

  // Sync user display name
  useEffect(() => {
    if (user?.displayName && !formData.streamer) {
      setFormData((prev) => ({ ...prev, streamer: user.displayName || '' }));
    }
  }, [user]);

  // Request & Setup Media Devices
  const startCamera = async (videoId?: string, audioId?: string) => {
    try {
      setMediaError(null);
      // Stop any existing tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }

      const constraints: MediaStreamConstraints = {
        video: videoId ? { deviceId: { exact: videoId }, width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: audioId ? { deviceId: { exact: audioId } } : true,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Update active WebRTC peer connections with new tracks
      if (peerConnectionsRef.current.size > 0) {
        const newVideoTrack = mediaStream.getVideoTracks()[0];
        const newAudioTrack = mediaStream.getAudioTracks()[0];
        peerConnectionsRef.current.forEach(({ pc }) => {
          pc.getSenders().forEach((sender) => {
            if (sender.track?.kind === 'video' && newVideoTrack) {
              sender.replaceTrack(newVideoTrack).catch(() => {});
            } else if (sender.track?.kind === 'audio' && newAudioTrack) {
              sender.replaceTrack(newAudioTrack).catch(() => {});
            }
          });
        });
      }

      setIsMediaReady(true);
      setCameraEnabled(true);
      setMicEnabled(true);
      setIsScreenSharing(false);

      // Enumerate available devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      setVideoDevices(devices.filter((d) => d.kind === 'videoinput'));
      setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));

      // Setup audio analyzer for VU meter
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass && mediaStream.getAudioTracks().length > 0) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          analyserRef.current = analyser;

          const source = audioCtx.createMediaStreamSource(mediaStream);
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const updateAudioLevel = () => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
            animFrameRef.current = requestAnimationFrame(updateAudioLevel);
          };
          updateAudioLevel();
        }
      } catch (err) {
        // Fallback for audio metering
      }
    } catch (err: any) {
      console.warn('Could not access media devices:', err);
      setMediaError(
        'No se pudo acceder a la cámara o micrófono. Asegúrate de otorgar permisos al navegador o de tener un dispositivo conectado.'
      );
      setIsMediaReady(false);
    }
  };

  // Switch to Screen Share
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Revert to camera
      await startCamera(selectedVideoDevice, selectedAudioDevice);
      return;
    }

    try {
      if (!navigator.mediaDevices.getDisplayMedia) {
        toast({ title: 'Tu navegador no soporta compartir pantalla.' });
        return;
      }
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      
      // Stop old video tracks
      if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach((t) => t.stop());
      }

      // Preserve mic audio if available
      const micAudioTrack = streamRef.current?.getAudioTracks()[0];
      const newStream = new MediaStream();
      displayStream.getVideoTracks().forEach((t) => newStream.addTrack(t));
      if (micAudioTrack) {
        newStream.addTrack(micAudioTrack);
      } else {
        displayStream.getAudioTracks().forEach((t) => newStream.addTrack(t));
      }

      streamRef.current = newStream;
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setIsScreenSharing(true);

      // Update active WebRTC peer connections with screen share track
      if (peerConnectionsRef.current.size > 0) {
        const newVideoTrack = newStream.getVideoTracks()[0];
        peerConnectionsRef.current.forEach(({ pc }) => {
          pc.getSenders().forEach((sender) => {
            if (sender.track?.kind === 'video' && newVideoTrack) {
              sender.replaceTrack(newVideoTrack).catch(() => {});
            }
          });
        });
      }

      // Handle user stopping screen share from browser banner
      displayStream.getVideoTracks()[0].onended = () => {
        startCamera(selectedVideoDevice, selectedAudioDevice);
      };
    } catch (err) {
      // User cancelled screen share
    }
  };

  // Toggle Camera
  const toggleCamera = () => {
    if (!streamRef.current) return;
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraEnabled(videoTrack.enabled);
    }
  };

  // Toggle Microphone
  const toggleMic = () => {
    if (!streamRef.current) return;
    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicEnabled(audioTrack.enabled);
      if (!audioTrack.enabled) setAudioLevel(0);
    }
  };

  // Clean up media on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Broadcast timer and viewer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let viewerInterval: NodeJS.Timeout | null = null;

    if (isBroadcasting) {
      timer = setInterval(() => {
        setBroadcastDuration((prev) => prev + 1);
      }, 1000);

      viewerInterval = setInterval(() => {
        setLiveViewers((prev) => {
          const delta = Math.floor(Math.random() * 5) - 1; // +0 to +3 on average
          return Math.max(1, prev + delta);
        });
      }, 6000);
    } else {
      setBroadcastDuration(0);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (viewerInterval) clearInterval(viewerInterval);
    };
  }, [isBroadcasting]);

  // Capture video frame to create a thumbnail
  const captureVideoSnapshot = (): string => {
    if (!videoRef.current) {
      return 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80';
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.85);
      }
    } catch (e) {
      // Fallback
    }
    return 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80';
  };

  // Start Live Broadcast
  const handleStartBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.streamer.trim() || !formData.title.trim()) {
      toast({ title: 'Completa el nombre y título para transmitir' });
      return;
    }

    const snapshot = captureVideoSnapshot();
    setCapturedThumbnail(snapshot);

    const newStreamData = {
      title: formData.title.trim(),
      streamer: formData.streamer.trim(),
      category: formData.category,
      description: formData.description.trim() || 'Transmisión en vivo desde el Estudio StreamFLIX',
      viewerCount: 1,
      tags: ['En Vivo', 'Estudio', 'WebRTC', formData.category],
      thumbnailUrl: snapshot,
      platform: 'Otro',
      isWebRTC: true,
      broadcastType: 'studio_webrtc',
      status: 'published',
      situation: 'live',
      startedAt: serverTimestamp(),
      ownerId: user?.uid || 'studio-host',
      featured: true,
    };

    let docId = 'live-' + Date.now();
    try {
      if (firestore) {
        const docRef = await addDoc(collection(firestore, 'streams'), newStreamData);
        docId = docRef.id;
        await updateDoc(docRef, { id: docRef.id });
      }
    } catch (err) {
      console.warn('Could not save to firestore, operating in local live studio:', err);
    }

    setBroadcastId(docId);
    setIsBroadcasting(true);
    toast({
      title: '🔴 ¡Estás Al Aire en StreamFLIX!',
      description: 'Tu transmisión WebRTC en vivo ya está disponible para todo el mundo.',
    });
  };

  // WebRTC Host Signaling Engine: Serves live camera/mic to any connected viewer
  useEffect(() => {
    if (!isBroadcasting || !broadcastId || !firestore) return;

    const viewersCol = collection(firestore, 'streams', broadcastId, 'webrtc_viewers');

    const unsubscribe = onSnapshot(viewersCol, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const viewerId = change.doc.id;
        const viewerData = change.doc.data();

        if (change.type === 'removed') {
          const entry = peerConnectionsRef.current.get(viewerId);
          if (entry) {
            if (entry.unsubCandidates) entry.unsubCandidates();
            entry.pc.close();
            peerConnectionsRef.current.delete(viewerId);
            setLiveViewers(Math.max(1, peerConnectionsRef.current.size));
          }
          return;
        }

        // Viewer submitted an offer and we haven't answered yet
        if (viewerData?.viewerOffer && !viewerData?.hostAnswer && !peerConnectionsRef.current.has(viewerId)) {
          try {
            const pc = new RTCPeerConnection(RTC_CONFIG);

            // Add broadcaster tracks from active stream
            if (streamRef.current) {
              streamRef.current.getTracks().forEach((track) => {
                pc.addTrack(track, streamRef.current!);
              });
            }

            // Send host ICE candidates
            const hostCandidatesCol = collection(
              firestore,
              'streams',
              broadcastId,
              'webrtc_viewers',
              viewerId,
              'host_candidates'
            );
            pc.onicecandidate = (event) => {
              if (event.candidate) {
                addDoc(hostCandidatesCol, event.candidate.toJSON()).catch(() => {});
              }
            };

            // Monitor state
            pc.onconnectionstatechange = () => {
              const state = pc.connectionState;
              if (state === 'disconnected' || state === 'failed' || state === 'closed') {
                const entry = peerConnectionsRef.current.get(viewerId);
                if (entry?.unsubCandidates) entry.unsubCandidates();
                pc.close();
                peerConnectionsRef.current.delete(viewerId);
                setLiveViewers(Math.max(1, peerConnectionsRef.current.size));
              } else if (state === 'connected') {
                setLiveViewers(Math.max(1, peerConnectionsRef.current.size));
              }
            };

            // Set remote offer
            await pc.setRemoteDescription(new RTCSessionDescription(viewerData.viewerOffer));

            // Create host answer
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            // Write host answer back to Firestore
            await updateDoc(doc(firestore, 'streams', broadcastId, 'webrtc_viewers', viewerId), {
              hostAnswer: {
                type: answer.type,
                sdp: answer.sdp,
              },
              answeredAt: serverTimestamp(),
            });

            // Listen for viewer candidates
            const viewerCandidatesCol = collection(
              firestore,
              'streams',
              broadcastId,
              'webrtc_viewers',
              viewerId,
              'viewer_candidates'
            );
            const unsubCandidates = onSnapshot(viewerCandidatesCol, (candSnap) => {
              candSnap.docChanges().forEach(async (candChange) => {
                if (candChange.type === 'added') {
                  try {
                    if (pc.remoteDescription) {
                      await pc.addIceCandidate(new RTCIceCandidate(candChange.doc.data()));
                    }
                  } catch (e) {}
                }
              });
            });

            peerConnectionsRef.current.set(viewerId, { pc, unsubCandidates });
            setLiveViewers(Math.max(1, peerConnectionsRef.current.size));
          } catch (err) {
            console.warn('Error connecting WebRTC peer for viewer:', viewerId, err);
          }
        }
      });
    });

    return () => {
      unsubscribe();
      peerConnectionsRef.current.forEach(({ pc, unsubCandidates }) => {
        if (unsubCandidates) unsubCandidates();
        pc.close();
      });
      peerConnectionsRef.current.clear();
    };
  }, [isBroadcasting, broadcastId, firestore]);

  // End Live Broadcast
  const handleStopBroadcast = async () => {
    peerConnectionsRef.current.forEach(({ pc, unsubCandidates }) => {
      if (unsubCandidates) unsubCandidates();
      pc.close();
    });
    peerConnectionsRef.current.clear();

    if (broadcastId && firestore) {
      try {
        await updateDoc(doc(firestore, 'streams', broadcastId), {
          situation: 'offline',
          lastOnlineAt: serverTimestamp(),
        });
      } catch (err) {}
    }
    setIsBroadcasting(false);
    toast({
      title: 'Transmisión Finalizada',
      description: `Transmitiste durante ${formatTime(broadcastDuration)} minutos con un pico de ${liveViewers} espectadores.`,
    });
  };

  // Format Duration seconds to HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Handle external channel submit
  const handleExternalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (firestore) {
        await addDoc(collection(firestore, 'streams'), {
          title: formData.title,
          streamer: formData.streamer,
          category: formData.category,
          platform: formData.platform,
          streamUrl: formData.channelOrVideoId,
          liveVideoId: formData.channelOrVideoId.includes('v=')
            ? formData.channelOrVideoId.split('v=')[1]?.substring(0, 11)
            : formData.channelOrVideoId,
          description: formData.description,
          thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
          status: 'published',
          viewerCount: 25,
          tags: [formData.category, formData.platform],
          startedAt: serverTimestamp(),
          ownerId: user?.uid || 'guest-streamer',
        });
      }
    } catch (err) {}
    setExternalSubmitted(true);
    toast({ title: '¡Canal enlazado con éxito en StreamFLIX!' });
  };

  // Handle Send Chat
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        user: formData.streamer || user?.displayName || 'Tú (Host)',
        text: newChatMessage.trim(),
        time: 'Ahora',
      },
    ]);
    setNewChatMessage('');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      <AppHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white mb-6 group transition-colors"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Volver a StreamFLIX
        </Link>

        {/* HEADER DEL ESTUDIO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-primary/20 border border-primary/40 text-primary shadow-[0_0_25px_rgba(255,0,0,0.3)]">
              <Radio className={`h-8 w-8 ${isBroadcasting ? 'animate-pulse text-red-500' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight">
                  Estudio de Transmisión
                </h1>
                {isBroadcasting && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-black text-[10px] uppercase tracking-widest animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                    <span className="w-2 h-2 rounded-full bg-white" /> EN VIVO
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mt-1">
                Transmite en directo con tu cámara y micrófono o enlaza tus canales de YouTube/Twitch
              </p>
            </div>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex bg-zinc-900/90 p-1.5 rounded-2xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'studio'
                  ? 'bg-primary text-white shadow-[0_0_20px_rgba(255,0,0,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" /> Cámara y Micrófono
            </button>
            <button
              onClick={() => setActiveTab('external')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'external'
                  ? 'bg-primary text-white shadow-[0_0_20px_rgba(255,0,0,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Share2 className="w-4 h-4" /> Enlazar YouTube / Twitch
            </button>
          </div>
        </div>

        {/* TAB 1: ESTUDIO EN VIVO CON CÁMARA Y MICRÓFONO */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LADO IZQUIERDO: PANTALLA DE VÍDEO Y CONTROLES */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              
              {/* MONITOR DE VIDEO */}
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl group flex items-center justify-center">
                
                {/* Video Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted // Always mute local preview to prevent audio screech
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isMediaReady && cameraEnabled ? 'opacity-100' : 'opacity-0 absolute'
                  }`}
                />

                {/* Camera Off / Waiting State */}
                {(!isMediaReady || !cameraEnabled) && (
                  <div className="flex flex-col items-center justify-center text-center p-8 z-10 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 shadow-inner">
                      {isMediaReady ? (
                        <VideoOff className="w-9 h-9 text-zinc-500" />
                      ) : (
                        <Camera className="w-9 h-9 text-primary animate-pulse" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase italic text-white tracking-wide">
                        {isMediaReady ? 'Cámara Desactivada' : 'Estudio de Transmisión Preparado'}
                      </h3>
                      <p className="text-zinc-400 text-xs max-w-sm mt-1">
                        {isMediaReady
                          ? 'Tu cámara está silenciada. Pulsa el botón de cámara para activarla.'
                          : 'Haz clic abajo en "Habilitar Cámara y Micrófono" para encender la vista previa.'}
                      </p>
                    </div>

                    {!isMediaReady && (
                      <button
                        onClick={() => startCamera(selectedVideoDevice, selectedAudioDevice)}
                        className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(255,0,0,0.4)] cursor-pointer active:scale-95 flex items-center gap-2"
                      >
                        <Video className="w-4 h-4" /> Habilitar Cámara y Micrófono
                      </button>
                    )}
                  </div>
                )}

                {/* OVERLAY HUD EN VIVO / VISTA PREVIA */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                  {isBroadcasting ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,0,0.6)] animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-white" /> AL AIRE
                      </div>
                      <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white font-mono text-[11px] font-bold">
                        {formatTime(broadcastDuration)}
                      </div>
                    </div>
                  ) : (
                    <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-zinc-300 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Vista Previa del Estudio
                    </div>
                  )}

                  {/* Info resolución y espectadores */}
                  <div className="flex items-center gap-2">
                    {isBroadcasting && (
                      <div className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase flex items-center gap-1.5">
                        <Users className="w-3 h-3 text-primary" /> {liveViewers} Viendo
                      </div>
                    )}
                    <div className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-zinc-400 text-[10px] font-mono">
                      1080p 60fps
                    </div>
                  </div>
                </div>

                {/* MEDIDOR DE AUDIO VU METER EN VIVO (Bottom HUD) */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                  <div className="flex items-center gap-3 bg-black/75 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl">
                    <div className="flex items-center gap-1">
                      {micEnabled ? (
                        <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <MicOff className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span className="text-[10px] font-black uppercase text-zinc-400">MIC:</span>
                    </div>

                    {/* Barras de volumen activas */}
                    <div className="flex items-center gap-1 w-24 sm:w-32 h-3 bg-white/10 rounded-full px-1 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-75 ${
                          audioLevel > 70
                            ? 'bg-red-500'
                            : audioLevel > 35
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                        style={{ width: micEnabled ? `${Math.max(4, audioLevel)}%` : '0%' }}
                      />
                    </div>
                  </div>

                  {isScreenSharing && (
                    <div className="bg-sky-500/20 border border-sky-400/40 text-sky-400 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl backdrop-blur-md flex items-center gap-1.5">
                      <Monitor className="w-3 h-3" /> Transmitiendo Pantalla
                    </div>
                  )}
                </div>
              </div>

              {/* BARRA DE CONTROLES RÁPIDOS */}
              <div className="bg-zinc-950 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  {/* Toggle Micrófono */}
                  <button
                    onClick={toggleMic}
                    disabled={!isMediaReady}
                    className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      micEnabled
                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40'
                        : 'bg-red-600/20 border-red-500/50 text-red-500 hover:bg-red-600/30'
                    }`}
                    title={micEnabled ? 'Silenciar Micrófono' : 'Activar Micrófono'}
                  >
                    {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  {/* Toggle Cámara */}
                  <button
                    onClick={toggleCamera}
                    disabled={!isMediaReady}
                    className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                      cameraEnabled
                        ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40'
                        : 'bg-red-600/20 border-red-500/50 text-red-500 hover:bg-red-600/30'
                    }`}
                    title={cameraEnabled ? 'Apagar Cámara' : 'Encender Cámara'}
                  >
                    {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>

                  {/* Toggle Compartir Pantalla */}
                  <button
                    onClick={toggleScreenShare}
                    disabled={!isMediaReady}
                    className={`h-12 px-4 rounded-xl border flex items-center gap-2 transition-all cursor-pointer text-xs font-black uppercase tracking-wider ${
                      isScreenSharing
                        ? 'bg-sky-500 text-white border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span className="hidden sm:inline">{isScreenSharing ? 'Detener Pantalla' : 'Compartir Pantalla'}</span>
                  </button>
                </div>

                {/* Dispositivos y Reconectar */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startCamera(selectedVideoDevice, selectedAudioDevice)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer text-xs flex items-center gap-1.5"
                    title="Reiniciar Cámara / Micrófono"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline font-bold">Reiniciar</span>
                  </button>
                </div>
              </div>

              {/* SELECTORES DE DISPOSITIVOS */}
              {isMediaReady && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/60 border border-white/5 rounded-2xl p-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                      Cámara Web
                    </label>
                    <select
                      value={selectedVideoDevice}
                      onChange={(e) => {
                        setSelectedVideoDevice(e.target.value);
                        startCamera(e.target.value, selectedAudioDevice);
                      }}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-primary"
                    >
                      {videoDevices.map((dev, i) => (
                        <option key={dev.deviceId || i} value={dev.deviceId}>
                          {dev.label || `Cámara ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                      Micrófono de Entrada
                    </label>
                    <select
                      value={selectedAudioDevice}
                      onChange={(e) => {
                        setSelectedAudioDevice(e.target.value);
                        startCamera(selectedVideoDevice, e.target.value);
                      }}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-primary"
                    >
                      {audioDevices.map((dev, i) => (
                        <option key={dev.deviceId || i} value={dev.deviceId}>
                          {dev.label || `Micrófono ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* ALERTA DE PERMISOS */}
              {mediaError && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
                  <div className="space-y-1">
                    <strong className="block font-bold">Permiso de Dispositivos Requerido</strong>
                    <span>{mediaError}</span>
                  </div>
                </div>
              )}
            </div>

            {/* LADO DERECHO: FORMULARIO Y CONTROL ROOM */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              
              {/* PANEL DE CONTROL DE EMISIÓN */}
              <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
                
                <div>
                  <h3 className="text-lg font-black uppercase italic tracking-tight text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-primary" /> Datos de la Transmisión
                  </h3>
                  <p className="text-zinc-400 text-xs mt-1">
                    Configura la información que se mostrará en la cartelera de StreamFLIX.
                  </p>
                </div>

                {!isBroadcasting ? (
                  <form onSubmit={handleStartBroadcast} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                        Nombre del Canal / Host
                      </label>
                      <input
                        required
                        value={formData.streamer}
                        onChange={(e) => setFormData({ ...formData, streamer: e.target.value })}
                        placeholder="Ej: Nacho en Vivo o MiCanal"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary placeholder-zinc-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                        Título de la Transmisión
                      </label>
                      <input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ej: Charlando con la comunidad en directo"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary placeholder-zinc-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                        Categoría
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="Streaming">Streaming</option>
                        <option value="TV Noticias">TV Noticias</option>
                        <option value="TV Abierta">TV Abierta</option>
                        <option value="Deportes">Deportes</option>
                        <option value="Radio">Radio</option>
                        <option value="Streamers">Streamers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                        Descripción (Opcional)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Breve reseña sobre lo que vas a transmitir hoy..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-primary placeholder-zinc-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.5)] transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-95 text-xs sm:text-sm"
                    >
                      <Radio className="h-5 w-5 animate-pulse" /> INICIAR TRANSMISIÓN EN VIVO
                    </button>
                  </form>
                ) : (
                  /* ESTADO EN VIVO ACTIVO */
                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-red-600/10 border border-red-600/30 text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-red-500 font-black uppercase tracking-widest text-xs animate-pulse">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> SEÑAL AL AIRE
                      </div>
                      <h4 className="text-lg font-black text-white">{formData.title}</h4>
                      <p className="text-zinc-400 text-xs">Por {formData.streamer} • {formData.category}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                        <span className="text-[10px] font-black uppercase text-zinc-400 block">Tiempo al aire</span>
                        <span className="text-lg font-black font-mono text-white">{formatTime(broadcastDuration)}</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                        <span className="text-[10px] font-black uppercase text-zinc-400 block">Audiencia</span>
                        <span className="text-lg font-black font-mono text-emerald-400">{liveViewers} Viendo</span>
                      </div>
                    </div>

                    {/* Copiar Link */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                        Enlace para compartir:
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          readOnly
                          value={typeof window !== 'undefined' ? `${window.location.origin}/stream/${broadcastId}` : ''}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 font-mono focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (typeof window !== 'undefined') {
                              navigator.clipboard.writeText(`${window.location.origin}/stream/${broadcastId}`);
                              toast({ title: '¡Enlace copiado al portapapeles!' });
                            }
                          }}
                          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all cursor-pointer"
                          title="Copiar Link"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Ver en reproductor */}
                    {broadcastId && (
                      <Link
                        href={`/stream/${broadcastId}`}
                        target="_blank"
                        className="w-full h-11 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 text-xs border border-white/10"
                      >
                        <Video className="w-4 h-4" /> Abrir reproductor en pestaña nueva
                      </Link>
                    )}

                    {/* Botón Finalizar */}
                    <button
                      onClick={handleStopBroadcast}
                      className="w-full h-13 bg-zinc-800 hover:bg-red-950 hover:text-red-400 border border-red-500/40 text-white font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-95"
                    >
                      FINALIZAR TRANSMISIÓN
                    </button>
                  </div>
                )}
              </div>

              {/* CHAT DEL ESTUDIO EN TIEMPO REAL */}
              {isBroadcasting && (
                <div className="bg-zinc-950 border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col h-72">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-primary" /> Chat de la Transmisión
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">En Vivo</span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className="bg-white/[0.03] p-2 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <strong className="text-primary font-black">{msg.user}</strong>
                          <span className="text-zinc-500">{msg.time}</span>
                        </div>
                        <p className="text-zinc-300 text-xs">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChat} className="mt-3 flex items-center gap-2">
                    <input
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      placeholder="Escribe en el chat en vivo..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="p-2.5 rounded-xl bg-primary hover:bg-primary/80 text-white transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: ENLAZAR CANAL EXTERNO (YouTube / Twitch / Kick) */}
        {activeTab === 'external' && (
          <div className="max-w-3xl mx-auto bg-zinc-950 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            {externalSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto" />
                <h2 className="text-2xl font-black uppercase italic">¡Canal Enlazado Correctamente!</h2>
                <p className="text-zinc-400 text-sm max-w-md mx-auto">
                  Tu señal externa se ha registrado en StreamFLIX. Ya se encuentra publicada en la cartelera principal.
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => setExternalSubmitted(false)}
                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-xs rounded-full border border-white/10 transition-colors"
                  >
                    Transmitir Otro Canal
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-black uppercase text-xs rounded-full transition-colors"
                  >
                    Ver en Portada
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExternalSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-black uppercase italic text-white mb-1">
                    Enlazar Transmisión Externa
                  </h3>
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-6">
                    Publica transmisiones de YouTube Live, canales de Twitch o directos de Kick
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                      Nombre del Canal / Streamer
                    </label>
                    <input
                      required
                      value={formData.streamer}
                      onChange={(e) => setFormData({ ...formData, streamer: e.target.value })}
                      placeholder="Ej: LUZU TV o MiCanal"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary placeholder-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                      Título de la Transmisión
                    </label>
                    <input
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ej: Programa Especial en Directo"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary placeholder-zinc-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="Streaming">Streaming</option>
                      <option value="TV Noticias">TV Noticias</option>
                      <option value="TV Abierta">TV Abierta</option>
                      <option value="Deportes">Deportes</option>
                      <option value="Radio">Radio</option>
                      <option value="Streamers">Streamers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                      Plataforma de Origen
                    </label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="YouTube">YouTube</option>
                      <option value="Twitch">Twitch</option>
                      <option value="Kick">Kick</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                    ID o Enlace del Video / Canal en Vivo
                  </label>
                  <input
                    required
                    value={formData.channelOrVideoId}
                    onChange={(e) => setFormData({ ...formData, channelOrVideoId: e.target.value })}
                    placeholder="Ej: https://www.youtube.com/watch?v=... o nombre de canal en Twitch"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary placeholder-zinc-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Información sobre tu transmisión, panelistas, redes sociales..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary placeholder-zinc-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_10px_30px_rgba(255,0,0,0.3)] transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-95"
                >
                  <Radio className="h-5 w-5 animate-pulse" /> Publicar Canal en Vivo
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

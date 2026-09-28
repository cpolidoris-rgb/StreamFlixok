'use client';

import type { Stream } from '@/lib/data';
import { useMemo, useState } from 'react';
import { Radio, MonitorOff, Zap, Loader2 } from 'lucide-react';
import Image from 'next/image';
import WebRTCPlayer from './webrtc-player';
import { findMasterChannel, cleanLiveVideoId } from '@/lib/stream-catalog';

interface StreamPlayerProps {
  stream: Stream;
  isLive?: boolean;
  liveVideoId?: string;
  apiStatus?: 'live' | 'offline' | 'loading' | 'error' | 'unknown';
  muted?: boolean;
}

/**
 * MOTOR DE REPRODUCCIÓN PROFESIONAL (ALTA DISPONIBILIDAD)
 * Reproduce la transmisión en vivo activa verificada.
 * Si el canal está fuera de aire o no transmite en directo, muestra la placa oficial sin emitir programas viejos grabados.
 */
export default function StreamPlayer({ 
  stream, 
  liveVideoId: discoveredVideoId, 
  isLive = true, 
  apiStatus = 'live',
  muted = false // Audio habilitado por defecto
}: StreamPlayerProps) {
  const platform = (stream.platform || 'YouTube').toLowerCase();
  const RED_FILTER = { filter: 'invert(18%) sepia(100%) saturate(7413%) hue-rotate(359deg) brightness(101%) contrast(120%)' };

  const embedUrl = useMemo(() => {
    if (!stream) return null;
    
    const isMutedParam = muted ? '1' : '0';
    const isMutedBool = muted ? 'true' : 'false';

    if (platform === 'youtube') {
      // Si el estado es explícitamente offline o el canal no está en vivo, no cargar videos viejos
      if (apiStatus === 'offline' || isLive === false) {
        // Solo reproducir si hay un video en vivo descubierto explícitamente en este momento
        if (!discoveredVideoId) {
          return null;
        }
      }

      let videoIdToUse = '';

      // PRIORIDAD 1: Video en vivo descubierto en tiempo real
      if (discoveredVideoId && cleanLiveVideoId(discoveredVideoId)) {
        videoIdToUse = cleanLiveVideoId(discoveredVideoId);
      } 
      // PRIORIDAD 2: Video ID en vivo válido y limpio del stream (solo si el canal está activo)
      else if (isLive && stream.liveVideoId && cleanLiveVideoId(stream.liveVideoId)) {
        videoIdToUse = cleanLiveVideoId(stream.liveVideoId);
      } 
      // PRIORIDAD 3: URL con v= limpio (solo si el canal está activo)
      else if (isLive && stream.streamUrl?.includes('v=')) {
        const match = stream.streamUrl.match(/v=([a-zA-Z0-9_-]{11})/);
        if (match && cleanLiveVideoId(match[1])) {
          videoIdToUse = cleanLiveVideoId(match[1]);
        }
      }

      // Si tenemos un video ID en vivo legítimo, emitir en alta definición
      if (videoIdToUse) {
        return `https://www.youtube.com/embed/${videoIdToUse}?autoplay=1&mute=${isMutedParam}&rel=0&showinfo=0&modestbranding=1&enablejsapi=1`;
      }

      // PRIORIDAD 4: Si no hay video ID específico pero el canal está en vivo y tiene channelId (UC...):
      // YouTube live_stream reproduce la emisión en vivo directa del canal
      const master = findMasterChannel(stream);
      const chId = stream.platformChannelId || master?.platformChannelId;
      if (isLive && chId && chId.startsWith('UC') && apiStatus !== 'offline') {
        return `https://www.youtube.com/embed/live_stream?channel=${chId}&autoplay=1&mute=${isMutedParam}&rel=0&enablejsapi=1`;
      }

      return null;
    }

    if (platform === 'twitch') {
      const channel = stream.platformChannelId || stream.streamer.replace(/\s+/g, '');
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      return `https://player.twitch.tv/?channel=${channel}&parent=${hostname}&autoplay=true&muted=${isMutedBool}`;
    }

    if (platform === 'kick') {
      const channel = stream.platformChannelId || stream.streamer.replace(/\s+/g, '');
      return `https://player.kick.com/${channel}?autoplay=true&muted=${isMutedBool}`;
    }

    if (stream.streamUrl && (stream.streamUrl.endsWith('.mp4') || stream.streamUrl.startsWith('http'))) {
      return stream.streamUrl;
    }

    return null;
  }, [stream, discoveredVideoId, isLive, apiStatus, platform, muted]);

  // ESTADO 1: CARGANDO (Solo si no tenemos una URL que cargar todavía)
  if (apiStatus === 'loading' && !embedUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-950 text-center p-8 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="bg-primary/5 p-8 rounded-full mb-6 ring-1 ring-primary/20">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2 italic">
          Sincronizando señal en vivo...
        </h3>
        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em]">
          Estableciendo conexión con {stream.streamer}
        </p>
      </div>
    );
  }

  // ESTADO 2: FUERA DE AIRE (PLACA STREAMFLIX - NUNCA PROGRAMAS VIEJOS)
  const showOfflinePlate = (apiStatus === 'offline' || !isLive || !embedUrl);

  if (showOfflinePlate) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-black text-center p-8 rounded-2xl border border-white/10 relative overflow-hidden group shadow-2xl">
        {stream.thumbnailUrl && (
            <div className="absolute inset-0 z-0 opacity-20 grayscale blur-3xl scale-110">
                <Image src={stream.thumbnailUrl} alt="" fill className="object-cover" unoptimized />
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 z-[1]" />
        
        <div className="relative z-10 flex flex-col items-center gap-8">
            <Image 
                src="https://inforosario.com/logostream.png" 
                alt="StreamFLIX" 
                width={320} 
                height={84} 
                style={RED_FILTER}
                className="w-[180px] h-auto drop-shadow-[0_0_15px_rgba(255,0,0,0.4)] animate-in fade-in zoom-in duration-700"
            />
            
            <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-white/40">
                    <div className="h-[1px] w-8 bg-white/20" />
                    <MonitorOff className="h-4 w-4" />
                    <div className="h-[1px] w-8 bg-white/20" />
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                    FUERA DE AIRE
                </h3>
                <p className="text-primary font-black text-xs md:text-base uppercase tracking-[0.3em]">
                    {stream.streamer}
                </p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-md px-6 py-2 rounded-full">
                <p className="text-white/60 text-[9px] md:text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                    Señal en mantenimiento o pausada
                </p>
            </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20" />
      </div>
    );
  }

  // ESTADO 2.5: EMISIÓN WEBRTC EN DIRECTO DESDE EL ESTUDIO
  const isWebRTC = stream.isWebRTC || platform === 'webrtc' || stream.broadcastType === 'studio_webrtc';
  if (isWebRTC) {
    return <WebRTCPlayer stream={stream} streamId={stream.id} muted={muted} />;
  }

  // ESTADO 3: EN VIVO (VIDEO DIRECTO O IFRAME)
  const isDirectVideo = embedUrl?.endsWith('.mp4') || (embedUrl?.startsWith('http') && !embedUrl.includes('youtube.com') && !embedUrl.includes('twitch.tv') && !embedUrl.includes('kick.com'));

  return (
    <div className="relative h-full w-full bg-black group/player">
      {isDirectVideo ? (
        <video
          key={embedUrl}
          src={embedUrl}
          autoPlay
          controls
          playsInline
          className="w-full h-full object-contain bg-black shadow-2xl"
        />
      ) : (
        <iframe
          key={embedUrl}
          src={embedUrl}
          width="100%"
          height="100%"
          allowFullScreen={true}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="no-referrer-when-downgrade"
          className="border-0 bg-black w-full h-full shadow-2xl"
          title={`${stream.streamer} Live Player`}
        />
      )}
    </div>
  );
}

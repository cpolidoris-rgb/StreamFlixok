'use client';

import type { Stream } from '@/lib/data';
import { useMemo, useState } from 'react';
import { Radio, MonitorOff, Zap, Loader2, ExternalLink, RefreshCw, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import WebRTCPlayer from './webrtc-player';
import { findMasterChannel, cleanLiveVideoId } from '@/lib/stream-catalog';

interface StreamPlayerProps {
  stream: Stream;
  isLive?: boolean;
  liveVideoId?: string;
  apiStatus?: 'live' | 'offline' | 'loading' | 'error' | 'unknown';
  muted?: boolean;
  onRetry?: () => void;
}

/**
 * MOTOR DE REPRODUCCIÓN STREAMFLIX (ALTA DISPONIBILIDAD)
 * - Emite únicamente señales en vivo verificadas y activas.
 * - Elimina por completo URLs obsoletas que producen "Video no disponible".
 * - Si el canal está fuera de aire, muestra la placa oficial con accesos a la grilla y canal de YouTube.
 */
export default function StreamPlayer({ 
  stream, 
  liveVideoId: discoveredVideoId, 
  isLive = true, 
  apiStatus = 'live',
  muted = false,
  onRetry
}: StreamPlayerProps) {
  const platform = (stream.platform || 'YouTube').toLowerCase();
  const RED_FILTER = { filter: 'invert(18%) sepia(100%) saturate(7413%) hue-rotate(359deg) brightness(101%) contrast(120%)' };

  // Obtener enlace directo a YouTube o a su canal y datos maestros
  const master = useMemo(() => findMasterChannel(stream), [stream]);

  const embedUrl = useMemo(() => {
    if (!stream) return null;
    
    const isMutedParam = muted ? '1' : '0';
    const isMutedBool = muted ? 'true' : 'false';

    if (platform === 'youtube') {
      let videoIdToUse = '';

      // PRIORIDAD 1: Video en vivo descubierto en tiempo real
      if (discoveredVideoId && cleanLiveVideoId(discoveredVideoId)) {
        videoIdToUse = cleanLiveVideoId(discoveredVideoId);
      } 
      // PRIORIDAD 2: Video ID en vivo válido del stream
      else if (stream.liveVideoId && cleanLiveVideoId(stream.liveVideoId)) {
        videoIdToUse = cleanLiveVideoId(stream.liveVideoId);
      } 
      // PRIORIDAD 3: Video ID verificado del catálogo maestro
      else if (master?.liveVideoId && cleanLiveVideoId(master.liveVideoId)) {
        videoIdToUse = cleanLiveVideoId(master.liveVideoId);
      }
      // PRIORIDAD 4: URL con parámetro v= limpio
      else if (stream.streamUrl?.includes('v=')) {
        const match = stream.streamUrl.match(/v=([a-zA-Z0-9_-]{11})/);
        if (match && cleanLiveVideoId(match[1])) {
          videoIdToUse = cleanLiveVideoId(match[1]);
        }
      }

      // Si tenemos un video ID en vivo verificado, reproducir en YouTube
      if (videoIdToUse) {
        return `https://www.youtube.com/embed/${videoIdToUse}?autoplay=1&mute=${isMutedParam}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
      }

      // NUNCA usar embed/live_stream?channel=... (Deprecado por YouTube: produce error "Video no disponible")
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
  }, [stream, master, discoveredVideoId, isLive, apiStatus, platform, muted]);

  const channelYoutubeUrl = useMemo(() => {
    if (stream.streamUrl && stream.streamUrl.includes('youtube.com')) {
      return stream.streamUrl;
    }
    if (master?.streamUrl) {
      return master.streamUrl;
    }
    const cleanStreamer = stream.streamer.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `https://www.youtube.com/@${cleanStreamer}`;
  }, [stream, master]);

  // ESTADO 1: CARGANDO (Sincronizando señal en vivo solo si aún no hay video para reproducir)
  if (apiStatus === 'loading' && !embedUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-950 text-center p-8 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="bg-primary/5 p-8 rounded-full mb-6 ring-1 ring-primary/20 animate-pulse">
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

  // ESTADO 2: FUERA DE AIRE (SOLO si NO hay embedUrl disponible)
  const showOfflinePlate = !embedUrl && (apiStatus === 'offline' || !isLive);

  if (showOfflinePlate) {
    const logoUrl = stream.thumbnailUrl || (stream as any).thumbnail || (stream as any).coverUrl || master?.thumbnailUrl;
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-black text-center p-6 md:p-8 rounded-2xl border border-white/10 relative overflow-hidden group shadow-2xl">
        {logoUrl && (
          <div className="absolute inset-0 z-0 opacity-20 grayscale blur-3xl scale-125">
            <Image src={logoUrl} alt="" fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60 z-[1]" />
        
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg mx-auto">
          {logoUrl ? (
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border border-white/20 bg-zinc-900/90 shadow-[0_0_30px_rgba(255,255,255,0.1)] p-2 flex items-center justify-center">
              <Image 
                src={logoUrl} 
                alt={stream.streamer} 
                width={128} 
                height={128} 
                className="object-contain w-full h-full"
                unoptimized 
              />
            </div>
          ) : (
            <Image 
              src="https://inforosario.com/logostream.png" 
              alt="StreamFLIX" 
              width={220} 
              height={58} 
              style={RED_FILTER}
              className="w-[160px] h-auto drop-shadow-[0_0_15px_rgba(255,0,0,0.4)]"
            />
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-white/40">
              <div className="h-[1px] w-8 bg-white/20" />
              <MonitorOff className="h-4 w-4 text-primary" />
              <div className="h-[1px] w-8 bg-white/20" />
            </div>
            <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic leading-none">
              SEÑAL FUERA DE AIRE
            </h3>
            <p className="text-primary font-black text-xs md:text-sm uppercase tracking-[0.25em]">
              {stream.streamer}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md px-5 py-2 rounded-full">
            <p className="text-white/70 text-[10px] md:text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
              Canal pausado • Sin transmisión en directo ahora
            </p>
          </div>

          {/* ACCIONES RÁPIDAS PARA EL USUARIO */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link 
              href="/schedule"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/15 shadow-lg"
            >
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              Ver Grilla de Horarios
            </Link>

            <a 
              href={channelYoutubeUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-600/30"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Canal en YouTube
            </a>

            {onRetry && (
              <button 
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-all border border-white/10"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reintentar Señal
              </button>
            )}
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

  // ESTADO 3: EN VIVO (VIDEO DIRECTO O IFRAME DE ALTA DEFINICIÓN)
  const isDirectVideo = embedUrl?.endsWith('.mp4') || (embedUrl?.startsWith('http') && !embedUrl.includes('youtube.com') && !embedUrl.includes('twitch.tv') && !embedUrl.includes('kick.com'));

  return (
    <div className="relative h-full w-full bg-black group/player">
      {isDirectVideo ? (
        <video
          key={embedUrl || 'direct-video'}
          src={embedUrl || undefined}
          autoPlay
          controls
          playsInline
          className="w-full h-full object-contain bg-black shadow-2xl"
        />
      ) : (
        <iframe
          key={embedUrl || 'live-iframe'}
          src={embedUrl || undefined}
          width="100%"
          height="100%"
          allowFullScreen={true}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="border-0 bg-black w-full h-full shadow-2xl"
          title={`${stream.streamer} Live Player`}
        />
      )}

      {/* BOTÓN DISCRETO FLOTANTE PARA ABRIR EN YOUTUBE DIRECTO */}
      {platform === 'youtube' && (
        <a 
          href={channelYoutubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir en YouTube oficial"
          className="absolute top-3 right-3 z-30 opacity-0 group-hover/player:opacity-100 transition-opacity duration-300 bg-black/70 hover:bg-black/95 text-white/80 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/15 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xl"
        >
          <ExternalLink className="h-3 w-3 text-red-500" />
          <span>YouTube</span>
        </a>
      )}
    </div>
  );
}

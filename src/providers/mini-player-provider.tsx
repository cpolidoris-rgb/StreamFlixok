'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Stream } from '@/lib/data';
import Link from 'next/link';
import { X, Maximize2, Volume2, VolumeX, Radio } from 'lucide-react';
import StreamPlayer from '@/components/stream-player';
import { usePathname } from '@/shims/next-navigation';

interface MiniPlayerContextType {
  activeStream: Stream | null;
  addMiniStream: (stream: Stream) => void;
  closeMiniStream: () => void;
}

const MiniPlayerContext = createContext<MiniPlayerContextType>({
  activeStream: null,
  addMiniStream: () => {},
  closeMiniStream: () => {},
});

export function MiniPlayerProvider({ children }: { children: React.ReactNode }) {
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const pathname = usePathname();

  const addMiniStream = useCallback((stream: Stream) => {
    setActiveStream(stream);
  }, []);

  const closeMiniStream = useCallback(() => {
    setActiveStream(null);
  }, []);

  // Si estamos en la página del canal activo, no debemos mostrar el mini reproductor
  const isViewingSameStream = Boolean(
    activeStream && pathname.startsWith(`/stream/${activeStream.id}`)
  );

  useEffect(() => {
    if (isViewingSameStream) {
      setActiveStream(null);
    }
  }, [isViewingSameStream]);

  return (
    <MiniPlayerContext.Provider value={{ activeStream, addMiniStream, closeMiniStream }}>
      {children}
      {activeStream && !isViewingSameStream && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-white/20 bg-zinc-950/95 backdrop-blur-2xl p-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-6 duration-300">
          {/* Header del Mini Reproductor */}
          <div className="flex items-center justify-between px-2 pb-2">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-600/90 text-white font-black text-[9px] uppercase tracking-widest animate-pulse shrink-0">
                <Radio className="w-2.5 h-2.5" /> VIVO
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-white truncate">
                {activeStream.streamer || activeStream.title}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-red-400" />
                ) : (
                  <Volume2 className="h-4 w-4 text-emerald-400" />
                )}
              </button>

              <Link
                href={`/stream/${activeStream.id}`}
                onClick={closeMiniStream}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Ver en pantalla completa"
              >
                <Maximize2 className="h-4 w-4" />
              </Link>

              <button
                onClick={closeMiniStream}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Cerrar minipantalla"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Reproductor Activo en Directo (Transmisión continua sin cortes) */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-white/10 shadow-inner">
            <StreamPlayer
              stream={activeStream}
              isLive={true}
              apiStatus="live"
              muted={isMuted}
            />
          </div>
        </div>
      )}
    </MiniPlayerContext.Provider>
  );
}

export function useMiniPlayer() {
  return useContext(MiniPlayerContext);
}

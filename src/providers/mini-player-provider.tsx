import React, { createContext, useContext, useState } from 'react';
import type { Stream } from '@/lib/data';
import Link from 'next/link';
import { X, Maximize2 } from 'lucide-react';

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

  const addMiniStream = (stream: Stream) => {
    setActiveStream(stream);
  };

  const closeMiniStream = () => {
    setActiveStream(null);
  };

  return (
    <MiniPlayerContext.Provider value={{ activeStream, addMiniStream, closeMiniStream }}>
      {children}
      {activeStream && (
        <div className="fixed bottom-6 right-6 z-40 w-72 rounded-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl p-3 shadow-2xl animate-in slide-in-from-bottom-6">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary truncate max-w-[180px]">
              {activeStream.streamer}
            </span>
            <div className="flex items-center gap-1">
              <Link href={`/stream/${activeStream.id}`} className="text-zinc-400 hover:text-white p-1">
                <Maximize2 className="h-3.5 w-3.5" />
              </Link>
              <button onClick={closeMiniStream} className="text-zinc-400 hover:text-white p-1">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
            <img src={activeStream.thumbnailUrl} alt={activeStream.title} className="h-full w-full object-cover" />
          </div>
        </div>
      )}
    </MiniPlayerContext.Provider>
  );
}

export function useMiniPlayer() {
  return useContext(MiniPlayerContext);
}

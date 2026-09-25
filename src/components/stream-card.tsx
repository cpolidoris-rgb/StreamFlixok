'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Stream, UserProfile } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Star, Play, Radio } from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { cn } from '@/lib/utils';

import { enrichStream, isStreamLive } from '@/lib/stream-catalog';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80';

export default function StreamCard({ stream: rawStream, rank }: { stream: Stream; rank?: number }) {
  const stream = enrichStream(rawStream);
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const isFavorite = !!userProfile?.favorites?.includes(stream.id);
  const thumbUrl = stream.thumbnailUrl || (stream as any).thumbnail || (stream as any).coverUrl || (stream as any).imageUrl || (stream as any).image || (stream as any).posterUrl || FALLBACK_IMAGE;

  // Determinar con certeza si el canal está dando señal en vivo
  const isCurrentlyLive = isStreamLive(stream);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || !userProfileRef) return;
    try {
      if (isFavorite) {
        await updateDoc(userProfileRef, { favorites: arrayRemove(stream.id) });
      } else {
        await updateDoc(userProfileRef, { favorites: arrayUnion(stream.id) });
      }
    } catch (error) {}
  };

  return (
    <div className="relative group transition-all duration-700 perspective-1000 w-full">
      {/* NÚMERO DE RANKING (EFECTO ASOMANDO DETRÁS DE LA TARJETA) */}
      {rank && (
          <div className="absolute -left-3 sm:-left-5 md:-left-6 bottom-[-10px] md:bottom-[-18px] z-0 pointer-events-none select-none flex items-center">
              <span 
                className="text-[110px] sm:text-[140px] md:text-[160px] font-black leading-none italic select-none tracking-tighter opacity-80 transition-all duration-500 group-hover:scale-105" 
                style={{ 
                    WebkitTextStroke: '3.5px rgba(255, 255, 255, 0.45)',
                    color: '#09090b',
                    textShadow: '0 0 35px rgba(0, 0, 0, 0.9)',
                }}
              >
                  {rank}
              </span>
          </div>
      )}
      
      <Card className={cn(
        "transition-all duration-500 border border-white/10 bg-zinc-950 hover:bg-zinc-900 hover:scale-[1.04] overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10 w-full",
        "hover:ring-2 hover:ring-primary/40 hover:shadow-[0_0_40px_rgba(229,9,20,0.25)]", 
        rank ? "ml-4 sm:ml-5 md:ml-6" : ""
      )}>
        <CardContent className="p-0 flex flex-col h-full">
          <Link href={`/stream/${stream.id}`} className="block relative w-full aspect-[16/9] min-h-[150px] bg-zinc-950 overflow-hidden">
            <Image 
              src={thumbUrl} 
              alt={stream.title} 
              fill 
              className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110 ease-out" 
              unoptimized 
            />
            
            {/* OVERLAY DE REPRODUCCIÓN PREMIUM */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[1px]">
                <div className="bg-primary/20 p-5 rounded-full backdrop-blur-2xl border border-primary/40 shadow-[0_0_30px_rgba(255,0,0,0.5)] transform scale-50 group-hover:scale-100 transition-all duration-500">
                  <Play className="h-8 w-8 text-white fill-white" />
                </div>
            </div>

            {/* BADGE VIVO - SOLO SI EL CANAL ESTÁ DANDO SEÑAL EN ESTE MOMENTO */}
            {isCurrentlyLive && (
              <div className="absolute top-3 left-3 z-20">
                  <div className="flex items-center bg-red-600/90 text-white font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded shadow-xl animate-pulse">
                      <Radio className="h-3 w-3 mr-1.5" />
                      VIVO
                  </div>
              </div>
            )}

            <button 
              className="absolute top-3 right-3 h-8 w-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-primary transition-all z-30 backdrop-blur-md border border-white/10 shadow-xl" 
              onClick={handleToggleFavorite}
            >
              <Star className={`h-3.5 w-3.5 ${isFavorite ? "fill-white text-white" : "text-white opacity-70 group-hover:opacity-100"}`} />
            </button>
            
            {/* GENTE CONECTADA VIENDO - SOLO PARA CANALES QUE ESTÁN EN VIVO EN ESE MOMENTO */}
            {isCurrentlyLive && (
              <div className="absolute bottom-3 left-3 flex items-center bg-black/90 backdrop-blur-xl px-2.5 py-1 rounded-md text-[9px] font-black text-white z-10 border border-white/5 shadow-2xl">
                  <Users className="h-2.5 w-2.5 mr-1.5 text-primary fill-primary" />
                  <span>{stream.viewerCount ? new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(stream.viewerCount) : 'LIVE'}</span>
              </div>
            )}
          </Link>

          <div className="p-4 flex flex-col gap-1 bg-gradient-to-b from-transparent to-black/30">
            <h3 className="font-black text-xs md:text-sm uppercase italic tracking-tighter truncate leading-tight group-hover:text-primary transition-colors">
              {stream.streamer}
            </h3>
            <p className="text-[8px] text-zinc-500 uppercase font-black tracking-[0.2em] truncate opacity-50">
                {stream.category}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

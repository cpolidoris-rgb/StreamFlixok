'use client';

import AppHeader from '@/components/app-header';
import StreamCard from '@/components/stream-card';
import { useMemo, useState, Suspense } from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Stream, UserProfile } from '@/lib/data';
import { collection, doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase/auth/use-user';
import { useDoc } from '@/firebase/firestore/use-doc';
import { TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import HeroBanner from '@/components/hero-banner';
import { enrichStream } from '@/lib/stream-catalog';

const CATEGORIES = ['Streaming', 'TV Noticias', 'TV Abierta', 'Deportes', 'Radio', 'Streamers'];

export function HomeContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const firestore = useFirestore();
  const { user } = useUser();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const channelsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'streams') : null),
    [firestore]
  );
  const { data: allRawStreams, isLoading } = useCollection<Stream>(channelsQuery);

  const streams = useMemo(() => {
    if (!allRawStreams) return [];
    
    const isMaster = user?.uid === 'G4rbqD6D90PJPcjoAWnW2df77q13' ||
                     user?.uid === 'L3Y6K9bZ9FhoonRg7ngIZ2UNiR03' || 
                     user?.uid === 'Rw19F9vriieRerNDgHkMKX2MDwA3' ||
                     userProfile?.isAdmin === true || 
                     user?.email === 'cpolidoris2@gmail.com' ||
                     user?.email === 'cpolidoris@gmail.com';
                     
    if (isMaster) return allRawStreams.filter(Boolean).map(enrichStream);
    
    // Show all streams that are published or do not have a rejected status
    return allRawStreams.filter(s => s && s.status !== 'rejected').map(enrichStream);
  }, [allRawStreams, user?.uid, userProfile?.isAdmin, user?.email]);

  const dynamicCategories = useMemo(() => {
    const streamCats = Array.from(new Set(streams.map(s => s.category).filter(Boolean) as string[]));
    const ordered = [...CATEGORIES];
    for (const c of streamCats) {
      if (!ordered.includes(c)) {
        ordered.push(c);
      }
    }
    return ordered;
  }, [streams]);

  const uncategorizedStreams = useMemo(() => {
    return streams.filter(s => !s.category);
  }, [streams]);

  const featuredStreams = useMemo(() => {
    return streams.filter(s => s.featured).slice(0, 5);
  }, [streams]);

  const filteredStreams = useMemo(() => {
    if (!searchQuery) return streams;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return streams.filter(s => 
      s.streamer.toLowerCase().includes(lowerCaseQuery) || 
      s.title.toLowerCase().includes(lowerCaseQuery)
    );
  }, [streams, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-black text-foreground">
      <AppHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="flex-1 pb-32 pt-28">
        {!searchQuery && <HeroBanner />}

        {/* CONTENEDOR PRINCIPAL */}
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 mt-12 space-y-16 animate-in fade-in slide-in-from-bottom-2 duration-1000">
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="aspect-video w-full rounded-2xl bg-white/5" />)}
            </div>
          ) : searchQuery ? (
            <section className="animate-in fade-in zoom-in-95 duration-500">
              <h2 className="text-3xl font-bold font-headline uppercase italic tracking-tighter mb-10 border-l-4 border-primary pl-6">
                Resultados para "{searchQuery}"
              </h2>
              {filteredStreams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                  {filteredStreams.map((stream) => <StreamCard key={stream.id} stream={stream} />)}
                </div>
              ) : (
                <div className="text-center py-24 border border-dashed rounded-[40px] bg-white/[0.02] border-white/10 flex flex-col items-center gap-8 shadow-inner">
                  <AlertTriangle className="h-16 w-16 text-amber-500 opacity-20" />
                  <p className="text-2xl font-bold uppercase opacity-60 tracking-widest">No se encontraron canales</p>
                  <button onClick={() => setSearchQuery('')} className="bg-primary hover:bg-primary/80 text-white font-bold px-10 py-3 rounded-full uppercase text-xs transition-all shadow-xl shadow-primary/20">
                      Limpiar Búsqueda
                  </button>
                </div>
              )}
            </section>
          ) : (
            <>
              {/* TENDENCIAS */}
              {featuredStreams.length > 0 && (
                <section className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-xl md:text-2xl font-black font-headline uppercase italic tracking-tighter flex items-center gap-3">
                      <TrendingUp className="h-6 w-6 text-primary" />
                      Tendencias en Vivo
                    </h2>
                    <div className="hidden md:flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                        Actualizado ahora <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-y-12 gap-x-8 md:gap-x-10 pl-3 sm:pl-4 md:pl-5 pr-2">
                    {featuredStreams.map((stream, index) => (
                        <StreamCard key={stream.id} stream={stream} rank={index + 1} />
                    ))}
                  </div>
                </section>
              )}

              {/* SECCIONES POR CATEGORÍA */}
              {dynamicCategories.map((cat, catIdx) => {
                const categoryStreams = streams.filter(s => s.category === cat).sort((a,b) => (a.order||999) - (b.order||999));
                if (categoryStreams.length === 0) return null;

                return (
                  <section 
                    key={cat} 
                    className="space-y-6 group animate-in fade-in slide-in-from-bottom-4 duration-700"
                    style={{ animationDelay: `${(catIdx + 1) * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl md:text-2xl font-black font-headline uppercase italic tracking-tighter border-l-4 border-primary pl-5 leading-none py-1 group-hover:text-primary transition-colors">
                        {cat}
                        </h2>
                        <button className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors flex items-center gap-2">
                            VER TODO <ArrowRight className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                      {categoryStreams.map((stream) => (
                        <StreamCard key={stream.id} stream={stream} />
                      ))}
                    </div>
                  </section>
                );
              })}

              {/* CANALES SIN CATEGORÍA ESPECÍFICA */}
              {uncategorizedStreams.length > 0 && (
                <section className="space-y-6 group animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between">
                      <h2 className="text-xl md:text-2xl font-black font-headline uppercase italic tracking-tighter border-l-4 border-primary pl-5 leading-none py-1 group-hover:text-primary transition-colors">
                        Más Canales
                      </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {uncategorizedStreams.map((stream) => (
                      <StreamCard key={stream.id} stream={stream} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

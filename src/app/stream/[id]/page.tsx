'use client';

import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  ArrowLeft,
  Share2,
  Loader2,
  MapPin,
  Info,
  CalendarDays,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Stream, LiveStatus, GeoLocation } from '@/lib/data';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import AppHeader from '@/components/app-header';
import StreamPlayer from '@/components/stream-player';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useUser } from '@/firebase/auth/use-user';
import {
  doc,
  setDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { useMiniPlayer } from '@/providers/mini-player-provider';
import { DEFAULT_STREAMS } from '@/data/defaultStreams';
import { enrichStream } from '@/lib/stream-catalog';

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
  </svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.523.074-.797.371-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.206 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
);

export function StreamPageContent({ streamId }: { streamId: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const { toast } = useToast();
  const { addMiniStream, closeMiniStream, activeStream } = useMiniPlayer();
  const { user } = useUser();
  const firestore = useFirestore();
  const [userLocation, setUserLocation] = useState<GeoLocation | null>(null);

  const streamRef = useMemoFirebase(
    () => (firestore && streamId ? doc(firestore, 'streams', streamId) : null),
    [firestore, streamId]
  );
  
  const { data: rawStream, isLoading: isStreamLoading } = useDoc<Stream>(streamRef);
  const fallback = useMemo(() => {
    return DEFAULT_STREAMS.find(s => s.id === streamId) || ({ id: streamId } as Stream);
  }, [streamId]);

  const stream = useMemo(() => {
    if (rawStream) return enrichStream(rawStream);
    return enrichStream(fallback);
  }, [rawStream, fallback]);

  // Si al entrar a la página este canal estaba en el mini player, cerramos la minipantalla
  useEffect(() => {
    if (activeStream?.id === streamId) {
      closeMiniStream();
    }
  }, [streamId, activeStream?.id, closeMiniStream]);

  // Referencia actualizada para cuando el usuario salga de la pantalla
  const streamRefForUnmount = useRef(stream);
  useEffect(() => {
    streamRefForUnmount.current = stream;
  }, [stream]);

  // Al salir de la página completa, transferir la transmisión a la minipantalla (PiP)
  useEffect(() => {
    return () => {
      const s = streamRefForUnmount.current;
      if (s && s.id && typeof window !== 'undefined') {
        const nextPath = window.location.pathname;
        if (!nextPath.startsWith(`/stream/${s.id}`)) {
          addMiniStream(s);
        }
      }
    };
  }, [addMiniStream]);

  const [liveStatus, setLiveStatus] = useState<LiveStatus>(() => ({
    status: (stream?.isLive ?? true) ? 'live' : 'offline',
    viewerCount: stream?.viewerCount || null
  }));

  useEffect(() => {
    if (stream?.viewerCount && liveStatus.viewerCount === null) {
      setLiveStatus(prev => ({
        ...prev,
        viewerCount: stream.viewerCount || null
      }));
    }
  }, [stream?.viewerCount, liveStatus.viewerCount]);

  const currentProgram = useMemo(() => {
    if (!stream?.schedule) return null;
    const now = new Date();
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const currentDay = days[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    return stream.schedule.find(p => {
      if (p.dayOfWeek !== currentDay) return false;
      const [startH, startM] = p.startTime.split(':').map(Number);
      const startMinutes = startH * 60 + startM;
      const [endH, endM] = (p.endTime || '23:59').split(':').map(Number);
      const endMinutes = endH * 60 + endM;
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    });
  }, [stream]);

  // Detección de ubicación geográfica para métricas (una sola vez)
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setUserLocation({ 
          country: data.country_name || 'Desconocido', 
          region: data.region || 'Desconocido', 
          city: data.city || 'Desconocido' 
        });
      })
      .catch(() => {
        setUserLocation({ country: 'Desconocido', region: 'Desconocido', city: 'Desconocido' });
      });
  }, []);

  useEffect(() => {
    if (!stream?.id || !firestore) return;
    
    const record = () => {
      const uId = user?.uid || 'anon_' + Math.random().toString(36).substring(2, 7);
      
      const dataToStore: any = {
        userId: uId, 
        streamId: stream.id, 
        streamerName: stream.streamer, 
        lastViewed: serverTimestamp(), 
        viewCount: increment(1), 
        watchTimeSeconds: increment(30)
      };

      if (userLocation) {
        dataToStore.location = {
          country: userLocation.country || 'Desconocido',
          region: userLocation.region || 'Desconocido',
          city: userLocation.city || 'Desconocido'
        };
      }

      if (currentProgram) {
        dataToStore.programName = currentProgram.title || 'Programa Desconocido';
      }

      setDoc(doc(firestore, 'audience_logs_v2', `${uId}_${stream.id}_${Date.now()}`), dataToStore, { merge: true }).catch(() => {});
    };

    record();
    const inv = setInterval(record, 30000);
    return () => clearInterval(inv);
  }, [user?.uid, stream?.id, stream?.streamer, firestore, userLocation?.city, currentProgram?.title]);

  useEffect(() => {
    if (!stream?.platformChannelId && !stream?.liveVideoId) return;
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/viewer-count?platform=${stream.platform}&channelId=${stream.platformChannelId}&videoId=${stream.liveVideoId || ''}`);
        if (res.ok) setLiveStatus(await res.json());
      } catch (e) {}
    };
    fetchStatus();
    const inv = setInterval(fetchStatus, 60000);
    return () => clearInterval(inv);
  }, [stream?.platform, stream?.platformChannelId, stream?.liveVideoId]);
  
  useEffect(() => { if (typeof window !== 'undefined') setCurrentUrl(window.location.href); }, [streamId]);

  if (isStreamLoading && !stream.title && !fallback.title) {
    return <div className="fixed inset-0 flex items-center justify-center bg-black z-50"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (!stream) return null;

  return (
    <div className="relative min-h-screen w-full bg-black overflow-x-hidden">
      {stream.thumbnailUrl && (
        <div className="fixed inset-0 z-0 h-full w-full bg-cover bg-center opacity-40 grayscale-[0.5]" style={{ backgroundImage: `url(${stream.thumbnailUrl})`, filter: 'blur(20px)' }}></div>
      )}
      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 lg:px-8 pt-24 pb-8 flex flex-col">
          <div className="mb-4 flex items-center justify-between shrink-0">
            <Link href="/" className="text-white/60 hover:text-white uppercase font-black tracking-widest text-[10px] flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver
            </Link>
            <div className="flex items-center gap-3">
                {currentProgram && (
                   <Badge className="bg-primary/20 text-primary border-primary/30 font-black uppercase text-[10px] tracking-widest">
                     EN AIRE: {currentProgram.title}
                   </Badge>
                )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
              <div className="flex-1 flex flex-col gap-6">
                  <div className="relative w-full bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl ring-1 ring-white/5 aspect-video max-h-[calc(100vh-280px)] lg:max-h-[calc(100vh-220px)]">
                      <StreamPlayer 
                        stream={stream} 
                        isLive={liveStatus.status !== 'offline'} 
                        liveVideoId={liveStatus.liveVideoId} 
                        apiStatus={liveStatus.status}
                        muted={false}
                      />
                  </div>
                  <div className="space-y-2 shrink-0">
                      <h1 className="text-2xl md:text-4xl font-black font-headline text-white uppercase tracking-tighter italic truncate">
                          {stream.title}
                      </h1>
                      <div className="flex wrap items-center gap-3">
                          <p className="font-black text-lg md:text-xl text-primary uppercase tracking-tighter italic">{stream.streamer}</p>
                          <Badge variant="secondary" className="bg-white/10 text-[10px] uppercase font-black px-3 py-0.5">{stream.category}</Badge>
                      </div>
                  </div>
              </div>

              <aside className="w-full lg:w-[450px] lg:max-h-[calc(100vh-200px)] overflow-y-auto no-scrollbar lg:pr-2">
                  <div className="flex flex-col gap-6 pb-20">
                      <div className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-3xl shadow-2xl">
                          <div className="flex items-center justify-between mb-4">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 flex items-center gap-2">
                                  <Info className="h-4 w-4" /> Información
                              </h3>
                              {liveStatus.status === 'live' && (
                                  <div className="flex items-center bg-red-600/20 border border-red-600/40 px-3 py-1 rounded-full text-red-500 font-black text-[9px] uppercase tracking-widest animate-pulse">
                                      <Users className="h-3 w-3 mr-2 fill-red-500" />
                                      <span>{liveStatus.viewerCount ? new Intl.NumberFormat('es-ES', { notation: 'compact' }).format(liveStatus.viewerCount) : 'VIVO'}</span>
                                  </div>
                              )}
                          </div>
                          <p className="text-white/90 text-sm leading-relaxed font-semibold italic mb-5">
                              "{stream.description || "Canal oficial transmitiendo en vivo."}"
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                              {stream.tags?.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-purple-400 border-purple-400/40 bg-purple-400/10 text-[9px] uppercase font-black px-2 py-0.5">#{tag}</Badge>
                              ))}
                          </div>
                      </div>

                      <div className="p-6 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-3xl space-y-6">
                          <div className="space-y-4">
                              <div className="flex items-center gap-4 text-purple-400">
                                  <div className="p-2 rounded-full bg-purple-500/10 border border-purple-500/20"><MapPin className="h-5 w-5" /></div>
                                  <div className="flex flex-col"><span className="text-[10px] font-black uppercase opacity-40">Ubicación</span><span className="text-sm font-black text-white">{userLocation ? `${userLocation.city}, ${userLocation.region}` : 'Detectando...'}</span></div>
                              </div>
                              <div className="flex items-center gap-4 text-purple-400">
                                  <div className="p-2 rounded-full bg-purple-500/10 border border-purple-500/20"><CalendarDays className="h-5 w-5" /></div>
                                  <div className="flex flex-col"><span className="text-[10px] font-black uppercase opacity-40">Horarios</span><Link href="/schedule" className="text-sm font-black text-white hover:text-primary underline uppercase underline-offset-4">Ver grilla semanal</Link></div>
                              </div>
                          </div>

                          <div className="pt-4 border-t border-white/10 space-y-3">
                              <Popover>
                                  <PopoverTrigger asChild>
                                      <Button className="w-full font-black text-[14px] uppercase tracking-[0.2em] rounded-xl h-14 bg-purple-500/5 hover:bg-purple-500/10 text-purple-200/80 border border-purple-500/10 shadow-xl transition-all">
                                          <Share2 className="mr-2 h-5 w-5" /> Compartir
                                      </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-72 bg-zinc-950 border-white/20 text-white" align="center">
                                      <div className="space-y-4 p-2">
                                          <p className="text-[11px] font-black uppercase tracking-widest opacity-40 text-center">Compartir Canal</p>
                                          <div className="grid grid-cols-2 gap-3">
                                              <Button variant="outline" size="lg" onClick={() => window.open(`https://x.com/intent/post?text=${encodeURIComponent(`Mira a ${stream.streamer} en StreamFLIX!`)}&url=${encodeURIComponent(currentUrl)}`, '_blank')} className="border-white/10 hover:bg-white/10"><XIcon className="h-4 w-4" /></Button>
                                              <Button variant="outline" size="lg" onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Mira a ${stream.streamer} en StreamFLIX! ${currentUrl}`)}`, '_blank')} className="border-white/10 hover:bg-white/10 text-green-500"><WhatsappIcon className="h-4 w-4" /></Button>
                                          </div>
                                          <Button variant="outline" className="w-full h-12 text-[10px] font-black uppercase tracking-widest border-white/10" onClick={() => { navigator.clipboard.writeText(currentUrl); toast({ title: '¡Link copiado!' }); }}>Copiar Enlace</Button>
                                      </div>
                                  </PopoverContent>
                              </Popover>
                          </div>
                      </div>
                  </div>
              </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function StreamPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id || '');
  if (!id) return null;
  return <StreamPageContent key={id} streamId={id} />;
}

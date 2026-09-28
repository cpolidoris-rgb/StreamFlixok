'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Clock,
  Radio,
  Search,
  ChevronLeft,
  ChevronRight,
  Play,
  Tv,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Volume2,
  Share2,
  Bookmark,
  Users
} from 'lucide-react';
import AppHeader from '@/components/app-header';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DEFAULT_STREAMS } from '@/data/defaultStreams';
import { useFirestore, useMemoFirebase } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import {
  DAYS_OF_WEEK,
  DayOfWeek,
  CHANNEL_NUMBERS,
  timeToMinutes,
  minutesToTime,
  getFilledDaySchedule
} from '@/data/channelSchedules';
import type { Stream, Program } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  enrichStream,
  isChannelCurrentlyLive,
  getRealtimeViewerCount,
  formatViewerCount
} from '@/lib/stream-catalog';

const CATEGORIES = ['Todos', 'Streaming', 'TV Noticias', 'TV Abierta', 'Deportes', 'Radio', 'Streamers'];

// Intervalos de 30 minutos a lo largo de las 24 horas del día
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const totalMinutes = i * 30;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return {
    minutes: totalMinutes,
    label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
    isHour: m === 0
  };
});

export default function SchedulePage() {
  const firestore = useFirestore();
  const channelsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'streams') : null),
    [firestore]
  );
  const { data: allRawStreams } = useCollection<Stream>(channelsQuery);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Lunes');
  const [currentDay, setCurrentDay] = useState<DayOfWeek>('Lunes');
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  
  // Escala de zoom (píxeles por minuto): 2.5 = compacto, 3.2 = normal, 4.2 = detallado
  const [zoomLevel, setZoomLevel] = useState<number>(3.2);

  // Programa seleccionado para inspección en el modal inferior estilo Flow
  const [activeProgram, setActiveProgram] = useState<{
    program: Program;
    stream: Stream;
    channelNumber: number;
    isLive: boolean;
    progressPercent: number;
  } | null>(null);

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const hasAutoScrolled = useRef(false);

  // Canales base: obtenidos de Firestore (las mismas tarjetas del home) o fallback
  const baseStreams = useMemo(() => {
    if (allRawStreams && allRawStreams.length > 0) {
      return allRawStreams.filter(s => s && s.status !== 'rejected').map(enrichStream);
    }
    return DEFAULT_STREAMS.map(enrichStream);
  }, [allRawStreams]);

  // Reloj en tiempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days: DayOfWeek[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const today = days[now.getDay()];
      setCurrentDay(today);

      const h = now.getHours();
      const m = now.getMinutes();
      const mins = h * 60 + m;
      setCurrentMinutes(mins);
      setCurrentTimeStr(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Seleccionar automáticamente el día de hoy al cargar
  useEffect(() => {
    setSelectedDay(currentDay);
  }, [currentDay]);

  // Canales filtrados por categoría y búsqueda, ordenados por número de canal oficial
  const filteredStreams = useMemo(() => {
    return baseStreams
      .filter((s) => {
        if (selectedCategory !== 'Todos' && s.category !== selectedCategory) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchChannel = s.streamer.toLowerCase().includes(q) || s.title.toLowerCase().includes(q);
          const fullDay = getFilledDaySchedule(s.id, selectedDay, s.streamer);
          const matchProgram = fullDay.some(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
          if (!matchChannel && !matchProgram) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const numA = CHANNEL_NUMBERS[a.id] || 999;
        const numB = CHANNEL_NUMBERS[b.id] || 999;
        return numA - numB;
      });
  }, [baseStreams, selectedCategory, searchQuery, selectedDay]);

  // Centrar la línea de tiempo en el horario actual
  const scrollToCurrentTime = (behavior: ScrollBehavior = 'smooth') => {
    if (!timelineContainerRef.current) return;
    const pxPerMin = zoomLevel;
    // Posición del tiempo actual en el track de la línea de tiempo
    const timePx = currentMinutes * pxPerMin;
    // Ancho del contenedor para centrar la línea
    const containerWidth = timelineContainerRef.current.clientWidth;
    // Ancho de la columna izquierda de canales (280px con tarjeta del canal)
    const channelColWidth = 280;
    const targetScroll = Math.max(0, timePx - (containerWidth - channelColWidth) / 2);
    timelineContainerRef.current.scrollTo({ left: targetScroll, behavior });
  };

  // Auto-scroll inicial a "Ahora" una vez montado
  useEffect(() => {
    if (!hasAutoScrolled.current && currentMinutes > 0 && timelineContainerRef.current) {
      setTimeout(() => {
        scrollToCurrentTime('auto');
        hasAutoScrolled.current = true;
      }, 300);
    }
  }, [currentMinutes]);

  // Salto a bloques de horario específicos (Mañana, Tarde, Noche, etc.)
  const jumpToHour = (hour: number) => {
    if (!timelineContainerRef.current) return;
    const targetMin = hour * 60;
    const targetPx = targetMin * zoomLevel;
    timelineContainerRef.current.scrollTo({ left: targetPx, behavior: 'smooth' });
  };

  // Desplazamiento horizontal manual con flechas (+- 2 horas)
  const handleScrollByHours = (hours: number) => {
    if (!timelineContainerRef.current) return;
    const delta = hours * 60 * zoomLevel;
    timelineContainerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const isToday = selectedDay === currentDay;
  const totalTimelineWidth = 1440 * zoomLevel; // 24 horas * zoom

  return (
    <div className="flex flex-col min-h-screen bg-[#07070a] text-white selection:bg-[#00d2ff] selection:text-black">
      <AppHeader />

      <main className="flex-1 w-full max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-8 pt-28 pb-16 space-y-4">
        
        {/* CABECERA ESTILO FLOW: TÍTULO, DÍAS Y CONTROLES */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-[#0d0f18] via-[#090b10] to-[#0d0f18] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#00d2ff]/15 border border-[#00d2ff]/40 text-[#00d2ff] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(0,210,255,0.2)]">
                <Tv className="w-3.5 h-3.5" />
                <span>FLOW EPG</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-white">
                Guía de Canales & Línea de Tiempo
              </h1>
            </div>
            <p className="text-xs text-zinc-400 font-medium hidden sm:block">
              Navegá horizontalmente por la grilla interactiva las 24 hs de todos los canales en vivo de Argentina.
            </p>
          </div>

          {/* ACCESOS RÁPIDOS DE HORARIO */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => scrollToCurrentTime('smooth')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg",
                isToday
                  ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 ring-2 ring-red-400/50 scale-105"
                  : "bg-white/10 hover:bg-white/20 text-white"
              )}
              title="Ir a la hora actual"
            >
              <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>AHORA ({currentTimeStr} hs)</span>
            </button>

            <div className="hidden md:flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => jumpToHour(8)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                08:00 Mañana
              </button>
              <button
                onClick={() => jumpToHour(13)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                13:00 Mediodía
              </button>
              <button
                onClick={() => jumpToHour(18)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                18:00 Tarde
              </button>
              <button
                onClick={() => jumpToHour(20)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase text-amber-400 hover:bg-amber-400/10 transition-all font-black"
              >
                ★ 20:00 Prime Time
              </button>
            </div>

            {/* CONTROLES DE ZOOM Y NAVEGACIÓN */}
            <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setZoomLevel(prev => Math.max(2.2, Number((prev - 0.6).toFixed(1))))}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                title="Reducir zoom"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[10px] font-black uppercase text-zinc-400 px-1">
                {zoomLevel <= 2.5 ? 'Compacto' : zoomLevel >= 3.8 ? 'Detallado' : 'Normal'}
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(4.5, Number((prev + 0.6).toFixed(1))))}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                title="Aumentar zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SELECTOR DE DÍAS Y FILTROS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0d0f18]/80 border border-white/10 rounded-xl p-3">
          
          {/* DÍAS DE LA SEMANA */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day;
              const isDayToday = day === currentDay;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap",
                    isSelected
                      ? "bg-[#00d2ff] text-black shadow-lg shadow-[#00d2ff]/30 scale-[1.03]"
                      : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                  )}
                >
                  {isDayToday && (
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full animate-ping",
                      isSelected ? "bg-black" : "bg-emerald-400"
                    )} />
                  )}
                  <span>{day}</span>
                  {isDayToday && <span className="text-[9px] opacity-75 font-normal">(HOY)</span>}
                </button>
              );
            })}
          </div>

          {/* FILTRO DE CATEGORÍAS Y BÚSQUEDA */}
          <div className="flex items-center gap-2">
            <div className="relative w-44 sm:w-60">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar canal o programa..."
                className="pl-8 h-8 text-xs bg-black/60 border-white/10 text-white rounded-lg focus:border-[#00d2ff]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filtrar canales por categoría"
              className="h-8 px-2.5 bg-black/60 border border-white/10 text-xs font-bold text-white rounded-lg focus:outline-none focus:border-[#00d2ff]"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c} className="bg-zinc-900 text-white">{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL DE LA MATRIZ EPG (ESTILO FLOW) */}
        <div className="relative rounded-2xl border border-white/10 bg-[#090a0f] shadow-2xl overflow-hidden">
          
          {/* BOTONES FLOTANTES DE NAVEGACIÓN HORIZONTAL */}
          <button
            onClick={() => handleScrollByHours(-2)}
            className="absolute left-[290px] top-1/2 -translate-y-1/2 z-40 w-9 h-14 bg-black/80 hover:bg-[#00d2ff] hover:text-black border border-white/20 rounded-r-xl flex items-center justify-center text-white transition-all backdrop-blur-md shadow-xl"
            title="Retroceder 2 horas"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleScrollByHours(2)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-40 w-9 h-14 bg-black/80 hover:bg-[#00d2ff] hover:text-black border border-white/20 rounded-l-xl flex items-center justify-center text-white transition-all backdrop-blur-md shadow-xl"
            title="Avanzar 2 horas"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* CONTENEDOR CON SCROLL HORIZONTAL Y VERTICAL */}
          <div
            ref={timelineContainerRef}
            className="overflow-x-auto overflow-y-auto max-h-[72vh] scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-black"
          >
            <div className="relative" style={{ width: `${280 + totalTimelineWidth}px` }}>

              {/* LÍNEA DE TIEMPO EN VIVO (BARRA ROJA VERTICAL DE AHORA) */}
              {isToday && (
                <div
                  className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all duration-1000"
                  style={{ left: `${280 + currentMinutes * zoomLevel}px` }}
                >
                  {/* Marcador superior con la hora actual */}
                  <div className="sticky top-0 -translate-x-1/2 z-40">
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[9px] uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.9)] border border-red-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>{currentTimeStr} hs</span>
                    </div>
                  </div>

                  {/* Línea vertical roja continua */}
                  <div className="w-[2px] h-full bg-gradient-to-b from-red-500 via-red-500/80 to-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                </div>
              )}

              {/* FILA SUPERIOR: ESQUINA FIJA + REGLA DE TIEMPO HORIZONTAL */}
              <div className="sticky top-0 z-20 flex bg-[#0c0e17] border-b border-white/10 shadow-md">
                
                {/* ESQUINA SUPERIOR IZQUIERDA (STICKY TOP Y LEFT) */}
                <div className="sticky left-0 z-30 w-[280px] min-w-[280px] h-12 bg-[#0c0e17] border-r border-white/10 flex items-center justify-between px-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00d2ff]">
                    CANAL / SEÑAL
                  </span>
                  <span className="text-[9px] font-bold uppercase text-zinc-500">
                    HORARIO
                  </span>
                </div>

                {/* TRACK DE HORAS */}
                <div className="flex relative h-12" style={{ width: `${totalTimelineWidth}px` }}>
                  {TIME_SLOTS.map((slot) => {
                    const widthPx = 30 * zoomLevel;
                    return (
                      <div
                        key={slot.minutes}
                        className={cn(
                          "flex flex-col justify-end pb-1.5 border-l border-white/5 px-2 relative select-none",
                          slot.isHour ? "border-white/15" : "border-white/5"
                        )}
                        style={{ width: `${widthPx}px` }}
                      >
                        <span className={cn(
                          "text-[11px] font-black tracking-tight",
                          slot.isHour ? "text-white font-mono" : "text-zinc-500 text-[10px]"
                        )}>
                          {slot.label}
                        </span>
                        {/* Marca de cuadrícula */}
                        <div className={cn(
                          "absolute bottom-0 left-0 h-2 bg-white/20",
                          slot.isHour ? "w-0.5 bg-[#00d2ff]/60" : "w-[1px] bg-white/10"
                        )} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LISTA DE FILAS DE CANALES */}
              <div className="divide-y divide-white/5">
                {filteredStreams.map((rawStream) => {
                  const stream = enrichStream(rawStream);
                  const channelNumber = CHANNEL_NUMBERS[stream.id] || 99;
                  const programs = getFilledDaySchedule(stream.id, selectedDay, stream.streamer);
                  const isChannelLive = isChannelCurrentlyLive(stream);
                  const realViewerCount = getRealtimeViewerCount(stream);

                  return (
                    <div key={stream.id} className="flex group/row hover:bg-white/[0.02] transition-colors relative">
                      
                      {/* COLUMNA IZQUIERDA FIJA: IDENTIDAD DEL CANAL (CON LOGO OFICIAL DE LA TARJETA DEL HOME) */}
                      <div className="sticky left-0 z-10 w-[280px] min-w-[280px] h-24 bg-[#090b12] border-r border-white/10 flex items-center justify-between px-3 gap-3 shadow-xl group-hover/row:bg-[#0e111a] transition-colors">
                        
                        {/* TARJETA CON LOGO DEL CANAL OBTENIDO DEL HOME */}
                        {(() => {
                          const logoUrl = stream.thumbnailUrl || (stream as any).thumbnail || (stream as any).coverUrl || (stream as any).imageUrl || (stream as any).image || (stream as any).posterUrl;

                          return (
                            <Link 
                              href={`/stream/${stream.id}`}
                              className="group/card relative w-24 sm:w-28 aspect-[16/9] rounded-lg overflow-hidden bg-black/90 border border-white/15 shrink-0 shadow-md group-hover/row:border-[#00d2ff]/60 group-hover/row:scale-[1.03] transition-all flex items-center justify-center"
                              title={`Ver ${stream.streamer} en vivo`}
                            >
                              {logoUrl ? (
                                <Image
                                  src={logoUrl}
                                  alt={stream.streamer}
                                  fill
                                  className="object-contain p-1 transition-transform duration-300 group-hover/card:scale-105"
                                  unoptimized
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-xs font-black text-white">
                                  {stream.streamer.slice(0, 3)}
                                </div>
                              )}
                              
                              {/* NÚMERO DE CANAL */}
                              <div className="absolute top-1 left-1 bg-black/85 backdrop-blur-md text-[#00d2ff] font-mono font-black text-[8px] px-1 rounded border border-white/10 shadow-sm z-10">
                                CH {channelNumber}
                              </div>

                              {/* ETIQUETA VIVO SOLO PARA CANALES QUE TIENEN TRANSMISIÓN EN VIVO EN ESE MOMENTO */}
                              {isChannelLive && (
                                <div className="absolute top-1 right-1 bg-red-600 text-white font-black text-[7px] uppercase tracking-widest px-1 py-0.2 rounded shadow-sm animate-pulse z-10">
                                  VIVO
                                </div>
                              )}

                              {/* USUARIOS REALES QUE ESTÁN VIENDO CADA CANAL */}
                              {isChannelLive && realViewerCount > 0 && (
                                <div className="absolute bottom-1 left-1 bg-black/90 backdrop-blur-md text-white font-black text-[7px] px-1 py-0.2 rounded flex items-center gap-0.5 border border-white/5 z-10">
                                  <Users className="w-2 h-2 text-red-500 fill-red-500" />
                                  <span>{formatViewerCount(realViewerCount)}</span>
                                </div>
                              )}
                            </Link>
                          );
                        })()}

                        {/* NOMBRE, CATEGORÍA Y ESTADO DE AUDIENCIA */}
                        <div className="flex-1 min-w-0 pr-1">
                          <Link href={`/stream/${stream.id}`}>
                            <h3 className="text-xs font-black uppercase tracking-tight text-white truncate group-hover/row:text-[#00d2ff] transition-colors">
                              {stream.streamer}
                            </h3>
                          </Link>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block truncate">
                            {stream.category}
                          </span>
                          {isChannelLive ? (
                            <div className="flex items-center gap-1 text-[9px] font-bold text-red-400 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block" />
                              <span className="font-mono">{formatViewerCount(realViewerCount)} viendo</span>
                            </div>
                          ) : (
                            <span className="text-[9px] font-medium text-zinc-500 mt-1 block">
                              Fuera de aire
                            </span>
                          )}
                        </div>

                        {/* BOTÓN PLAY DIRECTO */}
                        <Link
                          href={`/stream/${stream.id}`}
                          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-600 text-white flex items-center justify-center transition-all opacity-0 group-hover/row:opacity-100 shrink-0 shadow-lg"
                          title={`Ver ${stream.streamer} en directo`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </Link>
                      </div>

                      {/* TRACK DE PROGRAMAS (BLOQUES CON ANCHO PROPORCIONAL A LA DURACIÓN) */}
                      <div className="flex relative h-24" style={{ width: `${totalTimelineWidth}px` }}>
                        {programs.map((program) => {
                          const startMin = timeToMinutes(program.startTime);
                          const endMin = timeToMinutes(program.endTime || '24:00');
                          const durationMin = Math.max(15, endMin - startMin);
                          const widthPx = durationMin * zoomLevel;

                          // ETIQUETA VIVO SOLO SI EL CANAL ESTÁ EN VIVO Y ESTE PROGRAMA ESTÁ EN CURSO HOY
                          const isLiveNow = isToday && isChannelLive && currentMinutes >= startMin && currentMinutes < endMin;
                          
                          // Progreso transcurrido
                          const progressPercent = isLiveNow
                            ? Math.min(100, Math.max(0, ((currentMinutes - startMin) / durationMin) * 100))
                            : 0;

                          const isSelected = activeProgram?.program.id === program.id;

                          return (
                            <div
                              key={program.id}
                              onClick={() => setActiveProgram({
                                program,
                                stream,
                                channelNumber,
                                isLive: isLiveNow,
                                progressPercent
                              })}
                              style={{ width: `${widthPx}px` }}
                              className={cn(
                                "h-full border-r border-white/10 p-2.5 cursor-pointer relative overflow-hidden transition-all duration-200 select-none group/item flex flex-col justify-between",
                                isSelected
                                  ? "bg-gradient-to-br from-[#00d2ff]/25 to-zinc-900 ring-2 ring-[#00d2ff] z-10"
                                  : isLiveNow
                                  ? "bg-gradient-to-r from-red-950/40 via-zinc-900/90 to-zinc-900 hover:from-red-900/50 hover:to-zinc-800 border-red-500/40"
                                  : "bg-[#0b0d14]/70 hover:bg-[#121522] text-zinc-300 hover:text-white"
                              )}
                            >
                              {/* BARRA DE PROGRESO INFERIOR SI ESTÁ EN VIVO */}
                              {isLiveNow && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-950">
                                  <div
                                    className="h-full bg-red-500 transition-all duration-1000 shadow-[0_0_8px_rgba(239,68,68,1)]"
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              )}

                              {/* ENCABEZADO DEL BLOQUE: HORARIO Y BADGE VIVO */}
                              <div className="flex items-center justify-between gap-1">
                                <span className={cn(
                                  "text-[10px] font-bold font-mono tracking-tight",
                                  isLiveNow ? "text-red-400 font-black" : "text-zinc-400 group-hover/item:text-zinc-200"
                                )}>
                                  {program.startTime} - {program.endTime}
                                </span>

                                {isLiveNow && (
                                  <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white font-black text-[7px] uppercase tracking-widest animate-pulse shrink-0">
                                    VIVO
                                  </span>
                                )}
                              </div>

                              {/* TÍTULO DEL PROGRAMA */}
                              <div className="min-w-0 my-auto">
                                <h4 className={cn(
                                  "text-xs font-black uppercase tracking-tight truncate transition-colors",
                                  isLiveNow ? "text-white font-extrabold" : "text-zinc-200 group-hover/item:text-white"
                                )}>
                                  {program.title}
                                </h4>
                                
                                {widthPx > 180 && (
                                  <p className="text-[10px] text-zinc-400 line-clamp-1 leading-tight mt-0.5">
                                    {program.description}
                                  </p>
                                )}
                              </div>

                              {/* PIE DEL BLOQUE: DURACIÓN */}
                              <div className="flex items-center justify-between text-[9px] text-zinc-500 font-medium">
                                <span>{durationMin} min</span>
                                {isLiveNow && (
                                  <span className="text-red-400 font-bold">
                                    Quedan {Math.max(1, endMin - currentMinutes)}m
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* DETALLE INFERIOR DESPLEGABLE ESTILO FLOW (DRAWER AL CLICKEAR UN PROGRAMA) */}
        {activeProgram && (
          <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-50 bg-[#0d101a] border border-[#00d2ff]/40 rounded-2xl p-5 shadow-[0_10px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-4 min-w-0">
                {/* LOGO OFICIAL DEL CANAL OBTENIDO DEL HOME */}
                <div className="relative w-28 sm:w-32 aspect-[16/9] rounded-xl overflow-hidden bg-black/90 border border-white/20 shrink-0 shadow-lg flex items-center justify-center">
                  <Image
                    src={activeProgram.stream.thumbnailUrl || (activeProgram.stream as any).thumbnail || (activeProgram.stream as any).coverUrl || (activeProgram.stream as any).imageUrl || 'https://inforosario.com/logostream.png'}
                    alt={activeProgram.stream.streamer}
                    fill
                    className="object-contain p-1.5"
                    unoptimized
                  />
                  <div className="absolute top-1 left-1 bg-[#00d2ff] text-black font-black text-[9px] px-1 rounded font-mono z-10">
                    CH {activeProgram.channelNumber}
                  </div>
                  {activeProgram.isLive && (
                    <div className="absolute top-1 right-1 bg-red-600 text-white font-black text-[8px] px-1 rounded uppercase animate-pulse">
                      VIVO
                    </div>
                  )}
                </div>

                {/* DETALLES DEL PROGRAMA */}
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-[#00d2ff] tracking-wider">
                      {activeProgram.stream.streamer}
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-[11px] font-bold text-zinc-300 font-mono">
                      {activeProgram.program.startTime} a {activeProgram.program.endTime} hs
                    </span>
                    {activeProgram.isLive ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[8px] uppercase tracking-widest animate-pulse">
                        <Users className="w-2.5 h-2.5 fill-current" />
                        <span>EN DIRECTO • {formatViewerCount(getRealtimeViewerCount(activeProgram.stream))} espectadores</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-400 font-bold text-[8px] uppercase tracking-wider">
                        TRANSMISIÓN NO DISPONIBLE EN VIVO
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tight text-white truncate">
                    {activeProgram.program.title}
                  </h3>

                  <p className="text-xs text-zinc-300 line-clamp-2 max-w-xl leading-relaxed">
                    {activeProgram.program.description}
                  </p>
                </div>
              </div>

              {/* ACCIONES Y BOTÓN DE VER EN VIVO */}
              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                <Link
                  href={`/stream/${activeProgram.stream.id}`}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{activeProgram.isLive ? 'VER EN DIRECTO' : 'IR AL CANAL'}</span>
                </Link>

                <button
                  onClick={() => setActiveProgram(null)}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                  title="Cerrar detalle"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* BARRA DE PROGRESO EN VIVO */}
            {activeProgram.isLive && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-3 text-[10px] text-zinc-400">
                <span>Progreso:</span>
                <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)]"
                    style={{ width: `${activeProgram.progressPercent}%` }}
                  />
                </div>
                <span className="font-mono text-white font-bold">{Math.round(activeProgram.progressPercent)}%</span>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

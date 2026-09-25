'use client';

import { Play, Info, Trophy, MapPin, Calendar, Users, Radio, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const RED_FILTER = { filter: 'invert(18%) sepia(100%) saturate(7413%) hue-rotate(359deg) brightness(101%) contrast(120%)' };

/**
 * Efecto de flashes y reflectores del estadio
 */
function StadiumFlashes() {
  const flashes = [
    { top: '15%', left: '18%', delay: '0.2s' },
    { top: '35%', left: '78%', delay: '1.4s' },
    { top: '12%', left: '55%', delay: '2.6s' },
    { top: '65%', left: '25%', delay: '0.9s' },
    { top: '25%', left: '88%', delay: '3.1s' },
    { top: '75%', left: '12%', delay: '1.9s' },
    { top: '50%', left: '48%', delay: '3.5s' },
    { top: '18%', left: '38%', delay: '0.6s' },
  ];

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {flashes.map((f, i) => (
        <div
          key={i}
          className="absolute w-3.5 h-3.5 bg-amber-200/90 rounded-full blur-md animate-camera-flash"
          style={{
            top: f.top,
            left: f.left,
            animationDelay: f.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroBanner() {
  return (
    <div className="relative w-full h-[65vh] md:h-[78vh] overflow-hidden bg-zinc-950 rounded-[40px] mx-auto container shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-sky-500/20 group">
      {/* IMAGEN DE FONDO - DESPEDIDA DE MESSI EN EL MONUMENTAL */}
      <Image
        src="/messi_monumental_farewell_1790334322599.jpg"
        alt="Despedida de Lionel Messi - Estadio Monumental"
        fill
        className="object-cover object-center opacity-85 transition-transform duration-[25s] group-hover:scale-105 ease-out"
        priority
        unoptimized
      />
      
      {/* EFECTO REFLECTORES Y FLASHES */}
      <StadiumFlashes />
      
      {/* MÁSCARAS DE DEGRADADO CINEMATOGRÁFICAS */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-black/20 z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent z-10"></div>
      
      {/* CONTENIDO PRINCIPAL */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 z-20">
        <div className="max-w-3xl space-y-5 animate-in fade-in slide-in-from-left-6 duration-1000">
            {/* BADGES SUPERIORES */}
            <div className="flex flex-wrap items-center gap-2.5">
                <Badge className="bg-sky-500/25 text-sky-300 border-sky-400/40 font-black uppercase text-[9px] tracking-[0.25em] px-3.5 py-1 backdrop-blur-md shadow-lg shadow-sky-500/10">
                  <Radio className="w-2.5 h-2.5 mr-1.5 text-red-500 animate-pulse" /> EVENTO HISTÓRICO
                </Badge>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[9px] font-black uppercase tracking-wider backdrop-blur-md">
                    <Trophy className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>Homenaje al Capitán Eterno</span>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-amber-400 font-bold text-xs tracking-widest pl-1">
                  <span>⭐⭐⭐</span>
                </div>
            </div>
            
            {/* TÍTULO Y SUBTÍTULO */}
            <div className="flex flex-col">
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black font-headline tracking-tighter text-white uppercase italic leading-none drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                MESSI
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <h2 className="text-xs sm:text-sm md:text-base font-black tracking-[0.3em] uppercase text-sky-400 drop-shadow">
                  La Despedida de la Selección
                </h2>
                <span className="text-white/40 hidden sm:inline">•</span>
                <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-zinc-300 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-red-500" /> Estadio Mâs Monumental
                </span>
              </div>
            </div>
            
            {/* DESCRIPCIÓN */}
            <p className="text-xs sm:text-sm md:text-base text-zinc-200 font-medium leading-relaxed max-w-xl drop-shadow-md">
              El último partido del más grande de todos los tiempos con la camiseta albiceleste. Una noche inolvidable ante más de 85.000 hinchas en el Monumental para rendir tributo a Lionel Messi.
            </p>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link 
                href="/stream/tyc-sports"
                className="bg-sky-400 hover:bg-sky-300 text-black font-black px-8 sm:px-10 h-12 text-[11px] rounded-full transition-all active:scale-95 shadow-[0_10px_25px_rgba(56,189,248,0.35)] flex items-center gap-2.5 uppercase tracking-widest hover:ring-2 hover:ring-sky-300/50"
              >
                <Play className="h-3.5 w-3.5 fill-black" /> TRANSMISIÓN EN VIVO
              </Link>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-black px-7 sm:px-8 h-12 text-[11px] rounded-full transition-all active:scale-95 border border-white/20 flex items-center gap-2.5 uppercase tracking-widest">
                    <Info className="h-3.5 w-3.5" /> DETALLES DEL EVENTO
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-950 border-sky-500/30 text-white max-w-lg">
                  <DialogHeader>
                    <div className="flex items-center gap-2 text-sky-400 text-xs font-black uppercase tracking-widest mb-1">
                      <Sparkles className="h-4 w-4" /> Cobertura Especial StreamFLIX
                    </div>
                    <DialogTitle className="text-2xl font-black uppercase italic text-white tracking-tighter">
                      La Gran Despedida de Lionel Messi
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 text-xs font-semibold">
                      Tributo oficial al capitán de la Selección Argentina en el Estadio Monumental.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-3 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Estadio
                        </span>
                        <p className="font-bold text-white text-xs">Mâs Monumental</p>
                        <p className="text-[10px] text-zinc-400">Buenos Aires, Argentina</p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                          <Users className="h-3 w-3" /> Capacidad
                        </span>
                        <p className="font-bold text-white text-xs">+85.000 Hinchas</p>
                        <p className="text-[10px] text-zinc-400">Entradas agotadas</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-500/20 text-xs space-y-2">
                      <p className="font-bold text-sky-200">
                        🇦🇷 Transmisión completa de la despedida:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-zinc-300 text-[11px]">
                        <li>Previa en directo desde el campo de juego y vestuarios.</li>
                        <li>Show musical con artistas invitados y recorrido de sus 10 mejores goles con la Selección.</li>
                        <li>Entrega de plaqueta de honor por la AFA y vuelta olímpica con la Copa del Mundo.</li>
                        <li>Partido homenaje con leyendas del fútbol argentino y mundial.</li>
                      </ul>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Link 
                        href="/stream/tyc-sports"
                        className="w-full text-center bg-sky-500 hover:bg-sky-400 text-black font-black py-3 rounded-xl text-xs uppercase tracking-widest transition-all"
                      >
                        Ir a la señal en vivo
                      </Link>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
        </div>
      </div>

      {/* LOGO DISCRETO EN ESQUINA PARA FIRMA DE MARCA */}
      <div className="absolute bottom-8 right-10 z-20 opacity-50 pointer-events-none transition-opacity hover:opacity-100 duration-500 hidden sm:block">
        <Image
          src="https://inforosario.com/logostream.png"
          alt="StreamFLIX Logo"
          width={100}
          height={26}
          style={RED_FILTER}
          className="h-auto w-auto"
          unoptimized
        />
      </div>
    </div>
  );
}

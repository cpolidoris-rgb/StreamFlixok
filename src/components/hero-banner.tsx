'use client';

import { Play, Info, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
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
 * Efecto de flashes de cámara aleatorios
 */
function CameraFlashes() {
  const flashes = [
    { top: '20%', left: '15%', delay: '0.2s' },
    { top: '45%', left: '80%', delay: '1.5s' },
    { top: '10%', left: '60%', delay: '2.8s' },
    { top: '70%', left: '30%', delay: '0.8s' },
    { top: '30%', left: '90%', delay: '3.2s' },
    { top: '85%', left: '10%', delay: '2.1s' },
    { top: '55%', left: '50%', delay: '3.7s' },
    { top: '15%', left: '40%', delay: '0.5s' },
  ];

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      {flashes.map((f, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 bg-white rounded-full blur-md animate-camera-flash"
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
    <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-zinc-950 rounded-[40px] mx-auto container shadow-2xl border border-white/10 group">
      {/* IMAGEN DE FONDO - ALTA CLARIDAD (OPACIDAD 80%) */}
      <Image
        src="https://inforosario.com/lali.png"
        alt="Lali Espósito"
        fill
        className="object-cover object-top opacity-80 transition-transform duration-[30s] group-hover:scale-110 ease-out"
        priority
        unoptimized
      />
      
      {/* EFECTO FLASHES DE CÁMARA */}
      <CameraFlashes />
      
      {/* MÁSCARAS DE DEGRADADO - REFINADAS PARA MAYOR CLARIDAD */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/10 to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
      
      {/* CONTENIDO PRINCIPAL - CENTRADO VERTICALMENTE */}
      <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 z-20">
        <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-left-6 duration-1000">
            <div className="flex items-center gap-3">
                <Badge className="bg-[#ff85c2]/20 text-[#ff85c2] border-[#ff85c2]/30 font-black uppercase text-[8px] tracking-[0.3em] px-3 py-1">
                    CONTENIDO EXCLUSIVO
                </Badge>
                <div className="flex items-center gap-1.5 text-amber-400/80">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Original</span>
                </div>
            </div>
            
            <div className="flex flex-col">
              {/* Lali - Firma manuscrita elegante */}
              <h1 className="text-6xl md:text-[9.5rem] font-light font-serif italic text-[#ff85c2] leading-none drop-shadow-[0_0_20px_rgba(255,133,194,0.3)] opacity-95 lowercase capitalize">
                  Lali
              </h1>
              <h2 className="text-[10px] md:text-xs font-bold font-body tracking-[0.6em] uppercase text-white/60 mt-4 pl-1 border-l-2 border-[#ff85c2]/30">
                  Disciplina <span className="text-white/30">Tour 2026</span>
              </h2>
            </div>
            
            <p className="text-xs md:text-sm text-white/80 font-medium italic leading-relaxed max-w-sm pl-1 mt-4 drop-shadow-md">
              "El show que cambió el pop argentino. Reviví el Disciplina Tour con calidad cinematográfica."
            </p>

            <div className="flex items-center gap-4 pt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-white text-black hover:bg-zinc-200 font-black px-10 h-12 text-[11px] rounded-full transition-all active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.1)] flex items-center gap-2.5 uppercase tracking-widest">
                    <Play className="h-3.5 w-3.5 fill-black" /> REPRODUCIR AHORA
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-950 border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase italic text-primary tracking-tighter">Suscripción Gold Requerida</DialogTitle>
                    <DialogDescription className="text-zinc-400">Este contenido premium solo está disponible para usuarios con planes activos.</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <button className="bg-black/40 backdrop-blur-3xl text-white hover:bg-black/60 font-black px-10 h-12 text-[11px] rounded-full transition-all active:scale-95 border border-white/20 flex items-center gap-2.5 uppercase tracking-widest">
                <Info className="h-3.5 w-3.5" /> DETALLES
              </button>
            </div>
        </div>
      </div>

      {/* LOGO DISCRETO EN ESQUINA PARA FIRMA DE MARCA */}
      <div className="absolute bottom-10 right-12 z-20 opacity-40 pointer-events-none transition-opacity hover:opacity-100 duration-500">
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

import React, { useState } from 'react';
import { Play, Info, Plus, Check, Radio, ChevronRight, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { StreamItem } from '../types';

interface HeroBannerProps {
  items: StreamItem[];
  onPlay: (item: StreamItem) => void;
  onOpenDetails: (item: StreamItem) => void;
  myList: string[];
  onToggleMyList: (id: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  items,
  onPlay,
  onOpenDetails,
  myList,
  onToggleMyList
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex % items.length];
  const isInMyList = myList.includes(currentItem.id);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="relative w-full h-[75vh] sm:h-[82vh] lg:h-[88vh] overflow-hidden select-none bg-black">
      {/* Background Cinematic Image with Gradient overlays */}
      <div className="absolute inset-0">
        <img
          src={currentItem.backdropUrl}
          alt={currentItem.title}
          className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.05] transition-all duration-700 transform scale-100 hover:scale-102"
        />
        {/* Gradients for smooth fade and text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f13] via-[#0f0f13]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f13] via-[#0f0f13]/60 to-transparent max-w-3xl"></div>
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0b0b0f]/80 to-transparent"></div>
      </div>

      {/* Hero Content Information */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20 z-10">
        <div className="max-w-2xl space-y-4">
          
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {currentItem.isLive ? (
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-bold tracking-wider shadow-lg shadow-red-600/40">
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                <span>TRANSMISIÓN EN DIRECTO</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-red-600/80 text-white font-bold tracking-wider uppercase text-[11px]">
                <Sparkles className="w-3.5 h-3.5 mr-0.5" />
                DESTACADO DE HOY
              </span>
            )}

            {currentItem.top10Rank && (
              <span className="px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-amber-400 font-bold border border-amber-400/20">
                TOP #{currentItem.top10Rank} en StreamFlix
              </span>
            )}

            <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20">
              {currentItem.matchPercentage}% coincidencia
            </span>

            <span className="px-2 py-0.5 rounded bg-white/10 text-gray-200 text-[11px] font-bold">
              {currentItem.ageRating}
            </span>

            {currentItem.duration && (
              <span className="text-gray-300 font-medium">
                {currentItem.duration}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
            {currentItem.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-200/90 line-clamp-3 max-w-xl font-normal drop-shadow leading-relaxed">
            {currentItem.description}
          </p>

          {/* Tags & Genres */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {currentItem.genres.map(genre => (
              <span key={genre} className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300">
                {genre}
              </span>
            ))}
            {currentItem.tags.map(tag => (
              <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-black/40 text-gray-400 border border-white/5 font-mono">
                {tag}
              </span>
            ))}
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onPlay(currentItem)}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white hover:bg-gray-100 text-black font-extrabold text-base transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer active:scale-95"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>{currentItem.isLive ? 'Ver en Directo' : 'Reproducir'}</span>
            </button>

            <button
              onClick={() => onOpenDetails(currentItem)}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gray-600/40 hover:bg-gray-600/60 backdrop-blur-md text-white font-bold text-sm sm:text-base transition-all duration-200 border border-white/20 hover:border-white/40 cursor-pointer"
            >
              <Info className="w-5 h-5" />
              <span>Más información</span>
            </button>

            <button
              onClick={() => onToggleMyList(currentItem.id)}
              className={`p-3 rounded-xl backdrop-blur-md transition-all duration-200 border cursor-pointer ${
                isInMyList 
                  ? 'bg-red-600/80 text-white border-red-500 shadow-lg shadow-red-600/30' 
                  : 'bg-black/40 text-gray-300 hover:text-white hover:bg-white/10 border-white/20'
              }`}
              title={isInMyList ? 'Eliminar de Mi Lista' : 'Añadir a Mi Lista'}
            >
              {isInMyList ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5" />}
            </button>

            {/* Next featured title switch */}
            {items.length > 1 && (
              <button
                onClick={handleNext}
                className="flex items-center space-x-1.5 px-3 py-3 rounded-xl bg-black/40 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors ml-auto cursor-pointer"
                title="Siguiente título destacado"
              >
                <span>Siguiente ({currentIndex + 1}/{items.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

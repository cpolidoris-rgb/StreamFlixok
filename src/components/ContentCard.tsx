import React, { useState } from 'react';
import { Play, Plus, Check, Info, ThumbsUp, Radio, Users, Star } from 'lucide-react';
import { StreamItem } from '../types';

interface ContentCardProps {
  item: StreamItem;
  onPlay: (item: StreamItem) => void;
  onOpenDetails: (item: StreamItem) => void;
  isInMyList: boolean;
  onToggleMyList: (id: string) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onPlay,
  onOpenDetails,
  isInMyList,
  onToggleMyList,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group relative flex-none w-[200px] sm:w-[240px] md:w-[260px] cursor-pointer select-none transition-all duration-300">
      
      {/* Poster Image Container */}
      <div 
        onClick={() => onOpenDetails(item)}
        className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#16161f] shadow-lg group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 border border-white/5 group-hover:border-red-500/50"
      >
        <img
          src={item.backdropUrl || item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-108"
          loading="lazy"
        />

        {/* Live Stream Overlay or Badge */}
        {item.isLive && (
          <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            <span>EN VIVO</span>
          </div>
        )}

        {item.top10Rank && !item.isLive && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-amber-500/30 text-amber-400 text-[10px] font-black">
            TOP #{item.top10Rank}
          </div>
        )}

        {item.viewerCount && (
          <div className="absolute top-2.5 right-2.5 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-gray-200 text-[10px] font-medium border border-white/10">
            <Users className="w-3 h-3 text-red-400" />
            <span>{(item.viewerCount / 1000).toFixed(1)}k</span>
          </div>
        )}

        {/* Play Overlay Icon on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
            className="w-11 h-11 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Info Below */}
      <div className="mt-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <h3 
            onClick={() => onOpenDetails(item)}
            className="text-sm font-bold text-white truncate max-w-[75%] hover:text-red-400 transition-colors"
          >
            {item.title}
          </h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMyList(item.id);
              }}
              className={`p-1 rounded-full border transition-colors cursor-pointer ${
                isInMyList 
                  ? 'bg-red-600 text-white border-red-500' 
                  : 'bg-black/40 text-gray-300 hover:text-white border-white/20'
              }`}
              title={isInMyList ? 'En Mi Lista' : 'Añadir a Mi Lista'}
            >
              {isInMyList ? <Check className="w-3 h-3 stroke-[2.5]" /> : <Plus className="w-3 h-3" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className={`p-1 rounded-full border transition-colors cursor-pointer ${
                isLiked 
                  ? 'bg-blue-600 text-white border-blue-500' 
                  : 'bg-black/40 text-gray-300 hover:text-white border-white/20'
              }`}
              title="Me gusta"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-gray-400">
          <span className="text-emerald-400 font-bold">{item.matchPercentage}% match</span>
          <span className="px-1 py-0.2 rounded bg-white/10 text-gray-300 text-[10px] font-semibold">{item.ageRating}</span>
          <span>{item.duration || `${item.year}`}</span>
          {item.type === 'live' && (
            <span className="text-red-400 font-semibold truncate">• {item.streamCategory || 'Directo'}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1 text-[10px] text-gray-400">
          {item.genres.slice(0, 2).map(genre => (
            <span key={genre} className="bg-white/5 px-1.5 py-0.5 rounded text-gray-400">
              {genre}
            </span>
          ))}
          {item.tags?.[0] && (
            <span className="text-gray-500 font-mono">
              • {item.tags[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

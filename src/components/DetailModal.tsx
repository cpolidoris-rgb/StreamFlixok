import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Plus, 
  Check, 
  ThumbsUp, 
  Share2, 
  Star, 
  Film, 
  Tv, 
  Radio, 
  Users, 
  Sparkles,
  Calendar,
  Clock
} from 'lucide-react';
import { StreamItem } from '../types';

interface DetailModalProps {
  item: StreamItem;
  allItems: StreamItem[];
  onClose: () => void;
  onPlay: (item: StreamItem, episodeVideoUrl?: string) => void;
  isInMyList: boolean;
  onToggleMyList: (id: string) => void;
  onSelectItem: (item: StreamItem) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  item,
  allItems,
  onClose,
  onPlay,
  isInMyList,
  onToggleMyList,
  onSelectItem
}) => {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const similarItems = allItems.filter(
    other => other.id !== item.id && (
      other.type === item.type ||
      other.genres.some(g => item.genres.includes(g))
    )
  ).slice(0, 4);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const currentSeasonData = item.seasons?.find(s => s.seasonNumber === selectedSeason) || item.seasons?.[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#14141d] rounded-2xl shadow-2xl border border-white/10 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Banner Hero */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-black">
          <img
            src={item.backdropUrl}
            alt={item.title}
            className="w-full h-full object-cover object-center filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14141d] via-[#14141d]/30 to-transparent"></div>

          {/* Action Overlay in Banner */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">
                {item.title}
              </h2>
              {item.originalTitle && (
                <p className="text-xs sm:text-sm text-gray-300 font-medium italic">
                  Título original: {item.originalTitle}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPlay(item)}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-black font-extrabold text-sm sm:text-base shadow-xl cursor-pointer hover:scale-105 transition-transform"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>{item.isLive ? 'Ver en Directo' : 'Reproducir'}</span>
              </button>

              <button
                onClick={() => onToggleMyList(item.id)}
                className={`p-2.5 rounded-xl border backdrop-blur-md transition-colors cursor-pointer ${
                  isInMyList 
                    ? 'bg-red-600 text-white border-red-500' 
                    : 'bg-black/50 text-gray-300 hover:text-white border-white/20'
                }`}
                title={isInMyList ? 'Eliminar de Mi Lista' : 'Añadir a Mi Lista'}
              >
                {isInMyList ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2.5 rounded-xl border backdrop-blur-md transition-colors cursor-pointer ${
                  isLiked 
                    ? 'bg-blue-600 text-white border-blue-500' 
                    : 'bg-black/50 text-gray-300 hover:text-white border-white/20'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-black/50 hover:bg-white/10 text-gray-300 hover:text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
                title="Compartir enlace"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {copiedShare && (
          <div className="mx-6 mt-3 p-2 bg-emerald-600/20 border border-emerald-500/40 rounded-xl text-emerald-400 text-xs font-bold text-center">
            ¡Enlace copiado al portapapeles!
          </div>
        )}

        {/* Modal Body Details */}
        <div className="p-6 space-y-6">
          
          {/* Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Synopsis & tags */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
                <span className="text-emerald-400 font-extrabold px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20">
                  {item.matchPercentage}% coincidencia
                </span>
                <span className="text-gray-300">{item.year}</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-gray-200 text-[11px] font-bold">
                  {item.ageRating}
                </span>
                <span className="text-gray-300">{item.duration}</span>
                {item.isLive && (
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase">
                    DIRECTO
                  </span>
                )}
                {item.viewerCount && (
                  <span className="text-red-400 font-bold flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1" />
                    {(item.viewerCount / 1000).toFixed(1)}k espectadores
                  </span>
                )}
              </div>

              <p className="text-gray-200 text-sm leading-relaxed">
                {item.description}
              </p>

              {/* Badges / Specifications */}
              <div className="flex flex-wrap gap-2 pt-2">
                {item.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 font-mono">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column: Cast & Details */}
            <div className="space-y-3 text-xs text-gray-400 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
              {item.director && (
                <div>
                  <span className="text-gray-500 block">Dirección:</span>
                  <span className="text-gray-200 font-medium">{item.director}</span>
                </div>
              )}

              {item.streamerName && (
                <div>
                  <span className="text-gray-500 block">Streamer:</span>
                  <span className="text-gray-200 font-bold">{item.streamerName}</span>
                </div>
              )}

              {item.cast && item.cast.length > 0 && (
                <div>
                  <span className="text-gray-500 block">Reparto:</span>
                  <p className="text-gray-200 leading-snug">
                    {item.cast.join(', ')}
                  </p>
                </div>
              )}

              <div>
                <span className="text-gray-500 block">Géneros:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.genres.map(genre => (
                    <span key={genre} className="px-2 py-0.5 rounded-full bg-white/5 text-gray-300">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Episodes Section (if TV Series) */}
          {item.type === 'series' && item.seasons && (
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Tv className="w-5 h-5 text-red-500" />
                  <span>Episodios</span>
                </h3>

                {item.seasons.length > 1 && (
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-[#1c1c28] border border-white/15 text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {item.seasons.map(s => (
                      <option key={s.seasonNumber} value={s.seasonNumber}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Episode Cards Grid / List */}
              <div className="space-y-3">
                {currentSeasonData?.episodes.map(ep => (
                  <div
                    key={ep.id}
                    onClick={() => onPlay(item, ep.videoUrl)}
                    className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group"
                  >
                    <div className="relative aspect-[16/9] w-full sm:w-36 rounded-lg overflow-hidden bg-black flex-shrink-0">
                      <img src={ep.thumbnail} alt={ep.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 fill-white text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate">
                          {ep.title}
                        </h4>
                        <span className="text-xs text-gray-400 font-mono flex-shrink-0 ml-2">
                          {ep.duration}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                        {ep.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Content Recommendations */}
          {similarItems.length > 0 && (
            <div className="space-y-4 border-t border-white/10 pt-6">
              <h3 className="text-base font-bold text-white">
                Títulos similares recomendados
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarItems.map(sim => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectItem(sim)}
                    className="rounded-xl overflow-hidden bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer group"
                  >
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <img src={sim.backdropUrl || sim.posterUrl} alt={sim.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-emerald-400 font-bold">
                        {sim.matchPercentage}% match
                      </div>
                    </div>
                    <div className="p-2.5">
                      <h5 className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">
                        {sim.title}
                      </h5>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {sim.year} • {sim.ageRating}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

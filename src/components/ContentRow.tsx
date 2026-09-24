import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StreamItem } from '../types';
import { ContentCard } from './ContentCard';

interface ContentRowProps {
  title: string;
  icon?: React.ReactNode;
  subtitle?: string;
  items: StreamItem[];
  onPlay: (item: StreamItem) => void;
  onOpenDetails: (item: StreamItem) => void;
  myList: string[];
  onToggleMyList: (id: string) => void;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  title,
  icon,
  subtitle,
  items,
  onPlay,
  onOpenDetails,
  myList,
  onToggleMyList
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 350);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative space-y-3 py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Row Header */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-center space-x-2.5">
          {icon && <span className="text-red-500">{icon}</span>}
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {title}
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                {items.length}
              </span>
            </h2>
            {subtitle && (
              <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Scroll Arrow Buttons */}
        <div className="hidden sm:flex items-center space-x-1.5">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              canScrollLeft 
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/10' 
                : 'opacity-30 cursor-not-allowed text-gray-500 border-white/5'
            }`}
            aria-label="Desplazar a la izquierda"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              canScrollRight 
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/10' 
                : 'opacity-30 cursor-not-allowed text-gray-500 border-white/5'
            }`}
            aria-label="Desplazar a la derecha"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row Content Carousel */}
      <div
        ref={rowRef}
        onScroll={checkScroll}
        className="flex space-x-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-1"
      >
        {items.map(item => (
          <ContentCard
            key={item.id}
            item={item}
            onPlay={onPlay}
            onOpenDetails={onOpenDetails}
            isInMyList={myList.includes(item.id)}
            onToggleMyList={onToggleMyList}
          />
        ))}
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  RotateCw, 
  Maximize, 
  Minimize, 
  X, 
  Settings, 
  MessageSquare, 
  Radio, 
  Sliders, 
  Subtitles,
  Share2,
  Tv
} from 'lucide-react';
import { StreamItem, UserProfile } from '../types';
import { LiveChatPanel } from './LiveChatPanel';

interface VideoPlayerModalProps {
  item: StreamItem;
  currentUser: UserProfile;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  item,
  currentUser,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('4K Ultra HD');
  const [subtitle, setSubtitle] = useState<'off' | 'es' | 'en'>('es');
  const [showSettings, setShowSettings] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettings(false);
      }
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen?.();
        } else {
          onClose();
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, isFullscreen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    showToast(`Velocidad: ${speed}x`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row select-none overflow-hidden"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-2xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Main Video Viewport */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        
        {/* Video Element */}
        <video
          ref={videoRef}
          src={item.videoUrl}
          autoPlay
          playsInline
          onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
          onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
        />

        {/* Top Header Overlay */}
        <div className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Cerrar reproductor (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg text-white drop-shadow">
                  {item.title}
                </span>
                {item.isLive && (
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px] uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    EN VIVO
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300">
                {item.genres.join(' • ')} • {quality}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {item.isLive && (
              <button
                onClick={() => setShowLiveChat(!showLiveChat)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  showLiveChat 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
              </button>
            )}

            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('¡Enlace de transmisión copiado al portapapeles!');
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Compartir stream"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Pause Indicator Overlay */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transform scale-110 transition-transform">
              <Play className="w-10 h-10 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Bottom Control Bar */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-2.5 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          
          {/* Progress Timeline Scrubber */}
          {!item.isLive && (
            <div className="flex items-center space-x-3 text-xs text-gray-300 font-mono">
              <span>{formatTime(currentTime)}</span>
              <div className="relative flex-1 group">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-red-600 hover:h-2.5 transition-all"
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          )}

          {/* Action Buttons Toolbar */}
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-red-400 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
              </button>

              {!item.isLive && (
                <>
                  <button
                    onClick={() => skipTime(-10)}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Retroceder 10s"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => skipTime(10)}
                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Avanzar 10s"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Volume Slider */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gray-300 transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>

              {item.isLive && (
                <div className="flex items-center space-x-1.5 text-xs text-red-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>EN DIRECTO</span>
                </div>
              )}
            </div>

            {/* Right Controls */}
            <div className="relative flex items-center space-x-3">
              {/* Settings Dropdown Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ${
                  showSettings ? 'text-red-400 bg-white/10' : ''
                }`}
                title="Configuración de reproducción"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                title="Pantalla completa (F)"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>

              {/* Settings Popup Menu */}
              {showSettings && (
                <div className="absolute right-0 bottom-12 w-64 bg-[#181822] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 space-y-3">
                  <div className="text-xs font-bold text-gray-300 border-b border-white/10 pb-1.5">
                    Ajustes de Stream
                  </div>

                  {/* Quality selector */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 block mb-1">Calidad de Video</label>
                    <div className="grid grid-cols-3 gap-1 text-[11px]">
                      {['4K Ultra HD', '1080p 60', '720p'].map(q => (
                        <button
                          key={q}
                          onClick={() => {
                            setQuality(q);
                            showToast(`Calidad: ${q}`);
                          }}
                          className={`py-1 rounded font-bold border transition-colors ${
                            quality === q 
                              ? 'bg-red-600 text-white border-red-500' 
                              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {q.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Speed selector */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 block mb-1">Velocidad</label>
                    <div className="flex space-x-1 text-[11px]">
                      {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`flex-1 py-1 rounded font-bold border transition-colors ${
                            playbackSpeed === speed 
                              ? 'bg-white text-black border-white' 
                              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subtitles selector */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 block mb-1">Subtítulos</label>
                    <div className="grid grid-cols-3 gap-1 text-[11px]">
                      {[
                        { id: 'off', label: 'Desactivado' },
                        { id: 'es', label: 'Español' },
                        { id: 'en', label: 'English' }
                      ].map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setSubtitle(s.id as any);
                            showToast(`Subtítulos: ${s.label}`);
                          }}
                          className={`py-1 rounded font-bold border transition-colors truncate ${
                            subtitle === s.id 
                              ? 'bg-red-600 text-white border-red-500' 
                              : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Live Stream Interactive Chat Sidebar */}
      {item.isLive && showLiveChat && (
        <div className="h-64 sm:h-80 md:h-full flex-shrink-0 z-20">
          <LiveChatPanel streamItem={item} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
};

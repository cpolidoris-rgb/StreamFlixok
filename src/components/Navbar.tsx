import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Search, 
  Bell, 
  User, 
  Bookmark, 
  Radio, 
  Tv, 
  Film, 
  TrendingUp, 
  Flame, 
  X, 
  Check, 
  ChevronDown, 
  Menu 
} from 'lucide-react';
import { UserProfile, StreamItem } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  myListCount: number;
  activeProfile: UserProfile;
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectItem: (item: StreamItem) => void;
  allItems: StreamItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  myListCount,
  activeProfile,
  profiles,
  onSelectProfile,
  searchQuery,
  onSearchChange,
  onSelectItem,
  allItems
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const searchResults = searchQuery.trim()
    ? allItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.streamerName && item.streamerName.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Flame },
    { id: 'series', label: 'Series', icon: Tv },
    { id: 'peliculas', label: 'Películas', icon: Film },
    { id: 'directos', label: 'Directos', icon: Radio, isLiveBadge: true },
    { id: 'tendencias', label: 'Tendencias', icon: TrendingUp },
    { id: 'milista', label: 'Mi Lista', icon: Bookmark, badgeCount: myListCount },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#0b0b0f]/95 backdrop-blur-md shadow-2xl border-b border-white/5 py-3' 
        : 'bg-gradient-to-b from-[#0b0b0f]/90 via-[#0b0b0f]/40 to-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center space-x-8">
          <button 
            onClick={() => onSelectTab('inicio')}
            className="flex items-center space-x-2 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
            <div className="flex items-baseline">
              <span className="font-display text-2xl tracking-wider font-black text-white bg-gradient-to-r from-white via-gray-100 to-red-400 bg-clip-text text-transparent">
                STREAMFLIX
              </span>
              <span className="ml-1 text-xs font-black px-1.5 py-0.5 rounded bg-red-600 text-white shadow-sm uppercase tracking-wider">
                OK
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onSearchChange('');
                  }}
                  className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isActive 
                      ? 'text-white bg-white/10 shadow-inner' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.isLiveBadge ? 'text-red-500 animate-pulse' : ''}`} />
                  <span>{item.label}</span>
                  {item.isLiveBadge && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                  {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-600 text-white">
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Actions: Search, Notifications, Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Search Box */}
          <div className="relative">
            <div className={`flex items-center transition-all duration-300 rounded-full border ${
              searchOpen || searchQuery 
                ? 'w-48 sm:w-64 bg-black/60 border-white/20 px-3 py-1.5' 
                : 'w-9 h-9 border-transparent justify-center'
            }`}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                title="Buscar títulos, géneros o directos"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {(searchOpen || searchQuery) && (
                <input
                  type="text"
                  placeholder="Buscar películas, directos..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent border-none text-white text-xs sm:text-sm pl-2 focus:outline-none placeholder-gray-400"
                />
              )}
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Instant Search Suggestions Dropdown */}
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute right-0 top-12 w-72 sm:w-80 bg-[#16161e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-white/5">
                <div className="p-2 text-xs font-semibold uppercase tracking-wider text-gray-400 bg-white/5">
                  Resultados sugeridos
                </div>
                {searchResults.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectItem(item);
                      onSearchChange('');
                      setSearchOpen(false);
                    }}
                    className="w-full p-2.5 flex items-center space-x-3 hover:bg-white/10 text-left transition-colors cursor-pointer group"
                  >
                    <img 
                      src={item.posterUrl} 
                      alt={item.title} 
                      className="w-10 h-14 object-cover rounded shadow group-hover:scale-105 transition-transform" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-400 mt-0.5">
                        <span className="text-red-400 font-bold uppercase">{item.type === 'live' ? 'En Vivo' : item.type}</span>
                        <span>•</span>
                        <span>{item.year}</span>
                        <span>•</span>
                        <span className="text-green-400 font-medium">{item.matchPercentage}% match</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-72 sm:w-80 bg-[#16161e] border border-white/10 rounded-xl shadow-2xl p-3 z-50 divide-y divide-white/5">
                <div className="flex items-center justify-between pb-2 mb-2">
                  <h4 className="text-sm font-bold text-white">Notificaciones</h4>
                  <span className="text-[11px] text-red-400 font-semibold">2 nuevas</span>
                </div>
                <div className="py-2 space-y-2">
                  <div className="flex items-start space-x-2.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-200 font-semibold">¡Alex Esports está en directo!</p>
                      <p className="text-gray-400 text-[11px]">Final del Torneo Masters Esports 2026</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2.5 text-xs pt-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-200 font-semibold">Nuevo estreno 4K HDR</p>
                      <p className="text-gray-400 text-[11px]">Horizonte Cero ya disponible para reproducir</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group"
            >
              <img 
                src={activeProfile.avatar} 
                alt={activeProfile.name} 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-2 ring-transparent group-hover:ring-red-500 transition-all"
              />
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-52 bg-[#16161e] border border-white/10 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-2 py-1.5 border-b border-white/10 mb-1">
                  <p className="text-xs text-gray-400">Perfil activo</p>
                  <p className="text-sm font-bold text-white truncate">{activeProfile.name}</p>
                </div>
                <div className="space-y-1">
                  {profiles.map(profile => (
                    <button
                      key={profile.id}
                      onClick={() => {
                        onSelectProfile(profile);
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-xs font-medium text-left hover:bg-white/10 text-gray-200 transition-colors cursor-pointer"
                    >
                      <img src={profile.avatar} alt={profile.name} className="w-6 h-6 rounded-md object-cover" />
                      <span className="flex-1 truncate">{profile.name}</span>
                      {activeProfile.id === profile.id && (
                        <Check className="w-3.5 h-3.5 text-red-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111118] border-b border-white/10 px-4 py-3 mt-2 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-red-600/20 text-red-400 font-bold' : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.isLiveBadge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600 text-white">LIVE</span>
                )}
                {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-600 text-white">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};

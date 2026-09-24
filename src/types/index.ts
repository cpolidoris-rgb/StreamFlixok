export type ContentType = 'movie' | 'series' | 'live';

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  seasonNumber: number;
  duration: string;
  thumbnail: string;
  description: string;
  videoUrl: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface StreamItem {
  id: string;
  title: string;
  originalTitle?: string;
  type: ContentType;
  description: string;
  backdropUrl: string;
  posterUrl: string;
  rating: number; // e.g. 4.8
  matchPercentage: number; // e.g. 98%
  year: number;
  duration?: string; // e.g. "2h 15m" or "3 Temporadas"
  ageRating: 'TP' | '12+' | '16+' | '18+';
  genres: string[];
  director?: string;
  cast: string[];
  videoUrl: string;
  trailerUrl?: string;
  featured?: boolean;
  trending?: boolean;
  top10Rank?: number;
  isLive?: boolean;
  viewerCount?: number;
  streamerName?: string;
  streamerAvatar?: string;
  streamCategory?: string;
  seasons?: Season[];
  tags: string[];
}

export interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  badge?: 'MOD' | 'VIP' | 'SUB' | 'STREAMER';
  isDonation?: boolean;
  donationAmount?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
}

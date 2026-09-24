import { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  joinDate: Timestamp;
  avatarUrl?: string;
  isAdmin?: boolean;
  favorites?: string[];
  preferredCategoryIds?: string[];
  preferredTagIds?: string[];
};

export type Program = {
  id: string;
  title: string;
  description: string;
  dayOfWeek: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  startTime: string;
  endTime?: string;
};

export type Stream = {
  id: string;
  title: string;
  streamer: string;
  description?: string;
  viewerCount: number;
  category: string;
  categoryId?: string;
  tags: string[];
  tagIds?: string[];
  thumbnailUrl: string;
  platform: 'YouTube' | 'Twitch' | 'Kick' | 'Spotify' | 'Otro';
  platformChannelId?: string;
  streamUrl?: string;
  liveVideoId?: string;
  schedule?: Program[];
  featured?: boolean;
  order?: number;
  status?: 'pending' | 'published' | 'rejected';
  ownerId?: string;
  situation?: string;
  isWebRTC?: boolean;
  broadcastType?: string;
  isLive?: boolean;
  startedAt?: Timestamp;
  lastOnlineAt?: Timestamp;
};

export type Message = {
  id: string;
  text: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  timestamp: Timestamp;
};

export type Category = {
    id: string;
    name: string;
    description?: string;
    iconUrl?: string;
}

export type Tag = {
    id: string;
    name: string;
    description?: string;
}

export type LiveStatus = {
    status: 'live' | 'offline' | 'loading' | 'error' | 'unknown';
    viewerCount: number | null;
    errorMessage?: string;
    liveVideoId?: string;
};

export type GeoLocation = {
  country?: string;
  region?: string;
  city?: string;
};

export type UserActivity = {
  id: string;
  userId: string;
  streamId: string;
  streamerName: string;
  programName?: string;
  viewCount: number;
  watchTimeSeconds: number;
  lastViewed: Timestamp;
  location?: GeoLocation;
};

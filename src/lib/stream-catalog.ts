import type { Stream } from './data';
import { CHANNEL_SCHEDULES } from '@/data/channelSchedules';

export interface ChannelMasterData {
  id: string;
  aliases: string[];
  streamer: string;
  title: string;
  category: string;
  platform: string;
  platformChannelId?: string;
  liveVideoId: string;
  streamUrl: string;
  thumbnailUrl: string;
  viewerCount: number;
  isLive: boolean;
  situation: 'live' | 'offline';
  description?: string;
  tags?: string[];
}

export const MASTER_CHANNELS: Record<string, ChannelMasterData> = {
  luzu: {
    id: 'luzu_live',
    aliases: ['luzu_live', 'luzu-tv', 'luzu'],
    streamer: 'LUZU TV',
    title: 'Nadie Dice Nada - En Vivo',
    category: 'Streaming',
    platform: 'YouTube',
    platformChannelId: 'UCe5j3mN_D7f0xWvUqE0aM6g',
    liveVideoId: 'xLUuVrESidE',
    streamUrl: 'https://www.youtube.com/watch?v=xLUuVrESidE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 94200,
    isLive: true,
    situation: 'live',
    tags: ['Luzu', 'NadieDiceNada', 'Humor', 'BuenosAires']
  },
  olga: {
    id: 'olga_live',
    aliases: ['olga_live', 'olga-envivo', 'olga'],
    streamer: 'OLGA',
    title: 'Soñé Que Volaba - Migue Granados',
    category: 'Streaming',
    platform: 'YouTube',
    platformChannelId: 'UCgB6Jp_r4x59rV4hW9m0X_A',
    liveVideoId: 'TC9cYaiATFA',
    streamUrl: 'https://www.youtube.com/watch?v=TC9cYaiATFA',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 88700,
    isLive: true,
    situation: 'live',
    tags: ['Olga', 'MigueGranados', 'Música', 'Humor']
  },
  blender: {
    id: 'blender_live',
    aliases: ['blender_live', 'blender-oficial', 'blender', 'estoesblender'],
    streamer: 'BLENDER',
    title: 'Hay Algo Ahí - Tomás Rebord',
    category: 'Streaming',
    platform: 'YouTube',
    platformChannelId: 'UCpW5FzX9_jE6pZ2k8M1qQ9w',
    liveVideoId: 'Qs2QCHywNHo',
    streamUrl: 'https://www.youtube.com/watch?v=Qs2QCHywNHo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 41200,
    isLive: true,
    situation: 'live',
    tags: ['Blender', 'Actualidad', 'Debate']
  },
  gelatina: {
    id: 'gelatina_live',
    aliases: ['gelatina_live', 'gelatina-canal', 'gelatina'],
    streamer: 'GELATINA',
    title: 'Tres Estrellas - Pedro Rosemblat',
    category: 'Streaming',
    platform: 'YouTube',
    platformChannelId: 'UCtG1Jp_yH4_2x8k3d1l5p9A',
    liveVideoId: 'z4Ly8Z9YGRA',
    streamUrl: 'https://www.youtube.com/watch?v=z4Ly8Z9YGRA',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 36500,
    isLive: true,
    situation: 'live',
    tags: ['Gelatina', 'Jingles', 'Política']
  },
  bondi: {
    id: 'bondi_live',
    aliases: ['bondi_live', 'bondi-live', 'bondi'],
    streamer: 'BONDI LIVE',
    title: 'Bondi Live Streaming Oficial',
    category: 'Streaming',
    platform: 'YouTube',
    platformChannelId: 'UCr8t0_p8q4y1k9s6w3m2b1A',
    liveVideoId: 'H2c5wHPCx0E',
    streamUrl: 'https://www.youtube.com/watch?v=H2c5wHPCx0E',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520523839898-50712140d995?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 29800,
    isLive: true,
    situation: 'live',
    tags: ['Bondi', 'Espectáculos', 'Farándula']
  },
  tn: {
    id: 'tn_live',
    aliases: ['tn_live', 'tn-noticias', 'tn', 'todonoticias'],
    streamer: 'TN',
    title: 'TN En Vivo 24 Horas - Todo Noticias',
    category: 'TV Noticias',
    platform: 'YouTube',
    platformChannelId: 'UCj6PcyLvpnIRT_2W_EGly9g',
    liveVideoId: 'cb12KmMMDJA',
    streamUrl: 'https://www.youtube.com/watch?v=cb12KmMMDJA',
    thumbnailUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 75400,
    isLive: true,
    situation: 'live',
    tags: ['TN', 'Noticias', 'Argentina', 'Urgente']
  },
  c5n: {
    id: 'c5n_live',
    aliases: ['c5n_live', 'c5n-vivo', 'c5n'],
    streamer: 'C5N',
    title: 'C5N La Realidad en Vivo',
    category: 'TV Noticias',
    platform: 'YouTube',
    platformChannelId: 'UCFgk2Q2mVO1BklRQhSv6p0w',
    liveVideoId: 'j6oh4Kqz3UM',
    streamUrl: 'https://www.youtube.com/watch?v=j6oh4Kqz3UM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 68900,
    isLive: true,
    situation: 'live',
    tags: ['C5N', 'Noticias', 'Economía', 'Política']
  },
  ln: {
    id: 'ln_live',
    aliases: ['ln_live', 'lanacion-mas', 'ln+'],
    streamer: 'LA NACIÓN +',
    title: 'LN+ La Nación Más en Vivo',
    category: 'TV Noticias',
    platform: 'YouTube',
    platformChannelId: 'UC2bS9n4t0_2b7q1w8m9x4vA',
    liveVideoId: '45nwTjTZ4jk',
    streamUrl: 'https://www.youtube.com/watch?v=45nwTjTZ4jk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 54100,
    isLive: true,
    situation: 'live',
    tags: ['LN+', 'Opinión', 'Debate', 'Información']
  },
  cronica: {
    id: 'cronica_live',
    aliases: ['cronica_live', 'cronica-tv', 'cronica'],
    streamer: 'CRÓNICA TV',
    title: 'Crónica TV - Firme Junto al Pueblo',
    category: 'TV Noticias',
    platform: 'YouTube',
    platformChannelId: 'UCp2m4b8r6s9k0w1y3x4z5qA',
    liveVideoId: 'hw4uHyct4vg',
    streamUrl: 'https://www.youtube.com/watch?v=hw4uHyct4vg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 44300,
    isLive: true,
    situation: 'live',
    tags: ['Cronica', 'PlacasRojas', 'Popular']
  },
  a24: {
    id: 'a24_live',
    aliases: ['a24_live', 'a24'],
    streamer: 'A24',
    title: 'A24 En Vivo - Noticias y Actualidad',
    category: 'TV Noticias',
    platform: 'YouTube',
    platformChannelId: 'UCR9120YBAqMfntqgRTKmkjQ',
    liveVideoId: 'C1DhpJ07ZuE',
    streamUrl: 'https://www.youtube.com/watch?v=C1DhpJ07ZuE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 33400,
    isLive: true,
    situation: 'live',
    tags: ['A24', 'Noticias', 'Argentina']
  },
  c26: {
    id: 'c26_live',
    aliases: ['c26_live', 'canal-26', 'canal 26'],
    streamer: 'CANAL 26',
    title: 'Canal 26 En Vivo - Noticias Internacionales',
    category: 'TV Noticias',
    platform: 'YouTube',
    platformChannelId: 'UC_mC-UasLg_L_oIe6S_DymA',
    liveVideoId: 'e31cRMBZprg',
    streamUrl: 'https://www.youtube.com/watch?v=e31cRMBZprg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 26800,
    isLive: true,
    situation: 'live',
    tags: ['Canal26', 'Internacional', 'Noticias']
  },
  america: {
    id: 'america_live',
    aliases: ['america_live', 'america-tv', 'américa'],
    streamer: 'AMÉRICA TV',
    title: 'América TV En Vivo',
    category: 'TV Abierta',
    platform: 'YouTube',
    platformChannelId: 'UC6NVDkuzY2exMOVFw4i9oHw',
    liveVideoId: 'zcWXboTnous',
    streamUrl: 'https://www.youtube.com/watch?v=zcWXboTnous',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 39500,
    isLive: true,
    situation: 'live',
    tags: ['AmericaTV', 'Entretenimiento', 'Intrusos']
  },
  elnueve: {
    id: 'elnueve_live',
    aliases: ['elnueve_live', 'el-nueve', 'canal 9', 'el nueve'],
    streamer: 'EL NUEVE',
    title: 'El Nueve En Vivo - Canal 9 HD',
    category: 'TV Abierta',
    platform: 'YouTube',
    platformChannelId: 'UCUT4NmGqjrVpKf2JyiS_bbA',
    liveVideoId: 'C1DhpJ07ZuE',
    streamUrl: 'https://www.youtube.com/watch?v=C1DhpJ07ZuE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 31000,
    isLive: true,
    situation: 'live',
    tags: ['ElNueve', 'Bendita', 'Televisión']
  },
  telefe: {
    id: 'telefe_live',
    aliases: ['telefe_live', 'telefe-canal', 'telefe'],
    streamer: 'TELEFE',
    title: 'Telefe En Vivo Oficial',
    category: 'TV Abierta',
    platform: 'YouTube',
    platformChannelId: 'UCbfWreid8D5W9bghP6_7bZg',
    liveVideoId: 'XhAYcYpPzTc',
    streamUrl: 'https://www.youtube.com/watch?v=XhAYcYpPzTc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 82000,
    isLive: true,
    situation: 'live',
    tags: ['Telefe', 'GranHermano', 'Familiar']
  },
  eltrece: {
    id: 'eltrece_live',
    aliases: ['eltrece_live', 'eltrece-canal', 'el trece', 'canal 13'],
    streamer: 'EL TRECE',
    title: 'El Trece En Vivo HD',
    category: 'TV Abierta',
    platform: 'YouTube',
    platformChannelId: 'UCuS0V88R_nSre3O644V6-hA',
    liveVideoId: 'tg6w_6pO6VQ',
    streamUrl: 'https://www.youtube.com/watch?v=tg6w_6pO6VQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 51200,
    isLive: true,
    situation: 'live',
    tags: ['ElTrece', 'Canal13', 'Entretenimiento']
  },
  tvpublica: {
    id: 'tvpublica_live',
    aliases: ['tvpublica_live', 'tv-publica', 'tv publica'],
    streamer: 'TV PÚBLICA',
    title: 'Televisión Pública Argentina',
    category: 'TV Abierta',
    platform: 'YouTube',
    platformChannelId: 'UCs231K71Bnu5295_x0MB5Pg',
    liveVideoId: 'fXeJQyeJoyE',
    streamUrl: 'https://www.youtube.com/watch?v=fXeJQyeJoyE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 22400,
    isLive: true,
    situation: 'live',
    tags: ['TVPublica', 'Cultura', 'Federal']
  },
  tycsports: {
    id: 'tycsports_live',
    aliases: ['tycsports_live', 'tyc-sports', 'tyc sports'],
    streamer: 'TYC SPORTS',
    title: 'TyC Sports En Vivo - Fútbol y Polideportivo',
    category: 'Deportes',
    platform: 'YouTube',
    platformChannelId: 'UC72ZaBKI-Bo5fjmWEYonhJw',
    liveVideoId: 'bfVhVZ8Ol8o',
    streamUrl: 'https://www.youtube.com/watch?v=bfVhVZ8Ol8o',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 79500,
    isLive: true,
    situation: 'live',
    tags: ['TyCSports', 'Fútbol', 'AFA', 'Selección']
  },
  urbanaplay: {
    id: 'urbanaplay_live',
    aliases: ['urbanaplay_live', 'urbana-play', 'urbana play'],
    streamer: 'URBANA PLAY',
    title: 'Urbana Play 104.3 FM - Video Stream',
    category: 'Radio',
    platform: 'YouTube',
    platformChannelId: 'UCC1kfsMJko54AqxtcFECt-A',
    liveVideoId: 'CY5XUjC5XJc',
    streamUrl: 'https://www.youtube.com/watch?v=CY5XUjC5XJc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 46800,
    isLive: true,
    situation: 'live',
    tags: ['UrbanaPlay', 'AndyKusnetzoff', 'Musica']
  },
  vorterix: {
    id: 'vorterix_live',
    aliases: ['vorterix_live', 'vorterix-oficial', 'vorterix'],
    streamer: 'VORTERIX',
    title: 'Vorterix Multimedia - Mario Pergolini',
    category: 'Radio',
    platform: 'YouTube',
    platformChannelId: 'UC93fR_H_K_TOn74f4S7hXzw',
    liveVideoId: 'PB1Zu7AkMTU',
    streamUrl: 'https://www.youtube.com/watch?v=PB1Zu7AkMTU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 38200,
    isLive: true,
    situation: 'live',
    tags: ['Vorterix', 'Pergolini', 'Rock', 'Stream']
  },
  neura: {
    id: 'neura_live',
    aliases: ['neura_live', 'neura-media', 'neura'],
    streamer: 'NEURA',
    title: 'Neura Media En Vivo - Alejandro Fantino',
    category: 'Streaming',
    platform: 'YouTube',
    liveVideoId: 'Ucxe455nYm8',
    streamUrl: 'https://www.youtube.com/watch?v=Ucxe455nYm8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 35600,
    isLive: true,
    situation: 'live',
    tags: ['Neura', 'Fantino', 'Streaming']
  },
  carajo: {
    id: 'carajo_live',
    aliases: ['carajo_live', 'carajo-stream', 'carajo'],
    streamer: 'CARAJO',
    title: 'Carajo Stream En Vivo',
    category: 'Streaming',
    platform: 'YouTube',
    liveVideoId: 'x6VVeWPy8C8',
    streamUrl: 'https://www.youtube.com/watch?v=x6VVeWPy8C8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520523839898-50712140d995?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 22100,
    isLive: true,
    situation: 'live',
    tags: ['Carajo', 'Stream', 'Debate']
  },
  radioconvos: {
    id: 'radioconvos_live',
    aliases: ['radioconvos_live', 'radio-con-vos', 'radio con vos'],
    streamer: 'RADIO CON VOS',
    title: 'Radio Con Vos 89.9 FM En Vivo',
    category: 'Radio',
    platform: 'YouTube',
    liveVideoId: 'NP5jNOnGiMU',
    streamUrl: 'https://www.youtube.com/watch?v=NP5jNOnGiMU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 19800,
    isLive: true,
    situation: 'live',
    tags: ['RadioConVos', 'Periodismo']
  },
  parenlamano: {
    id: 'parenlamano_live',
    aliases: ['parenlamano_live', 'luquitas-rodriguez', 'paren la mano', 'luquitas'],
    streamer: 'PAREN LA MANO',
    title: 'Paren La Mano - Luquitas Rodríguez',
    category: 'Streamers',
    platform: 'YouTube',
    liveVideoId: 'PB1Zu7AkMTU',
    streamUrl: 'https://www.youtube.com/watch?v=PB1Zu7AkMTU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 59300,
    isLive: true,
    situation: 'live',
    tags: ['ParenLaMano', 'Luquitas', 'Humor']
  },
  spreen: {
    id: 'spreen_live',
    aliases: ['spreen_live', 'spreen-stream', 'spreen'],
    streamer: 'SPREEN',
    title: 'Spreen - Directos y Charla',
    category: 'Streamers',
    platform: 'Twitch',
    platformChannelId: 'elspreen',
    liveVideoId: '',
    streamUrl: 'https://twitch.tv/elspreen',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 65400,
    isLive: true,
    situation: 'live',
    tags: ['Spreen', 'Twitch', 'Gaming']
  },
  davoo: {
    id: 'davoo_live',
    aliases: ['davoo_live', 'davoo-xeneize', 'davoo'],
    streamer: 'DAVOO XENEIZE',
    title: 'Davoo Xeneize - Directo de Fútbol',
    category: 'Streamers',
    platform: 'Kick',
    liveVideoId: '',
    streamUrl: 'https://kick.com/davooxeneize',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 42100,
    isLive: true,
    situation: 'live',
    tags: ['Davoo', 'Kick', 'Boca', 'Fútbol']
  },
  la100: {
    id: 'la100_live',
    aliases: ['la100_live', 'la-100', 'la 100'],
    streamer: 'LA 100',
    title: 'La 100 En Vivo - Santiago del Moro y Guido Kaczka',
    category: 'Radio',
    platform: 'YouTube',
    liveVideoId: 'CY5XUjC5XJc',
    streamUrl: 'https://www.youtube.com/watch?v=CY5XUjC5XJc',
    thumbnailUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 28400,
    isLive: true,
    situation: 'live',
    tags: ['La100', 'Música', 'Radio']
  },
  mitre: {
    id: 'mitre_live',
    aliases: ['mitre_live', 'radio-mitre', 'mitre'],
    streamer: 'RADIO MITRE',
    title: 'Radio Mitre 790 AM En Vivo',
    category: 'Radio',
    platform: 'YouTube',
    liveVideoId: 'j6oh4Kqz3UM',
    streamUrl: 'https://www.youtube.com/watch?v=j6oh4Kqz3UM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 34100,
    isLive: true,
    situation: 'live',
    tags: ['Mitre', 'Noticias', 'Radio']
  },
  aspen: {
    id: 'aspen_live',
    aliases: ['aspen_live', 'aspen-102', 'aspen'],
    streamer: 'ASPEN',
    title: 'Aspen 102.3 FM - Los Clásicos de Tu Vida',
    category: 'Radio',
    platform: 'YouTube',
    liveVideoId: 'Hc0Ocwn9nxM',
    streamUrl: 'https://www.youtube.com/watch?v=Hc0Ocwn9nxM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 21300,
    isLive: true,
    situation: 'live',
    tags: ['Aspen', 'Clásicos', 'Música']
  },
  dsports: {
    id: 'dsports_live',
    aliases: ['dsports_live', 'dsports-radio', 'dsports'],
    streamer: 'DSPORTS',
    title: 'DSports Radio 103.1 FM - El Sonido del Deporte',
    category: 'Deportes',
    platform: 'YouTube',
    liveVideoId: '1oDRHCaKh4U',
    streamUrl: 'https://www.youtube.com/watch?v=1oDRHCaKh4U',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    viewerCount: 25400,
    isLive: true,
    situation: 'live',
    tags: ['DSports', 'Deportes', 'Fútbol']
  }
};

/**
 * Busca coincidencia de un canal en el catálogo maestro
 */
export function findMasterChannel(streamOrId: string | Partial<Stream>): ChannelMasterData | null {
  const idToSearch = typeof streamOrId === 'string' ? streamOrId : streamOrId.id || '';
  const streamerToSearch = (typeof streamOrId === 'object' ? streamOrId.streamer || streamOrId.title || '' : '').toLowerCase();

  for (const master of Object.values(MASTER_CHANNELS)) {
    if (master.aliases.includes(idToSearch)) return master;
    if (master.id === idToSearch) return master;
    if (streamerToSearch && (
      master.streamer.toLowerCase().includes(streamerToSearch) ||
      streamerToSearch.includes(master.streamer.toLowerCase())
    )) {
      return master;
    }
  }
  return null;
}

/**
 * Enriquece un stream con sus datos en vivo garantizados
 */
export function enrichStream(raw: Stream): Stream {
  if (!raw) return raw;

  const master = findMasterChannel(raw);
  if (!master) {
    // Si no está en el catálogo maestro, respetar sus datos nativos (por ejemplo si es una transmisión WebRTC del estudio)
    return raw;
  }

  return {
    ...raw,
    // Asegurar título y creador
    streamer: raw.streamer || master.streamer,
    title: raw.title || master.title,
    category: raw.category || master.category,
    platform: raw.platform || master.platform,
    platformChannelId: raw.platformChannelId || master.platformChannelId,
    // Asegurar señal y video activo
    liveVideoId: (raw.liveVideoId && raw.liveVideoId.length === 11 && raw.liveVideoId !== 'zcWXboTnous') ? raw.liveVideoId : master.liveVideoId,
    streamUrl: (raw.streamUrl && raw.streamUrl.trim().length > 0 && !raw.streamUrl.includes('zcWXboTnous')) ? raw.streamUrl : master.streamUrl,
    thumbnailUrl: (raw.thumbnailUrl && raw.thumbnailUrl.startsWith('http')) ? raw.thumbnailUrl : master.thumbnailUrl,
    viewerCount: (raw.viewerCount && raw.viewerCount > 0) ? raw.viewerCount : master.viewerCount,
    isLive: raw.isLive !== undefined ? raw.isLive : master.isLive,
    situation: raw.situation || master.situation,
    schedule: (raw.schedule && raw.schedule.length > 0) ? raw.schedule : (CHANNEL_SCHEDULES[raw.id] || CHANNEL_SCHEDULES[master.id] || []),
  };
}

/**
 * Determina con certeza si un canal está dando señal en vivo ahora mismo
 */
export function isStreamLive(stream: Stream): boolean {
  if (!stream) return false;
  if (stream.situation === 'offline') return false;
  if (stream.isWebRTC && stream.situation !== 'offline') return true;
  if (stream.isLive === true || stream.situation === 'live') return true;

  const master = findMasterChannel(stream);
  if (master && master.isLive) return true;

  if (stream.liveVideoId && stream.liveVideoId.length === 11) return true;
  if (stream.platform === 'Twitch' && stream.platformChannelId) return true;
  if (stream.platform === 'Kick' && stream.streamUrl?.includes('kick.com/')) return true;

  return false;
}

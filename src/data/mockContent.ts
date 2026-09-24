import { StreamItem, UserProfile } from '../types';

export const USER_PROFILES: UserProfile[] = [
  {
    id: 'user-1',
    name: 'Carlos VIP',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isKids: false
  },
  {
    id: 'user-2',
    name: 'Invitado',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    isKids: false
  },
  {
    id: 'user-3',
    name: 'Modo Kids',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
    isKids: true
  }
];

export const STREAM_ITEMS: StreamItem[] = [
  {
    id: 'stream-live-1',
    title: 'Final del Torneo Masters Esports 2026',
    type: 'live',
    isLive: true,
    viewerCount: 42890,
    streamerName: 'Alex Esports & Co.',
    streamerAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
    streamCategory: 'Competición Global',
    description: 'Transmisión exclusiva y en directo de la gran final mundial con comentarios oficiales, análisis en directo, jugadas destacadas y repeticiones 4K.',
    backdropUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    matchPercentage: 99,
    year: 2026,
    duration: 'EN DIRECTO',
    ageRating: '16+',
    genres: ['Directo', 'Gaming', 'Esports', 'Torneos'],
    cast: ['Alex Esports', 'Elena Cast', 'Lucas Pro'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    featured: true,
    trending: true,
    tags: ['4K Ultra HD', 'Chat en Vivo', 'Sonido 5.1', 'Exclusivo']
  },
  {
    id: 'movie-1',
    title: 'Horizonte Cero: La Última Órbita',
    originalTitle: 'Horizon Zero: Last Orbit',
    type: 'movie',
    description: 'En el año 2140, una tripulación rebelde descubre una señal cuántica proveniente de más allá del borde exterior que podría reescribir las leyes del espacio-tiempo.',
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    matchPercentage: 98,
    year: 2025,
    duration: '2h 18m',
    ageRating: '16+',
    genres: ['Ciencia Ficción', 'Acción', 'Aventura'],
    director: 'Denis Villeneuve',
    cast: ['Oscar Isaac', 'Rebecca Ferguson', 'Timothée Chalamet', 'Zendaya'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    featured: true,
    trending: true,
    top10Rank: 1,
    tags: ['Dolby Atmos', '4K HDR', 'Original StreamFlix']
  },
  {
    id: 'series-1',
    title: 'Crónicas de Neo Tokio',
    originalTitle: 'Neo Tokyo Syndicate',
    type: 'series',
    description: 'Bajo las luces de neón y rascacielos flotantes, un detective cibernético retirado y una hacker sin memoria investigan una red de androides conscientes.',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    matchPercentage: 97,
    year: 2026,
    duration: '2 Temporadas',
    ageRating: '18+',
    genres: ['Cyberpunk', 'Thriller', 'Misterio'],
    director: 'Shinichiro Watanabe',
    cast: ['Kenji Sato', 'Aoi Miyazaki', 'Hiroyuki Sanada'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    trending: true,
    top10Rank: 2,
    tags: ['Ultra HD', 'Español Latino / Cast', 'Subtítulos'],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Temporada 1: El Despertar Sintético',
        episodes: [
          {
            id: 'ep-1-1',
            title: '1. Código Sin Destino',
            episodeNumber: 1,
            seasonNumber: 1,
            duration: '52m',
            thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
            description: 'Kaito encuentra un chip de memoria prohibido en el cuerpo de un sintético de clase ejecutiva.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          },
          {
            id: 'ep-1-2',
            title: '2. Sombras en el Distrito 9',
            episodeNumber: 2,
            seasonNumber: 1,
            duration: '48m',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
            description: 'La persecución por los callejones húmedos de Shinjuku desvela una conspiración corporativa.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          },
          {
            id: 'ep-1-3',
            title: '3. Protocolo Fantasma',
            episodeNumber: 3,
            seasonNumber: 1,
            duration: '55m',
            thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
            description: 'Una inteligencia artificial rebelde toma el control de los trenes magnéticos interurbanos.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'stream-live-2',
    title: 'Chill Lo-Fi Beats & Sesión Creativa 24/7',
    type: 'live',
    isLive: true,
    viewerCount: 15420,
    streamerName: 'Luna Synth',
    streamerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    streamCategory: 'Música & Relax',
    description: 'Música en vivo continua sintetizada por artistas independientes, animación retro estética y comunidad activa en el chat global.',
    backdropUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
    rating: 4.95,
    matchPercentage: 96,
    year: 2026,
    duration: 'TRANSMITIENDO AHORA',
    ageRating: 'TP',
    genres: ['Directo', 'Música', 'Relax', 'Comunidad'],
    cast: ['Luna Synth', 'DJ Neon'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    trending: true,
    tags: ['Música en Vivo', '24/7', 'Audio HD']
  },
  {
    id: 'movie-2',
    title: 'Furia Táctica: Código Rojo',
    originalTitle: 'Tactical Fury: Red Alert',
    type: 'movie',
    description: 'Un escuadrón de élite debe infiltrarse en una fortaleza alpina antes de que un consorcio privado active un satélite electromagnético.',
    backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    matchPercentage: 95,
    year: 2024,
    duration: '1h 56m',
    ageRating: '16+',
    genres: ['Acción', 'Suspense', 'Aventura'],
    director: 'Chad Stahelski',
    cast: ['Keanu Reeves', 'Charlize Theron', 'Donnie Yen'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    top10Rank: 3,
    tags: ['Acción Trepidante', '4K', 'HDR10']
  },
  {
    id: 'series-2',
    title: 'El Reino de la Niebla',
    originalTitle: 'Mist Kingdom',
    type: 'series',
    description: 'En un archipiélago azotado por tormentas eternas, tres clanes rivales libran una guerra despiadada por el control de la sal negra.',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=600&q=80',
    rating: 4.85,
    matchPercentage: 94,
    year: 2025,
    duration: '3 Temporadas',
    ageRating: '18+',
    genres: ['Fantasía', 'Drama', 'Aventura'],
    director: 'Miguel Sapochnik',
    cast: ['Mads Mikkelsen', 'Eva Green', 'Nikolaj Coster-Waldau'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    trending: true,
    top10Rank: 4,
    tags: ['Fantasía Épica', 'Dolby Vision', 'Audio Espacial'],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Temporada 1: El Mar de Ceniza',
        episodes: [
          {
            id: 'ep-mist-1',
            title: '1. Sangre y Marea',
            episodeNumber: 1,
            seasonNumber: 1,
            duration: '58m',
            thumbnail: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=600&q=80',
            description: 'El regreso de la flota del norte desata el caos en la capital del arrecife.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
          }
        ]
      }
    ]
  },
  {
    id: 'stream-live-3',
    title: 'Charla Tech & Programando Plataformas en Vivo',
    type: 'live',
    isLive: true,
    viewerCount: 8940,
    streamerName: 'DevMaster Pro',
    streamerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    streamCategory: 'Ciencia & Tecnología',
    description: 'Construyendo arquitecturas reactivas, respondiendo dudas de desarrollo fullstack y revisando código en directo con la comunidad.',
    backdropUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    rating: 4.88,
    matchPercentage: 92,
    year: 2026,
    duration: 'EN VIVO',
    ageRating: 'TP',
    genres: ['Directo', 'Tecnología', 'Programación'],
    cast: ['DevMaster Pro'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    tags: ['Tech', 'Live Coding', 'Q&A']
  },
  {
    id: 'movie-3',
    title: 'Secretos de la Fosa Marina',
    originalTitle: 'Abyssal Secrets',
    type: 'movie',
    description: 'Documental cinematográfico filmado con sumergibles de última generación a más de 11.000 metros de profundidad en la fosa de las Marianas.',
    backdropUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    matchPercentage: 96,
    year: 2025,
    duration: '1h 38m',
    ageRating: 'TP',
    genres: ['Documental', 'Naturaleza', 'Ciencia'],
    director: 'James Cameron',
    cast: ['David Attenborough', 'Sylvia Earle'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tags: ['4K Nativo', 'Galardonado', 'Familiar']
  },
  {
    id: 'movie-4',
    title: 'Ecos del Tiempo',
    originalTitle: 'Echoes of Time',
    type: 'movie',
    description: 'Un físico cuántico atrapado en un bucle temporal de 12 horas en una estación de radioastronomía debe desentrañar un mensaje interestelar.',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
    matchPercentage: 91,
    year: 2025,
    duration: '2h 04m',
    ageRating: '12+',
    genres: ['Ciencia Ficción', 'Drama', 'Misterio'],
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Florence Pugh', 'Robert Pattinson'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    tags: ['IMAX Enhanced', 'Audio 5.1']
  },
  {
    id: 'series-3',
    title: 'El Gran Golpe Financiero',
    originalTitle: 'The Ledger',
    type: 'series',
    description: 'Un equipo de analistas forenses y hackers éticos desmonta la mayor red de lavado de dinero de criptomonedas del planeta.',
    backdropUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80',
    rating: 4.75,
    matchPercentage: 93,
    year: 2026,
    duration: '1 Temporada',
    ageRating: '16+',
    genres: ['Drama', 'Thriller', 'Crimen'],
    director: 'David Fincher',
    cast: ['Pedro Pascal', 'Jodie Comer', 'Alexander Skarsgård'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    tags: ['Suspenso', 'Intriga']
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, import('../types').ChatMessage[]> = {
  'stream-live-1': [
    { id: 'c1', user: 'GamerPro_99', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80', text: '¡Vaya jugada épica en la ronda 4! 🔥', time: '14:20', badge: 'VIP' },
    { id: 'c2', user: 'Elena_Stream', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', text: 'Calidad 4K impecable en StreamFlix 😍', time: '14:21', badge: 'SUB' },
    { id: 'c3', user: 'Moderador_Oficial', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80', text: '¡Bienvenidos a todos a la gran final! Respeten las normas en el chat.', time: '14:21', badge: 'MOD' },
    { id: 'c4', user: 'Lucas_Fan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', text: 'Donación enviada: ¡Vamos con todo al desempate!', time: '14:22', isDonation: true, donationAmount: '€10.00' },
    { id: 'c5', user: 'Vicky_Gamer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80', text: '¡Qué tensión! El marcador está 14 a 14 😱', time: '14:23' }
  ],
  'stream-live-2': [
    { id: 'c1', user: 'SynthWaveLover', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80', text: 'La mejor música para estudiar y programar 🎧✨', time: '14:15', badge: 'SUB' },
    { id: 'c2', user: 'Luna Synth', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', text: '¡Gracias a todos por los 15k espectadores en vivo!', time: '14:18', badge: 'STREAMER' },
    { id: 'c3', user: 'Marcos_Chill', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80', text: 'Ese bajo synthwave suena de maravilla.', time: '14:20' }
  ],
  'stream-live-3': [
    { id: 'c1', user: 'CodeNinja', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80', text: '¿Qué librería recomiendas para el reproductor de video?', time: '14:10' },
    { id: 'c2', user: 'DevMaster Pro', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80', text: '¡HTML5 nativo con controles personalizados en React es lo más rápido y personalizable!', time: '14:12', badge: 'STREAMER' }
  ]
};

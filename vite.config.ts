import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const CHANNEL_HANDLES: Record<string, string> = {
  // Streaming
  'luzu-tv': 'luzutv',
  'luzu_live': 'luzutv',
  'olga-envivo': 'olgaenvivo_',
  'olga_live': 'olgaenvivo_',
  'olga': 'olgaenvivo_',
  'blender-oficial': 'estoesblender',
  'blender_live': 'estoesblender',
  'gelatina-canal': 'somosgelatina',
  'gelatina_live': 'somosgelatina',
  'bondi-live': 'bondilive',
  'bondi_live': 'bondilive',
  'carajo_live': 'carajostream',
  'neura_live': 'neuramedia',
  'republicaz_live': 'republicaz',
  'parenlamano_live': 'parenlamano',
  'luquitas-rodriguez': 'parenlamano',
  'vorterix-oficial': 'vorterixoficial',
  'vorterix_live': 'vorterixoficial',
  'urbanaplay_live': 'urbanaplay',
  'urbana-play': 'urbanaplay',
  'coscu_live': 'Coscu',
  'lacobra_live': 'lacobraa',
  'momo_live': 'Momo_la',
  'santutu_live': 'santutu',
  'joaco_live': 'joacolopez',
  'davoo_live': 'davoooxeneize',
  'spreen_live': 'Spreen',
  'pimpe_live': 'Pimpeano',
  'markito_live': 'MarkitoNavaja',

  // TV Noticias y Abierta
  'tn-noticias': 'todonoticias',
  'tn_live': 'todonoticias',
  'c5n-vivo': 'c5n',
  'c5n_live': 'c5n',
  'lanacion-mas': 'lanacion',
  'ln_live': 'lanacion',
  'cronica-tv': 'cronicatv',
  'cronica_live': 'cronicatv',
  'telefe-canal': 'telefe',
  'telefe_live': 'telefe',
  'eltrece-canal': 'eltrece',
  'eltrece_live': 'eltrece',
  'tv-publica': 'TVPublicaArgentina',
  'tvpublica_live': 'TVPublicaArgentina',
  'tyc-sports': 'tycsports',
  'tycsports_live': 'tycsports',
  'espn-argentina': 'espn',
  'espn_live': 'espn',
  'dsports_live': 'dsports',
  'a24_live': 'A24com',
  'america_live': 'americatvoficial',
  'c26_live': 'canal26',
  'elnueve_live': 'elnuevetv',
  'ip_live': 'ipdigital',
  'net_live': 'canalnettv',
  'canal_e_live': 'perfilcom',

  // Radios
  'mitre_live': 'radiomitre',
  'la100_live': 'la100',
  'rockandpop_live': 'fmrockandpop959',
  'radioconvos_live': 'radioconvos89.9',
  'aspen_live': 'fmaspen1023',
  'continental_live': 'radiocontinental590',
  'cadena3_live': 'cadena3',
  'popradio_live': 'popradio1015',
  'vale_live': 'vale975',
  'mega_live': 'mega983'
};

const KNOWN_OFFLINE_OR_RECOMMENDED = new Set([
  'rOIRZ09pHP4', // El Destape trending video mistakenly scraped as recommended
  'HRN2mAWwxs0', // Expired broadcast
  'otDdIZyd_5M', // Expired VOD
  'x6VVeWPy8C8', // Expired VOD
  'Ucxe455nYm8', // Expired VOD
  'h7JuK7VPU1M', // Expired VOD
  'e31cRMBZprg', // Expired VOD
  'C1DhpJ07ZuE', // Dead ID
  'NP5jNOnGiMU', // Dead ID
  'Hc0Ocwn9nxM', // Dead ID
]);

const FALLBACK_LIVE_VIDEOS: Record<string, string> = {
  'tn': 'cb12KmMMDJA',
  'tn_live': 'cb12KmMMDJA',
  'tn-noticias': 'cb12KmMMDJA',
  'c5n': 'j6oh4Kqz3UM',
  'c5n_live': 'j6oh4Kqz3UM',
  'c5n-vivo': 'j6oh4Kqz3UM',
  'ln': 'FEWZjXJ7M0c',
  'ln_live': 'FEWZjXJ7M0c',
  'lanacion-mas': 'FEWZjXJ7M0c',
  'cronica': 'hw4uHyct4vg',
  'cronica_live': 'hw4uHyct4vg',
  'cronica-tv': 'hw4uHyct4vg',
  'a24': 'ArKbAx1K-2U',
  'a24_live': 'ArKbAx1K-2U',
  'c26': 'C_RnFD6xiX8',
  'c26_live': 'C_RnFD6xiX8',
  'canal-26': 'C_RnFD6xiX8',
  'america': 'zcWXboTnous',
  'america_live': 'zcWXboTnous',
  'america-tv': 'zcWXboTnous',
  'elnueve': 'C_RnFD6xiX8',
  'elnueve_live': 'C_RnFD6xiX8',
  'telefe': 'anCV3pcKlCs',
  'telefe_live': 'anCV3pcKlCs',
  'telefe-canal': 'anCV3pcKlCs',
  'eltrece': '8X-clTX-e2s',
  'eltrece_live': '8X-clTX-e2s',
  'eltrece-canal': '8X-clTX-e2s',
  'tvpublica': 'YZTJN6CZfG0',
  'tvpublica_live': 'YZTJN6CZfG0',
  'tv-publica': 'YZTJN6CZfG0',
  'tycsports': 'oRY-EK4L14o',
  'tycsports_live': 'oRY-EK4L14o',
  'tyc-sports': 'oRY-EK4L14o',
  'espn': 'oRY-EK4L14o',
  'espn_live': 'oRY-EK4L14o',
  'urbanaplay': 'gLRijRdfkjU',
  'urbanaplay_live': 'gLRijRdfkjU',
  'vorterix': 'SG1RqRJep9E',
  'vorterix_live': 'SG1RqRJep9E',
  'vorterix-oficial': 'SG1RqRJep9E',
  'neura': 'w5G_UBdXtoE',
  'neura_live': 'w5G_UBdXtoE',
  'carajo': 'dtOjTydOh4E',
  'carajo_live': 'dtOjTydOh4E',
  'luzu': 'yZC_gyLfTK0',
  'luzu_live': 'yZC_gyLfTK0',
  'luzu-tv': 'yZC_gyLfTK0',
  'olga': 'VGlJeNF6tQ8',
  'olga_live': 'VGlJeNF6tQ8',
  'olga-envivo': 'VGlJeNF6tQ8',
  'blender': 'cqBbduSoXag',
  'blender_live': 'cqBbduSoXag',
  'gelatina': 'W0ytWv8TW5I',
  'gelatina_live': 'W0ytWv8TW5I',
  'gelatina-canal': 'W0ytWv8TW5I',
  'bondi': 'Y9O3_rmRbdE',
  'bondi_live': 'Y9O3_rmRbdE',
  'mitre': 'gLRijRdfkjU',
  'mitre_live': 'gLRijRdfkjU',
  'la100': 'zLvLPcy4Q_A',
  'la100_live': 'zLvLPcy4Q_A',
  'parenlamano': 'bvW74b_ejqY',
  'parenlamano_live': 'bvW74b_ejqY',
  'republicaz': 'qNuoVDTD85Y',
  'republicaz_live': 'qNuoVDTD85Y'
};

const cache = new Map<string, { data: any; expiry: number }>();

interface ServerStudioBroadcast {
  id: string;
  title: string;
  streamer: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  platform: 'WebRTC';
  isWebRTC: true;
  broadcastType: 'studio_webrtc';
  isLive: true;
  situation: 'live';
  viewerCount: number;
  startedAt: number;
  lastHeartbeat: number;
}

interface ServerViewerSession {
  viewerId: string;
  viewerOffer?: any;
  hostAnswer?: any;
  hostCandidates: any[];
  viewerCandidates: any[];
  connectedAt: number;
  lastSeen: number;
}

const studioBroadcasts = new Map<string, ServerStudioBroadcast>();
const studioViewerSessions = new Map<string, Map<string, ServerViewerSession>>();

function parseJsonBody(req: any): Promise<any> {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk: any) => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function liveStreamResolverPlugin(): Plugin {
  const setupMiddlewares = (server: any) => {
    server.middlewares.use('/api/live-stream', async (req: any, res: any) => {
      try {
        const url = new URL(req.url || '', 'http://localhost');
        const channelKey = (url.searchParams.get('channel') || '').toLowerCase().trim();
        const channelId = url.searchParams.get('channelId');
        const streamUrl = url.searchParams.get('streamUrl');
        let handle = url.searchParams.get('handle') || CHANNEL_HANDLES[channelKey];

        if (!handle && channelKey) {
          handle = CHANNEL_HANDLES[channelKey.replace(/-/g, '_')] || CHANNEL_HANDLES[channelKey.replace(/_/g, '-')];
        }

        if (!handle && streamUrl) {
          const hMatch = streamUrl.match(/@([a-zA-Z0-9_.-]+)/);
          if (hMatch) handle = hMatch[1];
        }

        const fallbackVideoId = FALLBACK_LIVE_VIDEOS[channelKey] || 
                                FALLBACK_LIVE_VIDEOS[channelKey.replace(/-/g, '_')] || 
                                FALLBACK_LIVE_VIDEOS[channelKey.replace(/_/g, '-')];

        const cacheKey = handle || channelId || channelKey;
        const cached = cache.get(cacheKey);
        if (cached && cached.expiry > Date.now()) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(cached.data));
          return;
        }

        let fetchUrl = '';
        if (handle) {
          const cleanHandle = handle.replace(/^@/, '');
          fetchUrl = `https://www.youtube.com/@${cleanHandle}/live`;
        } else if (channelId && channelId.startsWith('UC')) {
          fetchUrl = `https://www.youtube.com/channel/${channelId}/live`;
        }

        if (!fetchUrl) {
          const fallbackResult = { 
            isLive: !!fallbackVideoId, 
            videoId: fallbackVideoId || null, 
            message: 'Fallback catalog' 
          };
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(fallbackResult));
          return;
        }

        let resolvedVideoId: string | null = null;
        let isLiveNow = false;

        try {
          const response = await fetch(fetchUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept-Language': 'es-419,es;q=0.9,en;q=0.8'
            },
            redirect: 'follow'
          });

          const finalUrl = response.url || '';
          const html = await response.text();

          // Verificación de si la señal está emitiendo en vivo en este instante
          isLiveNow = html.includes('"isLive":true') || 
                      html.includes('"BADGE_STYLE_TYPE_LIVE_NOW"') || 
                      html.includes('hqdefault_live.jpg') ||
                      html.includes('{"text":"EN VIVO"}') ||
                      html.includes('{"text":"LIVE"}');

          if (isLiveNow) {
            // Caso 1: Redirección directa a un video en vivo watch?v=
            const urlMatch = finalUrl.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
            if (urlMatch && !KNOWN_OFFLINE_OR_RECOMMENDED.has(urlMatch[1])) {
              resolvedVideoId = urlMatch[1];
            }

            // Caso 2: Extraer videoIds candidatos del HTML de la transmisión
            if (!resolvedVideoId) {
              const candidateIds = [...new Set([...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]))]
                .filter(id => !KNOWN_OFFLINE_OR_RECOMMENDED.has(id));

              // Verificar contra oEmbed para asegurar que pertenece al canal y no es una recomendación ajena
              const targetName = (handle || channelKey).toLowerCase().replace(/[_-]/g, '');
              for (const candId of candidateIds.slice(0, 6)) {
                try {
                  const oRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${candId}&format=json`);
                  if (oRes.ok) {
                    const oData = await oRes.json();
                    const author = (oData.author_name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                    const title = (oData.title || '').toLowerCase();
                    
                    const isAuthorMatch = author.includes(targetName) || targetName.includes(author) ||
                                          (targetName.includes('c5n') && author.includes('c5n')) ||
                                          (targetName.includes('tn') && (author.includes('todonoticias') || author.includes('tn'))) ||
                                          (targetName.includes('cronica') && (author.includes('cronica') || title.includes('crónica'))) ||
                                          (targetName.includes('lanacion') && author.includes('nacion')) ||
                                          (targetName.includes('a24') && author.includes('a24')) ||
                                          (targetName.includes('canal26') && author.includes('canal26')) ||
                                          (targetName.includes('telefe') && author.includes('telefe')) ||
                                          (targetName.includes('eltrece') && author.includes('eltrece')) ||
                                          (targetName.includes('olga') && (author.includes('olga') || title.includes('olga'))) ||
                                          (targetName.includes('luzu') && author.includes('luzu')) ||
                                          (targetName.includes('gelatina') && (author.includes('gelatina') || title.includes('tugo') || title.includes('gelatina'))) ||
                                          (targetName.includes('neura') && author.includes('neura')) ||
                                          (targetName.includes('vorterix') && author.includes('vorterix')) ||
                                          (targetName.includes('mitre') && author.includes('mitre')) ||
                                          (targetName.includes('la100') && author.includes('100'));

                    if (isAuthorMatch) {
                      resolvedVideoId = candId;
                      break;
                    }
                  }
                } catch (e) {}
              }

              // Fallback seguro: si es en vivo y hay al menos un candidato no marcado como offline
              if (!resolvedVideoId && candidateIds.length > 0) {
                resolvedVideoId = candidateIds[0];
              }
            }
          }
        } catch (fetchErr) {}

        const finalVideoId = resolvedVideoId || fallbackVideoId || null;
        const finalIsLive = (isLiveNow && !!resolvedVideoId) || !!fallbackVideoId;

        const result = {
          isLive: finalIsLive,
          videoId: finalVideoId,
          lastVideoId: finalVideoId,
          handle: handle || null,
          checkedAt: Date.now()
        };

        // Cache de 35 segundos para evitar sobrecarga y responder en milisegundos
        cache.set(cacheKey, { data: result, expiry: Date.now() + 35000 });

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
      } catch (err: any) {
        const url = new URL(req.url || '', 'http://localhost');
        const channelKey = (url.searchParams.get('channel') || '').toLowerCase().trim();
        const fallbackVideoId = FALLBACK_LIVE_VIDEOS[channelKey] || null;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ isLive: !!fallbackVideoId, videoId: fallbackVideoId, error: err.message }));
      }
    });

    server.middlewares.use('/api/viewer-count', async (req: any, res: any) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'live', viewerCount: null }));
    });

    // ==========================================
    // ESTUDIO Y SEÑALIZACIÓN WEBRTC EN TIEMPO REAL
    // ==========================================
    server.middlewares.use('/api/studio/start', async (req: any, res: any) => {
      if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
      const body = await parseJsonBody(req);
      const id = body.id || 'studio_' + Date.now();
      const broadcast: ServerStudioBroadcast = {
        id,
        title: body.title || 'Transmisión en Vivo desde el Estudio',
        streamer: body.streamer || 'Conductor StreamFLIX',
        category: body.category || 'Streaming',
        description: body.description || '',
        thumbnailUrl: body.thumbnailUrl || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
        platform: 'WebRTC',
        isWebRTC: true,
        broadcastType: 'studio_webrtc',
        isLive: true,
        situation: 'live',
        viewerCount: 1,
        startedAt: Date.now(),
        lastHeartbeat: Date.now()
      };
      studioBroadcasts.set(id, broadcast);
      if (!studioViewerSessions.has(id)) {
        studioViewerSessions.set(id, new Map());
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, broadcast }));
    });

    server.middlewares.use('/api/studio/heartbeat', async (req: any, res: any) => {
      if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
      const body = await parseJsonBody(req);
      const b = studioBroadcasts.get(body.broadcastId);
      if (b) {
        b.lastHeartbeat = Date.now();
      }
      const viewers = studioViewerSessions.get(body.broadcastId)?.size || 1;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, viewersCount: Math.max(1, viewers) }));
    });

    server.middlewares.use('/api/studio/stop', async (req: any, res: any) => {
      if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
      const body = await parseJsonBody(req);
      studioBroadcasts.delete(body.broadcastId);
      studioViewerSessions.delete(body.broadcastId);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    });

    server.middlewares.use('/api/studio/active', async (req: any, res: any) => {
      const now = Date.now();
      for (const [id, b] of studioBroadcasts.entries()) {
        if (now - b.lastHeartbeat > 35000) {
          studioBroadcasts.delete(id);
          studioViewerSessions.delete(id);
        }
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ broadcasts: Array.from(studioBroadcasts.values()) }));
    });

    server.middlewares.use('/api/studio/stream', async (req: any, res: any) => {
      const url = new URL(req.url || '', 'http://localhost');
      const id = url.searchParams.get('id') || '';
      const b = studioBroadcasts.get(id);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ broadcast: b || null }));
    });

    server.middlewares.use('/api/webrtc/viewer-offer', async (req: any, res: any) => {
      if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
      const body = await parseJsonBody(req);
      const { broadcastId, viewerId, offer } = body;
      let sessions = studioViewerSessions.get(broadcastId);
      if (!sessions) {
        sessions = new Map();
        studioViewerSessions.set(broadcastId, sessions);
      }
      sessions.set(viewerId, {
        viewerId,
        viewerOffer: offer,
        hostAnswer: null,
        hostCandidates: [],
        viewerCandidates: [],
        connectedAt: Date.now(),
        lastSeen: Date.now()
      });
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    });

    server.middlewares.use('/api/webrtc/broadcaster-poll', async (req: any, res: any) => {
      const url = new URL(req.url || '', 'http://localhost');
      const broadcastId = url.searchParams.get('broadcastId') || '';
      const sessions = studioViewerSessions.get(broadcastId);
      const offers: any[] = [];
      if (sessions) {
        for (const [vId, session] of sessions.entries()) {
          if (session.viewerOffer && !session.hostAnswer) {
            offers.push({ viewerId: vId, offer: session.viewerOffer });
          }
        }
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ offers }));
    });

    server.middlewares.use('/api/webrtc/host-answer', async (req: any, res: any) => {
      if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
      const body = await parseJsonBody(req);
      const { broadcastId, viewerId, answer } = body;
      const sessions = studioViewerSessions.get(broadcastId);
      if (sessions && sessions.has(viewerId)) {
        sessions.get(viewerId)!.hostAnswer = answer;
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    });

    server.middlewares.use('/api/webrtc/viewer-poll', async (req: any, res: any) => {
      const url = new URL(req.url || '', 'http://localhost');
      const broadcastId = url.searchParams.get('broadcastId') || '';
      const viewerId = url.searchParams.get('viewerId') || '';
      const sessions = studioViewerSessions.get(broadcastId);
      const session = sessions?.get(viewerId);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ answer: session?.hostAnswer || null }));
    });

    server.middlewares.use('/api/webrtc/candidate', async (req: any, res: any) => {
      if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
      const body = await parseJsonBody(req);
      const { broadcastId, viewerId, sender, candidate } = body;
      const sessions = studioViewerSessions.get(broadcastId);
      const session = sessions?.get(viewerId);
      if (session && candidate) {
        if (sender === 'host') {
          session.hostCandidates.push(candidate);
        } else {
          session.viewerCandidates.push(candidate);
        }
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    });

    server.middlewares.use('/api/webrtc/candidates', async (req: any, res: any) => {
      const url = new URL(req.url || '', 'http://localhost');
      const broadcastId = url.searchParams.get('broadcastId') || '';
      const viewerId = url.searchParams.get('viewerId') || '';
      const recipient = url.searchParams.get('recipient') || '';
      const sessions = studioViewerSessions.get(broadcastId);
      const session = sessions?.get(viewerId);
      let candidates: any[] = [];
      if (session) {
        if (recipient === 'viewer') {
          candidates = session.hostCandidates.splice(0);
        } else if (recipient === 'host') {
          candidates = session.viewerCandidates.splice(0);
        }
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ candidates }));
    });

    server.middlewares.use('/api/webrtc/viewer-disconnect', async (req: any, res: any) => {
      if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
      const body = await parseJsonBody(req);
      const { broadcastId, viewerId } = body;
      const sessions = studioViewerSessions.get(broadcastId);
      if (sessions) {
        sessions.delete(viewerId);
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true }));
    });
  };

  return {
    name: 'live-stream-resolver',
    configureServer(server) {
      setupMiddlewares(server);
    },
    configurePreviewServer(server) {
      setupMiddlewares(server);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    liveStreamResolverPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'next/image': path.resolve(__dirname, './src/shims/next-image.tsx'),
      'next/link': path.resolve(__dirname, './src/shims/next-link.tsx'),
      'next/navigation': path.resolve(__dirname, './src/shims/next-navigation.ts')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true
  }
});


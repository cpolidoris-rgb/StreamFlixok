import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const CHANNEL_HANDLES: Record<string, string> = {
  'luzu-tv': 'luzutv',
  'luzu_live': 'luzutv',
  'olga-envivo': 'olgaenvivo',
  'olga_live': 'olgaenvivo',
  'blender-oficial': 'estoesblender',
  'blender_live': 'estoesblender',
  'gelatina-canal': 'gelatina_live',
  'gelatina_live': 'gelatina_live',
  'bondi-live': 'bondi_live',
  'bondi_live': 'bondi_live',
  'tn-noticias': 'todonoticias',
  'tn_live': 'todonoticias',
  'c5n-vivo': 'c5n',
  'c5n_live': 'c5n',
  'lanacion-mas': 'lanacionmas',
  'ln_live': 'lanacionmas',
  'cronica-tv': 'cronicatv',
  'cronica_live': 'cronicatv',
  'telefe-canal': 'telefe',
  'telefe_live': 'telefe',
  'eltrece-canal': 'eltrece',
  'eltrece_live': 'eltrece',
  'tv-publica': 'tvpublica',
  'tvpublica_live': 'tvpublica',
  'tyc-sports': 'tycsports',
  'tycsports_live': 'tycsports',
  'espn-argentina': 'espnargentina',
  'espn_live': 'espnargentina',
  'urbana-play': 'urbanaplay1043',
  'urbanaplay_live': 'urbanaplay1043',
  'vorterix-oficial': 'vorterixoficial',
  'vorterix_live': 'vorterixoficial',
  'luquitas-rodriguez': 'parenlamano',
  'parenlamano_live': 'parenlamano',
  'a24_live': 'a24noticias',
  'america_live': 'americatv',
  'c26_live': 'canal26argentina',
  'elnueve_live': 'elnuevetv',
  'carajo_live': 'carajostream',
  'neura_live': 'neura_media',
  'republicaz_live': 'republicaz',
  'mitre_live': 'radiomitre',
  'la100_live': 'la100',
  'rockandpop_live': 'fmrockandpop',
  'radioconvos_live': 'radioconvos899',
  'aspen_live': 'fmaspen1023'
};

const cache = new Map<string, { data: any; expiry: number }>();

function liveStreamResolverPlugin(): Plugin {
  return {
    name: 'live-stream-resolver',
    configureServer(server) {
      server.middlewares.use('/api/live-stream', async (req, res) => {
        try {
          const url = new URL(req.url || '', 'http://localhost');
          const channelKey = (url.searchParams.get('channel') || '').toLowerCase().trim();
          let handle = url.searchParams.get('handle') || CHANNEL_HANDLES[channelKey];
          const channelId = url.searchParams.get('channelId');

          if (!handle && channelKey) {
            handle = CHANNEL_HANDLES[channelKey.replace(/-/g, '_')] || CHANNEL_HANDLES[channelKey.replace(/_/g, '-')];
          }

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
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ isLive: false, videoId: null, message: 'No target handle found' }));
            return;
          }

          const response = await fetch(fetchUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept-Language': 'es-419,es;q=0.9,en;q=0.8'
            }
          });

          const html = await response.text();
          const match = html.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
          const isLiveNow = html.includes('"isLive":true') || 
                            html.includes('"BADGE_STYLE_TYPE_LIVE_NOW"') || 
                            html.includes('hqdefault_live.jpg') ||
                            html.includes('{"text":"EN VIVO"}') ||
                            html.includes('{"text":"LIVE"}');

          const videoId = match ? match[1] : null;

          const result = {
            isLive: isLiveNow && !!videoId,
            videoId: isLiveNow ? videoId : null,
            lastVideoId: videoId,
            handle: handle || null,
            checkedAt: Date.now()
          };

          cache.set(cacheKey, { data: result, expiry: Date.now() + 45000 });

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err: any) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ isLive: false, videoId: null, error: err.message }));
        }
      });

      server.middlewares.use('/api/viewer-count', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'live', viewerCount: null }));
      });
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


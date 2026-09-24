import React from 'react';
import Home from './app/page';
import StreamPage from './app/stream/[id]/page';
import BroadcastStudio from './components/broadcast-studio';
import { FirebaseProvider } from './firebase/provider';
import { MiniPlayerProvider } from './providers/mini-player-provider';
import { usePathname } from './shims/next-navigation';
import AppFooter from './components/app-footer';

export function App() {
  const pathname = usePathname();

  let content = <Home />;

  if (pathname.startsWith('/stream/')) {
    content = <StreamPage />;
  } else if (pathname === '/broadcast') {
    content = <BroadcastStudio />;
  }

  return (
    <FirebaseProvider>
      <MiniPlayerProvider>
        <div className="flex flex-col min-h-screen bg-black text-white">
          <div className="flex-1">
            {content}
          </div>
          <AppFooter />
        </div>
      </MiniPlayerProvider>
    </FirebaseProvider>
  );
}

export default App;

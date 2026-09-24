'use client';

import Link from 'next/link';
import {
  LogOut,
  Video,
} from 'lucide-react';
import { useUser } from '@/firebase/auth/use-user';
import { useAuth, useFirestore, useMemoFirebase } from '@/firebase/provider';
import { Button } from './ui/button';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import LoginDialog from './login-dialog';
import { useDoc } from '@/firebase/firestore/use-doc';
import { doc } from 'firebase/firestore';
import Image from 'next/image';
import type { UserProfile } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const RED_FILTER = { filter: 'invert(18%) sepia(100%) saturate(7413%) hue-rotate(359deg) brightness(101%) contrast(120%)' };

export default function AppHeader({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}) {
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const categories = ['Streaming', 'TV Noticias', 'TV Abierta', 'Deportes', 'Radio', 'Streamers'];

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-all duration-700",
      scrolled ? "bg-black/95 backdrop-blur-3xl h-20 shadow-2xl border-b border-white/5" : "bg-gradient-to-b from-black/90 via-black/40 to-transparent h-28"
    )}>
      <div className="container mx-auto h-full grid grid-cols-[1fr_auto_auto] items-center px-6 lg:px-12 max-w-[1800px] gap-8">
        
        {/* LOGO - ANCLA IZQUIERDA */}
        <div className="flex justify-start">
          <Link href="/" className="block">
            <Image
              src="https://inforosario.com/logostream.png"
              alt="StreamFLIX"
              width={220}
              height={58}
              style={RED_FILTER}
              className={cn(
                "h-auto transition-all duration-500 hover:scale-105",
                scrolled ? "w-[160px]" : "w-[200px]"
              )}
              priority
              unoptimized
            />
          </Link>
        </div>

        {/* NAVEGACIÓN - DESPLAZADA A LA DERECHA */}
        <nav className="flex items-center gap-8">
          <div className="hidden xl:flex items-center gap-6 border-r border-white/10 pr-8 whitespace-nowrap">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/?category=${encodeURIComponent(cat)}`}
                className="text-xs font-semibold uppercase tracking-wider hover:text-primary transition-all duration-300 opacity-70 hover:opacity-100"
              >
                {cat}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6 whitespace-nowrap">
            <button className="bg-primary hover:bg-primary/80 text-white font-black uppercase text-xs tracking-widest rounded-full h-11 px-12 shadow-[0_15px_40px_rgba(255,0,0,0.4)] transition-all duration-500 transform hover:scale-105 active:scale-95 border border-primary/40 group">
              <Link href="/broadcast" className="flex items-center">
                <Video className="mr-3 h-5 w-5" /> TRANSMITIR
              </Link>
            </button>
          </div>
        </nav>

        {/* USUARIO - EXTREMO DERECHO */}
        <div className="flex-shrink-0 flex items-center justify-end">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative h-12 w-12 rounded-full ring-2 ring-white/10 hover:ring-primary/60 transition-all duration-500 shadow-2xl overflow-hidden group outline-none">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={userProfile?.avatarUrl} className="object-cover" />
                    <AvatarFallback className="bg-zinc-800 text-white font-black text-xs">
                      {userProfile?.username?.substring(0, 1).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-zinc-950/95 backdrop-blur-3xl border-white/10 text-white shadow-2xl mt-4 p-2" align="end">
                <DropdownMenuLabel className="font-black uppercase italic text-primary px-4 py-4 text-[10px] tracking-widest">{userProfile?.username || 'Usuario'}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem asChild className="px-4 py-3 cursor-pointer focus:bg-white/5 rounded-md"><Link href="/profile" className="font-black uppercase text-[10px] tracking-widest italic">Mi Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild className="px-4 py-3 cursor-pointer focus:bg-white/5 rounded-md"><Link href="/admin" className="font-black uppercase text-[10px] tracking-widest italic">Panel de Control</Link></DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={() => signOut(auth)} className="text-destructive px-4 py-4 cursor-pointer font-black uppercase text-[10px] tracking-widest focus:bg-destructive/10 rounded-md italic">
                  <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginDialog />
          )}
        </div>
      </div>
    </header>
  );
}

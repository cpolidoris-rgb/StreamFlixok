import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, Flame, Sparkles, MessageSquare, DollarSign, Users, ShieldAlert } from 'lucide-react';
import { ChatMessage, StreamItem, UserProfile } from '../types';
import { INITIAL_CHAT_MESSAGES } from '../data/mockContent';

interface LiveChatPanelProps {
  streamItem: StreamItem;
  currentUser: UserProfile;
}

const BOT_MESSAGES = [
  '¡Increíble jugada!',
  'Saludos desde Madrid 🇪🇸',
  'StreamFlix se ve brutal a 4K 60fps',
  '¡Vamos equipo!',
  'JAJAJA qué locura de directo',
  '¿A qué hora termina la transmisión?',
  'GG WP a todos!',
  'Top streamer del año sin duda 🙌',
  '¡¡¡GOOOOLAZO / PENTAKILL!!!',
  'Suscrito por 6 meses seguidos!'
];

const BOT_NAMES = ['Carlos_Gamer', 'Lucia_Tech', 'PixelKnight', 'David_BCN', 'Ana_Vibes', 'NeoHacker', 'Sara_Live'];

export const LiveChatPanel: React.FC<LiveChatPanelProps> = ({ streamItem, currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return INITIAL_CHAT_MESSAGES[streamItem.id] || [
      { id: '1', user: 'StreamFlix_Bot', avatar: currentUser.avatar, text: '¡Bienvenido al chat en directo! Mantén el respeto.', time: '12:00', badge: 'MOD' }
    ];
  });
  const [inputText, setInputText] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('5.00');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate active live chatter every 8-12 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomText = BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)];
      const randomUser = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const newMsg: ChatMessage = {
        id: 'msg-' + Date.now() + Math.random(),
        user: randomUser,
        avatar: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 5000000)}?auto=format&fit=crop&w=80&q=80`,
        text: randomText,
        time: timeStr,
        badge: Math.random() > 0.7 ? 'SUB' : undefined
      };

      setMessages(prev => [...prev.slice(-40), newMsg]);
    }, 7000);

    return () => clearInterval(interval);
  }, [streamItem.id]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const userMsg: ChatMessage = {
      id: 'msg-user-' + Date.now(),
      user: currentUser.name,
      avatar: currentUser.avatar,
      text: inputText.trim(),
      time: timeStr,
      badge: 'VIP'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
  };

  const handleSendReaction = (emoji: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const reactionMsg: ChatMessage = {
      id: 'reaction-' + Date.now(),
      user: currentUser.name,
      avatar: currentUser.avatar,
      text: emoji.repeat(3),
      time: timeStr,
      badge: 'VIP'
    };

    setMessages(prev => [...prev, reactionMsg]);
  };

  const handleSendDonation = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const donationMsg: ChatMessage = {
      id: 'don-' + Date.now(),
      user: currentUser.name,
      avatar: currentUser.avatar,
      text: `SuperChat: ¡Gran transmisión! Sigue así crack 🎉`,
      time: timeStr,
      badge: 'VIP',
      isDonation: true,
      donationAmount: `€${donationAmount}`
    };

    setMessages(prev => [...prev, donationMsg]);
    setShowDonationModal(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#121219] border-l border-white/10 w-full sm:w-80 md:w-96 select-none">
      
      {/* Streamer Header */}
      <div className="p-3 bg-[#181824] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="relative">
            <img
              src={streamItem.streamerAvatar || streamItem.posterUrl}
              alt={streamItem.streamerName || streamItem.title}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-600 rounded-full border-2 border-[#121219]"></span>
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate">
              {streamItem.streamerName || streamItem.title}
            </h4>
            <div className="flex items-center space-x-2 text-[11px] text-gray-400">
              <span className="flex items-center text-red-400 font-semibold">
                <Users className="w-3 h-3 mr-1" />
                {streamItem.viewerCount ? `${(streamItem.viewerCount / 1000).toFixed(1)}k espectadores` : 'En Vivo'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            isFollowing 
              ? 'bg-white/10 text-gray-300 hover:bg-white/20' 
              : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/30'
          }`}
        >
          {isFollowing ? 'Siguiendo' : 'Seguir'}
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar text-xs">
        <div className="text-center py-1">
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-400">
            Chat en vivo habilitado • Moderación activa
          </span>
        </div>

        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`p-2 rounded-lg transition-all ${
              msg.isDonation 
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/40 shadow-lg' 
                : 'hover:bg-white/5'
            }`}
          >
            {msg.isDonation && (
              <div className="flex items-center justify-between text-amber-400 font-black text-xs mb-1">
                <span className="flex items-center">
                  <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                  SUPERCHAT DESTACADO
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-black font-extrabold text-[11px]">
                  {msg.donationAmount}
                </span>
              </div>
            )}

            <div className="flex items-start space-x-2">
              <img src={msg.avatar} alt={msg.user} className="w-6 h-6 rounded-full object-cover mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-gray-200 truncate">{msg.user}</span>
                  {msg.badge === 'STREAMER' && (
                    <span className="px-1 py-0.2 rounded bg-red-600 text-white text-[9px] font-black uppercase">STREAMER</span>
                  )}
                  {msg.badge === 'MOD' && (
                    <span className="px-1 py-0.2 rounded bg-emerald-600 text-white text-[9px] font-black uppercase">MOD</span>
                  )}
                  {msg.badge === 'VIP' && (
                    <span className="px-1 py-0.2 rounded bg-amber-500 text-black text-[9px] font-black uppercase">VIP</span>
                  )}
                  {msg.badge === 'SUB' && (
                    <span className="px-1 py-0.2 rounded bg-indigo-600 text-white text-[9px] font-black uppercase">SUB</span>
                  )}
                  <span className="text-[10px] text-gray-500 ml-auto">{msg.time}</span>
                </div>
                <p className="text-gray-300 mt-0.5 break-words text-xs leading-relaxed">
                  {msg.text}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick Emoji Reactions */}
      <div className="px-3 py-1.5 bg-[#161622] border-t border-white/5 flex items-center justify-around">
        {['🔥', '👏', '😱', '❤️', '🚀', '⭐'].map(emoji => (
          <button
            key={emoji}
            onClick={() => handleSendReaction(emoji)}
            className="hover:scale-125 transition-transform text-sm cursor-pointer p-1"
            title={`Enviar ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Chat Input & Donation trigger */}
      <form onSubmit={handleSendMessage} className="p-2.5 bg-[#181824] border-t border-white/10 flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setShowDonationModal(true)}
          className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 transition-colors cursor-pointer"
          title="Enviar Superchat"
        >
          <DollarSign className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enviar un mensaje al chat..."
          className="flex-1 bg-[#0f0f16] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* SuperChat Modal */}
      {showDonationModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a26] border border-amber-500/40 rounded-2xl p-5 w-full max-w-xs space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <DollarSign className="w-5 h-5" />
              <span>Enviar SuperChat</span>
            </div>
            <p className="text-xs text-gray-300">
              Tu mensaje se fijará y destacará en color dorado durante el directo.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {['2.00', '5.00', '10.00'].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setDonationAmount(val)}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    donationAmount === val 
                      ? 'bg-amber-500 text-black border-amber-400' 
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  €{val}
                </button>
              ))}
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDonationModal(false)}
                className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSendDonation}
                className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-lg"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

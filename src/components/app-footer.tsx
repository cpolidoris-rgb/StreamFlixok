'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUp,
  Radio,
  Tv,
  Video,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  Heart,
  Globe,
  CheckCircle2,
  Send,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const RED_FILTER = {
  filter: 'invert(18%) sepia(100%) saturate(7413%) hue-rotate(359deg) brightness(101%) contrast(120%)',
};

// Social Icons SVGs
const YoutubeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TwitchIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.429h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
  </svg>
);

const XIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor">
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
  </svg>
);

const InstagramIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const WhatsappIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.523.074-.797.371-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.206 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export function PoliWebsBadge({ className = '' }: { className?: string }) {
  return (
    <a
      href="https://www.poliwebs.com"
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-zinc-900/90 hover:bg-zinc-900 border border-white/10 hover:border-sky-400/50 shadow-lg hover:shadow-[0_0_22px_rgba(56,189,248,0.25)] transition-all duration-300 cursor-pointer active:scale-95 ${className}`}
      title="Desarrollo: PoliWebs - poliwebs.com"
    >
      <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400 group-hover:text-zinc-200 transition-colors">
        Desarrollo:
      </span>
      <div className="flex items-center gap-2.5">
        {/* Rounded square icon with glowing gradient border and </> */}
        <div className="relative flex items-center justify-center w-7 h-7 rounded-lg p-[1.5px] bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 shadow-[0_0_10px_rgba(56,189,248,0.4)] group-hover:shadow-[0_0_16px_rgba(56,189,248,0.7)] transition-shadow">
          <div className="w-full h-full bg-[#020617] rounded-[6.5px] flex items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              className="w-4 h-4 text-sky-400 group-hover:scale-105 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 24 L14 32 L22 40" />
              <path d="M42 40 L50 32 L42 24" />
              <path d="M36 18 L28 46" stroke="#38bdf8" />
            </svg>
          </div>
        </div>

        {/* Text Logo matching PoliWebs official brand */}
        <div className="flex flex-col justify-center leading-none text-left">
          <span className="text-[14px] font-black tracking-tight text-white flex items-center">
            Poli<span className="text-sky-400 group-hover:text-sky-300 transition-colors">Webs</span>
          </span>
          <span className="text-[7.5px] font-extrabold uppercase tracking-[0.18em] text-zinc-400 group-hover:text-zinc-200 transition-colors mt-0.5">
            DESARROLLO WEB
          </span>
        </div>
      </div>
    </a>
  );
}

export default function AppFooter() {
  const [modalType, setModalType] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportChannel, setReportChannel] = useState('');
  const [reportIssue, setReportIssue] = useState('black_screen');

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const categories = [
    { label: 'Streaming', path: '/?category=Streaming' },
    { label: 'TV Noticias', path: '/?category=TV%20Noticias' },
    { label: 'TV Abierta', path: '/?category=TV%20Abierta' },
    { label: 'Deportes', path: '/?category=Deportes' },
    { label: 'Radio en Vivo', path: '/?category=Radio' },
    { label: 'Streamers', path: '/?category=Streamers' },
  ];

  return (
    <footer className="relative bg-zinc-950 border-t border-white/10 text-zinc-400 select-none overflow-hidden">
      {/* Top red accent glow line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

      <div className="container mx-auto max-w-[1800px] px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">
          
          {/* COLUMNA 1: MARCA Y DESCRIPCIÓN */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block transition-transform duration-300 hover:scale-105">
              <Image
                src="https://inforosario.com/logostream.png"
                alt="StreamFLIX"
                width={190}
                height={50}
                style={RED_FILTER}
                className="w-[180px] h-auto object-contain"
                unoptimized
              />
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Tu portal centralizado de transmisiones en directo, televisión abierta, periodismo, transmisiones deportivas, radios y los mejores streamers de la comunidad de habla hispana.
            </p>

            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Señales y Servidores Operativos 24/7
              </span>
            </div>

            {/* Redes Sociales */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:border-primary/60 hover:bg-primary/20 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>
              <a
                href="https://twitch.tv"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 hover:bg-purple-500/20 hover:text-purple-400 flex items-center justify-center transition-all duration-300"
                aria-label="Twitch"
              >
                <TwitchIcon className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:border-white/40 hover:bg-white/10 hover:text-white flex items-center justify-center transition-all duration-300"
                aria-label="X (Twitter)"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500 hover:bg-pink-500/20 hover:text-pink-400 flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-400 flex items-center justify-center transition-all duration-300"
                aria-label="WhatsApp"
              >
                <WhatsappIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* COLUMNA 2: CATEGORÍAS */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Tv className="w-4 h-4 text-primary" /> Categorías en Vivo
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.label}>
                  <Link
                    href={cat.path}
                    className="hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-primary transition-colors" />
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMNA 3: CREADORES & TRANSMISIÓN */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" /> Transmisión
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/broadcast"
                  className="hover:text-primary font-bold text-white transition-colors flex items-center gap-2"
                >
                  <Radio className="w-3.5 h-3.5 text-primary animate-pulse" /> Transmitir Canal
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setModalType('faq')}
                  className="hover:text-white transition-colors text-left"
                >
                  Cómo emitir señal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('faq')}
                  className="hover:text-white transition-colors text-left"
                >
                  Canales YouTube / Twitch
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('report')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Reportar problema
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: LEGAL & ASISTENCIA */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> Ayuda & Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setModalType('faq')}
                  className="hover:text-white transition-colors text-left flex items-center gap-2"
                >
                  <HelpCircle className="w-3.5 h-3.5" /> Preguntas Frecuentes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('terms')}
                  className="hover:text-white transition-colors text-left"
                >
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('privacy')}
                  className="hover:text-white transition-colors text-left"
                >
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalType('dmca')}
                  className="hover:text-white transition-colors text-left"
                >
                  Aviso Legal y DMCA
                </button>
              </li>
            </ul>

            <div className="pt-2">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] text-zinc-400 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Disfruta de la mejor calidad Ultra HD y baja latencia en todos tus dispositivos favoritos.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* LÍNEA DIVISORIA INFERIOR */}
        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs text-zinc-500 text-center sm:text-left">
            <span>© {new Date().getFullYear()} <strong className="text-zinc-300">StreamFLIX</strong>. Todos los derechos reservados.</span>
            <span className="hidden sm:inline text-zinc-700">•</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-zinc-400" /> Español (Latinoamérica)
            </span>
          </div>

          {/* DESARROLLO: POLIWEBS */}
          <div className="flex items-center">
            <PoliWebsBadge />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-primary text-zinc-300 hover:text-white text-xs font-black uppercase tracking-widest transition-all duration-300 border border-white/10 hover:border-primary cursor-pointer active:scale-95"
            >
              <span>Volver arriba</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: TÉRMINOS Y CONDICIONES */}
      <Dialog open={modalType === 'terms'} onOpenChange={(open) => !open && setModalType(null)}>
        <DialogContent className="max-w-xl bg-zinc-950 border-white/10 text-white p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Términos y Condiciones
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Última actualización: Enero 2026
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-xs text-zinc-300 leading-relaxed mt-4">
            <p>
              Bienvenido a <strong>StreamFLIX</strong>. Al utilizar este sitio y sus servicios, aceptas cumplir con los siguientes términos y condiciones de uso.
            </p>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">1. Naturaleza del Servicio</h4>
            <p>
              StreamFLIX es una plataforma interactiva de agregación y visualización que reúne reproductores oficiales y transmisiones públicas en vivo de plataformas autorizadas (YouTube, Twitch, Kick, entre otras). StreamFLIX no almacena material audiovisual protegido sin autorización en sus servidores directos.
            </p>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">2. Responsabilidad de Contenido</h4>
            <p>
              Los canales, comentarios y emisiones emitidas por creadores independientes son de su exclusiva responsabilidad. Los usuarios deben respetar las normativas de propiedad intelectual y convivencia digital.
            </p>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">3. Acceso y Uso</h4>
            <p>
              El servicio es de libre acceso. Nos reservamos el derecho de moderar señales que infrinjan normativas de convivencia o leyes vigentes.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: POLÍTICA DE PRIVACIDAD */}
      <Dialog open={modalType === 'privacy'} onOpenChange={(open) => !open && setModalType(null)}>
        <DialogContent className="max-w-xl bg-zinc-950 border-white/10 text-white p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Política de Privacidad
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Cómo protegemos tus datos en StreamFLIX
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-xs text-zinc-300 leading-relaxed mt-4">
            <p>
              En <strong>StreamFLIX</strong> respetamos tu privacidad. Tus datos de autenticación (cuando inicias sesión mediante Firebase Auth con Google o correo electrónico) se utilizan exclusivamente para personalizar tu experiencia, recordar tus canales favoritos y permitir la interacción en salas de transmisión.
            </p>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Información recopilada</h4>
            <p>
              Solo recopilamos la información básica provista por el proveedor de autenticación (nombre público, correo electrónico y foto de perfil). No compartimos ni vendemos datos personales a terceros con fines comerciales.
            </p>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Cookies y almacenamiento</h4>
            <p>
              Utilizamos almacenamiento local (localStorage) exclusivamente para mantener activa la sesión del usuario y recordar preferencias de volumen y modo de reproducción.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: PREGUNTAS FRECUENTES (FAQ) */}
      <Dialog open={modalType === 'faq'} onOpenChange={(open) => !open && setModalType(null)}>
        <DialogContent className="max-w-xl bg-zinc-950 border-white/10 text-white p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" /> Preguntas Frecuentes
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Respuestas rápidas sobre el funcionamiento de StreamFLIX
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-xs text-zinc-300 leading-relaxed mt-4">
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">
                ¿Cómo puedo transmitir mi canal en StreamFLIX?
              </h4>
              <p>
                Haz clic en el botón superior &quot;TRANSMITIR&quot; o en &quot;Transmitir Canal&quot; en el pie de página. Completa el formulario con tu canal de YouTube, Twitch o Kick y tu señal quedará lista en la cartelera.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">
                ¿Tiene algún costo utilizar StreamFLIX?
              </h4>
              <p>
                No. StreamFLIX es completamente gratuito para espectadores y creadores de contenido.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">
                ¿Qué hago si una señal no carga o se ve negra?
              </h4>
              <p>
                Algunas transmisiones en vivo pueden demorar unos segundos en sincronizar el búfer o pueden requerir que des clic en &quot;Play&quot;. Si el canal continúa sin señal, puedes reportarlo desde la opción &quot;Reportar problema&quot; en el pie de página.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: AVISO LEGAL Y DMCA */}
      <Dialog open={modalType === 'dmca'} onOpenChange={(open) => !open && setModalType(null)}>
        <DialogContent className="max-w-xl bg-zinc-950 border-white/10 text-white p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Aviso Legal y DMCA
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Derechos de propiedad intelectual y marcas registradas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-xs text-zinc-300 leading-relaxed mt-4">
            <p>
              Todos los logotipos, marcas comerciales y nombres de canales mencionados o exhibidos en StreamFLIX pertenecen a sus respectivos propietarios legítimos.
            </p>
            <p>
              StreamFLIX opera como reproductor indexador en vivo de señales públicas distribuidas oficialmente a través de plataformas de streaming con capacidades de inserción embebida (embeds públicos).
            </p>
            <p>
              Si eres titular de derechos de autor y consideras que algún contenido debe ser retirado de nuestra plataforma de indexación, contáctanos indicando el enlace del canal para su desvinculación inmediata.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: REPORTAR SEÑAL CAÍDA */}
      <Dialog
        open={modalType === 'report'}
        onOpenChange={(open) => {
          if (!open) {
            setModalType(null);
            setReportSuccess(false);
          }
        }}
      >
        <DialogContent className="max-w-md bg-zinc-950 border-white/10 text-white p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Reportar Problema de Señal
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Notifícanos sobre un canal con corte o señal no disponible
            </DialogDescription>
          </DialogHeader>

          {reportSuccess ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">¡Reporte Enviado!</h4>
              <p className="text-xs text-zinc-400">
                Gracias por avisarnos. Nuestro equipo revisará la señal a la brevedad.
              </p>
              <button
                onClick={() => {
                  setModalType(null);
                  setReportSuccess(false);
                  setReportChannel('');
                }}
                className="mt-4 px-6 py-2 bg-primary text-white font-bold text-xs uppercase rounded-full hover:bg-primary/80"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setReportSuccess(true);
              }}
              className="space-y-4 mt-2"
            >
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                  Nombre del Canal o Transmisión
                </label>
                <input
                  required
                  value={reportChannel}
                  onChange={(e) => setReportChannel(e.target.value)}
                  placeholder="Ej: TN, Telefe, Gran Hermano..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                  Tipo de Problema
                </label>
                <select
                  value={reportIssue}
                  onChange={(e) => setReportIssue(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary"
                >
                  <option value="black_screen">Pantalla en negro / no carga</option>
                  <option value="audio_issue">Sin audio o desfasado</option>
                  <option value="frozen">Transmisión congelada</option>
                  <option value="offline">Canal fuera del aire</option>
                  <option value="wrong_stream">Transmisión incorrecta o repetida</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-primary hover:bg-primary/80 text-white font-black uppercase text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" /> Enviar Reporte
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </footer>
  );
}

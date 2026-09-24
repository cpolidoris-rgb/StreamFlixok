import { useState, useEffect } from 'react';

export function usePathname() {
  const [pathname, setPathname] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const handlePop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  return pathname;
}

export function useSearchParams() {
  const [searchParams, setSearchParams] = useState(
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  );

  useEffect(() => {
    const handlePop = () => setSearchParams(new URLSearchParams(window.location.search));
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  return searchParams;
}

export function useParams(): Record<string, string> {
  const pathname = usePathname();
  // Match /stream/:id
  const streamMatch = pathname.match(/^\/stream\/([^/]+)/);
  if (streamMatch) {
    return { id: streamMatch[1] };
  }
  return {};
}

export function useRouter() {
  return {
    push: (url: string) => {
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
    replace: (url: string) => {
      window.history.replaceState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
    back: () => window.history.back(),
    forward: () => window.history.forward()
  };
}

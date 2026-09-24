declare module 'next/image' {
  import React from 'react';
  export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fill?: boolean;
    priority?: boolean;
    unoptimized?: boolean;
  }
  const Image: React.FC<ImageProps>;
  export default Image;
}

declare module 'next/link' {
  import React from 'react';
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
  }
  const Link: React.FC<LinkProps>;
  export default Link;
}

declare module 'next/navigation' {
  export function useParams(): Record<string, string>;
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
  };
}

import * as React from 'react';
import { cn } from '@/lib/utils';

export function Avatar({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AvatarImage({
  className,
  src,
  alt = '',
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [hasError, setHasError] = React.useState(!src);

  React.useEffect(() => {
    setHasError(!src);
  }, [src]);

  if (hasError || !src) return null;

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={cn('aspect-square h-full w-full object-cover', className)}
      {...props}
    />
  );
}

export function AvatarFallback({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-white',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

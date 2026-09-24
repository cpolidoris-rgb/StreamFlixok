import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  let variantStyles = 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80';
  if (variant === 'secondary') variantStyles = 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80';
  if (variant === 'destructive') variantStyles = 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80';
  if (variant === 'outline') variantStyles = 'text-foreground border border-white/20';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantStyles,
        className
      )}
      {...props}
    />
  );
}

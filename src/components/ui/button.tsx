import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer';
    
    let variantStyles = 'bg-primary text-primary-foreground shadow hover:bg-primary/90';
    if (variant === 'destructive') variantStyles = 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90';
    if (variant === 'outline') variantStyles = 'border border-white/20 bg-transparent shadow-sm hover:bg-white/10 hover:text-white';
    if (variant === 'secondary') variantStyles = 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80';
    if (variant === 'ghost') variantStyles = 'hover:bg-white/10 hover:text-white';
    if (variant === 'link') variantStyles = 'text-primary underline-offset-4 hover:underline';

    let sizeStyles = 'h-9 px-4 py-2 text-sm';
    if (size === 'sm') sizeStyles = 'h-8 rounded-md px-3 text-xs';
    if (size === 'lg') sizeStyles = 'h-11 rounded-md px-8 text-base';
    if (size === 'icon') sizeStyles = 'h-9 w-9';

    return (
      <button
        ref={ref}
        className={cn(base, variantStyles, sizeStyles, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = React.createContext<DropdownContextType>({
  open: false,
  setOpen: () => {},
});

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block" ref={containerRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
  ...props
}: {
  asChild?: boolean;
  children: React.ReactElement<any>;
} & React.HTMLAttributes<HTMLElement>) {
  const { setOpen } = React.useContext(DropdownContext);

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      setOpen(prev => !prev);
    },
    ...props,
  });
}

export function DropdownMenuContent({
  className,
  align = 'end',
  children,
  ...props
}: {
  className?: string;
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { open } = React.useContext(DropdownContext);

  if (!open) return null;

  let alignClass = 'right-0';
  if (align === 'start') alignClass = 'left-0';
  if (align === 'center') alignClass = 'left-1/2 -translate-x-1/2';

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-1 text-white shadow-2xl animate-in fade-in-0 zoom-in-95',
        alignClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  className,
  asChild,
  children,
  onClick,
  ...props
}: {
  className?: string;
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = React.useContext(DropdownContext);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick(e);
    setOpen(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-white/10 focus:bg-white/10',
        className,
        (children as React.ReactElement<any>).props.className
      ),
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<any>).props.onClick?.(e);
        handleClick(e);
      },
    });
  }

  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-white/10 focus:bg-white/10',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('px-2 py-1.5 text-xs font-semibold text-zinc-400', className)}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('-mx-1 my-1 h-px bg-white/10', className)}
      {...props}
    />
  );
}

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PopoverContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopoverContext = React.createContext<PopoverContextType>({
  open: false,
  setOpen: () => {},
});

export function Popover({ children }: { children: React.ReactNode }) {
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
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block w-full" ref={containerRef}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({
  asChild,
  children,
  ...props
}: {
  asChild?: boolean;
  children: React.ReactElement<any>;
} & React.HTMLAttributes<HTMLElement>) {
  const { setOpen } = React.useContext(PopoverContext);

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      setOpen(prev => !prev);
    },
    ...props,
  });
}

export function PopoverContent({
  className,
  align = 'center',
  children,
  ...props
}: {
  className?: string;
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { open } = React.useContext(PopoverContext);

  if (!open) return null;

  let alignClass = 'left-1/2 -translate-x-1/2';
  if (align === 'start') alignClass = 'left-0';
  if (align === 'end') alignClass = 'right-0';

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 w-72 rounded-xl border border-white/10 bg-zinc-950 p-4 text-white shadow-2xl outline-none animate-in fade-in-0 zoom-in-95',
        alignClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

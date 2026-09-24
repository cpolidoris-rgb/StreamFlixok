import { useState, useCallback } from 'react';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = useCallback(({ title, description }: ToastProps) => {
    // Show native-styled toast or dispatch custom event
    const toastEl = document.createElement('div');
    toastEl.className = 'fixed bottom-6 right-6 z-50 rounded-xl bg-zinc-900 border border-white/20 p-4 text-white shadow-2xl animate-in slide-in-from-bottom-5 duration-300';
    toastEl.innerHTML = `
      ${title ? `<div class="font-black text-sm uppercase tracking-wider">${title}</div>` : ''}
      ${description ? `<div class="text-xs text-zinc-400 mt-1">${description}</div>` : ''}
    `;
    document.body.appendChild(toastEl);
    setTimeout(() => {
      toastEl.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => toastEl.remove(), 300);
    }, 3000);
  }, []);

  return { toast };
}

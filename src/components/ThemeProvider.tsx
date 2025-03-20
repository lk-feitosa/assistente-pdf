
import React from 'react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Toggle } from './ui/toggle';
import { cn } from '@/lib/utils';
import { Sun } from 'lucide-react';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

export const ThemeToggle = ({ className }: { className?: string }) => {
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 50;

  return (
    <Toggle 
      className={cn(
        "transition-all duration-200",
        isScrolled ? "p-2" : "p-2.5",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className={cn("h-[1.2rem] w-[1.2rem]", isScrolled ? "h-4 w-4" : "h-5 w-5")} />
    </Toggle>
  );
};

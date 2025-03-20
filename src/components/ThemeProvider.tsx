
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { Toggle } from './ui/toggle';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 50;

  return (
    <Toggle 
      pressed={theme === 'dark'} 
      onPressedChange={toggleTheme}
      className={cn(
        "transition-all duration-200",
        isScrolled ? "p-2" : "p-2.5",
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Moon className={cn("h-[1.2rem] w-[1.2rem]", isScrolled ? "h-4 w-4" : "h-5 w-5")} />
      ) : (
        <Sun className={cn("h-[1.2rem] w-[1.2rem]", isScrolled ? "h-4 w-4" : "h-5 w-5")} />
      )}
    </Toggle>
  );
};

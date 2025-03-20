
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { cn } from '@/lib/utils';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 50;

  return (
    <button 
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-2 transition-all duration-200",
        className
      )}
      aria-label="Alternar tema"
    >
      {theme === 'light' ? (
        <>
          <Sun className={cn("h-[1.2rem] w-[1.2rem]", isScrolled ? "h-4 w-4" : "h-5 w-5")} />
          <span className="text-sm">Modo claro</span>
        </>
      ) : (
        <>
          <Moon className={cn("h-[1.2rem] w-[1.2rem]", isScrolled ? "h-4 w-4" : "h-5 w-5")} />
          <span className="text-sm">Modo escuro</span>
        </>
      )}
    </button>
  );
};


import React, { createContext, useContext, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Moon, Sun, SunMoon } from 'lucide-react';

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

interface ThemeToggleProps {
  className?: string;
  iconOnly?: boolean;
}

export const ThemeToggle = ({ className, iconOnly = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-2 transition-all duration-200 w-full",
        className
      )}
      aria-label="Alternar tema"
    >
      {theme === 'light' ? (
        <>
          <Sun className="h-[1.2rem] w-[1.2rem]" />
          <span className="text-sm">Modo escuro</span>
        </>
      ) : (
        <>
          <Moon className="h-[1.2rem] w-[1.2rem]" />
          <span className="text-sm">Modo claro</span>
        </>
      )}
    </button>
  );
};

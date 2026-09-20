import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { readStore, writeStore } from '../utils/storage.js';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readStore('theme', null) || document.documentElement.classList.item(0) || 'light');

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    writeStore('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((current) => (current === 'dark' ? 'light' : 'dark')), []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}

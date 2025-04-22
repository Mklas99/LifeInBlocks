import { useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

export const useTheme = (): [ThemeMode, () => void] => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // Check if theme is saved in localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    
    // If not, check for system preference
    if (!savedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return savedTheme || 'light';
  });

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme: ThemeMode = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, toggleTheme];
};
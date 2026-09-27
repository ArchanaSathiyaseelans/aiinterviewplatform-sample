import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    localStorage.removeItem('hirepulse_theme');
  }, [theme]);

  const toggleTheme = () => {
    // Keeps theme set to dark
    setTheme('dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'dark',
      setTheme: () => {},
      toggleTheme: () => {}
    };
  }
  return context;
};

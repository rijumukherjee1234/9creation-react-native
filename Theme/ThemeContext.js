import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './colors';

// Create Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get system theme (light or dark)
  const systemTheme = useColorScheme(); 
  
  // Set state based on system theme
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark');

  // Listen for system theme changes automatically
  useEffect(() => {
    setIsDarkMode(systemTheme === 'dark');
  }, [systemTheme]);

  // Optional: Function if you want a manual toggle switch in your app settings
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Determine which colors to use
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to easily use the theme in any component
export const useTheme = () => useContext(ThemeContext);
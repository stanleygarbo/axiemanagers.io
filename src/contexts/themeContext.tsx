import React, { createContext, useContext, useEffect, useState } from "react";
import { IThemeContext } from "../interfaces/IThemeContext";
import { colors } from "../colors/colors";

const themeContext = createContext<IThemeContext>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  colors: colors.lightMode,
});

const useThemeContext = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme == null) {
      setIsDarkMode(false);
    }
    if (theme === "light") {
      setIsDarkMode(false);
    }
    if (theme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return {
    isDarkMode,
    toggleDarkMode,
    colors: isDarkMode ? colors.darkMode : colors.lightMode,
  };
};

export const ThemeContextProvider: React.FC<{ children: React.ReactChild }> = ({
  children,
}) => {
  const theme = useThemeContext();

  return (
    <themeContext.Provider value={theme}>{children}</themeContext.Provider>
  );
};

export const useTheme = () => useContext(themeContext);

import React, { useState, useEffect, createContext, useContext } from "react";
import { IScreenSizeContext } from "../interfaces/IScreenSizeContext";

const screenSizeContext = createContext<IScreenSizeContext>({
  screenWidth: 0,
});

const useThemeContext = () => {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.addEventListener("resize", handleResize);
  }, []);

  function handleResize() {
    setScreenWidth(window.innerWidth);
  }

  return {
    screenWidth,
  };
};

export const ScreenSizeContextProvider: React.FC<{
  children: React.ReactChild;
}> = ({ children }) => {
  const theme = useThemeContext();
  return (
    <screenSizeContext.Provider value={theme}>
      {children}
    </screenSizeContext.Provider>
  );
};

export const useScreenSize = () => useContext(screenSizeContext);

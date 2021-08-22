import React from "react";
import { ThemeContextProvider } from "./themeContext";
import { IAllContextProviders } from "../interfaces/IAllContextProviders";
import { ScreenSizeContextProvider } from "./screenSizeContext";
import { ScholarContextProvider } from "./scholarsContext";

const Index: React.FC<IAllContextProviders> = ({ children }) => {
  return (
    <ThemeContextProvider>
      <ScreenSizeContextProvider>
        <ScholarContextProvider>{children}</ScholarContextProvider>
      </ScreenSizeContextProvider>
    </ThemeContextProvider>
  );
};

export default Index;

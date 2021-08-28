import React from "react";
import { ThemeContextProvider } from "./themeContext";
import { IAllContextProviders } from "../interfaces/IAllContextProviders";
import { ScreenSizeContextProvider } from "./screenSizeContext";
import { ScholarContextProvider } from "./scholarsContext";
import { UserPreferencesContextProvider } from "./userPreferences";

const Index: React.FC<IAllContextProviders> = ({ children }) => {
  return (
    <ThemeContextProvider>
      <ScreenSizeContextProvider>
        <UserPreferencesContextProvider>
          <ScholarContextProvider>{children}</ScholarContextProvider>
        </UserPreferencesContextProvider>
      </ScreenSizeContextProvider>
    </ThemeContextProvider>
  );
};

export default Index;

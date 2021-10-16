import React, { createContext, useContext, useEffect, useState } from "react";
import { IScrollContext } from "../interfaces/IScrollContext";

const scrollContext = createContext<IScrollContext>({
  scrollPosition: 0,
  isScrollingDown: false,
  setIsScrollable: () => {},
});

const useScrollContext = () => {
  const [isScrollingDown, setIsScrollingDown] = useState<boolean>(false);

  const [scrollPosition, setSrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    const topBar = document.getElementById("top-bar");

    setSrollPosition((prev) => {
      setIsScrollingDown(prev < position);
      if (prev < position) {
        if (topBar) {
          topBar.style.top = "-86px";
        }
      } else {
        if (topBar) {
          topBar.style.top = "0px";
        }
      }

      return position;
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function setIsScrollable(should: boolean) {
    document.body.style.overflowY = should ? "auto" : "hidden";
  }

  return {
    isScrollingDown,
    setIsScrollable,
    scrollPosition,
  };
};

export const ScrollContextProvider: React.FC<{ children: React.ReactChild }> =
  ({ children }) => {
    const theme = useScrollContext();

    return (
      <scrollContext.Provider value={theme}>{children}</scrollContext.Provider>
    );
  };

export const useScroll = () => useContext(scrollContext);

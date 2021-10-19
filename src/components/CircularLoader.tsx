import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { ICircularLoader } from "../interfaces/ICircularLoader";

const Loader = styled.div<{
  colors: IColors;
  size: "small" | "medium" | "large";
}>`
  ${({ colors, size }) => css`
    ${size === "large"
      ? css`
          width: 50px;
          height: 50px;

          border: 3px solid ${colors.textIntense + 20};
          border-left: 3px solid ${colors.accent};
        `
      : size === "medium"
      ? css`
          width: 35px;
          height: 35px;
          border: 2px solid ${colors.textIntense + 20};
          border-left: 2px solid ${colors.accent};
        `
      : css`
          width: 20px;
          height: 20px;
          border: 1px solid ${colors.textIntense + 20};
          border-left: 1px solid ${colors.accent};
        `}
    border-radius: 100%;
    border-left: 3px solid ${colors.accent};
    animation: circular-loader 0.5s linear infinite;
    @keyframes circular-loader {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `}
`;

const CircularLoader: React.FC<ICircularLoader> = ({ size }) => {
  const { colors } = useTheme();
  return <Loader size={size} colors={colors}></Loader>;
};

export default CircularLoader;

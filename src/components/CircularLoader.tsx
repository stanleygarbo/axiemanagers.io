import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

const Loader = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    width: 50px;
    height: 50px;
    border-radius: 100%;
    border: 3px solid ${colors.textIntense + 20};
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

const CircularLoader = () => {
  const { colors } = useTheme();
  return <Loader colors={colors}></Loader>;
};

export default CircularLoader;

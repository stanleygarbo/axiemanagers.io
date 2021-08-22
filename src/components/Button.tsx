import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IButton } from "../interfaces/IButton";
import { IColors } from "../interfaces/IColors";

const StyledButton = styled.button<{
  colors: IColors;
  bgColor?: string;
  animated: boolean;
  foreground: string;
  disabled: boolean;
}>`
  padding: 6px 35px;
  font-weight: 700;
  position: relative;
  overflow: hidden;
  z-index: 1;
  /* margin-top: 50px; */
  border-radius: 5px;
  border: none;
  /* box-shadow: 0px 2px 10px -4px rgba(0, 0, 0, 0.5); */
  font-size: 13px;
  background-color: ${({ bgColor }) => bgColor};
  color: ${({ foreground }) => foreground};
  transition: 0.15s;
  ${({ disabled }) =>
    disabled
      ? css`
          cursor: not-allowed;
        `
      : css`
          cursor: pointer;
          &:active {
            transform: scale(0.97);
          }
        `}
  ${({ animated, bgColor }) =>
    animated &&
    css`
      background-color: transparent;
      border: 2px solid ${bgColor};
      color: ${bgColor};
      transition: 0.3s;
      &::before {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        top: 100%;
        left: 0;
        background-color: ${bgColor};
        transition: 0.3s;
        z-index: -1;
      }
    `}
  @media (min-width: 749px) {
    &:hover {
      ${({ colors, animated, bgColor }) =>
        animated
          ? css`
              color: #fff;
              &::before {
                top: 0%;
              }
            `
          : css`
              background-color: ${bgColor !== "transparent"
                ? bgColor + "90"
                : colors.textIntense + "20"};
              opacity: 0.75;
            `}
    }
  }
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
`;

const Button: React.FC<IButton> = ({
  onClick,
  style,
  children,
  bgColor,
  animated,
  foreground,
  type = "button",
  disabled = false,
}) => {
  const { colors } = useTheme();
  return (
    <StyledButton
      type={type}
      disabled={disabled}
      foreground={foreground ? foreground : colors.textIntense}
      animated={!!animated}
      bgColor={bgColor}
      onClick={disabled ? undefined : onClick}
      colors={colors}
      style={style}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

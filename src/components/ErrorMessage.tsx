import React from "react";
import { IErrorMessage } from "../interfaces/IErrorMessage";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

const ErrorMessage: React.FC<IErrorMessage> = ({ title, message }) => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      <div className="content">
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
    z-index: 1;

    .content {
      width: 300px;
      border: 1px solid ${colors.danger};
      background: ${colors.BGLight};
      color: ${colors.textNotSoIntense};
      border-radius: 5px;
      padding: 20px;
      h2 {
        padding-bottom: 20px;
        margin: 0;
      }
      p {
        font-size: 18px;
      }
    }
  `}
`;

export default ErrorMessage;

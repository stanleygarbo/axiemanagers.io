import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    width: 100%;
    text-align: center;
    margin-top: 200px;
    h1 {
      color: ${colors.textNotSoIntense};
      span {
        font-weight: 300;
      }
    }
  `}
`;

const NotFoundMessage = () => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      <h1>
        Error 404 <span>| Not Found</span>
      </h1>
    </Container>
  );
};

export default NotFoundMessage;

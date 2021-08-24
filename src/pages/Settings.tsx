import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

const Settings = () => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      More features will come soon such as bulk import, gas fees and much more!
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    color: ${colors.textNotSoIntense};
    text-align: center;
    margin-top: 40px;
  `}
`;

export default Settings;

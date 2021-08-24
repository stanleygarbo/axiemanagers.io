import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

const SettingsBulkImport = () => {
  const { colors } = useTheme();

  return <Container colors={colors}>Coming Soon</Container>;
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    background-color: rgba(0, 0, 0, 0.09);
    padding: 20px;
    border-radius: 5px;

    color: ${colors.textNotSoIntense};
  `}
`;

export default SettingsBulkImport;

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
    background-color: rgba(0, 0, 0, 0.07);
    padding: 15px;
    border-radius: 5px;
    flex: 1;
    margin: 0 20px;
    border: 1px solid ${colors.textIntense + 10};

    color: ${colors.textNotSoIntense};
  `}
`;

export default SettingsBulkImport;

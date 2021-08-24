import React from "react";
import { useHistory } from "react-router-dom";
import styled, { css } from "styled-components";
import SettingsNav from "../components/SettingsNav";
import { useScreenSize } from "../contexts/screenSizeContext";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

const Settings = () => {
  const { colors } = useTheme();
  const { screenWidth } = useScreenSize();
  const { push } = useHistory();

  if (screenWidth > 1000) {
    push("/");
  }

  return (
    <Container colors={colors}>
      <SettingsNav />
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    color: ${colors.textNotSoIntense};
    margin-top: 40px;
  `}
`;

export default Settings;

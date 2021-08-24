import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

const SettingsNav = () => {
  const { colors } = useTheme();
  const { pathname } = useLocation();

  return (
    <Container colors={colors}>
      <div className="settings-title">OPTIONS</div>
      <Link
        to="/settings/bulk-import"
        className={pathname === "/settings/bulk-import" ? `active-tab` : ""}
      >
        Bulk Import
      </Link>
      <Link
        to="/settings/interface"
        className={pathname === "/settings/interface" ? `active-tab` : ""}
      >
        Interface
      </Link>
      <Link
        to="/settings/min-quota"
        className={pathname === "/settings/min-quota" ? `active-tab` : ""}
      >
        Minimum Quota
      </Link>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    display: flex;
    flex-direction: column;
    max-width: 200px;
    position: sticky;
    top: 90px;
    left: 0px;

    a {
      color: ${colors.textNotSoIntense};
      margin-bottom: 10px;
      padding: 7px 20px;
      border-radius: 5px;
      &.active-tab {
        background-color: ${colors.BGLighter};
      }
    }

    .settings-title {
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 1px;
      margin-left: 20px;

      margin-bottom: 10px;
      color: ${colors.textIntense + 60};
    }
  `}
`;

export default SettingsNav;

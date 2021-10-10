import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import { ITabSelector } from "../../interfaces/scholar-page/ITabSelector";

const TabSelector: React.FC<ITabSelector> = ({ activeTab, setActiveTab }) => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      <button
        className={`btn-left ${activeTab === "reports" && "active"}`}
        onClick={() => setActiveTab("reports")}
      >
        Reports
      </button>
      <button
        className={`btn-right ${activeTab === "axies" && "active"}`}
        onClick={() => setActiveTab("axies")}
      >
        Axies
      </button>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    display: flex;

    button {
      border: 1px solid ${colors.textIntense + 20};

      color: ${colors.textNotSoIntense};
      background-color: ${colors.textIntense + "05"};

      display: grid;
      place-items: center;

      padding: 8px 20px;

      font-weight: 600;
      font-size: 15px;

      &.btn-left {
        border-radius: 5px 0px 0px 5px;
      }

      &.btn-right {
        border-radius: 0px 5px 5px 0px;
      }

      &.active {
        border: 1px solid ${colors.accent};
        color: ${colors.accent};
        background-color: ${colors.accent + "15"};
      }
    }
  `}
`;

export default TabSelector;

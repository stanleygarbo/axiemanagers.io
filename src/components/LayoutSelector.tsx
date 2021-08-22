import React from "react";
import { AiOutlineAppstore, AiFillAppstore } from "react-icons/ai";
import { RiTableLine, RiTableFill } from "react-icons/ri";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { ILayoutSelector } from "../interfaces/ILayoutSelector";

const LayoutSelector: React.FC<ILayoutSelector> = ({
  activeLayout,
  setActiveLayout,
}) => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      <button
        className={`btn-left ${activeLayout === "cards" && "active"}`}
        onClick={() => setActiveLayout("cards")}
      >
        {activeLayout === "cards" ? (
          <AiFillAppstore size={25} />
        ) : (
          <AiOutlineAppstore size={25} />
        )}
      </button>
      <button
        className={`btn-right ${activeLayout === "tabular" && "active"}`}
        onClick={() => setActiveLayout("tabular")}
      >
        {activeLayout === "tabular" ? (
          <RiTableFill size={25} />
        ) : (
          <RiTableLine size={25} />
        )}
      </button>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    display: flex;
    button {
      height: 40px;
      width: 40px;
      border: 1px solid ${colors.textIntense + 20};

      color: ${colors.textNotSoIntense};
      background-color: ${colors.textIntense + "05"};

      display: grid;
      place-items: center;

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

export default LayoutSelector;

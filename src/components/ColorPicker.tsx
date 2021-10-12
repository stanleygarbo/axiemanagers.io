import React, { useState } from "react";
import { SwatchesPicker } from "react-color";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColorPicker } from "../interfaces/IColorPicker";
import { IColors } from "../interfaces/IColors";

const ColorPicker: React.FC<IColorPicker> = ({ color, setActiveColor }) => {
  const { colors } = useTheme();
  const [isOpened, setIsOpened] = useState<boolean>(false);

  function colorChangeHandler(color: any) {
    setActiveColor(color.hex);
  }

  function pickerClickHandler() {
    setIsOpened(!isOpened);
  }

  return (
    <Container colors={colors}>
      <div
        className="color"
        onClick={pickerClickHandler}
        style={{ background: color }}
      ></div>

      {isOpened && (
        <div className="picker">
          <div className="picker__backdrop" onClick={pickerClickHandler}></div>
          <SwatchesPicker onChange={colorChangeHandler} />
        </div>
      )}
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    position: relative;
    .color {
      width: 25px;
      height: 25px;
      border: 2px solid ${colors.textIntense + 60};
      border-radius: 5px;
      cursor: pointer;
    }
    .picker {
      position: fixed;
      left: 0px;
      bottom: 0px;
      z-index: 105;
      width: 100%;
      height: 100vh;
      display: grid;
      place-items: center;

      &__backdrop {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;

        background-color: rgba(0, 0, 0, 0.5);
      }
    }
  `}
`;

export default ColorPicker;

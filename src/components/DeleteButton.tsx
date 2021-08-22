import React from "react";
import styled, { css } from "styled-components";
import { IDeleteButton } from "../interfaces/IDeleteButton";

import { RiDeleteBin5Line } from "react-icons/ri";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { useState } from "react";

const Container = styled.div<{ colors: IColors; isOpened: boolean }>`
  ${({ colors, isOpened }) => css`
    position: relative;
    z-index: 1;
    user-select: none;
    width: fit-content;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
    .btn {
      cursor: pointer;
      width: 45px;
      height: 45px;
      transition: 0.3s;
      background-color: ${colors.BGDark};
      display: grid;
      place-items: center;
      border: 1px solid ${colors.textIntense + 20};
      color: ${isOpened ? colors.danger : colors.textNotSoIntense};
      z-index: 1;
    }
    .confirmation {
      transition: 0.3s;
      color: ${colors.textNotSoIntense};
      position: absolute;
      top: 0;
      left: 0px;
      width: 0px;
      overflow: hidden;
      z-index: -1;
      display: flex;
      ${isOpened &&
      css`
        left: 45px;
        width: 150px;
      `}
      background-color: ${colors.BGDark};
      display: flex;
      align-items: center;
      &__msg {
        padding: 0px 16px;
      }
      &__btn {
        background-color: ${colors.danger};
        cursor: pointer;
        color: #fff;
        height: 45px;
        position: relative;
        padding: 0px 20px;
        display: grid;
        place-items: center;
        &::before {
          position: absolute;
          content: "";
          left: -7px;
          background-color: ${colors.BGDark};
          width: 10px;
          height: 10px;
          transform: rotate(45deg) skew(-12deg, -12deg);
        }
        &:hover {
          background-color: ${colors.danger + 99};
        }
      }
    }
  `}
`;

const DeleteButton: React.FC<IDeleteButton> = ({ children, onClick }) => {
  const { colors } = useTheme();
  const [isOpened, setIsOpened] = useState<boolean>(false);

  return (
    <Container isOpened={isOpened} colors={colors}>
      <div className="btn" onClick={() => setIsOpened(!isOpened)}>
        {isOpened ? "No" : <RiDeleteBin5Line size={30} />}
      </div>
      <div className="confirmation">
        <div className="confirmation__msg">Delete</div>
        <div className="confirmation__btn" onClick={onClick}>
          Yes
        </div>
      </div>
    </Container>
  );
};

export default DeleteButton;

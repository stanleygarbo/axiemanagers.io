import { Field } from "formik";
import styled, { css } from "styled-components";
import { IColors } from "../interfaces/IColors";

export const FormikField = styled(Field)<{
  colors: IColors;
  bg: string;
}>`
  ${({ colors, bg }) => css`
    color: ${colors.textIntense};
    border-radius: 5px;

    transition: 0.2s;
    border: none;
    padding: 7px 15px;
    outline: none;
    &::placeholder {
      color: ${colors.textNotSoIntense + 99};
      font-weight: 600;
    }
    background-color: ${colors.textIntense + "15"};
    /* border: 1px solid ${colors.textIntense + 20}; */
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      display: none;
    }
    &:focus {
      border: ${`1px solid ${colors.accent}`};
    }
  `};
`;

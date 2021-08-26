import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { ISorters } from "../interfaces/ISorters";

const Sorters: React.FC<ISorters> = ({ setOrderBy, setOrder }) => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      <div className="sorters__caption">Order by</div>
      <select
        onChange={(e) => setOrderBy(e.target.value)}
        className="with-margin"
        name="sort"
        id=""
      >
        <option value="name">NAME</option>
        <option value="total">EARNED</option>
        <option value="lastClaimed">NEXT CLAIM</option>
      </select>
      <select onChange={(e) => setOrder(e.target.value)} name="sort" id="">
        <option value="desc">DESC</option>
        <option value="asc">ASC</option>
      </select>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    .sorters__caption {
      color: ${colors.textNotSoIntense};
    }

    select {
      border: 1px solid ${colors.textNotSoIntense};
      border-radius: 5px;
      padding: 2px 7px;

      outline: none;
      background-color: ${colors.textIntense + "05"};
      color: ${colors.textNotSoIntense};
      margin-right: 10px;

      option {
        background-color: ${colors.BGDark};
        color: ${colors.textIntense};
      }
    }
  `}
`;

export default Sorters;

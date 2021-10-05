import { useState } from "react";
import { useQuery } from "react-query";
import styled, { css } from "styled-components";
import { fetchSLPPrice } from "../api/requests";
import { useTheme } from "../contexts/themeContext";
import { useUserPreferences } from "../contexts/userPreferences";
import { IColors } from "../interfaces/IColors";
import { getCurrencySign } from "../util/getCurrencySign";

const Converter = () => {
  const { colors } = useTheme();
  const { currency } = useUserPreferences();
  const [conversion, setConversion] = useState(0);

  const SLPPriceQuery = useQuery(
    ["SLPPrice", currency],
    async () => await fetchSLPPrice(currency),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

  const onAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConversion(Number(e.target.value) * SLPPriceQuery.data?.current);
  };

  return (
    <Container colors={colors}>
      <div className="from">
        <div className="from__currency">
          <img src="/slp.png" alt="slp" width={22} /> SLP
        </div>
        <div className="from__amount">
          <input
            name="amount"
            type="number"
            placeholder="0.0"
            onChange={onAmountChange}
            autoComplete="off"
          />
        </div>
        <div className="from__conversion-rate">
          ~ {getCurrencySign(currency)}
          {conversion.toFixed(2)}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    color: ${colors.textNotSoIntense};
    background-color: ${colors.BGLight};

    padding: 20px;
    max-width: 400px;
    margin: auto;
    border-radius: 20px;
    margin-top: 20px;

    .from {
      /* border: 1px solid ${colors.textIntense + 10}; */
      display: flex;
      justify-content: space-between;
      border-radius: 15px;
      padding: 10px 10px 30px 10px;

      background-color: ${colors.textIntense + "05"};
      border: 1px solid ${colors.textIntense + 10};
      position: relative;

      &__currency {
        display: flex;
        align-items: center;
        font-weight: 600;

        padding: 5px 15px 5px 5px;
        background-color: ${colors.BGDark};
        border-radius: 20px;

        img {
          margin-right: 5px;
        }
      }

      &__amount {
        width: 80%;

        input {
          text-align: right;
          background-color: transparent;
          border: 0px;
          height: 100%;
          width: 100%;

          color: ${colors.textIntense};
          font-size: 24px;
          font-family: monospace;

          outline: none;

          &::-webkit-inner-spin-button,
          &::-webkit-outer-spin-button {
            display: none;
          }

          &::placeholder {
            color: ${colors.textNotSoIntense};
          }
        }
      }

      &__conversion-rate {
        position: absolute;
        bottom: 5px;
        right: 10px;
        font-size: 13px;
        padding-left: 5px;
      }
    }

    @media (max-width: 440px) {
      margin: 20px;
    }
  `}
`;

export default Converter;

import { Link } from "react-router-dom";
import React, { ChangeEvent, useState } from "react";
import styled, { css } from "styled-components";
import { useScholars } from "../contexts/scholarsContext";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { BsSearch } from "react-icons/bs";
import { useQueryClient } from "react-query";
import { Scholars, SLPPrice } from "../interfaces/IResponseTypes";
import { addCommaToNumber } from "../util/addCommaToNumber";
import { useUserPreferences } from "../contexts/userPreferences";
import { getCurrencySign } from "../util/getCurrencySign";

const SearchScholar = () => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { scholars } = useScholars();
  const [searchText, setSearchText] = useState<string>("");
  const { currency } = useUserPreferences();

  const queryClient = useQueryClient();
  const scholarsQuery = queryClient.getQueryState<Scholars, any>("Scholars");
  const SLPPriceQuery = queryClient.getQueryState<SLPPrice, any>([
    "SLPPrice",
    currency,
  ]);

  const searchTextChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(e.target.value);
  };

  return (
    <Container colors={colors} isFocused={isFocused}>
      <section>
        <BsSearch />
        <input
          onClick={() => setIsFocused(true)}
          onChange={searchTextChangeHandler}
          type={"text"}
          name={"search"}
          placeholder={"search scholar..."}
          autoComplete="off"
        />
      </section>
      {isFocused && (
        <div className="search__wrapper">
          <div className="search__wrapper__scholars">
            <div className="search__wrapper__scholars__header">
              <div>Nickname</div>

              <div>Earned</div>

              <div>Conversion</div>

              <div>Hex</div>
            </div>
            {scholars.map((i, idx) => {
              if (i.nickname.toLowerCase().includes(searchText.toLowerCase())) {
                const total = scholarsQuery?.data?.list[i.ronin]?.total;
                let conversionRate = "---";
                if (total && SLPPriceQuery && SLPPriceQuery.data) {
                  conversionRate = Math.floor(
                    total *
                      (SLPPriceQuery?.data &&
                        SLPPriceQuery?.data["smooth-love-potion"][
                          currency ? currency : "php"
                        ])
                  ).toString();
                }

                return (
                  <Link
                    key={idx}
                    to={`/scholar/${i.ronin}`}
                    onClick={() => setIsFocused(false)}
                  >
                    <div className="search__wrapper__scholars__info">
                      <div>{i.nickname}</div>

                      <div>
                        <img src="/slp.png" alt="" width={20} />
                        {addCommaToNumber(total || "")}
                      </div>

                      <div>
                        {getCurrencySign(currency)}
                        {addCommaToNumber(conversionRate)}
                      </div>

                      <div style={{ color: i.color }}>{i.color}</div>
                    </div>
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
      {isFocused && (
        <div
          className="search__wrapper__backdrop"
          onClick={() => setIsFocused(false)}
        ></div>
      )}
    </Container>
  );
};

const Container = styled.div<{ colors: IColors; isFocused: boolean }>`
  ${({ colors, isFocused }) => css`
    section {
      background-color: ${colors.textIntense + "05"};
      border: 1px solid ${colors.textIntense + 10};
      color: ${colors.textNotSoIntense};
      margin-left: 10px;
      position: relative;
      padding-left: 10px;
      border-radius: 5px;
      transition: 0.2s;
      z-index: 6;

      ${isFocused &&
      css`
        border: 1px solid ${colors.textIntense + 40};
        background-color: ${colors.BGDark};
      `}

      &:hover {
        border: 1px solid ${colors.accent};
      }
      input {
        border: none;
        background-color: transparent;
        color: ${colors.textIntense};
        width: calc(100% - 25px);
        padding: 10px;
        font-size: 16px;
        outline: none;

        color: ${colors.textNotSoIntense};
        z-index: 100;

        height: 35px;
        padding: 5px 10px;

        &::placeholder {
          color: ${colors.textNotSoIntense + 99};
        }
      }
    }

    .search__wrapper {
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      position: relative;

      &__backdrop {
        position: fixed;
        width: 100%;
        height: 100vh;
        top: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 5;
      }
      &__scholars {
        top: 10px;
        right: 0px;
        padding: 20px 20px 0 20px;
        z-index: 50;
        width: 500px;
        background-color: ${colors.BGLight};
        box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.3);
        border-radius: 5px;
        position: absolute;
        max-height: 300px;
        overflow-y: auto;

        a {
          text-decoration: none;
          color: ${colors.textNotSoIntense};
        }

        &__header {
          margin-bottom: 20px;
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.4fr 0.5fr;
          color: ${colors.textIntense};
        }
        &__info {
          margin-bottom: 20px;
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.1fr 0.8fr;

          &:hover {
            opacity: 0.5;
          }

          div {
            display: flex;
            align-items: center;

            img {
              margin-right: 5px;
            }
          }
        }
      }
    }
  `};
`;

export default SearchScholar;

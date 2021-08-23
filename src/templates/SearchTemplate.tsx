import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { useScholars } from "../contexts/scholarsContext";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { Scholars } from "../interfaces/IResponseTypes";
import { useQuery } from "react-query";
import { fetchAllScholars } from "../api/requests";
import { BsArrowUpRight } from "react-icons/bs";
import { addCommaToNumber } from "../util/addCommaToNumber";
import ErrorMessage from "../components/ErrorMessage";

const SearchTemplate = () => {
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState<string>("");
  const { scholars } = useScholars();

  const searchTextChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchText(e.target.value);
  };

  const ids = scholars?.map((i) => i.ronin.replace("ronin:", "0x"));

  const scholarsQuery = useQuery<Scholars, any>(
    "Scholars",
    () => fetchAllScholars(ids),
    {
      enabled: ids.length > 0,
      keepPreviousData: true,
      staleTime: 60000,
    }
  );

  if (scholarsQuery.data)
    return (
      <Container colors={colors}>
        <input
          type="text"
          placeholder="Search for scholars..."
          onChange={searchTextChangeHandler}
        />
        <div className="scholars">
          {scholars.map((i, idx) => {
            if (
              i.nickname.toLowerCase().includes(searchText.toLowerCase()) &&
              idx < 5
            )
              return (
                <Link key={idx} to={`/scholar/${i.ronin}`}>
                  <div className="scholars__list">
                    <div>{i.nickname}</div>

                    <div>
                      <img src="/slp.png" alt="" width={25} />{" "}
                      {addCommaToNumber(
                        scholarsQuery.data?.list[i.ronin].total
                      )}
                    </div>
                    <div>
                      <BsArrowUpRight size={25} />
                    </div>
                  </div>
                </Link>
              );
            return null;
          })}
        </div>
      </Container>
    );

  return (
    <ErrorMessage
      title="Something went wrong."
      message="Either you have not yet added any scholars or you cannot connect tp the internet."
    />
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    input {
      background-color: ${colors.textIntense + "05"};
      border: 1px solid ${colors.textIntense + 10};
      color: ${colors.textNotSoIntense};

      position: absolute;
      top: 40px;
      right: 10px;
      z-index: 100;

      width: calc(100% - 62px);
      height: 35px;
      border-radius: 5px;
      padding: 5px 10px;
      margin-left: 10px;
      outline: none;

      &::placeholder {
        color: ${colors.textNotSoIntense + 99};
      }
    }

    .scholars {
      display: flex;
      flex-direction: column;
      padding: 10px;
      background-color: ${colors.BGLight};
      height: calc(100vh - 88px);
      overflow-x: auto;

      a {
        color: ${colors.textNotSoIntense};
      }
      &__list {
        display: flex;
        margin-bottom: 20px;
        display: grid;
        grid-template-columns: 1fr 110px 30px;

        div {
          display: flex;
          align-items: center;
        }
      }
    }
  `}
`;

export default SearchTemplate;

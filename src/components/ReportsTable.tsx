import React from "react";
import styled, { css } from "styled-components";
import { IReportsTable } from "../interfaces/scholar-page/IReportsTable";
import moment from "moment";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { addCommaToNumber } from "../util/addCommaToNumber";

const ReportsTable: React.FC<IReportsTable> = ({
  reports,
  totalSLP,
  totalToday,
  dailyAverage,
  mmr,
  rank,
}) => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      <div className="main-stats">
        <div className="main-stats__container">
          <div className="main-stats__container__label">Total SLP</div>
          <div className="main-stats__container__value">
            <img src="/slp.png" alt="slp" width={30} />
            {addCommaToNumber(totalSLP)}
          </div>
        </div>
        <div className="main-stats__container">
          <div className="main-stats__container__label">Total Today</div>
          <div className="main-stats__container__value">
            <img src="/slp.png" alt="slp" width={30} />
            {addCommaToNumber(totalToday)}
          </div>
        </div>
        <div className="main-stats__container">
          <div className="main-stats__container__label">Daily Average</div>
          <div className="main-stats__container__value">
            <img src="/slp.png" alt="slp" width={30} />
            {dailyAverage.slp}
          </div>
        </div>
        <div className="main-stats__container">
          <div className="main-stats__container__label">MMR</div>
          <div className="main-stats__container__value">
            {" "}
            <span style={{ fontSize: 23 }}> 🏆</span>
            {mmr}
          </div>
        </div>
        <div className="main-stats__container">
          <div className="main-stats__container__label">Rank</div>
          <div className="main-stats__container__value">#{rank}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Earned</th>
          </tr>
        </thead>
        <tbody>
          {reports?.map((i, idx) => {
            return (
              <tr key={idx}>
                <td>
                  {reports[idx - 1]
                    ? moment
                        .unix(reports[idx - 1]?.date)
                        // .subtract(1, "days")
                        .format("MMM D, YYYY hh:mma")
                    : moment
                        .unix(reports[idx]?.date)
                        .subtract(1, "days")
                        .format("MMM D, YYYY hh:mma")}
                </td>
                <td>
                  {moment
                    .unix(reports[idx]?.date)
                    .format("MMM D, YYYY hh:mm a")}
                </td>
                <td>
                  <div className="center">
                    <img src="/slp.png" width={20} alt="slp" /> {i.earned}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    overflow-x: auto;
    white-space: nowrap;
    display: block;
    border: 1px solid ${colors.textIntense + 20};
    border-radius: 5px;

    .main-stats {
      display: flex;
      justify-content: space-between;
      padding: 20px 70px;
      background-color: ${colors.BGLight};
      border-bottom: 1px solid ${colors.textIntense + 30};

      &__container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        &__label {
          color: ${colors.textNotSoIntense};
        }
        &__value {
          color: ${colors.textNotSoIntense};
          font-size: 30px;
          font-weight: 600;
          display: flex;
          align-items: center;
        }
      }
    }

    table {
      color: ${colors.textNotSoIntense};
      border-collapse: collapse;
      overflow: hidden;

      width: 100%;

      .center {
        display: flex;
        align-items: center;

        img {
          margin-right: 5px;
        }
      }

      td,
      th {
        text-align: left;
        padding: 7px 20px;

        font-size: 17px;
      }
      thead {
        tr {
          background-color: ${colors.BGLighter + 90};
        }
      }
      tbody {
        tr:nth-child(odd) {
          background-color: ${colors.BGLighter + 59};
        }
        tr:nth-child(even) {
          background-color: ${colors.BGLighter + 99};
        }
        tr {
          td:nth-child(1) {
            width: 250px;
          }

          &:hover {
            background-color: ${colors.BGLighter};
            color: ${colors.textIntense};
          }
        }
      }
    }
  `}
`;

export default ReportsTable;

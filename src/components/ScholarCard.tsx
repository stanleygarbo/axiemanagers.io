import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { IScholarCard } from "../interfaces/IScholarCard";
import { addCommaToNumber } from "../util/addCommaToNumber";
import { LineChart } from "./LineChart";
import Progress from "./Progress";

const dummyData = [
  "150",
  "154",
  "157",
  "152",
  "187",
  "160",
  "177",
  "155",
  "157",
];

const ScholarCard: React.FC<IScholarCard> = ({
  name,
  earned,
  badge,
  color,
  lastClaim,
  nextClaim,
  lastUpdated,
  progress,
  chartData,
  chartLabels,
  today,
  error,
}) => {
  const { colors } = useTheme();

  return (
    <Container
      colors={colors}
      style={{ border: error ? `1px solid ${colors.danger}` : "" }}
    >
      <div className="name">{name}</div>
      {badge?.id && <div className="badge">{badge.name}</div>}
      <div className="batch">Updated {lastUpdated}</div>
      <div className="earned">
        <section className="row">
          <div className="earned__slp"></div>
          {addCommaToNumber(earned)}
        </section>
        <section className="column">
          <time>Last Claim: {lastClaim}</time>
          <time>Next Claim: {nextClaim}</time>
        </section>
      </div>
      <div className="today">
        Today: <img src="/slp.png" alt="" width={20} />
        {today}
      </div>
      <div className="row-split">
        <section>
          {console.log(chartData && chartData.length > 2)}
          <LineChart
            data={chartData && chartData?.length > 2 ? chartData : dummyData}
            title="Stats"
            labels={
              chartLabels && chartLabels?.length > 2 ? chartLabels : dummyData
            }
            isMiniature
            color={color}
            showLabels={false}
          />
          {(chartLabels && chartLabels.length < 2) ||
          chartLabels === undefined ||
          (chartData && chartData?.length < 2) ? (
            <div style={{ background: color }}></div>
          ) : null}
        </section>
        {progress !== null ? (
          <Progress earned={Math.round(progress)} />
        ) : (
          <div className="row-split__na">
            Progress
            <br />
            <span>N/A</span>
          </div>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    width: 100%;
    padding: 20px;
    border-radius: 5px;
    border: 1px solid ${colors.textIntense + 20};

    position: relative;
    cursor: pointer;
    user-select: none;

    background-color: ${colors.BGLight};

    transition: 0.15s;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;

    &:active {
      transform: scale(0.99);
    }

    .today {
      color: ${colors.textNotSoIntense};
      display: flex;
      align-items: center;
      margin: 15px 0;
    }

    .badge {
      position: absolute;
      right: 0px;
      top: 0px;
      padding: 2px 15px;
      border-radius: 0px 5px 0px 5px;
      background-color: ${colors.danger};
      font-size: 12px;
      color: ${"#FFFFFF"};
    }
    .name {
      font-size: 20px;
      color: ${colors.textIntense};
    }
    .batch {
      font-size: 12px;
      color: ${colors.textNotSoIntense};
    }
    .earned {
      margin-top: 15px;
      color: ${colors.textIntense};
      display: flex;
      font-size: 1.8rem;
      font-weight: 700;
      .row {
        display: flex;
        align-items: center;
      }
      .column {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 10px 0px;
        margin-left: 10px;
      }
      time {
        font-size: 12px;
        font-weight: 400;
      }
      &__slp {
        width: 30px;
        height: 30px;
        background-image: url("/slp.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
    .row-split {
      margin-top: 15px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      section {
        width: 140px;
        height: 30px;
        div {
          width: 100%;
          height: 1px;
          margin-top: -20px;
          position: relative;
          &::before {
            position: absolute;
            content: "";
            top: -7px;
            width: 100%;
            height: 100%;
            background-color: inherit;
          }
          &::after {
            position: absolute;
            content: "";
            top: 7px;
            width: 100%;
            height: 100%;
            background-color: inherit;
          }
        }
      }
      &__na {
        text-align: center;
        color: ${colors.textNotSoIntense};
        font-size: 16px;
        line-height: 23px;
        height: 35px;

        span {
          font-size: 14px;
        }
      }
    }

    @media (max-width: 493px) {
      padding: 10px;
    }
  `}
`;

export default ScholarCard;

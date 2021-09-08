import React from "react";
import { TiArrowSync } from "react-icons/ti";
import { useHistory } from "react-router-dom";
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
  // today,
  error,
  mmr,
  rank,
  refetchScholarMutation,
  ronin,
  showRetry,
}) => {
  const { colors } = useTheme();

  const history = useHistory();

  return (
    <Container
      colors={colors}
      style={{ border: error ? `1px solid ${colors.danger}` : "" }}
    >
      {showRetry && (
        <div
          className="retry"
          onClick={() =>
            refetchScholarMutation.mutate(ronin.replace("ronin:", "0x"))
          }
        >
          <TiArrowSync size={25} />
        </div>
      )}
      <div
        className="card__wrapper"
        onClick={() => history.push(`/scholar/${ronin}`)}
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
        <div className="stats-row">
          {/* <div className="stats-row__today">
            <div className="stats-row__today__value">
              <img src="/slp.png" alt="" width={20} />
              {today}
            </div>
            <div className="stats-row__today__label">Today</div>
          </div> */}
          <div className="stats-row__today" style={{ marginRight: 20 }}>
            <div className="stats-row__today__value">{mmr}</div>
            <div className="stats-row__today__label">MMR</div>
          </div>
          <div className="stats-row__today">
            <div className="stats-row__today__value">#{rank}</div>
            <div className="stats-row__today__label">Rank</div>
          </div>
        </div>
        <div className="row-split">
          <section>
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
      </div>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    position: relative;
    width: 100%;

    .retry {
      color: ${colors.textNotSoIntense};

      position: absolute;
      top: 40px;
      right: 20px;

      border-radius: 100px;
      border-left: 2px solid ${colors.textIntense + 40};
      border-right: 2px solid ${colors.textIntense + 40};
      width: 40px;
      height: 40px;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .card__wrapper {
      padding: 20px;
      border-radius: 5px;
      border: 1px solid ${colors.textIntense + 20};

      cursor: pointer;
      user-select: none;

      background-color: ${colors.BGLight};

      transition: 0.15s;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-tap-highlight-color: transparent;

      .stats-row {
        display: flex;
        justify-content: center;

        &__today {
          color: ${colors.textNotSoIntense};
          margin: 15px 0;
          display: flex;
          flex-direction: column;
          align-items: center;

          &__value {
            display: flex;
            align-items: center;
          }

          &__label {
            margin-top: 5px;
            font-size: 11px;
            color: ${colors.textIntense + 75};
          }
        }
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
    }

    @media (max-width: 493px) {
      .card__wrapper {
        padding: 10px;
      }
    }
  `}
`;

export default ScholarCard;

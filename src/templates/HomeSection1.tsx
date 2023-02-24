import React from "react";
import { LineChart } from "../components/LineChart";
import { useTheme } from "../contexts/themeContext";
import moment from "moment";
import { UseQueryResult } from "react-query";
import styled, { css } from "styled-components";
import { useState } from "react";
import { IColors } from "../interfaces/IColors";
import {
  Scholars,
  SLPPrice,
  SLPPriceChart,
} from "../interfaces/IResponseTypes";
import { useScholars } from "../contexts/scholarsContext";
import { addCommaToNumber } from "../util/addCommaToNumber";
import { TiArrowSync } from "react-icons/ti";
import { getCurrencySign } from "../util/getCurrencySign";
import { useUserPreferences } from "../contexts/userPreferences";
// import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";

const HomeSection1: React.FC<{
  SLPPriceQuery: UseQueryResult<SLPPrice, unknown>;
  SLPPriceChartQuery: UseQueryResult<SLPPriceChart, unknown>;
  scholarsQuery: UseQueryResult<Scholars, unknown>;
}> = ({ SLPPriceQuery, scholarsQuery, SLPPriceChartQuery }) => {
  const { colors } = useTheme();
  const { scholars } = useScholars();
  const { currency } = useUserPreferences();

  const [hoveredElement, setHoveredElement] = useState<{
    x: string;
    y: string;
  } | null>(null);

  let SLPPriceDate = SLPPriceChartQuery.data?.prices?.map((i) => {
    return moment.unix(i[0] / 1000).format("MMMM D, YYYY hh:mm A");
  });
  let SLPPriceValue = SLPPriceChartQuery.data?.prices?.map((i) => {
    return i[1] !== 0 ? i[1].toString() : "empty";
  });

  let totalFarmed = 0;
  if (scholarsQuery.data) {
    // totalFarmed = scholarsQuery.data.earnings.total;
  }

  let totalManager = 0;
  let totalScholars = 0;
  let totalAverage = 0;
  let totalToday = 0;
  let totalTodayManager = 0;
  let totalClaimed = 0;

  if (scholarsQuery.data && scholars) {
    for (const i of scholars) {
      let scholarStat = scholarsQuery.data.list[i.ronin];
      if (scholarStat) {
        totalManager +=
          (scholarStat.total - scholarStat.totalClaimable) *
          (i.managerShare / 100);
        totalTodayManager += scholarStat.today * (i.managerShare / 100);

        totalScholars +=
          (scholarStat.total - scholarStat.totalClaimable) *
          ((100 - i.managerShare) / 100);

        const daysAgoSinceClaimed = Number(
          moment
            .duration(
              moment(new Date()).diff(moment.unix(scholarStat.lastClaimed))
            )
            .asDays()
            .toFixed(0)
        );

        if (daysAgoSinceClaimed) {
          totalAverage +=
            (scholarStat.total - scholarStat.totalClaimable) /
            daysAgoSinceClaimed;
        }

        totalToday += scholarStat.today;
        totalFarmed += scholarStat.total - scholarStat.totalClaimable;

        totalClaimed += scholarStat.totalClaimable;
      }
    }
  }

  return (
    <Container colors={colors}>
      <p>
        <span>Update</span> This build is for demo purposes only. Most of the
        datasource is from a node.js API I set up to generate fake data.
      </p>
      <div className="home-section1-wrapper">
        <div className="home-section1-wrapper__grid">
          <div className="home-section1-wrapper__grid__total-farmed box home-section1-wrapper__grid__item">
            <div className="home-section1-wrapper__grid__item__title">
              Total Farmed
            </div>
            <div className="home-section1-wrapper__grid__item__value">
              <div className="home-section1-wrapper__grid__item__value__slp">
                <img src="/slp.png" alt="slp" width={35} />
                {addCommaToNumber(totalFarmed)}
              </div>
              <div className="home-section1-wrapper__grid__item__value__currency">
                &#8776; {getCurrencySign(currency)}
                {SLPPriceQuery.data &&
                  addCommaToNumber(
                    Math.floor(
                      totalFarmed *
                        SLPPriceQuery.data["smooth-love-potion"][
                          currency ? currency : "php"
                        ]
                    )
                  )}
              </div>
            </div>
          </div>
          <div className="home-section1-wrapper__grid__total-manager box home-section1-wrapper__grid__item">
            <div className="home-section1-wrapper__grid__item__title">
              Manager's Total
            </div>
            <div className="home-section1-wrapper__grid__item__value">
              <div className="home-section1-wrapper__grid__item__value__slp">
                <img src="/slp.png" alt="slp" width={35} />
                {addCommaToNumber(Math.floor(totalManager))}
              </div>
              <div className="home-section1-wrapper__grid__item__value__currency">
                &#8776; {getCurrencySign(currency)}
                {SLPPriceQuery.data &&
                  addCommaToNumber(
                    Math.floor(
                      totalManager *
                        SLPPriceQuery.data["smooth-love-potion"][
                          currency ? currency : "php"
                        ]
                    )
                  )}
              </div>
            </div>
          </div>
          <div className="home-section1-wrapper__grid__total-scholar box home-section1-wrapper__grid__item">
            <div className="home-section1-wrapper__grid__item__title">
              Scholars' Total
            </div>
            <div className="home-section1-wrapper__grid__item__value">
              <div className="home-section1-wrapper__grid__item__value__slp">
                <img src="/slp.png" alt="slp" width={35} />
                {addCommaToNumber(Math.floor(totalScholars))}
              </div>
              <div className="home-section1-wrapper__grid__item__value__currency">
                &#8776; {getCurrencySign(currency)}
                {SLPPriceQuery.data &&
                  addCommaToNumber(
                    Math.floor(
                      totalScholars *
                        SLPPriceQuery.data["smooth-love-potion"][
                          currency ? currency : "php"
                        ]
                    )
                  )}
              </div>
            </div>
          </div>

          <div className="home-section1-wrapper__grid__total-average box home-section1-wrapper__grid__item">
            <div className="home-section1-wrapper__grid__item__title">
              Total Average
            </div>
            <div className="home-section1-wrapper__grid__item__value">
              <div className="home-section1-wrapper__grid__item__value__slp">
                <img src="/slp.png" alt="slp" width={35} />
                {addCommaToNumber(Math.floor(totalAverage))}
              </div>
              <div className="home-section1-wrapper__grid__item__value__currency">
                &#8776; {getCurrencySign(currency)}
                {SLPPriceQuery.data &&
                  addCommaToNumber(
                    Math.floor(
                      totalAverage *
                        SLPPriceQuery.data["smooth-love-potion"][
                          currency ? currency : "php"
                        ]
                    )
                  )}
              </div>
            </div>
          </div>
          <div className="home-section1-wrapper__grid__total-unclaimed box home-section1-wrapper__grid__item">
            <div className="home-section1-wrapper__grid__item__title">
              Total Today
            </div>
            <div className="home-section1-wrapper__grid__item__value">
              <div className="home-section1-wrapper__grid__item__value__slp">
                <img src="/slp.png" alt="slp" width={35} />
                {addCommaToNumber(totalToday)}{" "}
                {SLPPriceQuery.data && (
                  <span>
                    M: {Math.floor(totalTodayManager)} <br />~
                    {getCurrencySign(currency)}
                    {addCommaToNumber(
                      Math.floor(
                        totalTodayManager *
                          SLPPriceQuery.data["smooth-love-potion"][
                            currency ? currency : "php"
                          ]
                      )
                    )}
                  </span>
                )}
              </div>

              <div className="home-section1-wrapper__grid__item__value__currency">
                &#8776; {getCurrencySign(currency)}
                {SLPPriceQuery.data &&
                  addCommaToNumber(
                    Math.floor(
                      totalToday *
                        SLPPriceQuery.data["smooth-love-potion"][
                          currency ? currency : "php"
                        ]
                    )
                  )}
              </div>
            </div>
          </div>
          <div className="home-section1-wrapper__grid__total-claimed box home-section1-wrapper__grid__item">
            <div className="home-section1-wrapper__grid__item__title">
              Total Claimed
            </div>
            <div className="home-section1-wrapper__grid__item__value">
              <div className="home-section1-wrapper__grid__item__value__slp">
                <img src="/slp.png" alt="slp" width={35} />
                {addCommaToNumber(totalClaimed)}
              </div>
              {/* <div className="home-section1-wrapper__grid__item__value__currency">
                &#8776; &#8369;
                {SLPPriceQuery.data &&
                  addCommaToNumber(
                    Math.floor(totalClaimed * SLPPriceQuery.data?.current)
                  )}
              </div> */}
            </div>
          </div>
        </div>
        <div
          className="home-section1-wrapper__line-chart box"
          onMouseLeave={() => setHoveredElement(null)}
        >
          <div className="home-section1-wrapper__line-chart__price">
            {!hoveredElement ? getCurrencySign(currency) : "₱"}
            {hoveredElement
              ? hoveredElement.y
              : SLPPriceQuery.data &&
                SLPPriceQuery.data["smooth-love-potion"][
                  currency ? currency : "php"
                ]}
            {SLPPriceQuery.isLoading && "---"}
          </div>
          <div className="home-section1-wrapper__line-chart__date">
            {hoveredElement ? hoveredElement.x : "CoinGecko"}
          </div>
          <div className="home-section1-wrapper__line-chart__label">
            SLP Price
          </div>
          <button
            onClick={() => SLPPriceQuery.refetch()}
            className={`home-section1-wrapper__line-chart__btn ${
              SLPPriceQuery.isFetching ? `rotating` : ""
            }`}
          >
            <TiArrowSync size={25} />
          </button>

          {SLPPriceQuery.isLoading || SLPPriceChartQuery.isLoading ? null : (
            <LineChart
              data={SLPPriceValue}
              labels={SLPPriceDate}
              title=""
              color={colors.textIntense}
              setHoveredElements={setHoveredElement}
            />
          )}
        </div>
      </div>
      {console.log(hoveredElement)}
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    margin-top: 20px;
    p {
      color: ${colors.textNotSoIntense};
      max-width: 1200px;
      margin: 0 auto;
      padding: 0px 20px 20px 20px;
      font-size: 13px;

      span {
        border: 1px solid ${colors.success};
        background-color: ${colors.success + 90};
        color: #fff;
        padding: 1px 7px;
        border-radius: 5px;
        font-size: 12px;
      }

      a {
        color: ${colors.textNotSoIntense};
        text-decoration: underline;
      }
    }
    .home-section1-wrapper {
      max-width: 1200px;
      padding: 0 20px;
      margin: 0 auto;
      display: flex;

      &__grid {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 20px;
        margin-right: 20px;

        &__item {
          display: flex;
          flex-direction: column;

          &__title {
            font-size: 17px;
            color: ${colors.textIntense};
          }

          &__value {
            color: ${colors.textIntense};
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-top: 5px;

            &__slp {
              font-size: 25px;
              font-weight: 700;
              display: flex;
              align-items: center;
              img {
                margin-right: 5px;
              }

              span {
                font-size: 11px;
                line-height: 13px;
                margin-left: 10px;
                font-weight: 300;
              }
            }
            &__currency {
              margin-left: 40px;
            }
          }
        }
      }

      .box {
        background-color: ${colors.BGLight};
        border: 1px solid ${colors.textIntense + 20};
        border-radius: 5px;
        padding: 5px 10px;
      }

      &__line-chart {
        min-width: 350px;
        position: relative;
        min-height: 237px;

        &__price {
          font-size: 25px;
          font-weight: 700;
          color: ${colors.textIntense};
        }

        &__date {
          color: ${colors.textNotSoIntense};
        }

        &__label {
          border-radius: 0px 5px 0px 5px;
          padding: 2px 10px;

          position: absolute;
          top: 0;
          right: 0;

          background-color: ${colors.textIntense};
          color: ${colors.BGLight};
          font-size: 12px;
          font-weight: 600;
        }

        &__btn {
          background-color: transparent;
          color: ${colors.textIntense};

          border: none;
          border-radius: 100px;
          width: 40px;
          height: 40px;

          display: flex;
          justify-content: center;
          align-items: center;

          cursor: pointer;

          position: absolute;
          top: 30px;
          right: 15px;

          &:hover {
            background-color: ${colors.textIntense + 20};
          }
        }
      }
    }

    .rotating {
      animation: rotate 2s linear;
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 961px) {
      .home-section1-wrapper {
        flex-direction: column-reverse;

        &__line-chart {
          min-width: 290px;
          min-height: 232px;
        }

        &__grid {
          margin-top: 20px;
        }
      }
    }

    @media (max-width: 621px) {
      .home-section1-wrapper {
        flex-direction: column-reverse;

        &__grid {
          margin-top: 20px;

          &__item {
            &__title {
              font-size: 14px;
            }
          }
        }
      }
    }

    @media (max-width: 591px) {
      .home-section1-wrapper {
        &__grid {
          &__item {
            &__value {
              &__slp {
                span{
                  font-size: 9px;
                }
              }
            }
          }
        }
      }
    }
    }

    @media (max-width: 553px) {
      margin-top: 10px;

      p {
        padding: 0px 10px 10px 10px;

        button {
          margin-top: 7px;
        }
      }

      .home-section1-wrapper {
        padding: 0 10px;

        &__grid {
          margin-top: 10px;
          grid-template-columns: 1fr 1fr;

          gap: 7px;

          &__item {
            &__value {
              margin-top: 5px;
              &__slp {
                img {
                  width: 25px;
                }
              }
              &__currency {
                margin-left: 32px;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  `}
`;

export default HomeSection1;

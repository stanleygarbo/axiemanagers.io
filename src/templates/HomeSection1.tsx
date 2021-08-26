import React from "react";
import { LineChart } from "../components/LineChart";
import { useTheme } from "../contexts/themeContext";
import moment from "moment";
import { UseQueryResult } from "react-query";
import styled, { css } from "styled-components";
import { useState } from "react";
import { IColors } from "../interfaces/IColors";
import { Scholars, SLPPrice } from "../interfaces/IResponseTypes";
import { useScholars } from "../contexts/scholarsContext";
import { addCommaToNumber } from "../util/addCommaToNumber";

const HomeSection1: React.FC<{
  SLPPriceQuery: UseQueryResult<SLPPrice, unknown>;
  scholarsQuery: UseQueryResult<Scholars, unknown>;
}> = ({ SLPPriceQuery, scholarsQuery }) => {
  const { colors } = useTheme();
  const { scholars } = useScholars();

  const [hoveredElement, setHoveredElement] = useState<{
    x: string;
    y: string;
  } | null>(null);

  let SLPPriceDate = SLPPriceQuery.data?.chart?.map((i) => {
    return i.price !== 0
      ? moment.unix(i.date).format("MMMM D, YYYY hh:mm A")
      : "empty";
  });
  let SLPPriceValue = SLPPriceQuery.data?.chart?.map((i) =>
    i.price !== 0 ? i.price.toString() : "empty"
  );

  SLPPriceDate = SLPPriceDate?.filter((obj) => obj !== "empty");
  SLPPriceValue = SLPPriceValue?.filter((obj) => obj !== "empty");

  let totalFarmed = 0;
  if (scholarsQuery.data) {
    totalFarmed = scholarsQuery.data.earnings.total;
  }

  let totalManager = 0;
  let totalScholars = 0;
  let totalAverage = 0;
  let totalUnclaimed = 0;
  let totalClaimed = 0;

  if (scholarsQuery.data && scholars) {
    for (const i of scholars) {
      let scholarStat = scholarsQuery.data.list[i.ronin];
      if (scholarStat) {
        totalManager += scholarStat.total * (i.managerShare / 100);

        totalScholars += scholarStat.total * ((100 - i.managerShare) / 100);

        const daysAgoSinceClaimed = Number(
          moment
            .duration(
              moment(new Date()).diff(moment.unix(scholarStat.lastClaimed))
            )
            .asDays()
            .toFixed(0)
        );

        if (daysAgoSinceClaimed) {
          totalAverage += scholarStat.total / daysAgoSinceClaimed;
        }

        totalUnclaimed += scholarStat.total;

        totalClaimed += scholarStat.lastClaimAmount;
      }
    }
  }

  // scholarsQuery.data?.list.map((i) => (totalUnclaimed += i.total));

  // scholarsQuery.data?.list.map((i) => (totalClaimed += i.lastClaimAmount));

  return (
    <Container colors={colors}>
      <p>
        Please beware that the site has been getting a lot of unexpected
        traffic, be cautious of the SLP price as we might hit coingecko's rate
        limit which results into inaccurate data. I will be coming up with
        another solution pretty soon. Thank you for all of your donations :)
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
                &#8776; &#8369;
                {SLPPriceQuery.data &&
                  addCommaToNumber(
                    Math.floor(totalFarmed * SLPPriceQuery.data?.current)
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
                &#8776; &#8369;
                {SLPPriceQuery.data &&
                  addCommaToNumber(
                    Math.floor(totalManager * SLPPriceQuery.data?.current)
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
                &#8776; &#8369;
                {SLPPriceQuery.data &&
                  addCommaToNumber(
                    Math.floor(totalScholars * SLPPriceQuery.data?.current)
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
                &#8776; &#8369;
                {SLPPriceQuery.data &&
                  addCommaToNumber(
                    Math.floor(totalAverage * SLPPriceQuery.data?.current)
                  )}
              </div>
            </div>
          </div>
          <div className="home-section1-wrapper__grid__total-unclaimed box home-section1-wrapper__grid__item">
            <div className="home-section1-wrapper__grid__item__title">
              Total Unclaimed
            </div>
            <div className="home-section1-wrapper__grid__item__value">
              <div className="home-section1-wrapper__grid__item__value__slp">
                <img src="/slp.png" alt="slp" width={35} />
                {addCommaToNumber(totalUnclaimed)}
              </div>

              <div className="home-section1-wrapper__grid__item__value__currency">
                &#8776; &#8369;
                {SLPPriceQuery.data &&
                  addCommaToNumber(
                    Math.floor(totalUnclaimed * SLPPriceQuery.data?.current)
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
              <div className="home-section1-wrapper__grid__item__value__currency">
                &#8776; &#8369;
                {SLPPriceQuery.data &&
                  addCommaToNumber(
                    Math.floor(totalClaimed * SLPPriceQuery.data?.current)
                  )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="home-section1-wrapper__line-chart box"
          onMouseLeave={() => setHoveredElement(null)}
        >
          <div className="home-section1-wrapper__line-chart__price">
            &#8369;
            {hoveredElement ? hoveredElement.y : SLPPriceQuery.data?.current}
            {SLPPriceQuery.isLoading && "---"}
          </div>
          <div className="home-section1-wrapper__line-chart__date">
            {hoveredElement ? hoveredElement.x : "CoinGecko"}
          </div>
          <div className="home-section1-wrapper__line-chart__label">
            SLP Price
          </div>

          {SLPPriceQuery.isLoading ? null : (
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
      font-size: 12px;
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

    @media (max-width: 493px) {
      margin-top: 10px;

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

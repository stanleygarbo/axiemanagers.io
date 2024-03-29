import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import ColorPicker from "../ColorPicker";
import { IScholarsTable } from "../../interfaces/home/IScholarsTable";
import { useScholars } from "../../contexts/scholarsContext";
import moment from "moment";
import { useQueryClient } from "react-query";
import { SLPPrice } from "../../interfaces/IResponseTypes";
import { addCommaToNumber } from "../../util/addCommaToNumber";
import { Link, useHistory } from "react-router-dom";
import { getAverageSLP } from "../../util/getAverageSLP";
import { getManagerShare, getScholarShare } from "../../util/getShare";
import { getCurrencySign } from "../../util/getCurrencySign";
import { getNextClaim, getLastClaimed } from "../../util/getClaimDates";
import { LineChart } from "../LineChart";
import { TiArrowSync } from "react-icons/ti";
import { useUserPreferences } from "../../contexts/userPreferences";
import CircularLoader from "../CircularLoader";
import SelectCategory from "../modal/SelectCategory";
import OrderIndicator from "./OrderIndicator";

const ScholarsTable: React.FC<IScholarsTable> = ({
  data,
  sortedScholars,
  refetchScholarMutation,
  setOrder,
  order,
  setOrderBy,
  orderBy,
}) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const history = useHistory();
  const { currency } = useUserPreferences();
  const SLPPrice = queryClient.getQueryState<SLPPrice>(["SLPPrice", currency]);

  const { scholarsTable } = useUserPreferences();

  const { categories, updateScholar } = useScholars();

  const setOrientation = (column: string) => {
    if (orderBy === column) {
      if (order === "desc") {
        setOrder("asc");
      } else {
        setOrder("desc");
      }
    } else {
      setOrderBy(column);
      setOrder("asc");
    }
  };

  const getOrderOf = (column: string) => {
    return order === "desc" && column === orderBy
      ? "desc"
      : order === "asc" && column === orderBy
      ? "asc"
      : "none";
  };

  return (
    <Container colors={colors} isScrollingDown={false}>
      <p>
        <span>Tip:</span> {"To hide/show columns check "}
        <Link to="/settings/interface">{"settings > preferences"}</Link>.
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            {scholarsTable?.name && (
              <th className="th" onClick={() => setOrientation("nickname")}>
                Name
                <OrderIndicator order={getOrderOf("nickname")} />
              </th>
            )}
            {scholarsTable?.total && (
              <th onClick={() => setOrientation("total")}>
                Ingame SLP
                <OrderIndicator order={getOrderOf("total")} />
              </th>
            )}
            {scholarsTable?.average && <th>Average</th>}
            {scholarsTable?.manager && <th>Manager</th>}
            {scholarsTable?.scholar && <th>Scholar</th>}
            {scholarsTable?.today && (
              <th onClick={() => setOrientation("today")}>
                Today <OrderIndicator order={getOrderOf("today")} />
              </th>
            )}
            {scholarsTable?.yesterday && <th>Yesterday</th>}
            {scholarsTable?.lastUpdated && <th>Last Updated</th>}
            {scholarsTable?.lastClaimed && (
              <th onClick={() => setOrientation("lastClaimed")}>
                Last Claimed{" "}
                <OrderIndicator order={getOrderOf("lastClaimed")} />
              </th>
            )}
            {scholarsTable?.nextClaim && (
              <th onClick={() => setOrientation("lastClaimed")}>
                Claimable <OrderIndicator order={getOrderOf("lastClaimed")} />
              </th>
            )}
            {/* <td>Progress</td> */}
            {scholarsTable?.mmr && (
              <th onClick={() => setOrientation("mmr")}>
                MMR <OrderIndicator order={getOrderOf("mmr")} />
              </th>
            )}
            {scholarsTable?.rank && (
              <th onClick={() => setOrientation("rank")}>
                Rank <OrderIndicator order={getOrderOf("rank")} />
              </th>
            )}
            {scholarsTable?.team && (
              <th onClick={() => setOrientation("category")}>
                Team <OrderIndicator order={getOrderOf("category")} />
              </th>
            )}
            {scholarsTable?.chart && <th>Chart</th>}
            <th style={{ padding: 0 }}></th>
          </tr>
        </thead>
        <tbody>
          {sortedScholars &&
            data &&
            sortedScholars.map((i, idx) => {
              const managerShare = getManagerShare(
                data[i.ronin]?.total - data[i.ronin]?.totalClaimable,
                i.managerShare,
                SLPPrice?.data &&
                  SLPPrice?.data["smooth-love-potion"][
                    currency ? currency : "php"
                  ]
              );

              const scholarShare = getScholarShare(
                data[i.ronin]?.total - data[i.ronin]?.totalClaimable,
                i.managerShare,
                SLPPrice?.data &&
                  SLPPrice?.data["smooth-love-potion"][
                    currency ? currency : "php"
                  ]
              );

              const yesterday = data[i.ronin]?.chart
                ? data[i.ronin]?.chart[data[i.ronin]?.chart?.length - 1]?.earned
                : 0;

              const categoryQuota = categories.find(
                (obj) => obj.name === i.category
              )?.quota;

              return (
                <tr key={idx}>
                  <td className="color-picker">
                    <ColorPicker
                      color={i.color}
                      setActiveColor={(selectedHex: string) => {
                        updateScholar({
                          ronin: i.ronin,
                          nickname: i.nickname,
                          managerShare: i.managerShare,
                          color: selectedHex,
                          category: i.category,
                        });
                      }}
                    />
                  </td>
                  {scholarsTable?.name && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      {i.nickname}
                    </td>
                  )}
                  {scholarsTable?.total && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      <div className="center-horizontal">
                        <img
                          src="/slp.png"
                          width={20}
                          alt="slp"
                          style={{ marginRight: 4 }}
                        />{" "}
                        {addCommaToNumber(
                          data[i.ronin]
                            ? data[i.ronin].total -
                                data[i.ronin]?.totalClaimable
                            : "---"
                        )}
                      </div>
                    </td>
                  )}
                  {scholarsTable?.average && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      {
                        getAverageSLP(
                          data[i.ronin]?.lastClaimed,
                          data[i.ronin]?.total - data[i.ronin]?.totalClaimable,
                          SLPPrice?.data &&
                            SLPPrice?.data["smooth-love-potion"][
                              currency ? currency : "php"
                            ]
                        ).slp
                      }
                      <br />
                      {
                        getAverageSLP(
                          data[i.ronin]?.lastClaimed,
                          data[i.ronin]?.total - data[i.ronin]?.totalClaimable,
                          SLPPrice?.data &&
                            SLPPrice?.data["smooth-love-potion"][
                              currency ? currency : "php"
                            ],
                          getCurrencySign(currency)
                        ).converted
                      }
                    </td>
                  )}
                  {scholarsTable?.manager && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      <div className="center-horizontal">
                        <img
                          src="/slp.png"
                          width={20}
                          alt="slp"
                          style={{ marginRight: 4 }}
                        />
                        {addCommaToNumber(managerShare.slp)}
                      </div>
                      &nbsp;&#8776; {getCurrencySign(currency)}
                      {addCommaToNumber(managerShare.converted)}
                    </td>
                  )}
                  {scholarsTable?.scholar && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      <div className="center-horizontal">
                        <img
                          src="/slp.png"
                          width={20}
                          alt="slp"
                          style={{ marginRight: 4 }}
                        />
                        {addCommaToNumber(scholarShare.slp)}
                      </div>
                      &nbsp;&#8776; {getCurrencySign(currency)}
                      {addCommaToNumber(scholarShare.converted)}
                    </td>
                  )}
                  {scholarsTable?.today && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      <div className="center-horizontal">
                        <img
                          src="/slp.png"
                          width={20}
                          alt="slp"
                          style={{ marginRight: 4 }}
                        />
                        {data[i.ronin]?.chart?.length > 0 ? (
                          <span
                            className="quota"
                            style={{
                              background: categoryQuota
                                ? data[i.ronin]?.today < categoryQuota
                                  ? colors.danger
                                  : colors.success
                                : data[i.ronin]?.today < 75
                                ? colors.danger
                                : colors.success,
                            }}
                          >
                            {addCommaToNumber(data[i.ronin]?.today)}
                          </span>
                        ) : (
                          "---"
                        )}
                      </div>
                      <div>
                        &nbsp;&#8776; {getCurrencySign(currency)}
                        {SLPPrice?.data && data[i.ronin]?.chart?.length > 0
                          ? addCommaToNumber(
                              Math.floor(
                                data[i.ronin]?.today *
                                  (SLPPrice?.data &&
                                    SLPPrice?.data["smooth-love-potion"][
                                      currency ? currency : "php"
                                    ])
                              )
                            )
                          : "---"}
                      </div>
                    </td>
                  )}
                  {scholarsTable?.yesterday && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      <div className="center-horizontal">
                        <img
                          src="/slp.png"
                          width={20}
                          alt="slp"
                          style={{ marginRight: 4 }}
                        />

                        {data[i.ronin]?.chart?.length > 0 ? (
                          <span
                            className="quota"
                            style={{
                              background: categoryQuota
                                ? yesterday < categoryQuota
                                  ? colors.danger
                                  : colors.success
                                : yesterday < 75
                                ? colors.danger
                                : colors.success,
                            }}
                          >
                            {i.category && categories[i.category]?.quota}
                            {addCommaToNumber(yesterday)}
                          </span>
                        ) : (
                          "---"
                        )}
                      </div>
                      &nbsp;&#8776; {getCurrencySign(currency)}
                      {SLPPrice?.data && data[i.ronin]?.chart?.length > 0
                        ? addCommaToNumber(
                            Math.floor(
                              yesterday *
                                (SLPPrice?.data &&
                                  SLPPrice?.data["smooth-love-potion"][
                                    currency ? currency : "php"
                                  ])
                            )
                          )
                        : "---"}
                    </td>
                  )}
                  {scholarsTable?.lastUpdated && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      {data[i.ronin]
                        ? moment.unix(data[i.ronin]?.lastUpdated).fromNow()
                        : "---"}
                    </td>
                  )}
                  {scholarsTable?.lastClaimed && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      {getLastClaimed(data[i.ronin]?.lastClaimed)}
                    </td>
                  )}
                  {scholarsTable?.nextClaim && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      {getNextClaim(data[i.ronin]?.lastClaimed)}
                    </td>
                  )}
                  {/* <td>Progress</td> */}
                  {scholarsTable?.mmr && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      {data[i.ronin]?.mmr !== 0 ? data[i.ronin]?.mmr : "---"}
                    </td>
                  )}
                  {scholarsTable?.rank && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      #{data[i.ronin]?.rank}
                    </td>
                  )}

                  {scholarsTable?.team && (
                    <td style={{ cursor: "default" }}>
                      <SelectCategory
                        currentCategory={i.category}
                        onSelect={(ctgry) => {
                          updateScholar({
                            ronin: i.ronin,
                            nickname: i.nickname,
                            managerShare: i.managerShare,
                            color: i.color,
                            category: ctgry,
                          });
                        }}
                        size="small"
                      />
                    </td>
                  )}

                  {scholarsTable?.chart && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      {data[i.ronin]?.chart?.length > 2 ? (
                        <div className="chart">
                          <LineChart
                            data={data[i.ronin]?.chart?.map((cd) =>
                              cd?.earned.toString()
                            )}
                            title="Stats"
                            labels={data[i.ronin]?.chart?.map((cd) =>
                              moment.unix(cd.date).format("DD")
                            )}
                            isMiniature
                            color={i.color}
                            showLabels={false}
                          />
                        </div>
                      ) : (
                        `Visible in ${3 - data[i.ronin]?.chart?.length} day${
                          3 - data[i.ronin]?.chart?.length > 1 ? "s" : ""
                        }`
                      )}
                    </td>
                  )}

                  {(data[i.ronin]?.today === 0 &&
                    data[i.ronin]?.total === 0 &&
                    data[i.ronin]?.lastClaimed === 0) ||
                  data[i.ronin]?.mmr === 0 ? (
                    <td
                      onClick={() =>
                        refetchScholarMutation.mutate(
                          i.ronin?.replace("ronin:", "0x")
                        )
                      }
                    >
                      {refetchScholarMutation.isLoading &&
                      refetchScholarMutation.variables ===
                        i.ronin?.replace("ronin:", "0x") ? (
                        <CircularLoader size="small" />
                      ) : (
                        <TiArrowSync size={25} />
                      )}
                    </td>
                  ) : (
                    <td style={{ padding: 0 }}></td>
                  )}
                </tr>
              );
            })}
        </tbody>
      </table>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors; isScrollingDown: boolean }>`
  ${({ colors }) => css`
    width: 100%;
    display: block;

    p {
      color: ${colors.textNotSoIntense};
      margin-top: 20px;
      font-size: 13px;
      span {
        color: ${colors.accent2};
      }
      a {
        color: ${colors.textNotSoIntense};
        text-decoration: underline;
      }
    }

    table {
      background-color: ${colors.BGLight};
      margin-top: 20px;
      border-radius: 5px;
      border: 1px solid ${colors.textIntense + 20};
      border-collapse: collapse;

      width: 100%;

      tr:nth-child(even) {
        background-color: ${colors.BGLighter + 80};
      }

      th {
        position: sticky;
        cursor: pointer;
        top: 86px;
        z-index: 2;
        background-color: ${colors.BGLight};

        user-select: none;
      }

      tbody {
        tr:hover {
          background-color: ${colors.accent + 20};
        }
      }

      td,
      th {
        text-align: left;
        padding: 8px;
        color: ${colors.textNotSoIntense};
        font-size: 14px;
      }
      td {
        border-top: 1px solid ${colors.textIntense + 20};
        & ~ td {
          cursor: pointer;
        }
        .center-horizontal {
          display: flex;
          align-items: center;
        }
        .chart {
          width: 100px;
        }
        .quota {
          color: #fff;
          border-radius: 5px;
          padding: 0.5px 5px;
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .color-picker {
        position: relative;
        padding: 8px 0 8px 8px;
      }
    }

    @media (max-width: 1133px) {
      overflow-y: auto;

      table {
        th {
          position: relative;
          top: 0;
        }
      }
    }
  `}
`;

export default ScholarsTable;

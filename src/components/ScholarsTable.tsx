import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import ColorPicker from "./ColorPicker";
import { IScholarsTable } from "../interfaces/IScholarsTable";
import { useScholars } from "../contexts/scholarsContext";
import moment from "moment";
import { useQueryClient } from "react-query";
import { SLPPrice } from "../interfaces/IResponseTypes";
import { addCommaToNumber } from "../util/addCommaToNumber";
import { Link, useHistory } from "react-router-dom";
import { getAverageSLP } from "../util/getAverageSLP";
import { getManagerShare, getScholarShare } from "../util/getShare";
import { getCurrencySign } from "../util/getCurrencySign";
import { getNextClaim, getLastClaimed } from "../util/getClaimDates";
import { LineChart } from "./LineChart";
import { TiArrowSync } from "react-icons/ti";
import { useUserPreferences } from "../contexts/userPreferences";

const ScholarsTable: React.FC<IScholarsTable> = ({
  data,
  sortedScholars,
  refetchScholarMutation,
}) => {
  const { colors } = useTheme();
  const { updateScholar } = useScholars();
  const queryClient = useQueryClient();
  const history = useHistory();
  const { currency } = useUserPreferences();
  const SLPPrice = queryClient.getQueryState<SLPPrice>(["SLPPrice", currency]);

  const { scholarsTable } = useUserPreferences();

  const { minQuota } = useScholars();

  return (
    <Container colors={colors}>
      <p>
        <span>Tip:</span> {"To hide/show columns check "}
        <Link to="/settings/interface">{"settings > preferences"}</Link>.
      </p>
      <table>
        <thead>
          <tr>
            <th></th>
            {scholarsTable?.name && <th>Name</th>}
            {scholarsTable?.total && <th>Total SLP</th>}
            {scholarsTable?.average && <th>Average</th>}
            {scholarsTable?.manager && <th>Manager</th>}
            {scholarsTable?.scholar && <th>Scholar</th>}
            {scholarsTable?.today && <th>Today</th>}
            {scholarsTable?.yesterday && <th>Yesterday</th>}
            {scholarsTable?.lastUpdated && <th>Last Updated</th>}
            {scholarsTable?.lastClaimed && <th>Last Claimed</th>}
            {scholarsTable?.nextClaim && <th>Claimable</th>}
            {/* <td>Progress</td> */}
            {scholarsTable?.chart && <th>Chart</th>}
            {scholarsTable?.mmr && <th>MMR</th>}
            {scholarsTable?.rank && <th>Rank</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedScholars &&
            data &&
            sortedScholars.map((i, idx) => {
              const managerShare = getManagerShare(
                data[i.ronin]?.total,
                i.managerShare,
                SLPPrice?.data?.current
              );

              const scholarShare = getScholarShare(
                data[i.ronin]?.total,
                i.managerShare,
                SLPPrice?.data?.current
              );

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
                          data[i.ronin] ? data[i.ronin].total : "---"
                        )}
                      </div>
                    </td>
                  )}
                  {scholarsTable?.average && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      {
                        getAverageSLP(
                          data[i.ronin]?.lastClaimed,
                          data[i.ronin]?.total,
                          SLPPrice?.data?.current
                        ).slp
                      }
                      <br />
                      {
                        getAverageSLP(
                          data[i.ronin]?.lastClaimed,
                          data[i.ronin]?.total,
                          SLPPrice?.data?.current,
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
                              background:
                                data[i.ronin]?.today < minQuota
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
                                data[i.ronin]?.today * SLPPrice.data?.current
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
                              background:
                                data[i.ronin]?.chart[
                                  data[i.ronin]?.chart?.length - 1
                                ].earned < minQuota
                                  ? colors.danger
                                  : colors.success,
                            }}
                          >
                            {addCommaToNumber(
                              data[i.ronin]?.chart[
                                data[i.ronin]?.chart?.length - 1
                              ].earned
                            )}
                          </span>
                        ) : (
                          "---"
                        )}
                      </div>
                      &nbsp;&#8776; {getCurrencySign(currency)}
                      {SLPPrice?.data && data[i.ronin]?.chart?.length > 0
                        ? addCommaToNumber(
                            Math.floor(
                              data[i.ronin]?.chart[
                                data[i.ronin]?.chart?.length - 1
                              ].earned * SLPPrice.data?.current
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
                  {scholarsTable?.mmr && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      {data[i.ronin]?.mmr}
                    </td>
                  )}
                  {scholarsTable?.rank && (
                    <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                      #{data[i.ronin]?.rank}
                    </td>
                  )}

                  {(data[i.ronin]?.today === 0 &&
                    data[i.ronin]?.total === 0 &&
                    data[i.ronin]?.lastClaimed === 0) ||
                  data[i.ronin]?.mmr === 0 ? (
                    <td
                      onClick={() =>
                        refetchScholarMutation.mutate(
                          i.ronin.replace("ronin:", "0x")
                        )
                      }
                    >
                      <TiArrowSync size={25} />
                    </td>
                  ) : (
                    <td></td>
                  )}
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
        top: 85px;
        z-index: 2;
        background-color: ${colors.BGLight};
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

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
import { useHistory } from "react-router-dom";
import { getAverageSLP } from "../util/getAverageSLP";
import { getManagerShare, getScholarShare } from "../util/getShare";
import { getNextClaim, getLastClaimed } from "../util/getClaimDates";
import { LineChart } from "./LineChart";
import { TiArrowSync } from "react-icons/ti";

const ScholarsTable: React.FC<IScholarsTable> = ({
  data,
  sortedScholars,
  refetchScholarMutation,
}) => {
  const { colors } = useTheme();
  const { updateScholar } = useScholars();
  const queryClient = useQueryClient();
  const SLPPrice = queryClient.getQueryState<SLPPrice>("SLPPrice");
  const history = useHistory();

  return (
    <Container colors={colors}>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Total SLP</th>
            <th>Average</th>
            <th>Manager</th>
            <th>Scholar</th>
            <th>Today</th>
            <th>Last Updated</th>
            <th>Last Claimed</th>
            <th>Claimable</th>
            {/* <td>Progress</td> */}
            <th>Chart</th>
            <th>MMR</th>
            {/* <th>Rank</th> */}
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
                <tr
                  key={idx}
                  style={{
                    border:
                      data[i.ronin]?.today === 0 &&
                      data[i.ronin]?.total === 0 &&
                      data[i.ronin]?.lastClaimed === 0
                        ? `1px solid ${colors.danger}`
                        : "",
                  }}
                >
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
                  <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                    {i.nickname}
                  </td>
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
                        SLPPrice?.data?.current
                      ).converted
                    }
                  </td>
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
                    &nbsp;&#8776; &#8369;
                    {addCommaToNumber(managerShare.converted)}
                  </td>
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
                    &nbsp;&#8776; &#8369;
                    {addCommaToNumber(scholarShare.converted)}
                  </td>
                  <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                    {data[i.ronin]?.chart?.length > 0 ? (
                      <div className="center-horizontal">
                        <img
                          src="/slp.png"
                          width={20}
                          alt="slp"
                          style={{ marginRight: 4 }}
                        />
                        {addCommaToNumber(data[i.ronin]?.today)}
                      </div>
                    ) : (
                      "---"
                    )}
                    &nbsp;&#8776; &#8369;
                    {SLPPrice?.data && data[i.ronin]?.chart?.length > 0
                      ? addCommaToNumber(
                          Math.floor(
                            data[i.ronin]?.today * SLPPrice.data?.current
                          )
                        )
                      : "---"}
                  </td>
                  <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                    {data[i.ronin]
                      ? moment.unix(data[i.ronin]?.lastUpdated).fromNow()
                      : "---"}
                  </td>
                  <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                    {getLastClaimed(data[i.ronin]?.lastClaimed)}
                  </td>
                  <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                    {getNextClaim(data[i.ronin]?.lastClaimed)}
                  </td>
                  {/* <td>Progress</td> */}
                  <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                    {data[i.ronin]?.chart.length > 2 ? (
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
                  <td>{data[i.ronin]?.mmr}</td>
                  {/* <td>#{data[i.ronin]?.rank}</td> */}

                  {data[i.ronin]?.today === 0 &&
                  data[i.ronin]?.total === 0 &&
                  data[i.ronin]?.lastClaimed === 0 ? (
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
    overflow-x: auto;
    white-space: nowrap;

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

      tr:hover {
        background-color: ${colors.accent + 20};
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
      }
      .color-picker {
        position: relative;
        padding: 8px 0 8px 8px;
      }
    }
  `}
`;

export default ScholarsTable;

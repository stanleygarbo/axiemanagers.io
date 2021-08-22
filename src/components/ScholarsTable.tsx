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

const ScholarsTable: React.FC<IScholarsTable> = ({ data, sortedScholars }) => {
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
            <th>Last Updated</th>
            <th>Last Claimed</th>
            <th>Claimable</th>
            {/* <td>Progress</td> */}
            <th>Chart</th>
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
                  <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                    {i.nickname}
                  </td>
                  <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                    <div className="center">
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
                    {getAverageSLP(
                      data[i.ronin]?.lastClaimed,
                      data[i.ronin]?.total
                    )}
                  </td>
                  <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                    <div className="center">
                      <img
                        src="/slp.png"
                        width={20}
                        alt="slp"
                        style={{ marginRight: 4 }}
                      />
                      {addCommaToNumber(managerShare.slp)}
                      &nbsp;&#8776; &#8369;
                      {addCommaToNumber(managerShare.converted)}
                    </div>
                  </td>
                  <td onClick={() => history.push(`/scholar/${i.ronin}`)}>
                    <div className="center">
                      <img
                        src="/slp.png"
                        width={20}
                        alt="slp"
                        style={{ marginRight: 4 }}
                      />
                      {addCommaToNumber(scholarShare.slp)}
                      &nbsp;&#8776; &#8369;
                      {addCommaToNumber(scholarShare.converted)}
                    </div>
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
                      `Visible in ${3 - data[i.ronin]?.chart.length} days`
                    )}
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
        .center {
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

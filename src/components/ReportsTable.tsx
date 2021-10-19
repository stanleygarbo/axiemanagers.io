import React from "react";
import styled, { css } from "styled-components";
import { IReportsTable } from "../interfaces/scholar-page/IReportsTable";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { useScholars } from "../contexts/scholarsContext";
// import { addCommaToNumber } from "../util/addCommaToNumber";

const ReportsTable: React.FC<IReportsTable> = ({ reports }) => {
  const { colors } = useTheme();

  const { minQuota } = useScholars();

  return (
    <Container colors={colors}>
      <p>Greenwich Mean Time (GMT)</p>
      <div className="table-container">
        {" "}
        <table>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Earned</th>
              <th>Total</th>
              <th>Quota status</th>
            </tr>
          </thead>
          <tbody>
            {reports?.map((i, idx) => {
              return (
                <tr key={idx}>
                  <td>{i?.from}</td>
                  <td>{i?.to}</td>
                  <td>
                    <div className="center">
                      <img src="/slp.png" width={20} alt="slp" />
                      <span
                        style={{
                          color:
                            minQuota > i.earned
                              ? colors.danger
                              : colors.success,
                        }}
                      >
                        {i?.earned}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="center">
                      <img src="/slp.png" width={20} alt="slp" />
                      <span>{i?.total}</span>
                    </div>
                  </td>
                  <td>
                    <QuotaStatus colors={colors} passed={i.earned > minQuota}>
                      {i.earned > minQuota ? "Passed" : "Failed"}
                    </QuotaStatus>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Container>
  );
};

const QuotaStatus = styled.div<{ colors: IColors; passed: boolean }>`
  padding: 2px 8px;
  color: #fff;
  font-size: 12px;
  border-radius: 5px;
  width: fit-content;

  ${({ colors, passed }) => css`
    background-color: ${passed ? colors.success : colors.danger};
  `}
`;

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    border: 1px solid ${colors.textIntense + 20};
    border-radius: 5px;

    p {
      padding: 5px 20px;
      color: ${colors.textNotSoIntense};
    }

    .table-container {
      overflow-x: auto;
      white-space: nowrap;
      display: block;
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

    @media (max-width: 700px) {
      margin: 16px;
    }

    @media (max-width: 595px) {
      table {
        td,
        th {
          font-size: 13px;
        }
      }
    }
    @media (max-width: 465px) {
      p {
        padding: 5px 7px;
        color: ${colors.textNotSoIntense};
        font-size: 12px;
      }

      table {
        td,
        th {
          padding: 3px 7px;
          font-size: 10px;
        }

        tbody {
          tr {
            td:nth-child(1) {
              width: 120px;
            }
          }
        }
      }
    }
  `}
`;

export default ReportsTable;

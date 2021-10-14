import React, { useEffect } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import LayoutSelector from "../components/LayoutSelector";
import { useState } from "react";
import Sorters from "../components/Sorters";
import ScholarsTable from "../components/ScholarsTable";
import ScholarCard from "../components/ScholarCard";
import { UseMutationResult, useQueryClient, UseQueryResult } from "react-query";
import { Scholars, SLPPrice } from "../interfaces/IResponseTypes";
import { useScholars } from "../contexts/scholarsContext";
import moment from "moment";
import { IColors } from "../interfaces/IColors";
import { getLastClaimed, getNextClaim } from "../util/getClaimDates";
import { DynamicSortArray, DynamicSortObject } from "../util/DynamicSort";
import { useScreenSize } from "../contexts/screenSizeContext";
import { IScholars } from "../interfaces/IScholarsContext";
import { getAverageSLP } from "../util/getAverageSLP";
import { addCommaToNumber } from "../util/addCommaToNumber";
import { getCurrencySign } from "../util/getCurrencySign";
import { useUserPreferences } from "../contexts/userPreferences";
import Button from "../components/Button";
import { JSONToCSV } from "../util/json-csv";

const HomeSection2: React.FC<{
  scholarsQuery: UseQueryResult<Scholars, unknown>;
  refetchScholarMutation: UseMutationResult<any, unknown, string, unknown>;
}> = ({ scholarsQuery, refetchScholarMutation }) => {
  const { colors, isDarkMode } = useTheme();
  const { scholars } = useScholars();
  const queryClient = useQueryClient();
  const { currency } = useUserPreferences();
  const SLPPrice = queryClient.getQueryState<SLPPrice>(["SLPPrice", currency]);
  const [sorted, setSorted] = useState<IScholars[]>();

  const [activeLayout, setActiveLayout] = useState<"tabular" | "cards">(
    "tabular"
  );
  const [orderBy, setOrderBy] = useState<string>("nickname");
  const [order, setOrder] = useState<string>("asc");
  const [downloadableFileURL, setDownloadableFileURL] = useState<string>("");

  const { screenWidth } = useScreenSize();

  useEffect(() => {
    if (screenWidth > 1000) {
      setActiveLayout("tabular");
    } else {
      setActiveLayout("cards");
    }
  }, [screenWidth]);

  useEffect(() => {
    let sortedScholarAddresses: string[] = [];
    let sortedScholars: IScholars[] = [];
    const data = scholarsQuery.data?.list;
    if (data) {
      if (orderBy === "nickname") {
        sortedScholars = scholars.sort(
          DynamicSortArray((order === "desc" ? "-" : "") + orderBy)
        );
      } else {
        sortedScholarAddresses = Object.keys(data).sort(
          DynamicSortObject((order === "desc" ? "-" : "") + orderBy, data)
        );

        for (const address of sortedScholarAddresses) {
          for (const scholar of scholars) {
            if (scholar.ronin === address) {
              sortedScholars.push(scholar);
            }
          }
        }
      }

      const downloadableData: {
        name: string;
        totalSLP: number;
        today: number;
        yesterday: number;
        mmr: number;
        rank: number;
        last_claimed: string;
        last_updated: string;
        next_claim: string;
        manager_share: number;
        manager: number;
        scholar: number;
      }[] = [];

      for (const scholar of sortedScholars) {
        const obj = {
          name: scholar.nickname,
          totalSLP: data[scholar.ronin].total,
          today: data[scholar.ronin]?.today,
          yesterday:
            data[scholar.ronin].chart[data[scholar.ronin].chart.length - 1]
              ?.earned,
          mmr: data[scholar.ronin].mmr,
          rank: data[scholar.ronin].rank,
          last_claimed: moment
            .unix(data[scholar.ronin].lastClaimed)
            .format("MM-DD-YYYY hh:mm A"),
          last_updated: moment
            .unix(data[scholar.ronin].lastUpdated)
            .format("MM-DD-YYYY hh:mm A"),
          next_claim: moment
            .unix(data[scholar.ronin].lastClaimed)
            .add(14, "days")
            .format("MM-DD-YYYY hh:mm A"),
          manager_share: scholar.managerShare,
          manager: data[scholar.ronin].total * (scholar.managerShare / 100),
          scholar:
            data[scholar.ronin].total -
            data[scholar.ronin].total * (scholar.managerShare / 100),
        };

        downloadableData.push(obj);
      }

      (async function () {
        const blob = new Blob([JSONToCSV(downloadableData)], {
          type: "text/csv",
        });
        const href = await URL.createObjectURL(blob);

        setDownloadableFileURL(href);
      })();

      setSorted(sortedScholars);
    }
  }, [scholarsQuery.data, scholars, orderBy, order]);

  if (scholarsQuery.data && sorted) {
    let scholarsStat = scholarsQuery.data.list;

    return (
      <Container
        numScholars={
          scholarsQuery.data ? Object.keys(scholarsQuery.data.list).length : 0
        }
      >
        <div className="options">
          <Sorters setOrderBy={setOrderBy} setOrder={setOrder} />
          <div className="options__right">
            {screenWidth > 700 && (
              <a
                href={downloadableFileURL}
                download={`${moment(new Date()).format(
                  "MM-DD-YYYY"
                )}-report.csv`}
              >
                <Button
                  bgColor={isDarkMode ? colors.BGLighter : "transparent"}
                  style={{
                    height: "100%",
                    marginRight: 20,
                    border: isDarkMode
                      ? `none`
                      : `1px solid ${colors.textIntense + 30}`,
                  }}
                >
                  Export CSV
                </Button>
              </a>
            )}

            <LayoutSelector
              activeLayout={activeLayout}
              setActiveLayout={setActiveLayout}
            />
          </div>
        </div>
        {activeLayout === "tabular" &&
        !scholarsQuery.isLoading &&
        scholarsQuery.data ? (
          <ScholarsTable
            data={scholarsQuery.data.list}
            sortedScholars={sorted}
            refetchScholarMutation={refetchScholarMutation}
          />
        ) : (
          activeLayout === "cards" &&
          !scholarsQuery.isLoading && (
            <div className="scholar-cards">
              {sorted.map((i, idx) => (
                <ScholarCard
                  key={idx}
                  ronin={i.ronin}
                  refetchScholarMutation={refetchScholarMutation}
                  error={false}
                  name={i.nickname}
                  badge={{ id: "", name: "" }}
                  earned={scholarsStat[i.ronin]?.total}
                  today={
                    SLPPrice?.data && scholarsStat[i.ronin]?.chart?.length > 0
                      ? addCommaToNumber(scholarsStat[i.ronin]?.today) +
                        ` ≈ ${getCurrencySign(currency)}` +
                        addCommaToNumber(
                          Math.floor(
                            scholarsStat[i.ronin]?.today *
                              SLPPrice?.data?.current
                          )
                        )
                      : "---"
                  }
                  average={
                    getAverageSLP(
                      scholarsStat[i.ronin]?.lastClaimed,
                      scholarsStat[i.ronin]?.total,
                      SLPPrice?.data?.current
                    ).slp
                  }
                  lastClaim={getLastClaimed(scholarsStat[i.ronin]?.lastClaimed)}
                  nextClaim={getNextClaim(scholarsStat[i.ronin]?.lastClaimed)}
                  lastUpdated={moment
                    .unix(scholarsStat[i.ronin]?.lastUpdated)
                    .fromNow()}
                  color={i.color}
                  progress={
                    scholarsStat[i.ronin]?.chart?.length > 0
                      ? scholarsStat[i.ronin]?.today
                      : null
                  }
                  chartData={scholarsStat[i.ronin]?.chart?.map((cd) =>
                    cd?.earned.toString()
                  )}
                  chartLabels={scholarsStat[i.ronin]?.chart?.map((cd) =>
                    moment.unix(cd.date).format("DD")
                  )}
                  mmr={scholarsStat[i.ronin]?.mmr}
                  rank={scholarsStat[i.ronin]?.rank}
                  showRetry={
                    (scholarsStat[i.ronin]?.today === 0 &&
                      scholarsStat[i.ronin]?.total === 0 &&
                      scholarsStat[i.ronin]?.lastClaimed === 0) ||
                    scholarsStat[i.ronin]?.mmr === 0
                  }
                />
              ))}
            </div>
          )
        )}
      </Container>
    );
  }

  if (scholarsQuery.isLoading)
    return <Message colors={colors}>loading...</Message>;

  return (
    <Message colors={colors}>you have not added any scholars yet.</Message>
  );
};

const Message = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    text-align: center;
    margin-top: 50px;
    color: ${colors.textNotSoIntense};
  `}
`;

const Container = styled.div<{ numScholars: number }>`
  max-width: 1200px;
  margin: 20px auto 0px auto;
  padding: 0 20px;

  .options {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__right {
      display: flex;
    }
  }

  .scholar-cards {
    display: grid;
    gap: 20px;
    margin-top: 20px;

    ${({ numScholars }) =>
      numScholars > 2
        ? css`
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          `
        : css`
            grid-template-columns: repeat(auto-fit, minmax(260px, 380px));
            @media (max-width: 963px) {
              grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            }
          `}
  }

  @media (max-width: 493px) {
    padding: 0 10px;
  }
`;

export default HomeSection2;

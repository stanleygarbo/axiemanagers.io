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

const HomeSection2: React.FC<{
  scholarsQuery: UseQueryResult<Scholars, unknown>;
  refetchScholarMutation: UseMutationResult<any, unknown, string, unknown>;
}> = ({ scholarsQuery, refetchScholarMutation }) => {
  const { colors } = useTheme();
  const { scholars } = useScholars();
  const queryClient = useQueryClient();
  const { currency } = useUserPreferences();
  const SLPPrice = queryClient.getQueryState<SLPPrice>(["SLPPrice", currency]);

  const [activeLayout, setActiveLayout] = useState<"tabular" | "cards">(
    "tabular"
  );
  const [orderBy, setOrderBy] = useState<string>("nickname");
  const [order, setOrder] = useState<string>("asc");

  const { screenWidth } = useScreenSize();

  useEffect(() => {
    if (screenWidth > 1000) {
      setActiveLayout("tabular");
    } else {
      setActiveLayout("cards");
    }
  }, [screenWidth]);

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
  }

  if (scholarsQuery.data) {
    let scholarsStat = scholarsQuery.data.list;

    return (
      <Container
        numScholars={
          scholarsQuery.data ? Object.keys(scholarsQuery.data.list).length : 0
        }
      >
        <div className="options">
          <Sorters setOrderBy={setOrderBy} setOrder={setOrder} />
          <LayoutSelector
            activeLayout={activeLayout}
            setActiveLayout={setActiveLayout}
          />
        </div>
        {activeLayout === "tabular" &&
        !scholarsQuery.isLoading &&
        scholarsQuery.data ? (
          <ScholarsTable
            data={scholarsQuery.data.list}
            sortedScholars={sortedScholars}
            refetchScholarMutation={refetchScholarMutation}
          />
        ) : (
          activeLayout === "cards" &&
          !scholarsQuery.isLoading && (
            <div className="scholar-cards">
              {sortedScholars.map((i, idx) => (
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
    margin-top: 100px;
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

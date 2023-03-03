import styled, { css } from "styled-components";
import HomeSection1 from "../templates/HomeSection1";
import HomeSection2 from "../templates/HomeSection2";
import AddScholarForm from "../components/AddScholarForm";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useScholars } from "../contexts/scholarsContext";
import {
  fetchAllScholars,
  fetchSLPPrice,
  refetchScholar,
  fetchSLPPriceChart,
} from "../api/requests";
import {
  Scholars,
  SLPPrice,
  SLPPriceChart,
} from "../interfaces/IResponseTypes";
import { useUserPreferences } from "../contexts/userPreferences";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { useEffect, useRef } from "react";

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    padding-bottom: 50px;
    width: 100%;
    .ad {
      padding: 0 20px;
      margin: 0 auto;
      margin-top: 20px;
      max-width: 1200px;
      display: flex;
      justify-content: center;
      display: grid;
      grid-template-columns: 1fr 728px;
      gap: 20px;

      .notice,
      .coinzilla {
        border: 1px dashed ${colors.textIntense + 30};
        padding: 10px;
        border-radius: 5px;

        &__title {
          color: ${colors.textNotSoIntense};
          font-size: 16px;
          font-weight: 500;
        }
        p {
          color: ${colors.textIntense + 90};
          font-size: 13px;
          margin-top: 3px;
        }
      }

      .coinzilla {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 70px;
      }
    }

    @media (max-width: 1152px) {
      .ad {
        .notice,
        .coinzilla {
          &__title {
            font-size: 14px;
          }
          p {
            font-size: 11px;
          }
        }
      }
    }
    @media (max-width: 1091px) {
      .ad {
        display: flex;
        justify-content: center;
        .coinzilla {
          width: 100%;
        }
        .notice {
          display: none;
        }
      }
    }
    @media (max-width: 493px) {
      .ad {
        padding: 0 10px;
      }
    }
  `}
`;

const HomePage = () => {
  const { scholars, addScholar } = useScholars();
  const { currency } = useUserPreferences();
  const { colors } = useTheme();
  const refetchedScholars = useRef<string[]>([]);

  const ids = scholars?.map((i) => i.ronin.replace("ronin:", "0x"));

  const queryClient = useQueryClient();

  // add list of scholars by default if there are none
  useEffect(() => {
    if (scholars.length < 1) {
      addScholar({
        ronin: "ronin:94d2cd95c8b15f8869ad671b5b31fe4b5e4d844d",
        nickname: "dian",
        managerShare: 50,
        color: "#1b70d9",
      });
    }
  }, [scholars, addScholar]);

  const scholarsQuery = useQuery<Scholars, any>(
    "Scholars",
    () => fetchAllScholars(ids),
    {
      enabled: ids.length > 0,
      keepPreviousData: true,
      staleTime: 60000,
    }
  );

  const SLPPriceQuery = useQuery<SLPPrice, any>(
    ["SLPPrice", currency],
    async () => await fetchSLPPrice(currency),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

  const SLPPriceChartQuery = useQuery<SLPPriceChart, any>(
    ["SLPPriceChart", currency],
    async () => await fetchSLPPriceChart(currency),
    {
      keepPreviousData: true,
      staleTime: Infinity,
    }
  );

  const refetchScholarMutation = useMutation(
    (ronin: string) => refetchScholar(ronin),
    {
      onSuccess: async (variables) => {
        queryClient.setQueryData<Scholars>("Scholars", (old: any) => {
          old.list[variables.ronin] = variables;

          return old;
        });
      },
    }
  );

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "/coinzilla.js";

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // run piece of code when scholarsQuery.data changes
  useEffect(() => {
    const data = scholarsQuery.data;
    if (data) {
      for (const [ronin, obj] of Object.entries(data.list)) {
        if (obj.mmr === 0 && !refetchedScholars.current.includes(ronin)) {
          refetchScholarMutation.mutate(ronin.replace("ronin:", "0x"));
          refetchedScholars.current.push(ronin);
        }
      }
    }
  }, [scholarsQuery.data, refetchScholarMutation]);

  const messages = [
    {
      title: "Notice",
      message: `Please export your list of scholars just in case of data loss. This will save you the hassle if your scholars "disappear".`,
    },
    {
      title: "Notice",
      message: `For the daily SLP to be accurate, it is recommended for your
      players to play 1hr after reset.".`,
    },
    {
      title: "Update",
      message: `Yesterday SLP is now added. You can choose what columns to show/hide on the table 
      under settings > preferences.`,
    },
  ];

  const random = Math.random() * (2 - 0) + 0;
  const randomMessage = messages[Math.round(random)];

  return (
    <Container colors={colors}>
      <div className="section1">
        <HomeSection1
          SLPPriceChartQuery={SLPPriceChartQuery}
          scholarsQuery={scholarsQuery}
          SLPPriceQuery={SLPPriceQuery}
        />

        <div className="ad">
          <div className="notice">
            <div className="notice__title">{randomMessage.title}</div>
            <p>{randomMessage.message}</p>
          </div>
          <div className="coinzilla" data-zone="C-8615a9fd1747a828">
            <p>728 x 90 coinzilla ad placeholder</p>
          </div>
        </div>
        <AddScholarForm />
        <HomeSection2
          refetchScholarMutation={refetchScholarMutation}
          scholarsQuery={scholarsQuery}
        />
      </div>
    </Container>
  );
};

export default HomePage;

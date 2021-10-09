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
} from "../api/requests";
import { Scholars } from "../interfaces/IResponseTypes";
import { useUserPreferences } from "../contexts/userPreferences";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

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
      gap: 10px;

      .notice {
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
    }

    @media (max-width: 1152px) {
      .ad {
        .notice {
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
  const { scholars } = useScholars();
  const { currency } = useUserPreferences();
  const { colors } = useTheme();

  const ids = scholars?.map((i) => i.ronin.replace("ronin:", "0x"));

  const queryClient = useQueryClient();

  const scholarsQuery = useQuery<Scholars, any>(
    "Scholars",
    () => fetchAllScholars(ids),
    {
      enabled: ids.length > 0,
      keepPreviousData: true,
      staleTime: 60000,
    }
  );

  const SLPPriceQuery = useQuery(
    ["SLPPrice", currency],
    async () => await fetchSLPPrice(currency),
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

  const messages = [
    `Please export your list of scholars just in case of data loss. This will save you the hassle if your scholars "disappear".`,
    `For the daily SLP to be accurate, it is recommended for your
    players to play 1hr after reset.`,
  ];

  const random = Math.random() * (1 - 0) + 0;

  return (
    <Container colors={colors}>
      <div className="section1">
        <HomeSection1
          scholarsQuery={scholarsQuery}
          SLPPriceQuery={SLPPriceQuery}
        />

        <div className="ad">
          <div className="notice">
            <div className="notice__title">Notice</div>
            <p>{messages[Math.round(random)]}</p>
          </div>
          <div className="coinzilla" data-zone="C-8615a9fd1747a828"></div>
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

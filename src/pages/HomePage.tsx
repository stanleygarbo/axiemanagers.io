import styled from "styled-components";
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

const Container = styled.div`
  padding-bottom: 100px;
`;

const HomePage = () => {
  const { scholars } = useScholars();
  const { currency } = useUserPreferences();

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

  return (
    <Container>
      <div className="section1">
        <HomeSection1
          scholarsQuery={scholarsQuery}
          SLPPriceQuery={SLPPriceQuery}
        />
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

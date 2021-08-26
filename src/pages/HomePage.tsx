import styled from "styled-components";
import HomeSection1 from "../templates/HomeSection1";
import HomeSection2 from "../templates/HomeSection2";
import AddScholarForm from "../components/AddScholarForm";
import { useQuery } from "react-query";
import { useScholars } from "../contexts/scholarsContext";
import { fetchAllScholars, fetchSLPPrice } from "../api/requests";
import { Scholars } from "../interfaces/IResponseTypes";

const Container = styled.div`
  padding-bottom: 100px;
`;

const HomePage = () => {
  const { scholars } = useScholars();

  const ids = scholars?.map((i) => i.ronin.replace("ronin:", "0x"));

  const scholarsQuery = useQuery<Scholars, any>(
    "Scholars",
    () => fetchAllScholars(ids),
    {
      enabled: ids.length > 0,
      keepPreviousData: true,
      staleTime: 60000,
    }
  );

  const SLPPriceQuery = useQuery("SLPPrice", fetchSLPPrice, {
    keepPreviousData: true,
    staleTime: 60000,
  });

  return (
    <Container>
      <div className="section1">
        <HomeSection1
          scholarsQuery={scholarsQuery}
          SLPPriceQuery={SLPPriceQuery}
        />
        <AddScholarForm />
        <HomeSection2 scholarsQuery={scholarsQuery} />
      </div>
    </Container>
  );
};

export default HomePage;

import axios from "axios";
import { SLPPrice } from "../interfaces/IResponseTypes";

export const fetchSLPPrice = async (currency: string) => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=smooth-love-potion&vs_currencies=${
    currency ? currency : "php"
  }`;
  const { data }: { data: SLPPrice } = await axios.get(url);

  return data;
};

export const fetchSLPPriceChart = async (currency: string) => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/smooth-love-potion/market_chart?vs_currency=${
      currency ? currency : "php"
    }&days=30&interval=daily`
  );

  return data;
};

export const fetchAllScholars = async (addresses: string[]) => {
  const res = await axios({
    method: "post",
    // url: `https://apiv2.axiemanagers.io/scholars?getLeaderboard=true`,
    // url: `http://localhost:8080/scholars`,
    url: `https://axiemockdata-production.up.railway.app/scholars`,
    data: {
      ids: addresses,
    },
  });
  return res.data;
};

export const fetchScholarByAddress = async (address: string) => {
  const res = await axios({
    method: "get",
    // url: `https://apiv2.axiemanagers.io/scholar/${address}`,
    // url: `http://localhost:8080/scholar/${address}`,
    url: `https://axiemockdata-production.up.railway.app/scholar/${address}`,
  });
  return res.data;
};

export const fetchScholarAxies = async (address: string) => {
  const res = await axios({
    url: "https://graphql-gateway.axieinfinity.com/graphql",
    method: "POST",
    data: {
      operationName: "GetAxieBriefList",
      variables: {
        from: 0,
        size: 24,
        sort: "PriceAsc",
        auctionType: "All",
        criteria: {},
        owner: address,
      },
      query:
        "query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    results {\n      ...AxieBrief\n      }\n    }\n}\n\nfragment AxieBrief on Axie {\n  id\n  class\n  breedCount\n  image\n  stats  {\n  hp\n  speed\n  skill\n  morale\n   }\n   }\n",
    },
  });

  return res.data?.data?.axies?.results;
};

export const refetchScholar = async (address: string) => {
  const res = await axios({
    method: "get",
    url: `https://apiv2.axiemanagers.io/scholar/${address}?clearCache=true`,
  });

  return res.data;
};

export const fetchScholarReports = async (address: string) => {
  const res = await axios({
    method: "get",
    // url: `https://apiv2.axiemanagers.io/reports/${address}`,
    // url: `http://localhost:8080/reports/${address}`,
    url: `https://axiemockdata-production.up.railway.app/reports/${address}`,
  });

  return res.data;
};

import axios from "axios";

export const fetchSLPPrice = async (currency: string) => {
  const { data } = await axios.get(
    `https://api.axiemanagers.io/slp_price?currency=${
      currency ? currency : "php"
    }`
  );

  return data;
};

export const fetchAllScholars = async (addresses: string[]) => {
  const res = await axios({
    method: "post",
    url: `https://api.axiemanagers.io/scholars?getLeaderboard=true`,
    data: {
      ids: addresses,
    },
  });
  return res.data;
};

export const fetchScholarByAddress = async (address: string) => {
  const res = await axios({
    method: "get",
    url: `https://api.axiemanagers.io/scholar/${address}`,
  });
  return res.data;
};

export const fetchScholarAxies = async (address: string) => {
  const res = await axios({
    url: "https://axieinfinity.com/graphql-server-v2/graphql",
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
    url: `https://api.axiemanagers.io/scholar/${address}?clearCache=true`,
  });

  return res.data;
};

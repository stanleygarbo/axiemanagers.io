export type SLPPrice = {
  "smooth-love-potion": {
    [key: string]: number;
  };
};

export type SLPPriceChart = {
  prices: number[][];
};

export type Scholar = {
  ronin: string;
  total: number;
  lastClaimed: number;
  lastUpdated: number;
  lastClaimAmount: number;
  today: number;
  chart: ChartObj[];
  axies: Axie[];
  success: boolean;
  totalClaimable: number;
  mmr: number;
  rank: number;
};

export type ScholarReports = {
  from: string;
  to: string;
  earned: number;
  total: number;
}[];

export type Scholars = {
  list: { [key: string]: Scholar };
  earnings: Earnings;
};

export type Earnings = {
  total: number;
  chart: ChartObj[];
};

export type ChartObj = {
  date: number;
  earned: number;
};

export type Axie = {
  id: string;
  class: string;
  breedCount: number;
  image: string;
  stats: Stats;
};

export type Stats = {
  hp: number;
  skill: number;
  speed: number;
  morale: number;
};

export type IScholarsTableColumns = {
  name: boolean;
  total: boolean;
  manager: boolean;
  scholar: boolean;
  lastClaimedAmount: boolean;
  lastUpdated: boolean;
  lastClaimed: boolean;
  nextClaim: boolean;
  chart: boolean;
  mmr: boolean;
  rank: boolean;
  average: boolean;
  today: boolean;
  yesterday: boolean;
};

export type ICurrency = "eur" | "sgd" | "inr" | "vnd" | "php" | "usd" | "";

export interface IUserPreferences {
  scholarsTable: IScholarsTableColumns;
  currency: ICurrency;
  didAcceptCookiePolicy: boolean;
  acceptCookiePolicy: () => void;
  setScholarsTable: ({
    name,
    total,
    average,
    today,
    yesterday,
    manager,
    scholar,
    lastClaimedAmount,
    lastUpdated,
    lastClaimed,
    nextClaim,
    mmr,
    rank,
    chart,
  }: IScholarsTableColumns) => void;
  setCurrency: (currency: ICurrency) => void;
}

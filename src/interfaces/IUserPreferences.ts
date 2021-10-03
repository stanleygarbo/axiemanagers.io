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
};

export type ICurrency = "eur" | "sgd" | "inr" | "vnd" | "php" | "usd" | "";

export interface IUserPreferences {
  scholarsTable: IScholarsTableColumns;
  currency: ICurrency;
  setScholarsTable: ({
    name,
    total,
    average,
    today,
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

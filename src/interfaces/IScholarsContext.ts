export type IScholars = {
  ronin: string;
  color: string;
  nickname: string;
  managerShare: number;
};

export interface IScholarsContext {
  scholars: IScholars[];
  minQuota: number;
  updateMinQuota: (num: number) => void;
  addScholar: ({ ronin, color, nickname, managerShare }: IScholars) => void;
  updateScholar: ({ ronin, color, nickname, managerShare }: IScholars) => void;
  deleteScholar: ({ ronin }: { ronin: string }) => void;
}

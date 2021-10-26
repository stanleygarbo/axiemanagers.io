export type IScholars = {
  ronin: string;
  color: string;
  nickname: string;
  managerShare: number;
  category?: string;
};

export type ICategory = {
  name: string;
  quota: number;
  color: string;
};

export interface IScholarsContext {
  scholars: IScholars[];
  minQuota: number;
  categories: ICategory[];
  addCategory: ({ name, quota }: ICategory) => void;
  removeCategory: (name: string) => void;
  updateMinQuota: (num: number) => void;
  addScholar: ({ ronin, color, nickname, managerShare }: IScholars) => void;
  updateScholar: ({ ronin, color, nickname, managerShare }: IScholars) => void;
  deleteScholar: ({ ronin }: { ronin: string }) => void;
}

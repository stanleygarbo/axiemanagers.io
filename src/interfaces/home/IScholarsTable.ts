import { UseMutationResult } from "react-query";
import { Scholar } from "../IResponseTypes";
import { IScholars } from "../IScholarsContext";

export interface IScholarsTable {
  data: {
    [key: string]: Scholar;
  };
  sortedScholars: IScholars[];
  refetchScholarMutation: UseMutationResult<any, unknown, string, unknown>;
  setOrderBy: React.Dispatch<React.SetStateAction<string>>;
  orderBy: string;
  setOrder: React.Dispatch<React.SetStateAction<string>>;
  order: string;
}

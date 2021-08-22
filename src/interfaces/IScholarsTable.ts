import { Scholar } from "./IResponseTypes";
import { IScholars } from "./IScholarsContext";

export interface IScholarsTable {
  data: {
    [key: string]: Scholar;
  };
  sortedScholars: IScholars[];
}

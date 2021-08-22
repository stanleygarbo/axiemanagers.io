import { Dispatch, SetStateAction } from "react";

export interface ISorters {
  setOrder: Dispatch<SetStateAction<string>>;
  setOrderBy: Dispatch<SetStateAction<string>>;
}

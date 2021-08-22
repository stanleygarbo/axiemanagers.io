import { Dispatch, SetStateAction } from "react";

export interface ILayoutSelector {
  activeLayout: "tabular" | "cards";
  setActiveLayout: Dispatch<SetStateAction<"tabular" | "cards">>;
}

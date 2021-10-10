import { Dispatch, SetStateAction } from "react";

export interface ITabSelector {
  activeTab: "reports" | "axies";
  setActiveTab: Dispatch<SetStateAction<"reports" | "axies">>;
}

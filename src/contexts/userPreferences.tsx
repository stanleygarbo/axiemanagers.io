import React, { useState, useEffect, createContext, useContext } from "react";
import {
  IUserPreferences,
  IScholarsTableColumns,
  ICurrency,
} from "../interfaces/IUserPreferences";

const userPreferencesContext = createContext<IUserPreferences>({
  scholarsTable: {
    name: true,
    total: true,
    manager: true,
    scholar: true,
    lastClaimedAmount: false,
    lastUpdated: true,
    lastClaimed: true,
    nextClaim: true,
    mmr: true,
    rank: false,
    chart: true,
    today: true,
    average: true,
  },
  currency: "",
  setScholarsTable: () => {},
  setCurrency: () => {},
});

const useUserPreferencesContext = () => {
  const [scholarsTablePreferences, setScholarsTablePreferences] = useState({
    name: true,
    total: true,
    manager: true,
    scholar: true,
    lastClaimedAmount: false,
    lastUpdated: true,
    lastClaimed: true,
    nextClaim: true,
    mmr: true,
    rank: false,
    chart: true,
    today: true,
    average: true,
  });

  const [selectedCurrency, setselectedCurrency] = useState<ICurrency>("");

  useEffect(() => {
    const stringifiedUserPreferences = localStorage.getItem("userPreferences");

    let parsedUserPreferences: {
      scholarsTable: IScholarsTableColumns;
      currency: ICurrency;
    } = {
      scholarsTable: {
        name: true,
        total: true,
        manager: true,
        scholar: true,
        lastClaimedAmount: false,
        lastUpdated: true,
        lastClaimed: true,
        nextClaim: true,
        mmr: true,
        rank: false,
        chart: true,
        today: true,
        average: true,
      },
      currency: "",
    };
    if (stringifiedUserPreferences) {
      parsedUserPreferences = JSON.parse(stringifiedUserPreferences);
    }

    if (parsedUserPreferences === null || parsedUserPreferences === undefined) {
      setScholarsTablePreferences({
        name: true,
        total: true,
        manager: true,
        scholar: true,
        lastClaimedAmount: false,
        lastUpdated: true,
        lastClaimed: true,
        nextClaim: true,
        mmr: true,
        rank: false,
        chart: true,
        today: true,
        average: true,
      });
      setCurrency("");
    } else {
      setScholarsTablePreferences(parsedUserPreferences.scholarsTable);
      setCurrency(parsedUserPreferences.currency);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({
        scholarsTable: scholarsTablePreferences,
        currency: selectedCurrency,
      })
    );
  }, [scholarsTablePreferences, selectedCurrency]);

  const setScholarsTable = ({
    name,
    total,
    manager,
    scholar,
    lastClaimedAmount,
    lastUpdated,
    lastClaimed,
    nextClaim,
    mmr,
    rank,
    chart,
    today,
    average,
  }: IScholarsTableColumns) => {
    setScholarsTablePreferences({
      name,
      total,
      manager,
      scholar,
      lastClaimedAmount,
      lastUpdated,
      lastClaimed,
      nextClaim,
      rank,
      mmr,
      chart,
      today,
      average,
    });
  };

  const setCurrency = (currency: ICurrency) => {
    setselectedCurrency(currency);
  };

  return {
    scholarsTable: scholarsTablePreferences,
    setScholarsTable,
    setCurrency,
    currency: selectedCurrency,
  };
};

export const UserPreferencesContextProvider: React.FC<{
  children: React.ReactChild;
}> = ({ children }) => {
  const userPreferences = useUserPreferencesContext();

  return (
    <userPreferencesContext.Provider value={userPreferences}>
      {children}
    </userPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(userPreferencesContext);

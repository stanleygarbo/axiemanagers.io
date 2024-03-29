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
    lastUpdated: false,
    lastClaimed: true,
    nextClaim: true,
    mmr: true,
    rank: false,
    chart: true,
    today: true,
    yesterday: true,
    average: true,
    team: false,
  },
  currency: "php",
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
    lastUpdated: false,
    lastClaimed: true,
    nextClaim: true,
    mmr: true,
    rank: false,
    chart: true,
    today: true,
    yesterday: true,
    average: true,
    team: false,
  });

  const [selectedCurrency, setselectedCurrency] = useState<ICurrency>("");
  const [acceptedCookiePolicy, setAcceptedCookiePolicy] =
    useState<boolean>(false);

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
        lastUpdated: false,
        lastClaimed: true,
        nextClaim: true,
        mmr: true,
        rank: false,
        chart: true,
        today: true,
        yesterday: true,
        average: true,
        team: false,
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
        lastUpdated: false,
        lastClaimed: true,
        nextClaim: true,
        mmr: true,
        rank: false,
        chart: true,
        today: true,
        yesterday: true,
        average: true,
        team: false,
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
  }, [scholarsTablePreferences, selectedCurrency, acceptedCookiePolicy]);

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
    yesterday,
    average,
    team,
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
      yesterday,
      average,
      team,
    });
  };

  const setCurrency = (currency: ICurrency) => {
    setselectedCurrency(currency);
  };

  function acceptCookiePolicy() {
    setAcceptedCookiePolicy(true);
  }

  return {
    scholarsTable: scholarsTablePreferences,
    setScholarsTable,
    setCurrency,
    currency: selectedCurrency,
    acceptCookiePolicy,
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

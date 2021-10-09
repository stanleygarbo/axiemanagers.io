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
  didAcceptCookiePolicy: false,
  currency: "",
  setScholarsTable: () => {},
  setCurrency: () => {},
  acceptCookiePolicy: () => {},
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
  const [acceptedCookiePolicy, setAcceptedCookiePolicy] =
    useState<boolean>(false);

  useEffect(() => {
    const stringifiedUserPreferences = localStorage.getItem("userPreferences");

    let parsedUserPreferences: {
      scholarsTable: IScholarsTableColumns;
      currency: ICurrency;
      didAcceptCookiePolicy: boolean;
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
      didAcceptCookiePolicy: false,
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
      setAcceptedCookiePolicy(false);
    } else {
      setScholarsTablePreferences(parsedUserPreferences.scholarsTable);
      setCurrency(parsedUserPreferences.currency);
      setAcceptedCookiePolicy(parsedUserPreferences.didAcceptCookiePolicy);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({
        scholarsTable: scholarsTablePreferences,
        currency: selectedCurrency,
        didAcceptCookiePolicy: acceptedCookiePolicy,
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

  function acceptCookiePolicy() {
    setAcceptedCookiePolicy(true);
  }

  return {
    scholarsTable: scholarsTablePreferences,
    setScholarsTable,
    setCurrency,
    currency: selectedCurrency,
    didAcceptCookiePolicy: acceptedCookiePolicy,
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

import React, { useState, useEffect, createContext, useContext } from "react";
import {
  IUserPreferences,
  IScholarsTableColumns,
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
  setScholarsTable: () => {},
});

const useUserPreferencesContext = () => {
  const [userPreferences, setUserPreferences] = useState({
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
  });

  useEffect(() => {
    const stringifiedUserPreferences = localStorage.getItem("userPreferences");

    let parsedUserPreferences = {
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
    };
    if (stringifiedUserPreferences) {
      parsedUserPreferences = JSON.parse(stringifiedUserPreferences);
    }

    if (parsedUserPreferences === null || parsedUserPreferences === undefined) {
      setUserPreferences({
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
      });
    } else {
      setUserPreferences(parsedUserPreferences);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("userPreferences", JSON.stringify(userPreferences));
  }, [userPreferences]);

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
    setUserPreferences({
      scholarsTable: {
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
      },
    });
  };

  return {
    scholarsTable: userPreferences.scholarsTable,
    setScholarsTable,
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

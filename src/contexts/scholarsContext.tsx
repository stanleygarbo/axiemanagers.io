import React, { useState, useEffect, createContext, useContext } from "react";
import { IScholarsContext, IScholars } from "../interfaces/IScholarsContext";

const scholarsContext = createContext<IScholarsContext>({
  scholars: [],
  minQuota: 0,
  updateMinQuota: () => {},
  addScholar: () => {},
  updateScholar: () => {},
  deleteScholar: () => {},
});

const useScholarsContext = () => {
  const [scholars, setScholars] = useState<IScholars[]>([]);
  const [minQuota, setMinQuota] = useState<number>(0);

  useEffect(() => {
    const parsedMinQuota = Number(localStorage.getItem("minQuota"));
    const stringifiedScholars = localStorage.getItem("scholars");
    let parsedScholars = [];
    if (stringifiedScholars) {
      parsedScholars = JSON.parse(stringifiedScholars);
    }
    setScholars(
      parsedScholars.length > 0
        ? parsedScholars
        : [
            {
              ronin: "ronin:94d2cd95c8b15f8869ad671b5b31fe4b5e4d844d",
              color: "#8bf48a",
              nickname: "Sample 1",
              managerShare: 50,
            },
            {
              ronin: "ronin:a6362a3f08cef6565ff584f1fa0b98a5ace78e89",
              color: "#e91e63",
              nickname: "Sample 2",
              managerShare: 50,
            },
          ]
    );
    setMinQuota(parsedMinQuota);
  }, []);

  useEffect(() => {
    localStorage.setItem("scholars", JSON.stringify(scholars));
  }, [scholars]);

  useEffect(() => {
    localStorage.setItem("minQuota", minQuota.toString());
  }, [minQuota]);

  function updateMinQuota(num: number) {
    setMinQuota(num);
  }

  function addScholar({ ronin, color, nickname, managerShare }: IScholars) {
    const exists = scholars.find((obj) => obj.ronin === ronin);

    if (!exists) {
      setScholars([...scholars, { ronin, color, nickname, managerShare }]);
    } else {
      alert(`${exists.nickname} already added.`);
    }
  }

  function updateScholar({ ronin, color, nickname, managerShare }: IScholars) {
    const filtered = scholars.filter((obj) => obj.ronin !== ronin);
    filtered.push({ ronin, color, nickname, managerShare });
    setScholars(filtered);
  }

  function deleteScholar({ ronin }: { ronin: string }) {
    const filtered = scholars.filter((obj) => obj.ronin !== ronin);
    setScholars(filtered);
  }

  return {
    scholars,
    minQuota,
    updateMinQuota,
    addScholar,
    updateScholar,
    deleteScholar,
  };
};

export const ScholarContextProvider: React.FC<{
  children: React.ReactChild;
}> = ({ children }) => {
  const scholars = useScholarsContext();
  return (
    <scholarsContext.Provider value={scholars}>
      {children}
    </scholarsContext.Provider>
  );
};

export const useScholars = () => useContext(scholarsContext);

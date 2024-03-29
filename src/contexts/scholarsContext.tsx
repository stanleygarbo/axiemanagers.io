import React, { useState, useEffect, createContext, useContext } from "react";
import {
  IScholarsContext,
  IScholars,
  ICategory,
} from "../interfaces/IScholarsContext";

const scholarsContext = createContext<IScholarsContext>({
  scholars: [],
  minQuota: 0,
  categories: [],
  addCategory: () => {},
  removeCategory: () => {},
  updateMinQuota: () => {},
  addScholar: () => {},
  updateScholar: () => {},
  deleteScholar: () => {},
});

const useScholarsContext = () => {
  const [scholars, setScholars] = useState<IScholars[]>([]);
  const [minQuota, setMinQuota] = useState<number>(0);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const parsedMinQuota = Number(localStorage.getItem("minQuota"));
    const stringifiedScholars = localStorage.getItem("scholars");
    const stringifiedCategories = localStorage.getItem("categories");

    let parsedScholars: IScholars[] = [];
    if (stringifiedScholars) {
      parsedScholars = JSON.parse(stringifiedScholars);

      for (let i = 0; i < parsedScholars.length; i++) {
        if (!parsedScholars[i].category) {
          parsedScholars[i].category = "";
        }
      }
    }
    setScholars(parsedScholars.length > 0 ? parsedScholars : []);

    let parsedCategories: ICategory[] = [];
    if (stringifiedCategories) {
      parsedCategories = JSON.parse(stringifiedCategories);
    }
    if (parsedCategories.length < 1) {
      parsedCategories = [
        { name: "PVP", quota: 150, color: "#7189da" },
        { name: "PVE", quota: 75, color: "#4caf50" },
        { name: "AAP", quota: 120, color: "#00bcd4" },
      ];
    }
    setCategories(parsedCategories);

    if (parsedMinQuota) {
      setMinQuota(parsedMinQuota);
    } else {
      setMinQuota(75);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("scholars", JSON.stringify(scholars));
  }, [scholars]);

  useEffect(() => {
    localStorage.setItem("minQuota", minQuota.toString());
  }, [minQuota]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  function updateMinQuota(num: number) {
    setMinQuota(num);
  }

  function addCategory({ name, quota, color }: ICategory) {
    const exists = categories.find((obj) => obj.name === name);

    if (!exists) {
      setCategories([...categories, { name, quota, color }]);
    } else {
      alert(`${exists.name} already added.`);
    }
  }

  function removeCategory(name: string) {
    const filtered = categories.filter((obj) => obj.name !== name);
    setCategories(filtered);
  }

  function addScholar({
    ronin,
    color,
    nickname,
    managerShare,
    category,
  }: IScholars) {
    const exists = scholars.find((obj) => obj.ronin === ronin);

    if (!exists) {
      setScholars([
        ...scholars,
        { ronin, color, nickname, managerShare, category },
      ]);
    } else {
      alert(`${exists.nickname} already added.`);
    }
  }

  function updateScholar({
    ronin,
    color,
    nickname,
    managerShare,
    category,
  }: IScholars) {
    const filtered = scholars.filter((obj) => obj.ronin !== ronin);
    filtered.push({ ronin, color, nickname, managerShare, category });
    setScholars(filtered);
  }

  function deleteScholar({ ronin }: { ronin: string }) {
    const filtered = scholars.filter((obj) => obj.ronin !== ronin);
    setScholars(filtered);
  }

  return {
    scholars,
    minQuota,
    categories,
    addCategory,
    removeCategory,
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

import React from "react";
import styled, { css } from "styled-components";
import Button from "../components/Button";
import { useTheme } from "../contexts/themeContext";
import { useUserPreferences } from "../contexts/userPreferences";
import { IColors } from "../interfaces/IColors";
import { ICurrency } from "../interfaces/IUserPreferences";

const additionalFilters = [
  { id: "name", name: "NAME" },
  { id: "total", name: "TOTAL" },
  { id: "average", name: "AVERAGE" },
  { id: "manager", name: "MANAGER" },
  { id: "scholar", name: "SCHOLAR" },
  // { id: "today", name: "TODAY" },
  // { id: "lastClaimedAmount", name: "TOTAL CLAIMED" },
  { id: "lastUpdated", name: "LAST UPDATED" },
  { id: "lastClaimed", name: "LAST CLAIMED" },
  { id: "nextClaim", name: "NEXT CLAIM" },
  // { id: "progress", name: "PROGRESS" },
  { id: "chart", name: "CHART" },
  { id: "mmr", name: "MMR" },
  { id: "rank", name: "RANK" },
];

const currencies: { id: ICurrency; name: string }[] = [
  { id: "php", name: "PHP" },
  { id: "usd", name: "USD" },
  { id: "inr", name: "INR" },
  { id: "vnd", name: "VND" },
  { id: "eur", name: "EUR" },
  { id: "sgd", name: "SGD" },
];

const SettingsPreferences = () => {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();

  const { scholarsTable, setScholarsTable, setCurrency, currency } =
    useUserPreferences();

  const filterButtonStyles = {
    borderRadius: 7,
    padding: "5px 10px",
    marginRight: 10,
    marginTop: 10,
  };

  const activeFilterButtonStyles = {
    border: `1px solid ${colors.accent}`,
    background: colors.accent + 20,
    color: colors.accent,
  };

  const inactiveFilterButtonStyles = {
    border: `1px solid ${colors.textIntense + 99}`,
    background: colors.textIntense + "05",
    color: colors.textIntense + 99,
  };

  function columnFilterClickHandler(name: string) {
    setScholarsTable({ ...scholarsTable, [name]: !scholarsTable[name] });
  }

  return (
    <Container colors={colors}>
      <div className="title">Columns Shown</div>
      {additionalFilters.map((i, idx) => (
        <Button
          key={idx}
          onClick={() => columnFilterClickHandler(i.id)}
          style={{
            ...filterButtonStyles,
            ...(scholarsTable[i.id]
              ? activeFilterButtonStyles
              : inactiveFilterButtonStyles),
          }}
        >
          {i.name}
        </Button>
      ))}
      <br />
      <br />
      <div className="title">Currency</div>
      {currencies.map((i, idx) => (
        <Button
          key={idx}
          onClick={() => setCurrency(i.id)}
          style={{
            ...filterButtonStyles,
            ...(currency === i.id
              ? activeFilterButtonStyles
              : inactiveFilterButtonStyles),
          }}
        >
          {i.name}
        </Button>
      ))}

      <br />
      <br />
      <div className="title">User interface</div>

      <Button
        onClick={toggleDarkMode}
        style={{
          ...filterButtonStyles,
          ...(isDarkMode
            ? activeFilterButtonStyles
            : inactiveFilterButtonStyles),
        }}
      >
        Dark Mode
      </Button>
      <Button
        onClick={toggleDarkMode}
        style={{
          ...filterButtonStyles,
          ...(!isDarkMode
            ? activeFilterButtonStyles
            : inactiveFilterButtonStyles),
        }}
      >
        Light Mode
      </Button>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    padding: 20px;
    flex: 1;

    .title {
      color: ${colors.textNotSoIntense};
    }
  `}
`;

export default SettingsPreferences;

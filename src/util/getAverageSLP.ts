import moment from "moment";
import { addCommaToNumber } from "./addCommaToNumber";

type Average = { slp: string; converted: number | string };

export const getAverageSLP = (
  lastClaimed?: number,
  totalSLP?: number,
  slpPrice?: number,
  currencySign?: string
): Average => {
  if (!lastClaimed || totalSLP === undefined || slpPrice === undefined)
    return { slp: "---", converted: "---" };

  const avgSLP = Math.floor(
    totalSLP /
      Number(
        moment
          .duration(moment(new Date()).diff(moment.unix(lastClaimed)))
          .asDays()
          .toFixed(0)
      )
  );

  return {
    slp:
      lastClaimed !== 0 &&
      moment
        .duration(moment(new Date()).diff(moment.unix(lastClaimed)))
        .asDays()
        .toFixed(0) !== "0"
        ? addCommaToNumber(avgSLP) + " / day"
        : "---",
    converted:
      `≈ ${currencySign}` + addCommaToNumber(Math.floor(avgSLP * slpPrice)),
  };
};

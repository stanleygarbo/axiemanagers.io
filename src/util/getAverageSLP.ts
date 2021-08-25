import moment from "moment";
import { addCommaToNumber } from "./addCommaToNumber";

type Average = { slp: number | string; converted: number | string };

export const getAverageSLP = (
  lastClaimed?: number,
  totalSLP?: number,
  slpPrice?: number
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
    converted: "≈ ₱" + addCommaToNumber(Math.floor(avgSLP * slpPrice)),
  };
};

import moment from "moment";
import { addCommaToNumber } from "./addCommaToNumber";

export const getAverageSLP = (
  lastClaimed?: number,
  totalSLP?: number
): string => {
  if (!lastClaimed || totalSLP === undefined) return "---";

  return lastClaimed !== 0 &&
    moment
      .duration(moment(new Date()).diff(moment.unix(lastClaimed)))
      .asDays()
      .toFixed(0) !== "0"
    ? addCommaToNumber(
        Math.round(
          totalSLP /
            Number(
              moment
                .duration(moment(new Date()).diff(moment.unix(lastClaimed)))
                .asDays()
                .toFixed(0)
            )
        )
      ) + " / day"
    : "---";
};

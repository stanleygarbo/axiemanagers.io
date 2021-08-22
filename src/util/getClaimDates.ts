import moment from "moment";

export const getNextClaim = (lastClaimed: number | undefined): string => {
  if (lastClaimed === undefined) return "---";
  if (lastClaimed === 0) return "Anytime";

  return moment.unix(lastClaimed).add(14, "days").fromNow();
};

export const getLastClaimed = (lastClaimed: number | undefined): string => {
  if (lastClaimed === undefined) return "---";
  if (lastClaimed === 0) return "No record";

  return moment.unix(lastClaimed).fromNow();
};

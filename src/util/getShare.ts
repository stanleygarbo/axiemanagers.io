type ShareType = { slp: number | string; converted: number | string };

export const getManagerShare = (
  totalSLP: number | undefined,
  managerShare: number | undefined,
  slpPrice: number | undefined
): ShareType => {
  if (
    totalSLP === undefined ||
    managerShare === undefined ||
    slpPrice === undefined
  )
    return { slp: "---", converted: "---" };

  const share = totalSLP * (managerShare / 100);

  return { slp: Math.floor(share), converted: Math.floor(share * slpPrice) };
};

export const getScholarShare = (
  totalSLP: number | undefined,
  managerShare: number | undefined,
  slpPrice: number | undefined
): ShareType => {
  if (
    totalSLP === undefined ||
    managerShare === undefined ||
    slpPrice === undefined
  )
    return { slp: "---", converted: "---" };

  const share = totalSLP * ((100 - managerShare) / 100);

  return { slp: Math.floor(share), converted: Math.floor(share * slpPrice) };
};

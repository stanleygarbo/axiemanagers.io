export const addCommaToNumber = (x: number | string): string => {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

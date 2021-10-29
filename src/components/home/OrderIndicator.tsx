import React from "react";
import { IOrderIndicator } from "../../interfaces/home/IOrderIndicator";

const OrderIndicator: React.FC<IOrderIndicator> = ({ order }) => {
  const inactiveSortIndicatorStyles = {
    opacity: 0.5,
  };

  const activeSortIndicatorStyles = {
    opacity: 1,
  };

  return (
    <>
      <span
        style={{
          ...(order === "asc"
            ? { ...activeSortIndicatorStyles }
            : {...inactiveSortIndicatorStyles}),
          marginLeft: 10,
        }}
      >
        &#8593;
      </span>
      <span
        style={{
          ...(order === "desc"
            ? { ...activeSortIndicatorStyles }
            : { ...inactiveSortIndicatorStyles }),
        }}
      >
        &#8595;
      </span>
    </>
  );
};

export default OrderIndicator;

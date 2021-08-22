// https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
// --------------------------------- 2nd best answer

import { Scholar } from "../interfaces/IResponseTypes";

export function DynamicSortObject(
  property: any,
  data: { [key: string]: Scholar }
) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a: any, b: any) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      data[a][property] < data[b][property]
        ? -1
        : data[a][property] > data[b][property]
        ? 1
        : 0;
    return result * sortOrder;
  };
}

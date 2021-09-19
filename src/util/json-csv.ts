export const JSONToCSV = (data: {}[]): string => {
  let csv = "";

  // check if array has any items
  if (data.length) {
    /**
     * set a variable to count how many times we've looped through the
     * first object in the array
     */
    let csvTitleIdx = 0;

    /**
     * loop through first object in the array and set the csv column titles to the object names
     * assuming that each objects in the array are identical
     *
     * insert a new line to the end if it's the last column title (last property key of the obj)
     */
    for (const objKey of Object.keys(data[0])) {
      csv += objKey + ",";
      if (Object.keys(data[0]).length - 1 === csvTitleIdx) {
        csv += "\n";
      }
      csvTitleIdx++;
    }

    /**
     * loop through the array and set the csv row values to the object property values
     *
     * insert a new line to the end if it's the last column (last property key of the obj)
     */
    for (const item of data) {
      let idx = 0;
      for (const key of Object.keys(item)) {
        csv += item[key] + ",";

        if (Object.keys(item).length - 1 === idx) {
          csv += "\n";
        }
        idx++;
      }
    }
  }

  return csv;
};

export const CSVToJSON = (allText) => {
  var record_num = 5; // or however many elements there are in each row
  var allTextLines = allText.split(/\r\n|\n/);
  var entries = allTextLines[0].split(",");
  var lines: any = [];

  var headings: string[] = entries.splice(0, record_num);
  while (entries.length > 0) {
    var tarr: any = [];
    for (var j = 0; j < record_num; j++) {
      tarr.push(headings[j] + ":" + entries.shift());
    }
    lines.push(tarr);
  }
  // alert(lines);
};

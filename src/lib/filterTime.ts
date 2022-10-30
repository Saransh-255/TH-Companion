import { formatInTimeZone } from "date-fns-tz";

export default function filterByTime(arr, fromDate, toDate, childName) {
  return arr.filter(item => {
    let itemDate = new Date(
      formatInTimeZone(
        new Date(item[childName]), 
        "America/New_York", 
        "yyyy-MM-dd HH:mm:ss"
      )
    );

    if (fromDate < itemDate && toDate > itemDate) return item;
  });
}
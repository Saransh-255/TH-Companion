import { formatInTimeZone } from "date-fns-tz";

export default function filterByTime(arr, fromDate:Date, toDate:Date) {
  return arr.filter(item => {
    let itemDate = convertToTZ(item["created"], "America/New_York");
    if (fromDate < itemDate && toDate > itemDate) {
      return item;
    }
  });
}

function convertToTZ(date:string, tz:string) {
  return new Date(
    formatInTimeZone(
      new Date(date), 
      tz, 
      "yyyy-MM-dd HH:mm:ss"
    )
  );
}
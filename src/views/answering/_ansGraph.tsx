import React from "react";
import filterByTime from "@lib/filterTime";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { 
  eachDayOfInterval,
  endOfDay,
  sub 
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

export default function AnsGraph({ usersArr }) {
  let now = new Date(formatInTimeZone(new Date(), "America/New_York", "yyyy-MM-dd HH:mm:ss"));
  let intervalArr = eachDayOfInterval({ start: sub(now, { months: 1 }), end: now });
  return (
    <div className="ansGraph">
      <Line 
        data={{
          labels:intervalArr.map(
            date => {
              return String(date).split(" ")[2];
            }
          ),
          datasets: [
            {
              label: "You",
              data: intervalArr.map(
                (day) => {
                  return filterByTime(usersArr, day, endOfDay(day), "created").length;
                } 
              ),
              borderColor: "#014a82",
              backgroundColor: "rgba(255, 99, 132, 0.5)",
              tension: 0.5
            }
          ]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          animation: false
        }}
      />
    </div>
  );
}
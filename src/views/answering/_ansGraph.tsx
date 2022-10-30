import filterByTime from "@lib/filterTime";
import React from "react";
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
import { eachMonthOfInterval, endOfMonth, startOfYear } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

export default function AnsGraph({ usersArr }) { 
  let intervalArr = eachMonthOfInterval({ start: startOfYear(new Date()), end: new Date() });
  return (
    <div className="ansGraph">
      <Line 
        data={{
          labels:intervalArr.map(
            date => {
              return String(date).split(" ")[1];
            }
          ),
          datasets: [
            {
              label: "You",
              data: eachMonthOfInterval({ start: startOfYear(new Date()), end: new Date() }).map(
                (month) => {
                  return filterByTime(usersArr, month, endOfMonth(month), "created").length;
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
          maintainAspectRatio: false
        }}
      />
    </div>
  );
}
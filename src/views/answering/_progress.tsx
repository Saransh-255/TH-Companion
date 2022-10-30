import { Flex, Box, Headline, Text, SeparatorHorizontal, SeparatorVertical } from "brainly-style-guide";
import React from "react";
import { startOfMonth, previousSaturday, startOfQuarter, startOfDay, isSaturday } from "date-fns";
import filterByTime from "@lib/filterTime";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Tooltip
} from "chart.js";
import { formatInTimeZone } from "date-fns-tz";

ChartJS.register(
  ArcElement,
  Tooltip,
  DoughnutController
);

export default function Progress({ allAnswers }) {
  allAnswers = allAnswers.data.responses.items;
  let today = new Date(formatInTimeZone(new Date(), "America/New_York", "yyyy-MM-dd HH:mm:ss"));

  let startSat = isSaturday(today) ? startOfDay(today) : startOfDay(previousSaturday(today));

  let qProgress = filterByTime(allAnswers, startSat , today, "created").length * 10;
  let aCount = filterByTime(allAnswers, new Date(baseDate(2019)), today, "created").length;

  return (
    <Flex 
      className = "progress"
      style = {{ flex: "2" }}
    >
      <Box
        border
        color="transparent"
        padding="m"
      >
        <Flex alignItems="center" justifyContent="space-evenly">
          <Flex className="chart">
            <Doughnut data={{
              labels: ["", ""],
              datasets: [{
                label: "Quota",
                data: [qProgress, qProgress < 100 ? (100 - qProgress) : 0],
                backgroundColor: [
                  qProgress >= 100 ? "#fbbe2e" : "#014a82",
                  qProgress === 0 ? "#c3d1dd" : "#ffffff"
                ],
                borderWidth: 0
              }]
            }} 
            options={{
              responsive: true
            }} 
            id="quota"
            />
            <Text sizes = "m">Quota ({qProgress / 10} / 10)</Text>
          </Flex>

          <SeparatorVertical size="full" />

          <Flex className="chart">
            <Doughnut data={{
              labels: ["2022", "2021", "2020", "2019"],
              datasets: [{
                label: "# of answers",
                data: 
                [2022, 2021, 2020, 2019].map(item => {
                  return (filterByTime(
                    allAnswers, new Date(baseDate(item)), new Date(baseDate(item + 1)), "created"
                  ).length * 100 / aCount);
                }),
                backgroundColor: [
                  "#60d399",
                  "#fbbe2e",
                  "#4fb3f6",
                  "#6d83f3"
                ],
                borderWidth: 1
              }]
            }} 
            options={{
              responsive: true
            }} />
            <Text sizes = "m">History</Text>
          </Flex>

          <SeparatorVertical size="full" />

          <Flex direction="column">
            <StatItem 
              head = {filterByTime(allAnswers, startOfMonth(today), today, "created").length}
              text={"Answers this Month"} 
            />

            <SeparatorHorizontal type="short-spaced" />

            <StatItem 
              head = {filterByTime(allAnswers, startOfQuarter(today), today, "created").length}
              text={"Answers this Quarter"} 
            />
          </Flex>

        </Flex>
      </Box>
    </Flex>
  );
}

function StatItem({ head, text }) {
  return (
    <Flex direction="column" >
      <Headline extraBold size="xxlarge" className="sg-text" >{head}</Headline>
      <Text color="text-gray-60">{text}</Text>
    </Flex>
  );
}
function baseDate(year) {
  return `${year}-01-01T00:00:00-00:00`;
}
//import React from "react";
import { Text, Accordion, AccordionItem, Flex, Headline, Link, Box } from "brainly-style-guide";
import filterByTime from "@lib/filterTime";
import { startOfDay, startOfISOWeek, startOfMonth } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { formatDistance } from "date-fns";

export default function NotificationItem({ notif }) {
  notif = notif.data.items.filter(item => item.text.includes("commented"));
  let date = new Date();
  let now = new Date(formatInTimeZone(date, "America/New_York", "yyyy-MM-dd HH:mm:ss"));

  let thisDay = filterByTime(notif, startOfDay(now), now, "created");
  let thisWeek = filterByTime(notif, startOfISOWeek(now), startOfDay(now), "created");
  let thisMonth = filterByTime(notif, startOfMonth(now), startOfISOWeek(now), "created");
  let allVis = filterByTime(notif, startOfMonth(now), now, "created");

  if (allVis.length) return (
    <Flex
      className = "comments f1"
    >
      <Box
        border
        color="transparent"
        padding="m"
      >
        <Accordion>
          {
            thisDay.length ? <AccordionItem
              id="daily"
              title={`Today (${thisDay.length})`}
            >
              <NotifItem arr = {thisDay}/>
            </AccordionItem> : ""
          }
          {
            thisWeek.length ? <AccordionItem
              id="weekly"
              title={`This Week (${thisWeek.length})`}
            >
              <NotifItem arr = {thisWeek}/>
            </AccordionItem> : ""
          }
          {
            thisMonth.length ? <AccordionItem
              id="monthly"
              title={`This Month (${thisMonth.length})`}
            >
              <NotifItem arr = {thisMonth}/>
            </AccordionItem> : ""
          }
        </Accordion>
      </Box>
    </Flex>
  );
}
function NotifItem({ arr }) {
  return (<Flex style = {{ gap: "0.5rem" }} direction="column">
    {
      distinctIds(arr).map(item => {
        return (
          <Box border color="transparent" padding="s" key = {item[0].id} >
            <Flex alignItems="center" style = {{ gap:"1rem" }}>
              <Headline>{ item.length }</Headline> 
              <Flex wrap = {true} direction = "column" >
                <Text size="small" color="text-gray-50" >
                  thread
                  <Link 
                    hideNewTabIndicator 
                    target="_blank" 
                    href = {`https://brainly.com/question/${item[0].model_id}`}> #{item[0].model_id }
                  </Link>
                </Text>
                <Text color="text-gray-70" style = {{ lineHeight: "1rem" }}>
                  {
                    formatDistance(
                      new Date(new Date(item[0].created).toUTCString()), 
                      new Date(new Date().toUTCString())
                    )
                  }
                </Text>
              </Flex>
            </Flex>
          </Box>
        );
      })
    }
  </Flex>);
}

function distinctIds(arr) {
  let ids = [... new Set(arr.map(x => x.model_id))];
  return ids.map(id => {
    return arr.filter((item) => {
      if (item.model_id === id) return item;
    });
  });
}
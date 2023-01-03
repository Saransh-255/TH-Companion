import React from "react";
import { 
  Text, 
  Accordion, 
  AccordionItem, 
  Flex, 
  Headline, 
  Link, 
  Box, 
  Button, 
  Icon 
} from "brainly-style-guide";
import filterByTime from "@lib/filterTime";
import { startOfDay, startOfISOWeek, startOfMonth, sub } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { formatDistance } from "date-fns";
import showPreview from "@modals/Preview/Preview";

let now = new Date(formatInTimeZone(new Date(), "America/New_York", "yyyy-MM-dd HH:mm:ss"));

export default function NotificationItem({ notif }) {
  notif = notif.data.items.filter(item => item.text.includes("commented"));

  let thisDay = filterByTime(notif, startOfDay(now), now);
  let thisWeek = filterByTime(notif, startOfISOWeek(now), startOfDay(now));
  let thisMonth = filterByTime(notif, startOfMonth(now), startOfISOWeek(now));
  let lastMonth = filterByTime(notif, sub(startOfMonth(now), { months: 1 }), startOfMonth(now));
  let allVis = filterByTime(notif, sub(startOfMonth(now), { months: 1 }), now);

  if (allVis.length) return (
    <Flex
      className = "comments f1"
      style = {{ minWidth:"350px" }}
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
          {
            lastMonth.length ? <AccordionItem
              id="last-month"
              title={`Last Month (${lastMonth.length})`}
            >
              <NotifItem arr = {lastMonth}/>
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
            <Flex alignItems="center">
              <Flex justifyContent="space-between" style={{ width:"100%" }} >
                <Flex style = {{ gap:"1rem" }}>
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
                    <Text size="small" color="text-gray-70" style = {{ lineHeight: "1rem" }}>
                      {
                        formatDistance(
                          new Date(item[0].created), 
                          now,
                          {
                            includeSeconds: true, 
                            addSuffix: true
                          }
                        )
                      }
                    </Text>
                  </Flex>
                </Flex>
                <Button 
                  variant={"transparent"} 
                  icon={
                    <Icon type="seen" title="preview" color="icon-gray-50" size={24} />
                  }
                  size="m"
                  iconOnly
                  onClick={
                    () => {
                      if (!document.querySelector(".loading-ext#prev")) showPreview(item[0].model_id);
                    }
                  }
                />
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
import createPage from "@lib/createPage";
import { Flex } from "brainly-style-guide";
import React from "react";

import { Sidebar } from "components/react/index";
import Content from "./_content";

import { formatInTimeZone } from "date-fns-tz";
import { getActions } from "@brainly/scraped";
import { userActions } from "@typings/scraped";
import { isSaturday, startOfDay, previousSaturday } from "date-fns";
import { makeChunks } from "@lib/arrOps";

let now = new Date(formatInTimeZone(new Date(), "America/New_York", "yyyy-MM-dd HH:mm:ss"));

function ModActions() {
  const [actions, setActions] = React.useState<userActions[]>();
  
  React.useEffect(() => {
    getActions(
      +window.location.href.replace("https://brainly.com/companion/moderator/", "").split("/")[0],
      isSaturday(now) ? startOfDay(now) : startOfDay(previousSaturday(now))
    ).then(data => setActions(makeChunks(data, 12)));
  }, []);

  return (
    <Flex
      direction="row"
      fullHeight
      fullWidth
      htmlTag="div"
    >
      <Sidebar />
      {actions ? <Content actions={actions} /> : ""}
    </Flex>
  );
}

createPage(
  <ModActions />, "Mentee Overview"
);
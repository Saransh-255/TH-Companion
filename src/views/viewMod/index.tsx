import createPage from "@lib/createPage";
import { Flex, Headline, SpinnerContainer } from "brainly-style-guide";
import { useState, useEffect } from "react";

import { Sidebar } from "components/react/index";
import Content from "./_content";

import { Scrape } from "@brainly";
import { userActions } from "@typings/scraped";
import { isSaturday, startOfDay, previousSaturday } from "date-fns";
import { makeChunks } from "@lib/arrOps";

import { getNow } from "@lib/timeFns";

import CompanionAPI from "@api/companion/index";

const thisUser = CompanionAPI.SavedData().user;

if (thisUser.isMentor) createPage(
  <ModActions />, "Mentee Overview"
);

function ModActions() {
  const now = getNow();
  const [actions, setActions] = useState<userActions[]>();
  
  useEffect(() => {
    Scrape.getActions(
      +window.location.href.replace("https://brainly.com/companion/moderator/", "").split("/")[0],
      isSaturday(now) ? startOfDay(now) : startOfDay(previousSaturday(now))
    ).then(data => setActions(makeChunks(data, 12)));
  }, []);

  return (
    <Flex
      direction="row"
      fullHeight
      fullWidth
    >
      <Sidebar />
      {
        actions ? (
          actions.length ? 
            <Content actions={actions} /> : 
            (
              <Flex 
                direction="column" 
                justifyContent="center" 
                alignItems="center"
                style= {{
                  flex: "1",
                  gap: "12px"
                }}
              >
                <img src="https://brainly.com/tools/static/media/surveys.33864b6a.svg" alt="" />
                <Headline
                  extraBold
                  size="large"
                >
                No Actions in Quota Period.
                </Headline>
              </Flex>
            )) : 
          <SpinnerContainer loading />
      }
    </Flex>
  );
}
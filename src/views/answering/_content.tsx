import { useState, useEffect } from "react";
import {
  Box,
  Flex, 
  Link, 
  List, 
  ListItem,
  SeparatorHorizontal,
  SpinnerContainer, 
} from "brainly-style-guide";
import { Legacy } from "@brainly";
import { ContentList, Notifications } from "@typings/brainly";

import Progress from "./_progress";
import AnsGraph from "./_ansGraph";
import NotificationItem from "./_notifications";

import CompanionAPI from "@lib/api/companion";

export default function Content() {
  //const [user, setUser] = React.useState<UserInfo>();
  const [answers, setAnswers] = useState<ContentList>();
  const [notifications, setNotif] = useState<Notifications>();
  const [alinks, setLinks] = useState<unknown>();

  useEffect(() => {
    const getData = async () => {
      await Legacy.GetNotifications().then(notifs => setNotif(notifs));
      await Legacy.GetContent("responses").then(ans => setAnswers(ans));
      await CompanionAPI.Links().then(data => {
        setLinks(data);
        console.log(data);
      });
    };
    getData();
  }, []);

  if (notifications && answers && alinks) {
    const teamLinks = alinks["team"];
    const links = alinks["useful"];
    return (
      <Flex className="content">
        <Flex
          className = "f1"
          direction = "column"
        >
          <Flex
            className = "f1 toprow"
          >
            <Progress allAnswers = {answers} />
          </Flex>
          <Flex
            className = "bottomrow f1"
          >
            <Flex
              className = "links"
            >
              <Box
                border
                color="transparent"
                padding="m"
              >
                <LinkList arr={teamLinks} />
                <SeparatorHorizontal type="short-spaced" />
                <LinkList arr={links} />
              </Box>
            </Flex>
            <NotificationItem notif = {notifications} />
            <Flex
              style = {{ flex : "2" }}
              alignItems= "center"
              justifyContent= "center"
              className="illustration"
            >
              <AnsGraph usersArr = {answers.data.responses.items} />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  } else {
    return <SpinnerContainer loading ></SpinnerContainer>;
  }
}

function LinkList({ arr }) {
  return (
    <List>
      {
        Object.keys(arr).map(key => {
          return (
            <ListItem key = {key}>
              <Link
                hideNewTabIndicator
                href={arr[key]}
                newTabLabel=""
                target="_blank"
              >
                {key}
              </Link>
            </ListItem>
          );
        })
      }
    </List>
  );
}
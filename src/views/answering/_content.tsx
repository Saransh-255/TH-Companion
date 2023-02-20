import React, { useEffect } from "react";
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

export default function Content() {
  //const [user, setUser] = React.useState<UserInfo>();
  const [answers, setAnswers] = React.useState<ContentList>();
  const [notifications, setNotif] = React.useState<Notifications>();

  useEffect(() => {
    const getData = async () => {
      await Legacy.GetNotifications().then(notifs => setNotif(notifs));
      await Legacy.GetContent("responses").then(ans => setAnswers(ans));
    };
    getData();
  }, []);

  const teamLinks = [
    {
      name: "Report a QA User",
      link: "https://forms.gle/6mDdeYeLxHrabFHZ8"
    },
    {
      name: "Request Verification",
      // eslint-disable-next-line max-len
      link: "https://docs.google.com/forms/d/e/1FAIpQLScVcmT45ky6FnymWutuRaDRxyw1pXPG7oOvZTCNc_2daPs_NA/viewform?usp=sf_link"
    },
  ];
  const links = [
    {
      name: "Desmos",
      link: "https://desmos.com"
    },
    {
      name: "Google Sheets",
      link: "https://docs.google.com/spreadsheets/u/0/"
    },
    {
      name: "Triangle Solver",
      link: "https://www.calculator.net/triangle-calculator.html"
    },
    {
      name: "Unicode Characters",
      link: "https://unicode-table.com/en/sets/mathematical-signs/"
    },
    {
      name: "Polynomial Long Division",
      link: "https://www.emathhelp.net/calculators/algebra-1/polynomial-long-division-calculator/"
    },
    {
      name: "Synthetic Division",
      link: "https://www.emathhelp.net/calculators/algebra-1/synthetic-division-calculator/"
    },
    {
      name: "Vector Calculator",
      link: "https://www.mathsisfun.com/algebra/vector-calculator.html"
    }
  ];

  if (notifications && answers) {
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
        arr.map(link => {
          return (
            <ListItem key = {link.name}>
              <Link
                hideNewTabIndicator
                href={link.link}
                newTabLabel=""
                target="_blank"
              >
                {link.name}
              </Link>
            </ListItem>
          );
        })
      }
    </List>
  );
}
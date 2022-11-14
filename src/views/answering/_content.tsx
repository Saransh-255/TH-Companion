import React from "react";
import { 
  Avatar, 
  Box, 
  Counter, 
  Flex, 
  Label, 
  Link, 
  List, 
  ListItem,
  SeparatorHorizontal,
  Text } from "brainly-style-guide";
import BrainlyAPI from "@lib/api/brainly/BrainlyAPI";
import { UserInfo, ContentList, Notifications } from "@typings/brainly";

import Progress from "./_progress";
import AnsGraph from "./_ansGraph";
import NotificationItem from "./_notifications";

export default function Content({ changeLoadState }) {
  const [user, setUser] = React.useState<UserInfo>();
  const [answers, setAnswers] = React.useState<ContentList>();
  const [notifications, setNotif] = React.useState<Notifications>();

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
    }
  ];
  React.useEffect(() => {
    const getData = async () => {
      let you = await BrainlyAPI.MyData();
      setUser(you);
      let notifs = await BrainlyAPI.GetNotifications();
      setNotif(notifs);
      let ans = await BrainlyAPI.GetContent("responses");
      setAnswers(ans);
      changeLoadState(false);
    };
    if (!user) {
      getData();
      setInterval(async() => {
        let you = await BrainlyAPI.MyData();
        setUser(you);
        let notifs = await BrainlyAPI.GetNotifications();
        setNotif(notifs);
        let ans = await BrainlyAPI.GetContent("responses");
        setAnswers(ans);
      }, 15000);
    }
  });
  if (user && answers && notifications) return (
    <Flex className="content">
      <Flex
        className = "f1"
        direction = "column"
      >
        <Flex
          className = "f1 toprow"
        >
          <Flex 
            className = "user-data"
          >
            <Box
              border
              color="transparent"
              padding="m"
            >
              <Flex
                justifyContent="center"
                alignItems="center"
                direction = "column"
                style = {{ gap: "16px" }}
              >
                <Avatar
                  imgSrc= {user.data.user.avatar[100]}
                  link={`https://brainly.com/app/profile/${user.data.user.id}`}
                  size="xl"
                />
                <Flex
                  direction = "column"
                >
                  <Text
                    size="large"
                    weight="bold"
                  >
                    {user.data.user.nick}
                  </Text>
                  <Label
                    color="yellow"
                    type="default"
                    style = {{ marginBottom: "8px" }}
                  >
                    {user.data.user.ranks.names[user.data.user.ranks.names.length - 1]}
                  </Label>
                  <Counter
                    icon="points"
                    size="xs"
                  >
                    {user.data.user.points} pts
                  </Counter>
                </Flex>
              </Flex>
            </Box>
          </Flex>

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
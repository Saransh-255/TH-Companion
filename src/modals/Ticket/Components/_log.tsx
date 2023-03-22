import { useState } from "react";
import { Avatar, Flex, Text, SeparatorHorizontal, Button, Icon } from "brainly-style-guide";
import { GetQuestionLogResponse } from "@typings/brainly";

export default function Log({ data }: { data: GetQuestionLogResponse }) {

  return (
    <Flex direction="column"
    >
      {
        data.data.map((entry, index) => {
          let user = data.users_data.find(({ id }) => id === entry.user_id);
          let owner = data.users_data.find(({ id }) => id === entry.owner_id);

          return (
            <LogItem user={user} entry={entry} index={index} key={index} owner={owner} />
          );
        })
      }
    </Flex>
  );
}

function LogItem({ index, user, entry, owner }) {
  const [expanded, setExpand] = useState(false);
  let secondProf = entry.text.includes("%3$s");
  let contentArr = entry.text.replace("%1$s ", "").split("%3$s");

  return (
    <Flex key={index} direction="column">

      <Flex alignItems="center" style={{ gap: "4px", padding: "8px 12px" }} >
        <Avatar size="xs" imgSrc={user.avatars[64] || null} />
        <Text 
          size="small" 
          className="sg-flex" 
          style={{ alignItems:"baseline", flexWrap:"wrap" }} 
        >
          <UserElem user={user} />

          {contentArr[0]}
          {
            secondProf ? <UserElem user={owner} /> : ""
          }
          {contentArr[1]}
          <Text size="xsmall" color="text-gray-50" as="span" style={{ marginLeft:"4px" }}>
            {entry.time + " " + entry.date}
          </Text>
        </Text>
        {
          entry.descriptions?.[0] ? (
            <Button 
              icon={
                <Icon 
                  color="icon-gray-50"
                  size={16}
                  type={"arrow_" + (expanded ? "up" : "down")}> 
                </Icon>
              }
              iconOnly
              onClick={
                () => {
                  setExpand(!expanded);
                  console.log(expanded);
                }
              }
              variant="transparent"
              size="s"
            />
          ) : ""
        }
      </Flex>
      {
        expanded ? (
          <Flex direction="column" style={{ gap: "4px" }}>
            {
              entry.descriptions.map(element => {
                return (
                  <Text size="small" style={{ margin: "0 12px", marginBottom: "8px" }}>
                    <Text as="span" size="small" weight="bold">{element.subject}: </Text>
                    {element.text}
                  </Text>
                );
              })   
            }
          </Flex>
        ) : ""
      }

      <SeparatorHorizontal />
    </Flex>
  );
}

function UserElem({ user }) {
  return (
    <Text 
      size="small" 
      as="a" 
      weight="bold" 
      style={{ color: user.ranks.color, margin:"0 4px" }}
      href={`https://brainly.com/profile/${user.nick}-${user.id}`}
    >
      {user.nick}
    </Text>
  );
}
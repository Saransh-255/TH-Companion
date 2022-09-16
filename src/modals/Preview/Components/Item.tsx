import React from "react";
import { Avatar, Text, Media, Button, Icon } from "brainly-style-guide";
import Attachments from "./Attachments";
import reportMenu from "@modals/Report/report";

export default function Item({ id, data, users, type }) {
  let user = users.find(({ id }) => id === data.user_id);
  let avatar:string;
  let userId = `https://brainly.com/profile/${user.nick}-${user.id}`;
  let content = data.content;
  try {
    avatar = user.avatar[64];
  } catch (err) {
    avatar = null;
  }

  return (
    <div className = {`item id-${id} ${data.settings.is_marked_abuse ? "reported" : ""}`}>
      <Media
        aside={<Avatar
          imgSrc={avatar}
          link= {userId}
        />}
        contentArray={[
          <Text 
            weight="bold"
          >
            {user.nick}
          </Text>,
                    
          <Text
            style = {{
              color: user.ranks.color,
              fontSize: "1rem",
              lineHeight: "1rem"
            }}
          >
            {user.ranks.names[0]}
          </Text>
        ]}
      />
      <Text className = "content" dangerouslySetInnerHTML={{ __html: content }}/>
      <Attachments attachments = {data.attachments} />
      { <Button
        className = "rep-button"
        icon={<Icon color="adaptive" size={24} type="report_flag_outlined"/>}
        iconOnly
        size="m"
        type="transparent-light"
        onClick = {() => {
          reportMenu(id, type);
        }}
      /> }
    </div>
  );
}
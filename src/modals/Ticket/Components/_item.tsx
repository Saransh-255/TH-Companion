import React from "react";
import { 
  Avatar, 
  Text, 
  Media, 
  Button, 
  Icon, 
  Box, 
  Flex,
  SeparatorHorizontal 
} from "brainly-style-guide";
import Attachments from "./_attachments";
import reportMenu from "@modals/Report/report";
import { format } from "date-fns";
import DelMenu from "./_delMenu";
import CommentItem from "./_comment";

export default function Item({ id, ticket, data, users, type, delArr, changeArr }) {
  const [commentVis, setVis] = React.useState(false);
  const [iconStr, setStr] = React.useState("comment_outlined");
  const [delVis, setDelVis] = React.useState(false);

  const [deleted, setDeleted] = React.useState(false);
  
  let user = userById(users, data.user_id);
  let userId = `https://brainly.com/profile/${user.nick}-${user.id}`;
  let reported = data.report;

  return (
    <Box 
      border 
      className = {
        `sg-flex sg-flex--column item id-${id}` + 
        `${data.report ? "reported" : ""} ` + 
        `${deleted ? "deleted" : ""}`
      }
      padding = "s"
      style = {{ marginBottom: "8px" }}
    >
      <Media
        noPadding
        small
        className = "sg-flex sg-flex--align-items-center"
        aside={
          <Avatar
            imgSrc={user.avatar?.[64] || null}
            link= {userId}
          />}
        contentArray={[
          <Text 
            weight="bold"
          >
            {user.nick}
          </Text>,
            
          <Text
            size="xsmall"
            color="text-gray-50"
            weight="bold"
          >
            {format(new Date(data.created), "dd/MM/yy HH:mm:ss")}
          </Text>
        ]}
      />
      <Text className = "content" dangerouslySetInnerHTML={{ __html: data.content }}/>
      <Attachments attachments = {data.attachments} />
      <Flex
        direction = "row"
        justifyContent="flex-end"
        className="preview-actions"
        style={{ gap:"4px" }}
      >
        <Button
          className="show-delmenu"
          icon={<Icon color="icon-red-50" size={24} type="trash" > </Icon>}
          iconOnly 
          variant="transparent"
          onClick={()=> {
            setDelVis(!delVis); 
          }}       
        />    
        {
          data.comments?.length ? (
            <Button
              className="show-comments"
              icon={<Icon color="adaptive" size={24} type={iconStr} > </Icon>} 
              variant="transparent-light"
              style= {{ padding:"0px 16px" }}
              onClick={()=> {
                setVis(!commentVis);
                setStr(iconStr == "comment_outlined" ? "comment" : "comment_outlined");
              }}       
            >{data.comments?.length}</Button>
          ) : ""
        }
        <Button
          className = "report-button"
          icon={
            reported ?  
              <Icon color="icon-red-50" size={24} type="report_flag"/> :
              <Icon color="adaptive" size={24} type="report_flag_outlined"/>
          }
          iconOnly
          size="m"
          disabled={reported}
          variant="transparent-light"
          onClick = {(e) => {
            reportMenu(id, type, e.target);
          }}
        /> 
        {
          (type === "task") && (
            <Button
              icon={<Icon color="adaptive" type="plus"/>}
              target="_blank"
              disabled={data.responses >= 2}
              onClick={()=> {
                document.querySelector("#modal.preview").remove();
              }}
              type={"button"}
              variant="outline"
              href = {`https://brainly.com/question/${id}?answering=true`}
            >
          Answer
            </Button>
          )
        }
      </Flex>
      {
        delVis && (
          <DelMenu 
            reasons={ticket.data.delete_reasons[type]} 
            id={data.id} 
            type={type} 
            successFn= {
              () => {
                setDeleted(true);
                setDelVis(false);
              }
            }
          />
        )
      }
      {
        commentVis && (
          <Box
            border
            padding="s"
          >
            <Flex direction="column" className="preview-comments">
              {
                data.comments.map(comment => {
                  return (
                    <>
                      <CommentItem
                        delArr={delArr}
                        ticket={ticket}
                        changeArr={changeArr}
                        data={comment}
                        users={users}
                        key={comment.id} />
                      <SeparatorHorizontal />
                    </>
                  );
                })
              }
            </Flex>
          </Box>
        )
      }
    </Box>
  );
}

function userById(arr, user) {
  return arr.find(({ id }) => id === user);
}
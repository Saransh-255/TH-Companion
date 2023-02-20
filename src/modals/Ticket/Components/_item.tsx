import React from "react";
import { 
  Text, 
  Button, 
  Icon, 
  Box, 
  Flex,
  SeparatorHorizontal,
  Label
} from "brainly-style-guide";
import Attachments from "./_attachments";
import reportMenu from "@modals/Report/report";
import DelMenu from "./_delMenu";
import CommentItem from "./_comment";
import { VerifiedHead } from "@reactComponents";
import { Legacy } from "@brainly";
import UserData from "./_userData";

export default function Item(
  { id, ticket, data, users, type, delArr, changeArr, qData }
) {
  const [commentVis, setVis] = React.useState(false);
  const [iconStr, setStr] = React.useState("comment_outlined");
  const [delVis, setDelVis] = React.useState(false);
  const [verified, setVerified] = React.useState(!!qData.approved?.approver);

  const [deleted, setDeleted] = React.useState(false);
  const [report, setReported] = React.useState(false);
  
  let user = userById(users, data.user_id);
  let userId = `https://brainly.com/profile/${user.nick}-${user.id}`;
  let reported = data.report;

  return (
    <Box 
      border 
      className = {
        `sg-flex sg-flex--column item id-${id} ` + 
        `${(reported || report) ? "reported" : ""} ` + 
        `${deleted ? "deleted" : ""} ` + 
        `${verified ? "approved" : ""}`
      }
      padding = "s"
      style = {{ marginBottom: "8px", position: "relative" }}
    >
      {
        (verified) ? (
          <VerifiedHead 
            Approver={users.find(({ id }) => id === (qData.approved?.approver?.id))} />
        ) : ""
      }
      {
        (reported) ? (
          <Label
            color="red"
            type="solid"
            style={{
              position:"absolute",
              top: "12px",
              right: "12px"
            }}
          >
            {data.report.abuse.name}
          </Label>
        ) : ""
      }
      <UserData user={user} userId={userId} data={data} />
      <Text 
        breakWords
        className = "content" 
        dangerouslySetInnerHTML={{ __html: data.content }}/>
      <Attachments attachments = {data.attachments} />

      <Flex
        direction = "row"
        justifyContent="flex-end"
        className="preview-actions"
        style={{ gap:"4px" }}
      >  
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
        {
          (!verified && !deleted) ? (
            <>
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
                type !== "task" ? (
                  <Button
                    className="verify-answer"
                    icon={<Icon color="icon-green-50" size={24} type="verified" > </Icon>} 
                    variant="transparent-light"
                    style= {{ padding:"0px 16px" }}
                    iconOnly
                    onClick={()=> {
                      setVerified(true);
                      Legacy.Approve(data.id);
                    }}       
                  />
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
                  reportMenu(
                    id, 
                    type, 
                    e.target,
                    () => {
                      setReported(true);
                    }
                  );
                }}
              />
            </>
          ) : ""
        }
        {
          (type === "task") && (
            <Button
              icon={<Icon color="adaptive" type="plus"/>}
              target="_blank"
              disabled={data.responses >= 2}
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
                        key={comment.id} 
                      />

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
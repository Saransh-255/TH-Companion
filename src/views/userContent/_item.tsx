import showTicket from "@modals/Ticket/Ticket";
import { ReferenceData, UserData } from "@typings/brainly";
import { 
  Box, 
  Checkbox, 
  Flex, 
  Icon, 
  Label,
  Text 
} from "brainly-style-guide";
import React from "react";

import { findContent } from "./_contentList";

export default function Item(
  { data, dref, dum, setDum, type, delArr, setArr } : 
  {
    data:UserData["content"][0], 
    dref: ReferenceData, 
    dum:boolean, 
    setDum: React.Dispatch<React.SetStateAction<boolean>>, 
    type: string,
    delArr: number[], 
    setArr: React.Dispatch<React.SetStateAction<number[]>>
  }
) {
  const [check, setCheck] = React.useState(false);

  let isComments = type === "comments";

  let userTask = isComments ? data.data.data.task : findContent(data);
  let date = userTask.created.replace("T", " ");

  return (
    <Box 
      border
      className="content-box-comp"
      padding="s"
      style={{ borderColor: check ? "black" : "#e1eaf1" }}
    >
      <Flex justifyContent="space-between" >
        <Flex alignItems="center">
          <Checkbox 
            onChange={({ target }) => {
              let old = ((target as HTMLElement).getAttribute("aria-checked") === "true");
              setCheck(!old);
              if (!old && !isComments) setArr([...delArr, userTask.id]);
            }}
          />
          <Text color="text-gray-50" size="medium">
            {dref.data.subjects.find(({ id }) => id === data.data.data.task.subject_id).name}
          </Text>
        </Flex>
        
        <Flex style={{ gap:"8px" }} >
          {
            ("best" in userTask) ? ( //filter for response type
              userTask.best || userTask.attachments.length ? (
                <Flex alignItems="center" style={{ height: "24px" }} > 
                  {
                    userTask.best ? (
                      <Icon
                        type="crown"
                        color="icon-yellow-50"
                        size={16}
                      ></Icon>
                    ) : ""
                  }
                  {
                    userTask.attachments.length ? (
                      <Icon
                        type="attachment"
                        color="icon-gray-60"
                        size={16}
                      ></Icon>
                    ) : ""
                  }
                </Flex>
              ) : ""
            ) : ""
          }
          {
            ("best" in userTask) ? userTask.approved?.approver ? (
              <Label
                color="green"
                type="solid"
                iconType="verified"
              >
              Verified
              </Label>
            ) : "" : ""
          }
          {
            !isComments ? userTask.settings.is_marked_abuse ? (
              <Label
                color="red"
                type="solid"
                iconType="report_flag"
              >
              Reported
              </Label>
            ) : "" : ""
          }
        </Flex>
      </Flex>
      <Flex 
        justifyContent="space-between"
        alignItems="center"
        style={{
          gap: "8px"
        }}
      >
        <Text 
          dangerouslySetInnerHTML={{ __html: isComments ? data.content : userTask.content }} 
          className="content-text-comp"
          onClick={() => {
            showTicket(
              data.data.data.task.id + "",
              () => setDum(!dum)
            );
          }}
        />
        <Flex   
          direction="column" 
          alignItems="flex-end"
          style={{
            height: "max-content"
          }}
        >
          <Text
            color="text-gray-50"
            size="small"
            style={{
              flex: "1"
            }}
          >
            {date.split(" ")[0]}
          </Text>
          <Text
            color="text-gray-60"
            size="small"
            weight="bold"
            style={{
              flex: "1"
            }}
          >
            {date.split(" ")[1].split("-")[0]}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
}
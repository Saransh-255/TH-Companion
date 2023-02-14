import { Flex, Checkbox, Avatar, Button, Icon, Text } from "brainly-style-guide";
import React from "react";
import DelMenu from "./_delMenu";

export default function CommentItem({ data, ticket, users, delArr, changeArr }) {
  let user = userById(users, data.user_id);
  const [comDeleted, setDeleted] = React.useState(false);
  const [commentDel, setComDel] = React.useState(false);
  const [cmtRemoved, setRemoved] = React.useState(data.deleted);

  return (
    <Flex direction="column" >
      <Flex
        className={`comment-item ${ cmtRemoved ? "deleted" : "" }`}
        style={{ gap:"8px" }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex direction="column">

          <Flex className="comment-container" style={{ gap:"8px" }}>
            <Checkbox 
              className={(data.deleted || comDeleted) ? "sg-checkbox--disabled" : ""}
              id={"checkbox" + data.id}
              defaultChecked={delArr.includes("checkbox" + data.id)}
              onClick = {
                ({ target }) => {
                  let elem = target as HTMLInputElement;
                  if (elem.checked && !delArr.includes(elem.id)) {
                    changeArr([
                      ...delArr,
                      elem.id
                    ]);
                  } else {
                    changeArr(
                      delArr.filter(item => item !== elem.id)
                    );
                  }
                }
              }
            />
            <Avatar
              imgSrc={user.avatar?.[64] || null}
              link={`https://brainly.com/app/profile/${user.id}`}
              target="_blank"
              size="s"
            />
            <Flex direction="column" style={{ flex: "1" }} >
              <Text size="medium" weight="bold">{user.nick}</Text>
              <Text
                style={{ flex: "1" }} 
                size="small" 
                dangerouslySetInnerHTML={{ __html: data.content }} 
                breakWords
              />
            </Flex>
          </Flex>
        </Flex>
        {
          !comDeleted ? (
            <Button
              className="show-delmenu"
              id={"delcmt" + data.id}
              icon={<Icon color="icon-red-50" size={24} type="trash" > </Icon>}
              iconOnly 
              variant="transparent"
              onClick={()=> {
                setComDel(!commentDel);
              }}       
            />
          ) : ""
        }
      </Flex>
      {
        commentDel && (
          <DelMenu 
            reasons={ticket.data.delete_reasons["comment"]} 
            id={data.id} 
            type={"comment"} 
            successFn= {
              () => {
                setRemoved(true);
                setDeleted(true);
                setComDel(false);
              }
            }
          />
        )
      }
    </Flex>
  );
}

function userById(arr, user) {
  return arr.find(({ id }) => id === user);
}
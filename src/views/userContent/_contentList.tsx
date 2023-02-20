import React from "react";
import Item from "./_item";
import { UserData } from "@typings/brainly";
import { Box, Flex, Headline, SpinnerContainer } from "brainly-style-guide";
import { Scrape } from "@brainly";

export default function ContentList({ userId, dref, type, page, setLast, setLoad }) {
  const [dum, setDum] = React.useState(false);

  const [uData, setData] = React.useState<UserData>();

  const [delArr, setArr] = React.useState<number[]>([]);

  React.useEffect(() => {
    const UserInfo = async () => {
      setLoad(true);
      await Scrape.getUserContent(userId, type, 30, page).then(data => {
        setData(data);
        setLast(data.lastPage);
      });
      setLoad(false);
    };
    UserInfo();
  }, [dum, type, page]);

  if (uData?.nick) {
    if (uData.content.length) {
      return <>
        <Box
          className="scroll-container"
          padding="xs"
          style={{
            height: "100%"
          }}
        >
          <Flex
            direction="column"
            style={{ 
              gap:"0.5rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(335px, 1fr))"
            }}
          >
            {
              uData.content.map((item, index) => {
                return (
                  <Item 
                    key={index} 
                    data={item}
                    dref={dref} 
                    dum={dum}
                    setDum={setDum}
                    type={type}
                    delArr={delArr}
                    setArr={setArr}
                  />
                );
              })
            }
          </Flex>
        </Box>
        {
          (delArr.length) ? (
            <Box className="action-menu-comp">
              {delArr.length} Selected
            </Box>
          ) : ""
        }
      </>
      ;
    } else {
      setLast(true);
      return (
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
          No Content
          </Headline>
        </Flex>
      );
    }
  } else {
    return <SpinnerContainer loading />;
  }
}

export function findContent(item:UserData["content"][0]) {
  let id = +window.location.href.replace("https://brainly.com/companion/user/", "").split("/")[0];
  return item.data.data.responses.find(
    ({ user_id }) => user_id === +id
  ) ?? item.data.data.task;
}
import { NavMenu } from "@reactComponents";
import { Avatar, Flex, Headline, Select, Box, SpinnerContainer } from "brainly-style-guide";
import React from "react";

type typeQuery = "solved" | "submitted" | "comments";

export default function Head({ user, setPage, page, setType, type, isLast, load }) {
  const selectRef = React.createRef<HTMLSelectElement>();
  return (
    <Box
      padding="xs"
    >
      <Flex justifyContent="space-between" alignItems="center">

        <Flex style={{ gap:"8px" }}>
          <SpinnerContainer loading={load} size="xsmall">
            <Avatar imgSrc={user.avatar === "https://brainly.com/img/" ? null : user.avatar} size="s" />
          </SpinnerContainer>
    
          <Flex direction="column">
            <Headline size="large">{user.nick}</Headline>
          </Flex>
        </Flex>

        <Flex
          style={{
            gap: "8px"
          }}
        >
          <NavMenu 
            black={false} 
            final={isLast} 
            page={page} 
            setPage={setPage} 
            length={-1}
          />
          <Select 
            ref={selectRef}
            value={type}
            options={[
              {
                value:"solved",
                text:"Answers"
              },
              {
                value:"submitted",
                text:"Questions"
              },
              {
                value:"comments",
                text:"Comments"
              }
            ]}
            onChange={() => {
              setType(selectRef.current.value as typeQuery);
              setPage(1);
            }}
          />
        </Flex>
          
      </Flex>
    </Box>
  );
}
import shortDelRsn from "@lib/shortDelRsn";
import { userActions } from "@typings/scraped";
import { Flex, Box, Link, Icon, Label, Text } from "brainly-style-guide";
import { NavMenu } from "@reactComponents";
import { useState } from "react";
import showPreview from "@modals/Preview/Preview";

export default function Content(
  { actions } : { actions: userActions[] }
) {
  const [page, setPage] = useState(1);
  const TYPE_COLORS = {
    answer: "#6d83f3",
    question: "#323c45",
    comment: "#c98600"
  };

  return (
    <>
      {
        actions.length > 1 && 
          <NavMenu 
            final = {false} 
            page={page} 
            setPage={setPage} 
            length={actions.length} 
            black={true}
          />
      }
      <Flex
        wrap
        direction="row"
        style={{
          gap: "8px",
          padding: "12px",
          overflow: "auto",
          flex: "1",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(375px, 49%))"
        }}
        className="scroll-container"
      >
        {actions[page - 1].map((action, index) => {
          return (
            <Box
              border
              key={index}
              style={{ flex: "1", minWidth: "375px", height: "250px" }}
              className={"action-item"}
            >
              <Flex direction="column" style={{ gap: "8px", height: "100%" }}>
                <Flex justifyContent="space-between">
                  <Flex alignItems="center" style={{ gap: "4px" }}>
                    <Link
                      href={`https://brainly.com/question/${action.id}`}
                      target="_blank"
                      hideNewTabIndicator
                    >
                      <Icon
                        type={action.type}
                        size={24}
                        style={{ fill: TYPE_COLORS[action.type] }} />
                    </Link>
                    <Text
                      size="medium"
                      weight="bold"
                    >
                      {action.user}
                    </Text>
                  </Flex>

                  <Label
                    color={action.accepted ? "green" : "yellow"}
                    type="solid"
                    title={action.reason}
                  >
                    {action.reason?.length ?
                      shortDelRsn(action.reason) : action.accepted ?
                        "Confirmed" : "Not Provided"}
                  </Label>
                </Flex>

                <Text 
                  className="scroll-container action-content" 
                  breakWords
                  style={{ overflow: "auto", overflowX: "hidden", cursor: "pointer" }}
                  onClick={
                    () => {
                      showPreview(action.id);
                    }
                  }
                >
                  {action.content}
                </Text>
              </Flex>
            </Box>
          );
        })}
      </Flex>
    </>
  );
}
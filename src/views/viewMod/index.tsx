import createPage from "@lib/createPage";
import { Box, Flex, Icon, Text, Label, Link } from "brainly-style-guide";
import React from "react";
import { Sidebar } from "components/react/index";
import { sub } from "date-fns";
import { getActions } from "@brainly/scraped";
import { userActions } from "@typings/scraped";

function ModActions() {
  const [actions, setActions] = React.useState<userActions>();

  React.useEffect(() => {
    getActions(
      +window.location.href.replace("https://brainly.com/companion/moderator/", "").split("/")[0], 
      sub(new Date(), { days: 12 })
    ).then(data => setActions(data));
  });

  if (actions) return (
    <Flex
      direction="row"
      fullHeight
      fullWidth
      htmlTag="div"
    >
      <Sidebar />
      <Content actions={actions} />
    </Flex>
  );
}

function Content({ actions } : { actions: userActions }) {
  const TYPE_COLORS = {
    answer: "#6d83f3",
    question: "#323c45",
    comment: "#c98600"
  };
  console.log(actions);

  return (
    <Flex 
      wrap 
      direction="row" 
      style={{ 
        gap:"4px", 
        padding: "12px", 
        overflow: "auto", 
        overflowX: "hidden" 
      }}
      className="scroll-container"
    >
      {
        actions.map((action, index) => {
        //console.log(action, Array.isArray(action));
          //if (!Array.isArray(action)) return;
          return (
            <Box 
              border 
              key={index}
              style ={{ flex: "1", minWidth: "350px", maxHeight: "250px" }}
            > 
              <Flex direction="column" style = {{ gap: "8px", height: "100%" }}>
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
                        style={{ fill: TYPE_COLORS[action.type] }}
                      />
                    </Link>
                    <Text size="medium" weight="bold">{action.user}</Text>
                  </Flex>

                  <Label
                    color={action.accepted ? "green" : "yellow"}
                    type="solid"
                    title={action.reason}
                  >
                    {
                      action.reason?.length ? 
                        getRsn(action.reason) : action.accepted ? 
                          "Confirmed" : "Not Provided"
                    }
                  </Label>
                </Flex>
                 
                <Text className="scroll-container" style = {{ overflow: "auto", overflowX: "hidden" }}>
                  {action.content}
                </Text>
              </Flex>
            </Box>
          );
        })
      }
    </Flex>
  );
}

createPage(
  <ModActions />, "Mentee Overview"
);

function getRsn(reason) {
  const MATCHES = [
    {
      short: "External Link",
      keys: ["link to a website other than Brainly"]
    },
    {
      short: "SPAM",
      keys: ["content such as advertisements, meeting codes", "unhelpful"]
    },
    {
      short: "Miscellaneous",
      keys: ["violates Brainly's Terms of Use"]
    },
    {
      short: "Incorrect",
      keys: ["mistakes"]
    },
    {
      short: "Personal Information",
      keys: ["personal info", "social media"]
    },
    {
      short: "Harmful",
      keys: ["hate speech, profanity, sexual content, threats, and/or bullying"]
    },
    {
      short: "Cheating",
      keys: ["online calculators or translation software"]
    },
    {
      short: "Plagiarism",
      keys: ["presenting it as content written by you"]
    },
    {
      short: "IDK Answer",
      keys: ["you're not sure how to answer their question"]
    },
    {
      short: "Nonsense",
      keys: ["gibberish-like", "unclear or does not answer the question being asked."]
    },
    {
      short: "Off-topic",
      keys: ["non-educational, off-topic conversations", "not relevant to the question asked."]
    },
    {
      short: "Low Effort",
      keys: ["hard to comprehend", "missing some important steps.", "it was incomplete"]
    },
    {
      short: "Wrong Context",
      keys: ["in the wrong spot!"]
    },
    {
      short: "Wrong Language",
      keys: ["in a different language", "in a language other than English"]
    },
    {
      short: "Inappropriate",
      keys: ["zero-tolerance policy for inappropriate subjects"]
    },
    {
      short: "Question about question",
      keys: [`use the "Ask for Details" button`]
    },
    //question reasons
    {
      short: "Too Trivial",
      keys: ["a bit too simple"]
    },
    {
      short: "Too General",
      keys: ["a bit too vague"]
    },
    {
      short: "NASP",
      keys: ["not part of an academic assignment."]
    },
    {
      short: "Exam",
      keys: ["academic dishonesty"]
    },
    {
      short: "Default",
      keys: ["Guidelines, so we had to take it down."]
    },
    {
      short: "Brainly-related",
      keys: ["how to use Brainly!"]
    },
    {
      short: "Incomplete",
      keys: ["missing some crucial information."]
    },
    {
      short: "Too Complex",
      keys: ["it was too complex."]
    },
    {
      short: "Unclear",
      keys: ["unclear or a bit confusing."]
    },
    //comment reasons
    {
      short: "Misleading",
      keys: ["confusing or incorrect information."]
    },
    {
      short: "Answer in Comments",
      keys: ["answer as a comment."]
    },
    {
      short: "Question in Comments",
      keys: ["question as a comment."]
    },
    {
      short: "MD",
      keys: ["Deleting all comments", "Deleting all reported comments"]
    },
  ];
  let val = "";
  MATCHES.forEach(match => {
    match.keys.forEach(key => {
      if (reason.includes(key)) val = match.short;
    });
  });

  return val;
}
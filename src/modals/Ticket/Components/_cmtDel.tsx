import BrainlyAPI from "@lib/api/brainly/BrainlyAPI";
import { SpinnerContainer, Flex, Button, Icon, Text } from "brainly-style-guide";

export default function CmtDel({ delLoading, delArr, setLoading, ticket, addComment }) {
  return (
    <SpinnerContainer
      loading={delLoading}
      color="white"
    >
      <Flex className="comment-removal" alignItems="center" justifyContent="space-around" >
        <Text
          color="text-white"
          weight="bold"
        >
          {delArr.length} Comment{delArr.length > 1 ? "s" : ""} Selected
        </Text>
        <Flex>
          <Button 
            iconOnly
            icon = {
              <Icon type="trash" color="icon-white" ></Icon>
            }
            onClick={
              () => {
                setLoading(!delLoading);
                delArr.forEach(async (comment) => {
                  await BrainlyAPI.DeleteContent({
                    type: "comment",
                    id: comment.replace("checkbox", ""),
                    reasonId: "35",
                    reason: ticket.data.delete_reasons.comment[2].subcategories[0].text,
                    warn: false,
                  });
                  document.querySelector(`#${comment}`)
                    .classList.add("sg-checkbox--disabled");
                  document.querySelector(`#delcmt${comment}`).remove();
                });
                addComment([]);
              }
            }
          />
        </Flex>
      </Flex>
    </SpinnerContainer>
  );
}
import { useState } from "react";
import createModal from "@lib/createModal";
import { 
  Flex, 
  Headline, 
  Radio, 
  RadioGroup, 
  Textarea, 
  SeparatorVertical, 
  Button,
  Text
} from "brainly-style-guide";
import CompanionAPI from "@api/companion/index";
import { Legacy } from "@lib/api/brainly";
import getId from "@lib/getId";
import { makeChunks } from "@lib/arrOps";

export default async function MassMsg() {
  const templates = await CompanionAPI.MsgTemplates(); 
  createModal({
    className: "comp-et-msg",
    minWidth: "600px",
    maxWidth: "600px",
    element: <MessageModal templates={templates} />
  });
}

function MessageModal({ templates }) {
  const [ids, setIds] = useState([]);
  const [links, setLinks] = useState("");

  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Headline
        align="to-left"
        color="text-black"
        extraBold
        size="large"
      >
        Message Users
      </Headline>

      <Flex
        className="et-msg-main"
      >
        <Flex
          direction="column"
          style={{
            gap:"8px"
          }}
        >
          <Textarea
            color="default"
            errorMessage=""
            fullWidth
            placeholder="Profile Links (csv)"
            value={links}
            onChange={({ target }) => {
              let profStr = (target as HTMLInputElement).value;
              setLinks(profStr);
              setIds([]);

              profStr.split(",").forEach(link => {
                let id = getId(link.trim(), "profile");
                if (id) (!ids.includes(id)) ? setIds([...ids, id]) : setIds(ids);
              });
            }}
          />
          {
            ids.length > 0 ? <Text weight="bold">{ids.length} user{ids.length > 1 ? "s" : ""}</Text> : ""
          }
        </Flex>
        <SeparatorVertical 
          size="full"
        />
        <Flex 
          direction="column"
          className="et-msg-input"
        >
          <RadioGroup
            direction="row"
            onChange={({ target }) => {
              let val = (target as HTMLInputElement).value;
              setReason(templates[val]);
            }}
          > 
            {
              Object.keys(templates).map(key => {
                return (
                  <Radio
                    value={key}
                    key={key}
                  >
                    {key}
                  </Radio>
                );
              })
            }
          </RadioGroup>
          <Textarea
            color="default"
            errorMessage=""
            fullWidth
            placeholder="Message Content"
            value={reason}
            onChange={({ target }) => {
              setReason((target as HTMLInputElement).value);
            }}
          />
          <Button
            loading={loading}
            onClick={
              () => {
                setLoading(true);
                makeChunks(ids, 10).forEach(async chunk => {
                  await Promise.all(
                    chunk.map(async id => {
                      await Legacy.SendMessage(id, reason);
                    })
                  );
                });
                setLoading(false);
                setLinks(""); setIds([]);
              }
            }
          >
            Send
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
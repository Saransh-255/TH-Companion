import { Legacy } from "@brainly";
import { 
  Radio, 
  RadioGroup, 
  Textarea, 
  Text, 
  Flex, 
  SeparatorHorizontal,
  Checkbox,
  Button
} from "brainly-style-guide";
import { useState } from "react";

export default function DelMenu({ reasons, id, type, successFn }) {
  const [cat, setCat] = useState("");
  const [take, setTake] = useState(false);
  const [returnPts, setReturn] = useState(true);
  const [warn, setWarn] = useState(true);

  let activeRsn = reasons.find(({ id }) => id + "" === cat + "") || null;
  const [subcat, setSub] = useState(null);

  const [rsnTxt, setTxt] = useState("");

  return (<>
    <RadioGroup 
      direction="row"
      name={"categories" + id}
      value={cat}
      onChange={
        ({ target }) => setCat((target as HTMLInputElement).value)
      }
    >
      <Flex wrap>
        {
          reasons.map((reason) => {
            return (
              <Radio labelSize="small" key={reason.id} value={reason.id + ""}>
                <Text weight="bold" style={{ width: "max-content" }} breakWords size="small">
                  {reason.text}
                </Text>
              </Radio>
            );
          })
        }
      </Flex>
    </RadioGroup>

    <SeparatorHorizontal />

    <RadioGroup 
      direction="row"
      name={"subcat" + id} 
      onChange={
        ({ target }) => {
          let subId = (target as HTMLInputElement).value;
          setSub(subId);
          setTxt(activeRsn?.subcategories.find(({ id }) => id + "" === subId + "").text);
        }
      }
      value={subcat}
    >
      <Flex wrap>
        {
          activeRsn?.subcategories.map((subCategory) => {
            return (
              <Radio labelSize="small" key={subCategory.id} value={subCategory.id + ""}>
                <Text weight="bold" style={{ width: "max-content" }} breakWords={false} size="small">
                  {subCategory.title}
                </Text>
              </Radio>
            );
          })
        }
      </Flex>
    </RadioGroup>
    <Textarea
      fullWidth
      placeholder="Reason"
      onChange={
        ({ target }) => {
          setTxt((target as HTMLInputElement).value);
        }
      }
      value={rsnTxt}
    />
    <Flex justifyContent="space-between" >
      <Flex wrap >
        {
          (type !== "comment") && (
            <CheckBoxTicket
              text="take points"
              fn={setTake}
            />
          )
        }
        {
          (type === "task") && (
            <CheckBoxTicket
              text="take answerers' points"
              fn={setReturn}
            />
          )
        }
        <CheckBoxTicket
          text="warn user"
          fn={setWarn}
        />
      </Flex>
      <Button
        type={"button"}
        variant="outline"
        onClick = {
          async () => {
            await Legacy.DeleteContent({
              type: type,
              id: id,
              reasonId: cat,
              reason: rsnTxt,
              warn: warn,
              take_point: take,
              return_point: returnPts
            });
            successFn();
          }
        }
      >
        confirm
      </Button>
    </Flex>
  </>
  );
}

function CheckBoxTicket({ text, fn }) {
  return (
    <Checkbox
      name={text}
      onChange={
        ({ target }) => {
          let elem = target as HTMLInputElement;
          fn(elem.checked);
        }
      }
    >
      <Text weight="bold" style={{ width: "max-content" }} breakWords={false} size="small">
        {text}
      </Text>
    </Checkbox>
  );
}
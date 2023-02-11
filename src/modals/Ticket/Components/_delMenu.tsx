import BrainlyAPI from "@lib/api/brainly/BrainlyAPI";
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
import React from "react";

export default function DelMenu({ reasons, id, type, successFn }) {
  const [cat, setCat] = React.useState("");
  const [take, setTake] = React.useState(false);
  const [returnPts, setReturn] = React.useState(true);
  const [warn, setWarn] = React.useState(true);

  let activeRsn = reasons.find(({ id }) => id + "" === cat + "") || null;
  const [subcat, setSub] = React.useState(null);

  const [rsnTxt, setTxt] = React.useState("");

  return (<>
    <RadioGroup 
      direction="row"
      name={"categories" + id}
      value={cat}
      onChange={({ target }) => {
        setCat((target as HTMLInputElement).value);
      } }
    >
      <Flex wrap>
        {
          reasons.map((reason) => {
            return (
              <Radio labelSize="small" key={reason.id} value={reason.id}>
                <Text weight="bold" style={{ width: "max-content" }} breakWords={false} size="small">
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
              <Radio labelSize="small" key={subCategory.id} value={subCategory.id}>
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
            await BrainlyAPI.DeleteContent({
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
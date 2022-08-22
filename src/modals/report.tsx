// eslint-disable-next-line @typescript-eslint/no-unused-vars
import react from "react";
import createModal from "@lib/createModal";
import { Text, RadioGroup, Radio, Button } from "brainly-style-guide";
import BrainlyAPI from "@api/brainly/BrainlyAPI";


export default async function reportMenu(
  id:number,
  type: "task" | "response"
) {
  let reasons = await BrainlyAPI.ReportReasons(id, type);
  createModal(
    <>
      <Text
        color="text-black"
        size="large"
        weight="bold"
      >
      Report Content
      </Text>
      <RadioGroup 
        name = "report-menu"
        className = "reportRadiogrp" 
        onChange={(e) => {
          let eventTarget = e.target as HTMLElement;
          console.log(reasons.data[+eventTarget.getAttribute("value")]);
        }} >
        {
          reasons.data.map((item, index) => {
            return <Radio key = {item.id} value = {index + ""}>{item.text}</Radio>;
          })
        }
      </RadioGroup>
      <Button size="m" type={"solid"}>report</Button>
    </>
  );
}
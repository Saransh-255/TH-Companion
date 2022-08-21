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
        onChange={() => {
          console.log(document.querySelector(".reportRadiogrp input:checked"));
        }} >
        {
          reasons.data.map((item, index) => {
            return <Radio key = {item.id} value = {String(index)}>{item.text}</Radio>;
          })
        }
      </RadioGroup>
      <Button size="m" type={"solid"}>report</Button>
    </>
  );
}
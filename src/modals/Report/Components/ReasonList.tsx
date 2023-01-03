import BrainlyAPI from "@lib/api/brainly/BrainlyAPI";
import { RadioGroup, Button, Flex, Radio, Textarea } from "brainly-style-guide";
import React, { useState } from "react";
import { ReportData } from "@typings/brainly";
import Subcategories from "./Subcategory";

export default function ReportReasons(props: { reasons:ReportData, id, type, target }) {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState(0);
  const [repData, setRepData] = useState("");
  return (
    <RadioGroup 
      name ="report-menu"
      className ="reportRadiogrp sg-flex"
      onChange={(e) => {
        let eventTarget = e.target as HTMLInputElement;

        let reason = props.reasons.data.find((item) => {
          if (item.id === +eventTarget.id) return item;
        });

        setCategory(reason.id + "");
        setSubcategory(reason.subcategories?.[0].id ?? null);
      }} >
      {
        props.reasons.data.map((reason) => {
          return (
            <Flex 
              direction = "column"
              key = {reason.id}
              className = {reason.id === +category ? "select" : ""}
            >
              <Radio
                labelSize = "small"
                id = {reason.id + ""}
                key = {reason.id}
              >
                {reason.text}
              </Radio>
              {
                reason.data?.type === "textarea" && (
                  <Textarea
                    type="text" 
                    className = "reportData" 
                    
                    onChange = { ({ target }) => setRepData((target as HTMLInputElement).value) }
                    value = { repData } 
                  />
                )
              }
              {
                reason.subcategories &&
                  <Subcategories 
                    reason={reason} 
                    subcategory={subcategory} 
                    setSubcategory={setSubcategory} 
                    repData = {repData}
                    setRep = {setRepData}
                  />
              }
            </Flex>
          );
        })
      }
      <Button 
        size="m" 
        variant={"solid"}
        onClick = {
          () => {
            let res = BrainlyAPI.ReportContent({
              id: props.id,
              type: props.type,
              categoryId: +category,
              subId: subcategory || null,
              data: repData || null
            });
            if (res) {
              props.target.style.color = "red";
              if (!props.target.querySelector("use")) {
                props.target.setAttribute("xlink:href", "#icon-report_flag");
              } else {
                props.target.querySelector("use").setAttribute("xlink:href", "#icon-report_flag");
              }

              props.target.closest(".sg-button").classList.add("sg-button--disabled");
              props.target.closest(".sg-button").setAttribute("disabled", "true");
            }
            document.querySelector(".report#modal").remove();
          }
        }
      >
        report
      </Button>
    </RadioGroup>
  );
}
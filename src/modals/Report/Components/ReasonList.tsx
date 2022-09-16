import BrainlyAPI from "@lib/api/brainly/BrainlyAPI";
import { RadioGroup, Button, Flex, Radio } from "brainly-style-guide";
import React, { useState } from "react";
import { ReportData } from "@typings/brainly";
import Subcategories from "./Subcategory";

export default function ReportReasons(props: { reasons:ReportData, id, type }) {
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState(0);
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
                reason.subcategories ? 
                  <Subcategories 
                    reason={reason} 
                    subcategory={subcategory} 
                    setSubcategory={setSubcategory} 
                  /> : ""
              }
            </Flex>
          );
        })
      }
      <Button 
        size="m" 
        type={"solid"}
        onClick = {
          () => {
            BrainlyAPI.ReportContent({
              id: props.id,
              type: props.type,
              categoryId: +category,
              subId: subcategory ? subcategory : null
            });
          }
        }
      >
        report
      </Button>
    </RadioGroup>
  );
}
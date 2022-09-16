import { Input, Select, Textarea } from "brainly-style-guide";
import React from "react";

export default function Subcategories(
  { reason, subcategory, setSubcategory }
) {
  return (
    <>
      <Select
        onChange={
          (e) => {
            let eventTarget = e.target as HTMLInputElement;
            setSubcategory(+eventTarget.value);
          }
        }
        options = {
          reason.subcategories.map(item => {
            return {
              text: item.text,
              value: item.id + ""
            };
          })
        }
      />
      {
        reason.subcategories.find(
          (subcat) => {
            if (subcat.id === subcategory) return subcat; 
          })?.data?.type === "text" ? 
          <Input
            type="text"
          /> : ""
      }
      {
        reason.subcategories.find(
          (subcat) => {
            if (subcat.id === subcategory) return subcat; 
          })?.data?.type === "textarea" ?
          <Textarea
            type="text"
          /> : ""
      }
    </>
  );
}
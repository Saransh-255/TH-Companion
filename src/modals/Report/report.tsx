import React from "react";
import createModal from "@lib/createModal";
import { Headline } from "brainly-style-guide";
import BrainlyAPI from "@api/brainly/BrainlyAPI";
import ReportReasons from "./Components/ReasonList";

export default async function reportMenu(
  id:number,
  type: "task" | "response"
) {
  let reasons = await BrainlyAPI.ReportReasons(id, type);
  createModal(
    <>
      <Headline
        color="text-black"
        size="medium"
        extraBold
      >
      Report Content
      </Headline>

      <ReportReasons reasons={reasons} id={id} type={type} key={id} />
    </>,
    "500px");
}
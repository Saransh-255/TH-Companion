import React from "react";
import createModal from "@lib/createModal";
import { Headline } from "brainly-style-guide";
import BrainlyAPI from "@api/brainly/BrainlyAPI";
import ReportReasons from "./Components/ReasonList";
import showLoading from "@lib/showLoading";

export default async function reportMenu(
  id:number,
  type: "task" | "response" | "comments",
  target
) {
  if (document.querySelector(".loading-ext#report")) return;
  let reasons;
  await showLoading("Fetching Report Reasons", "report", async () => {
    reasons = await BrainlyAPI.ReportReasons(id, type);
  });
  createModal(
    <>
      <Headline
        color="text-black"
        size="medium"
        extraBold
      >
      Report Content
      </Headline>

      <ReportReasons target={target} reasons={reasons} id={id} type={type} key={id}/>
    </>, "report", "500px");
}
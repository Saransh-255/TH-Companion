import createPage from "@lib/createPage";
import { Flex } from "brainly-style-guide";
import React from "react";
import Sidebar from "./_sidebar";
import Content from "./_content";

function AnsweringDashboard() {

  return (
    <Flex
      direction="row"
      fullHeight
      fullWidth
      htmlTag="div"
    >
      <Sidebar />

      <Content />
      
    </Flex>
  );
}

createPage(
  <AnsweringDashboard />, "Dashboard"
);
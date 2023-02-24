import createPage from "@lib/createPage";
import { Flex } from "brainly-style-guide";
import React from "react";
import Sidebar from "../../components/react/_sidebar";
import Content from "./_content";

import CompanionAPI from "@api/companion/index";

const thisUser = CompanionAPI.SavedData();

if (thisUser.isAnswerer || thisUser.isAdmin) createPage(
  <AnsweringDashboard />, "Dashboard"
);

function AnsweringDashboard() {
  return (
    <Flex
      direction="row"
      fullHeight
      fullWidth
    >
      <Sidebar />
      <Content />
    </Flex>
  );
}
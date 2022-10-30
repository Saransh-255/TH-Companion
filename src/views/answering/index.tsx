import createPage from "@lib/createPage";
import { Flex, SpinnerContainer } from "brainly-style-guide";
import React from "react";
import Sidebar from "./_sidebar";
import Content from "./_content";

function AnsweringDashboard() {
  const [loading, setLoading] = React.useState(true);

  return (
    <Flex
      direction="row"
      fullHeight
      fullWidth
      htmlTag="div"
    >
      <Sidebar />

      <SpinnerContainer loading = {loading} >
        <Content changeLoadState = {setLoading} />
      </SpinnerContainer>
      
    </Flex>
  );
}

createPage(
  <AnsweringDashboard />, "Dashboard"
);
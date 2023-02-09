import { Flex, Logo } from "brainly-style-guide";
import React from "react";

export default function () {
  return (
    <Flex 
      className = "sidebar"
      justifyContent="center"
    >
      <a href="https://brainly.com">
        <Logo type="brainly-mobile" />
      </a>
    </Flex>
  );
}
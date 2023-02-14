import { Flex, Button, Icon, Text } from "brainly-style-guide";
import React, { Dispatch } from "react";

export default function NavMenu({ page, setPage, length }) {
  return (
    <Flex className="nav-menu">
      <NavBut page={page} setPage={setPage} len={length} pos="left" />

      <Text>{page + " / " + (length)}</Text>

      <NavBut page={page} setPage={setPage} len={length} pos="right" />
    </Flex>
  );
}

function NavBut(
  { page, setPage, pos, len } : 
  { page: number, setPage: Dispatch<React.SetStateAction<number>>, pos: "left" | "right", len:number }) {
  return (
    <Button
      variant="transparent"
      size="m"
      disabled={
        (pos === "left" && page === 1) || (pos === "right" && page === (len)) 
      }
      icon={
        <Icon
          type={`arrow_${pos}`}
          size={24}
          color="icon-white"
        />
      }
      iconOnly
      aria-label="arrow"
      onClick={
        () => setPage(pos === "left" ? (page - 1) : (page + 1))
      }
    />
  );
}
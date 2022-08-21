// eslint-disable-next-line @typescript-eslint/no-unused-vars
import react from "react";
import reactDOM from "react-dom/client";
import { Overlay, Flex, Box, Button, Icon } from "brainly-style-guide";

export default function createModal(
  element: react.ReactNode
) {
  document.body.insertAdjacentHTML("afterbegin", "<div id = \"modal\"></div>");
  let root = reactDOM.createRoot(document.querySelector("#modal"));
  root.render(
    <Overlay color="black">
      <Flex
        alignItems="center"
        fullHeight
      >
        <Box color="white" className="modal-box" style={{
          position: "relative"
        }}>
          <Button
            icon={<Icon color="adaptive" size={24} type="close"/>}
            iconOnly
            size="m"
            className = "closeModal"
            type="transparent"
            onClick = {() => document.querySelector("#modal").remove()}
            style = {{
              position: "absolute", top: "18px", right: "18px"
            }}
          />
          {element}
        </Box>
      </Flex>
    </Overlay>
  );
}
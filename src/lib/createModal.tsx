// eslint-disable-next-line @typescript-eslint/no-unused-vars
import react from "react";
import reactDOM from "react-dom/client";
import { Overlay, Flex, Box, Button, Icon } from "brainly-style-guide";

export default function createModal(
  element: react.ReactNode,
  className: string,
  minWidth?: string,
  maxWidth?: string,
) {
  document.body.insertAdjacentHTML("afterbegin", `<div id = "modal" class = ${className} ></div>`);
  let root = reactDOM.createRoot(document.querySelector(`.${className}#modal`));
  root.render(
    <Overlay color="black">
      <Flex
        alignItems="center"
        fullHeight
      >
        <Box color="white" className="modal-box sg-flex sg-flex--column" style={{
          position: "relative",
          minWidth: minWidth,
          maxWidth: maxWidth,
          maxHeight: "90%"
        }}>
          <Button
            icon={<Icon color="adaptive" size={24} type="close"/>}
            iconOnly
            size="m"
            className = "closeModal"
            variant="transparent"
            onClick = {
              (e) => {
                let button = e.target as HTMLElement;
                button.closest("#modal").remove();
              }
            }
            style = {{
              position: "absolute", top: "18px", right: "18px", zIndex: "1"
            }}
          />
          {element}
        </Box>
      </Flex>
    </Overlay>
  );
}
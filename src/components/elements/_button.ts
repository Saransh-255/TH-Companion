import addSpinner from "@utils/addSpinner";
import iconElem, { iconTypes } from "./_icon";

type ButtonType = 
  | "solid"
  | "solid-inverted"
  | "solid-indigo"
  | "solid-indigo-inverted"
  | "solid-light"
  | "outline"
  | "outline-indigo"
  | "outline-inverted"
  | "transparent"
  | "transparent-light"
  | "transparent-red"
  | "transparent-inverted"
  | "facebook"
  | "google"
  | "apple"
  | "solid-peach"
  | "outline-green"
  | "solid-orange"
  | "outline-peach"
  | "solid-green";

export default (data: {
  text?: string,
  icon?: iconTypes,
  type: ButtonType,
  size: "l" | "m" | "s",
  loading?: boolean,
  disabled?: boolean,
  classes?: string[],
  clickEvent?: () => void,
}) => {
  let button = document.createElement("button");

  button.classList.add("sg-button", `sg-button--${data.type}`, `sg-button--${data.size}`);
  data.classes ? button.classList.add(...data.classes) : {};
  data.icon ? button.insertAdjacentElement("afterbegin", iconElem(data.icon)) : {};
  data.clickEvent ? button.onclick = data.clickEvent : {};
  data.disabled ? button.classList.add("sg-button--disabled") : {};

  if (data.loading) {
    button.classList.add("sg-button--loading");
    addSpinner(button, "white", "small");
  }

  return button;
};
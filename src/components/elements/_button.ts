import { addSpinner } from "@utils/spinner";
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
  href?: string,
  iconOnly: boolean,
  clickEvent?: () => void,
}) => {
  let button : HTMLElement;

  if (data.href) {
    button = document.createElement("a");
    (<HTMLAnchorElement>button).href = data.href;
    (<HTMLAnchorElement>button).target = "_blank";
  } else {
    button = document.createElement("div");
  }

  button.classList.add("sg-button", `sg-button--${data.type}`, `sg-button--${data.size}`);
  data.classes ? button.classList.add(...data.classes) : {};
  data.clickEvent ? button.onclick = data.clickEvent : {};
  data.disabled ? button.classList.add("sg-button--disabled") : {};

  if (data.loading) {
    button.classList.add("sg-button--loading");
    addSpinner(button, "white", "small");
  }
  if (data.icon) { 
    button.insertAdjacentElement("afterbegin", iconElem(data.icon));
    
    if (!data.iconOnly) button.querySelector(".sg-icon").classList.add("sg-button__icon");
    else button.classList.add("sg-button--icon-only");
  }
  data.text ? button.insertAdjacentHTML("beforeend", /*html*/`
    <span class="sg-button__text">${data.text}</span>
  `) : {};

  return button;
};
import { colors } from "@typings/brainly";
import clsx from "clsx";

export default function (
  data: {
    color?: colors | "transparent",
    padding: "xxs" | "xs" | "s" | "m" | "l" | "xl",
    border: boolean,
    borderColor?: colors | "gray-40",
    borderRadius?: boolean | true,
    shadow?: boolean,
    href?:string,
    children:string,
    classes:string[]
  }
) {
  let box = document.createElement(data.href ? "a" : "div");

  box.classList.add(...clsx({
    [`sg-box sg-box--${data.color} sg-box--padding-${data.padding}`] : true,
    ["sg-box--shadow"] : data.shadow,
    [`sg-box--border sg-box--padding-${data.padding}-border md:sg-box--padding-${data.padding}-border` + 
    `lg:sg-box--padding-${data.padding}-border xl:sg-box--padding-${data.padding}-border`] : data.border,
    ["sg-box--border-radius"] : data.borderRadius,
    [`sg-box--border-color-${data.borderColor}` +
      `sg-box--border-color-${data.borderColor}` +
      `md:sg-box--border-color-${data.borderColor} lg:sg-box--border-color-${data.borderColor}` + 
      `xl:sg-box--border-color-${data.borderColor}`]:data.borderColor,
    [data.classes.join(" ")]: data.classes
  }).split(" "));

  if (data.href) box.setAttribute("href", data.href);
  box.setAttribute("target", "_blank");

  box.insertAdjacentHTML("beforeend", data.children);

  return box;
}
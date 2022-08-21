import { IconType } from "brainly-style-guide";

export type iconTypes = {
  size: "16" | "24" | "32" | "40" | "56" | "80" | "104",
  type: IconType,
  color: 
  | "adaptive" 
  | "black" 
  | "white" 
  | "blue-50" 
  | "green-50" 
  | "indigo-50" 
  | "yellow-50" 
  | "gray-50" 
  | "gray-40" 
  | "gray-70"
}

export default (data:iconTypes):HTMLElement => {
  let icon = document.createElement("div");

  icon.classList.add("sg-icon", `sg-icon--icon-${data.color}`, `sg-icon--x${data.size}`);

  icon.innerHTML = /*html*/`
  <svg class="sg-icon__svg">
    <use xlink:href="#icon-${data.type}"></use>
  </svg>`;
    
  return icon;
};
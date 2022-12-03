import { SubjectIconType } from "brainly-style-guide";

export type iconTypes = {
  size: "small" | "medium" | "normal",
  type: SubjectIconType,
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


  icon.innerHTML = /*html*/`
  <svg 
    class="sg-subject-icon sg-subject-icon--icon-${data.color} sg-subject-icon--${data.size}">
    <use xlink:href="#icon-subject-${data.type}"></use>
  </svg>`;
    
  return icon;
};
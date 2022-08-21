import { TextPropsType, TextBitPropsType } from "brainly-style-guide";

export function text (data: {props: TextPropsType, text: string}) {
  let text = document.createElement(data.props.type);
  let thisCL = text.classList;

  text.classList.add("sg--text");
  data.props.size ? thisCL.add(`sg-text--${data.props.size}`) : {};
  data.props.color ? thisCL.add(`sg-text--${data.props.color}`) : {};
  data.props.transform ? thisCL.add(`sg-text--${data.props.transform}`) : {};
  data.props.noWrap ? thisCL.add("sg-text--no-wrap") : thisCL.add("sg-text--wrap");
  data.props.full ? thisCL.add("sg-text--full") : thisCL.add("sg-text--auto");
  data.props.breakWords ? thisCL.add("sg-text--break-words") : thisCL.add("sg-text--word-break-normal");

  text.innerText = data.text;

  return text;
}

export function textBit (data: TextBitPropsType) {
  let textBit = document.createElement(data.type);
  const addType = (
    property:string, 
    iftrue, 
    fallback?) => {
    data[property] ? 
      textBit.classList.add(`sg-text-bit--${iftrue}`) : 
      fallback ? textBit.classList.add(`sg-text-bit--${fallback}`) : {};
  };

  addType("size", data.size);
  addType("color", data.color);
  return textBit;
}
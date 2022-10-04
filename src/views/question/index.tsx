import observeMutation from "@lib/observeMutation";
import { buttonElem } from "@components";
import createModal from "@lib/createModal";
import { TextBit } from "brainly-style-guide";

//answering box observer
observeMutation({
  targetSelector: "div[data-testid = 'question_box_actions']",
  hookInterval: 100,
  settings: {
    attributes: false,
    childList: true,
    subtree: true,
    characterData: true
  },
  itemFn: () => {
    let answerBox = document.querySelector(".brn-answer-editor-layer") as HTMLElement;
    if (!answerBox || answerBox.dataset.modified) return;
    answerBox.dataset.modified = "true";
    
    answerBox.querySelector("div[data-testid = 'rich_text_editor_toolbar']")
      .insertAdjacentElement("beforeend", buttonElem({
        icon: {
          type: "draw",
          size: "24",
          color: "black"
        },
        type: "transparent",
        size: "m",
        iconOnly: true,
        clickEvent: () => {
          createModal( 
            <>
              <TextBit size="small">graphing calculator</TextBit>
              <iframe 
                id="calculator" 
                src="https://www.geogebra.org/classic" />
            </>, "90vw"
          );
        }
      }));
  }
});
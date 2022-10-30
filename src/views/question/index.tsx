import observeMutation from "@lib/observeMutation";
import { buttonElem } from "@components";
import createModal from "@lib/createModal";
import { TextBit } from "brainly-style-guide";
import Profanity from "@config/profanity";

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
                src="https://www.geogebra.org/classic" 
              />
            </>, "90vw"
          );
        }
      }));
    observeMutation({
      targetSelector: "#slate-editable",
      hookInterval: 0,
      settings: {
        attributes: false,
        characterData: true,
        subtree: true,
        childList: true
      },
      itemFn: () => {
        let answerLines = document.querySelectorAll("span[data-slate-string = 'true']"); 
  
        document.querySelectorAll(".highlight").forEach(
          item => item.classList.remove("highlight")
        );
  
        answerLines.forEach(line => {
          Profanity.forEach(regProf => {
            if (regProf.test(line.innerHTML)) {
              console.log(regProf);
              return line.closest("span[data-slate-node = 'text']").classList.add("highlight");
            }
          });
        });
      }
    });
  } 
});
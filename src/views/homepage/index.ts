import getId from "@lib/getId";
import observeMutation from "@lib/observeMutation";
import BrainlyAPI from "@api/brainly/BrainlyAPI";
import { buttonElem } from "@components";
import reportMenu from "@modals/Report/report";
import Preview from "@modals/Preview/Preview";

async function homeObserver() {
  const items = document.querySelectorAll(".brn-feed-items > div[data-testid = 'feed-item']");

  for await (let item of Array.from(items)) {
    if ((<HTMLElement>item).dataset.modified) continue;
    (<HTMLElement>item).dataset.modified = "true";
  
    let anchor: HTMLAnchorElement = item.querySelector("a[data-test=feed-item-link]");
    let questionId = +getId(anchor.href, "question");

    let question = await BrainlyAPI.GetQuestion(questionId);

    item.querySelector(".brn-feed-item__points .brn-points-on-feed")
      .insertAdjacentElement("afterbegin", buttonElem({
        size: "m",
        iconOnly: true,
        icon: {
          size: "24",
          type: "report_flag_outlined",
          color: "gray-50"
        },
        type: "transparent",
        classes: ["report-flag"],
        clickEvent: () => {
          reportMenu(questionId, "task");
        } 
      }));
    if (question.data.task.settings.is_marked_abuse) {
      item.classList.add("reported");
      item.querySelector(".report-flag").classList.add("sg-button--disabled");
      item.querySelector(".report-flag use").setAttribute("xlink:href", "#icon-report_flag");
    }

    let actionMenu = document.createElement("div");
    actionMenu.classList.add("action-menu");
    
    if (item?.querySelector("a.sg-button")) {
      item.querySelector("a.sg-button").remove();
      item.querySelector(".brn-feed-item__footer div").insertAdjacentElement("beforeend", actionMenu);

      actionMenu.insertAdjacentElement("afterbegin", buttonElem({
        type: "solid",
        icon: {
          type: "answer",
          size: "24",
          color: "white"
        },
        iconOnly: true,
        href: `/question/${questionId}?answering=true`,
        size: "m"
      }));

      actionMenu.insertAdjacentElement("afterbegin", buttonElem({
        type: "solid-indigo",
        icon: {
          type: "seen",
          size: "24",
          color: "adaptive"
        },
        iconOnly: true,
        size: "m",
        clickEvent: () => {
          Preview(questionId + "");
        },
        attributes:[{
          item: "style",
          value: `
            margin-right:4px;
            background: #bdc7fb;
          `
        }]
      }));
    }
  }
}

observeMutation({
  targetSelector: "#main-content",
  hookInterval: 10,
  itemFn: homeObserver,
  settings: {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  }
});
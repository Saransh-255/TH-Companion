import getId from "@lib/getId";
import observeMutation from "@lib/observeMutation";
import BrainlyAPI from "@api/brainly/BrainlyAPI";
import { buttonElem } from "@components";
import reportMenu from "@modals/report";

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
  }
}

observeMutation({
  targetSelector: ".sg-layout__content",
  hookInterval: 100,
  itemFn: homeObserver,
  settings: {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  }
});
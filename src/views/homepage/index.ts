/* eslint-disable max-lines */
/* eslint-disable max-len */
import getId from "@lib/getId";
import observeMutation from "@lib/observeMutation";
import runForElem from "@lib/runForElem";
import { GQL, Legacy } from "@brainly";

import { buttonElem, box, icon } from "components/elements";
import feedItem from "./_feedItem";

import reportMenu from "@modals/Report/report";
import Preview from "@modals/Preview/Preview";
import showTicket from "@modals/Ticket/Ticket";

import { shuffle } from "@lib/arrOps";
import CompanionAPI from "@lib/api/companion";
import MassMsg from "@modals/MassMsg";

const data = CompanionAPI.SavedData();

const thisUser = data.user;

if (thisUser.isAnswerer) {
  // FYP Button
  runForElem(".brn-white-background-feed-wrapper > div.sg-flex--row", 
    (elem) => {
      elem.appendChild(buttonElem({
        text: "For you",
        icon: {
          size: 24,
          type: "spark",
          color: "icon-white"
        },
        type: "solid",
        size: "m",
        iconOnly: false,
        classes: ["sg-flex--margin-left-s", "fyp"],
        clickEvent: () => {
          if (!document.querySelector(".fyp-feed")) return;
          document.querySelector("#main-content").classList.toggle("for-you");
        }
      }));
    }
  );

  // For You Feed
  let forYouQs = [];
  const createFeed = async () => {
    let suggested = await GQL.ForYou(thisUser.id);
    let linkIds = [];
    suggested.data.user.answers.edges.forEach(ans => {
      ans.node.question.similar.forEach(item => {
        if (
          item.question.canBeAnswered && 
        (!item.question.answers.nodes.find(({ id }) => id === thisUser.id)) &&
        !linkIds.includes(item.question.id)
        ) {
          forYouQs.push(item); 
          linkIds.push(item.question.id);
        }
      });
    });
    shuffle(forYouQs);
  };
  createFeed();

  //Insert the actual feed
  runForElem("#main-content > .sg-animation-fade-in-fast", (elem) => {
    elem.insertAdjacentHTML("afterend", "<div class = 'fyp-feed sg-animation-fade-in-fast'></div>");
    let feed = document.querySelector(".fyp-feed");
      
    forYouQs.forEach(ques => {
      let qid = atob(ques.question.id).split(":")[1];
      feed.insertAdjacentHTML("beforeend", feedItem(ques));

      feed.querySelector(`.fyp#id${qid}`).addEventListener("click", async function () {
        await Preview(qid);
      });
      feed.querySelector(`.report#rep${qid}`).addEventListener("click", async function (e) {
        await reportMenu(+qid, "task", e.target);
      });
    });
  });
}


// Preview/Moderate buttons
if (thisUser.isModerator || thisUser.isAnswerer) observeMutation({
  target: ".js-feed-stream",
  hookInterval: 0,
  itemFn: async () => {
    const items = document.querySelectorAll(".brn-feed-items > div[data-testid = 'feed-item']");
  
    for await (let item of Array.from(items)) {
      if ((<HTMLElement>item).dataset.modified) continue;
      (<HTMLElement>item).dataset.modified = "true";
    
      let anchor: HTMLAnchorElement = item.querySelector("a[data-test=feed-item-link]");
      let questionId = +getId(anchor.href, "question");
  
      item.querySelector(".brn-feed-item__points > div > div")
        .insertAdjacentElement("afterbegin", buttonElem({
          size: "m",
          iconOnly: true,
          icon: {
            size: 24,
            type: "report_flag_outlined",
            color: "icon-gray-50"
          },
          type: "transparent",
          classes: ["report-flag"],
          clickEvent: (e) => {
            reportMenu(questionId, "task", e.target);
          } 
        }));
  
      let actionMenu = document.createElement("div");
      actionMenu.classList.add("action-menu");
      item.querySelector(".brn-feed-item__footer div").insertAdjacentElement("beforeend", actionMenu);
      
      if (item.querySelector("a.sg-button")) {
        item.querySelector("a.sg-button").remove();
  
        actionMenu.insertAdjacentElement("afterbegin", buttonElem({
          type: "solid",
          icon: {
            type: "answer",
            size: 24,
            color: "icon-white"
          },
          iconOnly: true,
          href: `/question/${questionId}?answering=true`,
          size: "m"
        }));
      }
      actionMenu.insertAdjacentElement("afterbegin", buttonElem({
        type: "solid-indigo",
        icon: {
          type: thisUser.isModerator ? "shield" : "seen",
          size: 24,
          color: "adaptive"
        },
        iconOnly: true,
        size: "m",
        clickEvent: () => {
          thisUser.isModerator ? (
            showTicket(questionId + "")
          ) : (
            Preview(
              questionId + "", 
              async () => {
                for await (let item of Array.from(items)) {
                  let anchor: HTMLAnchorElement = item.querySelector("a[data-test=feed-item-link]"); 
                  let question = await Legacy.GetQuestion(+getId(anchor.href, "question")); 
                  if (question.data.task.settings.is_marked_abuse) {
                    item.classList.add("reported"); 
                    item.querySelector(".report-flag").classList.add("sg-button--disabled"); 
                    item.querySelector(".report-flag use").setAttribute("xlink:href", "#icon-report_flag"); 
                  } 
                }
              }
            )
          );
        },
        attributes:[{
          item: "style",
          value: `
            margin-right:4px;
            background: #bdc7fb;
          `
        }]
      }));

      let question = await Legacy.GetQuestion(questionId);
      if (question.data.task.settings.is_marked_abuse) {
        item.classList.add("reported");
        item.querySelector(".report-flag").classList.add("sg-button--disabled");
        item.querySelector(".report-flag use").setAttribute("xlink:href", "#icon-report_flag");
      }
    }
  },
  settings: {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  }
});

// Game Box Tools
observeMutation({
  target: ".sg-layout__aside-content",
  hookInterval: 0,
  itemFn: async () => {
    const config = await CompanionAPI.Config();
    //slight delay in render, need to await the element first
    runForElem("[data-testid='game_box_current_plan']", (elem) => {
      if (document.querySelector(".comp-gb")) return;

      elem.insertAdjacentHTML("afterend", "<div class = 'sg-box comp-gb'></div>");
      const gbox = document.querySelector(".comp-gb");

      gbox.appendChild(
        gBoxElem("Volunteer Dashboard", "#0F9D58", "answers", config.vdashURL)
      );
      if (thisUser.isET) gbox.appendChild(
        gBoxElem("Message Users", "#46535f", "messages", "" , () => MassMsg())
      );
      if (thisUser.isAnswerer) {
        gbox.appendChild(
          gBoxElem("Answering Dashboard", "#133191", "star", "https://brainly.com/companion/answering")
        );
      }
      if (thisUser.isModerator) {
        gbox.appendChild(
          gBoxElem("Mod Handbook", "#c98600", "textbook", config.modURL)
        );
      }
    });
  },
  settings: {
    attributes: false,
    childList: true,
    subtree: false,
    characterData: false
  }
});

function gBoxElem(
  text:string, color:string, iconType?:string, link?:string, clickEvent?: () => void
):HTMLAnchorElement | HTMLDivElement {
  return box({
    padding: "s",
    border: true,
    borderRadius: true,
    classes: ["sg-flex tooltip"],
    href: link ?? null,
    onClick: () => clickEvent?.(),
    borderColor: "white",
    attributes: [
      {
        key: "data-tooltip",
        value: text
      },
      {
        key: "style",
        value: `background:${color}`
      }
    ],
    children: (
      icon({
        type: iconType,
        size: 16,
        color: "icon-white",
      }).outerHTML
    )
  });
}
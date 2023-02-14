/* eslint-disable max-len */
import getId from "@lib/getId";
import observeMutation from "@lib/observeMutation";
import runForElem from "@lib/runForElem";
import BrainlyAPI from "@api/brainly/BrainlyAPI";

import { buttonElem, link } from "components/elements";
import feedItem from "./_feedItem";

import reportMenu from "@modals/Report/report";
import Preview from "@modals/Preview/Preview";
import showTicket from "@modals/Ticket/Ticket";

import { shuffle } from "@lib/arrOps";

//Dashboard Link
runForElem("div[data-testid = 'navigation_header_subnav'] > div > div > div", 
  (elem) => {
    elem.appendChild(
      link({
        href: "https://brainly.com/companion/answering",
        text: "Answering Dashboard",
        size: "small",
        target: "_blank",
        classNames: ["sg-flex"],
        noWrap: true,
        weight: "regular",
        color: "text-black"
      })
    );
  }
);


// For You Feed
let forYouQs = [];
runForElem("meta[name='user_data']", async (elem) => {
  let userData = JSON.parse(elem.getAttribute("content"));

  let suggested = await BrainlyAPI.ForYou(userData.id);

  let linkIds = [];
  suggested.data.user.answers.edges.forEach(ans => {
    ans.node.question.similar.forEach(item => {
      if (
        item.question.canBeAnswered && 
        (!item.question.answers.nodes.find(({ id }) => id === userData.id)) &&
        !linkIds.includes(item.question.id)
      ) {
        forYouQs.push(item); 
        linkIds.push(item.question.id);
      }
    });
  });
  shuffle(forYouQs);

  observeMutation({
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
              size: "24",
              type: "report_flag_outlined",
              color: "gray-50"
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
              size: "24",
              color: "white"
            },
            iconOnly: true,
            href: `/question/${questionId}?answering=true`,
            size: "m"
          }));
        }
        actionMenu.insertAdjacentElement("afterbegin", buttonElem({
          type: "solid-indigo",
          icon: {
            type: userData.isModerator ? "shield" : "seen",
            size: "24",
            color: "adaptive"
          },
          iconOnly: true,
          size: "m",
          clickEvent: () => {
            userData.isModerator ? (
              showTicket(questionId + "")
            ) : (
              Preview(
                questionId + "", 
                async () => {
                  for await (let item of Array.from(items)) {
                    let anchor: HTMLAnchorElement = item.querySelector("a[data-test=feed-item-link]"); 
                    let question = await BrainlyAPI.GetQuestion(+getId(anchor.href, "question")); 
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
  
        let question = await BrainlyAPI.GetQuestion(questionId);
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
  
});

runForElem(".brn-white-background-feed-wrapper > div.sg-flex--row", 
  (elem) => {
    elem.appendChild(buttonElem({
      text: "For you",
      icon: {
        size: "24",
        type: "spark",
        color: "white"
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
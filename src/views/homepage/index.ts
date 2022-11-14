/* eslint-disable max-len */
//import getId from "@lib/getId";
//import observeMutation from "@lib/observeMutation";
import runForElem from "@lib/runForElem";
//import BrainlyAPI from "@api/brainly/BrainlyAPI";
import { buttonElem } from "@components";
import BrainlyAPI from "@lib/api/brainly/BrainlyAPI";
import { ptsLabel, avatar } from "@components";
// import reportMenu from "@modals/Report/report";
// import Preview from "@modals/Preview/Preview";

// observeMutation({
//   targetSelector: "#main-content",
//   hookInterval: 10,
//   itemFn: async () => {
//     const items = document.querySelectorAll(".brn-feed-items > div[data-testid = 'feed-item']");
  
//     for await (let item of Array.from(items)) {
//       if ((<HTMLElement>item).dataset.modified) continue;
//       (<HTMLElement>item).dataset.modified = "true";
    
//       let anchor: HTMLAnchorElement = item.querySelector("a[data-test=feed-item-link]");
//       let questionId = +getId(anchor.href, "question");
  
//       let question = await BrainlyAPI.GetQuestion(questionId);
  
//       item.querySelector(".brn-feed-item__points .brn-points-on-feed")
//         .insertAdjacentElement("afterbegin", buttonElem({
//           size: "m",
//           iconOnly: true,
//           icon: {
//             size: "24",
//             type: "report_flag_outlined",
//             color: "gray-50"
//           },
//           type: "transparent",
//           classes: ["report-flag"],
//           clickEvent: () => {
//             reportMenu(questionId, "task");
//           } 
//         }));
//       if (question.data.task.settings.is_marked_abuse) {
//         item.classList.add("reported");
//         item.querySelector(".report-flag").classList.add("sg-button--disabled");
//         item.querySelector(".report-flag use").setAttribute("xlink:href", "#icon-report_flag");
//       }
  
//       let actionMenu = document.createElement("div");
//       actionMenu.classList.add("action-menu");
      
//       if (item?.querySelector("a.sg-button")) {
//         item.querySelector("a.sg-button").remove();
// eslint-disable-next-line max-len
//         item.querySelector(".brn-feed-item__footer div").insertAdjacentElement("beforeend", actionMenu);
  
//         actionMenu.insertAdjacentElement("afterbegin", buttonElem({
//           type: "solid",
//           icon: {
//             type: "answer",
//             size: "24",
//             color: "white"
//           },
//           iconOnly: true,
//           href: `/question/${questionId}?answering=true`,
//           size: "m"
//         }));
  
//         actionMenu.insertAdjacentElement("afterbegin", buttonElem({
//           type: "solid-indigo",
//           icon: {
//             type: "seen",
//             size: "24",
//             color: "adaptive"
//           },
//           iconOnly: true,
//           size: "m",
//           clickEvent: () => {
//             Preview(questionId + "");
//           },
//           attributes:[{
//             item: "style",
//             value: `
//               margin-right:4px;
//               background: #bdc7fb;
//             `
//           }]
//         }));
//       }
//     }
//   },
//   settings: {
//     attributes: true,
//     childList: true,
//     characterData: true,
//     subtree: true
//   }
// });

const forYouQs = [];
runForElem("meta[name='user_data']", async (elem) => {
  let userData = JSON.parse(elem.getAttribute("content"));

  let suggested = await BrainlyAPI.ForYou(userData.id);

  suggested.data.user.answers.edges.forEach(ans => {
    ans.node.question.similar.forEach(item => {
      if (item.question.canBeAnswered && 
        (!item.question.answers.nodes.find(({ id }) => id === userData.id))) 
        forYouQs.push(item);
    });
  });
});

runForElem(".brn-white-background-feed-wrapper > div.sg-flex--row", 
  (elem) => {
    runForElem("#main-content > .sg-animation-fade-in-fast", (elem) => {
      elem.insertAdjacentHTML("afterend", "<div class = 'fyp-feed sg-animation-fade-in-fast'></div>");
      let feed = document.querySelector(".fyp-feed");
      forYouQs.forEach(ques => {
        feed.insertAdjacentHTML("beforeend", feedItem(ques));
      });
    });

    elem.insertAdjacentElement("beforeend", buttonElem({
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
  });

function feedItem(data) {
  return /*html*/`
    <div class="fyp-feed-item sg-box sg-box--transparent sg-box--no-shadow sg-box--border-radius sg-box--padding-m">
      <div class="sg-flex" style = "gap: 8px">
        <a class="sg-text sg-text--link-unstyled sg-text--bold" href = "https://brainly.com/question/${atob(data.question.id).split(":")[1]}">
          <div class = "sg-text sg-text--medium sg-text--break-words fyp-content">
            ${data.question.content.trim().replaceAll("<br />\n", " ")}
          </div>
        </a>
        ${ptsLabel("+" + data.question.points)}
      </div>
      <div class="sg-flex second">
        <div class="sg-flex user" style = "gap: 4px;">
          ${avatar({ id: atob(data.question.author.id).split(":")[1] + "", avatarURL: data.question.author.avatar?.thumbnailUrl + "" })}
          <div class = "sg-text sg-text--text-gray-60 sg-text--medium sg-text--bold">
            ${data.question.subject.name}
          </div>
        </div>
        <div class="sg-flex">
          ${
  buttonElem({
    icon: {
      type: "answer",
      size: "24",
      color: "white",
    },
    type: "solid",
    size: "m",
    iconOnly: true,
    classes: ["fyp"],
    href: `https://brainly.com/question/${atob(data.question.id).split(":")[1]}?answering=true`,
  }).outerHTML
}
        </div>
      </div>
    </div>
  `;
}
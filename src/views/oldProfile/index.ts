/* eslint-disable indent */
import { box, buttonElem, icon, ptsLabel } from "@components";
import addStyleguides from "@lib/addStyleguide";
import { getWarnings } from "@lib/api/brainly/scraped";
import getId from "@lib/getId";
import runForElem from "@lib/runForElem";
import shortDelRsn from "@lib/shortDelRsn";
import showTicket from "@modals/Ticket/Ticket";

addStyleguides();

const userId = getId(window.location.href, "profile");
const ITEMS:{ name:"warning" | "answer" | "question", selector:string, link:string }[] = [
  {
    name: "warning",
    selector: "#profile-mod-panel > ul:nth-child(2) > li:nth-child(6) > span",
    link: `https://brainly.com/users/view_user_warns/${userId}`
  },
  {
    name: "question",
    selector: "#profile-mod-panel > ul:nth-child(2) > li:nth-child(3) > span",
    link: `https://brainly.com/users/user_content/${userId}/tasks`
  },
  {
    name: "answer",
    selector: "#profile-mod-panel > ul:nth-child(2) > li:nth-child(2) > span",
    link: `https://brainly.com/users/user_content/${userId}/responses`
  }
];

runForElem(
  "#profile-mod-panel",
  async () => {
    const warnings = await getWarnings(getId(window.location.href, "profile"));
    
    document.querySelector("#main-left .header")
      .insertAdjacentHTML("afterend", `
      <div class="comp-links sg-flex">
      ${
        ITEMS.map(element => {
          return addLink(
            element.name, 
            document.querySelector(element.selector).innerHTML,
            element.link
          );
        }).join("")
      }
      </div>`);
    
      warnings.length && document.querySelector("#main-right").insertAdjacentHTML("beforeend", `
      <div class="comp-warnings">
      ${
        warnings.map(warn => {
          return (`
          <div class="warning-comp sg-flex sg-flex--column sg-flex--justify-content-space-between">
            <div class="sg-flex sg-flex--justify-content-space-between">
              <div class="reason sg-headline sg-headline--small sg-headline--bold">
                ${shortDelRsn(warn.reason)}
              </div>
              <div class="time sg-text sg-text--text-gray-50 sg-text--small">
                ${warn.date}
              </div>
            </div>
  
            <div class="sg-flex sg-flex--justify-content-space-between">
              <div 
                class="content sg-text sg-text--text-gray-60 sg-text--small sg-text--medium"
                style="height:1.2rem; overflow: hidden;"
              >
                ${warn.content}
              </div>
              <div 
                class="mod sg-headline sg-headline--small sg-headline--bold"
                style="color: #6d83f3;"
              >
                ${warn.moderator}
              </div>
            </div>
          </div>
          `);
        }).join()
      }
      </div>
      `);

    Array.from(document.querySelectorAll(".task")).forEach(
      (task:HTMLElement) => {
        task.appendChild(
          buttonElem({
            iconOnly: true,
            icon: {
              type: "shield",
              color: "gray-50",
              size:"24"
            },
            type:"transparent",
            size:"m",
            clickEvent() {
              showTicket(
                getId((task.querySelector(".task-content a") as HTMLAnchorElement).href, "question")
              );
            },
          })
        );
        task.querySelector(".task-header .fleft").insertAdjacentHTML(
          "beforeend", 
          ptsLabel("+" + task.querySelector(".points .points-number").innerHTML.replace(" pt", ""))
        );
      }
    );
  }
);

function addLink(type: "warning" | "question" | "answer", stat:string, link:string) {
  let iconStr = icon({
    size: "24",
    type: type,
    color: "black"
  }).outerHTML;

  return box({
    padding: "m",
    border: true,
    classes: ["link-item"],
    href: link,
    children: `
      <div class="sg-flex flex-direction-column">
        ${iconStr}
        <div class="sg-text">${stat}</div>
      </div>
    `
  }).outerHTML;
}
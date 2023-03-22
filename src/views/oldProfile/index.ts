/* eslint-disable indent */
import { box, buttonElem, icon, ptsLabel, text } from "@components";
import addStyleguides from "@lib/addStyleguide";
import { Scrape } from "@brainly";
import getId from "@lib/getId";
import runForElem from "@lib/runForElem";
import shortDelRsn from "@lib/shortDelRsn";
import showTicket from "@modals/Ticket/Ticket";

addStyleguides();

const userId = getId(window.location.href, "profile");
const ITEMS:{ 
  name:"warning" | "answer" | "question", 
  selector:string, 
  link:string 
}[] = [
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
    let content = await Scrape.getUserContent(userId, "solved", 60);
    console.log(content);
    const warnings = await Scrape.getWarnings(getId(window.location.href, "profile"));
    
    document.querySelector("#main-left .header")
      .insertAdjacentHTML("afterend", `
      <div class="comp-links sg-flex">
      ${
        ITEMS.map(element => {
          return box({
            padding: "m",
            border: true,
            classes: ["link-item"],
            href: element.link,
            children: `
              <div class="sg-flex flex-direction-column">
                ${
                  icon({
                    size: 24,
                    type: element.name,
                    color: "icon-black"
                  }).outerHTML
                }
                <div class="sg-text">${
                  document.querySelector(element.selector).innerHTML
                }</div>
              </div>
            `
          }).outerHTML;
        }).join("")
      }
      </div>`);
    
      if (warnings.length) {
        document.querySelector("#main-right").insertAdjacentHTML("beforeend", `
          ${
            text({
              variant:"sg-text-bit",
              text: "warnings",
              transform: "uppercase",
              color: "text-gray-70",
              weight: "bold",
              size: "small",
              style:"font-size: 1.2rem;"
            }).outerHTML
          }
          <div class="comp-warnings">
          ${
            warnings.map(warn => {
              return (`
              <div class="warning-comp sg-flex sg-flex--column sg-flex--justify-content-space-between">
                <div class="sg-flex sg-flex--justify-content-space-between">
                  ${
                    text({
                      text: shortDelRsn(warn.reason),
                      color: warn.isRevoked ? "text-red-40" : "text-black",
                      size:"small",
                      weight: "bold",
                      variant: "sg-headline"
                    }).outerHTML
                    +
                    text({
                      text: warn.date,
                      color: "text-gray-50",
                      size:"xsmall"
                    }).outerHTML
                  }
                </div>
      
                <div 
                  class="sg-flex sg-flex--justify-content-space-between sg-flex--align-items-baseline"
                  style="gap: 12px;"
                >
                  ${
                    text({
                      text: warn.content,
                      color: "text-black",
                      size: "small",
                      style: "height:1.3rem; overflow: hidden; font-size: 1rem;"
                    }).outerHTML 
                    + 
                    text({
                      color: "text-yellow-40",
                      size: "small",
                      weight: "bold",
                      text: warn.moderator,
                      style:"color:#6d83f3;"
                    }).outerHTML
                  }
                </div>
              </div>
              `);
            }).join("")
          }
        </div>
        <div 
          class="sg-flex sg-flex--justify-content-center load-more"
          style="margin: 12px;"
        ></div>
      `);
      if (warnings.length > 3) {
        document.querySelector(".load-more").appendChild(
          buttonElem({
            text: "show all",
            type: "outline",
            size: "s",
            iconOnly: false,
            attributes:[{
              item: "style",
              value: "border-color: #6d83f3; font-size: 1rem;"
            }],
            clickEvent: ({ target }) => {
              target.innerHTML = document.querySelector(".comp-warnings").classList.toggle("expand") 
                ? "show less" : "show all";
            }
          })
        );
      }
    }

    Array.from(document.querySelectorAll(".task")).forEach(
      (task:HTMLElement) => {
        task.appendChild(
          buttonElem({
            iconOnly: true,
            icon: {
              type: "shield",
              color: "icon-gray-50",
              size:24
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
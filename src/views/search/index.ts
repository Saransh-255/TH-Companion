import { buttonElem } from "@components";
import getId from "@lib/getId";
import observeMutation from "@lib/observeMutation";
import runForElem from "@lib/runForElem";
import showPreview from "@modals/Preview/Preview";
import showTicket from "@modals/Ticket/Ticket";

runForElem("meta[name='user_data']", async (elem) => {
  let user = JSON.parse(elem.getAttribute("content"));

  runForElem(
    "[data-testid='search_stream_wrapper']",
    () => {
      observeMutation({
        target: "[data-testid='search_tabs_container']",
        hookInterval: 0,
        settings: {
          attributes: false,
          childList: true,
          subtree: true,
          characterData: false
        },
        itemFn: () => {
          let mutateArr = Array.from(document.querySelectorAll("[data-testid='search_stream_wrapper']"));
  
          observeMutation({
            target: mutateArr[2],
            hookInterval: 0,
            itemFn: () => {
              mutateArr.forEach(elem => {
                Array.from(elem.querySelectorAll("[data-testid='search-item-facade-wrapper']"))
                  .forEach((item:HTMLElement) => {
                    if (item.dataset.modified) return;
                    item.dataset.modified = "true";

                    let id = getId(
                      (item.querySelector("a.sg-text") as HTMLAnchorElement).href, 
                      "question"
                    );

                    item.querySelector("[data-testid='rating']").appendChild(
                      buttonElem({
                        iconOnly:true,
                        icon: {
                          type: user.isModerator ? "shield" : "seen",
                          color: "gray-50",
                          size: "24"
                        },
                        type: "transparent",
                        size: "m",
                        clickEvent: () => {
                          user.isModerator ? showTicket(id) : showPreview(id);
                        }
                      })
                    );
                  });
              });
            },
            settings: {
              attributes: false,
              childList: true,
              subtree: false,
              characterData: false
            }
          });
        }
      });
    }
  );
});
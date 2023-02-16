import allPages from "@lib/allPages";
import parsePage from "@lib/parsePage";
//import { groupSimilar } from "@lib/arrOps";

export async function getActions(id: string | number, endDate?: Date) {
  let actions = [];
  let dateArg = true;

  await allPages(
    100, //not actual page count since it's not in the HTML but 100 pages is 3 million actions
    (i) => `https://brainly.com/moderation_new/view_moderator/${id}/page:${i}?limit=30000`,
    (doc) => {
      if (!doc.querySelector(".tasksPagination")) dateArg = false;

      Array.from(doc.querySelectorAll("tr")).forEach((item) => {
        let data = (item.querySelector("tr td:nth-child(2)") as HTMLElement)
          .innerText.trim().split("\n");
        let rsn = item.querySelector(".reason").innerHTML.replace(" :", "");
        let userDel = item.querySelector("td:nth-child(2) a") as HTMLAnchorElement;

        let actDate = (item.querySelector(".dataTime") as HTMLElement)
          .innerText.trim().split(" ").splice(1, 2).join();
        if (endDate > new Date(actDate)) {
          dateArg = false;
          return;
        }
  
        let modObj = {
          date: actDate,
          id: +item.querySelector(".dataTime a").innerHTML,
          type: rsn ? 
            (rsn.includes("question") || rsn.includes("Accepted") ? "question" : "answer") : "comment",
          userId: +userDel.href.split("-")[1],
          user: data.splice(0, 2)[1],
          reason: item.querySelector("strong") ? data.pop().replace("Reason: ", "") : "",
          content: data.join("\n"),
          accepted: rsn.includes("Accepted")
        };
        
        actions.push(modObj);
      });
      return dateArg;
    },
    1
  );
  //return groupSimilar(actions, "reason");
  return actions;
}

export async function getWarnings(id:string | number) {
  return parsePage(`https://brainly.com/users/view_user_warns/${id}`)
    .then(page => Array.from(page.querySelectorAll("#content-old tr:not(:nth-child(1))")))
    .then(rows => {
      return rows.map((row) => {
        return {
          date: row.children[0].innerHTML,
          reason: row.children[1].innerHTML,
          content: row.children[2].innerHTML,
          moderator: row.children[4].children[0].innerHTML,
          isRevoked: row.children[5].children[0].innerHTML !== "Undo"
        };
      });
    });
}
import allPages from "@lib/allPages";
import parsePage from "@lib/parsePage";
import { Legacy } from "@brainly";
import getId from "@lib/getId";
//import { groupSimilar } from "@lib/arrOps";

export default new class {
  async getActions(id: string | number, endDate?: Date) {
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
          if (endDate > new Date(actDate)) return dateArg = false;
    
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
  async getWarnings(id:string | number) {
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
  async getUser(id: string| number) {
    let doc = await parsePage(
      `https://brainly.com/users/view/${id}/page:/limit:0/`
    );
    return {
      avatar: (<HTMLImageElement>doc.querySelector(".avatar img")).src,
      nick: doc.querySelector(".info .ranking a").innerHTML,
    };
  }
  
  async getUserContent(
    userId: string | number, 
    type: "solved" | "submitted" | "comments",
    limit: 30 | 60,
    page?: number | string
  ) {
    let isComments = (type === "comments");
    let doc = await parsePage(
      isComments ? 
        `https://brainly.com/users/user_content/${userId}/comments_tr/${page ?? 1}/0` : 
        `https://brainly.com/users/view/${userId}/page:${page || 1}/limit:${limit}/type:${type}`
    );
    return {
      content: await Promise.all(Array.from(
        doc.querySelectorAll(isComments ? "tbody tr td:nth-child(2) a" : ".task .task-content > a")
      ).map(async (tag:HTMLAnchorElement) => {
        return {
          data: await Legacy.GetQuestion(+(getId(tag.href, "question"))),
          created:tag.closest("tr")?.querySelector("td:last-child")?.innerHTML.replace(" ", "T") ?? null,
          content: tag.closest("tr")?.querySelector("td:nth-child(2) a").innerHTML
            .trim().split("").slice(0, -3).join("")
        };
      })),
      avatar: (<HTMLImageElement>doc.querySelector(
        isComments ? "#content-old > div:nth-child(1) > div:nth-child(1) > a > img" : ".avatar img")
      ).src,
      nick: doc.querySelector(
        isComments ? "#content-old > div:nth-child(1) > div:nth-child(2) > h1 > a" : ".info .ranking a"
      ).innerHTML,
      lastPage: doc.querySelector(".pager span:nth-child(9)")?.classList.contains("current") ?? null
    };
  }
};
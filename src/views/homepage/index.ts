import getId from "@lib/getId"
import observeMutation from "@lib/observeMutation"
import BrainlyAPI from "@api/brainly/BrainlyAPI"

async function homeObserver() {
    const wrappers = document.querySelectorAll(".brn-feed-item-wrapper");
  
    Array.from(wrappers).forEach(async item => {
      if ((<HTMLElement>item).dataset.modified === "true") return; // uses data- attribute
  
      let anchor: HTMLAnchorElement = item.querySelector("a[data-test=feed-item-link]");
      let questionId = +getId(anchor.href, "question");
  
      let question = await BrainlyAPI.GetQuestion(questionId);
      
      if (!question.data.task.settings.is_marked_abuse) console.log("not reported");
  
      (<HTMLElement>item).dataset.modified = "true";
    });
  }

  observeMutation({
    targetSelector: ".brn-feed-item-wrapper",
    hookInterval: 100,
    itemFn: homeObserver
  })
import observeMutation from "@lib/observeMutation";
import { buttonElem } from "@components";
import createModal from "@lib/createModal";
import { TextBit } from "brainly-style-guide";
import Profanity from "@config/profanity";
import Chart from "chart.js/auto";

//answering box observer
observeMutation({
  targetSelector: "div[data-testid = 'question_box_actions']",
  hookInterval: 100,
  settings: {
    attributes: false,
    childList: true,
    subtree: true,
    characterData: true
  },
  itemFn: () => {
    let answerBox = document.querySelector(".brn-answer-editor-layer") as HTMLElement;
    if (!answerBox || answerBox.dataset.modified) return;
    answerBox.dataset.modified = "true";
    
    answerBox.querySelector("div[data-testid = 'rich_text_editor_toolbar']")
      .insertAdjacentElement("beforeend", buttonElem({
        icon: {
          type: "draw",
          size: "24",
          color: "black"
        },
        type: "transparent",
        size: "m",
        iconOnly: true,
        clickEvent: () => {
          createModal( 
            <>
              <TextBit size="small">graphing calculator</TextBit>
              <iframe 
                id="calculator" 
                src="https://www.geogebra.org/classic" 
              />
            </>, "graph", "90vw"
          );
        }
      }));

    document.querySelector("div[data-testid='add_answer_box'] > div > div")
      .insertAdjacentHTML("beforeend", `
      <div class = "answer-word-count">
        <canvas id = "acount"></canvas>
        <div class = "sg-text remaining-count"></div>
      </div>
      `);

    let numChart = new Chart("acount", {
      type: "doughnut",
      data: {
        labels: ["", ""],
        datasets: [{
          label: "# of words",
          data: [0, 100],
          backgroundColor: [
            "#0089e3",
            "#e1eaf1",
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          },
        },
        cutout: "70%"
      }
    });

    observeMutation({
      targetSelector: "#slate-editable",
      hookInterval: 0,
      settings: {
        attributes: false,
        characterData: true,
        subtree: true,
        childList: true
      },
      itemFn: () => {
        let answerLines = document.querySelectorAll("p[data-slate-node='element'"); 
  
        document.querySelectorAll(".highlight").forEach(
          item => item.classList.remove("highlight")
        );
        let aStr = "";
        answerLines.forEach(line => {
          let texSelector = "img[data-testid='tex_image']";
          let text = "span[data-slate-string = 'true']";

          if (line.querySelector(text)) aStr += line.querySelector(text).innerHTML;

          if (line.querySelector(texSelector)) {
            Array.from(line.querySelectorAll(texSelector)).forEach(tex => {
              let query = new URLSearchParams(tex.getAttribute("src").split("?")[1]);
              aStr += query.get("f");
            });
          }
          Profanity.forEach(regProf => {
            if (regProf.test(line.innerHTML)) {
              return line.querySelector("span[data-slate-node = 'text']").classList.add("highlight");
            }
          });
        });

        let count = document.querySelector(".remaining-count") as HTMLElement;
        count.innerText = "";
        if (aStr.length <= 5000) {
          numChart.data.datasets[0].backgroundColor[0] = "#0089e3";
          if (aStr.length > 4900) count.innerText = (5000 - aStr.length) + "";
          numChart.data.datasets[0].data = [aStr.length / 5000, 1 - (aStr.length / 5000)];
        } else {
          numChart.data.datasets[0].data = [1, 0];
          numChart.data.datasets[0].backgroundColor[0] = "#ff341a";
        }
        numChart.update();
      }
    });
  } 
});
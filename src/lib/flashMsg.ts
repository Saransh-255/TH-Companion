export default function flashMsg(message:string, type: "success" | "error" | "info") {
  let flashbox = document.querySelector(".flash-messages-container") 
    || document.querySelector("#flash-msg");

  let flashmsg = document.createElement("div");
  flashmsg.classList.add("sg-flash");
  flashmsg.innerHTML = /*html*/`
    <div class="sg-flash__message sg-flash__message--${type}">
        <div class="sg-text sg-text--small sg-text--bold sg-text--to-center">${message}</div>
    </div>
  `;
  flashmsg.addEventListener("click", function() {
    flashmsg.remove();
  });
  flashbox.appendChild(flashmsg);
}
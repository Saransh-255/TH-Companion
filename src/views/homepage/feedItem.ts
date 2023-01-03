/* eslint-disable indent */
import { ptsLabel, avatar, buttonElem, subjectIcon, icon } from "components/elements";

export default function feedItem(data) {
  let qid = atob(data.question.id).split(":")[1];
  let box = /*html*/`
    <div class="fyp-feed-item sg-box sg-box--transparent sg-box--no-shadow sg-box--border-radius sg-box--padding-m">

      <div class="sg-flex headrow" style = "gap: 8px">
        <a class="sg-text sg-text--link-unstyled sg-text--bold" 
          href = "https://brainly.com/question/${qid}"
        >
          <div class = "sg-text sg-text--medium sg-text--break-words fyp-content">
            ${data.question.content.trim().replaceAll("<br />\n", " ")}
          </div>
        </a>
        <div class="sg-flex report-pts">
          ${
            buttonElem({
              type: "transparent",
              size: "s",
              iconOnly: true,
              icon: {
                type: "report_flag_outlined",
                color: "gray-50",
                size: "24"
              },
              id: "rep" + qid,
              classes: ["report"]
            }).outerHTML
          }
          ${
            ptsLabel("+" + data.question.pointsForAnswer)
          }
        </div>
      </div>

      <div class="sg-flex info">
        <div class="sg-flex user" style = "gap: 4px;">
          ${avatar({ 
            id: atob(data.question.author.id).split(":")[1] + "", 
            avatarURL: data.question.author.avatar?.thumbnailUrl + "" 
          })}
          <div class = "sg-text sg-text--text-gray-60 sg-text--medium sg-text--bold">
            ${
              subjectIcon({
                size: "medium",
                type: data.question.subject.icon,
                color: "adaptive"
              }).outerHTML
            }
            ${
              data.question.attachments.length ? icon({
                size: "16",
                type: "attachment",
                color: "gray-70"
              }).outerHTML : ""
            }
          </div>
        </div>
        <div class="sg-flex fyp-buttons" style = "gap: 0.5rem">
        ${
            buttonElem({
              icon: {
                type: "seen",
                size: "24",
                color: "white"
              },
              classes: ["fyp"],
              type: "solid",
              size: "m",
              iconOnly: true,
              id: "id" + qid
            }).outerHTML
          }
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
                href: `https://brainly.com/question/${qid}?answering=true`,
              }).outerHTML
            }
        </div>
      </div>
    </div>
  `;

  return box;
}
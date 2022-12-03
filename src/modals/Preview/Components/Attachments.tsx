import React from "react";

export default function Attachments({ attachments }) {
  if (attachments.length) {
    return (
      <div className = "attachments">
        <div className = "attachment-view">
          <img src={attachments[0].full} alt="" />
        </div>
      </div>
    );
  }
}
import React from "react";
import "./collabration-notification-card.style.scss";

const CollabrationNotificationCard = (props) => {
  return (
    <div className="collabration-notification-card">
      <h2>{props.requestedProject}</h2>
      <span>{props.user} want to collabrate with you.</span>
      <br />
      <br />
      <div className="mod-button">{props.children}</div>
    </div>
  );
};

export default CollabrationNotificationCard;

import React from "react";
import { Link } from "react-router-dom";
import "./collabration-notification-card.style.scss";

const CollabrationNotificationCard = (props) => {
  return (
    <div className="collabration-notification-card">
      <h2>{props.requestedProject}</h2>
      <span>
        <Link to={`/public-profile/${props.user_id}`}>{props.user}</Link>
        want to collaborate with you.
      </span>
      <br />
      <br />
      <div className="mod-button">{props.children}</div>
    </div>
  );
};

export default CollabrationNotificationCard;

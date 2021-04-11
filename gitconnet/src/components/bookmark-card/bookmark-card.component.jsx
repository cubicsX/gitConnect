import React from "react";
import "./bookmark-card.style.scss";

const BookmarkCard = (props) => {

  return (
    <div className="bookmark-card">
      <h2>{props.projectTitle}</h2>
      <span>{props.projectDescription}</span>
      <br />
      <br />
      {props.children}
    </div>
  );
};

export default BookmarkCard;

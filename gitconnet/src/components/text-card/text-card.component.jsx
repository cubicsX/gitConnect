import React from "react";
import "./text-card.style.scss";

const TextCard = ({ text }) => {
  return (
    <div className="text-card">
      <h2 className="text-card-title">{text}</h2>
    </div>
  );
};

export default TextCard;

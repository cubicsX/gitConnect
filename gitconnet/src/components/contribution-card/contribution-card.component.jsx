import React from "react";
import "./contribution-card.style.scss";

const ContributionCard = (props) => {
  console.log(props);
  return (
    <div className="contribution-card">
      <h2>{props.projectTitle}</h2>
      <span>{props.projectDescription}</span>
    </div>
  );
};

export default ContributionCard;

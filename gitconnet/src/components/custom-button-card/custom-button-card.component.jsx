import React from "react";
import "./custom-button-card.style.scss";

const CustomButtonCard = ({ classname, imageURL, imageText, url }) => {
  return (
    <a className="custom-button-card" href={url} target="_blank">
      <img className={classname} src={imageURL} alt={imageText} />
    </a>
  );
};

export default CustomButtonCard;

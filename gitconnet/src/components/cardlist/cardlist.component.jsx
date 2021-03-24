import React from "react";
import "./cardlist.style.scss";

const CardList = (props) => {
  return <div className="card-list">{props.children}</div>;
};

export default CardList;

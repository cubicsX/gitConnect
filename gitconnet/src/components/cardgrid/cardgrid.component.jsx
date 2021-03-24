import React from "react";
import "./cardgrid.style.scss";

const CardGrid = (props) => {
  return (
    <div
      className="card-grid"
      style={{
        "grid-template-columns": props.gridColumn,
      }}
    >
      {props.children}
    </div>
  );
};

export default CardGrid;

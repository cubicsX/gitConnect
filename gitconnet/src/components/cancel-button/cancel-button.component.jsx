import React from "react";
import "./cancel-button.style.scss";

const CancelButton = ({ id, onClick }) => {
  return (
    <button className="cancel-button" id={id} onClick={onClick}>
      X
    </button>
  );
};

export default CancelButton;

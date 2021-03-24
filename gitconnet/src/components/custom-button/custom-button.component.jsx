import React from "react";

import "./custom-button.style.scss";

const CustomButton = ({ title, type, ...otherProps }) => {
  return (
    <button className="custom-button" type={type} {...otherProps}>
      {title}
    </button>
  );
};

export default CustomButton;

// This is VerticalScroll Component.
// Every Component that will be display in vertical
// scroll view that will be disply by this Component.

import React, { Component } from "react";
import CustomButton from "../custom-button/custom-button.component";

import "./vertical-scroll.style.scss";

const VerticalScroll = (props) => {
  return (
    <div className="vertical-scroll" style={{ height: props.height }}>
      {props.children}
    </div>
  );
};

export default VerticalScroll;

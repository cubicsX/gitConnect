import React from "react";
import "./404Page.style.scss";

import NeumorphicText from "../../components/neumorphic-text/neumorphic-text.component";

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <NeumorphicText text="404" />
      <span className="error-message-404">
        Page Not Found.Page Not Found.Page Not Found.Page Not Found.Page Not
        Found.Page Not Found.Page Not Found.
      </span>
    </div>
  );
};

export default PageNotFound;

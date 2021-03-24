import React from "react";
import "./form-textbox.style.scss";

import Card from "../card/card.component";

const FormTextbox = ({ placeholder, value, onChange }) => {
  return (
    <div className="custom-card">
      <Card>
        <input
          className="custom-textbox"
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      </Card>
    </div>
  );
};

export default FormTextbox;

import React from "react";
import "./form-input.style.scss";

import Card from "../card/card.component";

const FormInput = ({ placeholder, value, onChange }) => {
  return (
    <Card>
      <input
        className="custom-input"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </Card>
  );
};

export default FormInput;

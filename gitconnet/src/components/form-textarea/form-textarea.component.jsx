import React from "react";
import "./form-textarea.style.scss";

import Card from "../card/card.component";

const FormTextArea = ({ placeholder, value, onChange }) => {
  return (
    <Card>
      <textarea
        rows="5"
        cols="7"
        className="custom-textarea"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </Card>
  );
};

export default FormTextArea;

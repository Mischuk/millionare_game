import React from "react";
import "./Button.scss";

const Button = ({ event, children }) => (
  <button onClick={event} className="button">
    {children}
  </button>
);

export default Button;

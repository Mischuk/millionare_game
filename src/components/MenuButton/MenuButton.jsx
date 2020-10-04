import React from "react";
import "./MenuButton.scss";

const MenuButton = ({ openMenu }) => (
  <div className={`menu-button ${openMenu ? "is-open" : ""}`}>
    <div className="menu-button__line"></div>
  </div>
);

export default MenuButton;

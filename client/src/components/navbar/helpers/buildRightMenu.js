import React from "react";
import LoginComponent from "../../authorization/LoginComponent.jsx";
import RegistrationComponent from "../../authorization/RegistrationComponent.jsx";

/**
 * Builds inner right menu based on user click.
 * @param {string} clickValue the Target value for right menu bar.
 * @returns {object} React Component to render in the right menu.
 */
const buildRightMenu = (clickValue, {...props}) => {
  console.log("from function " + clickValue);
  switch(clickValue) {
    case "login": 
      return (
        <LoginComponent />
      );
    case "register":
      return (
        <RegistrationComponent />
      )
    default: 
      return (
        <div>
          <h3>Nothing Here</h3>
        </div>
      )
    }
  };
  export default buildRightMenu;
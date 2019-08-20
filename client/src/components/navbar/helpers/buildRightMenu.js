import React from "react";
import LoginComponent from "../../authorization/LoginComponent.jsx";
import RegistrationComponent from "../../authorization/RegistrationComponent.jsx";


const buildRightMenu = function(value, props){
  switch(value) {
    case "login": 
      return (
        <LoginComponent
          closeWindow={props.closeWindow}
         />
      );
    case "register":
      return (
        <RegistrationComponent 
          closeWindow={props.closeWindow}
        />
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
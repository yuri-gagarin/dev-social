import React from "react";
import {Message, Icon} from "semantic-ui-react";
import style from "../assets/stylesheets/errors/errors.scss";
import isEmpty from "./validators/isEmpty.js";

/**
 * Displays a fixed error message on screen.
 * @param {Object} errorState Redux error state.
 * @param {function} clearErrors Clear Error functon.
 * @returns {Object} React Component with an error message or NULL if no error.
 */
export default function(errorState, clearErrors) {

  //should dismiss the error and set error state to null
  const dismissMessage = () => {
    clearErrors();
  };

  if (!isEmpty(errorState)) {
    return (
      <Message id={style.generalErrorMessage} error>
        <Message.Header>
          "Ow! An error occured"
        </Message.Header>
        <Icon name="close" onClick={dismissMessage} id={style.errorDissmissButton}></Icon>
        <Message.Content>
          <span>{`* Status Code: ${errorState.statusCode}`}</span>
        </Message.Content>
        <Message.Content>
          <span>{`* Message: ${errorState.statusText}`}</span>
        </Message.Content>
      </Message>
    )
  }
  else {
    return null;
  }
};
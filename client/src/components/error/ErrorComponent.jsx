import React from "react";
import PropTypes from "prop-types";
import { Message, Icon } from "semantic-ui-react";

import { connect } from "react-redux";
import { clearErrors } from "../../redux/actions/errorActions";

import { isEmpty } from "../../helpers/validators/dataValidators";

import style from "../../assets/stylesheets/errors/errors.scss";

const ErrorComponent = (props) => {

  const {errorState, clearErrors} = props;
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
 
const mapStateToProps = (state) => {
  return {
    errorState: state.error,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    clearErrors: () => dispatch(clearErrors()),
  };
};
ErrorComponent.propTypes = {
  errorState: PropTypes.object.isRequired,
};



export default connect(mapStateToProps, mapDispatchToProps)(ErrorComponent);
import React from "react";
import {Message, Divider} from "semantic-ui-react";

const displayFormErrors = (errors, state={}) => {
  if(errors) {
    return (
      <Message
        error
        header={errors.message}
      />
    );
  }
  else {
    return (
      <Divider />
    );
  }
};

export default displayFormErrors;
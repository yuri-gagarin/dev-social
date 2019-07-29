
export const testAction = () => {
  return (dispatch) => {
    dispatch({
      type: "TEST_ACTION",
      payload: "result of the test action"
    });
  }
};


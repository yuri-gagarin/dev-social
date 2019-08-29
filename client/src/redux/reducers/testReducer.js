const initState = {
  test: "true",
  testString: "Test String",
  tested: "Not Tested"
};


export default function(state=initState, action) {
  switch(action.type) {
    case "TEST":
      return {
        ...state,
        tested: action.payload
      };
    case "CANCEL_TEST":
      return {
        ...state,
        tested: action.payload
      };
    default:
      return state;
  }
};



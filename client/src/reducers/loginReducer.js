export default function(state={}, action) {
  switch(action.type){
    case "COUNT":
      return ({
        result: action.payload
      });
    case "TEST_ACTION":
      return ({
        result: action.payload
      });
    default:
      return state;
  }
};

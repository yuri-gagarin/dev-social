export default function(state={}, action) {
  switch(action.type){
    case "COUNT":
      return ({
        result: action.payload
      });
    case "LOGIN":
      return ({
        result: action.payload
      });
    default:
      return state;
  }
};

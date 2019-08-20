import axios from "axios";

const setAuthToken = (token) => {
  if(token) {
    //if a token set axios defaults
    axios.defaults.headers.common["Authorization"] = token;
  }
  else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
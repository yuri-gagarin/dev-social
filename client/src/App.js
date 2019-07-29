import React from "react";
import {connect} from "react-redux";
import axios from "axios";
import SplashPage from "./components/SplashPage.jsx"
import {appAction} from "./actions/testAction.js";
import homeIcon from "./assets/images/iconfinder_go-home_118770.svg";

let homeImg = document.getElementById("home");
homeImg.src = homeIcon;

class App extends React.Component {
  constructor() {
    super();
    this.clickButton = this.clickButton.bind(this);
  }
  clickButton() {
    axios({
      method: "GET",
      url: "api/posts/newest"
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    })
  }
  render() {
    return (
      <div>
        <SplashPage 
          
        />
      </div>
    );
  }
};

export default connect()(App);
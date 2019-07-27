import React from "react";
import axios from "axios";
import SplashPage from "./components/SplashPage.jsx"

export default class App extends React.Component {
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
}
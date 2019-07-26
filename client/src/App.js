import React from "react";
import axios from "axios";

export default class App extends React.Component {
  constructor() {
    super();
    this.clickButton = this.clickButton.bind(this);
  }
  clickButton() {
    axios({
      method: "GET",
      url: "posts/newest"
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
        <h2>React Test</h2>
        <div>
          <button type="button" onClick={this.clickButton}>Click Me</button>
        </div>
      </div>
    );
  }
}
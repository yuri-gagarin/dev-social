import React from "react";
import {connect} from "react-redux";
import axios from "axios";
import SplashPage from "./components/SplashPage.jsx"
import {test, cancelTest} from "./actions/appAction.js";
import homeIcon from "./assets/images/iconfinder_go-home_118770.svg";

let homeImg = document.getElementById("home");
homeImg.src = homeIcon;

class App extends React.Component {
  constructor() {
    super();
    this.clickButton = this.clickButton.bind(this);
    this.testRedux = this.testRedux.bind(this);
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
  testRedux(e) {
    console.log(this)
    this.props.test();
  }
  cancelTest(e) {
    console.log(this)
    this.props.cancelTest();
  }
  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.props)}</pre>
        <SplashPage />
        <button onClick={this.testRedux}>TEST REDUX</button>
        <button onClick={(e) => this.cancelTest(e)}>CANCEL TEST</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    test: () => dispatch(test),
    cancelTest: () => dispatch(cancelTest)
  };
};

export default connect(mapStateToProps, {test: test, cancelTest: cancelTest})(App);
import React, {Component, Fragment} from "react";
import MainNav from "./components/navbar/MainNav.jsx";
import WelcomeComponent from "./components/welcome_page/WelcomeComponent.jsx";
import Footer from "./components/footer/Footer.jsx";
//redux and routing
import {connect} from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import axios from "axios";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftItems: [],
      innerMainItems: {},
      rightItems: [],
    };
  }

  componentDidMount() {
    this.buildNavBar(this.props.authState);
  }

  buildNavBar = (authState) => {
    console.log(authState)
    axios
      .get("/api/getmainnav", {params: 
        {loggedIn: authState.loggedIn}
      })
      .then((response)=> {
          this.setState({
            leftItems: response.data.sideMain,
            innerMainItems: response.data.innerMain,
            rightItems: response.data.rightItems,
          });
      })
      .catch((error) => {console.log(error)});
  }

  render() {
    const {leftItems, innerMainItems, rightItems} = this.state;
    return (
      <Fragment>
        <Router>
          <MainNav
            leftItems = {leftItems}
            rightItems = {rightItems}
            innerMainItems = {innerMainItems} >
                <Route exact path="/" component={WelcomeComponent} />
          </MainNav>
          <Footer></Footer>
        </Router>
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    authState: state.auth,
  };
};

export default connect(mapStateToProps, null)(App);
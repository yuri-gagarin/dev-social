import React, {Component, Fragment} from "react";
import {Responsive} from "semantic-ui-react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
//redux imports
import {connect} from "react-redux";
import {fetchData} from "../../redux/actions/appAction";
import {logoutUser} from "../../redux/actions/authActions";

import NavbarHandheld from "./handheld/NavbarHandheld";
import NavbarTablet from "./tablet/NavbarTablet";
import NavbarDesktop from "./desktop/NavbarDesktop";


const NavbarChildren = ({ children }) => {
  return (
    <Fragment>
      {children}
    </Fragment>
  );
};

/*
/ We will have three different Navbars here depends on size of the screen
/ {NavbarHandheld} for most cell phones 
/ {NavbarTablet} for most tablets
/ {NavbarDescktop} for most desktops
*/

export class MainNav extends Component {
  constructor(props) {
    super(props);
    //console.log(props);
  }
  onPusherToggle = () => {
    const {pusherVisible, mainVisible, innerMainVisible, dashOpen} = this.props.navState;
    if (pusherVisible && mainVisible && !innerMainVisible) {
      this.props.closeMain();
    }
    else if (pusherVisible && dashOpen) {
      this.props.closeDash();
    }
    else if (pusherVisible && innerMainVisible) {
      setTimeout(() => {
        this.props.closeMain();
      }, 500);
      this.props.closeInnerMain();
    }
  };
  fetchData = (options) => {
    this.props.fetchData(options);
  }
  //logout function
  logoutUser = (userData, history) => {
    this.props.logoutUser(userData, history);
  };

  render() {
    const children = this.props.children;
    return (
      <div data-test="main-nav">
        <Responsive maxWidth={0} maxWidth={414}>
          <NavbarHandheld data-test="navbar-handheld">
          <NavbarChildren>{children}</NavbarChildren>
          </NavbarHandheld>
        </Responsive>

        <Responsive minWidth={415} maxWidth={1023}>
          <NavbarTablet data-test="navbar-tablet">
          <NavbarChildren>{children}</NavbarChildren>
          </NavbarTablet>

        </Responsive>
        <Responsive minWidth={1024} className="">
          <NavbarDesktop 
            data-test="navbar-desktop"
            onPusherToggle={this.onPusherToggle}
            logoutUser={this.logoutUser}
            navState={this.props.navState}
            authState={this.props.authState}
          >
          <NavbarChildren>{children}</NavbarChildren>
          </NavbarDesktop>
        </Responsive>
      </div>
    );
  }
};


MainNav.propTypes = {
  authState: PropTypes.object.isRequired,
  navState: PropTypes.object.isRequired,
  //fetchData: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: (userData, history) => dispatch(logoutUser(userData, history)),
    fetchData: (options) => dispatch(fetchData(options)),
  };
};

const mapStateToProps = (state) => {
  return {
    authState: state.authState,
    navState: state.navState,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainNav)); 
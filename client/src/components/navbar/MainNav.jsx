import React, {Component, Fragment} from "react";
import {Responsive} from "semantic-ui-react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
//redux imports
import {connect} from "react-redux";
import {logoutUser} from "../../redux/actions/authActions.js";
import {openMain, closeMain, openInnerMain, closeInnerMain, openDash, closeDash} from "../../redux/actions/navActions.js";

import NavbarHandheld from "./handheld/NavbarHandheld.jsx";
import NavbarTablet from "./tablet/NavbarTablet.jsx";
import NavbarDesktop from "./desktop/NavbarDesktop.jsx";


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

class MainNav extends Component {
  constructor(props) {
    super(props);
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
  //main menu functions
  openMain = () => {
    this.props.openMain(this.props.authState);
  };
  closeMain = () => {
    const {innerMainVisible} = this.props.navState;
    //this is for larger devices to close both menus smoothly
    if (innerMainVisible) {
      setTimeout(() => {
        this.props.closeMain();
      }, 500);
      this.props.closeInnerMain();
    }
    else {
      this.props.closeMain();
    }
  };
  openInnerMain = (event, {content}) => { 
    this.props.openInnerMain(this.props.authState, content.toLowerCase());
  };
  closeInnerMain = () => {
    this.props.closeInnerMain();
  };
  //dashboard functions
  openDash = () => {
    this.props.openDash(this.props.authState);
  };
  closeDash = () => {
    this.props.closeDash();
  };
  //logout function
  logoutUser = (userData, history) => {
    this.props.logoutUser(userData, history);
  };

  render() {
    const children = this.props.children;
    return (
      <Fragment>
        <Responsive maxWidth={0} maxWidth={414}>
          <NavbarHandheld>
          <NavbarChildren>{children}</NavbarChildren>
          </NavbarHandheld>
        </Responsive>

        <Responsive minWidth={415} maxWidth={1024}>
          <NavbarTablet>
          <NavbarChildren>{children}</NavbarChildren>
          </NavbarTablet>

        </Responsive>
        <Responsive minWidth={1025} className="">
          <NavbarDesktop
            onPusherToggle={this.onPusherToggle}
            openMain={this.openMain}
            closeMain={this.closeMain}
            openInnerMain={this.openInnerMain}
            closeInnerMain={this.closeInnerMain}
            openDash={this.openDash}
            closeDash={this.closeDash}
            logoutUser={this.logoutUser}
            navState={this.props.navState}
            authState={this.props.authState}
          >
          <NavbarChildren>{children}</NavbarChildren>
          </NavbarDesktop>
        </Responsive>
      </Fragment>
    );
  }
};


MainNav.propTypes = {
  authState: PropTypes.object.isRequired,
  navState: PropTypes.object.isRequired,
  openMain: PropTypes.func.isRequired,
  closeMain: PropTypes.func.isRequired,
  openInnerMain: PropTypes.func.isRequired,
  closeInnerMain: PropTypes.func.isRequired,
  openDash: PropTypes.func.isRequired,  
  closeDash: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => {
  return {
    openMain: (authState) => dispatch(openMain(authState)),
    closeMain: () => dispatch(closeMain()),
    openInnerMain: (authState, content) => dispatch(openInnerMain(authState, content)),
    closeInnerMain: () => dispatch(closeInnerMain()),
    openDash: (authState) => dispatch(openDash(authState)),
    closeDash: () => dispatch(closeDash()),
    logoutUser: (userData, history) => dispatch(logoutUser(userData, history)),
  };
};

const mapStateToProps = (state) => {
  return {
    authState: state.auth,
    navState: state.nav,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainNav)); 
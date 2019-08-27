import React, {Component, Fragment} from "react";
import {Container, Responsive} from "semantic-ui-react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";

import {connect} from "react-redux";
import {logoutUser} from "../../actions/authActions.js";
import jwtDecode from "jwt-decode";

import {guestNav, userNav} from "./nav_data/navData.js";
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
    this.state = {
      leftItems: [],
      innerMainItems: {},
      rightItems: [],
      pusherVisible: false,
      mainVisible: false,
      innerMainVisible: false,
      innerMainToOpen: null,
      rightVisible: false,
      rightInnerItems: null,

    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.authState !== this.props.authState) {
      this.buildNavBar(this.props.authState);
    }
  }
  buildNavBar = (authState) => {
   
    if(authState.loggedIn) {
      this.setState({
        leftItems: userNav.sideMain,
        innerMainItems: userNav.innerMain,
        rightItems: userNav.rightItems,
      });
    }
    else {
      this.setState({
        leftItems: guestNav.sideMain,
        innerMainItems: guestNav.innerMain,
        rightItems: guestNav.rightItems,
      })
    }
  }
  onPusherToggle = () => {
    const {pusherVisible, innerMainVisible, mainVisible, rightVisible} = this.state;
    if (pusherVisible && mainVisible && !innerMainVisible) {
      this.setState({
        pusherVisible: false,
        mainVisible: false,
      });
    }
    else if (pusherVisible && innerMainVisible) {
      setTimeout(() => {
        this.setState({
          pusherVisible: false,
          mainVisible: false,
        });
      }, 500);
      this.setState({
        innerMainVisible: false,
      });
    }
    else if (pusherVisible && rightVisible) {
      this.setState({
        pusherVisible: false,
        rightVisible: false,
      })
    }
  }
  //handheld methods
  onMainToggle = (event) => {
    const {mainVisible, innerMainVisible} = this.state;
    if (mainVisible && innerMainVisible) {
      setTimeout(() => {
        this.setState({
          mainVisible: false,
        });
      },500);
      this.setState({
        pusherVisible: false,
        innerMainVisible: false,
      });
    }
    else {
      this.setState({
        mainVisible: !this.state.mainVisible,
        pusherVisible: !this.state.pusherVisible,
      });
    }
  }
  onMainInnerHandheldToggle = (event) => {
    let toOpen = event.target.getAttribute("value");
    if(toOpen) toOpen = toOpen.toLowerCase();
    this.setState({
      innerMainVisible: !this.state.innerMainVisible,
      innerMainToOpen: toOpen || null
    });
  }

  // end handheld methods

  //tablet methods
  onInnerMainToggle = (event) => {
    let toOpen = event.target.dataset.inner;
    if(toOpen) toOpen = toOpen.toLowerCase();
    this.setState({
      innerMainVisible: !this.state.innerMainVisible,
      innerMainToOpen: toOpen || null,
    })
  }
  onRightToggle = (event) => {
    if(!event) {
      return this.setState({
        rightVisible: !this.state.rightVisible,
        rightInnerItems: null,
      });
    }
    let inner = event.target.dataset.inner;
    if(inner) inner = inner.toLowerCase();
    if(inner === "logout") {
      const user = jwtDecode(localStorage.jwtToken);
      console.log("Logging out");
      this.props.logoutUser(user, this.props.history);
      return;
    }
    this.setState({
      rightVisible: !this.state.rightVisible,
      rightInnerItems: inner || null,
    });
  }
  //end tablet methods

  //desktop methods

  //end desktop methods

  render() {
    const {children} = this.props;
    const {leftItems, innerMainItems, rightItems, pusherVisible, mainVisible, innerMainVisible, innerMainToOpen, rightVisible, rightInnerItems} = this.state;
    console.log("Rendered MainNav")
    return (
      <Fragment>
        <Responsive maxWidth={0} maxWidth={414}>
          <NavbarHandheld
            pusherVisible={false}
            mainVisible={mainVisible}
            onMainToggle={this.onMainToggle}
            mainItems={leftItems}
            innerMainVisible={innerMainVisible}
            innerMainToOpen={innerMainToOpen}
            onInnerMainToggle={this.onInnerMainToggle}
            innerMainItems={innerMainItems}
            rightItems={rightItems}
            rightVisible={rightVisible}
            onRightToggle={this.onRightToggle}
            rightInnerItems={rightInnerItems} >
          <NavbarChildren>{children}</NavbarChildren>
          </NavbarHandheld>
        </Responsive>

        <Responsive minWidth={415} maxWidth={1024}>
          <NavbarTablet
            pusherVisible={pusherVisible}
            onPusherToggle={this.onPusherToggle}
            mainVisible={mainVisible}
            onMainToggle={this.onMainToggle}
            mainItems={leftItems}
            innerMainVisible={innerMainVisible}
            innerMainToOpen={innerMainToOpen}
            onInnerMainToggle={this.onInnerMainToggle}
            innerMainItems={innerMainItems}
            rightItems={rightItems}
            rightVisible={rightVisible}
            onRightToggle={this.onRightToggle}
            rightInnerItems={rightInnerItems} >
          <NavbarChildren>{children}</NavbarChildren>
          </NavbarTablet>

        </Responsive>
        <Responsive minWidth={1025} className="">
          <NavbarDesktop 
            pusherVisible={pusherVisible}
            onPusherToggle={this.onPusherToggle}
            mainVisible={mainVisible}
            onMainToggle={this.onMainToggle}
            mainItems={leftItems}
            innerMainVisible={innerMainVisible}
            innerMainToOpen={innerMainToOpen}
            onInnerMainToggle={this.onInnerMainToggle}
            innerMainItems={innerMainItems}
            rightItems={rightItems}
            rightVisible={rightVisible}
            onRightToggle={this.onRightToggle}
            rightInnerItems={rightInnerItems} >
          <NavbarChildren>{children}</NavbarChildren>
          </NavbarDesktop>
        </Responsive>
      </Fragment>
    );
  }
}

MainNav.propTypes = {
  leftItems: PropTypes.array,
  innerMainItems: PropTypes.object,
  rightVisible: PropTypes.array,
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: (userData, history) => dispatch(logoutUser(userData, history)),
  }
};

const mapStateToProps = (state) => {
  return {
    authState: state.auth,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MainNav)); 
import React, {Component} from "react";
import {Container, Responsive} from "semantic-ui-react";

import NavbarHandheld from "./handheld/NavbarHandheld.jsx";
import NavbarTablet from "./tablet/NavbarTablet.jsx";
import NavbarDesktop from "./desktop/NavbarDesktop.jsx";


const NavbarChildren = ({ children }) => {
  return (
    <Container style={{marginTop: "5em"}}>
      {children}
    </Container>
  );
};

/*
/ We will have three different Navbars here depends on size of the screen
/ {NavbarHandheld} for most cell phones 
/ {NavbarTablet} for most tablets
/ {NavbarDescktop} for most desktops
*/

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pusherVisible: false,
      mainVisible: false,
      innerMainVisible: false,
      innerMainToOpen: null,
      authVisible: false
    };
  }
  onPusherClick = () => {
    const {pusherVisible} = this.state;
    if (pusherVisible) { this.setState({pusherVisible: false}) };
  }
  handletoggle = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }
  //handheld methods
  onLeftToggle = () => {
    this.setState({
      mainVisible: !this.state.mainVisible,
      pusherVisible: !this.state.pusherVisible,
      visible: false,
    });
  } 
  onLeftSubcategoryHandheldToggle = (data) => {
    this.setState({
      innerMainVisible: !this.state.innerMainVisible,
      innerMainToOpen: data.content || null
    }, () => {
      console.log(this.state);
    });
  }
  // end handheld methods

  //tablet methods

  //end tablet methods

  //desktop methods

  //end desktop methods

  render() {
    const {children, leftItems, rightItems} = this.props;
    const {pusherVisible, mainVisible, innerMainVisible, innerMainToOpen, authVisible} = this.state;

    return (
      <div>
        <Responsive maxWidth={0} maxWidth={768}>
          <NavbarHandheld
            leftItems={leftItems}
            rightItems={rightItems}
            onPusherClick={this.onPusherClick} 
            onToggle={this.handletoggle}
            onLeftToggle={this.onLeftToggle}
            onLeftSubcategoryToggle={this.onLeftSubcategoryHandheldToggle}
            pusherVisible={pusherVisible}
            leftVisible={mainVisible}
            leftInnerVisible={innerMainVisible}
            leftInnerToOpen={innerMainToOpen}
            rightVisible={authVisible}
          >
            <NavbarChildren>{children}</NavbarChildren>
          </NavbarHandheld>
        </Responsive>

        <Responsive minWidth={769} maxWidth={1024}>
          <NavbarTablet
            leftItems={leftItems}
            rightItems={rightItems}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            pusherVisible={pusherVisible}
          >
          <NavbarChildren>{children}</NavbarChildren>
          </NavbarTablet>

        </Responsive>
        <Responsive minWidth={1025}>
          <NavbarDesktop 
            leftItems={leftItems} 
            rightItems={rightItems} 
          >
          <NavbarChildren>{children}</NavbarChildren>
          </NavbarDesktop>
        </Responsive>
      </div>
    );
  }
}

export default Navbar;
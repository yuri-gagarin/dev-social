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
      visible: false,
      leftVisible: false,
    };
  }
  handlePusher = () => {
    const {visible} = this.state;
    if (visible) { this.setState({visible: false}) };
  }
  handletoggle = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }
  onLeftToggle = () => {
    this.setState({
      leftVisible: !this.state.leftVisible,
      visible: false,
    }, () => {
      console.log("toggling left sidebar")
      console.log(this.state);
    });
  } 
  onInnerLeftHandheldToggle = () => {
    this.setState({
      leftInnerVisible: !this.state.leftItems
    });
  }

  render() {
    const {children, leftItems, rightItems} = this.props;
    const {visible, leftVisible} = this.state;

    return (
      <div>
        <Responsive maxWidth={0} maxWidth={768}>
          <NavbarHandheld
            leftItems={leftItems}
            rightItems={rightItems}
            onPusherClick={this.handlePusher} 
            onToggle={this.handletoggle}
            onLeftToggle={this.onLeftToggle}
            visible={visible}
            leftVisible={leftVisible}
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
            visible={visible}
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
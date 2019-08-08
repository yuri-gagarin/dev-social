import React, {Component} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu} from "semantic-ui-react";

const leftItems = [
  { as: "a", content: "Home", key: "home", onClick: "" },
  { as: "a", content: "Users", key: "users" }
];
const rightItems = [
  { as: "a", content: "Login", key: "login" },
  { as: "a", content: "Register", key: "register" }
];


const NavbarMobile = ({ children, leftItems, rightItems, onPusherClick, onToggle, visible }) => {
  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible={visible}
        style={{width: "50vw", height: "100vh"}}
      >
      <Menu.Item as='a' onClick={onToggle}>
        <Icon name='arrow left'/>
        Back
      </Menu.Item>
      { leftItems.map((item) => <Menu.Item {...item}></Menu.Item>) }
      </Sidebar>

      <Sidebar.Pusher
        dimmed={visible}
        onClick={onPusherClick}
        style={ {height: "100vh"} }
        >
          <Menu fixed="top" inverted>
            <Menu.Item>
              <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
            </Menu.Item>
            <Menu.Item onClick={onToggle}>
              <Icon name="sidebar" />
            </Menu.Item>
            <Menu.Menu position="right">
              {rightItems.map((item) => <Menu.Item {...item} /> )}
            </Menu.Menu>
          </Menu>
        {children}
      </Sidebar.Pusher>

    </Sidebar.Pushable>
  );
};


const NavbarTablet = ({children, leftItems, rightItems, onPusherClick, onLeftToggle, onLeftExpandToggle, onAuthToggle}) => {
  return (
    <Sidebar.Pushable>
      <Sidebar.Pusher>
        <Menu fixed="top" inverted>
          <Menu.Item>
            <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
          </Menu.Item>
            { leftItems.map((item) => <Menu.Item {...item} />) }
          <Menu.Menu position="right">
            { rightItems.map((item) => <Menu.Item {...item} />) }
          </Menu.Menu>
        </Menu>
        {children}
      </Sidebar.Pusher>
      {children}
    </Sidebar.Pushable>
  );
}

const NavbarDesktop = ({ leftItems, rightItems, children }) => {
  return (
    <Sidebar.Pushable>
      <Sidebar.Pusher>
        <Menu fixed="top" inverted>
          <Menu.Item>
            <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
          </Menu.Item>
            { leftItems.map((item) => <Menu.Item {...item} />) }
          <Menu.Menu position="right">
            { rightItems.map((item) => <Menu.Item {...item} />) }
          </Menu.Menu>
        </Menu>
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};



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

  render() {
    const {children, leftItems, rightItems} = this.props;
    const {visible} = this.state;

    return (
      <div>
        <Responsive maxWidth={0} maxWidth={768}>
          <NavbarMobile
            leftItems={leftItems}
            rightItems={rightItems}
            onPusherClick={this.handlePusher} 
            onToggle={this.handletoggle}
            visible={visible}
          >
            <NavbarChildren>{children}</NavbarChildren>
          </NavbarMobile>
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
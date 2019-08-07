import React, {Component} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu} from "semantic-ui-react";

const NavBarMobile = ({ children, leftItems, rightItems, onPusherClick, onToggle, visible }) => {
  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        items={leftItems}
        vertical
        visible={visible}
      />
      <Sidebar.Pusher
        dimmed={visible}
        onClick={onPusherClick}
        style={{minHeight: "100vh", width: "50vw"}}>
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

const NavBarDesktop = ({ leftItems, rightItems }) => {
  return(
    <Menu fixed="top" inverted>
      <Menu.Item>
        <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
      </Menu.Item>
      {leftItems.map((item) => <Menu.Item {...item} /> )}
      <Menu.Menu position="right">
        {rightItems.map((item) => <Menu.Item {...item} /> )}
      </Menu.Menu>
    </Menu>
  );
};

const NavBarChildren = ({ children }) => {
  return (
    <Container style={{marginTop: "5em"}}>
      {children}
    </Container>
  );
}

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }
  handlePusher() {
    const {visible} = this.state;
    if (visible) { this.setState({visible: false}) };
  }
  handletoggle() {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    const {children, leftItems, rightItems} = this.props;
    const {visible} = this.state;

    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>
          <NavBarMobile
            leftItems={leftItems}
            rightItems={rightItems}
            onPusherClick={ () => {this.handlePusher()} }
            onToggle={ () => {this.handletoggle()} }
            visible={visible}
          >
            <NavBarChildren>{children}</NavBarChildren>
          </NavBarMobile>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
          <NavBarChildren>{children}</NavBarChildren>
        </Responsive>
      </div>
    );
  }
}

export default Navbar;
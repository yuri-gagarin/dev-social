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

//these should be dynamic based on user status and login
const innerLeftSidebarOptions = {
  news: [
    { as: "a", content: "Newest", key: "newest"},
    { as: "a", content: "Popular", key: "popular"},
    { as: "a", content: "Controversial", key: "controversial"},
    { divider: "-", key: "handheldNavPostDivider"},
    { as: "a", content: "Create New", key: "createNewArticle"},
    { as: "a", content: "My Articles", key: "myArticles"},
  ],
  topics: [
    { as: "a", content: "Newest", key: "newest"},
    { as: "a", content: "Popular", key: "popular"},
    { as: "a", content: "Controversial", key: "controversial"},
    { divider: "-", key: "handheldNavPostDivider"},
    { as: "a", content: "Create New", key: "createNew"},
    { as: "a", content: "My Topics", key: "myPosts"},
  ],
  posts: [
    { as: "a", content: "Newest", key: "newest"},
    { as: "a", content: "Popular", key: "popular"},
    { as: "a", content: "Controversial", key: "controversial"},
    { divider: "-", key: "handheldNavPostDivider"},
    { as: "a", content: "Create New", key: "createNew"},
    { as: "a", content: "My Posts", key: "myPosts"},
  ],
  users: [
    { as: "a", content: "Newest", key: "newest"},
    { as: "a", content: "Popular", key: "popular"},
    { as: "a", content: "Controversial", key: "controversial"},
    { divider: "-", key: "handheldNavPostDivider"},
    { as: "a", content: "Create New", key: "createNew"},
    { as: "a", content: "My Posts", key: "myPosts"},
  ],
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
      innerMainItems: {...innerLeftSidebarOptions},
      rightVisible: false,
      rightInnerItems: null,

    };
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
    let inner = event.target.dataset.inner;
    if(inner) inner = inner.toLowerCase();
    this.setState({
      rightVisible: !this.state.rightVisible,
      rightInnerItems: inner || null,
    });
  }
  //end tablet methods

  //desktop methods

  //end desktop methods

  render() {
    const {children, leftItems, rightItems} = this.props;
    const {pusherVisible, mainVisible, innerMainVisible, innerMainToOpen, rightVisible, innerMainItems, rightInnerItems} = this.state;

    return (
      <div>
        <Responsive maxWidth={0} maxWidth={414}>
          <NavbarHandheld
            children={children}
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
          </NavbarHandheld>
        </Responsive>

        <Responsive minWidth={415} maxWidth={1024}>
          <NavbarTablet
            children={children}
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
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
      authVisible: false,
      authType: null,

    };
  }
  onPusherClick = () => {
    const {pusherVisible} = this.state;
    if (pusherVisible) { this.setState({pusherVisible: false}) };
  }
  //handheld methods
  onMainToggle = (event) => {
    this.setState({
      mainVisible: !this.state.mainVisible,
      pusherVisible: !this.state.pusherVisible,
    });
  }
  onMainInnerHandheldToggle = (event) => {
    let toOpen = event.target.getAttribute("value");
    if(toOpen) toOpen = toOpen.toLowerCase();
    console.log(toOpen)
    this.setState({
      innerMainVisible: !this.state.innerMainVisible,
      innerMainToOpen: toOpen || null
    });
  }

  onAuthToggle = (event) => {
    let authType = event.target.getAttribute("value");
    if(authType) authType = authType.toLowerCase();
    //console.log(authType);

    this.setState({
      pusherVisible: !this.state.pusherVisible,
      authVisible: !this.state.authVisible,
      authType: authType,
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
  //end tablet methods

  //desktop methods

  //end desktop methods

  render() {
    const {children, leftItems, rightItems} = this.props;
    const {pusherVisible, mainVisible, innerMainVisible, innerMainToOpen, authVisible, authType, innerMainItems} = this.state;

    return (
      <div>
        <Responsive maxWidth={0} maxWidth={768}>
          <NavbarHandheld
            leftItems={leftItems}
            rightItems={rightItems}

            onPusherClick={this.onPusherClick} 
            onLeftToggle={this.onMainToggle}
            onLeftSubcategoryToggle={this.onMainInnerHandheldToggle}
            onRightToggle={this.onAuthToggle}

            pusherVisible={pusherVisible}
            leftVisible={mainVisible}
            leftInnerVisible={innerMainVisible}
            leftInnerToOpen={innerMainToOpen}
            rightVisible={authVisible}
            authType={authType}
      
          >
          </NavbarHandheld>
        </Responsive>

        <Responsive minWidth={769} maxWidth={1024}>
          <NavbarTablet
            pusherVisible={pusherVisible}
            onPusherClick={this.onPusherClick}
            mainVisible={mainVisible}
            onMainToggle={this.onMainToggle}
            mainItems={leftItems}
            innerMainVisible={innerMainVisible}
            innerMainToOpen={innerMainToOpen}
            onInnerMainToggle={this.onInnerMainToggle}
            innerMainItems={innerMainItems}
            

            rightItems={rightItems}
          >
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
import React, {Component} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu, Divider} from "semantic-ui-react";

 /**
  * Filters the options for left inner sidebar on handheld
  * @param
  * @param
  * @returns
  */
const getInnerSidebarOptions = (leftInnerSidebarData, target) => {
  console.log("firing");
  const testString = target ? target.toLowerCase() : null;
  if(testString) {
    for (let key in leftInnerSidebarData) {
      if (key === testString) {
        return leftInnerSidebarData[key];
      }
    }
  }
  else {
    return [];
  }
};
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
  



const NavbarHandheld = (
  { 
    children, 
    leftItems, 
    leftInnerItems, 
    rightItems, 
    onPusherClick, 
    onToggle,
    onLeftToggle,
    onLeftSubcategoryToggle,
    leftInnerToOpen, 
    pusherVisible,
    leftVisible,
    leftInnerVisible,
    rightVisible,
  }
  ) => {
  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible={leftVisible}
        style={ {width: "100vw", height: "100vh"} }>

        <Menu.Item  onClick={onLeftToggle}>
          <Icon name="arrow left"></Icon>
          <h4>Back</h4>
        </Menu.Item>
        {leftItems.map((item) => {
          return (
            <Menu.Item {...item} 
              onClick={onLeftSubcategoryToggle.bind(this, item)} > 
            </Menu.Item>
            );
          })
        }
      </Sidebar>
      
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible={leftInnerVisible}
        style={ {width: "100vw", height: "100vw"} } >

        <Menu.Item onClick={onLeftSubcategoryToggle}>
          <Icon name="arrow left"></Icon>
          <h4>Back</h4>
        </Menu.Item>
        { getInnerSidebarOptions(innerLeftSidebarOptions, leftInnerToOpen).map((option) => {
          return (
            <Menu.Item {...option} ></Menu.Item>
            );
          })
        }
        
      </Sidebar>

      <Sidebar 
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible={rightVisible}
        style={ {width: "100vw", hegiht: "100vw"}} >
        
        <Menu.Item onClick={onRightToggle}>
          <Icon name="arrow -right"></Icon>
          <h4>Back</h4>
        </Menu.Item>
        <Menu.Item>
          <Icon name="user outline"></Icon>
          <h4>Login</h4>
        </Menu.Item>
        <Menu.Item>
        <Icon name="wpforms"></Icon>
          <h4>Register</h4>
        </Menu.Item>
      </Sidebar>

      <Sidebar.Pusher
        dimmed={pusherVisible}
        onClick={onPusherClick}
        style={ {height: "100vh"} }
        >
          <Menu fixed="top" inverted>
            <Menu.Item>
              <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
            </Menu.Item>
            <Menu.Item onClick={onLeftToggle}>
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

export default NavbarHandheld;
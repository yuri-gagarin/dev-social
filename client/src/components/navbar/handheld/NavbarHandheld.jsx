import React, {Component} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu, Divider} from "semantic-ui-react";

import LoginComponent from "../../authorization/LoginComponent.jsx"
import RegistrationComponent from  "../../authorization/RegistrationComponent.jsx"

 /**
  * Filters the options for left inner sidebar on handheld
  * @param
  * @param
  * @returns
  */
const getInnerSidebarOptions = (leftInnerSidebarData, target) => {
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
const leftMenuOption = ({...props}) => {
  const {type, toggle} = props;
  console.log(props)
  if(type === "login") {
    return (
      <div>
        <Menu.Item onClick={props.toggle}>
          <Icon name="arrow right">
            <h3>Back</h3>
          </Icon>
        </Menu.Item>
        <LoginComponent />
      </div>
    );
  }
  else if (type == "register") {
    return (
      <div>
        <Menu.Item onClick={props.toggle}>
          <Icon name="arrow right">
            <h3>Back</h3>
          </Icon>
        </Menu.Item>
        <RegistrationComponent />
      </div>
    );
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
    rightItems, 
    onPusherClick, 
    onLeftToggle,
    onLeftSubcategoryToggle,
    leftInnerToOpen, 
    pusherVisible,
    leftVisible,
    leftInnerVisible,
    rightVisible,
    onRightToggle,
    authType,
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
              value={item.content}
              onClick={onLeftSubcategoryToggle} > 
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
        vertical
        direction="right"
        visible={rightVisible}
        style={ {width: "100vw", height: "100vw"}} >
        
        {leftMenuOption({type: authType, toggle: onRightToggle})}
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
            <Menu.Item onClick={onLeftToggle} as={"a"}>
              <Icon name="sidebar" />
                Menu
            </Menu.Item>
            <Menu.Menu position="right">
              {rightItems.map((item) => <Menu.Item {...item}  onClick={onRightToggle} value={item.content}/> )}
            </Menu.Menu>
          </Menu>
        {children}
      </Sidebar.Pusher>

    </Sidebar.Pushable>
  );
};

export default NavbarHandheld;
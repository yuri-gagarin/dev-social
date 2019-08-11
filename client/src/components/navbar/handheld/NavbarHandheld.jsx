import React, {Component} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu, Divider} from "semantic-ui-react";

import LoginComponent from "../../authorization/LoginComponent.jsx"
import RegistrationComponent from  "../../authorization/RegistrationComponent.jsx"

import getInnerSidebarOptions from "../helpers/getInnerSidebarOptions.js";

 /**
  * Filters the options for left inner sidebar on handheld
  * @param
  * @param
  * @returns
  */

const leftMenuOption = ({...props}) => {
  const {type, toggle} = props;
  //console.log(props)
  if(type === "login") {
    return (
      <div>
        <Menu.Item onClick={props.toggle}>
          <Icon name="arrow right"></Icon>
          <h3>Back</h3>
        </Menu.Item>
        <LoginComponent />
      </div>
    );
  }
  else if (type === "register") {
    return (
      <div>
        <Menu.Item onClick={props.toggle}>
          <Icon name="arrow right"></Icon>
          <h3>Back</h3>
        </Menu.Item>
        <RegistrationComponent />
      </div>
    );
  }
  else if (type === "my-account") {
    return(
      <div>
        <Menu.Item onClick={props.toggle}>
          <Icon name="cancel">
      
          </Icon>
        </Menu.Item>
      </div>
    )
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
    console.log(children)
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

        <Menu.Item  
          as="a"
          onClick={onLeftToggle} 
          value={"main-back"}>
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
            <Menu.Item onClick={onLeftToggle} as={"a"} value={"main-toggle"}>
              <Icon name="sidebar" />
                Menu
            </Menu.Item>
            <Menu.Menu position="right">
              {rightItems.map((item) => <Menu.Item {...item}  onClick={onRightToggle} value={item.content}/> )}
            </Menu.Menu>
          </Menu>
        {children}
        <Container>
          <h1>Some Conent here</h1>
        </Container>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default NavbarHandheld;
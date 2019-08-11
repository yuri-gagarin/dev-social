import React, {Component} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu} from "semantic-ui-react";

import getInnerSidebarOptions from "../helpers/getInnerSidebarOptions.js";


const NavbarTablet = (
  {
    children,
    pusherVisible,
    onPusherClick,
    mainVisible,
    onMainToggle,
    mainItems,
    innerMainVisible,
    innerMainToOpen,
    onInnerMainToggle,
    innerMainItems,
    rightItems,
    rightInnerItems,
  } 
  ) => {
  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="overlay"
        inverted
        vertical
        visible={innerMainVisible}
        style={{width: "33vw", height: "100vh", position: "absolute", left: "33%"}}>
        <Menu.Item
          as={"a"}
          onClick={onInnerMainToggle}
          className={""} >
          <div><Icon name={"arrow left"}></Icon></div>
          <div>Back</div>
        </Menu.Item>
        { 
          getInnerSidebarOptions(innerMainItems, innerMainToOpen).map((item) => {
            return (
              <Menu.Item
                {...item}
                className={""}>
              </Menu.Item>
            );
          })
        }
      </Sidebar>
      <Sidebar
        as={Menu}
        animation="overlay"
        inverted
        vertical
        visible={mainVisible}
        style={{width: "33vw", height: "100vh"}}>
        <Menu.Item 
          as={"a"}
          onClick={onMainToggle}
          className={""} >
          <div><Icon name="arrow left"></Icon></div>
          <div>Back</div>
        </Menu.Item>
        { mainItems.map((item) => {
            return (
              <Menu.Item {...item} 
                onClick={onInnerMainToggle}
                data-inner={item.content}>
              </Menu.Item>
            );
          })
        }
      </Sidebar>
      
      <Sidebar>

      </Sidebar>
      <Sidebar.Pusher
        dimmed={pusherVisible}
        onClick={onPusherClick}
        style={ {height: "100vh"} }>
        <Menu fixed="top" inverted>
          <Menu.Item>
            <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
          </Menu.Item>
          <Menu.Item onClick={onMainToggle}>
            <Icon name="sidebar"></Icon>
            <div>Main Menu</div>
          </Menu.Item>
          <Menu.Menu position="right">
            { rightItems.map((item) => <Menu.Item {...item} />) }
          </Menu.Menu>
        </Menu>
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default NavbarTablet;
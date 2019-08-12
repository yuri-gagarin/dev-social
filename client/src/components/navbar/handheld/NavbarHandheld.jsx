import React, {Component} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu, Divider, MenuItem} from "semantic-ui-react";

import buildRightMenu from "../helpers/buildRightMenu.js";
import getInnerSidebarOptions from "../helpers/getInnerSidebarOptions.js";

 /**
  * Filters the options for left inner sidebar on handheld
  * @param
  * @param
  * @returns
  */


const NavbarHandheld = (
  { 
    children,
    pusherVisible,
    mainVisible,
    onMainToggle,
    mainItems,
    innerMainVisible,
    innerMainToOpen,
    onInnerMainToggle,
    innerMainItems,
    rightItems,
    rightVisible,
    onRightToggle,
    rightInnerItems,
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
        visible={mainVisible}
        style={ {width: "100vw", height: "100vh"} }>

        <Menu.Item  
          as="a"
          onClick={onMainToggle} >
            <Icon name="arrow left"></Icon>
            <h4>Back</h4>
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
      <Sidebar
        as={Menu}
        animation="overlay"
        icon="labeled"
        inverted
        vertical
        visible={innerMainVisible}
        style={ {width: "100vw", height: "100vw"} } >
        <Menu.Item onClick={onInnerMainToggle}>
          <Icon name="arrow left"></Icon>
          <h4>Back</h4>
        </Menu.Item>
        { getInnerSidebarOptions(innerMainItems, innerMainToOpen)
          .map((option) => {
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
        style={{width: "100vw", height: "100vw"}} >
        <Menu.Item as={"a"}
          onClick={onRightToggle}>
          <Icon name={"arrow right"}></Icon>
          <div>Back</div>
        </Menu.Item>
        { buildRightMenu(rightInnerItems, {}) }
      </Sidebar>

      <Sidebar.Pusher
        dimmed={pusherVisible}
        style={{height: "100vh"}} >
          <Menu fixed="top" inverted>
            <Menu.Item>
              <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
            </Menu.Item>
            <Menu.Item onClick={onMainToggle} as={"a"}>
              <Icon name="sidebar" />
              Menu
            </Menu.Item>
            <Menu.Menu position="right">
              { rightItems.map((item) => {
                  return (
                    <Menu.Item {...item}  
                      onClick={onRightToggle} 
                      data-inner={item.content} >
                    </Menu.Item>
                  );
                })
              }
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
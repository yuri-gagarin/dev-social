import React, {Component} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu, Segment} from "semantic-ui-react";

import getInnerSidebarOptions from "../helpers/getInnerSidebarOptions.js";
import buildRightMenu from "../helpers/buildRightMenu.js";

import style from "../../../assets/stylesheets/navbar/navbarDesktop.scss";

const NavbarDesktop = (
  {
    children,
    pusherVisible,
    onPusherToggle,
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
  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        animation="overlay"
        vertical
        direction="top"
        visible={innerMainVisible}
        id={style.mainMenu}>
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
        as={Container}
        animation="overlay"
        visible={rightVisible}
        direction="top"
        style={{width: "100vw", minHeight: "100vh", backgroundColor: "white"}} >
        <Menu.Item
          as={Segment}
          onClick={onRightToggle} >
          <Icon name="window close outline"></Icon>
          <div>Close</div>
        </Menu.Item>
        { buildRightMenu(rightInnerItems, {}) }
      </Sidebar>
      <Sidebar.Pusher
        dimmed={pusherVisible}
        onClick={onPusherToggle}
        style={ {height: "100vh"} }>
        <Menu fixed="top" id={style.navbarDesktop}>
          <Menu.Item>
            <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
          </Menu.Item>
          { mainItems.map((item) => {
              return (
                <Menu.Item {...item} 
                  className={style.mainItem}
                  onClick={onInnerMainToggle}
                  data-inner={item.content}>
                </Menu.Item>
              );
            })
          }
          <Menu.Menu position="right">
          { rightItems.map((item) => {
              return( 
              <Menu.Item {...item} onClick={onRightToggle}
                data-inner={item.content}>
              </Menu.Item>
              )
            })
          }
          </Menu.Menu>
        </Menu>
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default NavbarDesktop;
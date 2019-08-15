import React, {Component} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu} from "semantic-ui-react";

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
        inverted
        vertical
        direction="top"
        visible={innerMainVisible}
        style={{width: "100vw", height: "33vh"}}>
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
        style={{width: "25vw", height: "100vh"}}>
        <Menu.Item 
          as={"a"}
          onClick={onMainToggle}
          className={""} >
          <div><Icon name="arrow left"></Icon></div>
          <div>Back</div>
        </Menu.Item>
        
      </Sidebar>
      
      <Sidebar
        as={Container}
        animation="overlay"
        visible={rightVisible}
        direction="top"
        style={{width: "100vw", height: "100vh", backgroundColor: "white"}} >
        <Menu.Item
          as={Segment}
          onClick={onRightToggle} >
          <Icon name="arrow right"></Icon>
          <div>Close</div>
        </Menu.Item>
        { buildRightMenu(rightInnerItems, {}) }
      </Sidebar>
      <Sidebar.Pusher
        dimmed={pusherVisible}
        onClick={onPusherToggle}
        style={ {height: "100vh"} }>
        <Menu fixed="top" inverted>
          <Menu.Item>
            <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
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
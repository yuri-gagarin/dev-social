import React, {Component, Fragment} from "react";
import {Container, Icon, Image, Sidebar, Responsive, Menu, Segment} from "semantic-ui-react";

import getInnerSidebarOptions from "../helpers/getInnerSidebarOptions.js";
import buildRightMenu from "../helpers/buildRightMenu.js";

import {connect} from "react-redux";

import style from "../../../assets/stylesheets/navbar/navbarDesktop.scss";

const checkUserLogin = ({authState, rightVisible, onRightToggle, rightInnerItems }) => {
  if (!authState.loggedIn) {
    return (
      <Sidebar
        as={Container}
        animation="overlay"
        visible={rightVisible}
        direction="top"
        id = {style.rightDesktopMenu} >
        <Menu.Item
          as={Segment}
          onClick={onRightToggle} >
          <Icon name="window close outline"></Icon>
          <div>Close</div>
        </Menu.Item>
        { buildRightMenu(rightInnerItems, {closeWindow: onRightToggle}) }
      </Sidebar>
    );
  }
  else {
    return (
      <div></div>
    );
  }
}

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
    authState,
  }
) => {
 
  return (
    <Fragment>
      <Menu id={style.navbarDesktop} fixed="top">
        <Menu.Item>
          <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
        </Menu.Item>
        <Menu.Item onClick={onMainToggle}>
          <Icon name="sliders horizontal"></Icon>
          <span id={style.mainMenuBtn}>Main Menu</span>
        </Menu.Item>
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
      <Sidebar.Pushable id={style.sidebarPushable}>
        <Sidebar
          as={Menu}
          animation="overlay"
          visible={innerMainVisible}
          direction="left"
          vertical
          id={style.innerMainMenu}>
          <Menu.Item
            as={Segment}
            onClick={onInnerMainToggle} >
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
          visible={mainVisible}
          direction="left"
          vertical
          id={style.mainMenu}>
          <Menu.Item
            as={Segment}
            onClick={onMainToggle}
            className={""} >
            <div><Icon name={"arrow left"}></Icon></div>
            <div>Back</div>
          </Menu.Item>
          {
            mainItems.map((item) => {
              return (
                <Menu.Item
                {...item}
                  onClick={onInnerMainToggle}
                  data-inner={item.content}>
                </Menu.Item>
              );
            })
          }
        </Sidebar>
        {checkUserLogin({authState, rightVisible, onRightToggle, rightInnerItems})}
        
        <Sidebar.Pusher
          dimmed={pusherVisible}
          onClick={onPusherToggle}
          id={style.mainContent}>         
          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Fragment>
  );
};
const mapStateToProps = (state) => {
  return {
    authState: state.auth,
    testState: state.test,
  };
};

const mapDispachToProps = (dispatch) => {
  return {

  };
};

export default connect(mapStateToProps, null)(NavbarDesktop);
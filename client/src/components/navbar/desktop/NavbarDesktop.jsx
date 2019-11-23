import React, {Fragment} from "react";
import {Icon, Image, Sidebar, Menu} from "semantic-ui-react";

import style from "../../../assets/stylesheets/navbar/navbar.scss";
import {withRouter} from "react-router-dom";

import MainMenu from "../nav_components/MainMenu";
import InnerMainMenu from "../nav_components/InnerMainMenu";

import {openMain} from "../helpers/toggleButtons";

import NavAuthComponent from "../nav_components/NavAuthComponent";
import DashOpenButton from "../nav_components/DashOpenButton";
import UserDashboard from "../nav_components/UserDashboard";

const NavbarDesktop = (props) => {
  const { history, authState, navState, children} = props;
  const { onPusherToggle, logoutUser} = props;
  const goHome = (history) => {history.push("/")};

  return (
    <Fragment>
      <Menu id={style.navbarDesktop} fixed="top" data-test="desktop-nav-menu">
        <Menu.Item onClick={() => goHome(history)}>
          <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
        </Menu.Item>
        <Menu.Item onClick={openMain} data-test="desktop-open-main-btn">
          <Icon name="sliders horizontal"></Icon>
          <span id={style.mainMenuBtn}>Main Menu</span>
        </Menu.Item>
        <Menu.Menu position="right">
          <NavAuthComponent 
            authState={authState} 
            logoutUser={logoutUser}
          />
          <DashOpenButton
            authState={authState}
          />
        </Menu.Menu>
      </Menu>

      <Sidebar.Pushable style={{transform: "none"}} data-test="sidebar">
        <InnerMainMenu
          data-test="inner-main-menu"
          authState={authState}
          navState={navState}
          history={history}
        />
        <MainMenu
          data-test="main-menu"
          authState={authState}
          navState={navState}
        />
        <UserDashboard 
          authState={authState}
          navState={navState}
        />
        <Sidebar.Pusher
          dimmed={navState.pusherVisible}
          onClick={onPusherToggle}
          id={style.mainContent}>         
          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Fragment>
  );
};


export default (withRouter(NavbarDesktop));

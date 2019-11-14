import React, {Fragment} from "react";
import {Icon, Image, Sidebar, Menu} from "semantic-ui-react";

import style from "../../../assets/stylesheets/navbar/navbar.scss";
import {withRouter} from "react-router-dom";

import MainMenu from "../nav_components/MainMenu.jsx";
import InnerMainMenu from "../nav_components/InnerMainMenu.jsx";

import NavAuthComponent from "../nav_components/NavAuthComponent.jsx";
import DashComponent from "../nav_components/DashComponent.jsx";
import UserDashboard from "../nav_components/UserDashboard.jsx";

const NavbarDesktop = (props) => {
  const { history, authState, navState, children} = props;
  const { openMain, closeMain, openInnerMain, closeInnerMain, openDash, closeDash, onPusherToggle, logoutUser, fetchData} = props;

  const goHome = (history) => {history.push("/")};

  return (
    <Fragment>

      <Menu id={style.navbarDesktop} fixed="top">
        <Menu.Item onClick={() => goHome(history)}>
          <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
        </Menu.Item>
        <Menu.Item onClick={openMain}>
          <Icon name="sliders horizontal"></Icon>
          <span id={style.mainMenuBtn}>Main Menu</span>
        </Menu.Item>
        <Menu.Menu position="right">
          <NavAuthComponent 
            authState={authState} 
            logoutUser={logoutUser}
          />
          <DashComponent 
            authState={authState}
            openDash={openDash} 
          />
        </Menu.Menu>
      </Menu>

      <Sidebar.Pushable style={{transform: "none"}} data-test="main-sidebar">
        <InnerMainMenu
          data-test="inner-main-menu"
          authState={authState}
          navState={navState}
          history={history}
          closeInnerMain={closeInnerMain}
          closeMain={closeMain}
          fetchData={fetchData}
        />
        <MainMenu
          data-test="main-menu"
          authState={authState}
          navState={navState}
          closeMain={closeMain}
          openInnerMain={openInnerMain}
        />
        <UserDashboard 
          authState={authState}
          navState={navState}
          closeDash={closeDash}
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

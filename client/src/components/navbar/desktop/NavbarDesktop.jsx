import React, {Fragment} from "react";
import {Icon, Image, Sidebar, Menu} from "semantic-ui-react";

import style from "../../../assets/stylesheets/navbar/navbarDesktop.scss";
import {withRouter} from "react-router-dom";
import NavAuthComponent from "../nav_components/NavAuthComponent.jsx";
import UserDashboard from "../nav_components/UserDashboard.jsx";

const NavbarDesktop = (props) => {
  const { history, authState, navState, onPusherToggle, openMain, 
          closeMain, openInnerMain, closeinnerMain, openDash, closeDash } = props;
  goHome = (history) => {
    history.push("/");
  };

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
          <NavAuthComponent authState={authState} />
          <DashComponent 
            authState={authState}
            openDash={openDash} 
          />
        </Menu.Menu>
      </Menu>

      <Sidebar.Pushable>
        <MainMenu
          authState={authState}
          navState={navState}
          closeMain={closeMain}
          openInnerMain={openInnerMain}
        />
        <InnerMainMenu
          authState={authState}
          navState={navState}
          closeinnerMain={closeinnerMain}
        />
        <UserDashboard 
          authState={authState}
          navState={navState}
          closeDash={closeDash}
        />
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

export default (withRouter(NavbarDesktop));

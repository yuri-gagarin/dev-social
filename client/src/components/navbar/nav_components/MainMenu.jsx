import React from 'react';

import {Sidebar, Menu, Segment, Icon} from "semantic-ui-react";
import style from "../../../assets/stylesheets/navbar/menus.scss";

const toggleClose = (event) => {

}

const MainMenu = (props) => {
  const {authState, navState, closeMain, openInnerMain} = props;

  const closesMain = () => {

  };

  return(
    <Sidebar 
      data-test="main-menu-sidebar"
      as={Menu}
      animation="overlay"
      visible={navState.mainVisible}
      direction="left"
      vertical
      id={style.mainMenu}>
      <Menu.Item
        as={Segment}
        onClick={toggleClose}
        className={""}
        data-test="main-menu-close">
        <div><Icon name={"arrow left"}></Icon></div>
        <div>Back</div>
      </Menu.Item>
      {
        navState.mainItems.map((item) => {
          return (
            <Menu.Item
            {...item}
              onClick={openInnerMain}
              data-inner={item.content}
              data-test={"main-menu-clickable"} 
            />
          );
        })
      }
    </Sidebar>
  );
};

export default MainMenu;
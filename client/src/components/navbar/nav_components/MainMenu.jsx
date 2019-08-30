import React from 'react';

import {Sidebar, Menu, Segment, Icon} from "semantic-ui-react";
import style from "../../../assets/stylesheets/navbar/menus.scss";

const MainMenu = (props) => {
  const {authState, navState, closeMain, openInnerMain} = props;
  return(
    <Sidebar
      as={Menu}
      animation="overlay"
      visible={navState.mainVisible}
      direction="left"
      vertical
      id={style.mainMenu}>
      <Menu.Item
        as={Segment}
        onClick={closeMain}
        className={""} >
        <div><Icon name={"arrow left"}></Icon></div>
        <div>Back</div>
      </Menu.Item>
      {
        navState.mainItems.map((item) => {
          return (
            <Menu.Item
            {...item}
              onClick={openInnerMain}
              data-inner={item.content}>
            </Menu.Item>
          );
        })
      }
    </Sidebar>
  );
};

export default MainMenu;
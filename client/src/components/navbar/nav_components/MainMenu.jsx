import React from 'react';
import PropTypes from "prop-types";

import {Sidebar, Menu, Segment, Icon} from "semantic-ui-react";
import style from "../../../assets/stylesheets/navbar/menus.scss";
import {closeMain, openInnerMain} from "../helpers/toggleButtons";

export const MainMenu = (props) => {
  const {authState, navState} = props;
  return(
    <Sidebar 
      as={Menu}
      animation="overlay"
      visible={navState.mainVisible}
      direction="left"
      vertical
      id={style.mainMenu}
      data-test="main-menu-sidebar"
    >
      <Menu.Item
        as="a"
        onClick={closeMain}
        className={""}
        data-test="main-menu-close"
      >
        <div><Icon name={"arrow left"}></Icon></div>
        <div>Back</div>
      </Menu.Item>
      {
        navState.mainItems.map((item) => {
          return (
            <Menu.Item
            {...item}
              onClick={openInnerMain}
              data-test="main-menu-clickable"
            />
          );
        })
      }
    </Sidebar>
  );
};

MainMenu.propTypes = {
  authState: PropTypes.object.isRequired,
  navState: PropTypes.object.isRequired,
};


export default MainMenu
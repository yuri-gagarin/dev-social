import React from "react";
import PropTypes from "prop-types";

import {Sidebar, Menu, Segment, Icon} from "semantic-ui-react";
import style from "../../../assets/stylesheets/navbar/menus.scss";

import {handleInnerClick, closeInnerMain} from "../helpers/toggleButtons";

const InnerMainMenu = (props) => {
  const {authState, navState, history} = props;

  return (
    <Sidebar
      as={Menu}
      animation="overlay"
      visible={navState.innerMainVisible}
      direction="left"
      vertical
      id={style.innerMainMenu}
      data-test="inner-main-menu-sidebar"
    >
      <Menu.Item
        as="a"
        onClick={closeInnerMain} 
        data-test="inner-main-menu-close"
        id=""
      >
        <div><Icon name="arrow left"></Icon></div>
        <div>Back</div>
      </Menu.Item>
      {   
        navState.innerMainItems.map((item) => {
          return (
            <Menu.Item
              {...item}
              className={""}
              onClick={(e) => {handleInnerClick(e, history)} }
              data-test="inner-main-menu-clickable"
            />
          );
        })
      }
    </Sidebar>
  );
};
InnerMainMenu.propTypes = {
  authState: PropTypes.object.isRequired,
  navState: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default InnerMainMenu;
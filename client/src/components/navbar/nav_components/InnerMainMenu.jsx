import React from "react";

import {Sidebar, Menu, Segment, Icon} from "semantic-ui-react";
import style from "../../../assets/stylesheets/navbar/menus.scss";

const innerMainMenu = (props) => {
  const {authState, navState, closeInnerMain} = props;
  return (
    <Sidebar
    as={Menu}
    animation="overlay"
    visible={navState.innerMainVisible}
    direction="left"
    vertical
    id={style.innerMainMenu}>
    <Menu.Item
      as={Segment}
      onClick={closeInnerMain} >
      <div><Icon name={"arrow left"}></Icon></div>
      <div>Back</div>
    </Menu.Item>
    {   
      navState.innerMainItems.map((item) => {
        return (
          <Menu.Item
            {...item}
            className={""}>
          </Menu.Item>
        );
      })
    }
  </Sidebar>
  )
};

export default innerMainMenu;
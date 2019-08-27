import React from "react";

const innerMainMenu = (props) => {
  return (
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
  )
};

export default innerMainMenu;
import React from "react";

//returns a sidebar with a dashboard for logged in users
const Dashboard = (props) => {
  const {isLoggedIn,rightVisible, onRightToggle} = props;
  if (isLoggedIn) {
    return(
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
    )
  }
  else {
    return null;
  }
};

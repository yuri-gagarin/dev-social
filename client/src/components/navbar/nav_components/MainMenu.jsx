import React from 'react';

const MainMenu = (props) => {

  return(
    <Sidebar
      as={Menu}
      animation="overlay"
      visible={mainVisible}
      direction="left"
      vertical
      id={style.mainMenu}>
      <Menu.Item
        as={Segment}
        onClick={onMainToggle}
        className={""} >
        <div><Icon name={"arrow left"}></Icon></div>
        <div>Back</div>
      </Menu.Item>
      {
        mainItems.map((item) => {
          return (
            <Menu.Item
            {...item}
              onClick={onInnerMainToggle}
              data-inner={item.content}>
            </Menu.Item>
          );
        })
      }
    </Sidebar>
  );
};

export default MainMenu;
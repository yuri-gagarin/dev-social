import React from "react";
import PropTypes from "prop-types";

import {Sidebar, Menu, Segment, Icon} from "semantic-ui-react";
import style from "../../../assets/stylesheets/navbar/menus.scss";

/**
 * Handles inne main menu item click
 * 
 * @param {Object} event Click event.
 * @param {String} name Name of element clicked on. Should be underscore format {model_subroute}.
 * @param {Object} history React Router history object.
 * 
 * @returns {void} Pushes new route to history object
 */
const handleInnerClick = (event, name, history) => {
  const namedEvent = name.split("_");
  const firstArg = namedEvent[0], secondArg = namedEvent[1];
  const route = `/${firstArg}/${secondArg}`;
  //populate redux state with the appropriate api call
  const apiRoute = "api" + route;
  //fetchData(apiRoute)
  history.push(route);
};

const innerMainMenu = (props) => {
  const {authState, navState, history, closeInnerMain, closeMain} = props;

  const handleClick = (event, {name}) => {
    handleInnerClick(event, name, history);

    //d a custom apo fetch here
    console.log(name);
    closeMain();
  };

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
            className={""}
            onClick={handleClick}>
          </Menu.Item>
        );
      })
    }
  </Sidebar>
  )
};
innerMainMenu.propTypes ={
  authState: PropTypes.object.isRequired,
  navState: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  closeInnerMain: PropTypes.func.isRequired,
  closeMain: PropTypes.func.isRequired,
};

export default innerMainMenu;
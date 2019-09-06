import React from "react";
import PropTypes from "prop-types";

import {Sidebar, Menu, Segment, Icon} from "semantic-ui-react";
import style from "../../../assets/stylesheets/navbar/menus.scss";
import axios from "axios";

/**
 * Handles inne main menu item click
 * 
 * @param {Object} event Click event.
 * @param {String} name Name of element clicked on. Should be underscore format {model_subroute}.
 * @param {Object} history React Router history object.
 * 
 * @returns {String} Route string to fetch data from API.
 */
const handleInnerClick = (event, name, history) => {
  const namedEvent = name.split("_");
  const firstArg = namedEvent[0], query = namedEvent[1];
  const route = `/${firstArg}?q=${query}`;
  //populate redux state with the appropriate api call
  const apiRoute = "/api" + route;
  
  const options = {
    route: route,
    appRoute: apiRoute,
    model: firstArg,
    query: query,
  };

  history.push(route);
  return options;
};

const innerMainMenu = (props) => {
  const {authState, navState, history, closeInnerMain, closeMain, fetchData} = props;

  const handleClick = (event, {name}) => {
    const options = handleInnerClick(event, name, history);
    closeMain();
    fetchData(options);
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
  fetchData: PropTypes.func.isRequired,
};

export default innerMainMenu;
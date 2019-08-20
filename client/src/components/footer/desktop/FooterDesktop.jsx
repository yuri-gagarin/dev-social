import React from "react";
import PropTypes from "prop-types";
import {Menu} from "semantic-ui-react";

const FooterDesktop = (props) => {
  const {activeItem, handleFooterItemClick} = props;
  return (
    <Menu>
      <Menu.Item
        active={activeItem === "about"}
        data-inner="about"
        content="About"
        onClick={handleFooterItemClick}
      />
      <Menu.Item
        active={activeItem === "contact"}
        data-inner="contact"
        content="Contact"
        onClick={handleFooterItemClick}
      />
      <Menu.Item
        active={activeItem === "work"}
        data-inner="work"
        content="Work With Us"
        onClick={handleFooterItemClick}
      />
    </Menu>
  );
};

FooterDesktop.propTypes = {
  activeItem: PropTypes.string,
  handleFooterItemClick: PropTypes.func,
};



export default FooterDesktop;

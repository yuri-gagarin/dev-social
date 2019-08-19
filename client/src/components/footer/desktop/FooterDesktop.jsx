import React from "react";
import PropTypes from "prop-types";
import {Menu} from "semantic-ui-react";

const FooterDesktop = (props) => {
  const {activeItem, handleFooterItemClick} = props;
  return (
    <Menu>
      <Menu.Item
        name="about"
        active={activeItem === "about"}
        content="About"
        onClick={handleFooterItemClick}
      />
      <Menu.Item
        name="contact"
        active={activeItem === "contact"}
        content="Contact"
        onClick={handleFooterItemClick}
      />
      <Menu.Item
        name="work"
        active={activeItem === "work"}
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

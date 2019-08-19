import React, {Component} from "react";
import {Menu, Icon, Responsive} from "semantic-ui-react";

import FooterDesktop from "./desktop/FooterDesktop.jsx";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null,
    };
  };

  handleFooterItemClick = (event) => {
    console.log(event.target);
  };

  render() {
    return (
      <Responsive minWidth={1025}>
        <FooterDesktop 
          activeItem = {this.state.activeItem}
          handleFooterItemClick= {this.handleFooterItemClick}
        />
      </Responsive>
    );
  }
};


export default Footer;
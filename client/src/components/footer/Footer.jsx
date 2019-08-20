import React, {Component} from "react";
import {Menu, Icon, Responsive} from "semantic-ui-react";

import FooterDesktop from "./desktop/FooterDesktop.jsx";
import style from "../../assets/stylesheets/footer/footer.scss";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: null,
    };
  };

  handleFooterItemClick = (event) => {
    let active = event.target.dataset.inner;
    if (this.state.activeItem === active) {
      this.setState({
        activeItem: null,
      })
    }
    else {
      this.setState({
        activeItem: active,
      });
    }
  };

  render() {
    return (
      <Responsive minWidth={1025} className = {style.mainFooter}>
        <FooterDesktop 
          activeItem = {this.state.activeItem}
          handleFooterItemClick = {this.handleFooterItemClick}
        />
      </Responsive>
    );
  }
};


export default Footer;
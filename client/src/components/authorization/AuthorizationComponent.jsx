import React, {Component} from "react";
import {Container, Grid, GridColumn, Image, Menu} from "semantic-ui-react";
import PropTypes from "prop-types";

import {withRouter} from "react-router-dom";

import RegistrationComponent from "./RegistrationComponent.jsx";
import LoginComponent from "./LoginComponent.jsx";

import {connect} from "react-redux";


class AuthorizationComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeItem: props.history.location.pathname,
    };
    console.log(props)

  };
  renderForm = (route) => {
    if(route === "/login") {
      return (
        <LoginComponent />
      )
    }
    else if(route === "/register") {
      return (
        <RegistrationComponent />
      )
    }
  };
  switchForm = (event, {name}) => {
    this.setState({
      activeItem: name,
    },
    () => {
      this.props.history.push(`/${name}`);
    });
  };

  handleLogin = () => {

  };
  handleRegister = () => {

  };

  render() {
    const {history} = this.props;
    const {activeItem} = this.state;
    const currentRoute = history.location.pathname;

    

    return (
      <Container>
        <Grid centered columns={2}>
          <GridColumn>
            <Image src="/assets/images/logo.jpg" size="medium" centered/>
          </GridColumn>
        </Grid>
        <Grid centered columns={2}>
          <GridColumn>
            <Menu pointing>
              <Menu.Item
                as="a"
                name="login"
                active={activeItem === "login"}
                onClick={this.switchForm}
              />
               <Menu.Item
                as="a"
                name="register"
                active={activeItem === "register"}
                onClick={this.switchForm}
              />
            </Menu>
          </GridColumn>
        </Grid>
        <Grid centered columns={2}>
          <GridColumn>
            {this.renderForm(currentRoute)}
          </GridColumn>
        </Grid>
      </Container>
    );
  }
};

AuthorizationComponent.propTypes = {
  history: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    authState: state.auth,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    handleLogin: () => dispatch(),
    handleRegister: () => dispatch(),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AuthorizationComponent));
import React, {Component} from "react";
import {Container, Grid, GridColumn, Image, Menu} from "semantic-ui-react";
import PropTypes from "prop-types";
import style from "../../assets/stylesheets/authorization/authorization.scss";

import {withRouter} from "react-router-dom";

import RegistrationComponent from "./RegistrationComponent.jsx";
import LoginComponent from "./LoginComponent.jsx";

import {connect} from "react-redux";
import {registerUser, loginUser} from "../../redux/actions/authActions.js";


const AuthorizationComponent = (props) => {
  //redux state
  const {authState, errors, history} = props;
  //auhtorization handlers
  const {handleLogin, handleRegister} = props;
  //location and activeItem for Menu within component
  const currentRoute = props.location.pathname;
  const activeItem = currentRoute.slice(1);
  
  const renderAuthForm = (currentRoute, props) => {
    if(currentRoute === "/login") {
      return (
        <LoginComponent
          {...props}
         />
      )
    }
    else if(currentRoute === "/register") {
      return (
        <RegistrationComponent
          {...props}
         />
      )
    }
  };
  //switch handler for components menu bar
  const switchForm = (event, name, history) => {
    if(name !== activeItem) {
      history.push(`/${name}`)
    }
  };

  return (
    <Container className={style.authorizationComponent}>
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
              onClick={(e, {name}) => switchForm(e, name, history)}
            />
              <Menu.Item
              as="a"
              name="register"
              active={activeItem === "register"}
              onClick={(e, {name}) => switchForm(e, name, history)}
            />
          </Menu>
        </GridColumn>
      </Grid>
      <Grid centered columns={2}>
        <GridColumn>
          {renderAuthForm(currentRoute, {history, errors, handleLogin, handleRegister})}
        </GridColumn>
      </Grid>
    </Container>
  )
};

AuthorizationComponent.propTypes = {
  authState: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  handleLogin: PropTypes.func.isRequired,
  handleRegister: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    authState: state.auth,
    errors: state.error,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    handleLogin: (userData, history) => dispatch(loginUser(userData, history)),
    handleRegister: (userData, history) => dispatch(registerUser(userData, history)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AuthorizationComponent));
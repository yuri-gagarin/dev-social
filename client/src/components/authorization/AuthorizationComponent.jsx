import React, {Component} from "react";
import {Container, Grid, GridColumn, Image, Button } from "semantic-ui-react";

import RegistrationComponent from "./RegistrationComponent.jsx";
import LoginComponent from "./LoginComponent.jsx";

import {Route, Link} from "react-router-dom";

class AuthorizationComponent extends Component {
  constructor(){
    super();
    this.state = {

    };
  }

  render() {
    return (
      <Container>
        <Grid centered columns={2}>
          <GridColumn>
            <Image src="/assets/images/logo.jpg" size="medium" centered/>
          </GridColumn>
        </Grid>
        <Grid centered columns={1}>
          <GridColumn>
            <Link to="/authorize/register">
              <Button>Register</Button>
            </Link>
            <Link to="/authorize/login"> 
              <Button>Login</Button>
            </Link>
          </GridColumn>
        </Grid>
        <Grid centered columns={2}>
          <GridColumn>
            <Route path="/authorize/register" component={RegistrationComponent} />
            <Route path="/authorize/login" component={LoginComponent} />
          </GridColumn>
        </Grid>
      </Container>
  );
  }
};

export default AuthorizationComponent;
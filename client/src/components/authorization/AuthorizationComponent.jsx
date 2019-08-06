import React, {Component} from "react";
import {Container, Grid, GridColumn, Image } from "semantic-ui-react";

import RegistrationComponent from "./RegistrationComponent.jsx";
import LoginComponent from "./LoginComponent.jsx";

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
        <Grid centered columns={2}>
          <GridColumn>
            <RegistrationComponent />
          </GridColumn>
        </Grid>
        <Grid centered columns={2}>
          <GridColumn>
            <LoginComponent />
          </GridColumn>
        </Grid>
      </Container>
  );
  }
};

export default AuthorizationComponent;
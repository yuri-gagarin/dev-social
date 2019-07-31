import React, {Component} from "react";
import {Container, Grid, GridColumn, Image } from "semantic-ui-react";

import RegistrationComponent from "./RegistrationComponent.jsx";

class AuthorizationComponent extends Component {
  constructor(){
    super();
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
      </Container>
  );
  }
};

export default AuthorizationComponent;
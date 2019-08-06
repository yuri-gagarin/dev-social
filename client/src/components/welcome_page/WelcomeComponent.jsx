import React, {Component} from "react";
import {Container, Image, Grid, Segment, Button, GridColumn} from "semantic-ui-react";
import {Link} from "react-router-dom";

class WelcomeComponent extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return(
      <div>
        <Container>
          <Image
            fluid
            src="/assets/images/logo.jpg"
          />
        </Container>
        <Container>
          <Grid columns={3} divided>
            <Grid.Column>
              <Segment>Empty</Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Link to="/authorize">
                  <Button>Login</Button>
                </Link>
              </Segment>
              <Segment>
                <Link to="/authorize">
                  <Button>Register</Button>
                </Link>
              </Segment>
            </Grid.Column>
            <GridColumn>
              <Segment>Empty</Segment>
            </GridColumn>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default WelcomeComponent;
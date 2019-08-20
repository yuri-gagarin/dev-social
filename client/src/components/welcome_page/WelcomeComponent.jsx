import React, {Component, Fragment} from "react";
import {Container, Image, Grid, Segment, Button, GridColumn} from "semantic-ui-react";
import style from "../../assets/stylesheets/welcome/welcome.scss";


class WelcomeComponent extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return(
      <Fragment>
        <Container fluid
          className={style.welcomeParallaxContainer}
        />
        <Container>
          <p>Text</p>
        </Container>
        <Container>
          <p>Text</p>
        </Container>
        <Container>
          <p>Text</p>
        </Container>
        <Container>
          <p>Text</p>
        </Container>
        <Container>
          <p>Text</p>
        </Container>
       </Fragment>
    );
  }
}

export default WelcomeComponent;
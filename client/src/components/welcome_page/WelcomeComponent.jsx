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
        <Container fluid className={style.welcomeParallaxContainer} />
        <Container className={style.featuredWritersContainer}>
          <h3>Featured Writers</h3>
          <Grid columns={3}>
            <Grid.Row>
              <GridColumn>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
              </GridColumn>
              <GridColumn>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
              </GridColumn>
              <GridColumn>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
              </GridColumn>
            </Grid.Row>
            <Grid.Row>
              <GridColumn>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
              </GridColumn>
              <GridColumn>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
              </GridColumn>
              <GridColumn>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
                <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
              </GridColumn>
            </Grid.Row>
          </Grid> 
        </Container>
        <Container className = {style.featuredNewsContainer}>
          <h3>Hot News</h3>
          <Grid columns={3} divided>
            <Grid.Row>
              <Grid.Column>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
              </Grid.Column>
              <Grid.Column>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
              </Grid.Column>
              <Grid.Column>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
              </Grid.Column>
              <Grid.Column>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
              </Grid.Column>
              <Grid.Column>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        <Container className = {style.featuredTopicsContainer}>
          <h3>Hot Topics</h3>
          <Grid columns={3} divided>
            <Grid.Row>
              <Grid.Column>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
              </Grid.Column>
              <Grid.Column>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
              </Grid.Column>
              <Grid.Column>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
              </Grid.Column>
              <Grid.Column>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
              </Grid.Column>
              <Grid.Column>
                <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
        <Container fluid className={style.welcomeParallaxContainer}
        />
       </Fragment>
    );
  }
}

export default WelcomeComponent;
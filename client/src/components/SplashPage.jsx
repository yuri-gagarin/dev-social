import React, {Component} from "react";
import {Container} from "semantic-ui-react";
import style from "../assets/stylesheets/index.scss";
export default class SplashPage extends Component {
  constructor(){
    super();
  }


  render() {
    return(
      <Container>
        <div className={style.splashPage}>
          <h3>Splash Page</h3>
        </div>
        <p>Something here</p>
      </Container>
    )
  }
}
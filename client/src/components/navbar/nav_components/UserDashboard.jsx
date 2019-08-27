import React from "react";
import PropTypes from "prop-types";

import style from "../../../assets/stylesheets/navbar/userDashboard.scss";
import {Menu} from "semantic-ui-react";

import {connect} from "react-redux";
import {closeDashboard} from "../../../actions/navActions.js"; 


//returns a sidebar with a dashboard for logged in users
const UserDashboard = (props) => {
  const {authState, navState, closeDashboard} = props;
  if (authState.isLoggedIn) {
    return(
      <Sidebar
        as={Container}
        animation="overlay"
        visible={navState.dashOpen}
        direction="top"
        id = {""} >
        <Menu.Item
          as={"a"}
          onClick={closeDashboard} >
          <Icon name="window close outline"></Icon>
          <div>Close</div>
        </Menu.Item>
      </Sidebar>
    )
  }
  else {
    return null;
  }
};

UserDashboard.propTypes = {
  navState: PropTypes.object.isRequired,
  authState: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    navState: state.nav,
    authState: state.auth,
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    closeDashboard: () => dispatch(closeDashboard()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);


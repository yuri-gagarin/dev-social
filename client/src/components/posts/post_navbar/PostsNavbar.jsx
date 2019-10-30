import React, {Component} from "react";
import PropTypes from "prop-types";
import {postSearchOptions as options} from "../../../redux/searchOptions.js";
import { Menu, Dropdown, Icon } from "semantic-ui-react";
import {rewind, convertTimeQuery} from "../../../helpers/time_helpers/timeHelpers.js";
import styles from "../../../assets/stylesheets/posts/post.scss";

class PostsNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: options.filter.new,
      from: options.time.day,
      filterBarDisabled: false,
      timeBarDisabled: true,
    }
  }

  handleSortClick = (e, {value}) => {
    if(value === options.filter.new) {
      this.setState({filter: value, from: options.time.none, timeBarDisabled: true}, () => {
        const fetchOptions = {
          filter: this.state.filter,
          from: fromDate,
          limit: this.state.limit,
        };
        this.props.fetchPosts(fetchOptions)
      });
    }
    else if(value === options.filter.trending) {
      this.setState({filter: value, from: options.time.none, timeBarDisabled: true}, () => {
        const fetchOptions = {
          filter: this.state.filter,
          from: null,
          limit: this.state.limit,
        };
        this.props.fetchPosts(fetchOptions);
      })
    }
    else {
      this.setState({filter: options.filter.new, timeDisabled: true}, () => {
        const fetchOptions = {
          filter: this.state.filter,
          from: postSearchOptions.time.day,
          limit: this.state.limit,
        };
        this.props.fetchPosts(fetchOptions);
      });
    }
  }

  handleTimeClick = (e, {value}) => {
    this.setState({from: value} , () => {
      //convert the time filter
      const fetchOptions = {
        filter: this.state.filter,
        from: from,
        limit: this.state.limit,
      };
      this.props.fetchPosts(fetchOptions);
    });
  }

  render() {
    return (
      <Menu className={styles.postsNavbar} style={{marginTop: "50px", width: "100vw"}}>
        <Dropdown className={styles.sortPostsDropdown}
          text="Filter Posts"
          icon="caret square down"
          pointing
          floating
          labeled
          button >
          <Dropdown.Menu className={styles.menuDropdown} style={{margin: "0em !important"}}>
            <Dropdown.Header icon='filter' content='Filter by type' />
            <Dropdown.Divider />
            <Dropdown.Item onClick={this.handleSortClick} value={options.filter.new}>
              <Icon name="bullhorn" className="right floated" />
              {options.filter.new}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleSortClick} value={options.filter.trending}>
              <Icon name='heartbeat' className='right floated' />
              {options.filter.trending}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleSortClick} value={options.filter.heated}>
              <Icon name='fire' className='right floated' />
              {options.filter.heated}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleSortClick} value={options.filter.discussed}>
              <Icon name='conversation' className='right floated' />
              {options.filter.discussed}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className={styles.sortValue}>{this.state.filter}</div>
        <Dropdown className={styles.sortPostsTime}
          text="Time"
          icon="time"
          pointing
          floating
          labeled
          disabled={this.state.timeDisabled}
          button >
          <Dropdown.Menu>
            <Dropdown.Header content="Filter Time"/>
            <Dropdown.Divider />
            <Dropdown.Item onClick={this.handleTimeClick} value={options.time.day}>
              {options.time.day}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleTimeClick} value={options.time.week}>
              {options.time.week}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleTimeClick} value={options.time.month}>
              {options.time.month}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleTimeClick} value={options.time.allTime}>
              {options.time.allTime}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className={styles.sortValue}>{this.state.time}</div>
      </Menu>
    );
  }
};

PostsNavbar.propTypes = {
  fetchPosts: PropTypes.func.isRequired,
};

export default PostsNavbar;
import React, {Component} from "react";
import PropTypes from "prop-types";
import {postSearchOptions as options} from "../../../redux/searchOptions.js";
import { Menu, Dropdown, Icon } from "semantic-ui-react";
import styles from "../../../assets/stylesheets/posts/post.scss";

class PostsNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: options.filter.new,
      from: options.time.day,
      filterBarEnabled: true,
      timeBarEnabled: false,
    }
  }

  handleSortClick = (e) => {
    const value = e.target.getAttribute("data-value");
    switch (value) {
      case options.filter.new:
        this.setState({filter: value, from: options.time.none, timeBarEnabled: false}, () => {
          const fetchOptions = {
            filter: this.state.filter,
            from: this.state.time,
            limit: this.state.limit,
          };
          this.props.fetchPosts(fetchOptions)
        });
        break;
      case options.filter.trending:
        this.setState({filter: value, from: options.time.none, timeBarEnabled: false}, () => {
          const fetchOptions = {
            filter: this.state.filter,
            from: this.state.time,
            limit: this.state.limit,
          };
          this.props.fetchPosts(fetchOptions);
        });
        break;
      case options.filter.controversial:
        this.setState({filter: options.filter.controversial, from: options.time.day, timeBarEnabled: true},  () => {
          const fetchOptions = {
            filter: this.state.filter,
            from: this.state.time,
            limit: this.state.limit,
          };
          this.props.fetchPosts(fetchOptions);
        });
        break;
      case options.filter.discussed:
        this.setState({filter: options.filter.discussed, from: options.time.day, timeBarEnabled: true}, () => {
          const fetchOptions = {
            fitler: this.state.filter,
            from: this.state.time,
            limit: this.state.limit,
          };
          this.props.fetchPosts(fetchOptions);
        });
        break;
      default:
        this.setState({filter: options.filter.new, from: options.time.none, timeBarEnabled: false}, () => {
          const fetchOptions = {
            filter: this.state.filter,
            from: this.state.time,
            limit: this.state.limit,
          };
          this.props.fetchPosts(fetchOptions);
        });
    }
  }

  handleTimeClick = (e) => {
    const value = e.target.getAttribute("data-value");
    this.setState({from: value} , () => {
      //convert the time filter
      const fetchOptions = {
        filter: this.state.filter,
        from: this.state.from,
        limit: this.state.limit,
      };
      this.props.fetchPosts(fetchOptions);
    });
  }

  render() {
    return (
      <Menu className={styles.postsNavbar} style={{marginTop: "50px", width: "100vw"}} data-test={"posts-navbar"}>
        <Dropdown className={styles.sortPostsDropdown} data-test="nav-filter"
          text="Filter Posts"
          icon="caret square down"
          pointing
          floating
          labeled
          button >
          <Dropdown.Menu className={styles.menuDropdown} style={{margin: "0em !important"}}>
            <Dropdown.Header icon='filter' content='Filter by type' />
            <Dropdown.Divider />
            <Dropdown.Item onClick={this.handleSortClick} data-value={options.filter.new}>
              <Icon name="bullhorn" className="right floated" />
              {options.filter.new}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleSortClick} data-value={options.filter.trending}>
              <Icon name='heartbeat' className='right floated' />
              {options.filter.trending}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleSortClick} data-value={options.filter.controversial}>
              <Icon name='fire' className='right floated' />
              {options.filter.heated}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleSortClick} data-value={options.filter.discussed}>
              <Icon name='conversation' className='right floated' />
              {options.filter.discussed}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className={styles.sortValue}>{this.state.filter}</div>
        <Dropdown className={styles.sortPostsTime} data-test="post-time-filter"
          text="Time"
          icon="time"
          pointing
          floating
          labeled
          disabled={!this.state.timeBarEnabled}
          button >
          <Dropdown.Menu>
            <Dropdown.Header content="Filter Time"/>
            <Dropdown.Divider />
            <Dropdown.Item onClick={this.handleTimeClick} data-value={options.time.day}>
              {options.time.day}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleTimeClick} data-value={options.time.week}>
              {options.time.week}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleTimeClick} data-value={options.time.month}>
              {options.time.month}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleTimeClick} data-value={options.time.year}>
              {options.time.year}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleTimeClick} data-value={options.time.allTime}>
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
  authstate: PropTypes.object,
  fetchPosts: PropTypes.func.isRequired,
};

export default PostsNavbar;
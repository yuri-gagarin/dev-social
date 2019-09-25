import React, {Component} from "react";
import { Menu, Dropdown, Icon } from "semantic-ui-react";

import styles from "../../../assets/stylesheets/posts/post.scss";

const options = {
  filter: {
    trending: "Trending",
    heated: "Heated",
    discussed: "Discussed",
  },
  time: {
    day: "24 Hours",
    week: "7 Days",
    month: "30 Days",
    alltime: "All Time",
  },
}

class PostsNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: options.filter.trending,
      time: options.time.day,
    }
  }

  handleSortClick = (e, {value}) => {
    console.log(value)
    this.setState({
      filter: value,
    });
  }

  handleTimeClick = (e, {value}) => {
    this.setState({
      time: value,
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
            <Dropdown.Header icon='tags' content='Filter by tag' />
            <Dropdown.Divider />
            <Dropdown.Item onClick={this.handleSortClick} value={options.filter.trending}>
              <Icon name='attention' className='right floated' />
              {options.filter.trending}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleSortClick} value={options.filter.heated}>
              <Icon name='comment' className='right floated' />
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
            <Dropdown.Item onClick={this.handleTimeClick} value={options.filter.month}>
              {options.time.month}
            </Dropdown.Item>
            <Dropdown.Item onClick={this.handleTimeClick} value={options.filter.allTime}>
              {options.time.allTime}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <div className={styles.sortValue}>{this.state.time}</div>
      </Menu>
    );
  }
};

export default PostsNavbar;
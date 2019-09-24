import React, {Component} from "react";
import { Menu, Dropdown, Icon } from "semantic-ui-react";



class PostsNavbar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Menu style={{marginTop: "50px", width: "100vw"}}>
        <Dropdown
          text="Filter Posts"
          icon="filter"
          floating
          labeled
          button 
        >
        <Dropdown.Menu>
          <Dropdown.Header icon='tags' content='Filter by tag' />
          <Dropdown.Divider />
          <Dropdown.Item>
            <Icon name='attention' className='right floated' />
            Popular
          </Dropdown.Item>
          <Dropdown.Item>
            <Icon name='comment' className='right floated' />
            Heated
          </Dropdown.Item>
          <Dropdown.Item>
            <Icon name='conversation' className='right floated' />
            Discussed
          </Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
      </Menu>
    );
  }
};

export default PostsNavbar;
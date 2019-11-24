
export const guestNav = {
  main: {
    data: [
      {as: "a", content: "News", "data-value": "news", key: 1},
      {as: "a", content: "Topics", "data-value": "topics", key: 2},
      {as: "a", content: "Posts", "data-value": "posts", key: 3},
      {as: "a", content: "Users", "data-value": "users", key: 4},
    ],
  },
  innerMain: {
    news: [
      { as: "a", content: "View All", "data-value": "news-all", key: 0},
      { as: "a", content: "World", "data-value": "news-world", key: 1},
      { as: "a", content: "Tech", "data-value": "news-tech", key: 2},
      { as: "a", content: "Sports", "data-value": "news-sports", key: 3},
      { as: "a", content: "Politics", "data-value": "news-politics", key: 4},
    ],
    topics: [
      { as: "a", content: "View All", "data-value": "topics-all", key: 1},
      { as: "a", content: "Programming", "data-value": "topics-programming", key: 2},
      { as: "a", content: "Gaming", "data-value": "topics-gaming", key: 3},
      { as: "a", content: "Tech", "data-value": "topics-tech", key: 4},
      { as: "a", content: "Travel", "data-value": "topics-travel", key: 5}
    ],
    posts: [
      { as: "a", content: "All", "data-value": "posts-all", key: 1},
      { as: "a", content: "Newest", "data-value": "posts-new", key: 2},
      { as: "a", content: "Popular", "data-value": "posts-popular", key: 3},
      { as: "a", content: "Controversial", "data-value": "posts-controversial", key: 4},
    ],
    users: [
      { as: "a", content: "Followed Users", "data-value": "users-followed",  key: 1},
      { as: "a", content: "Following Users", "data-value": "users-following", key: 2},
      { as: "a", content: "Active Recently", "data-value": "users-active", key: 3},
    ],
  },
  rightItems: [
    {as: "a", content: "Login", key: "login"},
    {as: "a", content: "Register", key: "register"},
  ],
};

export const userNav = {
  main: {
    data: [
      {as: "a", content: "News", key: 1},
      {as: "a", content: "Topics", key: 2},
      {as: "a", content: "Posts", key: 3},
      {as: "a", content: "Users", key: 4},
    ],
  },
  innerMain: {
    news: [
      { as: "a", content: "View All", "data-value": "news-all", key: 0},
      { as: "a", content: "World", "data-value": "new-world", key: 1},
      { as: "a", content: "Tech", "data-value": "news-tech", key: 2},
      { as: "a", content: "Sports", "data-value": "news-sports", key: 3},
      { as: "a", content: "Politics", "data-value": "news-politics", key: 4},
      { as: "a", content: "Create New", "data-value": "create-new", key: 6},
      { as: "a", content: "My Articles","data-value": "my-articles", key: 7},
    ],
    topics: [
      { as: "a", content: "View All", "data-value": "topics-all", key: 1},
      { as: "a", content: "Programming", "data-value": "topics-programming", key: 2},
      { as: "a", content: "Gaming", "data-value": "topics-gaming", key: 3},
      { as: "a", content: "Tech", "data-value": "topics-tech", key: 4},
      { as: "a", content: "Travel", "data-value": "topics-travel", key: 5},
      { as: "a", content: "Create New", "data-value": "create-new", key: 7},
      { as: "a", content: "My Topics", "data-value": "my-topics", key: 8},
    ],
    posts: [
      { as: "a", content: "Newest", "data-value": "posts-new", key: 1},
      { as: "a", content: "Popular", "data-value": "posts-popular", key: 2},
      { as: "a", content: "Controversial", "data-value": "posts-controversial", key: 3},
      { as: "a", content: "Create New","data-value": "create-new", key: 5},
      { as: "a", content: "My Posts", "data-value": "my-topics", key: 6},
    ],
    users: [
      { as: "a", content: "Followed Users", "data-value": "users-followed",  key: 1},
      { as: "a", content: "Following Users", "data-value": "users-following", key: 2},
      { as: "a", content: "Active Recently", "data-value": "users-active", key: 3},
    ],
  },
  rightItems: [
    {as: "a", content: "Logout", key: "logout"},
    {as: "a", content: "My Acccount", key: "my_account"},
  ],
};

export const dashData = {
  guestDash: [

  ],
  userDash: [
    {as: "a", iconName: "user secret", content: "Profile", key: 1},
    {as: "a", iconName: "newspaper", content: "My Posts", key: 2},
    {as: "a", iconName: "comments", content: "My Comments", key: 3},
  ],
  moderatorDash: [
    //todo a moderator dashboard
  ],
  adminDash: [
    //todo an administrator dashboard
  ]
}

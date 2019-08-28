export const guestNav = {
  main: {
    data: [
      {as: "a", content: "News", key: "news",},
      {as: "a", content: "Topics", key: "topics" },
      {as: "a", content: "Posts", key: "posts" },
      {as: "a", content: "Users", key: "users"},
    ],
  },
  innerMain: {
    news: [
      { as: "a", content: "Newest", key: "newest"},
      { as: "a", content: "Popular", key: "popular"},
      { as: "a", content: "Controversial", key: "controversial"},
    ],
    topics: [
      { as: "a", content: "Newest", key: "newest"},
      { as: "a", content: "Popular", key: "popular"},
      { as: "a", content: "Controversial", key: "controversial"},
    ],
    posts: [
      { as: "a", content: "Newest", key: "newest"},
      { as: "a", content: "Popular", key: "popular"},
      { as: "a", content: "Controversial", key: "controversial"},
    ],
    users: [
      { as: "a", content: "Newest", key: "newest"},
      { as: "a", content: "Popular", key: "popular"},
      { as: "a", content: "Controversial", key: "controversial"},
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
      {as: "a", content: "News", key: "news",},
      {as: "a", content: "Topics", key: "topics" },
      {as: "a", content: "Posts", key: "posts" },
      {as: "a", content: "Users", key: "users"},
    ],
  },
  innerMain: {
    news: [
      { as: "a", content: "Newest", key: "newest"},
      { as: "a", content: "Popular", key: "popular"},
      { as: "a", content: "Controversial", key: "controversial"},
      { divider: "-", key: "handheldNavPostDivider"},
      { as: "a", content: "Create New", key: "createNewArticle"},
      { as: "a", content: "My Articles", key: "myArticles"},
    ],
    topics: [
      { as: "a", content: "Newest", key: "newest"},
      { as: "a", content: "Popular", key: "popular"},
      { as: "a", content: "Controversial", key: "controversial"},
      { divider: "-", key: "handheldNavPostDivider"},
      { as: "a", content: "Create New", key: "createNew"},
      { as: "a", content: "My Topics", key: "myPosts"},
    ],
    posts: [
      { as: "a", content: "Newest", key: "newest"},
      { as: "a", content: "Popular", key: "popular"},
      { as: "a", content: "Controversial", key: "controversial"},
      { divider: "-", key: "handheldNavPostDivider"},
      { as: "a", content: "Create New", key: "createNew"},
      { as: "a", content: "My Posts", key: "myPosts"},
    ],
    users: [
      { as: "a", content: "Newest", key: "newest"},
      { as: "a", content: "Popular", key: "popular"},
      { as: "a", content: "Controversial", key: "controversial"},
      { divider: "-", key: "handheldNavPostDivider"},
      { as: "a", content: "Create New", key: "createNew"},
      { as: "a", content: "My Posts", key: "myPosts"},
    ],
  },
  rightItems: [
    {as: "a", content: "Logout", key: "logout"},
    {as: "a", content: "My Acccount", key: "my_account"},
  ],
};

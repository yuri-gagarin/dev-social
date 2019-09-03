
export const guestNav = {
  main: {
    data: [
      {as: "a", content: "News", name: "news", key: "news",},
      {as: "a", content: "Topics", name: "topics", key: "topics" },
      {as: "a", content: "Posts", name: "posts", key: "posts" },
      {as: "a", content: "Users", name: "users", key: "users"},
    ],
  },
  innerMain: {
    news: [
      { as: "a", content: "All", name: "news_all", key: "all_news"},
      { as: "a", content: "Newest", name: "news_new", key: "new_news"},
      { as: "a", content: "Popular", name: "news_popular", key: "popular_news"},
      { as: "a", content: "Controversial", name: "news_controversial", key: "controversial_news"},
    ],
    topics: [
      { as: "a", content: "All", name: "topics_all", key: "all_topics"},
      { as: "a", content: "Newest", name: "topics_new", key: "new_topics"},
      { as: "a", content: "Popular", name: "topics_popular", key: "popular_topics"},
      { as: "a", content: "Controversial", name: "topics_controversial", key: "controversial_topics"},
    ],
    posts: [
      { as: "a", content: "All", name: "posts_all", key: "all_posts"},
      { as: "a", content: "Newest", name: "posts_new", key: "new_posts"},
      { as: "a", content: "Popular", name: "posts_popular", key: "popular_posts"},
      { as: "a", content: "Controversial", name: "posts_controversial", key: "controversial_posts"},
    ],
    users: [
      { as: "a", content: "Followed Users", name: "users_followed",  key: "followed_users"},
      { as: "a", content: "Following Users", name: "users_following", key: "following_users"},
      { as: "a", content: "Active Recently", name: "users_active", key: "active_recently"},
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

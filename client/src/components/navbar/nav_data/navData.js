import axios from "axios";
const handleClick = (e, {name}) => {
  console.log(e);
  console.log(name);
  switch(name) {
    case "all_posts":
      console.log("get all posts")
      axios.get("/api/posts")
  }
}
//function should extract info from the clicked item and reroute to the specific location
function handleNewsClick(event, {name}) {
  const namedEvent = name.split("_");
  const firstArg = namedEvent[0], secondArg = namedEvent[1];
  let route = `/${secondArg}/${firstArg}`;
  window.location.pathname = route;  
}

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
      { as: "a", content: "All", name: "all_news", key: "all_news", onClick: handleNewsClick},
      { as: "a", content: "Newest", name: "new_news", key: "new_news", onClick: handleNewsClick},
      { as: "a", content: "Popular", name: "popular_news", key: "popular_news", onClick: handleNewsClick},
      { as: "a", content: "Controversial", name: "controversial_news", key: "controversial_news", onClick: handleNewsClick},
    ],
    topics: [
      { as: "a", content: "All", name: "all_topics", key: "all_topics", onClick: handleClick},
      { as: "a", content: "Newest", name: "new_topics", key: "new_topics"},
      { as: "a", content: "Popular", name: "popular_topis", key: "popular_topics"},
      { as: "a", content: "Controversial", name: "controversial_topics", key: "controversial_topics"},
    ],
    posts: [
      { as: "a", content: "All", name: "all_posts", key: "all_posts", onClick: handleClick},
      { as: "a", content: "Newest", name: "new_posts", key: "new_posts"},
      { as: "a", content: "Popular", name: "popular_posts", key: "popular_posts"},
      { as: "a", content: "Controversial", name: "controversial_posts", key: "controversial_posts"},
    ],
    users: [
      { as: "a", content: "Followed Users", name: "followed_users",  key: "followed_users"},
      { as: "a", content: "Following Users", name: "following_users", key: "following_users"},
      { as: "a", content: "Active Recently", name: "active_recently", key: "active_recently"},
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

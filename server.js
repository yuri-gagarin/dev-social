const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/users.js");
const profile = require("./routes/profile.js");
const posts = require("./routes/posts.js");
const comments = require("./routes/comments.js");

const app = express();

const PORT = process.env.PORT || 3000;
const DB = require("./config/keys").mongoURI;

mongoose
  .connect(DB, {useNewUrlParser: true})
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello There Yo");
});

app.use(users);
app.use(profile);
app.use(posts);
app.use(comments);

app.listen(PORT, () => {
  console.log(`App listening at PORT: ${PORT}`);
});


const userRoutes = require("./users.js");
const commentRoutes = require("./comments.js");
const postRoutes = require("./posts.js");

module.exports = function(router) {
  userRoutes(router);
  commentRoutes(router);
  postRoutes(router);
}
import userRoutes from "./users.js";
import commentRoutes from "./comments.js";
import postRoutes from "./posts.js";
import profileRoutes from "./profile.js";

module.exports = function(router) {
  userRoutes(router);
  commentRoutes(router);
  postRoutes(router);
  profileRoutes(router);
}
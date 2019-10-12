import indexRoutes from "./index.js";
import userRoutes from "./users.js";
import commentRoutes from "./comments.js";
import postRoutes from "./posts.js";
import profileRoutes from "./profile.js";
import uploadRoutes from "./uploads.js";
import commentLikes from "./commentLikes.js";
import postDislikes from "./postDislikes.js";
import postLikes from "./postLikes.js";
import mainNav from "./mainNav.js";

export default function(router) {
  userRoutes(router);
  commentRoutes(router);
  postRoutes(router);
  profileRoutes(router);
  uploadRoutes(router);
  commentLikes(router);
  postDislikes(router);
  postLikes(router);
  indexRoutes(router);
  mainNav(router);
};
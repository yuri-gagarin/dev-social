import userRoutes from "./users.js";
import commentRoutes from "./comments.js";
import postRoutes from "./posts.js";
import profileRoutes from "./profile.js";
import uploadRoutes from "./uploads.js";

export default function(router) {
  userRoutes(router);
  commentRoutes(router);
  postRoutes(router);
  profileRoutes(router);
  uploadRoutes(router);
};
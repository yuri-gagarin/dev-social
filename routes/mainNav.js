import MainNavController from "../controllers/mainNavController.js";
export default function(router) {
  router 
    .route("/api/getmainnav")
    .get(MainNavController.getNav);
}
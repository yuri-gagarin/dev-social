import MainNavController from "../controllers/mainNavController.js";
import verifyLogin from "../helpers/access_control/verifyLogin.js";

export default function(router) {
  router 
    .route("/api/getmainnav")
    .get(verifyLogin, MainNavController.getNav);
}
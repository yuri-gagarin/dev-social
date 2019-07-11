import indexController from "../controllers/indexController.js";

export default function(router) {

  // @route "/index"
  // @desc test for index route
  // @access Public
  router
    .route("/index")
    .get(indexController.index);
    
};
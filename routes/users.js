
module.exports = function(router) {
  // @route GET /users
  // @desc Users test
  // @access Public
  router
    .route("/users")
    .get((req, res) => {
      res.json({
        message: "Users Works"
      });
    });
  
}


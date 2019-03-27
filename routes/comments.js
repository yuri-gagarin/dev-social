module.exports = function(router) {
  router
    .route("/comments")
    .get((req, res) => {
      res.json({
        message: "Comments works"
      });
    });
};
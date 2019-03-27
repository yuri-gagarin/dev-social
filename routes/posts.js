export default function(router) {
  router
    .route("/posts")
    .get((req, res) => {
      res.json({
        message: "Posts works"
      });
    });
};
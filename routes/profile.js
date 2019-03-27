export default function(router) {

  router
    .route("/profile")
    .get((req, res) => {
      res.json({
        message: "rendering profile"
      });
    });
};
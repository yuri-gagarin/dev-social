const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => {
  res.json({
    msesage: "users works"
  });
});

module.exports = router;
const express = require("express");
const router = express.Router();

router.get("/posts", (req, res) => {
  res.json({
    msesage: "posts works"
  });
});

module.exports = router;
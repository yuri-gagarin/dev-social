const express = require("express");
const router = express.Router();

router.get("/comments", (req, res) => {
  res.json({
    msesage: "comments works"
  });
});

module.exports = router;
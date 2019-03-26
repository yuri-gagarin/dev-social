const express = require("express");
const router = express.Router();

router.get("/profile", (req, res) => {
  res.json({
    msesage: "profile  works"
  });
});

module.exports = router;
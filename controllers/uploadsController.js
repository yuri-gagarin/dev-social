export default {
  uploadAvatar: (req, res) => {
    if (req.file) {
      res.json({
        message: "Successfully uploaded",
        file: req.file
      });
    }
    else {
      res.json({
        message: "No uploads",
        error: "wat",
        body: req.body.file
      });
    }
  }
};
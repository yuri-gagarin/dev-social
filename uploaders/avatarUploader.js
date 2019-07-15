import multer from "multer";
import path from "path";

let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads");
  },
  filename: (req, file, callback) => {
    const extName = path.extname(file.originalname);
    const fileName = file.originalname.split(".")[0];
    callback(null, `${fileName}_${Date.now()}${extName}`);
  }
});

let fileFilter = (req, file, callback) => {
  let valid = [".jpeg", ".jpg", ".gif", ".png"];
  let fileTypes = /jpeg|jpg|gif|png/;
  let mimeType = fileTypes.test(file.mimetype);
  let extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

  if (mimeType && extName) {
    return callback(null, true);
  }
  else {
    return callback(new Error(`You can only upload the following file types: ${valid.join(", ")}`), false);
  }
};

export default function(req, res, next) {
  
  let upload = multer({
    limits: {
      filesize: 4 * 1024 * 1024
    },
    storage: storage,
    fileFilter: fileFilter
  }).single("avatar");

  upload(req, res, function(error) {
    if (error instanceof multer.MulterError) {
      console.log(error)
      return res.status(500).json({
        message: "Upload error occured"
      });
    }
    else if(error) {
      return res.status(400).json({
        message: "Invalid file type",
        error: error.message
      });
    }
    else {
      return next();
    }
  });
};



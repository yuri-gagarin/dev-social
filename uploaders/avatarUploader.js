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
  const valid = file.mimetype === "image/png" || file.mimetype === "image/gif" || file.mimetype === "image/jpeg" || "image/png";

  if (valid) {
    callback(null, true);
  }
  else {
    callback(null, false);
  }
};

export default multer({
  limits: {
    filesize: 4 * 1024 * 1024
  },
  storage: storage,
  fileFilter: fileFilter
});


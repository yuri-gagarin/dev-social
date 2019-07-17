import multer from "multer";
import path from "path";

//avatar storage options
let avatarPath, fileName;

let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    avatarPath = path.join("uploads", "userAvatars");
    callback(null, avatarPath);
  },
  filename: (req, file, callback) => {
    //set a filename split the original filename and add a date stamp for original names
    const extName = path.extname(file.originalname);
    fileName = file.originalname.split(".")[0] + "_" + Date.now() + extName ;
    callback(null, fileName);
  }
});
//filter to make sure only allowed file types are allowed
let fileFilter = (req, file, callback) => {
  let valid = [".jpeg", ".jpg", ".gif", ".png"];
  let fileTypes = /jpeg|jpg|gif|png/;
  let mimeType = fileTypes.test(file.mimetype);
  let extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());

  if (mimeType && extName) {
    return callback(null, true);
  }
  //return an error for the wrong file type
  else {
    return callback(new Error(`You can only upload the following file types: ${valid.join(", ")}`), false);
  }
};

export default function(req, res, next) {
  
  //set a max filse size in bytes and upload optioms
  const fileSize = 5000000;
  let upload = multer({
    limits: {
      fileSize: fileSize
    },
    storage: storage,
    fileFilter: fileFilter
  }).single("avatar");

  //run the upload function
  upload(req, res, function(error) {
    //check for MulterError
    if (error instanceof multer.MulterError) {
      console.error(error);
      //account for a file size error
      if(error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File size error",
          error: error.message,
          explanation: `File size should be less than ${fileSize/1000000} Mb`
        });
      }
      else {
        console.error(error);
        return res.status(500).json({
          message: "Internal Server Error",
          error: error.message
        });
      }
    }
    else if(error) {
      return res.status(400).json({
        message: "Invalid file type",
        error: error.message
      });
    }
    else {
      //if uploaded avatar send avatarUpload object to the next middleware
      if(avatarPath && fileName) {
        req.locals = { avatarUpload: {
          message: "File uploaded",
          success: true,
          avatarPath: path.join(avatarPath, fileName)
          }
        };
        return next();
      }
      //else report to next midleware that no upload took place
      else {
        req.locals = { avatarUpload: {
          message: "No file uploaded",
          success: false,
          avatarPath: null
          }
        };
        return next();
      }
    }
  });
};



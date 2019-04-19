import fs from "fs";


export default function(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (error) => {
      if (error) {
        reject(error);
      }
      else {
        resolve("File successfuly deleted");
      }
    });
  });
};
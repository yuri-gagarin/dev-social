import fs from "fs";


export default function(filePath, data=undefined) {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (error) => {
      if (error) {
        reject(error);
      }
      else {
        if (data !== undefined) {
          resolve(data);
        }
        else {
          resolve("Successfully Deleted");
        }
      }
    });
  });
};
import fs from "fs";

/**
 * Deletes a file from the file system
 * @param {string} filePath Path to the file deleted
 * @param {Object} data Optional deleted object to return
 * @return {promise} A promise which resolves to an optional deleted object
 */
export default function(filePath, data=null) {

  return new Promise((resolve, reject) => {
    fs.stat(filePath, (error, stats) => {
      if (error) {
        if(error.code === "ENOENT") {
          reject(new Error("File not found"));
        }
        else {
          reject(error);
        }
      }
      else {
        fs.unlink(filePath, (error) => {
          if (error) {
            reject(error);
          }
          else {
            if(data) {
              resolve({
                success: true,
                message: "Successfully deleted",
                data: data
              });
            }
            else {
              resolve({
                success: true,
                message: "Successfully deleted",
                data: null
              });
            }
          }
        });
      }
    });
  });
};
import deleteFile from "../../helpers/APIhelpers/deleteFile.js";

/**
 * Cleans up upload in case of database error.
 * @param {string} path Path to the file to be deleted.
 * @param {object} res Express response object.
 * @return {function} Express server response.
 */
export default function(path, res, err) {
  console.log(10)
  if (err) {
    console.error({
      name: err.name,
      message: err.message
    });
  }
  deleteFile(path)
    .then((result) => {
      return res.status(400).json({
        message: "Error processing new avatar. Avatar not uploaded"
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        message: "An error occured on our end"
      });
    });
}
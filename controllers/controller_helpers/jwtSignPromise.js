import jsonwebtoken from "jsonwebtoken";

export default function(tokenPayload, secretkey, opts) {
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign(tokenPayload, secretkey, opts, (error, token) => {
      if (error) {
        reject(error);
      }
      else {
        resolve({success: true, token: token});
      }
    });
  });
}


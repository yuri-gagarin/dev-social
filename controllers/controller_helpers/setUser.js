import getIp from "./getIp.js";
import getUserInfo from "./getUserInfo.js";
import rejectionPromise from "../../helpers/APIhelpers/rejectionPromise.js";

export default function (request) {
  let clientIp = getIp(request);
  let user = {};
  //reject if no IP adress
  if (!clientIp) {
    return rejectionPromise("Seems no IP adress was present");
  }
  //else attempt to get detailed client information
  return (
    getUserInfo(clientIp)
      .then((userData) => {
        //if there is a signed in user
        if (request.user) {
          user.name = request.user.name;
          user.email = request.user.email;
          user.role = request.user.role;
          user.ip = request.ip || null;
          user.userData = userData;
        }
        //otherwise build a guest object
        else {
          user.name = "anonymous";
          user.email = "anonymous";
          user.role = "guest";
          user.ip = request.ip || null;
          user.userData = userData;
        }
        return user;
      })
      .catch((err) => {
        console.log(err);
        return user;
      })
  );
};


import RBAC from "./RBAC.js";
import Roles from "../../models/access_control/Roles.js";
import User from "../../models/User.js";

export default function (modelName, action) {
  
  return async function(req, res, next) {


    if (typeof modelName !== "string") {
      throw new TypeError("Expected the first argument to be model name : String");
    }
    if (typeof action !== "string") {
      throw new TypeError("Expected the second arguemnt to be action name : String");
    }
    const model = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    try {
      const user = await User.findOne({_id: req.user._id}).exec();
      return res.json({
        message: "Success",
        user,
        model
      });
    }
    catch (err) {
      return res.status(401).json({
        message: "error",
        errors: err
      });
    }
  }
}
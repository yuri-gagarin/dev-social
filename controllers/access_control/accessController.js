import RBAC from "./RBAC.js";
import Roles from "../../models/access_control/Roles.js";
import User from "../../models/User.js";

export default function (modelName, action) {
  
  return async function(req, res, next) {

    //load RBAC
    const rbac = new RBAC(Roles);

    //type checks for arguments
    if (typeof modelName !== "string") {
      next(new TypeError("Expected the first argument to be model name : String"));
    }
    if (typeof action !== "string") {
      next(new TypeError("Expected the second argument to be action name : String"));
    }
    //keys of params passed in by request
    const paramKeys = Object.keys(req.params);
    //request parameters
    const params = req.params;
    const userId = req.user._id;
    const modelId = params.id || params[paramKeys[0]];

    //get the model name to be modified and normalize
    const _model = modelName.charAt(0).toUpperCase() + modelName.slice(1);

    console.log(44)
    try {
      //get the Model to be modified and the user
      const MongoModel = await loadModel(_model);
      const user = await User.findOne({_id: req.user._id}).exec();
      const model = await MongoModel.findOne({_id: modelId}).exec();
      
      //check for valid User and Mongoose.Model to be modified
      if (!user || !model) {
        return res.status(401).json({
          message: "Not Authorized"
        });
      }

      //assign a user role from the user model
      let userRole = user.role || "user";
      //params for rbac.can() function
      const rbacParams = {
        userId: userId.toString(),
        modelId: modelId.toString(),
        modelUserId: model.user.toString(),
      };
      //check for permission object
      const permission = await rbac.can(userRole, action, rbacParams);

      //if permitted next()
      if (permission.permitted) {
        next();
      }
      //ottherwise return 401
      else {
        return res.status(401).json({
          message: "Not Permitted to carry out this operation"
        });
      }
    }
    catch (err) {
      return res.status(401).json({
        message: "error",
      });
    }
  }
};

function loadModel(modelName) {
  return new Promise((resolve, reject) => {
    let model = require("../../models/"+modelName+".js");
    if(model) {
      resolve(model.default);
    }
    else {
      reject("Couldnt load model");
    }
  });
};

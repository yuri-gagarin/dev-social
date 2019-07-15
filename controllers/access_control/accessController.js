import RBAC from "./RBAC.js";
import Roles from "../../models/access_control/Roles.js";
import User from "../../models/User.js";
import isEmpty from "../../helpers/validators/isEmpty.js";

export default function (modelName, action) {
  
  return async function(req, res, next) {

    //type checks for arguments
    if (typeof modelName !== "string") {
      next(new TypeError("Expected the first argument to be {Model Name} : {String}"));
    }
    if (typeof action !== "string") {
      next(new TypeError("Expected the second argument to be {Action Name} : {String}"));
    }
    //load RBAC
    let user, model, modelId, paramKeys, MongoModel;
    const rbac = new RBAC(Roles);
    const userId = req.user.id;
    const params = req.params;
    const rbacParams = {};

    //keys of params passed in by request
    //modelId to be modified should be the first parameter
    if (!isEmpty(params)) {
      paramKeys = Object.keys(req.params);
      modelId = params.id || params[paramKeys[0]] || null;
    }

    //get the model name to be modified and normalize
    const _model = modelName.charAt(0).toUpperCase() + modelName.slice(1);

    try {
      //get the User
      user = await User.findOne({_id: req.user._id}).exec();

      //check for valid User 
      if (!user) {
        return res.status(401).json({
          message: "Not Authorized"
        });
      }

      if (modelId) {
        MongoModel = await loadModel(_model);
        model = await MongoModel.findOne({_id: modelId}).exec();
        
        if (model.user) {
          rbacParams.modelUserId = model.user.toString();
        }
        else {
          rbacParams.modelUserId = null;
        }  
      }
      
      //assign a user role from the user model
      let userRole = user.role || "guest";

      //params for rbac.can() function
      rbacParams.userId = userId.toString(),
      rbacParams.modelId = modelId ? modelId.toString() : null;
      

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
      console.log(err);
      return res.status(400).json({
        message: "An error occured"
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
      reject("Couldn't load model");
    }
  });
};

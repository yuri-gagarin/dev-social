import verifyParams from "../../helpers/access_control/verifyAccessParams.js";

export default {
  super_admin: {
    can: ["assign_administrator"],
    inherits: ["administrator"]
  },
  administrator: {
    can: ["edit_comment","edit_post", "modify_user", "assign_moderator", "delete_user", "delete_profile"],
    inherits: ["moderator"]
  },
  moderator: {
    can: ["delete_post", 'delete_comment', "ban_user"],
    inherits: ["user"]
  },
  user: {
    can: [
      "create_comment",
      {
        name: "edit_comment",
        when: ((params, cb) => {
          verifyParams(params);
          if (cb && typeof cb === "function") {
            if (params.userId === params.modelUserId) {
              cb(undefined, true);
            }
            else {
              cb(undefined, false);
            }
          }
          return params.userId === params.modelUserId;
        })
      },
      {
        name: "delete_comment",
        when: ((params, cb) => {
          verifyParams(params);
          if (cb && typeof cb === "function") {
            if (params.userId === params.modelUserId) {
              cb(undefined, true);
            }
            else {
              cb(undefined, false);
            }
          }
          return params.userId === params.modelUserId;
        })
      },
      "create_post", 
      {
        name: "edit_post",
        when: ((params, cb) => {
          verifyParams(params);
          if (cb && typeof cb === "function") {
            if (params.userId === params.modelUserId) {
              cb(undefined, true);
            }
            else {
              cb(undefined, false);
            }
          }
          else {
            return params.userId === params.modelUserId;
          }
        })
      },
      {
        name: "delete_post",
        when: ((params, cb) => {
          verifyParams(params);
          if (cb && typeof cb === "function") {
            if(params.userId === params.modelUserId) {
              cb(undefined, true);
            }
            else {
              cb(undefined, false);
            }
          }
          return params.userId === params.modelUserId;
        })
      },
      {
        name: "edit_user",
        when: ((params, cb) => {
          if (cb && typeof cb === "function") {
            if(params.userId === params.modelId) {
              cb(undefined, true);
            }
            else {
              cb(undefined, false);
            }
          }
          return params.userId === params.modelId;
        })
      },
      {
        name: "delete_user",
        when: ((params, cb) => {
          if (cb && typeof cb === "function") { 
            if(params.userId === params.modelId) {
              cb(undefined, true);
            }
            else {
              cb(undefined, false);
            }
          }
          return params.userId === params.modelId;
        })
      }        
    ],
    inherits: ["guest"]
  },
  guest: {
    can: ["read"]
  }
};


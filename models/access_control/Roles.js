import verifyParams from "../../helpers/access_control/verifyAccessParams.js";

export default {
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
            if (params.userId === params.commentUser) {
              cb(undefined, true);
            }
            else {
              cb(undefined, false);
            }
          }
          return params.userId === params.commentId;
        })
      },
      {
        name: "delete_comment",
        when: ((params, cb) => {
          verifyParams(params);
          if (cb && typeof cb === "function") {
            if (params.userId === params.commentUser) {
              cb(undefined, true);
            }
            else {
              cb(undefined, false);
            }
          }
          return params.userId === params.commentId;
        })
      },
      "create_post", 
      {
        name: "edit_post",
        when: ((params, cb) => {
          verifyParams(params);
          if (cb && typeof cb === "function") {
            if (params.userId === params.postUser) {
              cb(undefined, true);
            }
            else {
              cb(undefined, false);
            }
          }
          else {
            return params.userId === params.postId;
          }
        })
      },
      {
        name: "delete_post",
        when: ((params, cb) => {
          verifyParams(params);
          if (cb && typeof cb === "function") {
            if(params.userId === params.postUser) {
              cb(undefined, true);
            }
            else {
              cb(undefined, false);
            }
          }
          return user.userId === params.postUser;
        })
      }
    ],
    inherits: ["guest"]
  },
  guest: {
    can: ["read"]
  }
};


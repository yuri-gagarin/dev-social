import verifyAccessParams from "../../helpers/access_control/verifyAccessParams.js";

export default {
  administrator: {
    can: ["edit_comment","edit_post", "modify_user", "assign_moderator", "delete_user"],
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
        when: ((params) => {
          verifyParams(params);
          return params.userId === params.commentId;
        })
      },
      {
        name: "delete_comment",
        when: ((params) => {
          verifyParams(params);
          return params.userId === params.commentId;
        })
      },
      "create_post", 
      {
        name: "edit_post",
        when: ((params) => {
          verifyParams(params);
          return params.userId === params.postId;
        })
      },
      {
        name: "delete_post",
        when: ((user, params) => {
          verifyParams(params);
          return user.userId === params.postId;
        })
      }
    ],
    inherits: ["reader"]
  },
  guest: {
    can: ["read"]
  }
};
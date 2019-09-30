import Post from "../../models/Post.js";
import Comment from "../../models/Comment.js";
import faker from "faker";
/**
 * Seeds a random number of comments per post between 1 and maxComments;
 * @param {Object[]} users - A User(s) object Array.
 * @param {Object[]} posts - A Post(s) object Array.
 * @param {number} maxComments - Maximum number of Comment(s) per Post to create. Default 5;
 * @param {Date | function } createdDate - Date Comment was created or function to created Date (optional).
 * @returns {Promise} A Promise which resolves to an Array of Comment objects or NULL.
 */
export const seedComments = async (users, posts, maxComments=5, createdDate=null) => {
  const comments = [];
  const now = new Date();
  for (let i = 0; i < posts.length; i++) {
    const numOfComments  = Math.floor((Math.random() * maxComments) + 1);
    const userIndex = Math.floor(Math.random() * users.length);
    for(let j = 0; j < numOfComments; j++) {
      try {
        let createdAt;
        let post = await Post.findOne({_id: posts[i]._id});
        if (typeof createdDate === "function") {
          createdAt = createdDate(post.createdAt, now);
        }
        else {
          createdAt = createdDate
        }
        const comment = await Comment.create({
          user: users[userIndex]._id,
          text: faker.lorem.paragraph(1),
          post: posts[i]._id,
          likeCount: 0,
          createdAt: createdAt,
        });
        post.comments.push(comment._id);
        await post.save();
        comments.push(comment);
      }
      catch(error) {
        console.error(error);
        return null;
      }
    }
  }
  return comments;
};

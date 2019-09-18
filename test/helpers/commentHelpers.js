import Post from "../../models/Post.js";
import Comment from "../../models/Comment.js";
import faker from "faker";


export const seedComments = async (users, posts) => {
  for (let i = 0; i < posts.length; i++) {
    const numOfComments  = Math.floor((Math.random() * 10) + 1);
    const userIndex = Math.floor(Math.random() * users.length);
    for(let j = 0; j < numOfComments; j++) {
      try {
        await Comment.create({
          user: users[userIndex]._id,
          text: faker.lorem.paragraph(1),
          post: posts[i]._id,
        });
      }
      catch(error) {
        console.error(error);
      }
    }
  }
};

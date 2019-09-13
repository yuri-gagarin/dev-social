import faker from "faker";
import Post from "../../models/Post.js";
/**
 * 
 */
export const generatePost = (user)=> {
  const post = {
    author: faker.name.findName(),
    title: faker.lorem.word(),
    text: faker.lorem.paragraphs(2),
    likes: 0,
  };
  return post;
};
/**
 * Creates a a random Post.
 * @param {object} user User model object.
 */
export const createPost = async(user) => {
  const post = {
    user: user._id,
    author: user.name + " " + user.lastName,
    title: faker.lorem.word(),
    text: faker.lorem.paragraphs(2),
    likes: 0,
  };
  try {
    return await Post.create(post);
  }
  catch (error) {
    console.error(error);
    return false;
  }
} ;

export const createPosts = async(count, user) => {
  const posts = [];
  for (let i = 1; i <= count; i++) {
    const post = {
      user: user._id,
      author: user.name + " " + user.lastName,
      title: faker.lorem.word(),
      text: faker.lorem.paragraphs(2),
      likes: 0,
    };
    posts.push(post);
  }
  try {
    await Post.insertMany(posts);
    return true;
  }
  catch(err) {
    console.log(err);
    return false;
  }
};
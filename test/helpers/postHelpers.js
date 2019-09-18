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
};

export const seedPosts = async (count, users) => {
  const posts = [];
  if(Array.isArray(users)) {
    for(let i = 0; i < users.length; i++) {
      for(let j = 0; j < count; j++) {
        const post = {
          user: users[i]._id,
          author: users[i].name + " " + users[i].lastName,
          title: faker.lorem.word(),
          text: faker.lorem.paragraphs(2),
          likes: 0,
        };
        posts.push(post);
      }
    }
  }
  try {
    const createdPosts = await Post.insertMany(posts);
    return createdPosts;
  }
  catch (error) {
    console.log(error);
    return null;
  }
};

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
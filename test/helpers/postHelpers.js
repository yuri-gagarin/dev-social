import faker from "faker";
import Post from "../../models/Post.js";
import PostLike from "../../models/PostLike.js";
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
/**
 * Creats a specific number of Post(s).
 * @param {number} count - A number of Post(s) to create. Default 10.
 * @param {Object[]} users - An array of User objects to be tied to Posts(s). 
 */
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
    console.log(`Created ${createdPosts.length} Post(s);`)
    return createdPosts;
  }
  catch (error) {
    console.log(error);
    return null;
  }
};
/**
 * Creates a random number of PostLike(s) per Post (the number will always be <= Users).
 * @param {Object[]} posts - An Array with Post objects. 
 * @param {Object[]} users - An Array with User objects.
 * @returns {Promise} A promise which resolves to ether the number of PostLike(s) created or NULL.
 */
export const likePosts = async (posts, users) => {
  let postLikeCount = 0;
  for (let i = 0; i < posts.length; i++) {
    // set a random number of max likes;
    // will always be <= users.length;
    const numOfLikes = Math.floor(Math.random() * (users.length + 1));
    for (let j = 0; j < numOfLikes; j++) {
      try {
        await PostLike.create({postId: posts[i]._id, userId: users[j]._id,});
        await Post.findOneAndUpdate({_id: posts[i]._id}, {$inc:{likeCount: 1}});
        postLikeCount+=1;
      }
      catch(error) {
        console.error(error);
        return null;
      }
    }
  };
  console.log(`Created ${postLikeCount} PostLikes(s);`);
  return postLikeCount;
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
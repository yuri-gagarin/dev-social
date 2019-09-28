import faker from "faker";
import Post from "../../models/Post.js";
import PostLike from "../../models/PostLike.js";
/**
 * Generates Post data.
 * 
 */
export const generatePost = (user)=> {
  const post = {
    author: faker.name.findName(),
    title: faker.lorem.word(),
    text: faker.lorem.paragraphs(2),
    likeCount: 0,
  };
  return post;
};
/**
 * Creates a a random Post.
 * @param {object} user - User model object.
 * @returns {Promise} A Promise which either resolves to a new Post object or NULL.
 */
export const createPost = async(user) => {
  const post = {
    user: user._id,
    author: user.name + " " + user.lastName,
    title: faker.lorem.word(),
    text: faker.lorem.paragraphs(2),
    likeCount: 0,
  };
  try {
    return await Post.create(post);
  }
  catch (error) {
    console.error(error);
    return null;
  }
};
/**
 * Creates a specific number of Post(s).
 * @param {number} count - A number of Post(s) per User to create. Default 10.
 * @param {Object[]} users - An array of User objects to be tied to Posts(s).
 * @param {Date | function} createdDate - An optional date object to created a post at certain date.
 * @returns {Promise} A promise which resolves to either an Array of Post(s) or NULL.
 */
export const seedPosts = async (count, users, createdDate=null) => {
  const posts = [];
  if(Array.isArray(users)) {
    for(let i = 0; i < users.length; i++) {
      for(let j = 0; j < count; j++) {
        let createdAt;
        if (typeof createdDate === "function") {
          createdAt = createdDate();
        }
        else {
          createdAt = createdDate;
        }
        const post = {
          user: users[i]._id,
          author: users[i].name + " " + users[i].lastName,
          title: faker.lorem.word(),
          text: faker.lorem.paragraphs(2),
          likeCount: 0,
          createdAt: createdAt,
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
/**
 * Creates a random number of PostLike(s) per Post (the number will always be <= Users).
 * @param {Object[]} posts - An Array with Post objects. 
 * @param {Object[]} users - An Array with User objects.
 * @param {Date | function} createdDate - Date when PostLike was created  or a Function for random Date (optional).
 * @returns {Promise} A promise which resolves to either the number of PostLike(s) created or NULL.
 */
export const likePosts = async (posts, users, createdDate=null) => {
  let postLikeCount = 0;
  for (let i = 0; i < posts.length; i++) {
    // set a random number of max likes;
    // will always be <= users.length;
    const numOfLikes = Math.floor(Math.random() * (users.length + 1));
    for (let j = 0; j < numOfLikes; j++) {
      try {
        let createdAt;
        if (typeof createdDate === "function") {
          createdAt = createdDate();
        }
        else {
          createdAt = createdDate;
        }
        await PostLike.create({postId: posts[i]._id, userId: users[j]._id, createdAt: createdAt});
        await Post.findOneAndUpdate({_id: posts[i]._id}, {$inc:{likeCount: 1}});
        postLikeCount+=1;
      }
      catch(error) {
        console.error(error);
        return null;
      }
    }
  };
  return postLikeCount;
};
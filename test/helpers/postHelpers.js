import faker from "faker";
import Post from "../../models/Post.js";
import PostLike from "../../models/PostLike.js";
import PostDislike from "../../models/PostDislike.js";
import { calcControversy } from "../../controllers/controller_helpers/likeHelpers.js";
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
    dislikeCount: 0,
  };
  return post;
};
/**
 * Creates a a random Post.
 * @param {object} user - User model object.
 * @returns {Promise} A Promise which either resolves to a new Post object or NULL.
 */
export const createPost = (user) => {
  const post = {
    user: user._id,
    author: user.name + " " + user.lastName,
    title: faker.lorem.word(),
    text: faker.lorem.paragraphs(2),
    likeCount: 0,
    dislikeCount: 0,
  };
  return Post.create(post);
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
        try {
          const newPost = await Post.create(post);
          posts.push(newPost);
        }
        catch (error) {
          return(error);
        }
      }
    }
  }
  return posts;
};
/**
 * Creates a random number of PostLike(s) per Post (the number will always be <= Users).
 * @param {Object[]} posts - An Array with Post objects. 
 * @param {Object[]} users - An Array with User objects.
 * @param {function} createdDate - Date when PostLike was created  or a Function for random Date (optional).
 * @returns {Promise} A promise which resolves to either the number of PostLike(s) created or NULL.
 */
export const likePosts = async (posts, users, createdDate=null) => {
  let postLikeCount = 0;
  let now = new Date();
  let post;
  try {
    for (let i = 0; i < posts.length; i++) {
      // set a random number of max likes;
      // will always be <= users.length;
      post = await Post.findOne({_id: posts[i]._id});
      const numOfLikes = Math.floor(Math.random() * (users.length + 1));
      for (let j = 0; j < numOfLikes; j++) {
        let createdAt;
        //check for a function to create a specific date
        if (typeof createdDate === "function") {
          createdAt = createdDate(post.createdAt, now);
        }
        else {
          createdAt = createdDate;
        }
        await PostLike.create({postId: posts[i]._id, userId: users[j]._id, createdAt: createdAt});
        post.likeCount += 1;
        postLikeCount += 1;
      }
      post.controversyIndex = calcControversy({likeCount: post.likeCount, dislikeCount: post.dislikeCount});
      await post.save()
    }
    return postLikeCount;
  }
  catch (error) {
    return error;
  }
};
/*
export const likePostNumOfTimes = async(post, users, createdDate=null) => {
  let now  = new Date();
  let post = await Post.findOne({_id: post._id});
  for (let i = 0; i < users.length; i++) {
    try {
      let createdAt;
      if(typeof createdDate === "function") {
        createdAt = createdDate(post.createdAt, now);
      }
      else {
        createdAt = createdDate;
      }
      await PostLike.create({postId: post._id, userId: users[i]._id, createdAt: createdAt});
      post.likeCount += 1;
    }
    catch (error) {
      return Promise.reject(error);
    }
  }
  return post.save();
};
*/
/**
 * Creates a random number of PostDislike(s) per Post (the number will always be <= Users).
 * @param {Object[]} posts - An Array with Post objects. 
 * @param {Object[]} users - An Array with User objects.
 * @param {function} createdDate - Date when PostDislike was created  or a Function for random Date (optional).
 * @returns {Promise} A promise which resolves to either the number of Postdislike(s) created or NULL.
 */
export const dislikePosts = async(posts, users, createdDate=null) => {
  let postDislikeCount = 0;
  let now  = new Date();
  let post;
  try {
    for (let i = 0; i < posts.length; i++) {
      const numOfDislikes = Math.floor(Math.random() * (users.length + 1));
      post = await Post.findOne({_id: posts[i]._id});
      for (let j = 0; j < numOfDislikes; j++) {
        let createdAt;
        if (typeof createdDate === "function") {
          // this creates a dislike between the Post.createdAt and now
          createdAt = createdDate(post.createdAt, now);
        }
        else {
          createdAt = createdAt;
        }
        await PostDislike.create({postId: posts[i]._id, userId: users[j]._id, createdAt: createdAt});
        post.dislikeCount += 1;
        postDislikeCount +=1;
      }
      post.controversyIndex = calcControversy({likeCount: post.likeCount, dislikeCount: post.dislikeCount});
      await post.save();
    }
    return postDislikeCount;
  }
  catch (error) {
    return error;
  }
};

export const dislikePostNumOfTimes = async(post, numOfDislikes, createdDate=null) => {
  let now = new Date();
  try {
    let allUsers = await User.find({});
    let postLikes = await PostLike.find({postId: post._id});
    let userIds = allUsers.map((user) => {return user._id.toString()});
    for (const userId of userIds) {
      for(const postLike of postLikes) {
        if(userId === postLike._id.toString()) {
          const index = postsLikes.indexOf(userId);
          postLikes.splice(index, 1);
        }
      }
    }
    //check for enough users for dislikes
    if(userIds.length < numOfDislikes) {
      //create more users
      const usersToCreate = numOfDislikes - userIds.length;
      let additionalUsers = await createUsers(usersToCreate);
      for(const user of additionalUsers) {
        userIds.push(user._id.toString());
      }
    }
    for (const userId of userIds) {
      let createdAt;
      if (typeof createdDate === "function") {
        createdAt = createdDate(post.createdAt, now);
      }
      else {
        createdAt = createdDate;
      }
      await PostDislike.create({userId: userId, postId: post._id, createdAt: createdAt});
      post.dislikeCount +=1;
    }
    post.controversyIndex = calcControversy({likeCount: post.likeCount, dislikeCount: post.dislikeCount});
    await Post.findByIdAndUpdate(post._id, {controversyIndex: post.controversyIndex, dislikeCount: post.dislikeCount});
    return PostDislike.countDocuments({});
  }
  catch(error) {
    return error;
  }
};
/**
 * Creates controversial Post(s) for testing and development database.
 * @param {Array} users - An array of Users.
 * @param {number} postsPerUser - How many Post(s) per User to create.
 * @param {function|Date} createdDate - Either a function for date params or Date (optional).
 * @returns {Promise} A Promise which resolves to True on success.
 */
export const createControversialPosts = async(users, postsPerUser=10, createdDate=null) => {

  // a fail safe if not enough users were passed in
  if(users.length < 4) {
    let restUsers = 4 - users.length;
    let newUsers = await createUsers(restUsers);
    users.concat(newUsers);
  }
  let now = new Date();
  let updatedPosts = [];
  try {
    let createdPosts = await seedPosts(postsPerUser, users, createdDate);
    for (const post of createdPosts) {
      let randomNum = 0;
      while(randomNum < 4) {
        randomNum = Math.floor(Math.random() * users.length) + 1;
      }
      for (let i = 0; i < randomNum; i++) {
        let createdAt;
        if(typeof createdDate === "function") {
          createdAt = createdDate(post.createdAt, now);
        }
        else {
          createdAt = createdDate;
        }
        if(i % 2 === 0) {
          await PostLike.create({userId: users[i]._id, postId: post._id, createdAt: createdAt});
          post.likeCount += 1;
        }
        else {
          await PostDislike.create({userId: users[i]._id, postId: post._id, createdAt: createdAt});
          post.dislikeCount += 1;
        }
      }
    }
    for (const post of createdPosts) {
      let updatedPost = await post.save();
      updatedPosts.push(updatedPost);
    }
    return updatedPosts
  }
  catch (error) {
    return error;
  }
};





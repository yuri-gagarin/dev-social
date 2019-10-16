import faker from "faker";
import Post from "../../models/Post.js";
import PostLike from "../../models/PostLike.js";
import PostDislike from "../../models/PostDislike.js";
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
        try {
          const newPost = await Post.create(post);
          posts.push(newPost);
        }
        catch (error) {
          console.error(error);
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
  for (let i = 0; i < posts.length; i++) {
    // set a random number of max likes;
    // will always be <= users.length;
    const numOfLikes = Math.floor(Math.random() * (users.length + 1));
    for (let j = 0; j < numOfLikes; j++) {
      try {
        let createdAt;
        let post = await Post.findOne({_id: posts[i]._id});
        //check for a function to create a specific date
        if (typeof createdDate === "function") {
          createdAt = createdDate(post.createdAt, now);
        }
        else {
          createdAt = createdDate;
        }
        await PostLike.create({postId: posts[i]._id, userId: users[j]._id, createdAt: createdAt});
        post.likeCount +=1;
        await post.save();
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


export const dislikePosts = async(posts, users, createdDate=null) => {
  let postDislikeCount = 0;
  let now  = new Date();
  for (let i = 0; i < posts.length; i++) {
    const numOfDislikes = Math.floor(Math.random() * (users.length + 1));
    for (let j = 0; j < numOfDislikes; j++) {
      try {
        let createdAt;
        let post = await Post.findOne({_id: posts[i]._id});
        if (typeof createdDate === "function") {
          // this creates a dislike between the Post.createdAt and now
          createdAt = createdDate(post.createdAt, now);
        }
        else {
          createdAt = createdAt;
        }
        await PostDislike.create({postId: posts[i]._id, usrId: users[j]._id, createdAt: createdAt});
        post.dislikeCount += 1;
        await post.save();
        postDislikeCount +=1;
      }
      catch(error) {
        console.error(error)
        return null;
      }
    }
  }
  return postDislikeCount;
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
    }
    return PostDislike.countDocuments({});
  }
  catch(error) {
    return error;
  }
};

export const createControversialPosts = async(users, number, createdDate=null) => {
  let now = new Date();
  try {
    let createdPosts = await seedPosts(number, users, createdDate);
    for (const post of createdPosts) {
      for (let i = 0; i < users.length; i++) {
        let createdAt;
        if(typeof createdDate === "function") {
          createdAt = createdDate(post.createdAt, now);
        }
        else {
          createdAt = createdDate;
        }
        if(i % 2 === 0) {
          await PostLike.create({userId: users[i]._id, postId: post._id, createdAt: createdAt});
        }
        else {
          await PostDislike.create({userId: users[i]._id, postId: post._id, createdAt: createdAt});
        }
      }
    }
    return true;
  }
  catch (error) {
    return error;
  }
};





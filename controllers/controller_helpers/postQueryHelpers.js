import Post from "../../models/Post.js";

const getTrendingPosts = (fromDate, toDate) => {
  //hot posts should be recent, well discussed and liked.  
  return Post.find(
    {likeCount: {$gte: 10}, commentCount: {$gte: 5}}, 
    {}, 
    {sort: {createdAt: -1}, limit: 10}
  );
}
/**
 * Returns dated Post(s) between specific dates or newest Post(s).
 * @param {object} options Options object.
 * @param {string} options.toDate - Upper limit date for Post query (optional).
 * @param {string} options.fromDate - Lower limit date for Post query (optional).
 * @param {number} options.limit - A numerical limit for the query (optional).
 * @returns {Promise} Mongoose query promise for Post model.
 */
const getDatedPosts = (options) => {
  const {fromDate, toDate, limit=10} = options;
  //so here we should be able to pull new posts or posts between a specific date
  //if no date constraints, return newest posts
  if(!fromDate && !toDate) {
    return Post.find({}, {}, {sort: {createdAt: -1}, limit: limit})
  }
  else if (fromDate && !toDate) {
    return Post.find(
      {createdAt: {$gte: fromDate}}, 
      {}, 
      {sort: {createdAt: -1}, limit: limit}
    );
  }
  else if (fromDate && toDate) {
    return Post.find(
      {createdAt: {$gte: fromDate, $lte: toDate}}, 
      {}, 
      {sort: {createdAt: -1}, limit: limit}
    );
  }
  else {
    return Post.find({});
  }
};
/**
 * A query on Post object which returns discussed Posts
 * @param {object} options Options object.
 * @param {string} options.toDate - Upper limit date for Post query (optional).
 * @param {string} option.fromDate - Lower limit date for Post query (optional).
 * @param {number} options.limit - A numerical limit for the query (optional).
 * @returns {Promise} Mongoose query promise for Post model.
 */
const getDisccussedPosts = (options) => {
  const {fromDate, toDate, limit=10} = options;
  if(fromDate && toDate) {
    return Post.find(
      {createdAt: {$gte: fromDate, $lte: toDate}},
      {},
      {sort: {commentCount: -1}, limit: limit},
    );
  }
  else if(fromDate && !toDate) {
    return Post.find(
      {createdAt: {$gte: fromDate}},
      {},
      {sort: {commentCount: -1}, limit: limit},
    );
  }
  else {
    return Post.find(
      {},
      {},
      {sort: {commentCount: -1}, limit: limit}
    );
  }
};
/**
 * Returns a query for 'heated Post(s)'. Post(s) with a close ratio to Like/Dislike.
 * @param {object} options - An options object.
 * @param {string} options.fromDate - Lower limit date for the query. 
 * @param {string} options.toDate - Upper limit date for the query.
 * @param {number} options.limit - A limit for the query.
 * @returns {Promise} Mongoose query promise for Post model.
 */
const getHeatedPosts = (options) => {
  const {fromDate, toDate, limit=50} = options;
  const UPPER_LIMIT = 65;
  const LOWER_LIMIT = 35;
  const heatedPosts = [];
  //this should have a somewhat close ration between likes and dislikes.
  Post.find({fromDate: {$gte: fromDate}, toDate: {$lte: toDate}, limit: limit})
    .then((posts) => {
      for (const post of posts) {
        const likePercentage = (likeCount / (post.likeCount + post.dislikeCount)) * 100;
        if (likePercentage <= UPPER_LIMIT && likePercentage >= LOWER_LIMIT) {
          //mark post as heated
          //controversy index, the closer to 0 the more even spread between likes and dislikes
          let heatIndex = Math.abs(likePercentage - 50);
          let heatedPost = {...post.toObject(), heatIndex: heatIndex};
          heatedPosts.push(heatedPost);
        }
      }
      //sort the heated Post(s) based on controversyIndex
      heatedPosts.sort((a, b) => {
        return a - b;
      })
      return Promise.resolve(heatedPosts);
    })
    .catch((error) => {con})
  //should sort and return posts with top elements being closest to 1.0 most heated
}

/**
 * Creates a post query from Post navbar options.
 * @param {object} queryOptions - Options for the Mongo query.
 * @param {string} queryOptions.filter - A filter constant for the query (default - new).
 * @param {string} queryOptions.toDate - An Upper limit date for Post query.
 * @param {string} queryOptions.fromDate - A Lower limit date for Post query. 
 * @returns {Promise} A Post query Promise.
*/
export const executePostQuery = (params, postSearchOptions) => {
  //some type checking
  const {filter, fromDate, toDate, limit} = params;
  switch (filter) {
    case(postSearchOptions.filter.new):
      return getDatedPosts({fromDate: fromDate, limit: limit});
    case(postSearchOptions.filter.trending): 
      //probably should be most liked or commented in a time period
      return getTrendingPosts({fromDate: fromDate, toDate: toDate, limit: limit});
    case(postSearchOptions.filter.heated): 
      //Psts which have a close Like/Dislike ratio.
      return getHeatedPosts({fromDate: fromDate, toDate: toDate, limit: limit});
    case(postSearchOptions.filter.discussed): 
      return getDisccussedPosts({fromDate: fromDate, toDate: toDate, limit: limit});
    default: 
      //maybe make the deffault to return new posts within a day or two?
      return getDatedPosts({fromDate: fromDate});
  }
};

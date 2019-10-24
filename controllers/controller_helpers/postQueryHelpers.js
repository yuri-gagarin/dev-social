import Post from "../../models/Post.js";
import { rewind } from "../../helpers/timeHelpers";

const getTrendingPosts = (fromDate, toDate) => {
  //hot posts should be recent, well discussed and liked.  
  return Post.find(
    {likeCount: {$gte: 10}, commentCount: {$gte: 5}}, 
    {}, 
    {sort: {createdAt: -1}, limit: 10}
  );
}

/**
   * Sorts the passed in model array by {model.controversyIndex}.
   * @param {Object[]} models - The model array to use for sorting. 
   * @returns {Promise} The array of 'model' objects sorted by its controversyIndex.
   */
  function sortByControversy(models) {
    return new Promise((resolve, reject) => {

      if(!Array.isArray(models)) {
        reject(new TypeError(`Expected the first argument to be an 'array`));
      }
      function compare(a, b) {
        if(Math.abs(a.controversyIndex - 1) < Math.abs(b.controversyIndex - 1)) {
          return -1;
        }
        if(Math.abs(a.controversyIndex - 1) > Math.abs(b.controversyIndex - 1)) {
          return 1;
        }
        else {
          return 0;
        }
      }
      models.sort(compare);
      resolve(models);
    });
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
 * Returns a query for 'Controversial Post(s)'. Post(s) with a close ratio to Like/Dislike.
 * @param {object} options - An options object.
 * @param {string} options.fromDate - Lower limit date for the query. 
 * @param {string} options.toDate - Upper limit date for the query.
 * @param {number} options.limit - A limit for the query.
 * @returns {Promise} Mongoose query promise for Post model.
 */
const getControversialPosts = (options) => {
  const {fromDate, toDate, limit=10} = options;

  // our limites for controversy
  const LOWER_LIMIT = 0.75;
  const UPPER_LIMIT = 1.25;
  if (fromDate && toDate) {
    return Post.find(
      {createdAt: {$gte: fromDate, $lte: toDate}, controversyIndex: {$gte: LOWER_LIMIT, $lte: UPPER_LIMIT}},
      {}, //custom fields to return
      {limit: limit})
      .then((posts) => {
        if (posts) {
          return sortByControversy(posts);
        }
        else {
          return Promise.reject(new Error("Didnt get any posts back"));
        }
      })
      .catch((error) => {
        return error;
      });
  }
  else if (fromDate && !toDate) {
    return Post.find(
      {createdAt: {$gte: fromDate}, controversyIndex: {$gte: 0.75, $lte: 1.5}},
      {},
      {limit: limit})
      .then((posts) => {
        if (posts) {
          return sortByControversy(posts);     
        }
        else {
          return Promise.reject(new Error("Didnt get any posts back"));
        }
      })
      .catch((error) => {
        return error;
      });
  } 
  else {
    const oneDayAgo = rewind.goBackOneDay();
    return Post.find({created: {Sgte: oneDayAgo}},{},{limit: limit})
      .then((posts) => {
        if (posts) {
          return sortByControversy(posts);
        }
        else {
          return Promise.reject(new Error("Didnt get any posts back"));
        }
      })
      .catch((error) => {
        return error;
      });
  }
  //should sort and return posts with top elements being closest to 1.0 most Controversial
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
    case(postSearchOptions.filter.controversial): 
      //Posts which have a close Like/Dislike ratio.
      return getControversialPosts({fromDate: fromDate, toDate: toDate, limit: limit});
    case(postSearchOptions.filter.discussed): 
      return getDisccussedPosts({fromDate: fromDate, toDate: toDate, limit: limit});
    default: 
      //maybe make the deffault to return new posts within a day or two?
      return getDatedPosts({fromDate: fromDate});
  }
};

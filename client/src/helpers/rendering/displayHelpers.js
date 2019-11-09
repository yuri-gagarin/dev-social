/**
 * Sets a default image for the Post thumbnail or item.
 * @param {Object} post - A Post object.
 * @returns {string} A CSS string for background image url property.
 */
export const setPostImage = (post) => {
  let imagePath;
  if (post && post.images) {
    //do something here if has post images
    imagePath = posts.images[0];

  }
  else if (post && !post.defaultImage) {
    //set a default post image
    imagePath = "http://localhost:3000/assets/images/posts/stock_post.jpg";
  }
  else  if(post && post.defaultImage) {
    imagePath = post.defaultImage;
  }
  else {
    imagePath = "http://localhost:3000/assets/images/posts/stock_post.jpg";
  }
  return `url(${imagePath})`;
};
/**
 * Trims the text specified to length value.
 * @param {string} text - The text to be trimmed.
 * @param {number} length - How many characters should the string be trimmed.
 * @returns {string} The trimmed string appened with {string...}.
 */
export const trimString = (text, length) => {
  if (typeof text !== "string") {
    throw new TypeError(`Expected the first argument to be a -- {'string'} instead saw -- {'${typeof text}'} ;`);
  }
  if (typeof length !== "number") {
    throw new TypeError(`Expected the second argument to be a -- {'number'} instead saw -- {'${typeof length}'} ;`);
  }
  let trimmed = text.substring(0, length) + "...";
  return trimmed;
};
/**
 * Converts an ISO date string into a readable format
 * @param {string} date - ""
 */
const displayPostDate = (date) => {

};

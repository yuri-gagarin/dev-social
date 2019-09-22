/**
 * Sets a default image for the Post thumbnail or item.
 * @param {Object} post - A Post object.
 * @returns {string} A url string which resolves an Image path.
 */
export const setPostImage = (post) => {

  if (post.images) {
    //do something here if has post images
  }
  else {
    //set a default post image
    const imagePath = "http://localhost:3000/assets/images/posts/stock_post.jpg";
    return imagePath;
  }
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
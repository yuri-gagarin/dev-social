import monthsArr from "./constants/months";

// helpers //
function addZero(number) {
  if(number < 10) {
    number = "0" + number;
  }
  return number;
};
function formatAMPM(options) {
  let minutes = addZero(options.minutes);
  let hour = options.hour;
  if(hour < 12) {
    if(hour === 0) {
      return `{12}:${minutes} AM`;
    }
    else {
      return `${hour}:${minutes} AM`;
    }
  }
  else {
    if(hour === 12) {
      return `{12}:${minutes} PM`;
    }
    else {
      hour = hour - 12;
      return `${hour}:${minutes} PM`;
    }
  }
}


//  exported functions //
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
 * Converts an ISO date string into a readable format.
 * @param {string} date - "A string in ISO date format".
 * @param {Object} options - "An options object".
 * @param {boolean} options.military - "An option for a 24hr format".
 * @returns {string} - A readable format for a post.
 */
export const formatDate = (date, options) => {
  if(!date) {
    return "";
  }
  if(typeof date !== "string") {
    throw new TypeError(`Expected a ISO date string instead saw ${typeof date}`);
  }
  const dateObj = new Date(date);
  let year = dateObj.getFullYear();
  let month = monthsArr[dateObj.getMonth()];
  let day = dateObj.getDate();
  let hour = dateObj.getHours();
  let minutes = dateObj.getMinutes();
  if(options.military) {
    hour = addZero(hour);
    minutes = addZero(minutes);
    return `${month} ${day} ${year}, ${hour}:${minutes}`;
  }
  else {
    let timeOfDay = formatAMPM({hour: hour, minutes: minutes});
    return  `${month} ${day} ${year}, ${timeOfDay}`;
  }
};

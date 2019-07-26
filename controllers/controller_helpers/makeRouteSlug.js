import getDateWithTime from "../../helpers/getDateWithTime.js";
/**
 * Takes in a title of the post and returns a slug.
 * @param {string} title The title of the post/model.
 * @return {string} edited string slug for the post.
 */
export default function(title) {
  let text = title.toString().toLowerCase()
    .replace(/\s+/g, '_')        // Replace spaces with _
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '_')      // Replace multiple - with single _
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
  let date = getDateWithTime({format: "slugDate"});
  return `${text}_${date}`;
}
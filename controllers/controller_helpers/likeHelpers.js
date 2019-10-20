/**
 * Calculates controversy index for likes/dislikes of a model. 1 if perfect spread between likes/dislikes, n > 1 <= 2 more likes, n < 1 >= 0 more dislikes.
 * @param {Object} model - The model object.
 * @param {number} model.likeCount - Number of likes in model. 
 * @param {number} model.dislikeCount - Number of dislikes in model. 
 * @returns {number} A float between 0 - 2 representing controversy index.
 */
export const calcControversy = (model) => {
  if(model.likeCount === 0 && model.dislikeCount === 0) {
    return null;
  }
  if(typeof model.likeCount !== "number" && typeof model.likeCount !== "number") {
    throw new TypeError(`Expected both arguments to be a type of 'number'`);
  }
  const likeRatio = (model.likeCount / (model.likeCount + model.dislikeCount) ).toFixed(5);
  const controversyIndex = Math.abs(likeRatio / 0.50).toFixed(5);
  //closer to 1 the more even likes/dislikes thus more controversial
  // closer to 0, the more dislikes closer to 2 the more likes
  return parseFloat(controversyIndex);
};

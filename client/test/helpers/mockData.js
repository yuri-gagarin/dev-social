import faker from "faker";


export const generatePost = ({userId, postId}) => {
  if(!postId) {postId = Math.floor(Math.random() * 1000)}
  if(!userId) {userId = Math.floor(Math.random() * 1000)}
  const post = {
    _id: postId,
    userId: userId,
    author: faker.name.findName(),
    title: faker.lorem.word(),
    text: faker.lorem.paragraphs(2),
    likeCount: 0,
    dislikeCount: 0,
  };
  return post;
};

export const generateComment = ({userId, commentId, postId}) => {
  if(!userId) {userId = Math.floor(Math.random() * 1000)};
  if(!commentId) (commentId = Math.floor(Math.random() * 1000));
  if(!postId) {postId = Math.floor(Math.random() * 1000)};
  const comment = {
    _id: commentId,
    user: userId,
    post: postId,
    author: faker.name.findName(),
    text: faker.lorem.paragraph(1),
    likeCount: 0,
    dislikeCount: 0,
  };
  return comment;
};

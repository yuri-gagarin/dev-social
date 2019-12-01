import faker from "faker";


export const generatePost = ({userId, postId})=> {
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
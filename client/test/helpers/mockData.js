import faker from "faker";


export const generatePost = (user)=> {
  const post = {
    author: faker.name.findName(),
    title: faker.lorem.word(),
    text: faker.lorem.paragraphs(2),
    likeCount: 0,
    dislikeCount: 0,
  };
  return post;
};
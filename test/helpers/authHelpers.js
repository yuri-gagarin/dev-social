import faker from "faker";
import chai from "chai";
import chaiHttp from "chai-http";
import bcrypt from "bcrypt";
import keys from "../../config/keys.js";
import User from "../../models/User.js";
chai.use(chaiHttp);

/**
 * Makes an array of users.
 * @param {number} count How many users to make.
 * @returns {array} An array with generated users.
 */
export const generateUserData = (count) => {
  const users = []
  for (let i = 1; i <= count; i++) {
    const user = {
      name: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: "Password1",
      passwordConfirm: "Password1",
    }
    users.push(user);
  }
  return users;
};
/**
 * Creates a specified number of User(s).
 * @param {number} num - The number of User(s) to be created.
 * @returns {Promise} A promise resolves to an Array of User objects if succeeded otherwise NULL.
 */
export const createUsers = async (num) => {
  if(typeof num !== "number") {
    throw new TypeError(`Expected first argument to be a {'number'} instead saw {'${typeof num}'};`);
  }
  let users = generateUserData(num);
  for (let i = 0; i < users.length; i++) {
    try {
      let hash = await bcrypt.hash(users[i].password, keys.saltConstant); 
      let user = {...users[i], password: hash};
      let createdUser = await User.create(user);
      users[i]._id = createdUser._id;
    }
    catch(error){
      console.error(error);
      return null;
    }
  }
  console.log(`Created ${num} User(s);`);
  return users;
};
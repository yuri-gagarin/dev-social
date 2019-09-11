import faker from "faker";
import chai from "chai";
import chaiHttp from "chai-http";

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
 * Creates a specific number of users in the database.
 * @param {array | object} users An array of users to insert into database or a user object.
 * @param {function} app The Express server app.
 * @param {string} route The API route to make a POST request.
 * @returns {boolean} True if suceeded, False on error.
 */
export const createUsers = async (users, app, route) => {
  if(typeof users === "string") {
    throw new TypeError("First argument must be an {array} or an {object} ;");
  }
  if(typeof app !== "function") {
    throw new TypeError(`Expected the second argument to be a {function} --instead saw: ${typeof app} ;`);
  }
  if(typeof route !== "string") {
    throw new TypeError(`Expected the third argument to be a {string} -- instead saw: ${typeof route} ;`);
  }

  if(Array.isArray(users)) {
    const requester = chai.request(app).keepOpen();
    try {
      await Promise.all( users.map(user => requester.post(route).send(user)) );
      requester.close();
      return Promise.resolve(true);
    }
    catch(error) {
      console.log(error)
      requester.close();
      return Promise.reject(false);
    }
  }
  else if (typeof users === "object") {
    chai.request(app)
      .post(route)
      .send(users)
      .end(function(err, res) {
        if(err) {
          console.error(err);
          return Promise.reject(err);
        }
        return Promise.resolve(true);
      });
  }
  else {
    return Promise.reject(false);
  }
};
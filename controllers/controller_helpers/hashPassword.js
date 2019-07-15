/**
 * Hashes a password.
 * 
 * @param {Number} rounds Cost of processing the data
 * @param {String} password The password needed to be hashed
 * 
 * @see bcrypt Relies on bcrypt module
 * @link https://www.npmjs.com/package/bcrypt
 * 
 * @return {Promise} A promise that eventually resolves to a hashed password
 */
import bcrypt from "bcrypt";

export default async function(rounds, password) {
  try {
    let salt = await bcrypt.genSalt(rounds);
    let hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  catch (error) {
    console.log(error);
    return error;
  }
}
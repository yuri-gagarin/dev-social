/**
 * Validates user password.
 * @param {string} password User password.
 * @returns {boolean} True or False whether password is valid.
 */

 export default function(password) {

   let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

   return regex.test(String(password));
 };


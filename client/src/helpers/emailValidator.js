/**
  * Validates user email input.
  * 
  * @param {string} user email
  * @return {boolean} result tested against regex
  */
 export default function(email) {
  const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  return regex.test(String(email).toLowerCase());
}
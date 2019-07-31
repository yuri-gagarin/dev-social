/**
 * Validates user name.
 * @param {string} name first or last name.
 * @returns {object} with error and valid.
 */

 export default function(name) {
   if (name.length < 1) {
     return {
       error: "Name should be at least one character",
       valid: false
     }
   }
   const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{0,20}$/;
   if(!regex.test((String(name).toLowerCase()))) {
     return {
       error: "Not a valid name",
       valid: false
     }
   } 
   return {
     error: null,
     valid: true
   }
 };
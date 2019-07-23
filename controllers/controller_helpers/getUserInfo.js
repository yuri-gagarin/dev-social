import fetch from "node-fetch";
/**
 * Build an object which contains some user info.
 * @param {string} ipAdress User's IP Adress
 * @returns {promise} A promise which resolves to an an object containing user data
 */
export default function(ipAdress, cb) {

  //maybe add more providers as a fallback later
  let providers = [`https://ipapi.co/${ipAdress}/json/`];
  let userData = {
    success: false
  };
  if (typeof ipAdress !== "string") {
    Promise.reject(new TypeError("Expected the first argument to be a {string} : {ipAdress}"));
  }

  let _promise = fetch(providers[0], {method: "GET"})
  .then((response) => {
    return response.json();
  })
  .then((user) => {
    //check for an error in retrieving client details
    if(user.error) {
      userData.success = false;
      userData.reason = user.reason;
      return userData;
    }
    else { 
      //build object details about a client
      userData.success = true;
      userData.ip = ipAdress;
      userData.country = user.country;
      userData.country_name = user.country_name;
      userData.region = user.region;
      userData.city = user.city;
      userData.continent_code = user.continent_code;
      userData.timezone = user.timezone;
      userData.currency = user.currency;
      userData.languages = user.languages;

      return userData;
    }
  })
  .catch((error) => {
    console.log(error);
    return userData;
  });
  if (cb && typeof cb === "function") {
    
  }
  else {
    return _promise;
  }
};
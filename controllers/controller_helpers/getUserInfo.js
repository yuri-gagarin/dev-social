import fetch from "node-fetch";
/**
 * Build an object which contains some user info.
 * @param {string} ipAddress User's IP Adress
 * @param {function} cb Optional callback function
 * @returns {promise} A promise which resolves to an an object containing response and user data
 */
export default function(ipAddress, cb) {

  //type check the ipAdress parameter
  //throw a TypeError if not a string
  if (typeof ipAddress !== "string") {
    let error = new TypeError("Expected the first argument to be a {string} : {ipAdress}");
    if (cb && typeof cb === "function") {
      cb(error, {success: false});
    }
    else {
      throw error;
    }
  }
  //maybe add more providers as a fallback later
  let providers = [`https://ipapi.co/${ipAddress}/json/`];
  const response= {
    success: false,
    reason: null,
    userData: {}
  };

  let _promise = fetch(providers[0], {method: "GET"})
    .then((response) => {
      return response.json();
    })
    .then((user) => {
      //check for an error in retrieving client details
      if(user.error) {
        response.success = false;
        response.reason = user.reason;
        return response;
      }
      else { 
        //build object details about a client
        response.success = true;
        response.userData.ip = ipAddress;
        response.userData.country = user.country;
        response.userData.countryName = user.country_name;
        response.userData.region = user.region;
        response.userData.city = user.city;
        response.userData.continentCode = user.continent_code;
        response.userData.timezone = user.timezone;
        response.userData.currency = user.currency;
        response.userData.languages = user.languages;

        return response;
      }
    })
    .catch((error) => {
      console.log(error);
      return error;
    });

  //optional callback for whatever reason
  if (cb && typeof cb === "function") {
    _promise.then((data) => {
      cb(null, data);
    })
    .catch((error) => {
      cb(error, {success: false});
    });
  }
  else {
    return _promise;
  }
};
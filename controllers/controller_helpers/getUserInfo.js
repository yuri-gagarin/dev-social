import fetch from "node-fetch";

export default function(ipAdress) {

  //maybe add more providers as a fallback later
  let providers = [`https://ipapi.co/${ipAdress}/json/`];
  let userData = {
    success: false
  };
  return fetch(providers[0], {method: "GET"})
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
    })
}
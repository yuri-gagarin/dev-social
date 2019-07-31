import axios from "axios";

export default function(email) {
  const options = {
    metthod: "POST",
    url: "api/users/check_email",
    data: {
      email: email
    }
  };
  axios(options)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

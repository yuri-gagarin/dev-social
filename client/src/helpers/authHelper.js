import axios from "axios";

export default function(email) {
  const options = {
    method: "POST",
    url: "/api/users/check_email",
    data: {
      email: email
    }
  };
  return axios(options)
};

const axios = require("axios");
let url = "http://localhost:3000/comments/";
function request() {
  let options = {
    url: url,
    method: "post",
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMjhkNjBlNDA0Mjk5MDcyOGMyMDVlMiIsIm5hbWUiOiJzZWNvbmRVc2VyIiwiZW1haWwiOiJzZWNvbmR1c2VyQG1haWwuY29tIiwiaWF0IjoxNTYyOTcyOTk0LCJleHAiOjE1NjI5ODAxOTR9.KHvj97rNv0231o_EIOqMZZBxpWGJKMcW0BgRgkV7obI",
    },
    data: {
      postId: "5d2603b91ea5a022e19f1963",
      text: "a comment from a client"
    }
  };
  axios(options)
    .then((result) => {
      console.log(result);
      return;
    })
    .catch((error) => {
      console.log(error);
      return
    })
}; 
request();
import setUser from "./controller_helpers/setUser.js";
import fetch from "node-fetch";

export default {
  index: (req, res) => {
    //const user = setUser(req);
    setUser(req)
      .then((user) => {
        return res.json({
          message: "User",
          user: user
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: "An error occured"
        })
      })
    
  }
};
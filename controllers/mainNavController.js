import GuestNavbar from "../models/ui_models/GuestNavbar.js";

export default {
  getNav: (req, res) => {
    const {loggedIn, message} = res.locals;
    console.log(message)
    if(req.user) {
      return res.json({message: "ok"});
    }
    else {
      return res.json(GuestNavbar);
    }
  },
}
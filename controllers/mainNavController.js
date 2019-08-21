import GuestNavbar from "../models/ui_models/GuestNavbar.js";

export default {
  getNav: (req, res) => {
    //console.log(req.user);
    if(req.user) {
      return res.json({message: "ok"});
    }
    else {
      return res.json(GuestNavbar);
    }
  },
}
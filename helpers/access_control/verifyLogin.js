import passport from "passport";
export default function(req, res, next) {
  if (req.headers.authorization) {
    passport.authenticate("jwt", {session: false}, (err, user, info) => {
      if(err) {
        console.log(err.message);
        res.locals.loggedIn = false;
        next();
      }
      else if(!user) {
        if( info && info.name === "TokenExpiredError" ) {
          res.locals.message = "Login has expired";
        } 
        res.locals.loggedIn = false;
        next();
      }
      else {
        res.locals.loggedIn = true;
        res.locals.user = user;
        next();
      }
    })(req, res, next);
  }
  else {
    console.log("no user")
    res.locals.loggedIn = false;
    next()
  }
}
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import routes from "./routes/routes.js";
import passport from "passport";
import keys from  "./config/keys.js";
import passportStrategy from "./config/passportConfig.js";
import path from "path";
import detailedLog from "./helpers/APIhelpers/detailledLog.js";

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const DB = keys.mongoURI;

//find them pesky console.log statements;
detailedLog("warn", "error", "info");

mongoose
  .connect(DB, {useNewUrlParser: true,  useFindAndModify: false})
  .then((data) => {
    //console.log("Database connected");
    //console.log("Database name: " + data.connection.name);
  })
  .catch((err) => console.log(err));

//bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//passport middleware
app.use(passport.initialize());
//passport config
passportStrategy(passport);

//initialize routes
routes(router);
app.use(router);

//serve static files and default images
app.use(express.static("public"));

app.get("/", (req, res) => {
  if(process.env.NODE_ENV !== "production") {
    res.sendFile(path.resolve(__dirname, "client", "src", "index.html"));
  }
  else {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  }
});

app.use(function(err, req, res, next) {
  console.log(`This is the invalid field: ${err.field}`);
  next(err);
});



app.listen(PORT, () => {
  console.log(`App listening at PORT: ${PORT}`);
});

export default app;


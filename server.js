import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import routes from "./routes/routes.js";
import passport from "passport";
import keys from  "./config/keys.js";
import passportStrategy from "./config/passportConfig.js";

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 3000;
const DB = keys.mongoURI;

mongoose
  .connect(DB, {useNewUrlParser: true})
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello There Yo");
});

app.use(function(err, req, res, next) {
  console.log(`This is the invalid field: ${err.field}`);
  next(err);
});

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


app.listen(PORT, () => {
  console.log(`App listening at PORT: ${PORT}`);
});


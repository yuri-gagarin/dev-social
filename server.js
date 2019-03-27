const express = require("express");
const mongoose = require("mongoose");

const app = express();
const router = express.Router();
const routes = require('./routes/routes.js');
const PORT = process.env.PORT || 3000;
const DB = require("./config/keys").mongoURI;

mongoose
  .connect(DB, {useNewUrlParser: true})
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello There Yo");
});
routes(router);

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening at PORT: ${PORT}`);
});


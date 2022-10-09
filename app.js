const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());


const allRoutes = require("./src/routes/route");

// middlewire
app.use(bodyparser.json({limit: "50mb"}));
// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use(allRoutes);

const PORT = process.env.backEndPort || 5000;
const DB_URL = process.env.dbURL;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB-Connected");
  })
  .catch((err) => console.log(err + "DB connection error"));

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

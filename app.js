const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect(
    "mongodb+srv://dbSocioWise:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0-fv5sj.gcp.mongodb.net/LogIn"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log(err);
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });

  app.use("/", express.static(path.join(__dirname, "SocioWise")));

  app.use("/api/user", userRoutes);

  app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "SocioWise", "index.html"));
  });

module.exports = app;
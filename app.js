//Require the npm packages to be used
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const favicon = require("serve-favicon");
const hbs = require("hbs");
const logger = require("morgan");
const path = require("path");

//Do require of dotenv and configs
require("dotenv").config();
require("./configs/session.config")(app);
require("./configs/db.config");

//ETC
const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

/* app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
); */

//Views, static files and favicon setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Express - Generated with IronGenerator";

//Get routes
const parkRouter = require("./routes/park.routes");
const dogRouter = require("./routes/dog.routes");
const authRouter = require("./routes/auth.routes");
const index = require("./routes/index");
app.use("/", index);
app.use("/", authRouter);
app.use("/", dogRouter);
app.use("/", parkRouter);

module.exports = app;

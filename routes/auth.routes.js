//Require express and create router
const express = require("express");
const router = express.Router();
//Require bcrypt and define salt rounds
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
//Require User Model
const User = require("../models/User.model");
//Require RouteGuard
const RouteGuard = require("../middleware/routeGuard");

//GET login
router.get("/login", (req, res) => res.render("auth/login"));

//POST login
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  /* console.log(req.body); */
  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "enter both user and password",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errorMessage: "User is not registerd." });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/home");
      } else {
        res.render("auth/login", { errorMessage: "Wrong password." });
      }
    })
    .catch((err) => next(err));
});

//POST logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/home");
});

//GET sign up
router.get("/signup", (req, res) => res.render("auth/signup"));

//POST sign up
router.post("/signup", (req, res, next) => {
  console.log("The form data: ", req.body);
  const { username, password, email } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((passwordHash) => {
      console.log(passwordHash);
      return User.create({ email, username, password: passwordHash });
    })
    .then((user) => {
      res.redirect("/home");
    })
    .catch((err) => next(err));
});

module.exports = router;

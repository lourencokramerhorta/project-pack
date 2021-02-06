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
  console.log(req.body);
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
        console.log(user);
        console.log(req.session);
        res.redirect("/user-profile");
      } else {
        res.render("auth/login", { errorMessage: "Wrong password." });
      }
    })
    .catch((err) => next(err));
});

//POST logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
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
      console.log(user);
      res.redirect("/");
    })
    .catch((err) => next(err));
});

//GET user profile
router.get("/user-profile", (req, res, next) => {
  console.log(req.session);
  User.findById(req.session.currentUser._id)
    .populate("dogs")
    .then((dbUser) =>
      res.render("auth/user", { user: dbUser })
    )
    .catch(err => console.log(err));
});

module.exports = router;

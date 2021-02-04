const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const RoutGuard = require("../midleware/routeGuard");

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
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
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        console.log(user);
        res.redirect("/");
      } else {
        res.render("auth/login", { errorMessage: "Wrong password." });
      }
    })
    .catch((err) => next(err));
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/signup", (req, res) => res.render("auth/signup"));

router.post("/signup", (req, res, next) => {
  console.log("The form data: ", req.body);
  const { username, password } = req.body;

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((passwordHash) => {
      console.log(passwordHash);
      return User.create({ username, passwordHash });
    })
    .then((user) => {
      console.log(user);
      res.redirect("/");
    })
    .catch((err) => next(err));
});

module.exports = router;

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
//Require mongoose for auth validation
const mongoose = require('mongoose');

//GET login
router.get("/login", (req, res) => res.render("auth/login"));

//POST login
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both user and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", { errorMessage: "User is not registered." });
        return;
      } else if (bcryptjs.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.redirect("/home");
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch(err => next(err));
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
  const { username, password, email } = req.body;

  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 characters and must contain at least one number, one lowercase and one uppercase letter.' });
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((passwordHash) => {
      console.log(passwordHash);
      return User.create({ email, username, password: passwordHash });
    })
    .then((user) => {
      req.session.currentUser = user;
      res.redirect("/home");
    })
    .catch(err => {
      if(err instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', {errorMessage: err.message})
      } else if (err.code === 11000) {
        res.status(500).render('auth/signup', {errorMessage: 'Username and email need to be unique. Either username or email is already used.'})
      } else {
        next(err)
      }
    })
});

module.exports = router;

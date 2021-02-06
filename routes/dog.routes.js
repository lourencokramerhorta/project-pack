//Require express and create router
const express = require("express");
const router = express.Router();
//Require User and Dog Models
const Dog = require("../models/Dog.model");
const User = require("../models/User.model");



//GET create-dog
router.get("/create-dog", (req, res, next) => {
  res.render("dog/createDog");
});

//POST create-dog
router.post("/create-dog", (req, res, next) => {
  const { name, breed, photo, age } = req.body;
  console.log(req.body);
  Dog.create({ name, breed, photo, age })
    .then((createdDog) => {
      return User.findByIdAndUpdate(req.session.currentUser, {
        $push: { dogs: createdDog._id },
      });
    })
    .then(res.redirect("/user-profile"))
    .catch((err) => console.log(err));
});

module.exports = router;
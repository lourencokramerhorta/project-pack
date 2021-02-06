//Require express and create router
const express = require("express");
const router = express.Router();
//Require User and Dog Models
const Dog = require("../models/Dog.model");
const User = require("../models/User.model");

//GET dog/:id
router.get("/dog/:id", (req, res, next) => {
  Dog.findById(req.params.id)
    .then((dog) => {
      console.log(dog);
      res.render("dog/dog", { dog: dog });
    })
    .catch((err) => {
      console.log("error wen creating dog page");
    });
});

//POST dog/:id

//GET create-dog
router.get("/create-dog", (req, res, next) => {
  res.render("dog/createDog");
});

//POST create-dog
router.post("/create-dog", (req, res, next) => {
  const { name, breed, photo, age, sex, size } = req.body;
  console.log(req.body);
  Dog.create({
    name,
    breed,
    photo,
    age,
    human: req.session.currentUser._id,
    sex,
    size,
  })
    .then((createdDog) => {
      return User.findByIdAndUpdate(req.session.currentUser, {
        $push: { dogs: createdDog._id },
      });
    })
    .then(res.redirect("/user-profile"))
    .catch((err) => console.log(err));
});

module.exports = router;

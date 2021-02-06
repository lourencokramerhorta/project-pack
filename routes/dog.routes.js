//Require express and create router
const express = require("express");
const router = express.Router();
//Require User and Dog Models
const Dog = require("../models/Dog.model");
const User = require("../models/User.model");
const fileUploader = require("../configs/cloudinary.config");

//GET dog/:id
router.get("/dog/:id", (req, res, next) => {
  Dog.findById(req.params.id)
    .populate("human")
    .then((dog) => {
      res.render("dog/dog", { dog });
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
router.post("/create-dog", fileUploader.single("photo"), (req, res, next) => {
  const { name, breed, age, sex, size } = req.body;
  console.log(req.body);
  Dog.create({
    name,
    breed,
    age,
    human: req.session.currentUser._id,
    sex,
    size,
    photo: req.file.path,
  })
    .then((createdDog) => {
      return User.findByIdAndUpdate(req.session.currentUser, {
        $push: { dogs: createdDog._id },
      });
    })
    .then(res.redirect("/user-profile"))
    .catch((err) => console.log(err));
});

router.post("/dog/:id/delete", (req, res, next) => {
  Dog.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/user-profile");
    })
    .then((err) => {
      return err;
    });
});

router.get("/dogsList", (req, res, next) => {
  Dog.find()
    .then((dogs) => {
      res.render("dog/dogList", { dogs });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

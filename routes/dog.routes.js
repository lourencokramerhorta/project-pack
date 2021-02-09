//Require express and create router
const express = require("express");
const router = express.Router();
//Require User and Dog Models
const Dog = require("../models/Dog.model");
const User = require("../models/User.model");
const fileUploader = require("../configs/cloudinary.config");

//GET dog/:id
router.get("/dog/:id", (req, res, next) => {
  console.log(req.params);
  Dog.findById(req.params.id)
    .populate("human")
    .then((dog) => {
      console.log(dog);
      console.log(dog.human.username);
      let isUser = false;
      if ((dog.human._id = req.session.currentUser._id)) {
        isUser = true;
      } else {
        isUser = false;
      }
      console.log(isUser);
      res.render("dog/dog", {
        dog,
        userInSession: req.session.currentUser,
        isUser,
      });
    })
    .catch((err) => {
      console.log("error wen creating dog page");
    });
});

//GET create-dog
router.get("/create-dog", (req, res, next) => {
  res.render("dog/createDog", { userInSession: req.session.currentUser });
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

router.get("/home/dogs", (req, res, next) => {
  Dog.find()
    .then((dogs) => {
      res.render("dog/dogList", {
        dogs,
        userInSession: req.session.currentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

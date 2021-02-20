//Require express and create router
const express = require("express");
const router = express.Router();
//Require User and Dog Models
const Dog = require("../models/Dog.model");
const User = require("../models/User.model");
const fileUploader = require("../configs/cloudinary.config");

//GET dog/:id
router.get("/dog/:id", (req, res, next) => {
  const { currentUser } = req.session;
  Dog.findById(req.params.id)
    .populate("human")
    .then((dog) => {
      const isOwner = currentUser._id === dog.human._id;
      res.render("dog/dog", {
        dog,
        currentUser,
        isOwner,
      });
    })
    .catch((err) => {
      console.log("error when rendering dog page");
    });
});

//GET create-dog
router.get("/create-dog", (req, res, next) => {
  res.render("dog/createDog", { currentUser: req.session.currentUser });
});

//POST create-dog
router.post("/create-dog", fileUploader.single("photo"), (req, res, next) => {
  let { name, breed, age, sex, size, sterilized } = req.body;
  const { _id: user_id } = req.session.currentUser;
  const photo = req.file ? req.file.path : undefined;
  sterilized = !!sterilized;
  Dog.create({
    name,
    breed,
    age,
    human: user_id,
    sex,
    size,
    photo,
    sterilized,
  })
    .then((createdDog) => {
      return User.findByIdAndUpdate(user_id, {
        $push: { dogs: createdDog._id },
      });
    })
    .then(res.redirect(`/user-profile/${user_id}`))
    .catch((err) => console.log(err));
});

router.post("/dog/:id/delete", (req, res, next) => {
  Dog.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect(`/user-profile/${req.params.id}`);
    })
    .then((err) => {
      return err;
    });
});
router.get("/home/dogs/search", (req, res, next) => {
  const { currentUser } = req.session;
  let { name, size, minAge, maxAge, breed, sex, sterilized } = req.query;
  sterilized = !!sterilized;
  console.log(sterilized);

  Dog.find({
    $and: [
      { name: { $regex: name, $options: "i" } },
      { size: { $regex: size, $options: "i" } },
      { breed: { $regex: breed, $options: "i" } },
      { age: { $gte: minAge, $lte: maxAge } },
      { sex: { $regex: sex, $options: "i" } },
      { sterilized: sterilized },
    ],
  })
    .then((dogs) => {
      res.render("dog/dogList", {
        dogs,
        currentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/home/dogs", (req, res, next) => {
  const { currentUser } = req.session;
  Dog.find()
    .then((dogs) => {
      res.render("dog/dogList", {
        dogs,
        currentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

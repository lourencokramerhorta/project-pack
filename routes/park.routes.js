//Require express, cloudinary and create router
const express = require("express");
const router = express.Router();
const fileUploader = require("../configs/cloudinary.config");
const mongoose = require("mongoose");
//Require Park Model
const Park = require("../models/Park.model");
const Review = require("../models/Review.model");
const User = require("../models/User.model");

//POST parks/park/:id/addFav

router.post("/parks/park/:id/addFav", (req, res, next) => {
  const { id } = req.params;
  User.findByIdAndUpdate(req.session.currentUser, {
    $push: { parks: id },
  })
    .then((editedUser) => {
      return Park.findByIdAndUpdate(id, {
        $push: { users_favorite: editedUser._id },
      });
    })
    .then(() => res.redirect(`/parks/park/${id}`))
    .catch((err) => console.log(err));
});

//POST parks/park/:id
router.post("/parks/park/:id", (req, res, next) => {
  const { score, content } = req.body;
  const { id } = req.params;
  const ObjectId = mongoose.Types.ObjectId;
  Review.create({
    score,
    content,
    park: id,
    username: req.session.currentUser._id,
  })
    .then(() => {
      Review.aggregate([
        { $match: { park: ObjectId(id) } },
        {
          $group: {
            _id: null,
            avgScore: {
              $avg: "$score",
            },
          },
        },
      ])
        .then((output) => {
          Park.findByIdAndUpdate(id, { score: output[0].avgScore })
            .then(() => {
              res.redirect(`/parks/park/${id}`);
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
});

//GET parks/park/:id
router.get("/parks/park/:id", (req, res, next) => {
  Park.findById(req.params.id)
    .populate({ path: "users_favorite", populate: { path: "dogs" } })
    .then((park) => {
      const reducer = (acc, curr) => {
        acc.dogs.concat(curr.dogs);
      };
      const dogsFromPark = park.users_favorite
        .map((fav) => fav.dogs)
        .reduce(reducer);
      let randomDogs = [];
      [1, 2, 3, 4, 5].forEach(() => {
        let randomIndex = Math.floor(Math.random() * dogsFromPark.length);
        randomDogs.push(dogsFromPark[randomIndex]);
        dogsFromPark.splice(randomIndex,1);
      });
      Review.find({ park_id: park._id })
        .populate("user_id")
        .then((reviews) => {
          res.render("park/park", {
            park,
            currentUser: req.session.currentUser,
            reviews,
            randomDogs,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

//POST parks/create-park
router.post(
  "/parks/create-park",
  fileUploader.single("photo"),
  (req, res, next) => {
    const {
      name,
      longitude,
      latitude,
      water,
      playObj,
      poopBags,
      cafe,
      crowded,
      ground,
      size,
    } = req.body;
    Park.create({
      name,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      photo: req.file.path,
      water,
      playObj,
      poopBags,
      cafe,
      crowded,
      ground,
      size,
    })
      .then((createdPark) => {
        res.redirect("/home");
      })
      .catch((err) => console.log(err));
  }
);

//GET parks/create-park
router.get("/parks/create-park", (req, res, next) => {
  const { lat, lng, address } = req.query;
  res.render("park/createPark", {
    currentUser: req.session.currentUser,
    lat,
    lng,
    address,
  });
});

//GET /home/api/:id
router.get("/home/api/:id", (req, res, next) => {
  let _id = req.params.id;
  Park.findById({ _id: _id })
    .then((park) => {
      res.status(200).json({ parks: [park] });
    })
    .catch((err) => console.log(err));
});

// GET /home/api
router.get("/home/api", (req, res, next) => {
  Park.find()
    .then((allParksFromDB) => {
      res.status(200).json({ parks: allParksFromDB });
    })
    .catch((err) => console.log(err));
});

//GET home
router.get("/home", (req, res, next) => {
  Park.find()
    .then((parks) => {
      res.render("park/home", {
        parks,
        currentUser: req.session.currentUser,
      });
    })
    .catch((err) => console.log(err));
});

module.exports = router;

//Require express, cloudinary and create router
const express = require("express");
const router = express.Router();
const fileUploader = require("../configs/cloudinary.config");
//Require Park Model
const Park = require("../models/Park.model");
const Review = require("../models/Review.model");

//POST parks/park/:id
router.post("/parks/park/:id", (req, res, next) => { 
  const { score, content } = req.body;
  const {id} = req.params
  Review.create({ score, content, park: id, username: req.session.currentUser._id })
    .then(() => { res.redirect(`/parks/park/${id}`); })
    .catch(err => {console.log(err)})
});

//GET parks/park/:id
router.get("/parks/park/:id", (req, res, next) => {
  Park.findById(req.params.id)
    .then((park) => {
      Review.find({ park: park._id })
        .populate("username")
        .then((reviews) => {
          res.render("park/park", {
            park,
            currentUser: req.session.currentUser,
            reviews,
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
      type: 'Point',
      coordinates: [longitude, latitude]
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
  res.render("park/createPark", { currentUser: req.session.currentUser, lat, lng, address });
});

//GET /home/api/:id
router.get('/home/api/:id', (req, res, next) => {
	let _id = req.params.id;
  Park.findById({ _id: _id })
    .then(park => {
      console.log("park:", park);
      res.status(200).json({ parks: [park] });
    })
    .catch(err => console.log(err))
});

// GET /home/api
router.get('/home/api', (req, res, next) => {
  Park.find()
    .then((allParksFromDB) => {
      res.status(200).json({ parks: allParksFromDB });
    })
  .catch(err => console.log(err))
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


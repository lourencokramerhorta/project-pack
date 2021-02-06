//Require express and create router
const express = require("express");
const router = express.Router();
//Require Park Model
const Park = require("../models/Park.model");


//GET parks/park/:id
router.get("/parks/park/:id", (req, res, next) => {
  Park.findById(req.params.id)
    .then(park => {
      console.log(park);
      res.render("park/park", {park});
    })
    .catch(err => console.log(err))
});

//POST parks/create-park
router.post("/parks/create-park", (req, res, next) => {
  const { name, location, photo, water, playObj, sterilized, poopBags, cafe, crowded, ground, size } = req.body;
  console.log(req.body);
  Park.create({
    name,
    location,
    photo,
    water,
    playObj,
    sterilized,
    poopBags,
    cafe, 
    crowded,
    ground, 
    size
  })
    .then((createdPark) => {
      console.log(createdPark);
      res.redirect('/home')
    })
    .catch((err) => console.log(err));
  });

//GET parks/create-park
router.get("/parks/create-park", (req, res, next) => {
  res.render("park/createPark");
});

//GET home
router.get("/home", (req, res, next) => {
  Park.find()
    .then(parks => {
       res.render("park/home", {parks});
    })
    .catch(err => console.log(err))
});

module.exports = router;

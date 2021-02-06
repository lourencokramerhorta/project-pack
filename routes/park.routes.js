//Require express and create router
const express = require("express");
const router = express.Router();
//Require Park Model
const Park = require("../models/Park.model");

//GET home
router.get("/home", (req, res, next) => {
  Park.find()
    .then(parks => {
       res.render("park/home", {parks});
    })
    .catch(err => console.log(err))
});

module.exports = router;

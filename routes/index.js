//Require express and create router
require("dotenv").config()
const express = require('express');
const router = express.Router();
const Park = require("../models/Park.model");

//GET home page
router.get('/', (req, res, next) => {
  // const data = { notPartial: true };
  // res.render('index', data);
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

//Require express and create router
const express = require('express');
const router = express.Router();

//GET home page
router.get('/', (req, res, next) => {
  const data = { notPartial: true };
  res.render('index', data);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const fileUploader = require("../configs/cloudinary.config");

//GET user profile
router.get("/user-profile", (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .populate("dogs")
    .then((dbUser) => {
      let isUser = false;
      if (dbUser._id = req.session.currentUser._id) {
        isUser = true;
      } else {
        isUser = false;
      };
      res.render("auth/user", {
        user: dbUser,
        userInSession: req.session.currentUser,
        isUser
      })
    })
    .catch((err) => console.log(err));
});

//GET user edit

router.get("/user/:id/edit", (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      res.render("auth/userEdit", {
        user,
        userInSession: req.session.currentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/user/:id/edit", fileUploader.single("photo"), (req, res) => {
  const { id } = req.params;
  let { username, currentPhoto } = req.body;
  if (req.file) {
    currentPhoto = req.file.path;
  }

  User.findByIdAndUpdate(id, { username, photo: currentPhoto }, { new: true })
    .then(() => res.redirect(`/user-profile`))
    .catch((error) =>
      console.log(`Error while updating a single user: ${error}`)
    );
});

router.get("/home/users", (req, res, next) => {
  User.find()
    .then((users) => {
      res.render("auth/userList", {
        users,
        userInSession: req.session.currentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

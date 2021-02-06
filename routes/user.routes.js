const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const fileUploader = require("../configs/cloudinary.config");

//GET user profile
router.get("/user-profile", (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .populate("dogs")
    .then((dbUser) => res.render("auth/user", { user: dbUser }))
    .catch((err) => console.log(err));
});

//GET user edit

router.get("/user/:id/edit", (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      res.render("auth/userEdit", { user });
    })
    .catch((err) => {
      console.log(err);
    });
});

//POST user edit

/* router.post(
  "/user/:id/edit",
  fileUploader.single("photo"),
  (req, res, next) => {
    req.body.photo = req.file.path;
    User.findByIdAndUpdate(req.params.id, req.body)
      .then((user) => {
        console.log(user);
        res.redirect("/user-profile");
      })
      .catch((err) => {
        console.log(err);
      });
  }
); */

router.post("/user/:id/edit", fileUploader.single("photo"), (req, res) => {
  const { id } = req.params;
  let { username, currentPhoto } = req.body;
  console.log(req.file);
  if (req.file) {
    currentPhoto = req.file.path;
  }

  User.findByIdAndUpdate(id, { username, photo: currentPhoto }, { new: true })
    .then(() => res.redirect(`/user-profile`))
    .catch((error) =>
      console.log(`Error while updating a single user: ${error}`)
    );
});

module.exports = router;

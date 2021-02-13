const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const fileUploader = require("../configs/cloudinary.config");

//GET user profile
/* router.get("/user-profile/:id", (req, res, next) => {
  User.findById(req.session.currentUser._id)
    .populate("dogs")
    .then((dbUser) => {
      let isUser = false;
      if ((dbUser._id = req.session.currentUser._id)) {
        isUser = true;
      } else {
        isUser = false;
      }
      res.render("user/user", {
        user: dbUser,
        userInSession: req.session.currentUser,
        isUser,
      });
    })
    .catch((err) => console.log(err));
}); */
router.get("/user-profile/:id", (req, res, next) => {
  const isUser = req.session.currentUser._id === req.params.id;
  if (isUser) {
    User.findById(req.session.currentUser._id)
      .populate("dogs")
      .then((dbUser) => {
        res.render("user/user", {
          user: dbUser,
          currentUser: req.session.currentUser,
          isUser,
        });
      })
      .catch((err) => console.log(err));
  } else {
    User.findById(req.params.id)
      .populate("dogs")
      .then((dbUser) => {
        res.render("user/user", {
          user: dbUser,
          currentUser: req.session.currentUser,
          isUser,
        });
      })
      .catch((err) => console.log(err));
  }
});

//GET user edit

router.get("/user/:id/edit", (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      res.render("user/userEdit", {
        user,
        currentUser: req.session.currentUser,
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
    .then(() => res.redirect(`/user-profile/${id}`))
    .catch((error) =>
      console.log(`Error while updating a single user: ${error}`)
    );
});

router.get("/home/users", (req, res, next) => {
  let { username } = req.query;
  console.log(username);
  if (username === undefined) {
    username = "";
  }
  User.find({ username: { $regex: username, $options: "i" } })
    .then((users) => {
      res.render("user/userList", {
        users,
        currentUser: req.session.currentUser,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

/* router.get("/user/:id", (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      console.log(user);
      res.render("user/eachUser", { user });
    })
    .catch((err) => console.log(err));
}); */

module.exports = router;

/* router.get("user-profile/:id", (req, res, next) => {
  if (req.session.currentUser._id === req.params.id) {
    User.findById(req.session.currentUser._id)
      .populate("dogs")
      .then((dbUser) => {
        let isUser = true;
        res.render("user/user", {
          user: dbUser,
          userInSession: req.session.currentUser,
          isUser,
        });
      })
      .catch((err) => console.log(err));
  } else {
    User.findById(req.params.id)
      .populate("dogs")
      .then((dbUser) => {
        let isUser = false;
        res.render("user/user", {
          user: dbUser,
          userInSession: req.session.currentUser,
          isUser,
        });
      })
      .catch((err) => console.log(err));
  }
}); */

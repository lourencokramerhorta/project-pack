const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Message = require("../models/Message.model");
const fileUploader = require("../configs/cloudinary.config");

//GET CHAT W/ USER

router.post("/user-profile/:id/chat", (req, res, next) => {
  let { content } = req.body;
  Message.create({ to: req.params.id, from: req.session.currentUser, content })
    .then(() => {
      res.redirect(`/user-profile/${req.params.id}/chat`);
    })
    .catch((err) => console.log(err));
});

router.get("/user-profile/:id/chat", (req, res, next) => {  
  //a
  User.find({ _id: req.params.id })
    .then(user => { 
      Message.find({
        $and: [
          { $or: [{ from: req.session.currentUser._id }, {from: req.params.id }] },
          { $or: [{ to: req.session.currentUser._id }, {to: req.params.id }] }
        ]
      })
        .populate("from")
        .populate("to")
        .then((messages) => {
          let chatUser = {};
          if (messages[0] === undefined) {
            chatUser = user;
          } else if (messages[0].to.id === req.session.currentUser._id) {
            chatUser = messages[0].from;
            console.log(chatUser);
          } else {
            chatUser = messages[0].to;
          }
          res.render("user/chat", {
            messages,
            currentUser: req.session.currentUser,
            chatUser
          });
        })
        .catch((err) => console.log(err));
    })
    .catch(err => { console.log(err) });
});

//GET user profile

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

module.exports = router;

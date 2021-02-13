//////THIS IS NOT YET DONE, DONT TRY TO RUN/////////////

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Dog = require("../models/Dog.model");
const Park = require("../models/Park.model");
const { findByIdAndUpdate } = require("../models/User.model");
require("../configs/db.config");

const users = [
  {
    username: "tobias",
    email: "tobias@tobias.com",
    password: "$2a$10$xXmVnG4kWZk1jaO3h/XrUenM4cJo3ilLvOfmFNiUew7Mv4sLEWUeu",
    location: { type: "Point", coordinates: [38.71667, 9.13333] },
    dogs: [],
  },
  {
    username: "paulo",
    email: "paulo@paulo.com",
    password: "$2a$10$xXmVnG4kWZk1jaO3h/XrUenM4cJo3ilLvOfmFNiUew7Mv4sLEWUeu",
    location: { type: "Point", coordinates: [38.71664, 9.13332] },
    dogs: [],
  },
  {
    username: "ze",
    email: "ze@ze.com",
    password: "$2a$10$xXmVnG4kWZk1jaO3h/XrUenM4cJo3ilLvOfmFNiUew7Mv4sLEWUeu",
    location: { type: "Point", coordinates: [12.33, 38.92] },
    dogs: [],
  },
];

let dogs = [
  [
    {
      name: "Faisca",
      age: 13,
      sex: "Male",
      breed: "Beagle",
      size: "small",
      bio: "seeded doggo",
      sterilized: true,
      location: { type: "Point", coordinates: [38.71667, 9.13333] },
    },
    {
      name: "JJ",
      age: 3,
      sex: "Female",
      breed: "Pembroke Welsh Corgi",
      size: "large",
      bio: "seeded doggo",
      sterilized: false,
      location: { type: "Point", coordinates: [38.71667, 9.13333] },
    },
    {
      name: "Zeca",
      age: 5,
      sex: "Male",
      breed: "Poodle",
      size: "medium",
      bio: "seeded doggo",
      sterilized: true,
      location: { type: "Point", coordinates: [38.71667, 9.13333] },
    },
  ],
  [
    {
      name: "Seixo",
      age: 12,
      sex: "Male",
      breed: "German Shorthaired",
      size: "large",
      bio: "seeded doggo",
      sterilized: false,
      location: { type: "Point", coordinates: [38.71664, 9.13332] },
    },
  ],
  [
    {
      name: "Tátá",
      age: 1,
      sex: "Female",
      breed: "French Bulldog",
      size: "small",
      bio: "seeded doggo",
      sterilized: true,
      location: { type: "Point", coordinates: [38.71664, 9.13332] },
    },
    {
      name: "Fabiana",
      age: 2,
      sex: "Female",
      breed: "Retriever",
      size: "small",
      bio: "seeded doggo",
      sterilized: false,
      location: { type: "Point", coordinates: [38.71664, 9.13332] },
    },
  ],
];

User.create(users)
  .then((usersInDB) => {
    console.log("created users in DB", usersInDB);

    usersInDB.forEach((user, index) => {
      dogs[index] = dogs[index].map((dog) => {
        return { ...dog, human: user._id };
      });
      Dog.create(dogs[index])
        .then((dogsFromDB) => {
          dogsFromDB.forEach((dog) => {
            User.findByIdAndUpdate(user._id, { dogs: [...user.dogs, dog._id] });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    mongoose.connection.close();
  })
  .catch((err) =>
    console.log(`An error occurred while creating users from the DB: ${err}`)
  );

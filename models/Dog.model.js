const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const dogSchema = new Schema(
  {
    name: String,
    age: Number,
    sex: Array /*ASK FILIPE,choices*/,
    breed: Array,
    photo: String,
    human: { type: Schema.Types.ObjectId, ref: "User" },
    location: [] /*ASK FILIPE, get from User*/,
    bio: String,
    sterilized: Boolean,
    size: Array /*ASK FILIPE,choices*/,
    hoursPlayed: Number,
    medals: Array,
    friends: [{ type: Schema.Types.ObjectId, ref: "Dog" }],
    dogs: [{ type: Schema.Types.ObjectId, ref: "Dog" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Dog", dogSchema);

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
    photo: String,
    location: [] /*ASK FILIPE*/,
    schedule: { weekDay: String, time: Date },
    dogs: [{ type: Schema.Types.ObjectId, ref: "Dog" }],
    parks: [{ type: Schema.Types.ObjectId, ref: "Park" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);

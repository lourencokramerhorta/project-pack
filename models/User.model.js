const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    photo: {
      type: String,
      default: '/images/user_default.png',
    },
    location: { type: { type: String }, coordinates: [Number] },
    schedule: [{ weekDay: String, time: Date }],
    dogs: [{ type: Schema.Types.ObjectId, ref: "Dog" }],
    parks: [{ type: Schema.Types.ObjectId, ref: "Park" }],
  },
  {
    timestamps: true,
  }
);

userSchema.index({ location: "2dsphere" });

module.exports = model("User", userSchema);

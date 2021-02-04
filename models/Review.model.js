const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    username: { type: Schema.Types.ObjectId, ref: "User" },
    park: { type: Schema.Types.ObjectId, ref: "Park" },
    content: String,
    score: Number
  },
  {
    timestamps: true,
  }
);

module.exports = model("Review", reviewSchema);

const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const parkSchema = new Schema(
  {
    name: String,
    location: { type: {type: String}, coordinates: [Number]
    },
    photo: String,
    water: Boolean,
    playObj: Boolean,
    poopBags: Boolean,
    cafe: Boolean,
    crowded: String /*ASK FILIPE, choices*/,
    ground: String /*ASK FILIPE, choices*/,
    size: String /*ASK FILIPE, choices*/,
    score: Number,
  },
  {
    timestamps: true,
  }
);

parkSchema.index({ location: "2dsphere" });

module.exports = model("Park", parkSchema);

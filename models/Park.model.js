const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const parkSchema = new Schema(
  {
    name: String,
    location: { type: { type: String }, coordinates: [Number] },
    photo: {
      type: String,
      default:
        "https://media2.s-nbcnews.com/j/newscms/2016_22/1562491/ap_16154563031509_937210859065e41391a67eed87ecef07.fit-2000w.jpg",
    },
    water: Boolean,
    playObj: Boolean,
    poopBags: Boolean,
    cafe: Boolean,
    crowded: {
      type: String,
      enum: ["Never", "Sometimes", "Always"],
    },
    ground: {
      type: String,
      enum: ["Muddy", "Sand", "Grass", "Stones"],
    },
    size: {
      type: String,
      enum: ["Small", "Medium", "Large"],
    },
    score: Number,
  },
  {
    timestamps: true,
  }
);

parkSchema.index({ location: "2dsphere" });

module.exports = model("Park", parkSchema);

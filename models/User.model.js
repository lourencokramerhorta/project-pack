const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      //pedir filipe config fotos default
      default:
        "https://media2.s-nbcnews.com/j/newscms/2016_22/1562491/ap_16154563031509_937210859065e41391a67eed87ecef07.fit-2000w.jpg",
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

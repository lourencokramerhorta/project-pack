const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: //pedir filipe config fotos default
        "https://media2.s-nbcnews.com/j/newscms/2016_22/1562491/ap_16154563031509_937210859065e41391a67eed87ecef07.fit-2000w.jpg",
    },
    /* location:, GPS COORDINATES */
    schedule: { weekDay: String, time: Date },
    dogs: [{ type: Schema.Types.ObjectId, ref: "Dog" }],
    parks: [{ type: Schema.Types.ObjectId, ref: "Park" }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);

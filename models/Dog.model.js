const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const dogSchema = new Schema(
  {
    name: String,
    age: Number,
    sex: Array /*ASK FILIPE,choices*/,
    breed: Array,
    photo: {
      type: String,
      default:
        "https://media2.s-nbcnews.com/j/newscms/2016_22/1562491/ap_16154563031509_937210859065e41391a67eed87ecef07.fit-2000w.jpg",
    },
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

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
        "https://video-images.vice.com/articles/58f7bfc7691cd44e59685ed0/lede/1492631497526-stoned-dog.jpeg?crop=1xw:0.9999387855044074xh;center,center&resize=900:*",
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

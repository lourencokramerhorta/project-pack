const mongoose = require("mongoose");
require("dotenv").config();

//Connect to mongo
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASS}@cluster0.ko1qs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

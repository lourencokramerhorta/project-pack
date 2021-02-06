const mongoose = require("mongoose");

//Connect to mongo
mongoose
  .connect("mongodb://localhost/project-node", { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

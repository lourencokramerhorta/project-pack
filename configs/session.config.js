const session = require("express-session");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 1200000 }, // 60 * 1000 ms === 1 min
    })
  );
};

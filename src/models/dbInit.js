const mongoose = require("mongoose");

mongoose.connect(
  process.env.DB_URL || "mongodb://localhost:27017/RegisterDB",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (!err) console.log("DB connection successful");
    else console.log(`Error in DB COnnection ${err}`);
  }
);

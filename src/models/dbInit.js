const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/RegisterDB", { useNewUrlParser: true }, err => {
  if (!err) console.log("DB connection successful");
  else console.log(`Error in DB COnnection ${err}`);
});

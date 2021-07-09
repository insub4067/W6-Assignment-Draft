const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/W6_Homework", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
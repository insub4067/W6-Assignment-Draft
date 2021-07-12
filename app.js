const express = require("express");
const connect = require("./config");
const mainRouter = require("./routers/index");
const Http = require("http");
const app = express();
const http = Http.createServer(app);
const cors = require('cors');

// app.use(cors({
//   origin:'여기에 프론트 주소'
// }))

app.use(
  "/",
  express.urlencoded({ extended: false }),
  express.json(),
  mainRouter
);

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use("/images", express.static("images"));

module.exports = http;

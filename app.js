const express = require("express");
const connect = require("./config");
const mainRouter = require("./routers/index");
const Http = require("http");
const app = express();
const http = Http.createServer(app);

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

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const connect = require("./config");
const multer = require("multer");
const mainRouter = require("./routers/index");

const app = express();
const router = express.Router();

app.use(
  "/",
  express.urlencoded({ extended: false }),
  express.json(),
  mainRouter
);

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use("/images", express.static("images"));
app.use("/api", express.urlencoded({ extended: false }), router);
app.use(express.json());

app.listen(8080, () => {
  console.log("서버가 요청을 받을 준비가 됐어요");
});

const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const heartRouter = require("./heart");
const productRouter = require("./product");
const commentRouter = require("./comment");

router.use("/user", userRouter);
router.use("/heart", heartRouter);
router.use("/product", productRouter);
router.use("/comment", commentRouter);

router.get("/", (req, res) => {
  res.render("index");
});

module.exports = router;

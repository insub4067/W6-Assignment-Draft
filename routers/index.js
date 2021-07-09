const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-Middleware");
const userRouter = require("./user");
const heartRouter = require("./heart");
const productRouter = require("./product");
const commentRouter = require("./coment");


router.use("/user", userRouter)
router.use("/heart", heartRouter)
router.use("/product", productRouter)
router.use("/comment", commentRouter)

router.get("/", (req, res) => {
    res.render("index");
});

module.exports = router;
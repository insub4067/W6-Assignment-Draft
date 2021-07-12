const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-Middleware");
const Heart = require("../models/heart");

router.post("/:productId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { productId } = req.params;
  const { action } = req.query;
  try {
    if (action === "like") {
      await Heart.create({ userId, productId });
    } else {
      await Heart.deleteOne({ userId, productId });
    }
    res.send({});
  } catch (error) {
    res.status(400).send({ message: "요청을 수행하는데 실패했습니다." });
  }
});

module.exports = router;

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
      if (!(await Heart.findOne({ userId, productId }))){
        await Heart.create({ userId, productId });
      } else {
        res.status(400).send({ message: '이미 좋아요를 한 게시글입니다.' });
        return;
      }
    } else {
      if (await Heart.findOne({ userId, productId })){
        await Heart.deleteOne({ userId, productId });
      } else {
        res.status(400).send({ message: '이미 좋아요를 취소한 게시글입니다.' });
        return;
      }
    }
    res.send({});
  } catch (error) {
    res.status(400).send({ message: '요청을 수행하지 못했습니다.' });
  }
});

module.exports = router;

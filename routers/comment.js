const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/registerValidater");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const Comment = require("../models/comment");

// 댓글 목록 요청
router.get("/:productId", async (req, res) => {
  const comments = await Comment.find({});
  res.send({ comments });
});

// 댓글 저장
router.post("/:productId/post", authMiddleware, async (req, res) => {
  const { productId } = req.params;
  const { content } = req.body;
  const { nickname } = res.locals.user;

  try {
    await Comment.create({ productId, nickname, content });
    res.status(201).send({});
  } catch (error) {
    res.status(400).send({ message: "댓글 저장에 실패했습니다." });
  }
});

//댓글 삭제
router.delete("/:commentId/delete", authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { nickname } = res.locals.user;
  let comment = null;

  try {
    comment = await Comment.findById({ commentId });
  } catch (error) {
    res.status(401).send({ message: "존재하지 않는 댓글입니다." });
    return;
  }

  if (comment.nickname !== nickname) {
    res
      .status(401)
      .send({ message: "다른 사용자의 댓글은 삭제할 수 없습니다." });
    return; // 전달받은 댓글의 작성자와 현재 사용자가 다를 경우 요청거부
  }

  try {
    await Comment.deleteOne({ _id: commentId });
    return;
  } catch (error) {
    res.status(400).send({ message: "댓글 삭제에 실패했습니다." });
  }

  res.status(200).send({});
});

module.exports = router;

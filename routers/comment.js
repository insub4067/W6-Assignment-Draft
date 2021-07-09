const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/resgisterMiddleware");
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
  } catch (error) {}
});

router.delete("/:commentId/delete", authMiddleware, async (req, res) => {});

module.exports = router;

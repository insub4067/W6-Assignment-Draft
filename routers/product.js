const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-Middleware");
const multer = require("multer");
const Product = require("../models/product");
const Comment = require("../models/comment");

//이미지 저장
const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "../public/uploads/images");
  },

  filename: function (request, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});

//이미지업로드
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3,
  },
});

//상품 조회
router.get("/", async (req, res) => {
  const result = await Product.find().sort("-createdAt");
  res.json({ result });
});

//상품 등록
router.post(
  "/post",
  upload.single("image"),
  authMiddleware,
  async (req, res) => {
    const img = req.file.filename;
    const { title, price, content } = req.body;
    const {
      user: { nickname },
    } = res.locals;

    const product = new Product({ title, price, content, nickname, img });

    await product.save();
    res.status(200).send({});
  }
);

//상품 수정
router.put(
  "/:id/edit",
  upload.single("image"),
  authMiddleware,
  async (req, res) => {
    const {
      user: { nickname },
    } = res.locals;
    const { _id } = req.params;
    const result = await Product.findById(_id);
    const dbNickname = result.nickname;

    const { title, content } = req.body;
    const img = req.file.filename;

    if (nickname !== dbNickname) {
      res.status(400).send({
        errorMessage: "사용자가 일치하지 않습니다",
      });
      return;
    } else {
      await Product.findByIdAndUpdate(_id, { title, content, img });
    }
  }
);

//상품 삭제
router.delete("/:id/delete", authMiddleware, async (req, res) => {
  const {
    user: { nickname },
  } = res.locals;
  const { _id } = req.params;
  const result = await Product.findById(_id);
  const dbNickname = result.nickname;

  if (nicknmae !== dbNickname) {
    res.status(400).send({
      errorMessage: "사용자가 일치하지 않습니다",
    });
  } else {
    await Product.findByIdAndDelete(_id);
    await Comment.deleteMany({ _id });
  }
});

//detail 상품정보 가져오기
router.get("/:id", async (req, res) => {
  try {
    const { _id } = req.params;

    const result = await Product.findById(_id);

    res.send(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;

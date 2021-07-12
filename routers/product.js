const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-Middleware");
const multer = require("multer");
const Product = require("../models/product");
const Comment = require("../models/comment");
const Heart = require("../models/heart");

//이미지 저장공간 지정
const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        cb(null, "./images/product");


    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

//이미지 파일 형식 체크
const fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true);
    }else{
        cb(new Error("이미지 파일 형식이 맞지 않습니다"), false);
    }
};

//이미지 저장 세팅
const upload = multer({ 
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

//상품 조회
router.get("/", async (req, res) => {
  const { userId } = req.query; // 좋아요 여부 
  let result = await Product.find().sort("-createdAt").lean({ virtuals: true });
  if (userId) {
      for(product of result){
        const { productId } = product;
        const heart = await Heart.findOne({ userId, productId });
        product['likeOrUnlike'] = heart? 'fas':'far';
        }
  } else {
      for(product of result){
        product['likeOrUnlike'] = 'far';
    }
  }
  
  res.json({ result });
});


//상품 등록
router.post("/post", upload.array("image", 5), authMiddleware, async (req, res) => {

    const productImage = req.file.path;
    const { title, price, content } = req.body;
    const { user: { nickname } } = res.locals;

    const product = new Product({ title, price, content, productImage, nickname })

    await product.save();
    res.status(200).send({});
  }
);

//상품 수정
router.put("/:id/edit", upload.array("image", 5), authMiddleware, async (req, res) => {

    const { user: { nickname } } = res.locals;
    const { _id } = req.params;
    const result = await Product.findById(_id);
    const dbNickname = result.nickname;

    const { title, content } = req.body;
    const productImage = req.file.path;

    if ( nickname !== dbNickname ){
        res.status(400).send({
            errorMessage: "사용자가 일치하지 않습니다"

        });
        return
    }else{    
        await Product.findByIdAndUpdate(_id, {title, content, productImage})
    }
  }
);

//상품 삭제
router.delete("/:id/delete", authMiddleware, async(req, res) => {

    const{ user:  { nickname } }  = res.locals;
    const { _id } = req.params
    const result = await Product.findById(_id)
    const dbNickname = result.nickname

    if ( nickname !== dbNickname){
        res.status(400).send({
            errorMessage: "사용자가 일치하지 않습니다"
        })
    }else{
        await Product.findByIdAndDelete(_id)
        await Comment.deleteMany({ _id })
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

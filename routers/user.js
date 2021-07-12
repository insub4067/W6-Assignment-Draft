const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/registerValidater")
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const secretKey = require("../config/secretKey");
const multer = require("multer")
const User = require("../models/user");
const { route } = require("./heart");
const crypto = require('crypto');

const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        cb(null, "./images/user");


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

// const upload = multer({
//     dest: "./images/user"
// })

//회원가입
router.post('/register',registerValidator,upload.single("image"), async (req, res) => {
    //field = key ;

    try {
        
        const { email, nickname, password } = req.body;
        // const userImage = req.file.path
        

        const encryptedPassword = crypto.createHash('sha512').update(password).digest('base64'); //암호화 
        const user = new User({ email, nickname, password });
        user.password = encryptedPassword
        await user.save(); //
        res.status(201).send({ result: '개꿀' });

    } catch(err) {
        console.log(err);
        res.status(400).send({
            errorMessage: '회원가입에 실패하였습니다 ',
        });

    }
});

//토큰 확인
router.get('/auth', authMiddleware, async (req, res) => {
    

    const user = res.locals.user;

    res.send({ userId:user.userId });
});


const loginValidater = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).trim().required(),
});

//로그인 
router.post('/login', async (req, res) => {

    try {
        const { email, password } = await loginValidater.validateAsync(
            req.body
        );
        const encryptedPassword = crypto.createHash('sha512').update(password).digest('base64'); //암호화 
        const user = await User.findOne({ $and : 
            [{ email: email}, {password : encryptedPassword }] })
        

        if (!user) {
            res.status(401).send({ errorMessage: '로그인에 실패했습니다. ' });
            return;
        }
        const token = jwt.sign( //토큰 발급
            { email: user.email, nickname: user.nickname, userId: user.userId },
            secretKey
        ); 

        res.send({
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: '로그인에 실패하였습니다. ',
        });
    }
});




module.exports = router;
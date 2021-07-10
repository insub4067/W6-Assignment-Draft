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


//회원가입
router.post('/register', registerValidator , async (req, res) => {
    

    try {
        const { email, nickname, password } = req.body;
        const encryptedPassword = crypto.createHash('sha512').update(password).digest('base64'); //암호화 
        const user = new User({ email, nickname, password });
        user.password = encryptedPassword
        await user.save(); //
        res.status(201).send({ result: '개꿀' });

    } catch(err) {

    }
});

//토큰 확인
router.get('/auth', authMiddleware, async (req, res) => {
    

    const user = res.locals.user;

    res.send({});
});


const loginValidater = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).trim().required(),
});
//로그인 
router.post('/login', async (req, res) => {

    try {
        let { email, password } = await loginValidater.validateAsync(
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
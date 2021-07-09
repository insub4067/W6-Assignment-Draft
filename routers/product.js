const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/resgisterMiddleware")
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(request, file, callback){
        callback(null, '../public/uploads/images');
    },

    filename: function(request, file, callback){
        callback(null, Date.now() + file.originalname)
    }
});

const upload = multer({
    storage : storage,
    limits : {
        fieldSize:1024*1024*3,
    },
});

router.post("/:id", upload.single('image'), async(req,res) => {
    const { id } = req.params;
    const 
});


module.exports = router;
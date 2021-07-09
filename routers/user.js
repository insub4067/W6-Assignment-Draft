const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/resgisterMiddleware")
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const secretKey = requier("../config/secretKey");


module.exports = router;
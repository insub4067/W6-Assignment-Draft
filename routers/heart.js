const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-Middleware");
const registerValidator = require("../middlewares/registerValidater")
const jwt = require("jsonwebtoken");
const Joi = require("joi");

module.exports = router;
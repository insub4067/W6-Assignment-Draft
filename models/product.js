const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: String,
    nickname: String,
    content: String,
    price: String,
}, {timestamps: true});


module.exports = mongoose.model("Product", PostSchema);
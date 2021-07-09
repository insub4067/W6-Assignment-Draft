const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: String,
    nickname: String,
    content: String,
    price: Number,
    img:{
        data: Buffer,
        contentType: String
    } 
}, {timestamps: true});


module.exports = mongoose.model("Product", ProductSchema);
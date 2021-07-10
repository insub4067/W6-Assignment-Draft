const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        // required: true
    },
    content: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productImage:{
        type: String,
        required: true
    } 
}, {timestamps: true});


module.exports = mongoose.model("Product", ProductSchema);
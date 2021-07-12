const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
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

ProductSchema.virtual('productId').get(function () {
    return this._id.toHexString();
});

ProductSchema.set('toJSON', {
    virtuals: true,
});

ProductSchema.plugin(mongooseLeanVirtuals);

module.exports = mongoose.model("Product", ProductSchema);
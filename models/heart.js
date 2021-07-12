const mongoose = require("mongoose");

const { Schema } = mongoose;

const heartSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userId: {
        type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("heart", heartSchema);

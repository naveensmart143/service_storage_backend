const mongoose = require("mongoose");
const schema = mongoose.Schema;

const products = new schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    default: "No Label",
  },
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "No Description",
  },
  user: {
    type: schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Product", products);

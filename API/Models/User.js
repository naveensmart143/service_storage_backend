const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);

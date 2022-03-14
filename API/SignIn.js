const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../API/Models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userCheck = await User.findOne({ email });
    if (!userCheck) {
      const passwordEncode = await bcrypt.hash(password, 12);
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        password: passwordEncode,
      });
      const results = await user.save();
      const newUserId = results._doc;
      // console.log(results._doc._id);
      const token = jwt.sign(
        { user: newUserId._id, email: newUserId.email },
        "superkey",
        { expiresIn: "1h" }
      );
      res.status(201).json({
        message: "User is Created",
        token: token,
        userId: newUserId._id,
      });
    }
  } catch (err) {
    throw err;
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("no user with that email");
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      throw new Error("Password incorrect");
    }
    const token = jwt.sign({ user: user.id, email: user.email }, "superkey", {
      expiresIn: "1h",
    });
    res.status(200).json({
      token: token,
      userId: user.id,
    });
  } catch (err) {
    throw err;
  }
});
module.exports = router;

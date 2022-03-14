const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../Models/product");
const multer = require("multer");
const isAuth = require("../Controller/isAuth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Please Provide a image File"), false);
  }
};
const uploads = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: fileFilter,
});
router.get("/uploads", isAuth, async (req, res, next) => {
  // const userId = req.userId;

  const products = await Product.find();
  const listProducts = products.map((item) => {
    return item._doc;
  });
  res.status(200).json({
    items: [listProducts],
  });
});

router.post("/", uploads.single("fileName"), isAuth, (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const userId = req.body.userId;
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    user: userId,
    productName: url + "/uploads/" + req.file.filename,
  });
  product
    .save()
    .then((result) => {
      // console.log(result);
      res.status(200).json({
        message: "we are in products url",
        createdProduct: product,
        url: "http://localhost:4000" + product.productName,
      });
    })
    .catch((err) => {
      throw err;
    });
});
router.post("/label", isAuth, async (req, res, next) => {
  const { productId, label, description } = req.body;
  console.log(productId);
  console.log(label);
  console.log(description);

  const product = await Product.findOne({ id: productId });
  console.log(product);
  product.name = label;
  product.description = description;
  const result = await product.save();

  res.status(200).json({
    message: "Edited the product",
  });
});
router.delete("/:productId", (req, res, next) => {
  const productId = req.params.productId;
  // console.log(productId);
  Product.deleteOne({ _id: productId })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;

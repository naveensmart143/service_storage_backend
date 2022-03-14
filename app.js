const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const userRouter = require("./API/SignIn");
const productRouter = require("./API/Routers/FileUploads");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,GET,DELETE");
    return res.status(200).json({});
  }
  next();
});
app.use("/users", userRouter);
app.use("/fileUpload", productRouter);
app.use("/uploads/", express.static("uploads"));

mongoose
  .connect(
    `mongodb+srv://prashanth1:Naveen143@cluster0.4vhqk.mongodb.net/StorageService?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("data base connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;

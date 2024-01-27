const express = require("express");
//getting userRouter
const userRouter = require("./user");

// creating a router
const router = express.Router();

// using userRouter
router.use("/user", userRouter);
// /api/v1/user/login
// /api/v1/user/signup

//api/v1/account/transferMoney
//api/v1/account/getBalance

// exporting router
module.exports = router;

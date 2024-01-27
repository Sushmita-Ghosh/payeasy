const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/jwt");

const userRouter = express.Router();

// input validation
const signupBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

// for signup
userRouter.post("/signup", (req, res) => {
  // input validation
  const { success } = signupBody.parse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  // check if user exists
  const existingUser = User.findOne({
    username: req.body.username,
  });

  // if user exists
  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken/ Incorrect inputs",
    });
  }

  // create new user with the same body
  const user = User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  // getting the id for token
  const userId = user._id;

  // create a jwt token
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  return res.status(200).json({
    message: "User created successfully",
    token,
  });
});

module.exports = userRouter;

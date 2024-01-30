const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/jwt");
const authMiddleware = require("../middleware/authMiddleware");

const userRouter = express.Router();

/*********************************SIGNUP ROUTE**************************************************** */
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

/*********************************LOGIN ROUTE**************************************************** */
const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

userRouter.post("/signin", (req, res) => {
  //input validation
  const { success } = signinBody.parse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  // check if user exists
  const existingUser = User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (!existingUser) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }

  // getting the id for token
  const userId = existingUser._id;

  // sign the user with the JWT token
  if (existingUser) {
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );
    return res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  }
});

/*********************************UPDATE USER INFO ROUTE**************************************************** */

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

userRouter.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.parse(req.body);

  if (!success) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }

  const userId = req.userId;

  // update the user by matching the id
  const updatedUser = await User.updateOne({
    _id: userId,
  });

  if (!updatedUser) {
    return res.status(411).json({
      message: "Error while updating information",
    });
  }

  // return the updated user
  return res.status(200).json({
    message: "User updated successfully",
  });
});

/*********************************GET USERS FROM THE BACKEND, FILTERABLE VIA FIRSTNAME/LASTNAME**************************************************** */

userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  // get all users from the database either by firstname or lastname
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: filter,
          $options: "i",
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = userRouter;

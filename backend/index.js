const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");
const mainRouter = require("./routes/index.js");

dotenv.config();

// connect to database
connectDB();

// create express app
const app = express();

// use express router
app.use("/api/v1", mainRouter);
// /api/v1/user
// /api/v1/transaction

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");
const mainRouter = require("./routes/index.js");
const cors = require("cors");

dotenv.config();

// connect to database
connectDB();

// create express app
const app = express();

// middlewares
app.use(express.json());
app.use(express.json());

// use express router
app.use("/api/v1", mainRouter);
// /api/v1/user
// /api/v1/transaction

// listen to port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

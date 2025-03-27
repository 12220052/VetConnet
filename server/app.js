const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");

// Configurations
const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
const userRouter = require("./routes/userRoutes");

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/users", userRouter);

module.exports = app;

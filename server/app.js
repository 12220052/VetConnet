const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/users", userRouter);

module.exports = app; // ✅ Export only, no app.listen()

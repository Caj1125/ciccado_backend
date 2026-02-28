const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Route imports
const authRoutes = require("./routes/authRoutes");
const bugRoutes = require("./routes/bugRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");

// Middleware imports
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// ---------- Global Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ---------- Health Check ----------
app.get("/", (_req, res) => {
  res.json({ message: "Bug Tracker API is running" });
});

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/bugs", bugRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);

// ---------- Error Handling ----------
app.use(notFound);
app.use(errorHandler);

module.exports = app;

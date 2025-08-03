const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const commentsRoutes = require("./routes/comments");
const tagsRoutes = require("./routes/tags");
const HttpError = require("./models/http-error");
const { socketHandlers } = require("./utils/socket");

const app = express();
const httpServer = createServer(app);

const {
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  COOKIE_KEY,
  NODE_ENV,
  CLIENT_URL,
  CLIENT_URL_UI,
  PORT = 5000,
} = process.env;

const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.4ttdhna.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

// ----- MIDDLEWARE SETUP -----

// Trust proxy if behind load balancer (e.g., Heroku, Vercel)
app.set("trust proxy", 1);

// CORS
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "HEAD"],
}));

// Cookie session
app.use(cookieSession({
  name: "session",
  keys: [COOKIE_KEY],
  maxAge: 24 * 60 * 60 * 1000,
  secure: NODE_ENV !== "development",
  sameSite: NODE_ENV !== "development" ? "none" : false,
}));

// JSON Body parser
app.use(bodyParser.json());

// ----- ROUTES -----
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/tags", tagsRoutes);

app.get("/", (req, res) => {
  res.send("TVC Educate is running");
});

// Handle unknown routes
app.use((req, res, next) => {
  next(new HttpError("Route not found", 404));
});

// Global error handler
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  console.error("[ERROR]:", error.message || "Unknown error");
  res.status(error.code || 500).json({
    message: error.message || "An unknown error occurred",
  });
});

// ----- SOCKET.IO -----
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000" || CLIENT_URL,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "HEAD"],
    credentials: true,
  },
});
socketHandlers(io);

// ----- DATABASE + SERVER START -----
(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
})();

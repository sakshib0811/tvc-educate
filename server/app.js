const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const { createServer } = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
require("dotenv").config();

// Utilities
const { validateEnvironment } = require("./utils/env-validator");
const logger = require("./utils/logger");

validateEnvironment();

const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const commentsRoutes = require("./routes/comments");
const tagsRoutes = require("./routes/tags");
const HttpError = require("./models/http-error");
const { socketHandlers } = require("./utils/socket");
const inputSanitization = require("./middleware/input-sanitization");
const { generalLimiter, authLimiter, passwordChangeLimiter, uploadLimiter, apiLimiter } = require("./middleware/rate-limiter");

const app = express();
const httpServer = createServer(app);

const {
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  COOKIE_KEY,
  NODE_ENV,
  CLIENT_URL,
  PORT = 5000,
} = process.env;

const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.4ttdhna.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

// ----- SECURITY -----
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.set("trust proxy", 1);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [CLIENT_URL, "http://localhost:3000", "http://localhost:3001"].filter(Boolean);
    if (allowedOrigins.indexOf(origin) !== -1) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET","POST","PATCH","DELETE","PUT","HEAD"],
  allowedHeaders: ["Content-Type","Authorization","X-Requested-With"],
}));

// ----- MIDDLEWARE -----
app.use(generalLimiter);
app.use(cookieSession({
  name: "session",
  keys: [COOKIE_KEY],
  maxAge: 24*60*60*1000,
  secure: NODE_ENV === "production",
  httpOnly: true,
  sameSite: NODE_ENV === "production" ? "strict" : "lax",
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(inputSanitization);

// ----- HEALTH CHECK -----
app.get("/health", (req, res) => {
  const healthCheck = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    memory: process.memoryUsage(),
  };
  res.status(healthCheck.database === "connected" ? 200 : 503).json(healthCheck);
});

// ----- ROUTES -----
app.use("/api/posts", apiLimiter, postsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/comments", apiLimiter, commentsRoutes);
app.use("/api/tags", apiLimiter, tagsRoutes);

app.use("/api/users/login", authLimiter);
app.use("/api/users/signup", authLimiter);
app.use("/api/users/*/change-password", passwordChangeLimiter);
app.use("/api/posts", uploadLimiter);

app.get("/", (req, res) => res.send("TVC Educate is running"));

// Handle unknown routes
app.use((req, res, next) => next(new HttpError("Route not found", 404)));

// Global error handler
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  logger.error("[ERROR]:", error.message || "Unknown error");
  res.status(error.code || 500).json({ message: error.message || "An unknown error occurred" });
});

// ----- SOCKET.IO -----
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL || "http://localhost:3000",
    methods: ["GET","POST","PATCH","DELETE","PUT","HEAD"],
    credentials: true,
  },
});
socketHandlers(io);

// ----- DATABASE + SERVER START -----
(async () => {
  try {
    logger.info(`Connecting to MongoDB: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    logger.info(`✅ Connected to MongoDB: ${DB_NAME}`);

    httpServer.listen(PORT, () => {
      logger.info(`✅ Server running on http://localhost:${PORT}`);
      logger.info(`✅ Environment: ${NODE_ENV}`);
      logger.info(`✅ Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    logger.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
})();

// ----- GRACEFUL SHUTDOWN -----
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  httpServer.close(() => process.exit(0));
});

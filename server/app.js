const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
require("dotenv").config();

// Import utilities
const { validateEnvironment } = require("./utils/env-validator");
const logger = require("./utils/logger");

// Validate environment variables
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
  CLIENT_URL_UI,
  PORT = 5000,
} = process.env;

const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.4ttdhna.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

// ----- SECURITY MIDDLEWARE SETUP -----

// Security headers
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

// Trust proxy if behind load balancer (e.g., Heroku, Vercel)
app.set("trust proxy", 1);

// CORS with improved security
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      CLIENT_URL,
      "http://localhost:3000",
      "http://localhost:3001"
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));

// Rate limiting - more lenient for real-time app
app.use(generalLimiter);

// Cookie session with improved security
app.use(cookieSession({
  name: "session",
  keys: [COOKIE_KEY],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: NODE_ENV === "production",
  httpOnly: true,
  sameSite: NODE_ENV === "production" ? "strict" : "lax",
}));

// JSON Body parser with size limit
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
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
  
  const statusCode = healthCheck.database === "connected" ? 200 : 503;
  res.status(statusCode).json(healthCheck);
});

// ----- ROUTES -----
app.use("/api/posts", apiLimiter, postsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/comments", apiLimiter, commentsRoutes);
app.use("/api/tags", apiLimiter, tagsRoutes);

// Apply specific rate limiting to sensitive routes
app.use("/api/users/login", authLimiter);
app.use("/api/users/signup", authLimiter);
app.use("/api/users/*/change-password", passwordChangeLimiter);
app.use("/api/posts", uploadLimiter); // Apply upload limiting to posts (for image uploads)

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
    origin: CLIENT_URL || "http://localhost:3000",
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
    
    logger.info(`✅ Connected to MongoDB: ${DB_NAME}`);
    
    httpServer.listen(3000, () => {
      logger.info(`✅ Server running on http://localhost:${PORT}`);
      logger.info(`✅ Environment: ${NODE_ENV}`);
      logger.info(`✅ Health check available at: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    logger.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");
const ledgerRoutes = require("./src/routes/ledger.routes");
const clientRoutes = require("./src/routes/client.routes");
const cors = require("cors");
const app = express();

// security & utils
app.use(helmet());
// put this BEFORE app.use(express.json()) and routes
const allowedOrigins = [
  "http://localhost:4000", // your current frontend
  "http://localhost:3000", // keep if you sometimes use CRA
  "http://localhost:5173", // keep if you sometimes use Vite default
  "https://loquacious-marshmallow-79760d.netlify.app/",
  "https://loquacious-marshmallow-79760d.netlify.app",
];

app.use(
  cors({
    origin(origin, callback) {
      // allow REST clients or same-origin requests with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // if you ever send cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// handle preflight (some
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/client", clientRoutes);

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

// start
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`API running on :${PORT}`));
});

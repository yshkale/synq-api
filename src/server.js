require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const app = express();

connectDB();

app.use(helmet());

app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(cors());
app.use(morgan("dev"));

//Data sanitization against NOsql query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Parameter Pollution
app.use(hpp());

const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again later in an hour.",
});

app.use("/api", limiter);

app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/tasks", require("./routes/taskRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});

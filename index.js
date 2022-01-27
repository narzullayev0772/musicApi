const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const router = require("./routes/routes");
const { UserRoute } = require("./routes/userRouter");
const AppError = require("./utils/appError");
const errorController = require("./controller/errorController");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
// secure http headers

app.use(helmet());
app.use(cors());

// development
if (process.env.NODE_ENV === "production") {
  app.use(morgan("dev"));
}

// limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: "TOO MANY REQUEST FROM THIS IP try again in an hour",
});

app.use("/api", limiter);

// compress files
app.use(compression());

// body parser
app.use(express.json({ limit: "10kb" }));

// data sanitization Nosql query injection
app.use(ExpressMongoSanitize());

// data sanitization secure XSS
app.use(xss());
app.use(hpp());

app.use("/api/v1/music", router);
app.use("/api/v1/user", UserRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});

app.use(errorController);

module.exports = app;

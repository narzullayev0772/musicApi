const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log("uncaughtException error", err);
  process.exit(1);
});

const app = require(".");
dotenv.config({ path: "./.env" });
mongoose.connect(process.env.DATABASE_LOCAL).then(() => {
  console.log("success connect to db");
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("server working...");
});

process.on("unhandledRejection", (err) => {
  console.log("database connection error");
  server.close(() => {
    process.exit(1);
  });
});

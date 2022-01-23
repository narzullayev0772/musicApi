const mongoose = require("mongoose");
const app = require(".");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

mongoose.connect(process.env.DB).then(() => console.log("Connected db"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("server working...");
});

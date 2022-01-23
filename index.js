const express = require("express");
const app = express();
const cors = require("cors");
const compression = require('compression');
const router = require('./routes/routes')

app.use(cors());
app.use(compression())
app.use(express.json());


app.use("/music/api",router);


module.exports = app;

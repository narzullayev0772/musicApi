const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require('dotenv')
const compression = require('compression');
dotenv.config({path:"./.env"})
const router = require('./routes/routes')

app.use(cors());
app.use(compression())
app.use(express.json());


app.use("/music/api",router);


const PORT = process.env.PORT || 5000;
app.listen(PORT);

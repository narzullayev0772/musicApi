const express = require("express");
const app = express();
const axios = require("axios").default;
const cors = require("cors");
const dotenv = require('dotenv')
dotenv.config({path:"./.env"})

app.use(cors());

app.get("/", (req, res) => {
  axios.get(process.env.URL)
  .then((data) =>{
    res.status(200).json({
        status:"success",
        // tracks: data.data.split("data-track=").map((e,index)=>index>0?e.split("data-title")[0]:null)
    })
  }
  );
});
const PORT = process.env.PORT || 5000;
app.listen(PORT);

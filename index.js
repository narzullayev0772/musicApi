const express = require("express");
const app = express();
const axios = require("axios").default;
const cors = require("cors");
const dotenv = require('dotenv')
const compression = require('compression');
dotenv.config({path:"./.env"})

app.use(cors());
app.use(compression())

// data-track="https://uzbmusic.net/uploads/files/jaloliddin_ahmadaliyev__sogindim.mp3"
// data-title="Jaloliddin Ahmadaliyev - Sog&#039;indim" data-artist="Исполнитель"
// data-img="/templates/YoqubovUz/dleimages/no_image.jpg">

app.get("/music/api", (req, res) => {
  axios.get(process.env.URL)
  .then((data) =>{
    res.status(200).json({
        status:"success",
        results:data.data.split(`class="track-item fx-row fx-middle js-item"`).length-1,
        tracks:data.data.split(`class="track-item fx-row fx-middle js-item"`).map((e,index)=>index>0?e.split("data-artist")[0].replace("=",":").replace("=",":").replace("\n",``):null)
    })
  }
  );
});
const PORT = process.env.PORT || 5000;
app.listen(PORT);

const express = require("express");
const app = express();
const axios = require("axios").default;
const cors = require("cors");
const dotenv = require('dotenv')
const compression = require('compression');
dotenv.config({path:"./.env"})

app.use(cors());
app.use(compression())

const trackCreator = (track,id)=>{
  return {
    id:id,
    track:id?track.split("\ndata-title")[0]:"",
    title:id?track.split(`data-title=`)[1].split("data-artist")[0]:""

  }
}
app.get("/music/api", (req, res) => {
  axios.get(process.env.URL)
  .then((data) =>{
    // {
    //   track:data.data.split(`data-track=`)[1].split("\ndata-title")[0],
    //   title:data.data.split(`data-title=`)[1].split("data-artist")[0]
    // }
    res.status(200).json({
        status:"success",
        results:data.data.split(`class="track-item fx-row fx-middle js-item"`).length-1,
        tracks: data.data.split(`data-track=`).map((e,index)=> trackCreator(e,index))
    })
  }
  );
});
const PORT = process.env.PORT || 5000;
app.listen(PORT);

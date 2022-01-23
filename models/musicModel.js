const mongoose = require("mongoose");
const MusicModel = new mongoose.Schema({
  id:{
    type:Number,
  },
  trackName: {
    type: String,
    required: false
  },
  trackAutor: {
    type: String,
    required: false
  },
  track: {
    type: String,
    required: false
  },
  like: {
    type: Number,
    default:0,
    required:false
  },
});
const myMusicModel = mongoose.model("Music", MusicModel);

module.exports = myMusicModel;

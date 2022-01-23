const mongoose = require('mongoose');
const MusicModel = new mongoose.Schema({
  artist: {
    type: String,
    required: [true, "artist name must have be! "],
  },
  title: {
    type: String,
    required: [true, "title name must have be! "],
  },
  link: {
    type: String,
    required: [true, "artist name must have be! "],
    unique: true,
  },
});
const Music = mongoose.model("Music", MusicModel);

module.exports = Music;
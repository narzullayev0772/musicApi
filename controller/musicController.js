const axios = require("axios").default;

trackCreator = (track, id) => {
  return {
    id: id,
    track: id ? track.split("\ndata-title")[0] : "",
    title: id ? track.split(`data-title=`)[1].split("data-artist")[0] : "",
  };
};
module.exports = trackCreator

const getterAll = (env,req,res) => {
  axios.get(env).then((data) => {
    res.status(200).json({
      status: "success",
      results:
        data.data.split(`class="track-item fx-row fx-middle js-item"`).length -
        1,
      tracks: data.data
        .split(`data-track=`)
        .map((e, index) => trackCreator(e, index)),
    });
  });
};

module.exports.search = (req, res) => {
  axios
    .get(process.env.SEARCH.replace(process.env.ENGINE, req.body.name))
    .then((data) => {
      res.status(200).json({
        status: "success",
        results:
          data.data.split(`class="track-item fx-row fx-middle js-item"`)
            .length - 1,
        tracks: data.data
          .split(`data-track=`)
          .map((e, index) => trackCreator(e, index)),
      });
    });
};

module.exports.uzMusic = (req, res) => {
  getterAll(process.env.URLUZ,req,res);
};
module.exports.uzMusicPage = (req, res) => {
  getterAll(process.env.URLUZ + "/page/" + req.params.page,req,res);
};


module.exports.ruMusic = (req, res) => {
  getterAll(process.env.URLRU,req,res);
};
module.exports.ruMusicPage = (req, res) => {
  getterAll(process.env.URLRU + "/page/" + req.params.page,req,res);
};


module.exports.udarMusic = (req, res) => {
  getterAll(process.env.URLZAR,req,res);
};
module.exports.udarMusicPage = (req, res) => {
  getterAll(process.env.URLZAR + "/page/" + req.params.page,req,res);
};

module.exports.turkMusic = (req, res) => {
    getterAll(process.env.URLTURK,req,res);
  };
  module.exports.turkMusicPage = (req, res) => {
    getterAll(process.env.URLTURK+ "/page/" + req.params.page,req,res);
  };
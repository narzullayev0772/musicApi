const axios = require("axios").default;

const myMusicModel = require("./../models/musicModel");

const trackCreator = (track, id) => {
  if (id == 0) return {};
  return {
    id: id,
    track: track
      .split("\ndata-title")[0]
      .replace(`"`, "")
      .replace("&#039;", "'")
      .replace("&amp;", "&")
      .replace(`"`, "")
      .replace(`"`, ""),
    trackName: track
      .split(`data-title=`)[1]
      .split("data-artist")[0]
      .split("-")[0]
      .replace(`"`, "")
      .replace("&#039;", "'")
      .replace("&amp;", "&")
      .replace(`"`, "")
      .replace(`"`, ""),
    trackAutor: track
      .split(`data-title=`)[1]
      .split("data-artist")[0]
      .split("-")[1]
      .replace(`"`, "")
      .replace("&#039;", "'")
      .replace("&amp;", "&")
      .replace(`"`, "")
      .replace(`"`, ""),
    like: 0,
  };
};

const trackCreatorSearch = (el, id) => {
  if (id > 0)
    return {
      id: id,
      track: el.split(`data-xftitle`)[0].replace(`"`, "").replace(`"`, ""),
      trackName: el
        .split(`data-xftitle=`)[1]
        .split("data-time")[0]
        .split("-")[1]
        .replace(`"`, "")
        .replace("&#039;", "'")
        .replace("&amp;", "&")
        .replace(`"`, "")
        .replace(`"`, ""),
      trackAutor: el
        .split(`data-xftitle=`)[1]
        .split("data-time")[0]
        .split("-")[0]
        .replace(`"`, "")
        .replace("&#039;", "'")
        .replace("&amp;", "&")
        .replace(`"`, "")
        .replace(`"`, ""),
      like: 0,
    };
};

const getterAll = async (env, req, res) => {
  let data = await axios.get(env);

  try {    
    await myMusicModel.deleteMany();
      await myMusicModel.insertMany(
        data.data
          .split(`data-track=`)
          .map((e, index) => trackCreator(e, index))
      );
    res.status(200).json({
      status: "success",
      results:
        data.data.split(`class="track-item fx-row fx-middle js-item"`).length -
        1,
      tracks: data.data
        .split(`data-track=`)
        .map((e, index) => trackCreator(e, index)),
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "You don't used unique name or don't fill anything!",
      error:error
    });
  }
};

module.exports.search = async (req, res) => {
  const Response3 = await axios.get(
    process.env.SEARCHFULL.replace(process.env.ENGINE, req.body.name)
  );

  let data3 = Response3.data;
  res.status(200).json({
    status: "success",
    results: data3.split("data-norber=").length - 1,
    tracks: data3
      .split("data-norber=")
      .map((el, index) => trackCreatorSearch(el, index)),
  });
};

module.exports.uzMusic = (req, res) => {
  getterAll(process.env.URLUZ, req, res);
};
module.exports.uzMusicPage = (req, res) => {
  getterAll(process.env.URLUZ + "/page/" + req.params.page, req, res);
};

module.exports.ruMusic = (req, res) => {
  getterAll(process.env.URLRU, req, res);
};
module.exports.ruMusicPage = (req, res) => {
  getterAll(process.env.URLRU + "/page/" + req.params.page, req, res);
};

module.exports.udarMusic = (req, res) => {
  getterAll(process.env.URLZAR, req, res);
};
module.exports.udarMusicPage = (req, res) => {
  getterAll(process.env.URLZAR + "/page/" + req.params.page, req, res);
};

module.exports.turkMusic = (req, res) => {
  getterAll(process.env.URLTURK, req, res);
};
module.exports.turkMusicPage = (req, res) => {
  getterAll(process.env.URLTURK + "/page/" + req.params.page, req, res);
};

module.exports.TopMusic = async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append("query", "Популярная музыка");

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const MusicList = await axios.post(
      "https://t9music.ru/upsearch/" + req.body.offset,
      params,
      config
    );

    res.json({
      status: "success",
      tracks: MusicList.data.list,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: error,
    });
  }
};
module.exports.LikeCounter = async (req, res) => {
  try {
    await myMusicModel.updateOne({ track: req.body.track }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: "You don't used unique name or don't fill anything!",
    });
  }
};

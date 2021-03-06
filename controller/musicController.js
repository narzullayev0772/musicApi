const axios = require("axios").default;
const catchAsyn = require("./../utils/catchAsyn");

const { Comment } = require("./../models/commentModel");
const likeModel = require("./../models/likeModel");

const trackCreator = (track, id) => {
  if (id == 0) return {};
  return {
    id: Date.now() + id,
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
      .split(`data-artist=`)[1]
      .split("data-img")[0]
      .split("-")[0]
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
      _id: id,
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

  res.status(200).json({
    status: "success",
    results: data.data.split(`data-track=`).length - 1,
    tracks: data.data
      .split(`data-track=`)
      .map((e, index) => trackCreator(e, index)),
  });
  // await myMusicModel.deleteMany({})
  // const insertDoc = data.data
  //   .split(`data-track=`)
  //   .map((e, index) => trackCreator(e, index));
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

module.exports.uzMusic = async (req, res) => {
  getterAll(process.env.URLUZ, req, res);
};
module.exports.uzMusicPage = (req, res) => {
  getterAll(process.env.URLUZ + "/page/" + req.params.page, req, res);
};

module.exports.ruMusic = async (req, res) => {
  const Response3 = await axios.get(
    process.env.SEARCHFULL.replace(process.env.ENGINE, "")
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
module.exports.ruMusicPage = (req, res) => {
  getterAll(process.env.URLRU + "/page/" + req.params.page, req, res);
};

module.exports.udarMusic = (req, res) => {
  getterAll(process.env.URLZAR, req, res);
};
module.exports.udarMusicPage = async (req, res) => {
  const Response3 = await axios.get(
    process.env.SEARCHFULL.replace(process.env.ENGINE, "????????????????????%20????????????")
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

module.exports.turkMusic = (req, res) => {
  getterAll(process.env.URLTURK, req, res);
};
module.exports.turkMusicPage = (req, res) => {
  getterAll(process.env.URLTURK + "/page/" + req.params.page, req, res);
};

module.exports.TopMusic = async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append("query", "???????????????????? ????????????");

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
module.exports.Comment = catchAsyn(async (req, res) => {
  await Comment.create(req.body);
  res.status(200).json({
    status: "success",
  });
});
module.exports.CommentGet = catchAsyn(async (req, res) => {
  const allComments = await Comment.find().select("-_id").select("-__v");

  res.status(200).json({
    status: "success",
    comments: allComments,
  });
});
exports.LikeCreate = catchAsyn(async (req, res, next) => {
  const likedMusicAll = await likeModel.LikeModel.find({
    track: req.body.track,
  });
  let likedMusic;
  if (likedMusicAll.length == 0) {
    likedMusic = await likeModel.LikeModel.create(req.body);
  } else {
    likedMusic = await likeModel.LikeModel.updateOne(
      { track: req.body.track },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  res.status(200).json({
    status: "success",
  });
  // next();
});

exports.GetLike = catchAsyn(async (req, res, next) => {
  const likedMusicAll = await likeModel.LikeModel.find()
    .select("-_id")
    .select("-__v");

  res.status(200).json({
    status: "success",
    comments: likedMusicAll,
  });
});

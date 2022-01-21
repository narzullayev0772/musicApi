const axios = require("axios").default;

const trackCreator = (track, id) => {
  if (id > 0)
    return {
      track: track.split("\ndata-title")[0],
      trackName: track
        .split(`data-title=`)[1]
        .split("data-artist")[0]
        .split("-")[0],
      trackAutor: track
        .split(`data-title=`)[1]
        .split("data-artist")[0]
        .split("-")[1],
    };
};

// const trackCreator2 = (el,index)=>{
//   return {
//     track: index > 0 ? el.split(".mp3")[0] + ".mp3" : null,
//     trackName:
//       index > 0
//         ? el
//             .split(`</div><div class="play-right nowrap">`)[0]
//             .split(`<div class="play-left nowrap">`)[1]
//             .split("-")[0]
//         : null,
//     trackAutor:
//       index > 0
//         ? el
//             .split(`</div><div class="play-right nowrap">`)[0]
//             .split(`<div class="play-left nowrap">`)[1]
//             .split("-")[1].split(`</div>`)[0]
//         : null,
//   }
// }



module.exports = trackCreator;

const trackCreatorSearch = (el,id)=>{
  if(id>0)
  return {
    id:id,
    track:el.split(`data-xftitle`)[0].replaceAll(`"`, "")
    .replaceAll("&#039;", "'")
    .replaceAll("&amp;", "&"),
    trackName:el.split(`data-xftitle=`)[1].split("data-time")[0].split("-")[1].replaceAll(`"`, "")
    .replaceAll("&#039;", "'")
    .replaceAll("&amp;", "&"),
    trackAuthor:el.split(`data-xftitle=`)[1].split("data-time")[0].split("-")[0].replaceAll(`"`, "")
    .replaceAll("&#039;", "'")
    .replaceAll("&amp;", "&"),
  }
}

const getterAll = (env, req, res) => {
  axios.get(env).then((data) => {
    res.status(200).json({
      status: "success",
      results:
        data.data.split(`class="track-item fx-row fx-middle js-item"`).length -
        1,
      tracks: data.data
        .split(`data-track=`)
        .map((e, index) => trackCreator(e, index))
    });
  });
};

module.exports.search = async (req, res) => {
  // const Response1 = await axios.get(
  //   process.env.SEARCH.replace(process.env.ENGINE, req.body.name)
  // );
  // const Response2 = await axios.get(
  //   process.env.SEARCH1.replace(process.env.ENGINE, req.body.name)
  // );
  const Response3 = await axios.get(
    process.env.SEARCHFULL.replace(process.env.ENGINE, req.body.name)
  );


  let data3 = Response3.data;
  res.status(200).json({
    status: "success",
    results: data3.split("data-norber=").length-1,
    // tracks: data1.data
    //   .split(`data-track=`)
    //   .map((e, index) => trackCreator(e, index)).concat(data2.data.split(`data-track="`).map((el, index) => trackCreator2(el,index))),
     tracks:data3.split("data-norber=").map((el,index)=>trackCreatorSearch(el,index))
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

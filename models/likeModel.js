const mongoose = require("mongoose");

const LikeScema = new mongoose.Schema({
    track:{
        type:String,
        required:true
    },
    like:{
        type:Number,
        default:0
    }
})

const LikeModel = mongoose.model('Like',LikeScema);
module.exports.LikeModel = LikeModel
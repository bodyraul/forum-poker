const mongoose = require('mongoose')

const PhotoSchema = new mongoose.Schema({
    idUser:{type: mongoose.Schema.Types.ObjectId,require:true,ref:"User",},
    image:String
})

const PhotoModel = mongoose.model("photo",PhotoSchema);
module.exports = PhotoModel
/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
const mongoose = require("./connection");

////////////////////////////////////////////////
// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose
const { Schema, model } = mongoose

// make albums schema
const albumsSchema = new Schema({
    name: String,
    artist: String,
    id: String,
    mbid: String,
    // url: 
    releaseDate: Date,
    // img: 
    listeners: Number,
    playCount: Number,

  });

// make album model
const Album = model("Album", albumsSchema)

////////////////////////////////////////////////
// Export model
////////////////////////////////////////////////
module.exports = Album
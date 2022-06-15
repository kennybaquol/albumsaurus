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
  // _id: ObjectId,
  id: Number,
  title: String,
  cover_medium: String,
  cover_big: String,
  genre_id: Number,
  artistID: Number,
  artistName: String,


  mbid: String,
  releaseDate: Date,
  listeners: Number,
  playCount: Number,

});

// make album model
const Album = model("Album", albumsSchema)

////////////////////////////////////////////////
// Export model
////////////////////////////////////////////////
module.exports = Album
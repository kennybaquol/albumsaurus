/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
const mongoose = require("./connection");

////////////////////////////////////////////////
// Our Models
////////////////////////////////////////////////
// pull schema and model from mongoose
const { Schema, model } = mongoose

// Make summaries schema
const summariesSchema = new Schema({
  intYearReleased: Number,
  strStyle: String,
  strGenre: String,
  strLabel: String,
  strAlbumThumbBack: String,
  strDescriptionEN: String,
  strMood: String
});

// Make albums schema
const albumsSchema = new Schema({
  id: Number,
  title: String,
  cover_medium: String,
  cover_big: String,
  genre_id: Number,
  artistID: Number,
  artistName: String,
  summaries: [{ type: summariesSchema }]

});

// make album model
const Album = model("Album", albumsSchema)

////////////////////////////////////////////////
// Export model
////////////////////////////////////////////////
module.exports = Album
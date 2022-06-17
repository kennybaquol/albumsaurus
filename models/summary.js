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
  intYearReleased: String,
  strStyle: String,
  strGenre: String,
  strLabel: String,
  strAlbumThumbBack: String,
  strDescriptionEN: String,
  strMood: String
});

// make album model
const Summary = model("Summary", summariesSchema)

////////////////////////////////////////////////
// Export model
////////////////////////////////////////////////
module.exports = Summary
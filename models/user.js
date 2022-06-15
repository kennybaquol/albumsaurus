//////////////////////////////////////////////
// Import Dependencies
//////////////////////////////////////////////
const { ObjectId } = require("mongodb");
const mongoose = require("./connection");
// const Album = require("./album");

////////////////////////////////////////////////
// Define Model
////////////////////////////////////////////////
// pull schema and model from mongoose
const { Schema, model } = mongoose;

// Make albumsSchema
const albumsSchema = new Schema({
  // _id: ObjectId,
  id: Number,
  title: String,
  cover_medium: String,
  cover_big: String,
  genre_id: Number,
  artistID: Number,
  artistName: String,
  summary: String,

  // mbid: String,
  // releaseDate: Date,
  // listeners: Number,
  // playCount: Number,

});

// make user schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: albumsSchema }]
});

// make fruit model
const User = model("User", userSchema);

///////////////////////////////////////////////////
// Export Model
///////////////////////////////////////////////////
module.exports = User;

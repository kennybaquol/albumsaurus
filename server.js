/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path")
const AlbumRouter = require('./controllers/albums')
const methodOverride = require("method-override");

/////////////////////////////////////////////////
// Create our Express Application Object
/////////////////////////////////////////////////
const app = require("liquid-express-views")(express(), { root: [path.resolve(__dirname, 'views/')] })

/////////////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////////////
app.use(morgan("tiny")) //logging
app.use(express.urlencoded({ extended: true })) // parse urlencoded request bodies
app.use(methodOverride("_method")) // override for put and delete requests from forms
app.use(express.static("public")) // serve files from public statically

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.use('/albums', AlbumRouter) // send all "/albums" routes to album router
app.get("/", (req, res) => {
  res.render('index')
});

//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))
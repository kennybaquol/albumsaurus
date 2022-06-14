/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config(); // Load ENV Variables
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path")
const AlbumRouter = require('./controllers/albums')
const UserRouter = require('./controllers/users')
const methodOverride = require("method-override");
const session = require("express-session")
const MongoStore = require("connect-mongo")

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
// middleware to setup session
app.use(
  session({
    secret: process.env.SECRET,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
    saveUninitialized: true,
    resave: false,
  })
);

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.use('/albums', AlbumRouter) // send all "/albums" routes to album router
app.use('/users', UserRouter) // send all "/users" routes to user router
app.get("/", (req, res) => {
  res.render('index')
});

//////////////////////////////////////////////
// Server Listener
//////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`))
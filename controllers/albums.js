////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Album = require("../models/album");

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

/////////////////////////////////////////
// Routes
/////////////////////////////////////////
// index route
router.get("/", (req, res) => {
    res.render('albums/index')
})

// new route
router.get('/new', (req, res) => {
    res.render('albums/new')
})

// show route
router.get('/:id', (req, res) => {
    res.render('albums/show')
})

// edit route
router.get('/:id/edit', (req, res) => {
    // res.render('albums/show/edit')
})

// create route
router.post('/', (req, res) => {
    res.redirect('albums')
})

// update route
router.put('/:id', (req, res) => {
    res.redirect('albums/:id')
})

// delete route
router.delete('/:id', (req, res) => {
    res.redirect('albums')
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router

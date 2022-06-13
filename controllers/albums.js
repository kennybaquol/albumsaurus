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
    res.render('index')
})

// new route
router.get('/new', (req, res) => {
    res.render('New')
})

// show route
router.get('/:id', (req, res) => {
    res.render('Show')
})

// edit route
router.get('/:id/edit', (req, res) => {
    res.render('Edit')
})

// create route
router.post('/', (req, res) => {
    res.render('Create')
})

// update route
router.put('/:id', (req, res) => {
    res.render('Update')
})

// delete route
router.delete('/:id', (req, res) => {
    res.render('Delete')
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router

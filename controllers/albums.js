////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Album = require("../models/album");
const fetch = require('node-fetch')

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

/////////////////////////////////////////
// Routes
/////////////////////////////////////////
// index route
router.get("/", (req, res) => {
    const zip = req.body.zip
    const key = process.env.LAST_FM_API_KEY
    const requestURL = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${key}&artist=Audioslave&album=Revelations&format=json`
    fetch(requestURL)
        .then((apiResponse) => {
            console.log(apiResponse)
            return apiResponse.json()
        })
        .then((jsonData) => {
            console.log("here is the album data: ", jsonData)
            const albumData = jsonData
            res.render('albums', {albumData})
        })
        .catch((error) => {
            console.log(error)
            res.json({error})
        })
})

// new route
router.get('/new', (req, res) => {
    res.render('albums/new')
})

// show route
router.get('/:id', (req, res) => {
    const id = req.params.id
    const key = process.env.LAST_FM_API_KEY
    const requestURL = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${key}&artist=Audioslave&album=Revelations&format=json`
    fetch(requestURL)
        .then((apiResponse) => {
            console.log(apiResponse)
            return apiResponse.json()
        })
        .then((jsonData) => {
            console.log("here is the album data: ", jsonData)
            const albumData = jsonData
            res.render('albums/show', {albumData})
        })
        .catch((error) => {
            console.log(error)
            res.json({error})
        })
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

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
    const artistURL = `https://api.deezer.com/genre/113/artists`
    fetch(artistURL)
        .then((apiResponse) => {
            // console.log(apiResponse)
            return apiResponse.json()
        })
        .then((jsonData) => {
            const artistData = jsonData.data
            // console.log("here is the data: ", artistData)
            // let currentArtistIndex = -1
            // let currentIndex
            // let numberOfAlbums
            // while (currentArtistIndex < 0) {
            //     numberOfAlbums = 0
            //     currentIndex = Math.floor(Math.random() * artistData.length)
            //     console.log('current index being tried is: ' + currentIndex + ', ' + artistData[currentIndex].name)
            //     for (let i = 0; i < artistData.length; i++) {
            //         console.log('current number of albums: ' + numberOfAlbums)
            //         if (artistData[i].record_type === 'album') {
            //             numberOfAlbums++
            //             if (numberOfAlbums > 3) {
            //                 currentArtistIndex = currentIndex
            //                 break
            //             }
            //         }
            //     }
            //     // if (true) {
            //     //     console.log(currentIndex)
            //     // }
            // }
            let currentArtistIndex = Math.floor(Math.random() * artistData.length)
            const artistId = artistData[currentArtistIndex].id
            const artistName = artistData[currentArtistIndex].name
            console.log(artistName)
            const requestURL = `https://api.deezer.com/artist/${artistId}/albums`
            fetch(requestURL)
                .then((apiResponse) => {
                    // console.log(apiResponse)
                    return apiResponse.json()
                })
                .then((jsonData) => {
                    // const albumData = jsonData.data
                    let temp = []
                    let currentAlbumIndex
                    //until there are 3 values in temp array
                    while (temp.length < 3) {
                        // if the current album is an "album"
                        currentAlbumIndex = Math.floor(Math.random() * jsonData.data.length)
                        console.log('current album index is: ' + currentAlbumIndex)
                        if (jsonData.data[currentAlbumIndex].record_type === 'album') {
                            // add it to the temp array if it's not already in it
                            if (!temp.includes(jsonData.data[currentAlbumIndex])) {
                                temp.push(jsonData.data[currentAlbumIndex])
                                // console.log(temp)
                            }
                        }
                    }
                    console.log(temp.length)
                    const albumData = temp
                    console.log("here is the data: ", albumData[0].record_type)
                    // res.render('albums', {albumData})
                    res.render('albums', {
                        data: albumData,
                        artistName
                    })
                })
                .catch((error) => {
                    console.log(error)
                    res.json({ error })
                })
        })
        .catch((error) => {
            console.log(error)
            res.json({ error })
        })
})

// new route
router.get('/new', (req, res) => {
    res.render('albums/new')
})

// show route
router.get('/:id', (req, res) => {
    const id = req.params.id
    const requestURL = `https://api.deezer.com/album/${id}`
    fetch(requestURL)
        .then((apiResponse) => {
            // console.log(apiResponse)
            return apiResponse.json()
        })
        .then((jsonData) => {
            console.log("here is the album data: ", jsonData)
            const albumData = jsonData
            const key = process.env.LAST_FM_API_KEY
            const artist = albumData.artist.name
            const title = albumData.title
            const requestURL2 = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${key}&artist=${artist}&album=${title}&format=json`
            fetch(requestURL2)
                .then((apiResponse) => {
                    // console.log(apiResponse)
                    return apiResponse.json()
                })
                .then((lfmData) => {
                    // const albumData = jsonData
                    res.render('albums/show', {
                        albumData,
                        summary: lfmData.album.wiki.summary
                    })
                })
                .catch((error) => {
                    console.log(error)
                    res.json({ error })
                })
        })
        .catch((error) => {
            console.log(error)
            res.json({ error })
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

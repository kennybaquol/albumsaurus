////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Album = require("../models/album");
const fetch = require('node-fetch');
const User = require("../models/user");

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

////////////////////////////////////////
// Router Middleware
////////////////////////////////////////
// Authorization Middleware
router.use((req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect("/user/login");
    }
});

/////////////////////////////////////////
// Routes
/////////////////////////////////////////
// index route
router.get("/", (req, res) => {
    const artistURL = `https://api.deezer.com/genre/152/artists`
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
            // console.log(artistName)
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
                        // console.log('current album index is: ' + currentAlbumIndex)
                        if (jsonData.data[currentAlbumIndex].record_type) {
                            // === 'album') {
                            // add it to the temp array if it's not already in it
                            if (!temp.includes(jsonData.data[currentAlbumIndex])) {
                                temp.push(jsonData.data[currentAlbumIndex])
                                // console.log(temp)
                            }
                        }
                    }
                    console.log(temp.length)
                    const albumData = temp
                    // console.log("here is the data: ", albumData[0].record_type)
                    // res.render('albums', {albumData})
                    let favoriteAlbums
                    const currentUsername = req.session.username
                    const currentUser = User.findOne({ name: currentUsername }, (error, user) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            // console.log(user)
                            favoriteAlbums = user.favorites
                            res.render('albums', {
                                data: albumData,
                                artistName,
                                username: req.session.username,
                                favorites: favoriteAlbums
                            })
                        }
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

// create route
router.post('/', (req, res) => {
    console.log('RAN CREATE POST ROUTE')
    const albumId = Math.floor(Math.random() * 9999999)
    Album.create({
        id: albumId,
        title: req.body.title,
        cover_medium: req.body.cover_medium,
        cover_big: req.body.cover_big,
        genre_id: req.body.genre_id,
        artistID: req.body.artistID,
        artistName: req.body.artistName,
    }, (error, album) => {
        if (error) {
            console.log(error)
        }
        else {
            // console.log(album)
            User.updateOne({ name: req.session.username },
                {
                    $addToSet: {
                        favorites: album
                    }
                }, (error, user) => {

                    if (error) {
                        console.log(error)
                    }
                    else {
                        res.redirect('/albums')
                    }
                }
            )
        }
    })
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
                    let summary
                    try {
                        summary = lfmData.album.wiki.summary
                    }
                    catch (error) {
                    }
                    res.render('albums/show', {
                        album: albumData,
                        summary
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
    console.log('RAN EDIT ROUTE')
    const albumId = req.params.id
    User.findOne({ name: req.session.username }, (error, user) => {
        if (error) {
            console.log(error)
        }
        else {
            let currentAlbum
            for (let i = 0; i < user.favorites.length; i++) {
                if (user.favorites[i].id == albumId) {
                    currentAlbum = user.favorites[i]
                    break
                }
            }
            // console.log(currentAlbum)
            res.render(`albums/edit`, {
                currentAlbum
            })
        }
    })
})

// Favorite route
router.post('/:id/favorite', (req, res) => {
    // console.log(req.body)
    // console.log(req.session.username)
    // const currentUser = req.session.username
    // console.log(req.session.favorites)
    User.updateOne({ name: req.session.username },
        {
            $addToSet: {
                favorites: req.body
            }
        }, (error, user) => {

            if (error) {
                console.log(error)
            }
            else {
                // console.log(User.find({ name: req.session.username }))
                res.redirect('/albums')
            }
        }
    )
})

// update route
router.put('/:id', (req, res) => {
    const albumId = req.params.id
    console.log('RAN UPDATE PUT ROUTE')
    User.updateOne({
        name: req.session.username, 
        'favorites.id' : albumId
    },
        {
            $set: {
                'favorites.$' : req.body
            }
        }, (error, user) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log("UPDATED UPDATED UPDATED")
                res.redirect(`/albums/${albumId}/edit`)
            }
        }
    )
})

// delete route
router.delete('/:id', (req, res) => {
    const albumId = req.params.id
    console.log('RAN DELETE POST ROUTE')
    User.updateOne({ name: req.session.username },
        {
            $pull: {
                favorites: {
                    id: albumId
                }
            }
        }, (error, user) => {
            if (error) {
                console.log(error)
            }
            else {
                console.log(user.favorites)
                res.redirect('/albums')
            }
        }
    )
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router

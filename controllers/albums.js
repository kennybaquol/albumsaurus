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
// Index route
router.get("/", (req, res) => {
    // Determine artist
    const artistId = Math.floor(Math.random() * 300) + 1
    const artistURL = `https://api.deezer.com/artist/${artistId}`

    // Fetch data on all artists from selected genre
    fetch(artistURL)
        .then((apiResponse) => {
            return apiResponse.json()
        })
        .then((artistData) => {
            const albumsURL = `https://api.deezer.com/artist/${artistId}/albums`

            // Fetch data on all albums from selected artist
            fetch(albumsURL)
                .then((apiResponse) => {
                    return apiResponse.json()
                })
                .then((jsonData) => {
                    const albumsData = jsonData.data
                    let currentAlbumIndex
                    let selectedAlbums = []
                    console.log('current index/artist being tried is: ' + artistId + ', ' + artistData.name)

                    // For up to 50 times,
                    for (let i = 0; i < 50; i++) {
                        // console.log('current number of albums: ' + selectedAlbums.length)
                        currentAlbumIndex = Math.floor(Math.random() * albumsData.length)
                        // console.log('current release being tried: ' + albumsData[currentAlbumIndex].record_type + ', ' + albumsData[currentAlbumIndex].title)

                        // Add the current release to selectedAlbums if the release is type 'album'
                        // and hasn't already been selected
                        if (albumsData[currentAlbumIndex].record_type === 'album') {
                            if (!selectedAlbums.includes(albumsData[currentAlbumIndex])) {
                                selectedAlbums.push(albumsData[currentAlbumIndex])
                            }
                            if (selectedAlbums.length > 2) {
                                break
                            }
                        }
                    }

                    let favoriteAlbums
                    User.findOne({ name: req.session.username }, (error, user) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            favoriteAlbums = user.favorites
                            res.render('albums', {
                                data: selectedAlbums,
                                // artistName,
                                username: req.session.username,
                                favorites: favoriteAlbums
                            })
                        }
                    })
                })
        })
        .catch((error) => {
            console.log(error)
            res.json({ error })
        })
        .catch((error) => {
            console.log(error)
            res.json({ error })
        })
})

// New route
router.get('/new', (req, res) => {
    res.render('albums/new')
})

// Create route
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

// Show route
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

// Edit route
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

// Update route
router.put('/:id', (req, res) => {
    const albumId = req.params.id
    console.log('RAN UPDATE PUT ROUTE')
    User.updateOne({
        name: req.session.username,
        'favorites.id': albumId
    },
        {
            $set: {
                'favorites.$': req.body
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

// Delete route
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

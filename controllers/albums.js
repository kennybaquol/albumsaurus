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
    // Determine genre
    const artistURL = `https://api.deezer.com/genre/152/artists`

    // Fetch data on all artists from selected genre
    fetch(artistURL)
        .then((apiResponse) => {
            return apiResponse.json()
        })
        .then((jsd) => {
            const artistsData = jsd.data
            // Determine artist
            const artistId = 9
            const artistName = 'Coldplay'
            const requestURL = `https://api.deezer.com/artist/${artistId}/albums`

            // setTimeout(() => {

            // }, 1000);

            // Fetch data on all albums from selected artist
            fetch(requestURL)
                .then((apiResponse) => {
                    return apiResponse.json()
                })
                .then((jsonData) => {
                    const albumsData = jsonData.data
                    console.log("here is the albums data: ", albumsData)


                    let currentArtistIndex = -1
                    let temp2
                    let numberOfAlbums
                    let temp = []

                    // While an artist hasn't yet been selected
                    // while (currentArtistIndex < 0) {
                    numberOfAlbums = 0
                    temp2 = Math.floor(Math.random() * albumsData.length)

                    temp2 = artistId

                    console.log('current index being tried is: ' + temp2 + ', ' + artistsData[temp2].name)
                    for (let i = 0; i < 50; i++) {
                        console.log('current number of albums: ' + numberOfAlbums)
                        console.log('current release being tried: ' + albumsData[i].record_type + ', ' + albumsData[i].title)
                        if (albumsData[i].record_type === 'album') {
                            numberOfAlbums++
                            if (!temp.includes(albumsData[i])) {
                                temp.push(albumsData[i])
                            }
                            if (numberOfAlbums > 2) {
                                currentArtistIndex = temp2
                                break
                            }
                        }
                    }



                    // const albumData = albumsData.data
                    // let temp = []
                    // let currentAlbumIndex
                    //until there are 3 values in temp array
                    // while (temp.length < 3) {
                    // if the current album is an "album"
                    // currentAlbumIndex = Math.floor(Math.random() * albumsData.length)
                    // console.log('current album index is: ' + currentAlbumIndex)
                    // if (albumsData.data[currentAlbumIndex].record_type) {
                        // === 'album') {
                        // add it to the temp array if it's not already in it
                        // if (!temp.includes(albumsData.data[currentAlbumIndex])) {
                            // temp.push(albumsData.data[currentAlbumIndex])
                            // console.log(temp)
                    //     }
                    // }
                    // }
                    console.log(temp.length)
                    const albumData = temp
                    // console.log("here is the data: ", albumData[0].record_type)
                    // res.render('albums', {albumData})
                    let favoriteAlbums
                    const currentUser = User.findOne({ name: req.session.username }, (error, user) => {
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

////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const Album = require("../models/album");
const fetch = require('node-fetch');
const User = require("../models/user");
const Summary = require("../models/summary");

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
    const artistId = Math.floor(Math.random() * 250) + 1
    const artistURL = `https://api.deezer.com/artist/${artistId}`

    // Fetch data on all artists from selected genre
    fetch(artistURL)
        .then((apiResponse) => {
            return apiResponse.json()
        })
        .then((artistData) => {
            if (!artistData.nb_album && artistData.nb_album >= 8) {
                console.log('EXISTS EXISTS EXISTS')
                setTimeout(() => {
                    res.redirect('albums')
                }, 1000)
            }
            else {
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
                            // Choose an album at random, and
                            currentAlbumIndex = Math.floor(Math.random() * albumsData.length)

                            // Add the current release to selectedAlbums if the release is type 'album'
                            // and hasn't already been selected
                            if (albumsData[currentAlbumIndex]) {
                                console.log('Album exists!')
                                if (albumsData[currentAlbumIndex].record_type === 'album') {
                                    if (!selectedAlbums.includes(albumsData[currentAlbumIndex])) {
                                        selectedAlbums.push(albumsData[currentAlbumIndex])
                                    }
                                    if (selectedAlbums.length > 2) {
                                        break
                                    }
                                }
                            }
                        }

                        // Render the index page with the selected random albums, as well as the user's favorite albums
                        let favoriteAlbums
                        User.findOne({ name: req.session.username }, (error, user) => {
                            if (error) {
                                console.log(error)
                            }
                            else {
                                favoriteAlbums = user.favorites
                                res.render('albums', {
                                    data: selectedAlbums,
                                    username: req.session.username,
                                    favorites: favoriteAlbums
                                })
                            }
                        })
                    })
            }
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
    // Using a randomly-generated ID, create an Album with user-provided info
    const albumId = Math.floor(Math.random() * 9999999)
    Summary.create({
        intYearReleased: req.body.intYearReleased,
        strStyle: req.body.strStyle,
        strGenre: req.body.strGenre,
        strLabel: req.body.strLabel,
        strAlbumThumbBack: req.body.strAlbumThumbBack,
        strDescriptionEN: req.body.strDescriptionEN,
        strMood: req.body.strMood
    }, (error, summary) => {
        Album.create({
            id: albumId,
            title: req.body.title,
            cover_medium: req.body.cover_medium,
            cover_big: req.body.cover_big,
            genre_id: req.body.genre_id,
            artistID: req.body.artistID,
            artistName: req.body.artistName,
            summaries: summary
        }, (error, album) => {
            if (error) {
                console.log(error)
            }
            else {
                // Render the index page with the newly-generated album included in My Favorites
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
        if (error) {
            console.log(error)
        }
        else {

        }
    })
})

// Show route
router.get('/:id', (req, res) => {
    // Display the current album's picture and details using an API fetch from 2 different API sources
    const id = req.params.id
    const deezerURL = `https://api.deezer.com/album/${id}`
    fetch(deezerURL)
        .then((apiResponse) => {
            return apiResponse.json()
        })
        .then((deezerAlbumData) => {
            const albumData = deezerAlbumData
            const key = process.env.LAST_FM_API_KEY
            let artistName = albumData.artist.name
            let artistId
            const title = albumData.title
            const artistData = `https://www.theaudiodb.com/api/v1/json/2/search.php?s=${artistName}`
            fetch(artistData)
                .then((apiResponse) => {
                    return apiResponse.json()
                })
                .then((artistData) => {
                    // If the Deezer API-selected artist exists on the AudioDB API,
                    if (artistData.artists) {
                        artistId = artistData.artists[0].idArtist
                        console.log(artistId)
                        const dbData = `https://theaudiodb.com/api/v1/json/2/album.php?i=${artistId}`
                        let summary = []
                        fetch(dbData)
                            .then((apiResponse) => {
                                return apiResponse.json()
                            })
                            .then((dbData) => {
                                // find the current album by album title (by parsing through their discography)
                                for (let i = 0; i < dbData.album.length; i++) {
                                    if (dbData.album[i].strAlbum === deezerAlbumData.title) {
                                        description = dbData.album[i].strDescriptionEN
                                        summary.push(dbData.album[i].intYearReleased)
                                        summary.push(dbData.album[i].strStyle)
                                        summary.push(dbData.album[i].strGenre)
                                        summary.push(dbData.album[i].strLabel)
                                        summary.push(dbData.album[i].strAlbumThumbBack)
                                        summary.push(dbData.album[i].strDescriptionEN)
                                        summary.push(dbData.album[i].strMood)
                                        break
                                    }
                                }

                            })
                            .then((dbData) => {
                                // Render the current album's picture and info on the show page
                                res.render('albums/show', {
                                    album: albumData,
                                    summary
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
                    }
                    // If the album doesn't exist on the AudioDB API, redirect to the index page to start the process over
                    else {
                        res.redirect('/albums')
                    }
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
            // Render the "My Favorites" version of the show page
            res.render(`albums/edit`, {
                currentAlbum,
                summary: currentAlbum.summaries[0]
            })
        }
    })
})

// Favorite route
router.post('/:id/favorite', (req, res) => {
    // After the "Submit Changes" button has been pressed,
    // update the "My Favorites" version of the album's info
    Summary.create({
        intYearReleased: req.body.intYearReleased,
        strStyle: req.body.strStyle,
        strGenre: req.body.strGenre,
        strLabel: req.body.strLabel,
        strAlbumThumbBack: req.body.strAlbumThumbBack,
        strDescriptionEN: req.body.strDescriptionEN,
        strMood: req.body.strMood
    }, (error, summary) => {
        if (error) {
            console.log(error)
        }
        else {
            Album.create({
                id: req.body.id,
                title: req.body.title,
                cover_medium: req.body.cover_medium,
                cover_big: req.body.cover_big,
                genre_id: req.body.genre_id,
                artistID: req.body.artistID,
                artistName: req.body.artistName,
                summaries: summary
            }, (error, album) => {
                if (error) {
                    console.log(error)
                }
                else {
                    User.updateOne({ name: req.session.username },
                        {
                            $addToSet: {
                                favorites: album
                            }
                        }, (error, user) => {

                            if (error) {
                                console.log(error)
                            }
                            // Redirect to the index page, displaying the newly-added album under the user's favorites
                            else {
                                res.redirect('/albums')
                            }
                        }
                    )
                }
            })
        }
    })

})

// Update route
router.put('/:id', (req, res) => {
    const albumId = req.params.id
    console.log('RAN UPDATE PUT ROUTE')
    Summary.create({
        intYearReleased: req.body.intYearReleased,
        strStyle: req.body.strStyle,
        strGenre: req.body.strGenre,
        strLabel: req.body.strLabel,
        strAlbumThumbBack: req.body.strAlbumThumbBack,
        strDescriptionEN: req.body.strDescriptionEN,
        strMood: req.body.strMood
    }, (error, summary) => {
        if (error) {
            console.log(error)
        }
        else {
            console.log('SUMMARY IS: ' + summary)
            User.updateOne({
                name: req.session.username,
                'favorites.id': albumId
            },
                {
                    $set: {
                        'favorites.$.title': req.body.title,
                        'favorites.$.cover_medium': req.body.cover_medium,
                        'favorites.$.cover_big': req.body.cover_big,
                        'favorites.$.genre_id': req.body.genre_id,
                        'favorites.$.artistID': req.body.artistID,
                        'favorites.$.artistName': req.body.artistName,
                        'favorites.$.summaries': summary

                    }
                }, (error, user) => {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        res.redirect(`/albums/${albumId}/edit`)
                    }
                }
            )
        }
    })
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
                res.redirect('/albums')
            }
        }
    )
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router

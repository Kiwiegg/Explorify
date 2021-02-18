var express = require('express');
var SpotifyWebApi = require('spotify-web-api-node');
var router = express.Router();

var login = require('../controllers/login');
var auth = require('../controllers/auth');

router.get("/login", login.get);
router.get("/callback", auth.get);

router.get("/toptracks", (req, res) => {
    var access_token = req.query.accesstoken;

    if (!access_token) {
        res.status(400).send("Bad Request");
        return;
    }

    var spotifyApi = new SpotifyWebApi({
        accessToken: access_token
    });

    spotifyApi.getMyTopTracks({ limit: 20, time_range: 'medium_term' }).then(data => {
        let topArtists = data.body.items;
        res.send(topArtists);
    }, err => {
        console.log('Something went wrong!', err);
    });
});

router.get("/getTrack", (req, res) => {
    var access_token = req.query.accesstoken;
    var id = req.query.id;

    if (!access_token) {
        res.status(400).send("Bad Request");
        return;
    }

    var spotifyApi = new SpotifyWebApi({
        accessToken: access_token
    });

    spotifyApi.getTrack(id).then(data => {
        res.send(data.body);
    }, err => {
        console.log('Something went wrong!', err);
    });
});

module.exports = router;
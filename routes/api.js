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

    spotifyApi.getMyTopTracks({ limit: 30, time_range: 'medium_term' }).then(data => {
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

router.get("/getRec", (req, res) => {
    var access_token = req.query.accesstoken;
    var songlist = req.query.list.split("_");
    var num = req.query.num;

    if (!access_token) {
        res.status(400).send("Bad Request");
        return;
    }

    var spotifyApi = new SpotifyWebApi({
        accessToken: access_token
    });

    var total_limit;
    if (num) {
        total_limit = parseInt(num, 10);
    } else {
        total_limit = 30;
    }
    var current_limit = total_limit;
    var chunks = Math.ceil(songlist.length / 5);

    var recommendations = [];

    for (i = 0; i < songlist.length; i += 5) {
        templist = songlist.slice(i, Math.min(i + 5, songlist.length));
        spotifyApi.getRecommendations({ seed_tracks: templist, limit: Math.min(current_limit, Math.ceil(total_limit / chunks)) }).then(data => {
            data.body.tracks.forEach((track) => {
                recommendations.push(track);
                if (recommendations.length == total_limit) {
                    res.send(recommendations);
                    return;
                }
            });
        }, err => {
            console.log('Something went wrong!', err);
        });
        current_limit = Math.max(0, current_limit - Math.ceil(total_limit / chunks));
    }
});

router.get("/savePlaylist", (req, res) => {
    var access_token = req.query.accesstoken;
    var songlist = req.query.list.split("_");
    var name = req.query.name;

    if (!access_token) {
        res.status(400).send("Bad Request");
        return;
    }

    var spotifyApi = new SpotifyWebApi({
        accessToken: access_token
    });

    var playlist = null;
    spotifyApi.createPlaylist(name).then(data => {
        playlist = data.body;
        songlist.forEach((element, i) => {
            songlist[i] = "spotify:track:" + element;
        });
        spotifyApi.addTracksToPlaylist(playlist.id, songlist).then(data => {
            res.send(playlist);
        }, err => {
            console.log('Something went wrong!', err);
        });
    }, err => {
        console.log('welp!', err);
    });
});

module.exports = router;


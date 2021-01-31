// server.js
var express = require("express");
var qs = require("querystring");
var cookie = require("cookie-parser");

var config = require("./config.js");
var clientId = config.clientId;
var clientSecret = config.clientSecret;
var redirect_uri = config.redirect_uri;

var SpotifyWebApi = require("spotify-web-api-node");

//initiating spotify API wrapper
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirect_uri
});

//scopes for authorization
var scopes = ["playlist-modify-public"];

//A funcion that generates a random string of desired length
var generateRandomString = function(length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

var app = express();
app.use(express.static("public")).use(cookie());

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/explore", (request, response) => {
  response.sendFile(__dirname + "/views/explore.html");
});

app.get("/login", function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      qs.stringify({
        client_id: clientId,
        response_type: "code",
        scope: scopes.join(" "),
        redirect_uri: redirect_uri,
        state: state,
        show_dialog: true
      })
  );
});

app.get("/callback", function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        qs.stringify({
          error: "state_mismatch"
        })
    );
  } else {
    res.clearCookie(stateKey);
    spotifyApi.authorizationCodeGrant(code).then(
      function(data) {
        console.log("The token expires in " + data.body["expires_in"]);
        console.log("The access token is " + data.body["access_token"]);
        console.log("The refresh token is " + data.body["refresh_token"]);

        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body["access_token"]);
        spotifyApi.setRefreshToken(data.body["refresh_token"]);

        res.redirect("/explore");
      },
      function(err) {
        console.log("Something went wrong!", err);
        res.redirect("/");
      }
    );
  }
});

// returns the list of genres
app.get("/rec/genres", function(req, res) {
  spotifyApi.getAvailableGenreSeeds().then(
    data => {
      res.send(data.body.genres);
    },
    err => {
      console.log(err);
    }
  );
});

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + 3000);
});

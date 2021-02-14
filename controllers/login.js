var qs = require('querystring');

var config = require("../config.js");
var clientId = config.clientId;
var redirect_uri = config.redirect_uri;

//scopes for authorization
var scopes = ["playlist-modify-public", "user-top-read"];

exports.get = (req, res) => {
    var stateKey = "spotify_auth_state";
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    res.redirect("https://accounts.spotify.com/authorize?" +
    qs.stringify({
        client_id: clientId,
        response_type: "code",
        scope: scopes.join(" "),
        redirect_uri: redirect_uri,
        state: state,
        show_dialog: true
      })
  );
}

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
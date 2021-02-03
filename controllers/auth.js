var qs = require('querystring');
var request = require("request");

var config = require("../config.js");
var clientId = config.clientId;
var clientSecret = config.clientSecret;
var redirect_uri = config.redirect_uri;

exports.get = (req, res) => {
    var code = req.query.code || null;
    var state = req.query.state || null;
    var stateKey = 'spotify_auth_state';
    var storedState = req.cookies ? req.cookies[stateKey] : null;
  
    if (state === null || state !== storedState) {
      res.redirect(
        "/#" +
          qs.stringify({
            error: "state_mismatch"
          })
      );
    } else {
        var authOptions = getAuthOptionsCallback(code, redirect_uri, clientId, clientSecret);
        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var access_token = body.access_token;
                var refresh_token = body.refresh_token;

                // send tokens to client
                res.redirect('/explore?' +
                    qs.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/explore/#' +
                    qs.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
}

var getAuthOptionsCallback = function (code, redirect_uri, client_id, client_secret) {
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };
    return authOptions;
};
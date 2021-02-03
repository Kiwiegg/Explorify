// server.js
var express = require("express");
var cookie = require("cookie-parser");

var app = express();
app.use(express.static("public")).use(cookie());

var api = require("./routes/api.js");
app.use("/api", api);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/explore", (req, res) => {
  console.log("the access token is " + req.query.access_token);
  res.sendFile(__dirname + "/views/explore.html");
});
;
// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + 3000);
});

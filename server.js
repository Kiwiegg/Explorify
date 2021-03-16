// server.js
var express = require("express");
var cookie = require("cookie-parser");

var app = express();
app.use(express.static("src"));
app.use(express.static("public")).use(cookie());

var api = require("./routes/api.js");
app.use("/api", api);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/views/about.html");
});

app.get("/explore", (req, res) => {
  res.sendFile(__dirname + "/views/explore.html");
});

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + 3000);
});

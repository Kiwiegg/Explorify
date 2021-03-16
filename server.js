// server.js
var express = require("express");
var cookie = require("cookie-parser");

var app = express();
app.use(express.static(__dirname + "/src"));
app.use(express.static(__dirname + "/public")).use(cookie());

var PORT = process.env.PORT || 3000;

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
const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + PORT);
}); 

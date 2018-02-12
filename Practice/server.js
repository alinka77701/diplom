var express = require('express');
var app = express();
var path = require('path');
var proxy = require('express-http-proxy');
var orm = require("orm");
const Sequelize = require('sequelize');
app.use('/proxy', proxy('82.179.88.27:8280'));
app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen('7777', function () {
    console.log('Listening on port 7777.');
});
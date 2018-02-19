var express = require('express');
var app = express();
var path = require('path');
var proxy = require('express-http-proxy');
const Sequelize = require('sequelize');
const model = require('./public/js/models');
//const sequelize = new
// Sequelize('postgres://'+global.config['db-user']+':'+global.config['db-password']+'@'+global.config['db-host']+':'+global.config['port']+'/'+global.config['db-name']);

const sequelize = new Sequelize(
    'postgres://practdist:972979ss@82.179.88.27:5432/practdistdb');
sequelize.authenticate()
.then(() => {
  console.log('Database connection established.');
})
.catch((error) => {
  console.log(error);
  process.exit();
});

app.use('/proxy', proxy('82.179.88.27:8280'));

app.use(express.static("public"));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/lalala', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen('7777', function () {
  console.log('Listening on port 7777.');
});

async function getDataFromTable(table) {
  let answer = await table.findAll({
    attributes: [
      'id_type_practice',
      'name_type_practice'
    ]
  });
  let data = [];
  for (let i = 0; i < answer.length; ++i) {
    data.push(answer[i].name);
  }
  console.log(data);
}
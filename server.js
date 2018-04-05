var express = require('express');
var app = express();
var path = require('path');
var proxy = require('express-http-proxy');
var bodyParser = require('body-parser');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const model = require('./public/db/models');
const query=require('./public/db/Query');


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

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({extended: true}));
app.use('/proxy', proxy('82.179.88.27:8280'));
app.use(express.static("public"));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/types-organisation',async function (req, res) {
  let data =  await query.getDataFromTable(model.Type_organisation);
  res.send(data);
});

app.get('/type-practices',async function (req, res) {
  let data =  await query.getDataFromTable(model.Type_practice);
  res.send(data);
});

app.get('/statuses',async function (req, res) {
  let data =  await query.getDataFromTable(model.Status);
  res.send(data);
});

app.get('/organisations',async function (req, res) {
  let data =  await query.getOrganisations();
  res.send(data);
});

app.post('/organisation', async (req, res) => {
  await query.addOrUpdateOrganisation(req.body);
  res.json('done');
});

app.post('/students', async (req, res) => {
  await query.addOrUpdateStudents(req.body);
  res.json('done');
});

app.post('/practice', async (req, res) => {
  await query.createPractice(req.body);
  await query.createPracticeOrganisation(req.body);
  await query.createPracticeGroup(req.body);
  await query.createRequests(req.body);
  res.json('done');
});

app.listen('7777', function () {
  console.log('Listening on port 7777.');
});



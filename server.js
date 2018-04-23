var express = require('express');
var app = express();
var path = require('path');
var proxy = require('express-http-proxy');
var bodyParser = require('body-parser');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const model = require('./public/db/models');
const query = require('./public/db/Query');


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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/proxy', proxy('82.179.88.27:8280'));
app.use(express.static("public"));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/types-organisation', async function (req, res) {
    let data = await query.getDataFromTable(model.Type_organisation);
    res.send(data);
});

app.get('/type-practices', async function (req, res) {
    let data = await query.getDataFromTable(model.Type_practice);
    res.send(data);
});

app.get('/statuses', async function (req, res) {
    let data = await query.getDataFromTable(model.Status);
    res.send(data);
});

app.get('/organisations', async function (req, res) {
    let data = await query.getOrganisations();
    res.send(data);
});

app.get('/practice/', async function (req, res) {
    let data = await query.getPractice(req);
    res.send(data);
});

app.get('/filter-requsts/', async function (req, res) {
    let data = await query.getDeterminedRequests(req);
    res.send(data);
});

app.get('/organisations-by-request/', async function (req, res) {
    let data = await query.getOrganisationByRequestId(req);
    res.send(data);
});

app.post('/organisation-create', async (req, res) => {
    await query.addOrganisation(req.body);
    res.json('done');
});

app.post('/organisation-update', async (req, res) => {
    await query.updateOrganisation(req.body);
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

app.get('/organisations-by-practice/', async function (req, res) {
    let data = await query.getOrganisationsByPracticeId(req);
    res.send(data);
});

app.get('/organisation-by-name/', async function (req, res) {
    let data = await query.getOrganisationByName(req.query.name);
    res.send(data);
});

app.get('/organisation-by-id/', async function (req, res) {
    let data = await query.getOrganisationById(req.query.id);
    res.send(data);
});

app.get('/requests-by-practice/', async function (req, res) {
    let data = await query.getRequestsByPracticeId(req);
    res.send(data);
});
app.get('/requst-by-student-uid/', async function (req, res) {
    let data = await query.getRequestsByStudentsUIDS(req);
    res.send(data);
});

app.get('/years-practice',async function (req, res) {
  let data =  await query.getPracticeYears();
  res.send(data);
});

app.get('/exist-request/', async function (req, res) {
    let data = await query.getRequestOrganisation(req);
    if (data == null) {
        res.statusCode = "404";
        return res.json({
            errors: ['Not found']
        });
    }
    else {
        res.send(data);
    }
});

app.get('/update-request-organisation-approve/', async function (req, res) {
    let data = await query.approveRequestOrganisation(req);
    res.send(data);
});

app.get('/insert-request-organisation/', async function (req, res) {
    let data = await query.insertRequestOrganisation(req);
    res.send(data);
});

app.get('/update-request-organisation-reject/', async function (req, res) {
    let data = await query.rejectRequestOrganisation(req);
    res.send(data);
});

app.get('/update-request/', async function (req, res) {
    let data = await query.updateRequest(req);
    res.send(data);
});

app.listen('7777', function () {
    console.log('Listening on port 7777.');
});



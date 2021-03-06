var express = require('express');
var app = express();
var path = require('path');
var proxy = require('express-http-proxy');
var bodyParser = require('body-parser');

let JSZip = require('jszip');
let Docxtemplater = require('docxtemplater');
let fs = require('fs');

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
//app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));

/*
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
*/

app.get('/student-cabinet/', async function (req, res) {
    res.render('index');
});


app.get('/user-cabinet/', async function (req, res) {
    if(req.query.userType==="Преподаватель"){
       // res.sendFile(path.join(__dirname + '/public/student_cabinet.html'));
        res.redirect('student_cabinet');
     //   res.redirect(path.join(__dirname + '/public/student_cabinet.html'));
        console.log("student");
    }
   else {
        res.redirect('/student_cabinet.html');
        console.log("teacher");
    }
    return true;
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

app.get('/requsts-by-student-practice/', async function (req, res) {
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

app.get('/years-practice', async function (req, res) {
    let data = await query.getPracticeYears();
    res.send(data);
});

app.get('/exist-request/', async function (req, res) {
    let data = await query.getRequestOrganisation(req);
    if (data === null) {
        res.json('Not found');
    }
    else {
        res.send(data);
    }
});

app.get('/insert-request-organisation/', async function (req, res) {
    let data = await query.insertRequestOrganisation(req);
    res.send(data);
});

app.get('/update-request-organisation/', async function (req, res) {
    let data = await query.updateRequestOrganisation(req);
    res.send(data);
});

app.get('/update-request-organisation-by-request/', async function (req, res) {
    let data = await query.updateRequestOrganisationByRequest(req);
    res.send(data);
});

app.get('/groups-by-practice-id/', async function (req, res) {
    let data = await query.getGroupsByPracticeId(req);
    res.send(data);
});

app.get('/update-request/', async function (req, res) {
    let data = await query.updateRequest(req);
    res.send(data);
});

app.listen('7777', function () {
    console.log('Listening on port 7777.');
});


app.post('/document/', async (req, res) => {
    let content = 0;
    if (req.body.type_document === "Приказ") {
        if (req.body.type_practice === "учебная") {
            content = fs.readFileSync(path.resolve(__dirname, 'public/assets/templates/educational.docx'), 'binary');
        }
        else if (req.body.type_practice === "производственная") {
            content = fs.readFileSync(path.resolve(__dirname, 'public/assets/templates/production.docx'), 'binary');
        }
        /* else if (req.body.type_practice === "преддипломная") {
             content = fs.readFileSync(path.resolve(__dirname, 'public/assets/templates/preddiploma.docx'), 'binary');
         }*/
    }
    else {
        content = fs.readFileSync(path.resolve(__dirname, 'public/assets/templates/report.docx'), 'binary');
    }
    let zip = new JSZip(content);
    let doc = new Docxtemplater();
    doc.loadZip(zip);
    doc.setData(req.body.data);
    try {
        doc.render();
    }
    catch (error) {
        let e = {
            message: error.message,
            name: error.name,
            stack: error.stack,
            properties: error.properties,
        };
        console.log(JSON.stringify({error: e}));
        throw error;
    }

    let buf = doc.getZip().generate({type: 'nodebuffer'});
    let type_practice = req.body.type_practice;
    type_practice = type_practice.replaceAt(type_practice.length - 1, "я");
    type_practice = type_practice.replaceAt(type_practice.length - 2, "а");
    fs.writeFileSync(path.resolve(__dirname, 'сгенерированные_документы/' + req.body.type_document + '/' + type_practice + '/' + req.body.data.group_name + '.docx'), buf);
    let filePath = path.join(__dirname, 'сгенерированные_документы/' + req.body.type_document + '/' + type_practice + '/' + req.body.data.group_name + '.docx');
    let stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': ' application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Length': stat.size
    });
    fs.createReadStream(filePath).pipe(res);
});

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};
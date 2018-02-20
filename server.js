var express = require('express');
var app = express();
var path = require('path');
var proxy = require('express-http-proxy');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
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

app.get('/types-organisation',async function (req, res) {
  let data =  await getDataFromTable(model.Type_organisation);
  res.send(data);
});

app.get('/type-practices',async function (req, res) {
  let data =  await getDataFromTable(model.Type_practice);
  res.send(data);
});

app.get('/statuses',async function (req, res) {
  let data =  await getDataFromTable(model.Status);
  res.send(data);
});

app.get('/organisations',async function (req, res) {
  let data =  await getOrganisations();
  res.send(data);
});

app.listen('7777', function () {
  console.log('Listening on port 7777.');
});

defineAssociations();
async function getDataFromTable(table) {
  let answer = await table.findAll({
    attributes: [
      'id',
      'name'
    ]
  });
  let data = [];
  for (let i = 0; i < answer.length; ++i) {
    data.push( {
      'id': answer[i].dataValues.id,
      'name': answer[i].dataValues.name
    });
  }
  return data;
}

async function getOrganisations() {
  let objReqBody = {
    attributes: [
      'id_organisation',
      'name_organisation',
      'id_type_organisation'],
    include: [{
      attributes: ['name'],
      model: model.Type_organisation,
      required: true
    }]
  };
  let organisations;
  organisations = await model.Organisation.findAll(objReqBody);

  let data = [];
  for (let i = 0; i < organisations.length; ++i) {
    data.push( {
      'id_organisation': organisations[i].dataValues.id_organisation,
      'name_organisation': organisations[i].dataValues.name_organisation,
      'id_type_organisation': organisations[i].dataValues. id_type_organisation
    });
  }
  return data;
  console.log(data);
}


function defineAssociations() {
  model.Organisation.belongsTo(model.Type_organisation, { foreignKey: 'id_type_organisation', targetKey: 'id' });
}
/*
SELECT "Organisation"."id_organisation", "Organisation"."name_organisation", "Type_organisation"."id", "Type_organisation"."name"  FROM "Organisations"  AS "Organisation",
    "Types_organisation" AS "Type_organisation" WHERE "Organisation"."id_type_organisation"="Type_organisation"."id";
*/


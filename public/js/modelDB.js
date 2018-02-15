const model = require('./models');
const Sequelize = require('sequelize');

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
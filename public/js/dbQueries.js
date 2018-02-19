const model = require('./models');

class Query {

  constructor() {
  }

  async getDataFromTable(table) {
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
}
module.exports = Query;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const model = require('./models');

class Query {
  async getDataFromTable(table) {
    let answer = await
        table.findAll({
          attributes: [
            'id',
            'name'
          ]
        });
    let data = [];
    for (let i = 0; i < answer.length; ++i) {
      data.push({
        'id': answer[i].dataValues.id,
        'name': answer[i].dataValues.name
      });
    }
    return data;
  }

  async getOrganisations() {
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
    organisations = await
        model.Organisation.findAll(objReqBody);

    let data = [];
    for (let i = 0; i < organisations.length; ++i) {
      data.push({
        'id_organisation': organisations[i].dataValues.id_organisation,
        'name_organisation': organisations[i].dataValues.name_organisation,
        'id_type_organisation': organisations[i].dataValues.id_type_organisation
      });
    }
    return data;
  }

  async addOrUpdateOrganisation(req) {
    let queryObj = {
      name_organisation: req.name,
      email_organisation: req.emailOrg,
      phone_organisation: req.phoneOrg,
      info_organisation: req.infoOrg,
      address_organisation: req.addressOrg,
      max_students_number: req.placesOrg,
      login_organisation: req.loginOrg,
      pswd_organisation: req.pswdOrg,
      id_type_organisation: await this.checkExistTypeOrganisation(req.typeOrg)
    };
    let id_org = await model.Organisation.findOne({
      arguments: [
        'id_organisation'
      ],
      where: {
        name_organisation: req.name
      }
    });
    if (id_org) {
      queryObj.id_organisation = id_org.dataValues.id_organisation;
    }
    await model.Organisation.upsert(queryObj);
  }

  async checkExistTypeOrganisation(name) {
    let id;
    try {
      id = await model.Type_organisation.findOne({
        arguments: [
          'id'
        ],
        where: {
          name: name
        }
      });
      id = id.dataValues.id;
    }
    catch (err) {
      id = await this.addOrUpdateOrganisation(name);
    }
    return id;
  }

  async createPractice(req) {
    console.log(req);
    let queryObj = {
      id_type_practice: await this.checkExistTypePractice(req.typePractice),
      start_date_practice: req.startDatePractice,
      end_date_practice: req.endDatePractice,
      deadline_practice: req.deadlinePractice,
      lections_number: req.lecNum,
      edu_level: req.eduLevel
    };

    await model.Practice.upsert(queryObj);
  }

  async checkExistTypePractice(name) {
    let id;
    try {
      id = await model.Type_practice.findOne({
        arguments: [
          'id'
        ],
        where: {
          name: name
        }
      });
      id = id.dataValues.id;
    }
    catch (err) {
      id = await this.createPractice(name);
    }
    return id;
  }

  defineAssociations() {
    model.Organisation.belongsTo(model.Type_organisation,
        {foreignKey: 'id_type_organisation', targetKey: 'id'});
  }
}

var query = new Query();
query.defineAssociations();

module.exports = query;
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
        'id',
        'name',
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
        'id': organisations[i].dataValues.id,
        'name': organisations[i].dataValues.name,
        'id_type_organisation': organisations[i].dataValues.id_type_organisation
      });
    }
    return data;
  }

  async getPractice(req) {
    let data = await model.Practice.findAll({
      where: {
        edu_level: req.query.edu_level,
        year: req.query.year,
        id_type_practice: await this.getIdByName(model.Type_practice,
            req.query.typePractice)
      }
    });
    if (data.length !== 0) {
      data = data[0].dataValues;
    }
    return data;
  }

  async getDeterminedRequests(req) {
    let data = await model.Request.findAll({
      where: {
        uid_student: req.query.id_student,
        id_practice: req.query.id_practice
      }
    });
    if (data.length !== 0) {
      data = data[0].dataValues;
    }
    return data;
  }

  async getOrganisationByRequestId(req) {
    /*let requests_organisations = await model.Request_Organisation.findAll({
      where: {
        id_request: req.query.id_request
      }
    });*/
    let objReqBody = {
      attributes: [
        'id_request',
        'id_organisation',
        'date_creation',
        'id_status'],
      include: [{
        attributes: ['name'],
        model: model.Status,
        required: true
      }],
      where: {
        id_request: req.query.id_request
      }
    };
    let requests_organisations;
    requests_organisations = await model.Request_Organisation.findAll(
        objReqBody);
    let data = [];
    for (let i = 0; i < requests_organisations.length; ++i) {
      data.push({
        'id_request': requests_organisations[i].dataValues.id_request,
        'name_organisation': await this. getNameById(model.Organisation,requests_organisations[i].dataValues.id_organisation),
        'date_creation': requests_organisations[i].dataValues.date_creation,
        'id_status':  requests_organisations[i].dataValues.id_status
      });
    }
    return data;
  }

  async getIdByName(table, name) {
    let id;
    id = await table.findOne({
      arguments: [
        'id'
      ],
      where: {
        name: name
      }
    });
    if (id) {
      id = id.dataValues.id;
    }
    return id;
  }
  async getNameById(table, id) {
    let name;
    name= await table.findOne({
      arguments: [
        'name'
      ],
      where: {
        id: id
      }
    });
    if (name) {
      name = name.dataValues.name;
    }
    return name;
  }
  async getLastPracticeId() {
    let id;
    id = await model.Practice.findAndCountAll({});
    return id.count;
  }

  async addOrUpdateOrganisation(req) {
    let queryObj = {
      name: req.name,
      email_organisation: req.emailOrg,
      phone_organisation: req.phoneOrg,
      info_organisation: req.infoOrg,
      address_organisation: req.addressOrg,
      max_students_number: req.placesOrg,
      login_organisation: req.loginOrg,
      pswd_organisation: req.pswdOrg,
      id_type_organisation: await this.getIdByName(model.Type_organisation,
          req.typeOrg)
    };
    let id_org = await this.getIdByName(model.Organisation, req.name);
    if (id_org) {
      queryObj.id = id_org;
    }
    await model.Organisation.upsert(queryObj);
  }

  async addOrUpdateStudents(req) {
    for (let i = 0; i < req.length; i++) {
      let queryObj = {
        uid_student_LDAP: req[i].uid,
        email_student: req[i].email,
        phone_student: req[i].phone,
        uid_teacher_LDAP: req[i].uid_teacher
      };
      let id_student;
      id_student = await model.Student.findOne({
        arguments: [
          'uid_student_LDAP'
        ],
        where: {
          uid_student_LDAP: req[i].uid
        }
      });
      if (id_student) {
        queryObj.uid_student_LDAP = id_student.dataValues.uid_student_LDAP;
      }
      console.log("id_student= " + id_student);
      await model.Student.upsert(queryObj);
    }
  }

  async createPractice(req) {
    let queryObj = {
      id_type_practice: await this.getIdByName(model.Type_practice,
          req.typePractice),
      start_date_practice: req.startDatePractice,
      end_date_practice: req.endDatePractice,
      deadline_practice: req.deadlinePractice,
      lections_number: req.lecNum,
      edu_level: req.eduLevel,
      year: req.year
    };
    await model.Practice.upsert(queryObj);
  }

  async createPracticeOrganisation(req) {
    let organisations = req.organisations;
    let id_practice = await this.getLastPracticeId();
    for (let i = 0; i < organisations.length; i++) {
      let queryObj = {
        id_practice: id_practice,
        id_organisation: await this.getIdByName(model.Organisation,
            organisations[i])
      };
      await model.Practice_Organisation.upsert(queryObj);
    }
  }

  async createPracticeGroup(req) {
    let groups = req.groups;
    let id_practice = await this.getLastPracticeId();
    for (let i = 0; i < groups.length; i++) {
      let queryObj = {
        id_practice: id_practice,
        uid_group: groups[i].uid_LDAP
      };
      await model.Practice_Groups.upsert(queryObj);
    }
  }

  async createRequests(req) {
    let id_practice = await this.getLastPracticeId();
    for (let i = 0; i < req.groups.length; i++) {
      for (let j = 0; j < req.groups[i].students.length; j++) {
        let queryObj = {
          id_practice: id_practice,
          uid_student: req.groups[i].students[j].uid
        };
        await model.Request.upsert(queryObj);
      }
    }
  }

  defineAssociations() {
    model.Organisation.belongsTo(model.Type_organisation,
        {foreignKey: 'id_type_organisation', targetKey: 'id'});
    model.Practice.belongsTo(model.Type_practice,
        {foreignKey: 'id_type_practice', targetKey: 'id'});
    model.Request.belongsTo(model.Student,
        {foreignKey: 'uid_student', targetKey: 'uid_student_LDAP'});
    model.Request.belongsTo(model.Practice,
        {foreignKey: 'id_practice', targetKey: 'id_practice'});
    model.Request.belongsTo(model.Review,
        {foreignKey: 'id_review', targetKey: 'id_review'});
    model.Request.belongsTo(model.Organisation,
        {foreignKey: 'id_organisation', targetKey: 'id'});
    model.Request_Organisation.belongsTo(model.Status,
        {foreignKey: 'id_status', targetKey: 'id'});
    model.Document.belongsTo(model.Practice,
        {foreignKey: 'id_practice', targetKey: 'id_practice'});
    model.Student.belongsTo(model.Teacher,
        {foreignKey: 'id_teacher', targetKey: 'id_teacher'});

    model.Practice.belongsToMany(model.Organisation, {
      through: model.Practice_Organisation,
      foreignKey: 'id_practice',
      targetKey: 'id_practice'
    });
    model.Organisation.belongsToMany(model.Practice, {
      through: model.Practice_Organisation,
      foreignKey: 'id_organisation',
      targetKey: 'id'
    });

    model.Request.belongsToMany(model.Organisation, {
      through: model.Request_Organisation,
      foreignKey: 'id_request',
      targetKey: 'id_request'
    });
    model.Organisation.belongsToMany(model.Request, {
      through: model.Request_Organisation,
      foreignKey: 'id_organisation',
      targetKey: 'id'
    });
  }
}

var query = new Query();
query.defineAssociations();
module.exports = query;
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
            id_type_organisation: await this.getIdByName(model.Type_organisation, req.typeOrg)
        };
        let id_org = await this.getIdByName(model.Organisation, req.name);
        if (id_org) {
            queryObj.id = id_org;
        }
        await model.Organisation.upsert(queryObj);
    }

    async createPractice(req) {
        let queryObj = {
            id_type_practice: await this.getIdByName(model.Type_practice, req.typePractice),
            start_date_practice: req.startDatePractice,
            end_date_practice: req.endDatePractice,
            deadline_practice: req.deadlinePractice,
            lections_number: req.lecNum,
            edu_level: req.eduLevel
        };
        await model.Practice.upsert(queryObj);
    }

    async createPracticeOrganisation(req) {
        let organisations = req.organisations;
        let id_practice = await this.getLastPracticeId();
        for (let i = 0; i < organisations.length; i++) {
            let queryObj = {
                id_practice: id_practice,
                id_organisation: await this.getIdByName(model.Organisation, organisations[i])
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
                id_group: await this.getIdByName(model.Group, groups[i])
            };
            await model.Practice_Groups.upsert(queryObj);
        }
    }

    async createRequests(req) {
        let id_practice = await this.getLastPracticeId();
        for (let i = 0; i < groups.length; i++) {
            let queryObj = {
                id_practice: id_practice,
                id_student: null,
                id_review: null,
                id_organisation:null
            };
            await model.Request.upsert(queryObj);
        }
    }

    defineAssociations() {
        model.Organisation.belongsTo(model.Type_organisation,
            {foreignKey: 'id_type_organisation', targetKey: 'id'});
        model.Practice.belongsTo(model.Type_practice,
            {foreignKey: 'id_type_practice', targetKey: 'id'});
        model.Request.belongsTo(model.Student,
            {foreignKey: 'id_student', targetKey: 'id_student'});
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

        model.Practice.belongsToMany(model.Group, {
            through: model.Practice_Groups,
            foreignKey: 'id_practice',
            targetKey: 'id_practice'
        });
        model.Group.belongsToMany(model.Practice, {
            through: model.Practice_Groups,
            foreignKey: 'id_group',
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
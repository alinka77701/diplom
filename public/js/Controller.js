const View = require('./View.js');
const Model = require('./Model.js');

function Controller() {
    this.View = new View();
    this.Model = new Model();
    this.init();
}

Controller.prototype.init = async function () {
    this.View.onClickNextStep = this.displayGroups.bind(this);
    this.View.onClickCreatePractice = this.goToPracticeCreation.bind(this);
    this.View.onClickAddPractice = this.createPractice.bind(this);
    this.View.onClickToOrganisationsSection = this.goToOrganisationsSection.bind(this);
    this.View.onClickToStudentsSection = this.goToStudentsSection.bind(this);
    this.View.onClickFinishBtn = this.dialogPracticeCreatedInit.bind(this);
    this.View.onClickSelectGroupBtnOk = this.renderDataInTable.bind(this);
    this.View.onClickYearsArray = this.setGroupsTreeView.bind(this);
    this.View.onClickGetOrganisations = this.getOrganisations.bind(this);
    this.View.onClickCreateOrganisation = this.updateTreeView.bind(this);
    this.View.onClickDisplayInfoAboutOrg = this.displayInfoAboutOrg.bind(this);
    this.View.onClickDisplayOrganisations = this.goToOrganisationsSection.bind(this);
    this.View.onClickEditOrganisation = this.editOrganisation.bind(this);
    this.View.init();
    await this.Model.init();
};

Controller.prototype.goToOrganisationsSection = async function () {
    let organisations=await this.Model.getOrganisations();
    let typesOrganisation = await this.Model.getTypesOrganisation();
    this.View.setTypesOrganisationSelect(typesOrganisation);
    this.View.setOrganisationsList(organisations, "allOrganisationsList");
    this.View.goToOrganisationsSection();
};

Controller.prototype.goToStudentsSection = function () {
    this.View.goToStudentsSection();
};

Controller.prototype.goToPracticeCreation = async function () {
    this.View.selectedYear = this.Model.getCurrentYear();
    await this.renderGroupsTreeView();
    this.View.clearPracticeSection();
    let typesOrganisation = await this.updateTypesOrganisation();
    this.View.setTypesOrganisationSelect(typesOrganisation);
    this.View.goToPracticeCreation();
    this.View.selectedYear = this.Model.getCurrentYear();
};

Controller.prototype.updateTypesOrganisation = async function () {
    let typesOrganisation = await this.Model.getTypesOrganisation();
    this.View.clearTypesOrganisation();
    this.View.setTypesOrganisation(typesOrganisation);
    let organisations = await this.Model.getOrganisations();
    this.View.setOrganisationsInTreeView(organisations, typesOrganisation);
    return typesOrganisation;
};
Controller.prototype.editOrganisation = async function (event) {
   let nameOrganisation= this.View.getNameOrganisation(event);
   let organisation=await this.Model.getOrganisationByName(nameOrganisation);
    this.View.showDialogOrganisation(organisation);
};
/*========================================PRACTICE SECTION================================================*/
Controller.prototype.displayGroups = function () {
    this.View.displayGroups();
};

Controller.prototype.dialogPracticeCreatedInit = function () {
    this.View.dialogPracticeCreatedInit();
};

Controller.prototype.createNewOrganisation = async function () {
    let organisation = this.View.getInfoNewOrganisation();
    await this.Model.createOrUpdateOrganisation(organisation);

};
Controller.prototype.updateTreeView = async function () {
    await this.createNewOrganisation();
    await this.updateTypesOrganisation();
};
Controller.prototype.createPractice = async function () {
    this.View.Wait();
    let practice = this.View.Practice;
    let groups = await this.Model.getDeterminedGroups(practice.groups);
    practice.groups = groups;
    await this.Model.createPractice(practice);
    this.View.Stop();
    this.goToStudentsSection();
};

/*============================================STUDENTS SECTION=====================================================*/
Controller.prototype.renderGroupsTreeView = async function () {
    if (this.View.selectedYear !== " + ") {
        await  this.Model.distributeGroupsByCourses(this.View.selectedYear);
        await this.View.clearGroupsTreeView();
        await this.View.updateGroupsTreeView(this.Model.Courses);
    }
};

Controller.prototype.setGroupsTreeView = function (event) {
    this.View.updateYear(event);
    this.renderGroupsTreeView();
};

Controller.prototype.renderDataInTable = async function () {
    let selectedGroups = this.View.getSelectedGroups();
    let groupsObjects = [];
    for (let i = 0; i < this.Model.Groups.length; i++) {
        for (let j = 0; j < selectedGroups.length; j++) {
            if (this.Model.Groups[i].name === selectedGroups[j]) {
                groupsObjects.push(this.Model.Groups[i]);
            }
        }
    }

    let info_about_practice = this.View.getUserInfoAboutPractice();
    let practice = await this.Model.getPractice(info_about_practice);
    let data = 0, requests_organisations;
    if (practice.length !== 0) {
        let requests = await this.Model.getRequests(practice, groupsObjects);
        await this.Model.assosiateRequestToStudent(requests, selectedGroups);
        requests_organisations = await this.Model.getRequestsOrganisations(selectedGroups);
        data = await this.Model.getData(selectedGroups, requests_organisations);
        if (data.length === 0) {
            data = 0;
            this.View.renderTable(data);
        }
        else
            this.View.renderTable(data);
        this.View.colorTable(data);
    }

    this.View.renderInfo(practice);
};

Controller.prototype.getOrganisations = async function () {
    let info_about_practice = this.View.getConfigurationPractice();
    let practice = await this.Model.getPractice(info_about_practice);
    let organisations = 0;
    if (practice.length !== 0) {
        organisations = await this.Model.getOrganisationsByPracticeId(practice);
    }
    this.View.setOrganisationsList(organisations,"organisationList");
    this.View.renderOrganisationSection(practice);
};
/*========================================ORGANISATIONS SECTION================================================*/
Controller.prototype.displayInfoAboutOrg = function () {
    this.View.displayInfoAboutOrg();
};


module.exports = Controller;
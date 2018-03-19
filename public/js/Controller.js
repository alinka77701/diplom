const View =  require ('./View.js');
const Model =  require ('./Model.js');

function Controller () {
    this.View = new View();
    this.Model = new Model();
    this.init();
}

Controller.prototype.init = function () {
    this.View.onClickNextStep = this.displayGroups.bind(this);
    this.View.onClickPracticeCompleted = this.goToStudentsSection.bind(this);
    this.View.onClickCreatePractice = this.goToPracticeCreation.bind(this);
    this.View.onClickToOrganisationsSection = this.goToOrganisationsSection.bind(this);
    this.View.onClickToStudentsSection = this.goToStudentsSection.bind(this);
    this.View.onClickFinishBtn = this.dialogPracticeCreatedInit.bind(this);
    this.View.onClickSelectGroupBtnOk = this.renderDataInTable.bind(this);
    this.View.onClickYearsArray = this.setGroupsTreeView.bind(this);
    this.View.onClickGetOrganisations = this.getOrganisations.bind(this);
    this.View.onClickCreateOrganisation = this.createNewOrganisation.bind(this);
    this.View.init();
};

Controller.prototype.goToOrganisationsSection = function () {
    this.View.goToOrganisationsSection();
};

Controller.prototype.goToStudentsSection = function () {
    this.View.goToStudentsSection();
};
Controller.prototype.goToPracticeCreation = async function () {
    this.View.selectedYear = this.Model.myGetYear();
    this.View.clearGroupsTreeView();
    this.renderGroupsTreeView();
    this.View.clearPracticeSection();
    let typesOrganisation= await this.updateTypesOrganisation();
    this.View.setTypesOrganisationSelect(typesOrganisation);
    this.View.goToPracticeCreation();
};
Controller.prototype.updateTypesOrganisation = async function () {
  let typesOrganisation= await this.Model.getTypesOrganisation();
  this.View.clearTypesOrganisation();
  this.View.setTypesOrganisation(typesOrganisation);
  let organisations= await this.Model.getOrganisations();
  this.View.setOrganisationsInTreeView(organisations,typesOrganisation);
  return typesOrganisation;
}
/*========================================PRACTICE SECTION================================================*/
Controller.prototype.displayGroups = function () {
    this.View.displayGroups();
};
Controller.prototype.dialogPracticeCreatedInit = function () {
    this.View.dialogPracticeCreatedInit();
};
Controller.prototype.createNewOrganisation = async function () {
  let organisation= this.View.getInfoNewOrganisation();
  this.Model.createOrUpdateOrganisation(organisation);
  await this.updateTypesOrganisation();
};
/*============================================STUDENTS SECTION=====================================================*/
Controller.prototype.renderGroupsTreeView = function () {
    this.Model.distributeGroupsByCourses(this.View.selectedYear)
        .then(() => {
            this.View.clearGroupsTreeView();
        })
        .then(() => {
            this.View.updateGroupsTreeView(this.Model.Courses);
        });
};
Controller.prototype.setGroupsTreeView = function (event) {
    this.View.updateYear(event);
    this.renderGroupsTreeView();
};
Controller.prototype.renderDataInTable = async function () {
    let groups = this.View.getSelectedGroups();
    await this.Model.getStudents(groups);
    this.View.renderTable(this.Model.Students);
    this.View.renderInfo();
};
Controller.prototype.getOrganisations = function () {
  this.View.getConfigurations();
};

module.exports = Controller;
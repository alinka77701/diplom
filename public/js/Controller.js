const View =  require ('./View.js');
const Model =  require ('./Model.js');

 function Controller () {
    this.View = new View();
    this.Model = new Model();
    this.init();
}

Controller.prototype.init = async function () {
    this.View.onClickNextStep = this.displayGroups.bind(this);
   // this.View.onClickPracticeCompleted = this.goToStudentsSection.bind(this);
    this.View.onClickCreatePractice = this.goToPracticeCreation.bind(this);
    this.View.onClickAddPractice = this.createPractice.bind(this);
    this.View.onClickToOrganisationsSection = this.goToOrganisationsSection.bind(this);
    this.View.onClickToStudentsSection = this.goToStudentsSection.bind(this);
    this.View.onClickFinishBtn = this.dialogPracticeCreatedInit.bind(this);
    this.View.onClickSelectGroupBtnOk = this.renderDataInTable.bind(this);
    this.View.onClickYearsArray = this.setGroupsTreeView.bind(this);
    this.View.onClickGetOrganisations = this.getOrganisations.bind(this);
    this.View.onClickCreateOrganisation = this.createNewOrganisation.bind(this);
    this.View.init();
    await this.Model.init();
};

Controller.prototype.goToOrganisationsSection = function () {
    this.View.goToOrganisationsSection();
};

Controller.prototype.goToStudentsSection = function () {
    this.View.goToStudentsSection();
};

Controller.prototype.goToPracticeCreation = async function () {
    this.View.selectedYear = this.Model.getCurrentYear();
    await this.renderGroupsTreeView();
    this.View.clearPracticeSection();
    let typesOrganisation= await this.updateTypesOrganisation();
    this.View.setTypesOrganisationSelect(typesOrganisation);
    this.View.goToPracticeCreation();
    this.View.selectedYear = this.Model.getCurrentYear();
};

Controller.prototype.updateTypesOrganisation = async function () {
  let typesOrganisation= await this.Model.getTypesOrganisation();
  this.View.clearTypesOrganisation();
  this.View.setTypesOrganisation(typesOrganisation);
  let organisations= await this.Model.getOrganisations();
  this.View.setOrganisationsInTreeView(organisations,typesOrganisation);
  return typesOrganisation;
};

/*========================================PRACTICE SECTION================================================*/
Controller.prototype.displayGroups = function () {
    this.View.displayGroups();
};

Controller.prototype.dialogPracticeCreatedInit = function () {
    this.View.dialogPracticeCreatedInit();
};

Controller.prototype.createNewOrganisation = async function () {
  let organisation= this.View.getInfoNewOrganisation();
  await this.Model.createOrUpdateOrganisation(organisation);
  await this.updateTypesOrganisation();
};

Controller.prototype.createPractice = async function () {
  this.View.Wait();
  let practice = this.View.Practice;
  let groups=await this.Model.getDeterminedGroups(practice.groups);
  practice.groups=groups;
  await this.Model.createPractice(practice);
  this.View.Stop();
  this.goToStudentsSection();
};

/*============================================STUDENTS SECTION=====================================================*/
Controller.prototype.renderGroupsTreeView = async function () {
  if(this.View.selectedYear!==" + ") {
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
    let groups=[];
    for(let i=0;i<this.Model.Groups.length;i++){
        for(let j=0;j<selectedGroups.length;j++){
            if(this.Model.Groups[i].name===selectedGroups[j]){
                groups.push(this.Model.Groups[i]);
            }
        }
    }

    let info_about_practice= this.View.getUserInfoAboutPractice();
    let practice=await this.Model.getPractice(info_about_practice);
    if(practice)
    {
        await this.Model.AAA(practice, groups);
        let data = await this.Model.getData(groups);
        this.View.renderTable(data);
    }
    this.View.renderInfo(practice);
};

Controller.prototype.getOrganisations = function () {
  this.View.getConfigurations();
};

module.exports = Controller;
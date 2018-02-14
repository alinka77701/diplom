Controller = function (View, Model) {
    this.View = View;
    this.Model = Model;
};

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
    this.View.init();
};

Controller.prototype.goToOrganisationsSection = function () {
    this.View.goToOrganisationsSection();
}

Controller.prototype.goToStudentsSection = function () {
    this.View.goToStudentsSection();
}
Controller.prototype.goToPracticeCreation = function () {
    this.View.selectedYear = this.Model.myGetYear();
    this.renderGroupsTreeView();
    this.View.goToPracticeCreation();
}




/*========================================PRACTICE SECTION================================================*/
Controller.prototype.displayGroups = function () {
    this.View.displayGroups();
};
Controller.prototype.dialogPracticeCreatedInit = function () {
    this.View.dialogPracticeCreatedInit();
}


/*============================================STUDENTS SECTION=====================================================*/
Controller.prototype.renderGroupsTreeView = function () {
    this.Model.distributeGroupsByCourses(this.View.selectedYear)
        .then(function () {
            this.View.clearGroupsTreeView();
        })
        .then(function () {
            this.View.updateGroupsTreeView(this.Model.Courses);
        });
}
Controller.prototype.setGroupsTreeView = function (event) {
    this.View.updateYear(event);
    this.renderGroupsTreeView();
}
Controller.prototype.renderDataInTable = async function () {
    let groups = this.View.getSelectedGroups();
    await this.Model.getStudents(groups);
    this.View.renderTable(this.Model.Students);
    this.View.renderInfo();

}
Controller.prototype.getOrganisations = function () {
  this.View.getConfigurations();
}
var Controller = new Controller(View, Model);

Controller.init();
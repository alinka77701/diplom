const View = require('./View.js');
const Model = require('./Model.js');

function Controller() {
    this.View = new View();
    this.Model = new Model();
    this.init();
}

const APPROVED = 1;
const REJECTED = 2;
Controller.prototype.init = async function () {
    this.View.OpenOrCloseLoader();
    await this.Model.init();
    await this.setYears();
    this.View.onClickNextStepDisplayGroupsTreeView = this.displayGroups.bind(
        this);
    this.View.onClickCreatePractice = this.goToPracticeCreation.bind(this);
    this.View.onClickAddPractice = this.createPractice.bind(this);
    this.View.onClickToOrganisationsSection = this.goToOrganisationsSection.bind(
        this);
    this.View.onClickToStudentsSection = this.goToStudentsSection.bind(this);
    this.View.onClickFinishBtn = this.dialogPracticeCreatedInit.bind(this);
    this.View.onClickSelectGroupBtnOk = this.renderDataInTable.bind(this);
    this.View.onClickYearsArray = this.setGroupsTreeView.bind(this);
    this.View.onClickGetOrganisations = this.getOrganisationsInCurrentPractice.bind(this);
    this.View.onClickCreateOrganisation = this.updateTreeView.bind(this);
    this.View.onClickDisplayInfoAboutOrg = this.displayInfoAboutOrg.bind(this);
    this.View.onClickDisplayOrganisations = this.goToOrganisationsSection.bind(
        this);
    this.View.onClickEditOrganisation = this.showDialogEditOrganisation.bind(
        this);
    this.View.onClickUpdateOrganisation = this.updateOrganisation.bind(this);
    this.View.onClickApproveStudent = this.changeStudentStatus.bind(this);
    this.View.onClickRejectStudent = this.changeStudentStatus.bind(this);
    this.View.onClickAddStudentToOrganisationShowDialog = this.addStudentToOrganisationShowDialog.bind(
        this);
    this.View.onClickAddStudentToOrganisation = this.addStudentToOrganisation.bind(
        this);
    this.View.onClickShowDialogGenerateDocument = this.showDialogGenerateDocument.bind(
        this);
    this.View.onClickGenerateDocument = this.generateDocument.bind(
        this);
    this.View.onChangeTypeDocument = this.initDialog.bind(
        this);
    this.View.init();
    await this.Model.getStudentsFromLDAP();
    this.View.OpenOrCloseLoader();
};

/*========================================GENERATE DOCUMENTS SECTION================================================*/
Controller.prototype.initDialog = async function () {
    let type_document = this.View.getSelectValue("gdtypeDocument");
    let isOrder = false;
    if (type_document === "Приказ") {
        isOrder = true;
        await this.createInputs(isOrder);
    }
    else {
        isOrder = false;
        await this.createInputs(isOrder);
    }
};

Controller.prototype.createInputs = async function (isOrder) {
    let selectedPractice = await this.View.getSelectedPractice("forStudentsSection")[0];
    let groups=selectedPractice.groups.split(',');
    if (isOrder) {//приказ
        let block = this.View.getElemById("groups-report-block");
        this.View.removeChildren(block);
        this.View.changeDisplay("report-block", "none");
        this.View.changeDisplay("order-block", "block");
        this.View.createInputsOrder(groups);
        this.View.changeInnerHtml("typeDocument", "приказа");
    }
    else {//отчет
        let practice = await this.Model.getPracticeById(selectedPractice.id);
        let block = this.View.getElemById("order-block");
        this.View.removeChildren(block);
        this.View.createInputsReport(groups);
        this.View.changeDisplay("report-block", "block");
        this.View.changeDisplay("order-block", "none");
        this.View.changeInnerHtml("typeDocument", "отчета");
        let organisations = await this.Model.getOrganisationsByPracticeId(practice);
        this.View.fillDialog(practice, organisations);
    }
};

Controller.prototype.showDialogGenerateDocument = async function () {
    let practice=this.View.getSelectedPractice("forStudentsSection");
    if(practice.length!==0){
        practice = await this.Model.getPracticeById(practice[0].id);
        if(practice.id_type_practice===2 || practice.id_type_practice===3){
            alert(
                "Возможность генерации документов для преддипломной практики и научно-исследовательский работы в стадии разработки. Приносим свои извинения за предоставленные неудобства.");
            return;
        }
        this.View.dialogOpen("#dialogGenerateReport");
    }
    else {
        alert(
            "Практика не выбрана. Выберите практику.");
    }
};

Controller.prototype.generateDocument = async function () {
    await this.View.readTextFile("/js/assets/json/data.json", function (text) {
        let data = JSON.parse(text);
        return data;
    });
    let selectedPractice=this.View.getSelectedPractice("forStudentsSection")[0];
    let groups=selectedPractice.groups.split(',');
    let practice = await this.Model.getPracticeById(selectedPractice.id);
    let type_document = this.View.getSelectValue("gdtypeDocument");
    let documents = 0, data = 0;

    if (type_document === "Приказ") {
        data = await this.getPreferencesStudentsOrganisations(selectedPractice);
        let organisations = await this.Model.getOrganisationsByPracticeId(practice);
        documents = this.View.getInformationForDocumentOrder(practice, groups, this.Model.Groups, data, organisations);
    }
    else {
        let organisations = await this.Model.getOrganisationsByPracticeId(practice);
        documents = this.View.getInformationForDocumentReport(practice, groups, this.Model.Groups, organisations);

    }
    for (let i = 0; i < documents.length; i++) {
        await this.Model.generateDocument(documents[i], type_document, practice.id_type_practice);
    }
};

/*========================================PRACTICE SECTION================================================*/
Controller.prototype.goToPracticeCreation = async function () {
    this.View.selectedYear = this.Model.getCurrentYear();
    this.View.clearPracticeSection();
    let typesOrganisation = await this.updateTypesOrganisation();
    this.View.setTypesOrganisationSelect(typesOrganisation);
    this.View.goToPracticeCreation();
    this.View.selectedYear = this.Model.getCurrentYear();
};

Controller.prototype.displayGroups = function () {
    this.View.displayGroups();
};

Controller.prototype.dialogPracticeCreatedInit = function () {
    this.View.dialogPracticeCreatedInit();
};

Controller.prototype.updateTreeView = async function () {
    await this.createNewOrganisation();
    await this.updateTypesOrganisation();
};

Controller.prototype.createPractice = async function () {
    this.View.OpenOrCloseLoader();
    let practice = this.View.Practice;
    let groups = await this.Model.getDeterminedGroups(practice.groups);
    practice.groups = groups;
    await this.Model.createPractice(practice);
    this.View.OpenOrCloseLoader();
    await  this.setYears();
    this.goToStudentsSection();
};

Controller.prototype.updateTypesOrganisation = async function () {
    let typesOrganisation = await this.Model.getTypesOrganisation();
    this.View.clearTypesOrganisation();
    this.View.setTypesOrganisation(typesOrganisation);
    let organisations = await this.Model.getOrganisations();
    this.View.setOrganisationsInTreeView(organisations, typesOrganisation);
    return typesOrganisation;
};
/*============================================STUDENTS SECTION=====================================================*/
Controller.prototype.setYears = async function () {
    let years = await this.Model.getPracticeYears();
    this.View.setYearsArray(years);
};

Controller.prototype.goToStudentsSection = function () {
    this.View.goToStudentsSection();
};

Controller.prototype.renderGroupsTreeView = async function () {
    await this.Model.distributeGroupsByCourses(this.View.selectedYear);
    await this.View.clearGroupsTreeView();
    await this.View.updateGroupsTreeView(this.Model.Courses, this.Model.Groups);
};

Controller.prototype.renderPracticeTreeView = async function () {
    await this.View.clearPracticeTreeView();
    let practices = await this.Model.getPractices();
    let types_practice = await this.Model.getTypesPractices();
    for (let i = 0; i < practices.length; i++) {
        if (this.View.selectedYear === practices[i].year) {
            let groups = await this.Model.getGroupsByPracticeId(practices[i]);
            groups = await this.Model.getGroupsNameByGroupsUID(groups);
            practices[i].groups = groups.join();
        }
    }
    this.View.setPracticesInTreeView(practices, types_practice);
};

Controller.prototype.setGroupsTreeView = async function (event) {
    this.View.updateYear(event);
    if (this.View.selectedYear === "+") {
        this.View.selectedYear = this.Model.getCurrentYear();
        await this.goToPracticeCreation();
    }
    else {
        await this.renderPracticeTreeView();
    }
    await this.renderGroupsTreeView();
};

Controller.prototype.getPreferencesStudentsOrganisations = async function (selectedPractice) {
    let groupsObjects = [];
    let practice = await this.Model.getPracticeById(selectedPractice.id);
    practice.groups = selectedPractice.groups.split(',');
    for (let k = 0; k < practice.groups.length; k++) {
        for (let j = 0; j < this.Model.Groups.length; j++) {
            if (practice.groups[k] === this.Model.Groups[j].name) {
                groupsObjects.push(this.Model.Groups[j]);
            }
        }
    }
    let requests = await this.Model.getRequests(practice, groupsObjects);
    await this.Model.assosiateRequestToStudent(requests, practice.groups);
    let requests_organisations = await this.Model.getRequestsOrganisations(practice.groups);
    let data = await this.Model.getData(practice.groups, requests_organisations);
    return data;
};

Controller.prototype.renderDataInTable = async function () {
    this.View.OpenOrCloseLoader();
    let data = [];
    let practices = this.View.getSelectedPractice("forStudentsSection");
    if(practices.length!==0) {
        let practice = await this.Model.getPracticeById(practices[0].id);
        data = await this.getPreferencesStudentsOrganisations(practices[0]);

        this.View.renderTable(data);
        this.View.colorTable(data);
        this.View.renderInfo(practice);
    }
    else {
        alert("Практика не выбрана. Выберите практику.");
    }
    this.View.OpenOrCloseLoader();
};

/*========================================ORGANISATIONS SECTION================================================*/
Controller.prototype.goToOrganisationsSection = async function () {
    this.View.OpenOrCloseLoader();
    let organisations = await this.Model.getOrganisations();
    let typesOrganisation = await this.Model.getTypesOrganisation();
    this.View.setTypesOrganisationSelect(typesOrganisation);
    this.View.setOrganisationsList(organisations, "allOrganisationsList");
    this.View.OpenOrCloseLoader();
    this.View.goToOrganisationsSection();
};

Controller.prototype.getApprovedAndNonApprovedStudents = async function (organisation) {
    let practice = await this.View.getSelectedPractice("forOrganisationSection")[0];
    practice = await this.Model.getPracticeById(practice.id);
    let approved_student_count = 0, non_approved_student_count = 0;
    if (practice.length !== 0) {
        approved_student_count = await this.renderStudentList(organisation,
            practice, "approvedStudents");
        non_approved_student_count = await this.renderStudentList(organisation,
            practice, "nonApprovedStudents");
    }
    this.View.updateOrganisationTitle(organisation.name, approved_student_count,
        non_approved_student_count);
};

Controller.prototype.displayInfoAboutOrg = async function (event) {
    let nameOrganisation = this.View.getSelectedOrganisation(event);
    let organisation = await this.Model.getOrganisationByName(nameOrganisation);
    await this.getApprovedAndNonApprovedStudents(organisation);
};

Controller.prototype.renderStudentList = async function (organisation, practice, idList) {
    let status;
    if (idList === "approvedStudents") {
        status = true;
    }
    else {
        status = false;
    }
    let studentsInfo = await this.Model.getRequestsByOrganisationId(
        organisation, practice, status);
    let students = await this.Model.getStudentsByUID(studentsInfo);
    this.View.updateStudentsListView(students, idList);
    return students.length;
};

Controller.prototype.getOrganisationsInCurrentPractice = async function () {
    let practice = await this.View.getSelectedPractice("forOrganisationSection")[0];
    if(practice!==undefined) {
        practice = await this.Model.getPracticeById(practice.id);
        let organisations = 0;
        if (practice.length !== 0) {
            organisations = await this.Model.getOrganisationsByPracticeId(practice);
            for (let i = 0; i < organisations.length; i++) {
                let requests_number = await this.Model.getRequestsByPracticeId_OrganisationId(practice.id_practice, organisations[i].id);
                organisations[i].num_vacant_places = organisations[i].max_students_number - requests_number;
            }
        }
        this.View.setOrganisationsList(organisations, "organisationList");
        this.View.renderOrganisationSection(practice);
    }
    else{
        alert("Практика не выбрана. Выберите практику.");
    }
};

Controller.prototype.getOrganisation = async function () {
    let nameOrganisation = this.View.getNameOrganisationByTitle();
    let organisation = await this.Model.getOrganisationByName(nameOrganisation);
    return organisation;
};

Controller.prototype.changeStudentStatus = async function (event) {
    this.View.OpenOrCloseLoader();
    let student = this.View.getSelectedStudent(event);
    await this.Model.updateRequestOrganisation(student);
    await this.Model.updateRequest(student);

    student['id_status'] = REJECTED;
    await this.Model.updateRequestOrganisationByRequest(student);

    let organisation = await this.getOrganisation();
    await this.getApprovedAndNonApprovedStudents(organisation);
    await  this.getOrganisationsInCurrentPractice();
    // this.View.updateNumberPlacesInOrganisation(organisation);
    this.View.OpenOrCloseLoader();
};

Controller.prototype.updateOrganisation = async function () {
    let organisation = this.View.getInfoNewOrganisation();
    await this.Model.updateOrganisation(organisation);
};

Controller.prototype.createNewOrganisation = async function () {
    let organisation = this.View.getInfoNewOrganisation();
    await this.Model.createOrganisation(organisation);
};

Controller.prototype.addStudentToOrganisationShowDialog = async function (event) {
    let practice = await this.View.getSelectedPractice("forOrganisationSection")[0];
    practice = await this.Model.getPracticeById(practice.id);
    let uidsGroups = await this.Model.getGroupsByPracticeId(practice);
    let namesGroups = await this.Model.getGroupsNameByGroupsUID(uidsGroups);
    this.View.dialogEnableCheckboxes(namesGroups,
        "group-treeview-tabcontrol1-dialogAdd-bachelor");
    this.View.dialogEnableCheckboxes(namesGroups,
        "group-treeview-tabcontrol2-dialogAdd-master");
    let nameOrganisation=this.View.getOnClickNameOrganisation(event);
    this.View.changeInnerHtml("nameOrganisationDialog",nameOrganisation);
    this.View.dialogOpen("#dialogAddStudent");
};

Controller.prototype.addStudentToOrganisation = async function () {
    let students = await this.View.getSelectedStudents(event);
    let practice = await this.View.getSelectedPractice("forOrganisationSection")[0];
    practice = await this.Model.getPracticeById(practice.id);
    let nameOrganisation = this.View.getNameOrganisationInTreeview(
        "organisationList");
    let organisation = await this.Model.getOrganisationByName(nameOrganisation);
    let requests = await this.Model.getRequestByStudentUIDS(practice,
        students);
    for (let i = 0; i < students.length; i++) {
        for (let j = 0; j < requests.length; j++) {
            if (students[i].uid === requests[j].uid_student) {
                students[i]['id_request'] = requests[j].id_request;
                students[i]['id_practice'] = practice.id_practice;
                students[i]['id_organisation'] = organisation.id;
                students[i]['id_status'] = APPROVED;
            }
        }
    }
    await this.Model.updateRequestsOrganisation(students);
    await this.Model.updateRequests(students);

    for (let j = 0; j < students.length; j++) {
        students[j]['id_status'] = REJECTED;
    }
    await this.Model.updateRequestsOrganisationByRequest(students);
    await  this.getOrganisationsInCurrentPractice();
    await this.getApprovedAndNonApprovedStudents(organisation);

};

Controller.prototype.showDialogEditOrganisation = async function (event) {
    let idOrganisation = this.View.getIdOrganisation(event);
    let organisation = await this.Model.getOrganisationById(idOrganisation);
    this.View.showDialogOrganisation(organisation);
};

module.exports = Controller;
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Controller = __webpack_require__(1);

__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(10);

document.addEventListener('DOMContentLoaded', () => {
  new Controller();
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const View = __webpack_require__(2);
const Model = __webpack_require__(3);

function Controller() {
    this.View = new View();
    this.Model = new Model();
    this.init();
}

const APPROVED = 1;
const REJECTED = 2;
Controller.prototype.init = async function () {
    this.View.OpenOrCloseLoadImage();
    await this.setYears();
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
    this.View.onClickEditOrganisation = this.showDialogEditOrganisation.bind(this);
    this.View.onClickUpdateOrganisation = this.updateOrganisation.bind(this);
    this.View.onClickApproveStudent = this.changeStudentStatus.bind(this);
    this.View.onClickRejectStudent = this.changeStudentStatus.bind(this);
    this.View.onClickAddStudentToOrganisationShowDialog = this.addStudentToOrganisationShowDialog.bind(this);
    this.View.onClickAddStudentToOrganisation = this.addStudentToOrganisation.bind(this);
    this.View.onClickShowDialogGenerateDocument = this.showDialogGenerateDocument.bind(this);
    this.View.onClickGenerateDocument = this.generateDocument.bind(this);
    this.View.onChangeTypeDocument = this.initDialog.bind(this);
    this.View.init();
    await this.Model.init();
    this.View.OpenOrCloseLoadImage();
};

Controller.prototype.initDialog = async function () {
    let type_document = this.View.getSelectValue("gdtypeDocument");
    let isOrder = false;
    if (type_document === "Приказ") {
        isOrder = true;
        this.createInputs(isOrder);
    } else {
        isOrder = false;
        this.createInputs(isOrder);
    }
};

Controller.prototype.createInputs = function (isOrder) {
    let selectedGroups = this.View.getSelectedGroups();
    if (isOrder) {
        //приказ
        let block = this.View.getElemById("groups-report-block");
        this.View.removeChildren(block);
        this.View.changeDisplay("report-block", "none");
        this.View.changeDisplay("order-block", "block");
        this.View.createInputsOrder(selectedGroups);
        this.View.changeInnerHtml("typeDocument", "приказа");
    } else {
        //отчет
        let block = this.View.getElemById("order-block");
        this.View.removeChildren(block);
        this.View.createInputsReport(selectedGroups);
        this.View.changeDisplay("report-block", "block");
        this.View.changeDisplay("order-block", "none");
        this.View.changeInnerHtml("typeDocument", "отчета");
    }
};

Controller.prototype.showDialogGenerateDocument = async function () {
    let info_about_practice = this.View.getUserInfoAboutPractice();
    let practice = await this.Model.getPractice(info_about_practice);
    if (practice.length !== 0) {
        let groupsPracticeParticipants = await this.Model.getGroupsByPracticeId(practice);
        if (groupsPracticeParticipants.length !== 0) {
            this.View.dialogOpen("#dialogGenerateReport");
        }
    } else {
        alert("Практки не существует! Для генерации документа практика для выбранных групп должна существовать.");
    }
};

Controller.prototype.generateDocument = async function () {
    let selectedGroups = this.View.getSelectedGroups();
    let info_about_practice = this.View.getUserInfoAboutPractice();
    let practice = await this.Model.getPractice(info_about_practice);
    let type_document = this.View.getSelectValue("gdtypeDocument");
    let documents = 0;
    if (type_document === "Приказ") {
        documents = this.View.getInformationForDocumentOrder(practice, selectedGroups, this.Model.Groups);
    } else {
        documents = this.View.getInformationForDocumentReport(practice, selectedGroups, this.Model.Groups);
    }

    for (let i = 0; i < documents.length; i++) {
        await this.Model.generateDocument(documents[i], type_document, info_about_practice.typePractice);
    }
};

Controller.prototype.addStudentToOrganisationShowDialog = async function () {
    let info_about_practice = this.View.getConfigurationPractice();
    let practice = await this.Model.getPractice(info_about_practice);
    let uidsGroups = await this.Model.getGroupsByPracticeId(practice);
    let namesGroups = await this.Model.getGroupsNameByGroupsUID(uidsGroups);
    this.View.dialogEnableCheckboxes(namesGroups, "group-treeview-tabcontrol1-dialogAdd-bachelor");
    this.View.dialogEnableCheckboxes(namesGroups, "group-treeview-tabcontrol2-dialogAdd-master");
    this.View.dialogOpen("#dialogAddStudent");
};

Controller.prototype.addStudentToOrganisation = async function () {
    let students = await this.View.getSelectedStudents(event);
    let info_about_practice = this.View.getConfigurationPractice();
    let practice = await this.Model.getPractice(info_about_practice);
    let nameOrganisation = this.View.getNameOrganisationInTreeview("organisationList");
    let organisation = await this.Model.getOrganisationByName(nameOrganisation);
    let requests = await this.Model.getRequestByStudentUIDS(practice, students);
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
    await this.getApprovedAndNonApprovedStudents(organisation);
};

Controller.prototype.setYears = async function () {
    let years = await this.Model.getPracticeYears();
    this.View.setYearsArray(years);
};

Controller.prototype.goToOrganisationsSection = async function () {
    this.View.OpenOrCloseLoadImage();
    let organisations = await this.Model.getOrganisations();
    let typesOrganisation = await this.Model.getTypesOrganisation();
    this.View.setTypesOrganisationSelect(typesOrganisation);
    this.View.setOrganisationsList(organisations, "allOrganisationsList");
    this.View.OpenOrCloseLoadImage();
    this.View.goToOrganisationsSection();
};

Controller.prototype.goToStudentsSection = function () {
    this.View.goToStudentsSection();
};

Controller.prototype.goToPracticeCreation = async function () {
    this.View.selectedYear = this.Model.getCurrentYear();
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
Controller.prototype.updateOrganisation = async function () {
    let organisation = this.View.getInfoNewOrganisation();
    await this.Model.updateOrganisation(organisation);
};
Controller.prototype.showDialogEditOrganisation = async function (event) {
    let idOrganisation = this.View.getIdOrganisation(event);
    let organisation = await this.Model.getOrganisationById(idOrganisation);
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
    await this.Model.createOrganisation(organisation);
};
Controller.prototype.updateTreeView = async function () {
    await this.createNewOrganisation();
    await this.updateTypesOrganisation();
};
Controller.prototype.createPractice = async function () {
    this.View.OpenOrCloseLoadImage();
    let practice = this.View.Practice;
    let groups = await this.Model.getDeterminedGroups(practice.groups);
    practice.groups = groups;
    await this.Model.createPractice(practice);
    this.View.OpenOrCloseLoadImage();
    this.goToStudentsSection();
};

/*============================================STUDENTS SECTION=====================================================*/
Controller.prototype.renderGroupsTreeView = async function () {
    await this.Model.distributeGroupsByCourses(this.View.selectedYear);
    await this.View.clearGroupsTreeView();
    await this.View.updateGroupsTreeView(this.Model.Courses, this.Model.Groups);
};

Controller.prototype.setGroupsTreeView = async function (event) {
    this.View.updateYear(event);
    if (this.View.selectedYear === "+") {
        this.View.selectedYear = this.Model.getCurrentYear();
        await this.goToPracticeCreation();
    }
    await this.renderGroupsTreeView();
};

Controller.prototype.renderDataInTable = async function () {
    this.View.OpenOrCloseLoadImage();
    let selectedGroups = this.View.getSelectedGroups();
    let groupsObjects = [];
    let info_about_practice = this.View.getUserInfoAboutPractice();
    let practice = [],
        data = 0;

    if (selectedGroups.length !== 0) {
        practice = await this.Model.getPractice(info_about_practice);
        if (practice.length !== 0) {
            for (let i = 0; i < this.Model.Groups.length; i++) {
                for (let j = 0; j < selectedGroups.length; j++) {
                    if (this.Model.Groups[i].name === selectedGroups[j]) {
                        groupsObjects.push(this.Model.Groups[i]);
                    }
                }
            }

            let groupsPracticeParticipants = await this.Model.getGroupsByPracticeId(practice);
            selectedGroups = [];
            for (let i = 0; i < groupsPracticeParticipants.length; i++) {
                for (let j = 0; j < groupsObjects.length; j++) {
                    if (+groupsPracticeParticipants[i].uid_group === groupsObjects[j].uid_LDAP) {
                        selectedGroups.push(groupsObjects[j].name);
                    }
                }
            }
            if (selectedGroups.length !== 0) {
                let requests_organisations;
                let requests = await this.Model.getRequests(practice, groupsObjects);
                await this.Model.assosiateRequestToStudent(requests, selectedGroups);
                requests_organisations = await this.Model.getRequestsOrganisations(selectedGroups);
                data = await this.Model.getData(selectedGroups, requests_organisations);
            } else {
                practice = [];
            }
        }
    }
    if (data.length === 0) {
        data = 0;
        this.View.renderTable(data);
    } else {
        this.View.renderTable(data);
    }
    this.View.colorTable(data);
    this.View.renderInfo(practice);
    this.View.OpenOrCloseLoadImage();
};

/*========================================ORGANISATIONS SECTION================================================*/
Controller.prototype.getApprovedAndNonApprovedStudents = async function (organisation) {
    let info_about_practice = this.View.getConfigurationPractice();
    let practice = await this.Model.getPractice(info_about_practice);
    let approved_student_count = 0,
        non_approved_student_count = 0;
    if (practice.length !== 0) {
        approved_student_count = await this.renderStudentList(organisation, practice, "approvedStudents");
        non_approved_student_count = await this.renderStudentList(organisation, practice, "nonApprovedStudents");
    }
    this.View.updateOrganisationTitle(organisation.name, approved_student_count, non_approved_student_count);
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
    } else {
        status = false;
    }
    let studentsInfo = await this.Model.getRequestsByOrganisationName(organisation, practice, status);
    let students = await this.Model.getStudentsByUID(studentsInfo);
    this.View.updateStudentsListView(students, idList);
    return students.length;
};

Controller.prototype.getOrganisations = async function () {
    let info_about_practice = this.View.getConfigurationPractice();
    let practice = await this.Model.getPractice(info_about_practice);
    let organisations = 0;
    if (practice.length !== 0) {
        organisations = await this.Model.getOrganisationsByPracticeId(practice);
    }
    this.View.setOrganisationsList(organisations, "organisationList");
    this.View.renderOrganisationSection(practice);
};

Controller.prototype.getOrganisation = async function () {
    let nameOrganisation = this.View.getNameOrganisationByTitle();
    let organisation = await this.Model.getOrganisationByName(nameOrganisation);
    return organisation;
};

Controller.prototype.changeStudentStatus = async function (event) {
    this.View.OpenOrCloseLoadImage();
    let student = this.View.getSelectedStudent(event);
    await this.Model.updateRequestOrganisation(student);
    await this.Model.updateRequest(student);

    student['id_status'] = REJECTED;
    await this.Model.updateRequestOrganisationByRequest(student);

    let organisation = await this.getOrganisation();
    await this.getApprovedAndNonApprovedStudents(organisation);
    this.View.OpenOrCloseLoadImage();
};

module.exports = Controller;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const bachelorYear = 4;
const masterYear = 6;
let selectedElem = 0;

var View = function () {
    this.infoGroups = [{
        "name": "МОА",
        "fullName": "02.03.03 «Математическое обеспечение и администрирование информационных систем»",
        "profile": "«Технология программирования»",
        "type": "bachelor"
    }, {
        "name": "ПРИ",
        "fullName": "09.03.04 «Программная инженерия»",
        "profile": "«Разработка программно-информационных систем»",
        "type": "bachelor"
    }, {
        "name": "ИВТ-1",
        "fullName": "09.03.01 «Информатика и вычислительная техника»",
        "profile": "«Программное обеспечение вычислительной техники и автоматизированных систем»",
        "type": "bachelor"
    }, {
        "name": "ИВТ-2",
        "fullName": "09.03.01 «Информатика и вычислительная техника»",
        "profile": "«Программное обеспечение вычислительной техники и автоматизированных систем»",
        "type": "bachelor"
    }, {
        "name": "ИВТ-3",
        "fullName": "09.03.01 «Информатика и вычислительная техника»",
        "profile": "«Программное обеспечение вычислительной техники и автоматизированных систем»",
        "type": "bachelor"
    }, {
        "name": "ПРИ (мг)",
        "fullName": "09.04.04 «Программная инженерия»",
        "profile": "«Проектирование программно-информационных систем»",
        "type": "master"
    }, {
        "name": "ИВТ-1 (мг)",
        "fullName": "09.04.01 «Информатика и вычислительная техника»",
        "profile": "«Компьютерный анализ и интерпретация данных»",
        "type": "master"
    }, {
        "name": "ИВТ-2 (мг)",
        "fullName": "09.04.01 «Информатика и вычислительная техника»",
        "profile": "«Информационное и программное обеспечение вычислительных систем»",
        "type": "master"
    }];
    this.onClickNextStep = null;
    this.onClickPracticeCompleted = null;
    this.onClickCreatePractice = null;
    this.onClickAddPractice = null;
    this.onClickToOrganisationsSection = null;
    this.onClickToStudentsSection = null;
    this.onClickFinishBtn = null;
    this.onClickSelectGroupBtnOk = null;
    this.myTable = $('#studentsListTable');
    this.onClickYearsArray = null;
    this.selectedYear = null;
    this.idTreeViews = ['group-treeview-tabcontrol1-bachelor', 'group-treeview-tabcontrol2-master', 'groups-treeview-practice-creation-bachelor', 'groups-treeview-practice-creation-master', 'group-treeview-tabcontrol1-dialogAdd-bachelor', 'group-treeview-tabcontrol2-dialogAdd-master'];
    this.onClickGetOrganisations = null;
    this.onClickCreateOrganisation = null;
    this.onClickDisplayInfoAboutOrg = null;
    this.onClickDisplayOrganisations = null;
    this.onClickEditOrganisation = null;
    this.onClickApproveStudent = null;
    this.onClickRejectStudent = null;
    this.onClickUpdateOrganisation = null;
    this.onClickAddStudentToOrganisationShowDialog = null;
    this.onClickAddStudentToOrganisation = null;
    this.onClickShowDialogGenerateDocument = null;
    this.onClickGenerateDocument = null;
    this.onChangeTypeDocument = null;
    this.Practice = null;
};

View.prototype.init = function () {
    document.getElementsByClassName("btn-next")[0].addEventListener('click', this.onClickNextStep);
    document.querySelector("#dialogPracticeCompleteSuccess").querySelector("#practiceFinishedOk").addEventListener('click', this.onClickPracticeCompleted);
    document.getElementById("organisationsSectionBtn").addEventListener('click', this.onClickToOrganisationsSection);
    document.getElementById("studentsSectionBtn").addEventListener('click', this.onClickToStudentsSection);
    document.getElementsByClassName("btn-finish")[0].addEventListener('click', this.onClickFinishBtn);
    document.getElementById("getGroupsBtnOk").addEventListener('click', this.onClickSelectGroupBtnOk);
    document.getElementById("buttonsArray").addEventListener('click', this.onClickYearsArray);
    document.getElementById("buttonsArray1").addEventListener('click', this.onClickYearsArray);
    document.getElementById("getOrganisationsBtnOk").addEventListener('click', this.onClickGetOrganisations);
    document.getElementById("createOrganisation").addEventListener('click', this.onClickCreateOrganisation);
    document.getElementById("practiceFinishedOk").addEventListener('click', this.onClickAddPractice);
    document.getElementById("showAllOrganisations").addEventListener('click', this.onClickDisplayOrganisations);
    document.getElementById("updateOrganisation").addEventListener('click', this.onClickUpdateOrganisation);
    document.getElementById("addStudentBtn").addEventListener('click', this.onClickAddStudentToOrganisation);
    document.getElementById("showDialogGenerateDocumentBtn").addEventListener('click', this.onClickShowDialogGenerateDocument);
    document.getElementById("generateDocumentBtn").addEventListener('click', this.onClickGenerateDocument);
    document.getElementById("gdtypeDocument").addEventListener('change', this.onChangeTypeDocument);

    this.myTable.dataTable({
        data: this.Groups,
        "language": {
            "zeroRecords": "Такой записи не существует.",
            "emptyTable": "Ни одна из групп не выбрана либо практики не существует.",
            "search": "Поиск:",
            "paginate": {
                "first": "Первый",
                "last": "Последний",
                "next": "Вперед",
                "previous": "Назад"
            },
            "infoFiltered": "(из _MAX_ студентов)",
            "lengthMenu": "Показать _MENU_ записей",
            "info": "Общее количество студентов: _TOTAL_ ",
            "infoEmpty": "Выберите группу."
        },
        "columns": [{ "data": "group" }, { "data": "student" }, { "data": "organisation" }]
    });
};

View.prototype.goToStudentsSection = function () {
    document.querySelector("#organisationsSection").style.display = "none";
    document.querySelector("#practiceCreationSection").style.display = "none";
    document.querySelector("#mainWindowSection").style.display = "block";

    let treeViews = document.getElementsByClassName("treeview");
    for (let i = 0; i < treeViews.length; i++) {
        treeViews[i].style.display = "block";
    }
};

View.prototype.goToOrganisationsSection = function () {
    document.querySelector("#practiceCreationSection").style.display = "none";
    document.querySelector("#mainWindowSection").style.display = "none";
    document.querySelector("#organisationsSection").style.display = "block";
    document.getElementById("studentsRequests").style.display = "none";
    document.getElementById("allOrganisationsListBlock").style.display = "block";
    document.getElementById("updateOrganisation").removeAttribute("disabled");
};

View.prototype.goToPracticeCreation = function () {
    document.querySelector("#practiceCreationSection").style.display = "block";
    document.querySelector("#mainWindowSection").style.display = "none";
    document.getElementById("updateOrganisation").setAttribute("disabled", "true");
};
/*========================================PRACTICE SECTION==============================================*/
View.prototype.dialogPracticeCreatedInit = function () {
    let finishBtn = document.getElementsByClassName("btn-finish")[0];
    finishBtn.setAttribute("onclick", "metroDialog.open('#dialogPracticeCompleteSuccess')");
    let educationLevel = document.getElementById("selectEducation").value;

    let typePractice = document.getElementById("selectTypePractice").value;

    let lecNum = document.getElementById("lecNum").value;
    let fromDate = document.getElementById("fromDateInput").value;
    let toDate = document.getElementById("toDateInput").value;
    let deadline = document.getElementById("deadline").value;
    document.getElementById("termsPracticeDialog").innerHTML = 'c ' + fromDate + ' по ' + toDate;
    document.getElementById("deadlinePracticeDialog").innerHTML = deadline;
    document.getElementById("mainWindowTermsPractice").innerHTML = fromDate + ' - ' + toDate;
    if (fromDate === "") {
        fromDate = "2000-01-01 21:00:00.000 +00:00";
    } else {
        fromDate = fromDate.substr(8, 4) + '-' + fromDate.substr(4, 2) + '-' + fromDate.substr(0, 2) + ' ' + '21:00:00.000 +00:00';
    }
    if (toDate === "") {
        toDate = "2000-01-01 21:00:00.000 +00:00";
    } else {
        toDate = toDate.substr(8, 4) + '-' + toDate.substr(4, 2) + '-' + toDate.substr(0, 2) + ' ' + '21:00:00.000 +00:00';
    }
    if (deadline === "") {
        deadline = "2000-01-01 21:00:00.000 +00:00";
    } else {
        deadline = deadline.substr(8, 4) + '-' + deadline.substr(4, 2) + '-' + deadline.substr(0, 2) + ' ' + '21:00:00.000 +00:00';
    }

    let treeView = null;
    for (let i = 0; i < this.idTreeViews.length; i++) {
        if (this.idTreeViews[i].indexOf("practice") !== -1 && document.getElementById(this.idTreeViews[i]).style.display === "block") {
            treeView = document.getElementById(this.idTreeViews[i]);
        }
    }
    let arrGroups = this.getSelectedGroups(treeView);
    let arrOrganisations = this.getSelectedGroups(document.getElementById("organisations-treeview-practice-creation"));

    document.getElementById("typePracticeDialog").innerHTML = typePractice;
    document.getElementById("educationalLevelDialog").innerHTML = educationLevel;
    document.getElementById("groupsPracticeDialog").innerHTML = arrGroups;
    document.getElementById("organisationsPracticeDialog").innerHTML = arrOrganisations;

    document.getElementById("mainWindowTypePractice").innerHTML = typePractice + " практика";

    document.getElementById("lecNumDialog").innerHTML = lecNum;
    this.Practice = {
        'typePractice': typePractice,
        'startDatePractice': fromDate,
        'endDatePractice': toDate,
        'deadlinePractice': deadline,
        'lecNum': lecNum,
        'eduLevel': educationLevel,
        'organisations': arrOrganisations,
        'groups': arrGroups,
        'year': this.selectedYear
    };

    return this.Practice;
};

View.prototype.displayGroups = function () {
    let educationLevel = document.getElementById("selectEducation").value;
    if (educationLevel === "bachelor") {
        for (let i = 0; i < this.idTreeViews.length; i++) {
            if (this.idTreeViews[i].indexOf("master") !== -1) {
                document.getElementById(this.idTreeViews[i]).style.display = "none";
            }
            if (this.idTreeViews[i].indexOf("bachelor") !== -1) {
                document.getElementById(this.idTreeViews[i]).style.display = "block";
            }
        }
    } else {
        for (let i = 0; i < this.idTreeViews.length; i++) {
            if (this.idTreeViews[i].indexOf("bachelor") !== -1) {
                document.getElementById(this.idTreeViews[i]).style.display = "none";
            }
            if (this.idTreeViews[i].indexOf("master") !== -1) {
                document.getElementById(this.idTreeViews[i]).style.display = "block";
            }
        }
    }
};
View.prototype.clearPracticeSection = function () {
    document.getElementById("fromDateInput").value = "";
    document.getElementById("toDateInput").value = "";
    document.getElementById("deadline").value = "";
};
/*============================================STUDENTS SECTION=====================================================*/
View.prototype.renderInfo = function (practice) {
    if (practice.length !== 0) {
        let start_year = practice.start_date_practice.substr(0, 4),
            start_month = practice.start_date_practice.substr(5, 2),
            start_day = practice.start_date_practice.substr(8, 2),
            end_year = practice.end_date_practice.substr(0, 4),
            end_month = practice.end_date_practice.substr(5, 2),
            end_day = practice.end_date_practice.substr(8, 2);
        let start_date = start_day + '-' + start_month + '-' + start_year;
        let end_date = end_day + '-' + end_month + '-' + end_year;

        document.getElementById("mainWindowTermsPractice").innerHTML = 'с ' + start_date + ' по ' + end_date;
        let info_about_practice = this.getUserInfoAboutPractice();
        document.getElementById("mainWindowTypePractice").innerHTML = info_about_practice.typePractice + ' практика';
    } else {
        document.getElementById("mainWindowTypePractice").innerHTML = "Практики" + " не существует.";
        document.getElementById("mainWindowTermsPractice").innerHTML = " ";
    }
};
View.prototype.getUserInfoAboutPractice = function () {
    let educationLevel = document.getElementsByClassName("tabcontrol2")[0].getElementsByClassName("active")[0].children[0].text;
    let typePractice = document.getElementById("selectTypePracticeTab").value;
    let info_about_practice = {
        'typePractice': typePractice,
        'year': this.selectedYear,
        'edu_level': educationLevel
    };
    return info_about_practice;
};

View.prototype.getUserInfoAboutPracticeOrgSection = function () {
    let educationLevel = document.getElementById("selectEduLevelOrganisationSec").value;
    let typePractice = document.getElementById("selectTypePracticeOrganisationSec").value;
    let typePracticeText = "Учебная";
    if (typePractice === "educational") {
        typePracticeText = "Учебная";
    } else if (typePractice === "internship") {
        typePracticeText = "Производственная";
    } else if (typePractice === "prediploma") {
        typePracticeText = "Преддипломная";
    }

    let info_about_practice = {
        'typePractice': typePracticeText,
        'year': this.selectedYear,
        'edu_level': educationLevel
    };
    return info_about_practice;
};

View.prototype.renderTable = function (data) {
    if (data === 0) {
        this.myTable.dataTable().fnClearTable();
    } else {
        this.myTable.dataTable().fnClearTable();
        this.myTable.dataTable().fnAddData(data);
    }
};

View.prototype.colorTable = function (data) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].status === 1) {
            $(this.myTable.dataTable().fnGetNodes(i)).addClass("approved_stud");
            this.myTable.dataTable().fnGetNodes(i).children[0].setAttribute("class", "sorting_1 approved_stud");
        }
        if (data[i].status === 0) {
            $(this.myTable.dataTable().fnGetNodes(i)).addClass("applied_stud");
            this.myTable.dataTable().fnGetNodes(i).children[0].setAttribute("class", "sorting_1 applied_stud");
        }
    }
};

View.prototype.changeYear = function (node) {
    if (selectedElem) {
        selectedElem.classList.remove('current');
    }
    selectedElem = node;
    selectedElem.classList.add('current');
    this.selectedYear = selectedElem.innerHTML;
};

View.prototype.updateYear = function (event) {
    var target = event.target;
    while (true) {
        if (target.className === 'item year' || target.className === 'item year current') {
            this.changeYear(target);
            return;
        }
        target = target.parentNode;
    }
};

View.prototype.getSelectedGroups = function (treeView) {
    if (treeView === undefined) {
        let frames = document.getElementsByClassName("frames")[0].children;
        for (let i = 0; i < frames.length; i++) {
            if (frames[i].style.display !== "none") {
                treeView = frames[i].children[0];
                break;
            }
        }
    }
    let Groups = [];
    let liNumber = treeView.querySelectorAll('li');
    for (let i = 0; i < liNumber.length; i++) {
        let groups = liNumber[i].querySelectorAll('input:checked');
        if (groups.length === 1) {
            for (let j = 0; j < groups.length; j++) {
                let group = groups[j].parentElement.nextElementSibling.innerHTML;
                if (group.indexOf("курс") === -1) {
                    Groups.push(group);
                }
            }
        }
    }
    return Groups;
};

async function tree_add_leaf_checkbox_example_click(tree, node, nameLeaf, uid) {
    await tree.addLeaf(node, nameLeaf, {
        mode: 'checkbox',
        checked: false,
        uid: uid
    });
}

View.prototype.removeChildren = function (node) {
    var children = node.childNodes;
    while (children.length) {
        node.removeChild(children[0]);
    }
};

View.prototype.clearGroupsTreeView = async function () {
    var id = 0;
    while (id < this.idTreeViews.length) {
        var liArray = document.getElementById(this.idTreeViews[id]).children[0].children;
        for (let i = 0; i < liArray.length; i++) {
            this.removeChildren(liArray[i].getElementsByTagName('ul')[0]);
        }
        id++;
    }
};
View.prototype.updateGroupsTreeView = async function (courses, groups) {
    let idCounter = 0,
        courseNumber = bachelorYear,
        cnt;
    let coursesName = ['first', 'second', 'third', 'fourth'];
    var i = 0;
    while (idCounter < this.idTreeViews.length) {
        var tree = $("#" + this.idTreeViews[idCounter]).data("treeview");
        if (this.idTreeViews[idCounter].indexOf("master") !== -1) {
            courseNumber = masterYear;
            i = bachelorYear;
        } else {
            courseNumber = bachelorYear;
            i = 0;
        }
        cnt = 0;
        for (i; i < courseNumber; i++) {
            for (let j = 0; j < courses[i].groups.length; j++) {
                let node = tree.element.find('li.' + coursesName[cnt]);

                if (this.idTreeViews[idCounter] === "group-treeview-tabcontrol1-dialogAdd-bachelor" || this.idTreeViews[idCounter] === "group-treeview-tabcontrol2-dialogAdd-master") {
                    node[0].getElementsByTagName("input")[0].setAttribute("disabled", "disabled");
                    await tree_add_leaf_checkbox_example_click(tree, node, courses[i].groups[j]);
                    let elem = node.find('ul')[0].children[node.find('ul')[0].children.length - 1];
                    $(elem).addClass("collapsed");
                    elem.getElementsByTagName("input")[0].setAttribute("disabled", "disabled");
                    let students = 0;
                    for (let k = 0; k < groups.length; k++) {
                        if (courses[i].groups[j] === groups[k].name) {
                            students = groups[k].students;
                            break;
                        }
                    }
                    for (let k = 0; k < students.length; k++) {
                        await tree_add_leaf_checkbox_example_click(tree, $(elem), students[k].name, students[k].uid);
                    }
                    let inputs = elem.querySelectorAll('[data-uid]');
                    for (let k = 0; k < inputs.length; k++) {
                        inputs[k].getElementsByTagName("input")[0].setAttribute("disabled", "disabled");
                    }
                } else {
                    await tree_add_leaf_checkbox_example_click(tree, node, courses[i].groups[j]);
                }
            }
            cnt++;
        }
        idCounter++;
    }
};
View.prototype.myUpdateTreeView = async function (courses, id) {
    let courseNumber = bachelorYear,
        n;
    let coursesName = ['first', 'second', 'third', 'fourth'];
    var i = 0;

    var tree = $("#" + id).data("treeview");
    if (id.indexOf("master") !== -1) {
        courseNumber = masterYear;
        i = bachelorYear;
    } else {
        courseNumber = bachelorYear;
        i = 0;
    }
    n = 0;
    for (i; i < courseNumber; i++) {
        for (let j = 0; j < courses[i].groups.length; j++) {
            let node = tree.element.find('li.' + coursesName[n]);
            tree_add_leaf_checkbox_example_click(tree, node, courses[i].groups[j]);
        }
        n++;
    }
};
View.prototype.getConfigurationPractice = function () {
    let typePractice = document.getElementById("selectTypePracticeOrganisationSec").value;
    let eduLevel = document.getElementById("selectEduLevelOrganisationSec").value;
    let info_about_practice = {
        'typePractice': typePractice,
        'year': this.selectedYear,
        'edu_level': eduLevel
    };
    return info_about_practice;
};

function tree_add_leaf_checkbox(tree, node, nameLeaf, idTypeOrganisation) {
    tree.addLeaf(node, nameLeaf, {
        mode: 'checkbox',
        checked: false
    });
    node.find('ul').find('li').last()[0].setAttribute("id", 'type_org_' + idTypeOrganisation);
}

View.prototype.setTypesOrganisation = function (typesOrganisation) {
    var treeViewOrganisations = $("#organisations-treeview-practice-creation").data("treeview");
    for (let i = 0; i < typesOrganisation.length; i++) {
        let node = treeViewOrganisations.element.find('li.node');
        tree_add_leaf_checkbox(treeViewOrganisations, node, typesOrganisation[i].name, typesOrganisation[i].id);
    }
};
View.prototype.clearTypesOrganisation = function () {
    var liArray = document.getElementById('organisations-treeview-practice-creation').children[0].children;
    for (let i = 0; i < liArray.length; i++) {
        this.removeChildren(liArray[i].getElementsByTagName('ul')[0]);
    }
};
View.prototype.setOrganisationsInTreeView = function (organisations, typesOrganisation) {
    var tree = $("#organisations-treeview-practice-creation").data("treeview");
    for (let i = 0; i < organisations.length; i++) {
        for (let j = 0; j < typesOrganisation.length; j++) {
            if (organisations[i].id_type_organisation === typesOrganisation[j].id) {
                let liArr = tree.element.find('li');
                let node;
                for (let k = 0; k < liArr.length; k++) {
                    if (liArr[k].getAttribute("id") === 'type_org_' + typesOrganisation[j].id) {
                        node = $(liArr[k]);
                        break;
                    }
                }
                tree_add_leaf_checkbox_example_click(tree, node, organisations[i].name);
            }
        }
    }
};

View.prototype.getInfoNewOrganisation = function () {
    var e = document.getElementById("selectTypeCompany");
    var typeOrg = e.options[e.selectedIndex].text;
    let organisation = {
        'name': document.getElementById("nameCompany").value,
        'typeOrg': typeOrg,
        'infoOrg': document.getElementById("infoCompany").value,
        'emailOrg': document.getElementById("emailOrg").value,
        'phoneOrg': document.getElementById("phoneOrg").value,
        'placesOrg': document.getElementById("placesCompany").value,
        'loginOrg': document.getElementById("loginCompany").value,
        'pswdOrg': document.getElementById("pswdCompany").value,
        'addressOrg': document.getElementById("addressOrg").value,
        'id': document.getElementById("idCompany").innerHTML
    };
    return organisation;
};

View.prototype.setTypesOrganisationSelect = function (typesOrganisation) {
    let typeOrg = document.getElementById("selectTypeCompany");
    this.removeChildren(typeOrg);
    for (let i = 0; i < typesOrganisation.length; i++) {
        let option = document.createElement('option');
        option.setAttribute("value", typesOrganisation[i].id);
        option.innerHTML = typesOrganisation[i].name;
        typeOrg.appendChild(option);
    }
};
View.prototype.setOrganisationsList = function (organisations, idList) {
    let listOrg = document.getElementById(idList);
    this.removeChildren(listOrg);
    for (let i = 0; i < organisations.length; i++) {
        let div_list = document.createElement('div');
        div_list.setAttribute("class", "list");

        let div_list_content = document.createElement('div');
        div_list_content.setAttribute("class", "list-content inline-block");
        if (idList === "organisationList") {
            div_list_content.addEventListener("click", this.onClickDisplayInfoAboutOrg);
        }

        let span_list_title = document.createElement('span');
        span_list_title.setAttribute("class", "list-title");
        span_list_title.setAttribute("id_organisation", organisations[i].id);
        span_list_title.innerHTML = organisations[i].name;
        div_list_content.appendChild(span_list_title);

        let span_list_subtitle = document.createElement('span');
        span_list_subtitle.setAttribute("class", "list-subtitle");
        span_list_subtitle.innerHTML = 'Всего мест: ' + organisations[i].max_students_number;
        div_list_content.appendChild(span_list_subtitle);

        let span_list_remark = document.createElement('span');
        span_list_remark.setAttribute("class", "list-remark");
        span_list_remark.innerHTML = 'Осталось: ' + organisations[i].max_students_number;
        /*ОБЯЗАТЕЛЬНО ИСПРАВИТЬ НА КОЛИЧЕСТВО ОСТАВШИХСЯ МЕСТ.!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
        div_list_content.appendChild(span_list_remark);

        div_list.appendChild(div_list_content);

        let div_settings_organisation = document.createElement('div');
        div_settings_organisation.setAttribute("class", "inline-block list-content settingsOrganisation");
        if (idList === "organisationList") {
            let span_user_plus = document.createElement('span');
            span_user_plus.setAttribute("class", "mif-user-plus mif-lg fg-gray add-student-organisation");
            span_user_plus.addEventListener("click", this.onClickAddStudentToOrganisationShowDialog);
            div_settings_organisation.appendChild(span_user_plus);
        }

        let span_pencil = document.createElement('span');
        span_pencil.setAttribute("class", "mif-pencil mif-lg fg-gray edit-organisation");
        span_pencil.addEventListener("click", this.onClickEditOrganisation);
        div_settings_organisation.appendChild(span_pencil);

        /* let span_cancel = document.createElement('span');
         span_cancel.setAttribute("class", "mif-cancel mif-lg fg-yellow");
         div_settings_organisation.appendChild(span_cancel);*/

        div_list.appendChild(div_settings_organisation);

        listOrg.appendChild(div_list);
    }
};
View.prototype.getIdOrganisation = function (event) {
    let idOrganisation = 0;
    if (event.target.id === "updateOrganisation") {
        idOrganisation = +event.target.parentElement.children[1].children[0].children[2].innerHTML;
    } else {
        idOrganisation = event.target.parentElement.parentElement.children[0].children[0].getAttribute("id_organisation");
    }
    return idOrganisation;
};

View.prototype.getNameOrganisationInTreeview = function (idTreeview) {
    let parent = document.getElementById(idTreeview);
    let nameOrganisation = parent.getElementsByClassName("active")[0].querySelector('[id_organisation').innerHTML;
    return nameOrganisation;
};

View.prototype.showDialogOrganisation = function (organisation) {
    document.getElementById("nameCompany").value = organisation.name;
    document.getElementById("idCompany").innerHTML = organisation.id;
    document.getElementById("infoCompany").value = organisation.info_organisation;
    document.getElementById("phoneOrg").value = organisation.phone_organisation;
    document.getElementById("emailOrg").value = organisation.email_organisation;
    document.getElementById("addressOrg").value = organisation.address_organisation;
    document.getElementById("placesCompany").value = organisation.max_students_number;
    document.getElementById("loginCompany").value = organisation.login_organisation;
    document.getElementById("pswdCompany").value = organisation.pswd_organisation;
    metroDialog.open('#dialogCreateCompany');
};
View.prototype.dialogOpen = function (id) {
    metroDialog.open(id);
};
View.prototype.updateOrganisationTitle = function (nameOrganisation, approved_student_count, non_approved_student_count) {
    if (non_approved_student_count === 0) {
        document.getElementById("nonApprovedStudentListTitle").innerHTML = ", пуст";
    } else {
        document.getElementById("nonApprovedStudentListTitle").innerHTML = "";
    }
    document.getElementById("orgName").innerHTML = nameOrganisation;

    if (approved_student_count === 0) {
        document.getElementById("approvedStudentListTitle").innerHTML = "Список утвержденных студентов пуст.";
    } else {
        document.getElementById("approvedStudentListTitle").innerHTML = "Список утвержденных студентов.";
    }
};

View.prototype.getSelectedOrganisation = function (event) {
    let element = event.target;
    while (true) {
        if (element.className === "list-content inline-block") {
            break;
        }
        element = element.parentElement;
    }
    let nameOrganisationClick = element.children[0].innerHTML;
    return nameOrganisationClick;
};

View.prototype.getNameOrganisationByTitle = function () {
    return document.getElementById("orgName").innerHTML;
};

View.prototype.updateStudentsListView = function (students, idList) {
    let listStudents = document.getElementById(idList);
    this.removeChildren(listStudents);
    for (let i = 0; i < students.length; i++) {
        let div_list = document.createElement('div');
        div_list.setAttribute("class", "list");

        let div_list_content = document.createElement('div');
        div_list_content.setAttribute("class", "list-content inline-block");

        let span_list_title = document.createElement('span');
        span_list_title.setAttribute("class", "list-title");
        span_list_title.setAttribute("request", students[i].id_request);
        span_list_title.setAttribute("uid", students[i].uid_student);
        span_list_title.setAttribute("org", students[i].id_organisation);
        span_list_title.innerHTML = students[i].displayName;
        div_list_content.appendChild(span_list_title);

        let span_list_subtitle = document.createElement('span');
        span_list_subtitle.setAttribute("class", "list-subtitle");
        span_list_subtitle.innerHTML = students[i].group_name;
        div_list_content.appendChild(span_list_subtitle);

        let year = students[i].date_creation_request.substr(0, 4),
            month = students[i].date_creation_request.substr(5, 2),
            day = students[i].date_creation_request.substr(8, 2);
        let date = day + '-' + month + '-' + year;

        let span_list_remark = document.createElement('span');
        span_list_remark.setAttribute("class", "list-remark");
        span_list_remark.innerHTML = 'Дата записи: ' + date;
        div_list_content.appendChild(span_list_remark);

        div_list.appendChild(div_list_content);

        let div_settings_organisation = document.createElement('div');
        div_settings_organisation.setAttribute("class", "inline-block list-content settingsOrganisation");

        if (idList !== "approvedStudents") {
            let span_student_approve = document.createElement('span');
            span_student_approve.setAttribute("class", "mif-checkmark mif-lg fg-green");
            span_student_approve.addEventListener("click", this.onClickApproveStudent);
            div_settings_organisation.appendChild(span_student_approve);
        }

        let span_student_reject = document.createElement('span');
        span_student_reject.setAttribute("class", "mif-cancel mif-lg fg-red");
        span_student_reject.addEventListener("click", this.onClickRejectStudent);
        div_settings_organisation.appendChild(span_student_reject);

        div_list.appendChild(div_settings_organisation);

        listStudents.appendChild(div_list);
    }
    document.getElementById("allOrganisationsListBlock").style.display = "none";
    document.getElementById("studentsRequests").style.display = "block";
};

View.prototype.renderOrganisationSection = function (practice) {
    let text = document.getElementById("organisationListCurrentPracticeText");
    if (practice.length !== 0) {
        text.innerHTML = "Список организаций в практике";
    } else {
        text.innerHTML = "Практики не существует.";
    }
};

View.prototype.OpenOrCloseLoadImage = function () {
    let display = document.getElementById("load").style.display;
    if (display === "block") {
        document.getElementById("load").style.display = "none";
    } else {
        document.getElementById("load").style.display = "block";
    }
};
View.prototype.getSelectedStudent = function (event) {
    let node = event.target.parentElement.parentElement.querySelector('[request]');
    let student = {
        'id_request': node.getAttribute("request"),
        'uid_student': node.getAttribute("uid"),
        'id_organisation': node.getAttribute("org")
    };

    if (event.target.getAttribute("class").indexOf("mif-cancel") === 0) {
        student['id_status'] = 2;
    } else {
        student['id_status'] = 1;
    }
    return student;
};
View.prototype.setYearsArray = function (years) {
    let buttonArray = document.getElementById("buttonsArray");
    for (let i = 0; i < years.length; i++) {
        let span = document.createElement('span');
        span.setAttribute("class", "item year");
        span.innerHTML = years[i];
        buttonArray.appendChild(span);
    }
    let span = document.createElement('span');
    span.setAttribute("class", "item year");
    span.setAttribute("id", "createPracticeBtn");
    span.innerHTML = "+";
    buttonArray.appendChild(span);
    document.getElementById("createPracticeBtn").addEventListener('click', this.onClickCreatePractice);
};

View.prototype.getSelectedStudents = function (event) {
    let Students = [];
    let nodes = event.target.parentElement.querySelectorAll('input:checked');
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].parentElement.nextSibling.innerHTML.indexOf("курс") === -1 && isNaN(+nodes[i].parentElement.nextElementSibling.innerHTML.substr(0, 2))) {
            let name = nodes[i].parentElement.nextElementSibling.innerHTML;
            let uid = nodes[i].parentElement.parentElement.getAttribute("data-uid");
            Students.push({
                name: name,
                uid: uid
            });
        }
    }
    return Students;
};

View.prototype.dialogEnableCheckboxes = function (namesGroups, idElement) {
    let parent = document.getElementById(idElement);
    let inputs = parent.querySelectorAll('input');
    for (let i = 0; i < inputs.length; i++) {
        for (let j = 0; j < namesGroups.length; j++) {
            if (inputs[i].parentElement.nextSibling.innerHTML === namesGroups[j]) {
                let course = inputs[i].parentElement.parentElement.parentElement.parentElement;
                if (course.getAttribute("data-mode") === "checkbox" && course.getAttribute("class").indexOf("active-course") === -1) {
                    $(course).addClass("active-course");
                }
                inputs[i].removeAttribute("disabled");
                let studentsCheckboxes = inputs[i].parentElement.parentElement.querySelectorAll('[data-uid]');
                for (let n = 0; n < studentsCheckboxes.length; n++) {
                    studentsCheckboxes[n].querySelector('input').removeAttribute("disabled");
                }
            }
        }
    }
};

View.prototype.getElemById = function (id) {
    let elem = document.getElementById(id);
    return elem;
};

View.prototype.createInputsOrder = function (selectedGroups) {
    let parent = document.getElementById("order-block");
    this.removeChildren(parent);
    let h4 = document.createElement("h4");
    h4.innerHTML = "Руководители";
    h4.setAttribute("class", "align-center");
    parent.appendChild(h4);
    for (let i = 0; i < selectedGroups.length; i++) {
        let div = document.createElement("div");
        div.setAttribute("class", "field margin20");

        let p = document.createElement("p");
        p.setAttribute("class", "inline-block sub-header");
        p.innerHTML = selectedGroups[i];
        div.appendChild(p);

        let input = document.createElement("input");
        input.setAttribute("groupName", selectedGroups[i]);
        div.appendChild(input);

        parent.appendChild(div);
    }
};

View.prototype.createInputsReport = function (selectedGroups) {
    let parent = document.getElementById("groups-report-block");
    this.removeChildren(parent);
    let h4 = document.createElement("h4");
    h4.innerHTML = "Информация по каждой группе";
    h4.setAttribute("class", "align-center");
    parent.appendChild(h4);
    for (let i = 0; i < selectedGroups.length; i++) {
        let h4 = document.createElement("h4");
        h4.innerHTML = selectedGroups[i];
        h4.setAttribute("class", "align-center");
        parent.appendChild(h4);

        let div = document.createElement("div");
        div.setAttribute("class", "field margin20");
        let p = document.createElement("p");
        p.setAttribute("class", "inline-block sub-header");
        p.innerHTML = "Руководитель";
        div.appendChild(p);
        let input = document.createElement("input");
        div.appendChild(input);
        parent.appendChild(div);

        div = document.createElement("div");
        div.setAttribute("class", "field margin20");
        p = document.createElement("p");
        p.setAttribute("class", "inline-block sub-header");
        p.innerHTML = "Студ. (4 и 5)";
        div.appendChild(p);
        input = document.createElement("input");
        div.appendChild(input);
        parent.appendChild(div);

        div = document.createElement("div");
        div.setAttribute("class", "field margin20");
        p = document.createElement("p");
        p.setAttribute("class", "inline-block sub-header");
        p.innerHTML = "Кол-во лекций";
        div.appendChild(p);
        input = document.createElement("input");
        div.appendChild(input);
        parent.appendChild(div);
    }
};

View.prototype.getInformationForDocumentOrder = function (practice, selectedGroups, allGroups) {
    let treeView = 0;
    let groupsForDocument = [];
    let frames = document.getElementsByClassName("frames")[0].children;
    for (let i = 0; i < frames.length; i++) {
        if (frames[i].style.display !== "none") {
            treeView = frames[i].children[0];
            break;
        }
    }
    let educational_level = treeView.getAttribute("id");
    if (educational_level.indexOf("bachelor") !== -1) {
        educational_level = "bachelor";
    } else {
        educational_level = "master";
    }
    let blockTeachers = document.getElementById("order-block").getElementsByTagName('div');
    let teachers = [];
    for (let i = 0; i < blockTeachers.length; i++) {
        let groupName = blockTeachers[i].children[0].innerHTML;
        let teacher = blockTeachers[i].children[1].value;
        for (let j = 0; j < selectedGroups.length; j++) {
            if (selectedGroups[j] === groupName) teachers.push({
                "groupName": groupName,
                "teacher": teacher
            });
        }
    }
    for (let i = 0; i < selectedGroups.length; i++) {
        for (let j = 0; j < this.infoGroups.length; j++) {
            if (selectedGroups[i].indexOf(this.infoGroups[j].name) !== -1 && this.infoGroups[j].type === educational_level) {
                for (let n = 0; n < allGroups.length; n++) {
                    if (selectedGroups[i] === allGroups[n].name) {
                        for (let k = 0; k < teachers.length; k++) {
                            if (selectedGroups[i] === teachers[k].groupName) {
                                allGroups[n].teacher = teachers[k].teacher;
                                allGroups[n].type = this.infoGroups[j].type;
                                allGroups[n].fullName = this.infoGroups[j].fullName;
                                allGroups[n].profile = this.infoGroups[j].profile;
                                groupsForDocument.push(allGroups[n]);
                            }
                        }
                    }
                }
            }
        }
    }
    let dean = document.getElementById("dean").value;
    let head_of_department = document.getElementById("head_of_department").value;
    let type_document = document.getElementById("gdtypeDocument").options[document.getElementById("gdtypeDocument").selectedIndex].value;
    let documents = [];
    let typePractice = document.getElementById("selectTypePracticeTab").value;
    typePractice = typePractice.replaceAt(typePractice.length - 1, "й");
    typePractice = typePractice.replaceAt(typePractice.length - 2, "о");
    typePractice = typePractice.toLowerCase();

    let start_year = practice.start_date_practice.substr(0, 4),
        start_month = practice.start_date_practice.substr(5, 2),
        start_day = practice.start_date_practice.substr(8, 2),
        end_year = practice.end_date_practice.substr(0, 4),
        end_month = practice.end_date_practice.substr(5, 2),
        end_day = practice.end_date_practice.substr(8, 2);

    let start_date = start_day + '.' + start_month + '.' + start_year;
    let end_date = end_day + '.' + end_month + '.' + end_year;

    for (let i = 0; i < groupsForDocument.length; i++) {
        let students = groupsForDocument[i].students;
        let str = JSON.stringify(students, ["name"]);
        students = JSON.parse(str);
        let document = {
            "direction": groupsForDocument[i].fullName,
            "profile": groupsForDocument[i].profile,
            "dean": dean,
            "head_of_department": head_of_department,
            "type_practice": typePractice,
            "start_date": start_date,
            "end_date": end_date,
            "group_name": groupsForDocument[i].name,
            "supervisor": groupsForDocument[i].teacher,
            "students": students
        };
        documents.push(document);
    }
    return documents;
};

View.prototype.getInformationForDocumentReport = function (practice, selectedGroups, allGroups) {
    let treeView = 0;
    let groupsForDocument = [];
    let frames = document.getElementsByClassName("frames")[0].children;
    for (let i = 0; i < frames.length; i++) {
        if (frames[i].style.display !== "none") {
            treeView = frames[i].children[0];
            break;
        }
    }
    let educational_level = treeView.getAttribute("id");
    if (educational_level.indexOf("bachelor") !== -1) {
        educational_level = "bachelor";
    } else {
        educational_level = "master";
    }
    let blockTeachers = document.getElementById("order-block").getElementsByTagName('div');
    let teachers = [];
    for (let i = 0; i < blockTeachers.length; i++) {
        let groupName = blockTeachers[i].children[0].innerHTML;
        let teacher = blockTeachers[i].children[1].value;
        for (let j = 0; j < selectedGroups.length; j++) {
            if (selectedGroups[j] === groupName) teachers.push({
                "groupName": groupName,
                "teacher": teacher
            });
        }
    }
    for (let i = 0; i < selectedGroups.length; i++) {
        for (let j = 0; j < this.infoGroups.length; j++) {
            if (selectedGroups[i].indexOf(this.infoGroups[j].name) !== -1 && this.infoGroups[j].type === educational_level) {
                for (let n = 0; n < allGroups.length; n++) {
                    if (selectedGroups[i] === allGroups[n].name) {
                        for (let k = 0; k < teachers.length; k++) {
                            if (selectedGroups[i] === teachers[k].groupName) {
                                allGroups[n].teacher = teachers[k].teacher;
                                allGroups[n].type = this.infoGroups[j].type;
                                allGroups[n].fullName = this.infoGroups[j].fullName;
                                allGroups[n].profile = this.infoGroups[j].profile;
                                groupsForDocument.push(allGroups[n]);
                            }
                        }
                    }
                }
            }
        }
    }
    let dean = document.getElementById("dean").value;
    let head_of_department = document.getElementById("head_of_department").value;
    let type_document = document.getElementById("gdtypeDocument").options[document.getElementById("gdtypeDocument").selectedIndex].value;
    let documents = [];
    let typePractice = document.getElementById("selectTypePracticeTab").value;
    typePractice = typePractice.replaceAt(typePractice.length - 1, "й");
    typePractice = typePractice.replaceAt(typePractice.length - 2, "о");
    typePractice = typePractice.toLowerCase();

    let start_year = practice.start_date_practice.substr(0, 4),
        start_month = practice.start_date_practice.substr(5, 2),
        start_day = practice.start_date_practice.substr(8, 2),
        end_year = practice.end_date_practice.substr(0, 4),
        end_month = practice.end_date_practice.substr(5, 2),
        end_day = practice.end_date_practice.substr(8, 2);

    let start_date = start_day + '.' + start_month + '.' + start_year;
    let end_date = end_day + '.' + end_month + '.' + end_year;

    for (let i = 0; i < groupsForDocument.length; i++) {
        let students = groupsForDocument[i].students;
        let str = JSON.stringify(students, ["name"]);
        students = JSON.parse(str);
        let document = {
            "direction": groupsForDocument[i].fullName,
            "profile": groupsForDocument[i].profile,
            "dean": dean,
            "head_of_department": head_of_department,
            "type_practice": typePractice,
            "start_date": start_date,
            "end_date": end_date,
            "group_name": groupsForDocument[i].name,
            "supervisor": groupsForDocument[i].teacher,
            "students": students
        };
        documents.push(document);
    }
    return documents;
};
View.prototype.getSelectValue = function (id) {
    let value = document.getElementById(id).options[document.getElementById(id).selectedIndex].value;
    return value;
};

View.prototype.changeDisplay = function (id, value) {
    let elem = document.getElementById(id);
    elem.style.display = value;
};

View.prototype.changeInnerHtml = function (id, value) {
    let elem = document.getElementById(id);
    elem.innerHTML = value;
};

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

module.exports = View;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const SEPTEMBER = 9;
const firstCourse = 0;
const secondCourse = 1;
const thirdCourse = 2;
const fourthCourse = 3;
const masterFirstCourse = 4;
const masterSecondCourse = 5;
const REJECTED = 2;
const APPROVED = 1;
const APPLY = 0;
var Model = function () {
  this.Groups = [];
  this.Students = [];
  this.Courses = [];
  this.typesOrganisation = [];
  this.Organisations = [];
};

class Course {
  constructor(nameCourse) {
    this.nameCourse = nameCourse;
    this.groups = [];
  }

  addGroup(group) {
    this.groups.push(group);
  }
}

class Group {
  constructor(uid_LDAP, nameGroup) {
    this.name = nameGroup;
    this.uid_LDAP = uid_LDAP;
    this.students = [];
  }

  addStudent(student) {
    this.students.push(student);
  }
}

/*============================================STUDENTS SECTION=====================================================*/
Model.prototype.getData = async function (selectedGroups, requests_organisations) {
  let data = [];
  for (let i = 0, l = 0; i < this.Groups.length; ++i) {
    for (let j = 0; j < selectedGroups.length; ++j) {
      if (this.Groups[i].name === selectedGroups[j]) {
        for (let k = 0; k < this.Groups[i].students.length; ++k, ++l) {
          let isStudentApply = false;
          data.push({ group: this.Groups[i].name });
          data[l].organisation = ' ';
          for (let w = 0; w < requests_organisations.length; ++w) {
            for (let n = 0; n < requests_organisations[w].length; ++n) {
              if (this.Groups[i].students[k].id_request === +requests_organisations[w][n].id_request) {
                data[l].student = this.Groups[i].students[k].name;
                data[l].student_UID = this.Groups[i].students[k].uid;
                if (requests_organisations[w][n].id_status === 1) {
                  data[l].status = requests_organisations[w][n].id_status;
                  data[l].organisation = requests_organisations[w][n].name_organisation;
                  isStudentApply = true;
                  break;
                } else {
                  data[l].organisation += requests_organisations[w][n].name_organisation + ', ';
                  isStudentApply = true;
                }
              }
            }
          }
          if (!isStudentApply) {
            data[l].student = this.Groups[i].students[k].name;
            data[l].student_UID = this.Groups[i].students[k].uid;
            data[l].organisation = "Не записался";
          }
        }
      }
    }
  }
  return data;
};

Model.prototype.getGroups = async function () {
  let result = await fetch('/proxy/core/v1/groups');
  let list = await result.json();
  let groups = list._embedded.groups;
  return groups;
};

Model.prototype.getGroupsByPracticeId = async function (practice) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let info = "?id_practice=" + practice.id_practice;
  let result = await fetch('/groups-by-practice-id' + info, params);
  let groups_uids = await result.json();
  return groups_uids;
};

Model.prototype.getGroupsNameByGroupsUID = async function (uidsGroups) {
  let groups = [];
  for (let i = 0; i < uidsGroups.length; ++i) {
    for (let j = 0; j < this.Groups.length; ++j) {
      if (+uidsGroups[i].uid_group === this.Groups[j].uid_LDAP) {
        groups.push(this.Groups[j].name);
      }
    }
  }
  return groups;
};
/*получаем студентов из хранилища LDAP по ID группы*/
/*Model.prototype.getStudentsByGroupId = async function (groupID) {
  let result = await fetch('/proxy/core/v1/groups/' + groupID);
  let list = await result.json();
  let studentsList = list._embedded.students;
  return studentsList;
};*/

Model.prototype.getStudentsByUID = async function (students_info) {
  let students = [],
      urls = [];
  for (let i = 0; i < students_info.length; ++i) {
    urls.push('/proxy/core/v1/people/' + students_info[i].uid_student);
  }
  await Promise.all(urls.map(url => fetch(url).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
    const resLength = results.length;
    for (let i = 0; i < resLength; ++i) {
      students.push({
        displayName: results[i].displayName,
        group_name: results[i]._links.groups[0].name,
        group_UID: results[i]._links.groups[0].id,
        date_creation_request: students_info[i].date_creation,
        id_request: students_info[i].id_request,
        uid_student: students_info[i].uid_student,
        id_organisation: students_info[i].id_organisation
      });
    }
  });
  return students;
};
Model.prototype.init = async function () {
  let groups = await this.getGroups();
  let urls = [];
  for (let i = 0; i < groups.length; i++) {
    this.Groups.push(new Group(groups[i].id, groups[i].name));
    urls.push('/proxy/core/v1/groups/' + groups[i].id);
  }
  await this.getStudentsByGroupIds(urls);
};

Model.prototype.getStudentsByGroupIds = async function (urls) {
  await Promise.all(urls.map(url => fetch(url).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
    const resLength = results.length;
    for (let i = 0; i < resLength; i++) {
      let students = results[i]._embedded.students;
      const stLength = students.length;
      for (let j = 0; j < stLength; j++) {
        let student = {
          'name': students[j].displayName,
          'uid': students[j].uid
        };
        this.Groups[i].students.push(student);
      }
    }
  });
};

Model.prototype.getCurrentYear = function () {
  let date = new Date();
  let currentYear = date.getFullYear().toString();
  return currentYear;
};

Model.prototype.distributeGroupsByCourses = async function (currentYear) {
  this.Courses = [new Course('1'), new Course('2'), new Course('3'), new Course('4'), new Course('1 (мг)'), new Course('2 (мг)')];
  let date = new Date();
  let currentMonth = date.getMonth();
  if (+currentMonth < SEPTEMBER) {
    currentYear -= 1;
  }

  for (let i = 0; i < this.Groups.length; i++) {
    if (this.Groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
      if (this.Groups[i].name.indexOf("мг") !== -1) {
        this.Courses[masterFirstCourse].addGroup(this.Groups[i].name);
      } else {
        this.Courses[firstCourse].addGroup(this.Groups[i].name);
      }
    }
    currentYear--;
    if (this.Groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
      if (this.Groups[i].name.indexOf("мг") !== -1) {
        this.Courses[masterSecondCourse].addGroup(this.Groups[i].name);
      } else {
        this.Courses[secondCourse].addGroup(this.Groups[i].name);
      }
    }
    currentYear--;
    if (this.Groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
      if (this.Groups[i].name.indexOf("мг") === -1) {
        this.Courses[thirdCourse].addGroup(this.Groups[i].name);
      }
    }
    currentYear--;
    if (this.Groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
      if (this.Groups[i].name.indexOf("мг") === -1) {
        this.Courses[fourthCourse].addGroup(this.Groups[i].name);
      }
    }
    currentYear += 3;
  }
};
Model.prototype.getPractice = async function (info_about_practice) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  info_about_practice = "?year=" + info_about_practice.year + "&edu_level=" + info_about_practice.edu_level + "&typePractice=" + info_about_practice.typePractice;
  let info = 0;
  let result = await fetch('/practice' + info_about_practice, params).then(response => {
    info = response.json();
  }).catch(response => {
    console.log(response);
  });
  return info;
};
Model.prototype.getRequestByStudentUID = async function (practice, student) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let info = '?uid=' + student.uid + "&id_practice=" + practice.id_practice;
  let result = await fetch('/requst-by-student-uid' + info, params);
  let request = await result.json();
  return request;
};

Model.prototype.updateIdOrganisationInRequest = async function (student) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let info = '?id_request=' + student.id_request + "&id_organisation=" + student.id_organisation;
  let result = await fetch('/update-request' + info, params);
};

Model.prototype.getRequests = async function (practice, groups) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let requests = [];
  let urls = [];
  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groups[i].students.length; j++) {
      let info = '?id_student=' + groups[i].students[j].uid + "&id_practice=" + practice.id_practice;
      urls.push('/requsts-by-student-practice' + info);
    }
  }

  await Promise.all(urls.map(url => fetch(url, params).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
    for (let i = 0; i < results.length; ++i) {
      requests.push(results[i]);
    }
  });
  return requests; //получили all заявок студентов выбранных групп
};

Model.prototype.assosiateRequestToStudent = async function (requests, groups) {
  for (let i = 0; i < this.Groups.length; ++i) {
    for (let j = 0; j < groups.length; ++j) {
      if (this.Groups[i].name === groups[j]) {
        for (let k = 0; k < this.Groups[i].students.length; ++k) {
          for (let n = 0; n < requests.length; ++n) {
            if (this.Groups[i].students[k].uid === requests[n].uid_student) {
              this.Groups[i].students[k].id_request = requests[n].id_request;
              if (requests[n].id_organisation !== null) {
                this.Groups[i].students[k].id_organisation = requests[n].id_organisation;
              }
            }
          }
        }
      }
    }
  }
};

Model.prototype.getRequestsOrganisations = async function (selectedGroups) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let urls = [];
  let organisations_by_request = [];
  for (let i = 0; i < this.Groups.length; ++i) {
    for (let j = 0; j < selectedGroups.length; ++j) {
      if (this.Groups[i].name === selectedGroups[j]) {
        for (let k = 0; k < this.Groups[i].students.length; ++k) {
          urls.push('/organisations-by-request' + '?id_request=' + this.Groups[i].students[k].id_request);
        }
      }
    }
  }
  await Promise.all(urls.map(url => fetch(url, params).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
    for (let i = 0; i < results.length; ++i) {
      organisations_by_request.push(results[i]);
    }
  });
  return organisations_by_request;
};
Model.prototype.getRequestByStudentUIDS = async function (practice, students) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let urls = [];
  let requests = [];
  for (let i = 0; i < students.length; i++) {
    urls.push('/requst-by-student-uid' + '?uid=' + students[i].uid + "&id_practice=" + practice.id_practice);
  }
  await Promise.all(urls.map(url => fetch(url, params).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
    for (let i = 0; i < results.length; ++i) {
      requests.push(results[i]);
    }
  });

  return requests;
};
Model.prototype.getPracticeYears = async function () {
  let result = await fetch('/years-practice');
  let years = await result.json();
  return years;
};

/*============================================PRACTICE CREATION
 SECTION=====================================================*/
Model.prototype.getTypesOrganisation = async function () {
  this.typesOrganisation = [];
  let result = await fetch('/types-organisation');
  let types = await result.json();
  this.typesOrganisation = types;
  return this.typesOrganisation;
};

Model.prototype.getOrganisations = async function () {
  let result = await fetch('/organisations');
  let orgs = await result.json();
  this.Organisations = orgs;
  return this.Organisations;
};

Model.prototype.getOrganisationsByPracticeId = async function (practice) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let info = '?id_practice=' + practice.id_practice;
  let result = await fetch('/organisations-by-practice' + info, params);
  let organisations = await result.json();
  return organisations;
};

Model.prototype.getOrganisationById = async function (id) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let info = '?id=' + id;
  let result = await fetch('/organisation-by-id' + info, params);
  let organisation = await result.json();
  return organisation;
};

Model.prototype.getRequestsByOrganisationName = async function (organisation, practice, isApproved) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let info = 0,
      STATUS;
  if (!isApproved) {
    info = "?id_practice=" + practice.id_practice;
    STATUS = 0;
  } else {
    info = "?id_practice=" + practice.id_practice + "&id_organisation=" + organisation.id;
    STATUS = 1;
  }
  let result = await fetch('/requests-by-practice' + info, params);
  let requests = await result.json();
  let students = [];
  let urls = [];
  for (let i = 0; i < requests.length; i++) {
    urls.push("/exist-request?id_request=" + requests[i].id_request + "&id_organisation=" + organisation.id);
  }
  await Promise.all(urls.map(url => fetch(url, params).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
    const resLength = results.length;
    for (let i = 0; i < resLength; i++) {
      if (results[i] !== 'Not found') {
        if (results[i].id_status === STATUS) {
          students.push({
            id_request: results[i].id_request,
            id_organisation: results[i].id_organisation,
            id_status: results[i].id_status,
            uid_student: requests[i].uid_student,
            id_practice: requests[i].id_practice,
            id_review: requests[i].id_review,
            date_creation: results[i].date_creation
          });
        }
      }
    }
  });
  return students;
};

Model.prototype.getOrganisationByName = async function (nameOrganisation) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let info = '?name=' + nameOrganisation;
  let result = await fetch('/organisation-by-name' + info, params);
  let organisation = await result.json();
  return organisation;
};

Model.prototype.getDeterminedGroups = async function (selectedGroups) {
  let determinedGroups = [];
  for (let i = 0; i < this.Groups.length; i++) {
    for (let j = 0; j < selectedGroups.length; j++) {
      if (this.Groups[i].name === selectedGroups[j]) {
        determinedGroups.push(this.Groups[i]);
      }
    }
  }
  return determinedGroups;
};

Model.prototype.createOrganisation = async function (organisation) {
  let result = await fetch('/organisation-create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(organisation)
  }).catch(function (error) {
    alert("Ошибка при добавлении организации в БД " + error);
  });
};

Model.prototype.updateOrganisation = async function (organisation) {
  let result = await fetch('/organisation-update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(organisation)
  }).catch(function (error) {
    alert("Ошибка при добавлении организации в БД " + error);
  });
};

Model.prototype.createPractice = async function (practice) {
  let result = await fetch('/practice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(practice)
  }).catch(function (error) {
    alert("Ошибка при добавлении практики в БД " + error);
  });
};

Model.prototype.createOrUpdateStudents = async function (students) {
  let result = await fetch('/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(students)
  }).catch(function (error) {
    alert("Ошибка при добавлении uid студентов в БД " + error);
  });
};

Model.prototype.updateRequestOrganisation = async function (student) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let date = new Date();
  var currentDate = date.format("yyyy-mm-dd");
  let info = '?id_request=' + student.id_request + "&id_organisation=" + student.id_organisation + "&id_status=" + student.id_status + "&date_creation=" + currentDate;
  await fetch('/update-request-organisation' + info, params);
};

Model.prototype.updateRequestsOrganisation = async function (students) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let urls = [];
  let date = new Date();
  var currentDate = date.format("yyyy-mm-dd");
  for (let i = 0; i < students.length; i++) {
    let info = '?id_request=' + students[i].id_request + "&id_organisation=" + students[i].id_organisation + "&id_status=" + students[i].id_status + "&date_creation=" + currentDate;
    urls.push('/update-request-organisation' + info);
  }

  await Promise.all(urls.map(url => fetch(url, params).catch(err => err)));
};

Model.prototype.updateRequestOrganisationByRequest = async function (student) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };

  let info = '?id_request=' + student.id_request + "&id_status=" + student.id_status + "&id_organisation=" + student.id_organisation;
  await fetch('/update-request-organisation-by-request' + info, params);
};
Model.prototype.updateRequestsOrganisationByRequest = async function (students) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let urls = [];
  for (let i = 0; i < students.length; i++) {
    let info = '?id_request=' + students[i].id_request + "&id_organisation=" + students[i].id_organisation + "&id_status=" + students[i].id_status;
    urls.push('/update-request-organisation-by-request' + info);
  }
  await Promise.all(urls.map(url => fetch(url, params).catch(err => err)));
};
Model.prototype.insertRequestOrganisation = async function (student) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let date = new Date();
  var currentDate = date.format("yyyy-mm-dd");
  let info = '?id_request=' + student.id_request + "&id_organisation=" + student.id_organisation + "&id_status=" + student.id_status + "&date_creation=" + currentDate;
  await fetch('/insert-request-organisation' + info, params);
};

Model.prototype.updateRequest = async function (student) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let info = 0;
  if (student.id_status === REJECTED) {
    info = '?id_request=' + student.id_request + "&id_organisation=null";
  } else {
    info = '?id_request=' + student.id_request + "&id_organisation=" + student.id_organisation;
  }
  await fetch('/update-request' + info, params);
};
Model.prototype.updateRequests = async function (students) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let info = 0;
  let urls = [];

  for (let i = 0; i < students.length; i++) {
    let info = 0;
    if (students[i].id_status === REJECTED) {
      info = '?id_request=' + students[i].id_request + "&id_organisation=null";
    } else {
      info = '?id_request=' + students[i].id_request + "&id_organisation=" + students[i].id_organisation;
    }
    urls.push('/update-request' + info);
  }

  await Promise.all(urls.map(url => fetch(url, params).catch(err => err)));
};

Model.prototype.generateDocument = async function (document, type_document, type_practice) {
  type_practice = type_practice.toLowerCase();
  let information = {
    data: document,
    type_document: type_document,
    type_practice: type_practice
  };
  let result = await fetch('/document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(information)
  }).then(function (resp) {
    return resp.blob();
  }).then(function (blob) {
    saveAs(blob, type_document + ' ' + type_practice + ' практика ' + document.group_name + ".docx");
  }).catch(function (error) {
    alert("Ошибка при генерации документа " + error);
  });
  debugger;
};
module.exports = Model;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDNkODczMDEyMDIzNjM2YzM4NGNmIiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9saWJzL0RhdGFUYWJsZXMvZGF0YXRhYmxlcy5taW4uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzZDg3MzAxMjAyMzYzNmMzODRjZiIsImNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlICgnLi9Db250cm9sbGVyLmpzJyk7XHJcblxyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzJyk7XHJcbnJlcXVpcmUoJy4vbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcycpO1xyXG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcclxuXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gIG5ldyBDb250cm9sbGVyKCk7XHJcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvbWFpbi5qcyIsImNvbnN0IFZpZXcgPSByZXF1aXJlKCcuL1ZpZXcuanMnKTtcclxuY29uc3QgTW9kZWwgPSByZXF1aXJlKCcuL01vZGVsLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBDb250cm9sbGVyKCkge1xyXG4gICAgdGhpcy5WaWV3ID0gbmV3IFZpZXcoKTtcclxuICAgIHRoaXMuTW9kZWwgPSBuZXcgTW9kZWwoKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG5jb25zdCBBUFBST1ZFRCA9IDE7XHJcbmNvbnN0IFJFSkVDVEVEID0gMjtcclxuQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgYXdhaXQgdGhpcy5zZXRZZWFycygpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tOZXh0U3RlcCA9IHRoaXMuZGlzcGxheUdyb3Vwcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tDcmVhdGVQcmFjdGljZSA9IHRoaXMuZ29Ub1ByYWN0aWNlQ3JlYXRpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQWRkUHJhY3RpY2UgPSB0aGlzLmNyZWF0ZVByYWN0aWNlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSB0aGlzLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbi5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbiA9IHRoaXMuZ29Ub1N0dWRlbnRzU2VjdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tGaW5pc2hCdG4gPSB0aGlzLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrU2VsZWN0R3JvdXBCdG5PayA9IHRoaXMucmVuZGVyRGF0YUluVGFibGUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrWWVhcnNBcnJheSA9IHRoaXMuc2V0R3JvdXBzVHJlZVZpZXcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyA9IHRoaXMuZ2V0T3JnYW5pc2F0aW9ucy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tDcmVhdGVPcmdhbmlzYXRpb24gPSB0aGlzLnVwZGF0ZVRyZWVWaWV3LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0Rpc3BsYXlJbmZvQWJvdXRPcmcgPSB0aGlzLmRpc3BsYXlJbmZvQWJvdXRPcmcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrRGlzcGxheU9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbi5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tFZGl0T3JnYW5pc2F0aW9uID0gdGhpcy5zaG93RGlhbG9nRWRpdE9yZ2FuaXNhdGlvbi5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tVcGRhdGVPcmdhbmlzYXRpb24gPSB0aGlzLnVwZGF0ZU9yZ2FuaXNhdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tBcHByb3ZlU3R1ZGVudCA9IHRoaXMuY2hhbmdlU3R1ZGVudFN0YXR1cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tSZWplY3RTdHVkZW50ID0gdGhpcy5jaGFuZ2VTdHVkZW50U3RhdHVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvblNob3dEaWFsb2cgPSB0aGlzLmFkZFN0dWRlbnRUb09yZ2FuaXNhdGlvblNob3dEaWFsb2cuYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uID0gdGhpcy5hZGRTdHVkZW50VG9PcmdhbmlzYXRpb24uYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrU2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQgPSB0aGlzLnNob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50LmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0dlbmVyYXRlRG9jdW1lbnQgPSB0aGlzLmdlbmVyYXRlRG9jdW1lbnQuYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNoYW5nZVR5cGVEb2N1bWVudCA9IHRoaXMuaW5pdERpYWxvZy5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3LmluaXQoKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwuaW5pdCgpO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcblxyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdERpYWxvZyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCB0eXBlX2RvY3VtZW50ID0gdGhpcy5WaWV3LmdldFNlbGVjdFZhbHVlKFwiZ2R0eXBlRG9jdW1lbnRcIik7XHJcbiAgICBsZXQgaXNPcmRlcj1mYWxzZTtcclxuICAgIGlmICh0eXBlX2RvY3VtZW50ID09PSBcItCf0YDQuNC60LDQt1wiKSB7XHJcbiAgICAgICAgaXNPcmRlcj10cnVlO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlSW5wdXRzKGlzT3JkZXIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaXNPcmRlcj1mYWxzZTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlucHV0cyhpc09yZGVyKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmNyZWF0ZUlucHV0cyA9IGZ1bmN0aW9uIChpc09yZGVyKSB7XHJcbiAgICBsZXQgc2VsZWN0ZWRHcm91cHMgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRHcm91cHMoKTtcclxuICAgIGlmKGlzT3JkZXIpey8v0L/RgNC40LrQsNC3XHJcbiAgICAgICAgbGV0IGJsb2NrPXRoaXMuVmlldy5nZXRFbGVtQnlJZChcImdyb3Vwcy1yZXBvcnQtYmxvY2tcIik7XHJcbiAgICAgICAgdGhpcy5WaWV3LnJlbW92ZUNoaWxkcmVuKGJsb2NrKTtcclxuICAgICAgICB0aGlzLlZpZXcuY2hhbmdlRGlzcGxheShcInJlcG9ydC1ibG9ja1wiLFwibm9uZVwiKTtcclxuICAgICAgICB0aGlzLlZpZXcuY2hhbmdlRGlzcGxheShcIm9yZGVyLWJsb2NrXCIsXCJibG9ja1wiKTtcclxuICAgICAgICB0aGlzLlZpZXcuY3JlYXRlSW5wdXRzT3JkZXIoc2VsZWN0ZWRHcm91cHMpO1xyXG4gICAgICAgIHRoaXMuVmlldy5jaGFuZ2VJbm5lckh0bWwoXCJ0eXBlRG9jdW1lbnRcIixcItC/0YDQuNC60LDQt9CwXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZXsvL9C+0YLRh9C10YJcclxuICAgICAgICBsZXQgYmxvY2s9dGhpcy5WaWV3LmdldEVsZW1CeUlkKFwib3JkZXItYmxvY2tcIik7XHJcbiAgICAgICAgdGhpcy5WaWV3LnJlbW92ZUNoaWxkcmVuKGJsb2NrKTtcclxuICAgICAgICB0aGlzLlZpZXcuY3JlYXRlSW5wdXRzUmVwb3J0KHNlbGVjdGVkR3JvdXBzKTtcclxuICAgICAgICB0aGlzLlZpZXcuY2hhbmdlRGlzcGxheShcInJlcG9ydC1ibG9ja1wiLFwiYmxvY2tcIik7XHJcbiAgICAgICAgdGhpcy5WaWV3LmNoYW5nZURpc3BsYXkoXCJvcmRlci1ibG9ja1wiLFwibm9uZVwiKTtcclxuICAgICAgICB0aGlzLlZpZXcuY2hhbmdlSW5uZXJIdG1sKFwidHlwZURvY3VtZW50XCIsXCLQvtGC0YfQtdGC0LBcIik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5zaG93RGlhbG9nR2VuZXJhdGVEb2N1bWVudCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBsZXQgZ3JvdXBzUHJhY3RpY2VQYXJ0aWNpcGFudHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldEdyb3Vwc0J5UHJhY3RpY2VJZChcclxuICAgICAgICAgICAgcHJhY3RpY2UpO1xyXG4gICAgICAgIGlmIChncm91cHNQcmFjdGljZVBhcnRpY2lwYW50cy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5WaWV3LmRpYWxvZ09wZW4oXCIjZGlhbG9nR2VuZXJhdGVSZXBvcnRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgYWxlcnQoXCLQn9GA0LDQutGC0LrQuCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCISDQlNC70Y8g0LPQtdC90LXRgNCw0YbQuNC4INC00L7QutGD0LzQtdC90YLQsCDQv9GA0LDQutGC0LjQutCwINC00LvRjyDQstGL0LHRgNCw0L3QvdGL0YUg0LPRgNGD0L/QvyDQtNC+0LvQttC90LAg0YHRg9GJ0LXRgdGC0LLQvtCy0LDRgtGMLlwiKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdlbmVyYXRlRG9jdW1lbnQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgc2VsZWN0ZWRHcm91cHMgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRHcm91cHMoKTtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICAgIGxldCB0eXBlX2RvY3VtZW50ID0gdGhpcy5WaWV3LmdldFNlbGVjdFZhbHVlKFwiZ2R0eXBlRG9jdW1lbnRcIik7XHJcbiAgICBsZXQgZG9jdW1lbnRzPTA7XHJcbiAgICBpZih0eXBlX2RvY3VtZW50PT09XCLQn9GA0LjQutCw0LdcIil7XHJcbiAgICAgICAgZG9jdW1lbnRzID0gdGhpcy5WaWV3LmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnRPcmRlcihwcmFjdGljZSwgc2VsZWN0ZWRHcm91cHMsIHRoaXMuTW9kZWwuR3JvdXBzKTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgICAgZG9jdW1lbnRzID0gdGhpcy5WaWV3LmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnRSZXBvcnQocHJhY3RpY2UsIHNlbGVjdGVkR3JvdXBzLCB0aGlzLk1vZGVsLkdyb3Vwcyk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb2N1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBhd2FpdCB0aGlzLk1vZGVsLmdlbmVyYXRlRG9jdW1lbnQoZG9jdW1lbnRzW2ldLCB0eXBlX2RvY3VtZW50LCBpbmZvX2Fib3V0X3ByYWN0aWNlLnR5cGVQcmFjdGljZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5hZGRTdHVkZW50VG9PcmdhbmlzYXRpb25TaG93RGlhbG9nID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0Q29uZmlndXJhdGlvblByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgbGV0IHVpZHNHcm91cHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldEdyb3Vwc0J5UHJhY3RpY2VJZChwcmFjdGljZSk7XHJcbiAgICBsZXQgbmFtZXNHcm91cHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldEdyb3Vwc05hbWVCeUdyb3Vwc1VJRCh1aWRzR3JvdXBzKTtcclxuICAgIHRoaXMuVmlldy5kaWFsb2dFbmFibGVDaGVja2JveGVzKG5hbWVzR3JvdXBzLFxyXG4gICAgICAgIFwiZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDEtZGlhbG9nQWRkLWJhY2hlbG9yXCIpO1xyXG4gICAgdGhpcy5WaWV3LmRpYWxvZ0VuYWJsZUNoZWNrYm94ZXMobmFtZXNHcm91cHMsXHJcbiAgICAgICAgXCJncm91cC10cmVldmlldy10YWJjb250cm9sMi1kaWFsb2dBZGQtbWFzdGVyXCIpO1xyXG4gICAgdGhpcy5WaWV3LmRpYWxvZ09wZW4oXCIjZGlhbG9nQWRkU3R1ZGVudFwiKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmFkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzdHVkZW50cyA9IGF3YWl0IHRoaXMuVmlldy5nZXRTZWxlY3RlZFN0dWRlbnRzKGV2ZW50KTtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25QcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldE5hbWVPcmdhbmlzYXRpb25JblRyZWV2aWV3KFxyXG4gICAgICAgIFwib3JnYW5pc2F0aW9uTGlzdFwiKTtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbkJ5TmFtZShuYW1lT3JnYW5pc2F0aW9uKTtcclxuICAgIGxldCByZXF1ZXN0cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdEJ5U3R1ZGVudFVJRFMocHJhY3RpY2UsXHJcbiAgICAgICAgc3R1ZGVudHMpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcmVxdWVzdHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKHN0dWRlbnRzW2ldLnVpZCA9PT0gcmVxdWVzdHNbal0udWlkX3N0dWRlbnQpIHtcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRzW2ldWydpZF9yZXF1ZXN0J10gPSByZXF1ZXN0c1tqXS5pZF9yZXF1ZXN0O1xyXG4gICAgICAgICAgICAgICAgc3R1ZGVudHNbaV1bJ2lkX3ByYWN0aWNlJ10gPSBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRzW2ldWydpZF9vcmdhbmlzYXRpb24nXSA9IG9yZ2FuaXNhdGlvbi5pZDtcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRzW2ldWydpZF9zdGF0dXMnXSA9IEFQUFJPVkVEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0c09yZ2FuaXNhdGlvbihzdHVkZW50cyk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RzKHN0dWRlbnRzKTtcclxuXHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN0dWRlbnRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgc3R1ZGVudHNbal1bJ2lkX3N0YXR1cyddID0gUkVKRUNURUQ7XHJcbiAgICB9XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RzT3JnYW5pc2F0aW9uQnlSZXF1ZXN0KHN0dWRlbnRzKTtcclxuICAgIGF3YWl0IHRoaXMuZ2V0QXBwcm92ZWRBbmROb25BcHByb3ZlZFN0dWRlbnRzKG9yZ2FuaXNhdGlvbik7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5zZXRZZWFycyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCB5ZWFycyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2VZZWFycygpO1xyXG4gICAgdGhpcy5WaWV3LnNldFllYXJzQXJyYXkoeWVhcnMpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0KHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zTGlzdChvcmdhbmlzYXRpb25zLCBcImFsbE9yZ2FuaXNhdGlvbnNMaXN0XCIpO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nb1RvU3R1ZGVudHNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmdvVG9TdHVkZW50c1NlY3Rpb24oKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9QcmFjdGljZUNyZWF0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcclxuICAgIHRoaXMuVmlldy5jbGVhclByYWN0aWNlU2VjdGlvbigpO1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0KHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5nb1RvUHJhY3RpY2VDcmVhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LmNsZWFyVHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvbih0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xyXG4gICAgdGhpcy5WaWV3LnNldE9yZ2FuaXNhdGlvbnNJblRyZWVWaWV3KG9yZ2FuaXNhdGlvbnMsIHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHJldHVybiB0eXBlc09yZ2FuaXNhdGlvbjtcclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRJbmZvTmV3T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZU9yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb24pO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5zaG93RGlhbG9nRWRpdE9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IGlkT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldElkT3JnYW5pc2F0aW9uKGV2ZW50KTtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbkJ5SWQoaWRPcmdhbmlzYXRpb24pO1xyXG4gICAgdGhpcy5WaWV3LnNob3dEaWFsb2dPcmdhbmlzYXRpb24ob3JnYW5pc2F0aW9uKTtcclxufTtcclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5kaXNwbGF5R3JvdXBzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmRpc3BsYXlHcm91cHMoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCgpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuY3JlYXRlTmV3T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRJbmZvTmV3T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmNyZWF0ZU9yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb24pO1xyXG5cclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBhd2FpdCB0aGlzLmNyZWF0ZU5ld09yZ2FuaXNhdGlvbigpO1xyXG4gICAgYXdhaXQgdGhpcy51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5jcmVhdGVQcmFjdGljZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gdGhpcy5WaWV3LlByYWN0aWNlO1xyXG4gICAgbGV0IGdyb3VwcyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0RGV0ZXJtaW5lZEdyb3VwcyhwcmFjdGljZS5ncm91cHMpO1xyXG4gICAgcHJhY3RpY2UuZ3JvdXBzID0gZ3JvdXBzO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5jcmVhdGVQcmFjdGljZShwcmFjdGljZSk7XHJcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkSW1hZ2UoKTtcclxuICAgIHRoaXMuZ29Ub1N0dWRlbnRzU2VjdGlvbigpO1xyXG59O1xyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNUVURFTlRTIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlckdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5kaXN0cmlidXRlR3JvdXBzQnlDb3Vyc2VzKHRoaXMuVmlldy5zZWxlY3RlZFllYXIpO1xyXG4gICAgYXdhaXQgdGhpcy5WaWV3LmNsZWFyR3JvdXBzVHJlZVZpZXcoKTtcclxuICAgIGF3YWl0IHRoaXMuVmlldy51cGRhdGVHcm91cHNUcmVlVmlldyh0aGlzLk1vZGVsLkNvdXJzZXMsIHRoaXMuTW9kZWwuR3JvdXBzKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldEdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB0aGlzLlZpZXcudXBkYXRlWWVhcihldmVudCk7XHJcbiAgICBpZiAodGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9PT0gXCIrXCIpIHtcclxuICAgICAgICB0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID0gdGhpcy5Nb2RlbC5nZXRDdXJyZW50WWVhcigpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZ29Ub1ByYWN0aWNlQ3JlYXRpb24oKTtcclxuICAgIH1cclxuICAgIGF3YWl0IHRoaXMucmVuZGVyR3JvdXBzVHJlZVZpZXcoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlckRhdGFJblRhYmxlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgICBsZXQgc2VsZWN0ZWRHcm91cHMgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRHcm91cHMoKTtcclxuICAgIGxldCBncm91cHNPYmplY3RzID0gW107XHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRVc2VySW5mb0Fib3V0UHJhY3RpY2UoKTtcclxuICAgIGxldCBwcmFjdGljZSA9IFtdLCBkYXRhID0gMDtcclxuXHJcbiAgICBpZiAoc2VsZWN0ZWRHcm91cHMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLk1vZGVsLkdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLk1vZGVsLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cHNPYmplY3RzLnB1c2godGhpcy5Nb2RlbC5Hcm91cHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGdyb3Vwc1ByYWN0aWNlUGFydGljaXBhbnRzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRHcm91cHNCeVByYWN0aWNlSWQoXHJcbiAgICAgICAgICAgICAgICBwcmFjdGljZSk7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkR3JvdXBzID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzUHJhY3RpY2VQYXJ0aWNpcGFudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzT2JqZWN0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgrZ3JvdXBzUHJhY3RpY2VQYXJ0aWNpcGFudHNbaV0udWlkX2dyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID09PSBncm91cHNPYmplY3RzW2pdLnVpZF9MREFQKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkR3JvdXBzLnB1c2goZ3JvdXBzT2JqZWN0c1tqXS5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnM7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzKHByYWN0aWNlLCBncm91cHNPYmplY3RzKTtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuTW9kZWwuYXNzb3NpYXRlUmVxdWVzdFRvU3R1ZGVudChyZXF1ZXN0cywgc2VsZWN0ZWRHcm91cHMpO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdHNPcmdhbmlzYXRpb25zKFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkR3JvdXBzKTtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCB0aGlzLk1vZGVsLmdldERhdGEoc2VsZWN0ZWRHcm91cHMsIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJhY3RpY2UgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGRhdGEgPSAwO1xyXG4gICAgICAgIHRoaXMuVmlldy5yZW5kZXJUYWJsZShkYXRhKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuVmlldy5yZW5kZXJUYWJsZShkYXRhKTtcclxuICAgIH1cclxuICAgIHRoaXMuVmlldy5jb2xvclRhYmxlKGRhdGEpO1xyXG4gICAgdGhpcy5WaWV3LnJlbmRlckluZm8ocHJhY3RpY2UpO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbn07XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1PUkdBTklTQVRJT05TIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRBcHByb3ZlZEFuZE5vbkFwcHJvdmVkU3R1ZGVudHMgPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UoKTtcclxuICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XHJcbiAgICBsZXQgYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9IDAsIG5vbl9hcHByb3ZlZF9zdHVkZW50X2NvdW50ID0gMDtcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBhcHByb3ZlZF9zdHVkZW50X2NvdW50ID0gYXdhaXQgdGhpcy5yZW5kZXJTdHVkZW50TGlzdChvcmdhbmlzYXRpb24sXHJcbiAgICAgICAgICAgIHByYWN0aWNlLCBcImFwcHJvdmVkU3R1ZGVudHNcIik7XHJcbiAgICAgICAgbm9uX2FwcHJvdmVkX3N0dWRlbnRfY291bnQgPSBhd2FpdCB0aGlzLnJlbmRlclN0dWRlbnRMaXN0KG9yZ2FuaXNhdGlvbixcclxuICAgICAgICAgICAgcHJhY3RpY2UsIFwibm9uQXBwcm92ZWRTdHVkZW50c1wiKTtcclxuICAgIH1cclxuICAgIHRoaXMuVmlldy51cGRhdGVPcmdhbmlzYXRpb25UaXRsZShvcmdhbmlzYXRpb24ubmFtZSwgYXBwcm92ZWRfc3R1ZGVudF9jb3VudCxcclxuICAgICAgICBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5kaXNwbGF5SW5mb0Fib3V0T3JnID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZE9yZ2FuaXNhdGlvbihldmVudCk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25CeU5hbWUobmFtZU9yZ2FuaXNhdGlvbik7XHJcbiAgICBhd2FpdCB0aGlzLmdldEFwcHJvdmVkQW5kTm9uQXBwcm92ZWRTdHVkZW50cyhvcmdhbmlzYXRpb24pO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyU3R1ZGVudExpc3QgPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uLCBwcmFjdGljZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRMaXN0KSB7XHJcbiAgICBsZXQgc3RhdHVzO1xyXG4gICAgaWYgKGlkTGlzdCA9PT0gXCJhcHByb3ZlZFN0dWRlbnRzXCIpIHtcclxuICAgICAgICBzdGF0dXMgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc3RhdHVzID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBsZXQgc3R1ZGVudHNJbmZvID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRSZXF1ZXN0c0J5T3JnYW5pc2F0aW9uTmFtZShcclxuICAgICAgICBvcmdhbmlzYXRpb24sIHByYWN0aWNlLCBzdGF0dXMpO1xyXG4gICAgbGV0IHN0dWRlbnRzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRTdHVkZW50c0J5VUlEKHN0dWRlbnRzSW5mbyk7XHJcbiAgICB0aGlzLlZpZXcudXBkYXRlU3R1ZGVudHNMaXN0VmlldyhzdHVkZW50cywgaWRMaXN0KTtcclxuICAgIHJldHVybiBzdHVkZW50cy5sZW5ndGg7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0Q29uZmlndXJhdGlvblByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbnMgPSAwO1xyXG4gICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIG9yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbnNCeVByYWN0aWNlSWQocHJhY3RpY2UpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5WaWV3LnNldE9yZ2FuaXNhdGlvbnNMaXN0KG9yZ2FuaXNhdGlvbnMsIFwib3JnYW5pc2F0aW9uTGlzdFwiKTtcclxuICAgIHRoaXMuVmlldy5yZW5kZXJPcmdhbmlzYXRpb25TZWN0aW9uKHByYWN0aWNlKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldE5hbWVPcmdhbmlzYXRpb25CeVRpdGxlKCk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25CeU5hbWUobmFtZU9yZ2FuaXNhdGlvbik7XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuY2hhbmdlU3R1ZGVudFN0YXR1cyA9IGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgICBsZXQgc3R1ZGVudCA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZFN0dWRlbnQoZXZlbnQpO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0T3JnYW5pc2F0aW9uKHN0dWRlbnQpO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0KHN0dWRlbnQpO1xyXG5cclxuICAgIHN0dWRlbnRbJ2lkX3N0YXR1cyddID0gUkVKRUNURUQ7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RPcmdhbmlzYXRpb25CeVJlcXVlc3Qoc3R1ZGVudCk7XHJcblxyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuZ2V0T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLmdldEFwcHJvdmVkQW5kTm9uQXBwcm92ZWRTdHVkZW50cyhvcmdhbmlzYXRpb24pO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9Db250cm9sbGVyLmpzIiwiY29uc3QgYmFjaGVsb3JZZWFyID0gNDtcclxuY29uc3QgbWFzdGVyWWVhciA9IDY7XHJcbmxldCBzZWxlY3RlZEVsZW0gPSAwO1xyXG5cclxudmFyIFZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmluZm9Hcm91cHMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQnNCe0JBcIixcclxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjAyLjAzLjAzIMKr0JzQsNGC0LXQvNCw0YLQuNGH0LXRgdC60L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INC4INCw0LTQvNC40L3QuNGB0YLRgNC40YDQvtCy0LDQvdC40LUg0LjQvdGE0L7RgNC80LDRhtC40L7QvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Ci0LXRhdC90L7Qu9C+0LPQuNGPINC/0YDQvtCz0YDQsNC80LzQuNGA0L7QstCw0L3QuNGPwrtcIixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYmFjaGVsb3JcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQn9Cg0JhcIixcclxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjAzLjA0IMKr0J/RgNC+0LPRgNCw0LzQvNC90LDRjyDQuNC90LbQtdC90LXRgNC40Y/Cu1wiLFxyXG4gICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Cg0LDQt9GA0LDQsdC+0YLQutCwINC/0YDQvtCz0YDQsNC80LzQvdC+LdC40L3RhNC+0YDQvNCw0YbQuNC+0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYmFjaGVsb3JcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQmNCS0KItMVwiLFxyXG4gICAgICAgICAgICBcImZ1bGxOYW1lXCI6IFwiMDkuMDMuMDEgwqvQmNC90YTQvtGA0LzQsNGC0LjQutCwINC4INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdCw0Y8g0YLQtdGF0L3QuNC60LDCu1wiLFxyXG4gICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Cf0YDQvtCz0YDQsNC80LzQvdC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QvtC5INGC0LXRhdC90LjQutC4INC4INCw0LLRgtC+0LzQsNGC0LjQt9C40YDQvtCy0LDQvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJiYWNoZWxvclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcItCY0JLQoi0yXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wMy4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXHJcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0JjQktCiLTNcIixcclxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQn9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90L7QuSDRgtC10YXQvdC40LrQuCDQuCDQsNCy0YLQvtC80LDRgtC40LfQuNGA0L7QstCw0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYmFjaGVsb3JcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQn9Cg0JggKNC80LMpXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wNC4wNCDCq9Cf0YDQvtCz0YDQsNC80LzQvdCw0Y8g0LjQvdC20LXQvdC10YDQuNGPwrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQn9GA0L7QtdC60YLQuNGA0L7QstCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzQvdC+LdC40L3RhNC+0YDQvNCw0YbQuNC+0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWFzdGVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0JjQktCiLTEgKNC80LMpXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wNC4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXHJcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0JrQvtC80L/RjNGO0YLQtdGA0L3Ri9C5INCw0L3QsNC70LjQtyDQuCDQuNC90YLQtdGA0L/RgNC10YLQsNGG0LjRjyDQtNCw0L3QvdGL0YXCu1wiLFxyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJtYXN0ZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQmNCS0KItMiAo0LzQsylcIixcclxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjA0LjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQmNC90YTQvtGA0LzQsNGG0LjQvtC90L3QvtC1INC4INC/0YDQvtCz0YDQsNC80LzQvdC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1hc3RlclwiXHJcbiAgICAgICAgfVxyXG4gICAgXTtcclxuICAgIHRoaXMub25DbGlja05leHRTdGVwID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1ByYWN0aWNlQ29tcGxldGVkID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0NyZWF0ZVByYWN0aWNlID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0FkZFByYWN0aWNlID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrRmluaXNoQnRuID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1NlbGVjdEdyb3VwQnRuT2sgPSBudWxsO1xyXG4gICAgdGhpcy5teVRhYmxlID0gJCgnI3N0dWRlbnRzTGlzdFRhYmxlJyk7XHJcbiAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5ID0gbnVsbDtcclxuICAgIHRoaXMuc2VsZWN0ZWRZZWFyID0gbnVsbDtcclxuICAgIHRoaXMuaWRUcmVlVmlld3MgPSBbXHJcbiAgICAgICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWJhY2hlbG9yJyxcclxuICAgICAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItbWFzdGVyJyxcclxuICAgICAgICAnZ3JvdXBzLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uLWJhY2hlbG9yJyxcclxuICAgICAgICAnZ3JvdXBzLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uLW1hc3RlcicsXHJcbiAgICAgICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWRpYWxvZ0FkZC1iYWNoZWxvcicsXHJcbiAgICAgICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wyLWRpYWxvZ0FkZC1tYXN0ZXInXHJcbiAgICBdO1xyXG4gICAgdGhpcy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tDcmVhdGVPcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrRGlzcGxheUluZm9BYm91dE9yZyA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5T3JnYW5pc2F0aW9ucyA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tFZGl0T3JnYW5pc2F0aW9uID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0FwcHJvdmVTdHVkZW50ID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1JlamVjdFN0dWRlbnQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrVXBkYXRlT3JnYW5pc2F0aW9uID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvblNob3dEaWFsb2cgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1Nob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50ID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0dlbmVyYXRlRG9jdW1lbnQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNoYW5nZVR5cGVEb2N1bWVudCA9IG51bGw7XHJcbiAgICB0aGlzLlByYWN0aWNlID0gbnVsbDtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLW5leHRcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja05leHRTdGVwKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGlhbG9nUHJhY3RpY2VDb21wbGV0ZVN1Y2Nlc3NcIikucXVlcnlTZWxlY3RvcihcclxuICAgICAgICBcIiNwcmFjdGljZUZpbmlzaGVkT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1ByYWN0aWNlQ29tcGxldGVkKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnYW5pc2F0aW9uc1NlY3Rpb25CdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkZW50c1NlY3Rpb25CdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tZmluaXNoXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tGaW5pc2hCdG4pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZXRHcm91cHNCdG5Pa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrU2VsZWN0R3JvdXBCdG5Payk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbnNBcnJheVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrWWVhcnNBcnJheSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbnNBcnJheTFcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1llYXJzQXJyYXkpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZXRPcmdhbmlzYXRpb25zQnRuT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0dldE9yZ2FuaXNhdGlvbnMpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVPcmdhbmlzYXRpb25cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByYWN0aWNlRmluaXNoZWRPa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQWRkUHJhY3RpY2UpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaG93QWxsT3JnYW5pc2F0aW9uc1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrRGlzcGxheU9yZ2FuaXNhdGlvbnMpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1VwZGF0ZU9yZ2FuaXNhdGlvbik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZFN0dWRlbnRCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50QnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tTaG93RGlhbG9nR2VuZXJhdGVEb2N1bWVudCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdlbmVyYXRlRG9jdW1lbnRCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0dlbmVyYXRlRG9jdW1lbnQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZHR5cGVEb2N1bWVudFwiKS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLFxyXG4gICAgICAgIHRoaXMub25DaGFuZ2VUeXBlRG9jdW1lbnQpO1xyXG5cclxuICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoe1xyXG4gICAgICAgIGRhdGE6IHRoaXMuR3JvdXBzLFxyXG4gICAgICAgIFwibGFuZ3VhZ2VcIjoge1xyXG4gICAgICAgICAgICBcInplcm9SZWNvcmRzXCI6IFwi0KLQsNC60L7QuSDQt9Cw0L/QuNGB0Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIixcclxuICAgICAgICAgICAgXCJlbXB0eVRhYmxlXCI6IFwi0J3QuCDQvtC00L3QsCDQuNC3INCz0YDRg9C/0L8g0L3QtSDQstGL0LHRgNCw0L3QsCDQu9C40LHQviDQv9GA0LDQutGC0LjQutC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCIsXHJcbiAgICAgICAgICAgIFwic2VhcmNoXCI6IFwi0J/QvtC40YHQujpcIixcclxuICAgICAgICAgICAgXCJwYWdpbmF0ZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImZpcnN0XCI6IFwi0J/QtdGA0LLRi9C5XCIsXHJcbiAgICAgICAgICAgICAgICBcImxhc3RcIjogXCLQn9C+0YHQu9C10LTQvdC40LlcIixcclxuICAgICAgICAgICAgICAgIFwibmV4dFwiOiBcItCS0L/QtdGA0LXQtFwiLFxyXG4gICAgICAgICAgICAgICAgXCJwcmV2aW91c1wiOiBcItCd0LDQt9Cw0LRcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImluZm9GaWx0ZXJlZFwiOiBcIijQuNC3IF9NQVhfINGB0YLRg9C00LXQvdGC0L7QsilcIixcclxuICAgICAgICAgICAgXCJsZW5ndGhNZW51XCI6IFwi0J/QvtC60LDQt9Cw0YLRjCBfTUVOVV8g0LfQsNC/0LjRgdC10LlcIixcclxuICAgICAgICAgICAgXCJpbmZvXCI6IFwi0J7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgdGC0YPQtNC10L3RgtC+0LI6IF9UT1RBTF8gXCIsXHJcbiAgICAgICAgICAgIFwiaW5mb0VtcHR5XCI6IFwi0JLRi9Cx0LXRgNC40YLQtSDQs9GA0YPQv9C/0YMuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiY29sdW1uc1wiOiBbXHJcbiAgICAgICAgICAgIHtcImRhdGFcIjogXCJncm91cFwifSxcclxuICAgICAgICAgICAge1wiZGF0YVwiOiBcInN0dWRlbnRcIn0sXHJcbiAgICAgICAgICAgIHtcImRhdGFcIjogXCJvcmdhbmlzYXRpb25cIn1cclxuICAgICAgICBdXHJcbiAgICB9KTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9TdHVkZW50c1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI29yZ2FuaXNhdGlvbnNTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG5cclxuICAgIGxldCB0cmVlVmlld3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJlZXZpZXdcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRyZWVWaWV3c1tpXS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3JnYW5pc2F0aW9uc1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3R1ZGVudHNSZXF1ZXN0c1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsbE9yZ2FuaXNhdGlvbnNMaXN0QmxvY2tcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXBkYXRlT3JnYW5pc2F0aW9uXCIpLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub1ByYWN0aWNlQ3JlYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ByYWN0aWNlQ3JlYXRpb25TZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXBkYXRlT3JnYW5pc2F0aW9uXCIpLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsXHJcbiAgICAgICAgXCJ0cnVlXCIpO1xyXG59O1xyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblZpZXcucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZmluaXNoQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1maW5pc2hcIilbMF07XHJcbiAgICBmaW5pc2hCdG4uc2V0QXR0cmlidXRlKFwib25jbGlja1wiLFxyXG4gICAgICAgIFwibWV0cm9EaWFsb2cub3BlbignI2RpYWxvZ1ByYWN0aWNlQ29tcGxldGVTdWNjZXNzJylcIik7XHJcbiAgICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdWNhdGlvblwiKS52YWx1ZTtcclxuXHJcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VcIikudmFsdWU7XHJcblxyXG4gICAgbGV0IGxlY051bSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVjTnVtXCIpLnZhbHVlO1xyXG4gICAgbGV0IGZyb21EYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcm9tRGF0ZUlucHV0XCIpLnZhbHVlO1xyXG4gICAgbGV0IHRvRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9EYXRlSW5wdXRcIikudmFsdWU7XHJcbiAgICBsZXQgZGVhZGxpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYWRsaW5lXCIpLnZhbHVlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXJtc1ByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9ICdjICcgKyBmcm9tRGF0ZVxyXG4gICAgICAgICsgJyDQv9C+ICcgKyB0b0RhdGU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYWRsaW5lUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gZGVhZGxpbmU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUZXJtc1ByYWN0aWNlXCIpLmlubmVySFRNTCA9IGZyb21EYXRlXHJcbiAgICAgICAgKyAnIC0gJyArIHRvRGF0ZTtcclxuICAgIGlmIChmcm9tRGF0ZSA9PT0gXCJcIikge1xyXG4gICAgICAgIGZyb21EYXRlID0gXCIyMDAwLTAxLTAxIDIxOjAwOjAwLjAwMCArMDA6MDBcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZyb21EYXRlID0gZnJvbURhdGUuc3Vic3RyKDgsIDQpICsgJy0nICsgZnJvbURhdGUuc3Vic3RyKDQsIDIpICsgJy0nXHJcbiAgICAgICAgICAgICsgZnJvbURhdGUuc3Vic3RyKDAsIDIpICsgJyAnICsgJzIxOjAwOjAwLjAwMCArMDA6MDAnO1xyXG4gICAgfVxyXG4gICAgaWYgKHRvRGF0ZSA9PT0gXCJcIikge1xyXG4gICAgICAgIHRvRGF0ZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0b0RhdGUgPSB0b0RhdGUuc3Vic3RyKDgsIDQpICsgJy0nICsgdG9EYXRlLnN1YnN0cig0LCAyKSArICctJ1xyXG4gICAgICAgICAgICArIHRvRGF0ZS5zdWJzdHIoMCwgMikgKyAnICcgKyAnMjE6MDA6MDAuMDAwICswMDowMCc7XHJcbiAgICB9XHJcbiAgICBpZiAoZGVhZGxpbmUgPT09IFwiXCIpIHtcclxuICAgICAgICBkZWFkbGluZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkZWFkbGluZSA9IGRlYWRsaW5lLnN1YnN0cig4LCA0KSArICctJyArIGRlYWRsaW5lLnN1YnN0cig0LCAyKSArICctJ1xyXG4gICAgICAgICAgICArIGRlYWRsaW5lLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdHJlZVZpZXcgPSBudWxsO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcInByYWN0aWNlXCIpICE9PSAtMVxyXG4gICAgICAgICAgICAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5XHJcbiAgICAgICAgICAgID09PSBcImJsb2NrXCIpIHtcclxuICAgICAgICAgICAgdHJlZVZpZXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgYXJyR3JvdXBzID0gdGhpcy5nZXRTZWxlY3RlZEdyb3Vwcyh0cmVlVmlldyk7XHJcbiAgICBsZXQgYXJyT3JnYW5pc2F0aW9ucyA9IHRoaXMuZ2V0U2VsZWN0ZWRHcm91cHMoXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uXCIpKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR5cGVQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2U7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBcImVkdWNhdGlvbmFsTGV2ZWxEaWFsb2dcIikuaW5uZXJIVE1MID0gZWR1Y2F0aW9uTGV2ZWw7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyb3Vwc1ByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGFyckdyb3VwcztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwib3JnYW5pc2F0aW9uc1ByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGFyck9yZ2FuaXNhdGlvbnM7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VHlwZVByYWN0aWNlXCIpLmlubmVySFRNTCA9IHR5cGVQcmFjdGljZVxyXG4gICAgICAgICsgXCIg0L/RgNCw0LrRgtC40LrQsFwiO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVjTnVtRGlhbG9nXCIpLmlubmVySFRNTCA9IGxlY051bTtcclxuICAgIHRoaXMuUHJhY3RpY2UgPSB7XHJcbiAgICAgICAgJ3R5cGVQcmFjdGljZSc6IHR5cGVQcmFjdGljZSxcclxuICAgICAgICAnc3RhcnREYXRlUHJhY3RpY2UnOiBmcm9tRGF0ZSxcclxuICAgICAgICAnZW5kRGF0ZVByYWN0aWNlJzogdG9EYXRlLFxyXG4gICAgICAgICdkZWFkbGluZVByYWN0aWNlJzogZGVhZGxpbmUsXHJcbiAgICAgICAgJ2xlY051bSc6IGxlY051bSxcclxuICAgICAgICAnZWR1TGV2ZWwnOiBlZHVjYXRpb25MZXZlbCxcclxuICAgICAgICAnb3JnYW5pc2F0aW9ucyc6IGFyck9yZ2FuaXNhdGlvbnMsXHJcbiAgICAgICAgJ2dyb3Vwcyc6IGFyckdyb3VwcyxcclxuICAgICAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB0aGlzLlByYWN0aWNlO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZGlzcGxheUdyb3VwcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1Y2F0aW9uXCIpLnZhbHVlO1xyXG4gICAgaWYgKGVkdWNhdGlvbkxldmVsID09PSBcImJhY2hlbG9yXCIpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcIm1hc3RlclwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJiYWNoZWxvclwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn07XHJcblZpZXcucHJvdG90eXBlLmNsZWFyUHJhY3RpY2VTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcm9tRGF0ZUlucHV0XCIpLnZhbHVlID0gXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9EYXRlSW5wdXRcIikudmFsdWUgPSBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZSA9IFwiXCI7XHJcbn07XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJJbmZvID0gZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBpZiAocHJhY3RpY2UubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0X3llYXIgPSBwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlLnN1YnN0cigwLCA0KSxcclxuICAgICAgICAgICAgc3RhcnRfbW9udGggPSBwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlLnN1YnN0cig1LCAyKSxcclxuICAgICAgICAgICAgc3RhcnRfZGF5ID0gcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoOCwgMiksXHJcbiAgICAgICAgICAgIGVuZF95ZWFyID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDAsIDQpLFxyXG4gICAgICAgICAgICBlbmRfbW9udGggPSBwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoNSwgMiksXHJcbiAgICAgICAgICAgIGVuZF9kYXkgPSBwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoOCwgMik7XHJcbiAgICAgICAgbGV0IHN0YXJ0X2RhdGUgPSBzdGFydF9kYXkgKyAnLScgKyBzdGFydF9tb250aCArICctJyArIHN0YXJ0X3llYXI7XHJcbiAgICAgICAgbGV0IGVuZF9kYXRlID0gZW5kX2RheSArICctJyArIGVuZF9tb250aCArICctJyArIGVuZF95ZWFyO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUZXJtc1ByYWN0aWNlXCIpLmlubmVySFRNTCA9ICfRgSAnXHJcbiAgICAgICAgICAgICsgc3RhcnRfZGF0ZSArICcg0L/QviAnICsgZW5kX2RhdGU7XHJcbiAgICAgICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICBcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gaW5mb19hYm91dF9wcmFjdGljZS50eXBlUHJhY3RpY2VcclxuICAgICAgICAgICAgKyAnINC/0YDQsNC60YLQuNC60LAnO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VHlwZVByYWN0aWNlXCIpLmlubmVySFRNTCA9IFwi0J/RgNCw0LrRgtC40LrQuFwiXHJcbiAgICAgICAgICAgICsgXCIg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUZXJtc1ByYWN0aWNlXCIpLmlubmVySFRNTCA9IFwiIFwiO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5nZXRVc2VySW5mb0Fib3V0UHJhY3RpY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxyXG4gICAgICAgIFwidGFiY29udHJvbDJcIilbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImFjdGl2ZVwiKVswXS5jaGlsZHJlblswXS50ZXh0O1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlVGFiXCIpLnZhbHVlO1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB7XHJcbiAgICAgICAgJ3R5cGVQcmFjdGljZSc6IHR5cGVQcmFjdGljZSxcclxuICAgICAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyLFxyXG4gICAgICAgICdlZHVfbGV2ZWwnOiBlZHVjYXRpb25MZXZlbFxyXG4gICAgfTtcclxuICAgIHJldHVybiBpbmZvX2Fib3V0X3ByYWN0aWNlO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlT3JnU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwic2VsZWN0RWR1TGV2ZWxPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlVGV4dCA9IFwi0KPRh9C10LHQvdCw0Y9cIjtcclxuICAgIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiZWR1Y2F0aW9uYWxcIikge1xyXG4gICAgICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiaW50ZXJuc2hpcFwiKSB7XHJcbiAgICAgICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0J/RgNC+0LjQt9Cy0L7QtNGB0YLQstC10L3QvdCw0Y9cIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJwcmVkaXBsb21hXCIpIHtcclxuICAgICAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQn9GA0LXQtNC00LjQv9C70L7QvNC90LDRj1wiO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0ge1xyXG4gICAgICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2VUZXh0LFxyXG4gICAgICAgICd5ZWFyJzogdGhpcy5zZWxlY3RlZFllYXIsXHJcbiAgICAgICAgJ2VkdV9sZXZlbCc6IGVkdWNhdGlvbkxldmVsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGluZm9fYWJvdXRfcHJhY3RpY2U7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJUYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBpZiAoZGF0YSA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkNsZWFyVGFibGUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkNsZWFyVGFibGUoKTtcclxuICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5BZGREYXRhKGRhdGEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuY29sb3JUYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoZGF0YVtpXS5zdGF0dXMgPT09IDEpIHtcclxuICAgICAgICAgICAgJCh0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKSkuYWRkQ2xhc3MoXCJhcHByb3ZlZF9zdHVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3J0aW5nXzEgYXBwcm92ZWRfc3R1ZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRhdGFbaV0uc3RhdHVzID09PSAwKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuR2V0Tm9kZXMoaSkpLmFkZENsYXNzKFwiYXBwbGllZF9zdHVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3J0aW5nXzEgYXBwbGllZF9zdHVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNoYW5nZVllYXIgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgaWYgKHNlbGVjdGVkRWxlbSkge1xyXG4gICAgICAgIHNlbGVjdGVkRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdjdXJyZW50Jyk7XHJcbiAgICB9XHJcbiAgICBzZWxlY3RlZEVsZW0gPSBub2RlO1xyXG4gICAgc2VsZWN0ZWRFbGVtLmNsYXNzTGlzdC5hZGQoJ2N1cnJlbnQnKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRZZWFyID0gc2VsZWN0ZWRFbGVtLmlubmVySFRNTDtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZVllYXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGlmICh0YXJnZXQuY2xhc3NOYW1lID09PSAnaXRlbSB5ZWFyJyB8fCB0YXJnZXQuY2xhc3NOYW1lXHJcbiAgICAgICAgICAgID09PSAnaXRlbSB5ZWFyIGN1cnJlbnQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlWWVhcih0YXJnZXQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkR3JvdXBzID0gZnVuY3Rpb24gKHRyZWVWaWV3KSB7XHJcbiAgICBpZiAodHJlZVZpZXcgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGxldCBmcmFtZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZnJhbWVzXCIpWzBdLmNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChmcmFtZXNbaV0uc3R5bGUuZGlzcGxheSAhPT0gXCJub25lXCIpIHtcclxuICAgICAgICAgICAgICAgIHRyZWVWaWV3ID0gZnJhbWVzW2ldLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgR3JvdXBzID0gW107XHJcbiAgICBsZXQgbGlOdW1iZXIgPSB0cmVlVmlldy5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaU51bWJlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBncm91cHMgPSBsaU51bWJlcltpXS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpjaGVja2VkJyk7XHJcbiAgICAgICAgaWYgKGdyb3Vwcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBncm91cCA9IGdyb3Vwc1tqXS5wYXJlbnRFbGVtZW50Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAuaW5kZXhPZihcItC60YPRgNGBXCIpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBHcm91cHM7XHJcbn07XHJcblxyXG5hc3luYyBmdW5jdGlvbiB0cmVlX2FkZF9sZWFmX2NoZWNrYm94X2V4YW1wbGVfY2xpY2sodHJlZSwgbm9kZSwgbmFtZUxlYWYsIHVpZCkge1xyXG4gICAgYXdhaXQgdHJlZS5hZGRMZWFmKG5vZGUsIG5hbWVMZWFmLCB7XHJcbiAgICAgICAgbW9kZTogJ2NoZWNrYm94JyxcclxuICAgICAgICBjaGVja2VkOiBmYWxzZSxcclxuICAgICAgICB1aWQ6IHVpZFxyXG4gICAgfSk7XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLnJlbW92ZUNoaWxkcmVuID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGROb2RlcztcclxuICAgIHdoaWxlIChjaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgICBub2RlLnJlbW92ZUNoaWxkKGNoaWxkcmVuWzBdKTtcclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNsZWFyR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaWQgPSAwO1xyXG4gICAgd2hpbGUgKGlkIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgbGlBcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICB0aGlzLmlkVHJlZVZpZXdzW2lkXSkuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4obGlBcnJheVtpXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlkKys7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZUdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKGNvdXJzZXMsIGdyb3Vwcykge1xyXG4gICAgbGV0IGlkQ291bnRlciA9IDAsIGNvdXJzZU51bWJlciA9IGJhY2hlbG9yWWVhciwgY250O1xyXG4gICAgbGV0IGNvdXJzZXNOYW1lID0gWydmaXJzdCcsICdzZWNvbmQnLCAndGhpcmQnLCAnZm91cnRoJ107XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB3aGlsZSAoaWRDb3VudGVyIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgdHJlZSA9ICQoXCIjXCIgKyB0aGlzLmlkVHJlZVZpZXdzW2lkQ291bnRlcl0pLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGNvdXJzZU51bWJlciA9IG1hc3RlclllYXI7XHJcbiAgICAgICAgICAgIGkgPSBiYWNoZWxvclllYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb3Vyc2VOdW1iZXIgPSBiYWNoZWxvclllYXI7XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbnQgPSAwO1xyXG4gICAgICAgIGZvciAoaTsgaSA8IGNvdXJzZU51bWJlcjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY291cnNlc1tpXS5ncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlID0gdHJlZS5lbGVtZW50LmZpbmQoJ2xpLicgKyBjb3Vyc2VzTmFtZVtjbnRdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdXHJcbiAgICAgICAgICAgICAgICAgICAgPT09IFwiZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDEtZGlhbG9nQWRkLWJhY2hlbG9yXCJcclxuICAgICAgICAgICAgICAgICAgICB8fCB0aGlzLmlkVHJlZVZpZXdzW2lkQ291bnRlcl1cclxuICAgICAgICAgICAgICAgICAgICA9PT0gXCJncm91cC10cmVldmlldy10YWJjb250cm9sMi1kaWFsb2dBZGQtbWFzdGVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbMF0uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdXJzZXNbaV0uZ3JvdXBzW2pdKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbSA9IG5vZGUuZmluZCgndWwnKVswXS5jaGlsZHJlbltub2RlLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd1bCcpWzBdLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWxlbSkuYWRkQ2xhc3MoXCJjb2xsYXBzZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0dWRlbnRzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGdyb3Vwcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY291cnNlc1tpXS5ncm91cHNbal0gPT09IGdyb3Vwc1trXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHVkZW50cyA9IGdyb3Vwc1trXS5zdHVkZW50cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgc3R1ZGVudHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsICQoZWxlbSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHVkZW50c1trXS5uYW1lLCBzdHVkZW50c1trXS51aWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXRzID0gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS11aWRdJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBpbnB1dHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzW2tdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbMF0uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdXJzZXNbaV0uZ3JvdXBzW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjbnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWRDb3VudGVyKys7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLm15VXBkYXRlVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoY291cnNlcywgaWQpIHtcclxuICAgIGxldCBjb3Vyc2VOdW1iZXIgPSBiYWNoZWxvclllYXIsIG47XHJcbiAgICBsZXQgY291cnNlc05hbWUgPSBbJ2ZpcnN0JywgJ3NlY29uZCcsICd0aGlyZCcsICdmb3VydGgnXTtcclxuICAgIHZhciBpID0gMDtcclxuXHJcbiAgICB2YXIgdHJlZSA9ICQoXCIjXCIgKyBpZCkuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gICAgaWYgKGlkLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgY291cnNlTnVtYmVyID0gbWFzdGVyWWVhcjtcclxuICAgICAgICBpID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgICAgIGkgPSAwO1xyXG4gICAgfVxyXG4gICAgbiA9IDA7XHJcbiAgICBmb3IgKGk7IGkgPCBjb3Vyc2VOdW1iZXI7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY291cnNlc1tpXS5ncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGkuJyArIGNvdXJzZXNOYW1lW25dKTtcclxuICAgICAgICAgICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsIGNvdXJzZXNbaV0uZ3JvdXBzW2pdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbisrO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgICBsZXQgZWR1TGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdUxldmVsT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB7XHJcbiAgICAgICAgJ3R5cGVQcmFjdGljZSc6IHR5cGVQcmFjdGljZSxcclxuICAgICAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyLFxyXG4gICAgICAgICdlZHVfbGV2ZWwnOiBlZHVMZXZlbFxyXG4gICAgfTtcclxuICAgIHJldHVybiBpbmZvX2Fib3V0X3ByYWN0aWNlO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gdHJlZV9hZGRfbGVhZl9jaGVja2JveCh0cmVlLCBub2RlLCBuYW1lTGVhZiwgaWRUeXBlT3JnYW5pc2F0aW9uKSB7XHJcbiAgICB0cmVlLmFkZExlYWYobm9kZSwgbmFtZUxlYWYsIHtcclxuICAgICAgICBtb2RlOiAnY2hlY2tib3gnLFxyXG4gICAgICAgIGNoZWNrZWQ6IGZhbHNlXHJcbiAgICB9KTtcclxuICAgIG5vZGUuZmluZCgndWwnKS5maW5kKCdsaScpLmxhc3QoKVswXS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCAndHlwZV9vcmdfJ1xyXG4gICAgICAgICsgaWRUeXBlT3JnYW5pc2F0aW9uKTtcclxufVxyXG5cclxuVmlldy5wcm90b3R5cGUuc2V0VHlwZXNPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAodHlwZXNPcmdhbmlzYXRpb24pIHtcclxuICAgIHZhciB0cmVlVmlld09yZ2FuaXNhdGlvbnMgPSAkKFxyXG4gICAgICAgIFwiI29yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBub2RlID0gdHJlZVZpZXdPcmdhbmlzYXRpb25zLmVsZW1lbnQuZmluZCgnbGkubm9kZScpO1xyXG4gICAgICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3godHJlZVZpZXdPcmdhbmlzYXRpb25zLCBub2RlLFxyXG4gICAgICAgICAgICB0eXBlc09yZ2FuaXNhdGlvbltpXS5uYW1lLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmNsZWFyVHlwZXNPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgbGlBcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICdvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uJykuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKGxpQXJyYXlbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0pO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5zZXRPcmdhbmlzYXRpb25zSW5UcmVlVmlldyA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlc09yZ2FuaXNhdGlvbikge1xyXG4gICAgdmFyIHRyZWUgPSAkKFwiI29yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAob3JnYW5pc2F0aW9uc1tpXS5pZF90eXBlX29yZ2FuaXNhdGlvbiA9PT0gdHlwZXNPcmdhbmlzYXRpb25bal0uaWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsaUFyciA9IHRyZWUuZWxlbWVudC5maW5kKCdsaScpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGxpQXJyLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpQXJyW2tdLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSAoJ3R5cGVfb3JnXydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgdHlwZXNPcmdhbmlzYXRpb25bal0uaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgPSAkKGxpQXJyW2tdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldEluZm9OZXdPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZUNvbXBhbnlcIik7XHJcbiAgICB2YXIgdHlwZU9yZyA9IGUub3B0aW9uc1tlLnNlbGVjdGVkSW5kZXhdLnRleHQ7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0ge1xyXG4gICAgICAgICduYW1lJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICAgICAndHlwZU9yZyc6IHR5cGVPcmcsXHJcbiAgICAgICAgJ2luZm9PcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm9Db21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICdlbWFpbE9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1haWxPcmdcIikudmFsdWUsXHJcbiAgICAgICAgJ3Bob25lT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaG9uZU9yZ1wiKS52YWx1ZSxcclxuICAgICAgICAncGxhY2VzT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGFjZXNDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICdsb2dpbk9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5Db21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICdwc3dkT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwc3dkQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICAgICAnYWRkcmVzc09yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkcmVzc09yZ1wiKS52YWx1ZSxcclxuICAgICAgICAnaWQnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkQ29tcGFueVwiKS5pbm5lckhUTUxcclxuICAgIH07XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuc2V0VHlwZXNPcmdhbmlzYXRpb25TZWxlY3QgPSBmdW5jdGlvbiAodHlwZXNPcmdhbmlzYXRpb24pIHtcclxuICAgIGxldCB0eXBlT3JnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlQ29tcGFueVwiKTtcclxuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4odHlwZU9yZyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHR5cGVzT3JnYW5pc2F0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XHJcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9IHR5cGVzT3JnYW5pc2F0aW9uW2ldLm5hbWU7XHJcbiAgICAgICAgdHlwZU9yZy5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5zZXRPcmdhbmlzYXRpb25zTGlzdCA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb25zLCBpZExpc3QpIHtcclxuICAgIGxldCBsaXN0T3JnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRMaXN0KTtcclxuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4obGlzdE9yZyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZ2FuaXNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZGl2X2xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfbGlzdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3RcIik7XHJcblxyXG4gICAgICAgIGxldCBkaXZfbGlzdF9jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtY29udGVudCBpbmxpbmUtYmxvY2tcIik7XHJcbiAgICAgICAgaWYgKGlkTGlzdCA9PT0gXCJvcmdhbmlzYXRpb25MaXN0XCIpIHtcclxuICAgICAgICAgICAgZGl2X2xpc3RfY29udGVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixcclxuICAgICAgICAgICAgICAgIHRoaXMub25DbGlja0Rpc3BsYXlJbmZvQWJvdXRPcmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNwYW5fbGlzdF90aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXRpdGxlXCIpO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJpZF9vcmdhbmlzYXRpb25cIiwgb3JnYW5pc2F0aW9uc1tpXS5pZCk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLmlubmVySFRNTCA9IG9yZ2FuaXNhdGlvbnNbaV0ubmFtZTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF90aXRsZSk7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3Rfc3VidGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3N1YnRpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1zdWJ0aXRsZVwiKTtcclxuICAgICAgICBzcGFuX2xpc3Rfc3VidGl0bGUuaW5uZXJIVE1MID0gJ9CS0YHQtdCz0L4g0LzQtdGB0YI6ICdcclxuICAgICAgICAgICAgKyBvcmdhbmlzYXRpb25zW2ldLm1heF9zdHVkZW50c19udW1iZXI7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3Rfc3VidGl0bGUpO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl9saXN0X3JlbWFyayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3RfcmVtYXJrLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1yZW1hcmtcIik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3JlbWFyay5pbm5lckhUTUwgPSAn0J7RgdGC0LDQu9C+0YHRjDogJ1xyXG4gICAgICAgICAgICArIG9yZ2FuaXNhdGlvbnNbaV0ubWF4X3N0dWRlbnRzX251bWJlcjtcclxuICAgICAgICAvKtCe0JHQr9CX0JDQotCV0JvQrNCd0J4g0JjQodCf0KDQkNCS0JjQotCsINCd0JAg0JrQntCb0JjQp9CV0KHQotCS0J4g0J7QodCi0JDQktCo0JjQpdCh0K8g0JzQldCh0KIuISEhISEhISEhISEhISEhISEhISEhISEhISEhKi9cclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9yZW1hcmspO1xyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfbGlzdF9jb250ZW50KTtcclxuXHJcbiAgICAgICAgbGV0IGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICAgIFwiaW5saW5lLWJsb2NrIGxpc3QtY29udGVudCBzZXR0aW5nc09yZ2FuaXNhdGlvblwiKTtcclxuICAgICAgICBpZiAoaWRMaXN0ID09PSBcIm9yZ2FuaXNhdGlvbkxpc3RcIikge1xyXG4gICAgICAgICAgICBsZXQgc3Bhbl91c2VyX3BsdXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgIHNwYW5fdXNlcl9wbHVzLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICAgICAgICBcIm1pZi11c2VyLXBsdXMgbWlmLWxnIGZnLWdyYXkgYWRkLXN0dWRlbnQtb3JnYW5pc2F0aW9uXCIpO1xyXG4gICAgICAgICAgICBzcGFuX3VzZXJfcGx1cy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixcclxuICAgICAgICAgICAgICAgIHRoaXMub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvblNob3dEaWFsb2cpO1xyXG4gICAgICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fdXNlcl9wbHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzcGFuX3BlbmNpbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX3BlbmNpbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICBcIm1pZi1wZW5jaWwgbWlmLWxnIGZnLWdyYXkgZWRpdC1vcmdhbmlzYXRpb25cIik7XHJcbiAgICAgICAgc3Bhbl9wZW5jaWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25DbGlja0VkaXRPcmdhbmlzYXRpb24pO1xyXG4gICAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uYXBwZW5kQ2hpbGQoc3Bhbl9wZW5jaWwpO1xyXG5cclxuICAgICAgICAvKiBsZXQgc3Bhbl9jYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgIHNwYW5fY2FuY2VsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibWlmLWNhbmNlbCBtaWYtbGcgZmcteWVsbG93XCIpO1xyXG4gICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fY2FuY2VsKTsqL1xyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uKTtcclxuXHJcbiAgICAgICAgbGlzdE9yZy5hcHBlbmRDaGlsZChkaXZfbGlzdCk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5nZXRJZE9yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IGlkT3JnYW5pc2F0aW9uID0gMDtcclxuICAgIGlmIChldmVudC50YXJnZXQuaWQgPT09IFwidXBkYXRlT3JnYW5pc2F0aW9uXCIpIHtcclxuICAgICAgICBpZE9yZ2FuaXNhdGlvbiA9ICtldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jaGlsZHJlblswXS5jaGlsZHJlblsyXS5pbm5lckhUTUw7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZE9yZ2FuaXNhdGlvbiA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uZ2V0QXR0cmlidXRlKFxyXG4gICAgICAgICAgICBcImlkX29yZ2FuaXNhdGlvblwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBpZE9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldE5hbWVPcmdhbmlzYXRpb25JblRyZWV2aWV3ID0gZnVuY3Rpb24gKGlkVHJlZXZpZXcpIHtcclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZFRyZWV2aWV3KTtcclxuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gcGFyZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXHJcbiAgICAgICAgXCJhY3RpdmVcIilbMF0ucXVlcnlTZWxlY3RvcignW2lkX29yZ2FuaXNhdGlvbicpLmlubmVySFRNTDtcclxuICAgIHJldHVybiBuYW1lT3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuc2hvd0RpYWxvZ09yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmFtZUNvbXBhbnlcIikudmFsdWUgPSBvcmdhbmlzYXRpb24ubmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRDb21wYW55XCIpLmlubmVySFRNTCA9IG9yZ2FuaXNhdGlvbi5pZDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mb0NvbXBhbnlcIikudmFsdWUgPSBvcmdhbmlzYXRpb24uaW5mb19vcmdhbmlzYXRpb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBob25lT3JnXCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLnBob25lX29yZ2FuaXNhdGlvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1haWxPcmdcIikudmFsdWUgPSBvcmdhbmlzYXRpb24uZW1haWxfb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJhZGRyZXNzT3JnXCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLmFkZHJlc3Nfb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJwbGFjZXNDb21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLm1heF9zdHVkZW50c19udW1iZXI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBcImxvZ2luQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5sb2dpbl9vcmdhbmlzYXRpb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBzd2RDb21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLnBzd2Rfb3JnYW5pc2F0aW9uO1xyXG4gICAgbWV0cm9EaWFsb2cub3BlbignI2RpYWxvZ0NyZWF0ZUNvbXBhbnknKTtcclxufTtcclxuVmlldy5wcm90b3R5cGUuZGlhbG9nT3BlbiA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgbWV0cm9EaWFsb2cub3BlbihpZCk7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZU9yZ2FuaXNhdGlvblRpdGxlID0gZnVuY3Rpb24gKG5hbWVPcmdhbmlzYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcHJvdmVkX3N0dWRlbnRfY291bnQsIG5vbl9hcHByb3ZlZF9zdHVkZW50X2NvdW50KSB7XHJcbiAgICBpZiAobm9uX2FwcHJvdmVkX3N0dWRlbnRfY291bnQgPT09IDApIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5vbkFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcIiwg0L/Rg9GB0YJcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibm9uQXBwcm92ZWRTdHVkZW50TGlzdFRpdGxlXCIpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ05hbWVcIikuaW5uZXJIVE1MID0gbmFtZU9yZ2FuaXNhdGlvbjtcclxuXHJcbiAgICBpZiAoYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9PT0gMCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICBcImFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcItCh0L/QuNGB0L7QuiDRg9GC0LLQtdGA0LbQtNC10L3QvdGL0YUg0YHRgtGD0LTQtdC90YLQvtCyINC/0YPRgdGCLlwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgIFwiYXBwcm92ZWRTdHVkZW50TGlzdFRpdGxlXCIpLmlubmVySFRNTCA9IFwi0KHQv9C40YHQvtC6INGD0YLQstC10YDQttC00LXQvdC90YvRhSDRgdGC0YPQtNC10L3RgtC+0LIuXCI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RlZE9yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzTmFtZSA9PT0gXCJsaXN0LWNvbnRlbnQgaW5saW5lLWJsb2NrXCIpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbkNsaWNrID0gZWxlbWVudC5jaGlsZHJlblswXS5pbm5lckhUTUw7XHJcbiAgICByZXR1cm4gbmFtZU9yZ2FuaXNhdGlvbkNsaWNrO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0TmFtZU9yZ2FuaXNhdGlvbkJ5VGl0bGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdOYW1lXCIpLmlubmVySFRNTDtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZVN0dWRlbnRzTGlzdFZpZXcgPSBmdW5jdGlvbiAoc3R1ZGVudHMsIGlkTGlzdCkge1xyXG4gICAgbGV0IGxpc3RTdHVkZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkTGlzdCk7XHJcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKGxpc3RTdHVkZW50cyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGRpdl9saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X2xpc3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0XCIpO1xyXG5cclxuICAgICAgICBsZXQgZGl2X2xpc3RfY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LWNvbnRlbnQgaW5saW5lLWJsb2NrXCIpO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl9saXN0X3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtdGl0bGVcIik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcInJlcXVlc3RcIiwgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdCk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcInVpZFwiLCBzdHVkZW50c1tpXS51aWRfc3R1ZGVudCk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcIm9yZ1wiLCBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb24pO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5pbm5lckhUTUwgPSBzdHVkZW50c1tpXS5kaXNwbGF5TmFtZTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF90aXRsZSk7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3Rfc3VidGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3N1YnRpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1zdWJ0aXRsZVwiKTtcclxuICAgICAgICBzcGFuX2xpc3Rfc3VidGl0bGUuaW5uZXJIVE1MID0gc3R1ZGVudHNbaV0uZ3JvdXBfbmFtZTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9zdWJ0aXRsZSk7XHJcblxyXG4gICAgICAgIGxldCB5ZWFyID0gc3R1ZGVudHNbaV0uZGF0ZV9jcmVhdGlvbl9yZXF1ZXN0LnN1YnN0cigwLCA0KSxcclxuICAgICAgICAgICAgbW9udGggPSBzdHVkZW50c1tpXS5kYXRlX2NyZWF0aW9uX3JlcXVlc3Quc3Vic3RyKDUsIDIpLFxyXG4gICAgICAgICAgICBkYXkgPSBzdHVkZW50c1tpXS5kYXRlX2NyZWF0aW9uX3JlcXVlc3Quc3Vic3RyKDgsIDIpO1xyXG4gICAgICAgIGxldCBkYXRlID0gZGF5ICsgJy0nICsgbW9udGggKyAnLScgKyB5ZWFyO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl9saXN0X3JlbWFyayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3RfcmVtYXJrLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1yZW1hcmtcIik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3JlbWFyay5pbm5lckhUTUwgPSAn0JTQsNGC0LAg0LfQsNC/0LjRgdC4OiAnICsgZGF0ZTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9yZW1hcmspO1xyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfbGlzdF9jb250ZW50KTtcclxuXHJcbiAgICAgICAgbGV0IGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICAgIFwiaW5saW5lLWJsb2NrIGxpc3QtY29udGVudCBzZXR0aW5nc09yZ2FuaXNhdGlvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKGlkTGlzdCAhPT0gXCJhcHByb3ZlZFN0dWRlbnRzXCIpIHtcclxuICAgICAgICAgICAgbGV0IHNwYW5fc3R1ZGVudF9hcHByb3ZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICBzcGFuX3N0dWRlbnRfYXBwcm92ZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJtaWYtY2hlY2ttYXJrIG1pZi1sZyBmZy1ncmVlblwiKTtcclxuICAgICAgICAgICAgc3Bhbl9zdHVkZW50X2FwcHJvdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tBcHByb3ZlU3R1ZGVudCk7XHJcbiAgICAgICAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uYXBwZW5kQ2hpbGQoc3Bhbl9zdHVkZW50X2FwcHJvdmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNwYW5fc3R1ZGVudF9yZWplY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9zdHVkZW50X3JlamVjdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1pZi1jYW5jZWwgbWlmLWxnIGZnLXJlZFwiKTtcclxuICAgICAgICBzcGFuX3N0dWRlbnRfcmVqZWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uQ2xpY2tSZWplY3RTdHVkZW50KTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fc3R1ZGVudF9yZWplY3QpO1xyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uKTtcclxuXHJcbiAgICAgICAgbGlzdFN0dWRlbnRzLmFwcGVuZENoaWxkKGRpdl9saXN0KTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxsT3JnYW5pc2F0aW9uc0xpc3RCbG9ja1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0dWRlbnRzUmVxdWVzdHNcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnJlbmRlck9yZ2FuaXNhdGlvblNlY3Rpb24gPSBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25MaXN0Q3VycmVudFByYWN0aWNlVGV4dFwiKTtcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICB0ZXh0LmlubmVySFRNTCA9IFwi0KHQv9C40YHQvtC6INC+0YDQs9Cw0L3QuNC30LDRhtC40Lkg0LIg0L/RgNCw0LrRgtC40LrQtVwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGV4dC5pbm5lckhUTUwgPSBcItCf0YDQsNC60YLQuNC60Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIjtcclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLk9wZW5PckNsb3NlTG9hZEltYWdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRcIikuc3R5bGUuZGlzcGxheTtcclxuICAgIGlmIChkaXNwbGF5ID09PSBcImJsb2NrXCIpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkU3R1ZGVudCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IG5vZGUgPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgJ1tyZXF1ZXN0XScpO1xyXG4gICAgbGV0IHN0dWRlbnQgPSB7XHJcbiAgICAgICAgJ2lkX3JlcXVlc3QnOiBub2RlLmdldEF0dHJpYnV0ZShcInJlcXVlc3RcIiksXHJcbiAgICAgICAgJ3VpZF9zdHVkZW50Jzogbm9kZS5nZXRBdHRyaWJ1dGUoXCJ1aWRcIiksXHJcbiAgICAgICAgJ2lkX29yZ2FuaXNhdGlvbic6IG5vZGUuZ2V0QXR0cmlidXRlKFwib3JnXCIpXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikuaW5kZXhPZihcIm1pZi1jYW5jZWxcIikgPT09IDApIHtcclxuICAgICAgICBzdHVkZW50WydpZF9zdGF0dXMnXSA9IDI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzdHVkZW50WydpZF9zdGF0dXMnXSA9IDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3R1ZGVudDtcclxufTtcclxuVmlldy5wcm90b3R5cGUuc2V0WWVhcnNBcnJheSA9IGZ1bmN0aW9uICh5ZWFycykge1xyXG4gICAgbGV0IGJ1dHRvbkFycmF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25zQXJyYXlcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHllYXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIml0ZW0geWVhclwiKTtcclxuICAgICAgICBzcGFuLmlubmVySFRNTCA9IHllYXJzW2ldO1xyXG4gICAgICAgIGJ1dHRvbkFycmF5LmFwcGVuZENoaWxkKHNwYW4pO1xyXG4gICAgfVxyXG4gICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICBzcGFuLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaXRlbSB5ZWFyXCIpO1xyXG4gICAgc3Bhbi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImNyZWF0ZVByYWN0aWNlQnRuXCIpO1xyXG4gICAgc3Bhbi5pbm5lckhUTUwgPSBcIitcIjtcclxuICAgIGJ1dHRvbkFycmF5LmFwcGVuZENoaWxkKHNwYW4pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVQcmFjdGljZUJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UpO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRTdHVkZW50cyA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IFN0dWRlbnRzID0gW107XHJcbiAgICBsZXQgbm9kZXMgPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpjaGVja2VkJyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKG5vZGVzW2ldLnBhcmVudEVsZW1lbnQubmV4dFNpYmxpbmcuaW5uZXJIVE1MLmluZGV4T2YoXCLQutGD0YDRgVwiKSA9PT0gLTFcclxuICAgICAgICAgICAgJiYgaXNOYU4oK25vZGVzW2ldLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTC5zdWJzdHIoMCxcclxuICAgICAgICAgICAgICAgIDIpKSkge1xyXG4gICAgICAgICAgICBsZXQgbmFtZSA9IG5vZGVzW2ldLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTDtcclxuICAgICAgICAgICAgbGV0IHVpZCA9IG5vZGVzW2ldLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVpZFwiKTtcclxuICAgICAgICAgICAgU3R1ZGVudHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgICAgICAgICAgdWlkOiB1aWRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFN0dWRlbnRzO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZGlhbG9nRW5hYmxlQ2hlY2tib3hlcyA9IGZ1bmN0aW9uIChuYW1lc0dyb3VwcywgaWRFbGVtZW50KSB7XHJcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRFbGVtZW50KTtcclxuICAgIGxldCBpbnB1dHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuYW1lc0dyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoaW5wdXRzW2ldLnBhcmVudEVsZW1lbnQubmV4dFNpYmxpbmcuaW5uZXJIVE1MID09PSBuYW1lc0dyb3Vwc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvdXJzZSA9IGlucHV0c1tpXS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvdXJzZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIikgPT09IFwiY2hlY2tib3hcIiAmJiBjb3Vyc2UuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikuaW5kZXhPZihcImFjdGl2ZS1jb3Vyc2VcIikgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChjb3Vyc2UpLmFkZENsYXNzKFwiYWN0aXZlLWNvdXJzZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlucHV0c1tpXS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgICAgIGxldCBzdHVkZW50c0NoZWNrYm94ZXMgPSBpbnB1dHNbaV0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAgICAgICAgICAgICAgICAgJ1tkYXRhLXVpZF0nKTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgc3R1ZGVudHNDaGVja2JveGVzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3R1ZGVudHNDaGVja2JveGVzW25dLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykucmVtb3ZlQXR0cmlidXRlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0RWxlbUJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgcmV0dXJuIGVsZW07XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVJbnB1dHNPcmRlciA9IGZ1bmN0aW9uIChzZWxlY3RlZEdyb3Vwcykge1xyXG4gICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JkZXItYmxvY2tcIik7XHJcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKHBhcmVudCk7XHJcbiAgICBsZXQgaDQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XHJcbiAgICBoNC5pbm5lckhUTUwgPSBcItCg0YPQutC+0LLQvtC00LjRgtC10LvQuFwiO1xyXG4gICAgaDQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhbGlnbi1jZW50ZXJcIik7XHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaDQpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZpZWxkIG1hcmdpbjIwXCIpO1xyXG5cclxuICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcclxuICAgICAgICBwLmlubmVySFRNTCA9IHNlbGVjdGVkR3JvdXBzW2ldO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChwKTtcclxuXHJcbiAgICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImdyb3VwTmFtZVwiLCBzZWxlY3RlZEdyb3Vwc1tpXSk7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVJbnB1dHNSZXBvcnQgPSBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyb3Vwcy1yZXBvcnQtYmxvY2tcIik7XHJcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKHBhcmVudCk7XHJcbiAgICBsZXQgaDQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XHJcbiAgICBoNC5pbm5lckhUTUwgPSBcItCY0L3RhNC+0YDQvNCw0YbQuNGPINC/0L4g0LrQsNC20LTQvtC5INCz0YDRg9C/0L/QtVwiO1xyXG4gICAgaDQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhbGlnbi1jZW50ZXJcIik7XHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaDQpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBoNCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcclxuICAgICAgICBoNC5pbm5lckhUTUwgPXNlbGVjdGVkR3JvdXBzW2ldO1xyXG4gICAgICAgIGg0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYWxpZ24tY2VudGVyXCIpO1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChoNCk7XHJcblxyXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZpZWxkIG1hcmdpbjIwXCIpO1xyXG4gICAgICAgIGxldCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICAgICAgcC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImlubGluZS1ibG9jayBzdWItaGVhZGVyXCIpO1xyXG4gICAgICAgIHAuaW5uZXJIVE1MID0gXCLQoNGD0LrQvtCy0L7QtNC40YLQtdC70YxcIjtcclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGRpdik7XHJcblxyXG4gICAgICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZmllbGQgbWFyZ2luMjBcIik7XHJcbiAgICAgICAgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcclxuICAgICAgICBwLmlubmVySFRNTCA9IFwi0KHRgtGD0LQuICg0INC4IDUpXCI7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHApO1xyXG4gICAgICAgIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGRpdik7XHJcblxyXG4gICAgICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZmllbGQgbWFyZ2luMjBcIik7XHJcbiAgICAgICAgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcclxuICAgICAgICBwLmlubmVySFRNTCA9IFwi0JrQvtC7LdCy0L4g0LvQtdC60YbQuNC5XCI7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHApO1xyXG4gICAgICAgIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRJbmZvcm1hdGlvbkZvckRvY3VtZW50T3JkZXIgPSBmdW5jdGlvbiAocHJhY3RpY2UsIHNlbGVjdGVkR3JvdXBzLCBhbGxHcm91cHMpIHtcclxuICAgIGxldCB0cmVlVmlldyA9IDA7XHJcbiAgICBsZXQgZ3JvdXBzRm9yRG9jdW1lbnQgPSBbXTtcclxuICAgIGxldCBmcmFtZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZnJhbWVzXCIpWzBdLmNoaWxkcmVuO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoZnJhbWVzW2ldLnN0eWxlLmRpc3BsYXkgIT09IFwibm9uZVwiKSB7XHJcbiAgICAgICAgICAgIHRyZWVWaWV3ID0gZnJhbWVzW2ldLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgZWR1Y2F0aW9uYWxfbGV2ZWwgPSB0cmVlVmlldy5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcclxuICAgIGlmIChlZHVjYXRpb25hbF9sZXZlbC5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZWR1Y2F0aW9uYWxfbGV2ZWwgPSBcImJhY2hlbG9yXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBlZHVjYXRpb25hbF9sZXZlbCA9IFwibWFzdGVyXCI7XHJcbiAgICB9XHJcbiAgICBsZXQgYmxvY2tUZWFjaGVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JkZXItYmxvY2tcIikuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpO1xyXG4gICAgbGV0IHRlYWNoZXJzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2NrVGVhY2hlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZ3JvdXBOYW1lID0gYmxvY2tUZWFjaGVyc1tpXS5jaGlsZHJlblswXS5pbm5lckhUTUw7XHJcbiAgICAgICAgbGV0IHRlYWNoZXIgPSBibG9ja1RlYWNoZXJzW2ldLmNoaWxkcmVuWzFdLnZhbHVlO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2pdID09PSBncm91cE5hbWUpXHJcbiAgICAgICAgICAgICAgICB0ZWFjaGVycy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBcImdyb3VwTmFtZVwiOiBncm91cE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZWFjaGVyXCI6IHRlYWNoZXJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuaW5mb0dyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0uaW5kZXhPZih0aGlzLmluZm9Hcm91cHNbal0ubmFtZSkgIT09IC0xICYmIHRoaXMuaW5mb0dyb3Vwc1tqXS50eXBlID09PSBlZHVjYXRpb25hbF9sZXZlbCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBhbGxHcm91cHMubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IGFsbEdyb3Vwc1tuXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGVhY2hlcnMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEdyb3Vwc1tpXSA9PT0gdGVhY2hlcnNba10uZ3JvdXBOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLnRlYWNoZXIgPSB0ZWFjaGVyc1trXS50ZWFjaGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS50eXBlID0gdGhpcy5pbmZvR3JvdXBzW2pdLnR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLmZ1bGxOYW1lID0gdGhpcy5pbmZvR3JvdXBzW2pdLmZ1bGxOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS5wcm9maWxlID0gdGhpcy5pbmZvR3JvdXBzW2pdLnByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBzRm9yRG9jdW1lbnQucHVzaChhbGxHcm91cHNbbl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IGRlYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYW5cIikudmFsdWU7XHJcbiAgICBsZXQgaGVhZF9vZl9kZXBhcnRtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWFkX29mX2RlcGFydG1lbnRcIikudmFsdWU7XHJcbiAgICBsZXQgdHlwZV9kb2N1bWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2R0eXBlRG9jdW1lbnRcIikub3B0aW9uc1tkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdkdHlwZURvY3VtZW50XCIpLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xyXG4gICAgbGV0IGRvY3VtZW50cyA9IFtdO1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlVGFiXCIpLnZhbHVlO1xyXG4gICAgdHlwZVByYWN0aWNlID0gdHlwZVByYWN0aWNlLnJlcGxhY2VBdCh0eXBlUHJhY3RpY2UubGVuZ3RoIC0gMSwgXCLQuVwiKTtcclxuICAgIHR5cGVQcmFjdGljZSA9IHR5cGVQcmFjdGljZS5yZXBsYWNlQXQodHlwZVByYWN0aWNlLmxlbmd0aCAtIDIsIFwi0L5cIik7XHJcbiAgICB0eXBlUHJhY3RpY2UgPSB0eXBlUHJhY3RpY2UudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICBsZXQgc3RhcnRfeWVhciA9IHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDAsIDQpLFxyXG4gICAgICAgIHN0YXJ0X21vbnRoID0gcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoNSwgMiksXHJcbiAgICAgICAgc3RhcnRfZGF5ID0gcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoOCwgMiksXHJcbiAgICAgICAgZW5kX3llYXIgPSBwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoMCwgNCksXHJcbiAgICAgICAgZW5kX21vbnRoID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDUsIDIpLFxyXG4gICAgICAgIGVuZF9kYXkgPSBwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoOCwgMik7XHJcblxyXG4gICAgbGV0IHN0YXJ0X2RhdGUgPSBzdGFydF9kYXkgKyAnLicgKyBzdGFydF9tb250aCArICcuJyArIHN0YXJ0X3llYXI7XHJcbiAgICBsZXQgZW5kX2RhdGUgPSBlbmRfZGF5ICsgJy4nICsgZW5kX21vbnRoICsgJy4nICsgZW5kX3llYXI7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHNGb3JEb2N1bWVudC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBzdHVkZW50cyA9IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnN0dWRlbnRzO1xyXG4gICAgICAgIGxldCBzdHIgPSBKU09OLnN0cmluZ2lmeShzdHVkZW50cywgW1wibmFtZVwiXSk7XHJcbiAgICAgICAgc3R1ZGVudHMgPSBKU09OLnBhcnNlKHN0cik7XHJcbiAgICAgICAgbGV0IGRvY3VtZW50ID0ge1xyXG4gICAgICAgICAgICBcImRpcmVjdGlvblwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5mdWxsTmFtZSxcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnByb2ZpbGUsXHJcbiAgICAgICAgICAgIFwiZGVhblwiOiBkZWFuLFxyXG4gICAgICAgICAgICBcImhlYWRfb2ZfZGVwYXJ0bWVudFwiOiBoZWFkX29mX2RlcGFydG1lbnQsXHJcbiAgICAgICAgICAgIFwidHlwZV9wcmFjdGljZVwiOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBzdGFydF9kYXRlLFxyXG4gICAgICAgICAgICBcImVuZF9kYXRlXCI6IGVuZF9kYXRlLFxyXG4gICAgICAgICAgICBcImdyb3VwX25hbWVcIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0ubmFtZSxcclxuICAgICAgICAgICAgXCJzdXBlcnZpc29yXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnRlYWNoZXIsXHJcbiAgICAgICAgICAgIFwic3R1ZGVudHNcIjogc3R1ZGVudHNcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRvY3VtZW50cy5wdXNoKGRvY3VtZW50KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkb2N1bWVudHM7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRJbmZvcm1hdGlvbkZvckRvY3VtZW50UmVwb3J0ID0gZnVuY3Rpb24gKHByYWN0aWNlLCBzZWxlY3RlZEdyb3VwcywgYWxsR3JvdXBzKSB7XHJcbiAgICBsZXQgdHJlZVZpZXcgPSAwO1xyXG4gICAgbGV0IGdyb3Vwc0ZvckRvY3VtZW50ID0gW107XHJcbiAgICBsZXQgZnJhbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZyYW1lc1wiKVswXS5jaGlsZHJlbjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGZyYW1lc1tpXS5zdHlsZS5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xyXG4gICAgICAgICAgICB0cmVlVmlldyA9IGZyYW1lc1tpXS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IGVkdWNhdGlvbmFsX2xldmVsID0gdHJlZVZpZXcuZ2V0QXR0cmlidXRlKFwiaWRcIik7XHJcbiAgICBpZiAoZWR1Y2F0aW9uYWxfbGV2ZWwuaW5kZXhPZihcImJhY2hlbG9yXCIpICE9PSAtMSkge1xyXG4gICAgICAgIGVkdWNhdGlvbmFsX2xldmVsID0gXCJiYWNoZWxvclwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZWR1Y2F0aW9uYWxfbGV2ZWwgPSBcIm1hc3RlclwiO1xyXG4gICAgfVxyXG4gICAgbGV0IGJsb2NrVGVhY2hlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZGVyLWJsb2NrXCIpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKTtcclxuICAgIGxldCB0ZWFjaGVycyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja1RlYWNoZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwTmFtZSA9IGJsb2NrVGVhY2hlcnNbaV0uY2hpbGRyZW5bMF0uaW5uZXJIVE1MO1xyXG4gICAgICAgIGxldCB0ZWFjaGVyID0gYmxvY2tUZWFjaGVyc1tpXS5jaGlsZHJlblsxXS52YWx1ZTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEdyb3Vwc1tqXSA9PT0gZ3JvdXBOYW1lKVxyXG4gICAgICAgICAgICAgICAgdGVhY2hlcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJncm91cE5hbWVcIjogZ3JvdXBOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVhY2hlclwiOiB0ZWFjaGVyXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmluZm9Hcm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2ldLmluZGV4T2YodGhpcy5pbmZvR3JvdXBzW2pdLm5hbWUpICE9PSAtMSAmJiB0aGlzLmluZm9Hcm91cHNbal0udHlwZSA9PT0gZWR1Y2F0aW9uYWxfbGV2ZWwpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgYWxsR3JvdXBzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2ldID09PSBhbGxHcm91cHNbbl0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRlYWNoZXJzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IHRlYWNoZXJzW2tdLmdyb3VwTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS50ZWFjaGVyID0gdGVhY2hlcnNba10udGVhY2hlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0udHlwZSA9IHRoaXMuaW5mb0dyb3Vwc1tqXS50eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS5mdWxsTmFtZSA9IHRoaXMuaW5mb0dyb3Vwc1tqXS5mdWxsTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0ucHJvZmlsZSA9IHRoaXMuaW5mb0dyb3Vwc1tqXS5wcm9maWxlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3Vwc0ZvckRvY3VtZW50LnB1c2goYWxsR3JvdXBzW25dKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBkZWFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFuXCIpLnZhbHVlO1xyXG4gICAgbGV0IGhlYWRfb2ZfZGVwYXJ0bWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVhZF9vZl9kZXBhcnRtZW50XCIpLnZhbHVlO1xyXG4gICAgbGV0IHR5cGVfZG9jdW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdkdHlwZURvY3VtZW50XCIpLm9wdGlvbnNbZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZHR5cGVEb2N1bWVudFwiKS5zZWxlY3RlZEluZGV4XS52YWx1ZTtcclxuICAgIGxldCBkb2N1bWVudHMgPSBbXTtcclxuICAgIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVQcmFjdGljZVRhYlwiKS52YWx1ZTtcclxuICAgIHR5cGVQcmFjdGljZSA9IHR5cGVQcmFjdGljZS5yZXBsYWNlQXQodHlwZVByYWN0aWNlLmxlbmd0aCAtIDEsIFwi0LlcIik7XHJcbiAgICB0eXBlUHJhY3RpY2UgPSB0eXBlUHJhY3RpY2UucmVwbGFjZUF0KHR5cGVQcmFjdGljZS5sZW5ndGggLSAyLCBcItC+XCIpO1xyXG4gICAgdHlwZVByYWN0aWNlID0gdHlwZVByYWN0aWNlLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgbGV0IHN0YXJ0X3llYXIgPSBwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlLnN1YnN0cigwLCA0KSxcclxuICAgICAgICBzdGFydF9tb250aCA9IHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDUsIDIpLFxyXG4gICAgICAgIHN0YXJ0X2RheSA9IHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDgsIDIpLFxyXG4gICAgICAgIGVuZF95ZWFyID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDAsIDQpLFxyXG4gICAgICAgIGVuZF9tb250aCA9IHByYWN0aWNlLmVuZF9kYXRlX3ByYWN0aWNlLnN1YnN0cig1LCAyKSxcclxuICAgICAgICBlbmRfZGF5ID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDgsIDIpO1xyXG5cclxuICAgIGxldCBzdGFydF9kYXRlID0gc3RhcnRfZGF5ICsgJy4nICsgc3RhcnRfbW9udGggKyAnLicgKyBzdGFydF95ZWFyO1xyXG4gICAgbGV0IGVuZF9kYXRlID0gZW5kX2RheSArICcuJyArIGVuZF9tb250aCArICcuJyArIGVuZF95ZWFyO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzRm9yRG9jdW1lbnQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgc3R1ZGVudHMgPSBncm91cHNGb3JEb2N1bWVudFtpXS5zdHVkZW50cztcclxuICAgICAgICBsZXQgc3RyID0gSlNPTi5zdHJpbmdpZnkoc3R1ZGVudHMsIFtcIm5hbWVcIl0pO1xyXG4gICAgICAgIHN0dWRlbnRzID0gSlNPTi5wYXJzZShzdHIpO1xyXG4gICAgICAgIGxldCBkb2N1bWVudCA9IHtcclxuICAgICAgICAgICAgXCJkaXJlY3Rpb25cIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0uZnVsbE5hbWUsXHJcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5wcm9maWxlLFxyXG4gICAgICAgICAgICBcImRlYW5cIjogZGVhbixcclxuICAgICAgICAgICAgXCJoZWFkX29mX2RlcGFydG1lbnRcIjogaGVhZF9vZl9kZXBhcnRtZW50LFxyXG4gICAgICAgICAgICBcInR5cGVfcHJhY3RpY2VcIjogdHlwZVByYWN0aWNlLFxyXG4gICAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogc3RhcnRfZGF0ZSxcclxuICAgICAgICAgICAgXCJlbmRfZGF0ZVwiOiBlbmRfZGF0ZSxcclxuICAgICAgICAgICAgXCJncm91cF9uYW1lXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLm5hbWUsXHJcbiAgICAgICAgICAgIFwic3VwZXJ2aXNvclwiOiBncm91cHNGb3JEb2N1bWVudFtpXS50ZWFjaGVyLFxyXG4gICAgICAgICAgICBcInN0dWRlbnRzXCI6IHN0dWRlbnRzXHJcbiAgICAgICAgfTtcclxuICAgICAgICBkb2N1bWVudHMucHVzaChkb2N1bWVudCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZG9jdW1lbnRzO1xyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RWYWx1ZSA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgbGV0IHZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLm9wdGlvbnNbZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuY2hhbmdlRGlzcGxheSA9IGZ1bmN0aW9uIChpZCwgdmFsdWUpIHtcclxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgZWxlbS5zdHlsZS5kaXNwbGF5ID12YWx1ZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNoYW5nZUlubmVySHRtbCA9IGZ1bmN0aW9uIChpZCwgdmFsdWUpIHtcclxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgZWxlbS5pbm5lckhUTUwgPXZhbHVlO1xyXG59O1xyXG5cclxuU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQXQgPSBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdWJzdHIoMCwgaW5kZXgpICsgcmVwbGFjZW1lbnQgKyB0aGlzLnN1YnN0cihpbmRleCArIHJlcGxhY2VtZW50Lmxlbmd0aCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvVmlldy5qcyIsIlxyXG5jb25zdCBTRVBURU1CRVIgPSA5O1xyXG5jb25zdCBmaXJzdENvdXJzZSA9IDA7XHJcbmNvbnN0IHNlY29uZENvdXJzZSA9IDE7XHJcbmNvbnN0IHRoaXJkQ291cnNlID0gMjtcclxuY29uc3QgZm91cnRoQ291cnNlID0gMztcclxuY29uc3QgbWFzdGVyRmlyc3RDb3Vyc2UgPSA0O1xyXG5jb25zdCBtYXN0ZXJTZWNvbmRDb3Vyc2UgPSA1O1xyXG5jb25zdCBSRUpFQ1RFRCA9IDI7XHJcbmNvbnN0IEFQUFJPVkVEID0gMTtcclxuY29uc3QgQVBQTFkgPSAwO1xyXG52YXIgTW9kZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5Hcm91cHMgPSBbXTtcclxuICB0aGlzLlN0dWRlbnRzID0gW107XHJcbiAgdGhpcy5Db3Vyc2VzID0gW107XHJcbiAgdGhpcy50eXBlc09yZ2FuaXNhdGlvbiA9IFtdO1xyXG4gIHRoaXMuT3JnYW5pc2F0aW9ucyA9IFtdO1xyXG5cclxufTtcclxuXHJcbmNsYXNzIENvdXJzZSB7XHJcbiAgY29uc3RydWN0b3IobmFtZUNvdXJzZSkge1xyXG4gICAgdGhpcy5uYW1lQ291cnNlID0gbmFtZUNvdXJzZTtcclxuICAgIHRoaXMuZ3JvdXBzID0gW107XHJcbiAgfVxyXG5cclxuICBhZGRHcm91cChncm91cCkge1xyXG4gICAgdGhpcy5ncm91cHMucHVzaChncm91cCk7XHJcbiAgfVxyXG59XHJcblxyXG5jbGFzcyBHcm91cCB7XHJcbiAgY29uc3RydWN0b3IodWlkX0xEQVAsIG5hbWVHcm91cCkge1xyXG4gICAgdGhpcy5uYW1lID0gbmFtZUdyb3VwO1xyXG4gICAgdGhpcy51aWRfTERBUCA9IHVpZF9MREFQO1xyXG4gICAgdGhpcy5zdHVkZW50cyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgYWRkU3R1ZGVudChzdHVkZW50KSB7XHJcbiAgICB0aGlzLnN0dWRlbnRzLnB1c2goc3R1ZGVudCk7XHJcbiAgfVxyXG59XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuTW9kZWwucHJvdG90eXBlLmdldERhdGEgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMsXHJcbiAgICByZXF1ZXN0c19vcmdhbmlzYXRpb25zKSB7XHJcbiAgbGV0IGRhdGEgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMCwgbCA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7ICsraikge1xyXG4gICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLmxlbmd0aDsgKytrLCArK2wpIHtcclxuICAgICAgICAgIGxldCBpc1N0dWRlbnRBcHBseSA9IGZhbHNlO1xyXG4gICAgICAgICAgZGF0YS5wdXNoKHtncm91cDogdGhpcy5Hcm91cHNbaV0ubmFtZX0pO1xyXG4gICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gPSAnICc7XHJcbiAgICAgICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMubGVuZ3RoOyArK3cpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddLmxlbmd0aDsgKytuKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLmlkX3JlcXVlc3RcclxuICAgICAgICAgICAgICAgICAgPT09ICtyZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLmlkX3JlcXVlc3QpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLm5hbWU7XHJcbiAgICAgICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnRfVUlEID0gdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10udWlkO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0uaWRfc3RhdHVzID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGFbbF0uc3RhdHVzID0gcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5pZF9zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uID0gcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5uYW1lX29yZ2FuaXNhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgaXNTdHVkZW50QXBwbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBkYXRhW2xdLm9yZ2FuaXNhdGlvbiArPSByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLm5hbWVfb3JnYW5pc2F0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICArICcsICc7XHJcbiAgICAgICAgICAgICAgICAgIGlzU3R1ZGVudEFwcGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICghaXNTdHVkZW50QXBwbHkpIHtcclxuICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50ID0gdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10ubmFtZTtcclxuICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50X1VJRCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLnVpZDtcclxuICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gPSBcItCd0LUg0LfQsNC/0LjRgdCw0LvRgdGPXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBkYXRhO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEdyb3VwcyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcm94eS9jb3JlL3YxL2dyb3VwcycpO1xyXG4gIGxldCBsaXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICBsZXQgZ3JvdXBzID0gbGlzdC5fZW1iZWRkZWQuZ3JvdXBzO1xyXG4gIHJldHVybiBncm91cHM7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0R3JvdXBzQnlQcmFjdGljZUlkID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgaW5mbyA9IFwiP2lkX3ByYWN0aWNlPVwiXHJcbiAgICAgICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvZ3JvdXBzLWJ5LXByYWN0aWNlLWlkJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgbGV0IGdyb3Vwc191aWRzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICByZXR1cm4gZ3JvdXBzX3VpZHM7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0R3JvdXBzTmFtZUJ5R3JvdXBzVUlEID0gYXN5bmMgZnVuY3Rpb24gKHVpZHNHcm91cHMpIHtcclxuICBsZXQgZ3JvdXBzID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB1aWRzR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgIGlmICgrdWlkc0dyb3Vwc1tpXS51aWRfZ3JvdXAgPT09IHRoaXMuR3JvdXBzW2pdLnVpZF9MREFQKSB7XHJcbiAgICAgICAgZ3JvdXBzLnB1c2godGhpcy5Hcm91cHNbal0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGdyb3VwcztcclxufTtcclxuLyrQv9C+0LvRg9GH0LDQtdC8INGB0YLRg9C00LXQvdGC0L7QsiDQuNC3INGF0YDQsNC90LjQu9C40YnQsCBMREFQINC/0L4gSUQg0LPRgNGD0L/Qv9GLKi9cclxuLypNb2RlbC5wcm90b3R5cGUuZ2V0U3R1ZGVudHNCeUdyb3VwSWQgPSBhc3luYyBmdW5jdGlvbiAoZ3JvdXBJRCkge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvZ3JvdXBzLycgKyBncm91cElEKTtcclxuICBsZXQgbGlzdCA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgbGV0IHN0dWRlbnRzTGlzdCA9IGxpc3QuX2VtYmVkZGVkLnN0dWRlbnRzO1xyXG4gIHJldHVybiBzdHVkZW50c0xpc3Q7XHJcbn07Ki9cclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0J5VUlEID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzX2luZm8pIHtcclxuICBsZXQgc3R1ZGVudHMgPSBbXSwgdXJscyA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHNfaW5mby5sZW5ndGg7ICsraSkge1xyXG4gICAgdXJscy5wdXNoKCcvcHJveHkvY29yZS92MS9wZW9wbGUvJyArIHN0dWRlbnRzX2luZm9baV0udWlkX3N0dWRlbnQpO1xyXG4gIH1cclxuICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgKVxyXG4gIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApKVxyXG4gIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgY29uc3QgcmVzTGVuZ3RoID0gcmVzdWx0cy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc0xlbmd0aDsgKytpKSB7XHJcbiAgICAgIHN0dWRlbnRzLnB1c2goe1xyXG4gICAgICAgIGRpc3BsYXlOYW1lOiByZXN1bHRzW2ldLmRpc3BsYXlOYW1lLFxyXG4gICAgICAgIGdyb3VwX25hbWU6IHJlc3VsdHNbaV0uX2xpbmtzLmdyb3Vwc1swXS5uYW1lLFxyXG4gICAgICAgIGdyb3VwX1VJRDogcmVzdWx0c1tpXS5fbGlua3MuZ3JvdXBzWzBdLmlkLFxyXG4gICAgICAgIGRhdGVfY3JlYXRpb25fcmVxdWVzdDogc3R1ZGVudHNfaW5mb1tpXS5kYXRlX2NyZWF0aW9uLFxyXG4gICAgICAgIGlkX3JlcXVlc3Q6IHN0dWRlbnRzX2luZm9baV0uaWRfcmVxdWVzdCxcclxuICAgICAgICB1aWRfc3R1ZGVudDogc3R1ZGVudHNfaW5mb1tpXS51aWRfc3R1ZGVudCxcclxuICAgICAgICBpZF9vcmdhbmlzYXRpb246IHN0dWRlbnRzX2luZm9baV0uaWRfb3JnYW5pc2F0aW9uXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBzdHVkZW50cztcclxufTtcclxuTW9kZWwucHJvdG90eXBlLmluaXQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGdyb3VwcyA9IGF3YWl0IHRoaXMuZ2V0R3JvdXBzKCk7XHJcbiAgbGV0IHVybHMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgdGhpcy5Hcm91cHMucHVzaChuZXcgR3JvdXAoZ3JvdXBzW2ldLmlkLCBncm91cHNbaV0ubmFtZSkpO1xyXG4gICAgdXJscy5wdXNoKCcvcHJveHkvY29yZS92MS9ncm91cHMvJyArIGdyb3Vwc1tpXS5pZCk7XHJcbiAgfVxyXG4gIGF3YWl0IHRoaXMuZ2V0U3R1ZGVudHNCeUdyb3VwSWRzKHVybHMpO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFN0dWRlbnRzQnlHcm91cElkcyA9IGFzeW5jIGZ1bmN0aW9uICh1cmxzKSB7XHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gIClcclxuICAudGhlbihyZXNwb25zZXMgPT4gUHJvbWlzZS5hbGwoXHJcbiAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgKSlcclxuICAudGhlbihyZXN1bHRzID0+IHtcclxuICAgIGNvbnN0IHJlc0xlbmd0aCA9IHJlc3VsdHMubGVuZ3RoO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXNMZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgc3R1ZGVudHMgPSByZXN1bHRzW2ldLl9lbWJlZGRlZC5zdHVkZW50cztcclxuICAgICAgY29uc3Qgc3RMZW5ndGggPSBzdHVkZW50cy5sZW5ndGg7XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3RMZW5ndGg7IGorKykge1xyXG4gICAgICAgIGxldCBzdHVkZW50ID0ge1xyXG4gICAgICAgICAgJ25hbWUnOiBzdHVkZW50c1tqXS5kaXNwbGF5TmFtZSxcclxuICAgICAgICAgICd1aWQnOiBzdHVkZW50c1tqXS51aWRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLnB1c2goc3R1ZGVudCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRDdXJyZW50WWVhciA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgbGV0IGN1cnJlbnRZZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XHJcbiAgcmV0dXJuIGN1cnJlbnRZZWFyO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmRpc3RyaWJ1dGVHcm91cHNCeUNvdXJzZXMgPSBhc3luYyBmdW5jdGlvbiAoY3VycmVudFllYXIpIHtcclxuICB0aGlzLkNvdXJzZXMgPSBbXHJcbiAgICBuZXcgQ291cnNlKCcxJyksXHJcbiAgICBuZXcgQ291cnNlKCcyJyksXHJcbiAgICBuZXcgQ291cnNlKCczJyksXHJcbiAgICBuZXcgQ291cnNlKCc0JyksXHJcbiAgICBuZXcgQ291cnNlKCcxICjQvNCzKScpLFxyXG4gICAgbmV3IENvdXJzZSgnMiAo0LzQsyknKVxyXG4gIF07XHJcbiAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gIGxldCBjdXJyZW50TW9udGggPSBkYXRlLmdldE1vbnRoKCk7XHJcbiAgaWYgKCtjdXJyZW50TW9udGggPCBTRVBURU1CRVIpIHtcclxuICAgIGN1cnJlbnRZZWFyIC09IDE7XHJcbiAgfVxyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpICE9PSAtMSkge1xyXG4gICAgICAgIHRoaXMuQ291cnNlc1ttYXN0ZXJGaXJzdENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW2ZpcnN0Q291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgIT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW21hc3RlclNlY29uZENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW3NlY29uZENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGN1cnJlbnRZZWFyLS07XHJcbiAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpID09PSAtMSkge1xyXG4gICAgICAgIHRoaXMuQ291cnNlc1t0aGlyZENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGN1cnJlbnRZZWFyLS07XHJcbiAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpID09PSAtMSkge1xyXG4gICAgICAgIHRoaXMuQ291cnNlc1tmb3VydGhDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjdXJyZW50WWVhciArPSAzO1xyXG4gIH1cclxufTtcclxuTW9kZWwucHJvdG90eXBlLmdldFByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKGluZm9fYWJvdXRfcHJhY3RpY2UpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGluZm9fYWJvdXRfcHJhY3RpY2UgPSBcIj95ZWFyPVwiICsgaW5mb19hYm91dF9wcmFjdGljZS55ZWFyICsgXCImZWR1X2xldmVsPVwiXHJcbiAgICAgICsgaW5mb19hYm91dF9wcmFjdGljZS5lZHVfbGV2ZWwgKyBcIiZ0eXBlUHJhY3RpY2U9XCJcclxuICAgICAgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLnR5cGVQcmFjdGljZTtcclxuICBsZXQgaW5mbyA9IDA7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJhY3RpY2UnICsgaW5mb19hYm91dF9wcmFjdGljZSwgcGFyYW1zKVxyXG4gIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgaW5mbyA9IHJlc3BvbnNlLmpzb24oKTtcclxuICB9KVxyXG4gIC5jYXRjaCgocmVzcG9uc2UpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICB9KTtcclxuICByZXR1cm4gaW5mbztcclxufTtcclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RCeVN0dWRlbnRVSUQgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UsIHN0dWRlbnQpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBpbmZvID0gJz91aWQ9JyArIHN0dWRlbnQudWlkICsgXCImaWRfcHJhY3RpY2U9XCJcclxuICAgICAgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9yZXF1c3QtYnktc3R1ZGVudC11aWQnICsgaW5mbywgcGFyYW1zKTtcclxuICBsZXQgcmVxdWVzdCA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgcmV0dXJuIHJlcXVlc3Q7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlSWRPcmdhbmlzYXRpb25JblJlcXVlc3QgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudCkge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdCArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIlxyXG4gICAgICArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uO1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3VwZGF0ZS1yZXF1ZXN0JyArIGluZm8sIHBhcmFtcyk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdHMgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UsIGdyb3Vwcykge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgbGV0IHJlcXVlc3RzID0gW107XHJcbiAgbGV0IHVybHMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgbGV0IGluZm8gPSAnP2lkX3N0dWRlbnQ9JyArIGdyb3Vwc1tpXS5zdHVkZW50c1tqXS51aWQgKyBcIiZpZF9wcmFjdGljZT1cIlxyXG4gICAgICAgICAgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgICAgdXJscy5wdXNoKCcvcmVxdXN0cy1ieS1zdHVkZW50LXByYWN0aWNlJyArIGluZm8pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgKVxyXG4gIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApKVxyXG4gIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgIHJlcXVlc3RzLnB1c2gocmVzdWx0c1tpXSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHJlcXVlc3RzOy8v0L/QvtC70YPRh9C40LvQuCBhbGwg0LfQsNGP0LLQvtC6INGB0YLRg9C00LXQvdGC0L7QsiDQstGL0LHRgNCw0L3QvdGL0YUg0LPRgNGD0L/Qv1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmFzc29zaWF0ZVJlcXVlc3RUb1N0dWRlbnQgPSBhc3luYyBmdW5jdGlvbiAocmVxdWVzdHMsIGdyb3Vwcykge1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2kpIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBncm91cHNbal0pIHtcclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLmxlbmd0aDsgKytrKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHJlcXVlc3RzLmxlbmd0aDsgKytuKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS51aWQgPT09IHJlcXVlc3RzW25dLnVpZF9zdHVkZW50KSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfcmVxdWVzdCA9IHJlcXVlc3RzW25dLmlkX3JlcXVlc3Q7XHJcbiAgICAgICAgICAgICAgaWYgKHJlcXVlc3RzW25dLmlkX29yZ2FuaXNhdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfb3JnYW5pc2F0aW9uID0gcmVxdWVzdHNbbl0uaWRfb3JnYW5pc2F0aW9uO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0c09yZ2FuaXNhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCB1cmxzID0gW107XHJcbiAgbGV0IG9yZ2FuaXNhdGlvbnNfYnlfcmVxdWVzdCA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2kpIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7ICsraykge1xyXG4gICAgICAgICAgdXJscy5wdXNoKCcvb3JnYW5pc2F0aW9ucy1ieS1yZXF1ZXN0JyArICc/aWRfcmVxdWVzdD0nXHJcbiAgICAgICAgICAgICAgKyB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9yZXF1ZXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgKVxyXG4gIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApKVxyXG4gIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgIG9yZ2FuaXNhdGlvbnNfYnlfcmVxdWVzdC5wdXNoKHJlc3VsdHNbaV0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBvcmdhbmlzYXRpb25zX2J5X3JlcXVlc3Q7XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0QnlTdHVkZW50VUlEUyA9IGFzeW5jIGZ1bmN0aW9uIChwcmFjdGljZSwgc3R1ZGVudHMpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCB1cmxzID0gW107XHJcbiAgbGV0IHJlcXVlc3RzID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgdXJscy5wdXNoKCcvcmVxdXN0LWJ5LXN0dWRlbnQtdWlkJyArICc/dWlkPScgKyBzdHVkZW50c1tpXS51aWRcclxuICAgICAgICArIFwiJmlkX3ByYWN0aWNlPVwiXHJcbiAgICAgICAgKyBwcmFjdGljZS5pZF9wcmFjdGljZSk7XHJcbiAgfVxyXG4gIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsLCBwYXJhbXMpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gIClcclxuICAudGhlbihyZXNwb25zZXMgPT4gUHJvbWlzZS5hbGwoXHJcbiAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgKSlcclxuICAudGhlbihyZXN1bHRzID0+IHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICByZXF1ZXN0cy5wdXNoKHJlc3VsdHNbaV0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gcmVxdWVzdHM7XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS5nZXRQcmFjdGljZVllYXJzID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3llYXJzLXByYWN0aWNlJyk7XHJcbiAgbGV0IHllYXJzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICByZXR1cm4geWVhcnM7XHJcbn07XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09UFJBQ1RJQ0UgQ1JFQVRJT05cclxuIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRUeXBlc09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uID0gW107XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvdHlwZXMtb3JnYW5pc2F0aW9uJyk7XHJcbiAgbGV0IHR5cGVzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uID0gdHlwZXM7XHJcbiAgcmV0dXJuIHRoaXMudHlwZXNPcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb25zJyk7XHJcbiAgbGV0IG9yZ3MgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIHRoaXMuT3JnYW5pc2F0aW9ucyA9IG9yZ3M7XHJcbiAgcmV0dXJuIHRoaXMuT3JnYW5pc2F0aW9ucztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zQnlQcmFjdGljZUlkID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgaW5mbyA9ICc/aWRfcHJhY3RpY2U9JyArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbnMtYnktcHJhY3RpY2UnICsgaW5mbywgcGFyYW1zKTtcclxuICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgcmV0dXJuIG9yZ2FuaXNhdGlvbnM7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9uQnlJZCA9IGFzeW5jIGZ1bmN0aW9uIChpZCkge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgbGV0IGluZm8gPSAnP2lkPScgKyBpZDtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tYnktaWQnICsgaW5mbywgcGFyYW1zKTtcclxuICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzQnlPcmdhbmlzYXRpb25OYW1lID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbixcclxuICAgIHByYWN0aWNlLCBpc0FwcHJvdmVkKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgaW5mbyA9IDAsIFNUQVRVUztcclxuICBpZiAoIWlzQXBwcm92ZWQpIHtcclxuICAgIGluZm8gPSBcIj9pZF9wcmFjdGljZT1cIiArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgU1RBVFVTID0gMDtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBpbmZvID0gXCI/aWRfcHJhY3RpY2U9XCIgKyBwcmFjdGljZS5pZF9wcmFjdGljZSArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIlxyXG4gICAgICAgICsgb3JnYW5pc2F0aW9uLmlkO1xyXG4gICAgU1RBVFVTID0gMTtcclxuICB9XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcmVxdWVzdHMtYnktcHJhY3RpY2UnICsgaW5mbywgcGFyYW1zKTtcclxuICBsZXQgcmVxdWVzdHMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIGxldCBzdHVkZW50cyA9IFtdO1xyXG4gIGxldCB1cmxzID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXF1ZXN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgdXJscy5wdXNoKFwiL2V4aXN0LXJlcXVlc3Q/aWRfcmVxdWVzdD1cIiArIHJlcXVlc3RzW2ldLmlkX3JlcXVlc3RcclxuICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIlxyXG4gICAgICAgICsgb3JnYW5pc2F0aW9uLmlkKTtcclxuICB9XHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgKVxyXG4gIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApKVxyXG4gIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgY29uc3QgcmVzTGVuZ3RoID0gcmVzdWx0cy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChyZXN1bHRzW2ldICE9PSAnTm90IGZvdW5kJykge1xyXG4gICAgICAgIGlmIChyZXN1bHRzW2ldLmlkX3N0YXR1cyA9PT0gU1RBVFVTKSB7XHJcbiAgICAgICAgICBzdHVkZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgaWRfcmVxdWVzdDogcmVzdWx0c1tpXS5pZF9yZXF1ZXN0LFxyXG4gICAgICAgICAgICBpZF9vcmdhbmlzYXRpb246IHJlc3VsdHNbaV0uaWRfb3JnYW5pc2F0aW9uLFxyXG4gICAgICAgICAgICBpZF9zdGF0dXM6IHJlc3VsdHNbaV0uaWRfc3RhdHVzLFxyXG4gICAgICAgICAgICB1aWRfc3R1ZGVudDogcmVxdWVzdHNbaV0udWlkX3N0dWRlbnQsXHJcbiAgICAgICAgICAgIGlkX3ByYWN0aWNlOiByZXF1ZXN0c1tpXS5pZF9wcmFjdGljZSxcclxuICAgICAgICAgICAgaWRfcmV2aWV3OiByZXF1ZXN0c1tpXS5pZF9yZXZpZXcsXHJcbiAgICAgICAgICAgIGRhdGVfY3JlYXRpb246IHJlc3VsdHNbaV0uZGF0ZV9jcmVhdGlvblxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHN0dWRlbnRzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbkJ5TmFtZSA9IGFzeW5jIGZ1bmN0aW9uIChuYW1lT3JnYW5pc2F0aW9uKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgaW5mbyA9ICc/bmFtZT0nICsgbmFtZU9yZ2FuaXNhdGlvbjtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tYnktbmFtZScgKyBpbmZvLCBwYXJhbXMpO1xyXG4gIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIHJldHVybiBvcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0RGV0ZXJtaW5lZEdyb3VwcyA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZEdyb3Vwcykge1xyXG4gIGxldCBkZXRlcm1pbmVkR3JvdXBzID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICBkZXRlcm1pbmVkR3JvdXBzLnB1c2godGhpcy5Hcm91cHNbaV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBkZXRlcm1pbmVkR3JvdXBzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZU9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tY3JlYXRlJywge1xyXG4gICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgIH0sXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvcmdhbmlzYXRpb24pXHJcbiAgfSlcclxuICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0L7RgNCz0LDQvdC40LfQsNGG0LjQuCDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZU9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tdXBkYXRlJywge1xyXG4gICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgIH0sXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvcmdhbmlzYXRpb24pXHJcbiAgfSlcclxuICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0L7RgNCz0LDQvdC40LfQsNGG0LjQuCDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZVByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJhY3RpY2UnLCB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByYWN0aWNlKVxyXG4gIH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INC/0YDQsNC60YLQuNC60Lgg0LIg0JHQlCBcIiArIGVycm9yKTtcclxuICB9KTtcclxuXHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuY3JlYXRlT3JVcGRhdGVTdHVkZW50cyA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50cykge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3N0dWRlbnRzJywge1xyXG4gICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgIH0sXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzdHVkZW50cylcclxuICB9KVxyXG4gIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCB1aWQg0YHRgtGD0LTQtdC90YLQvtCyINCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlUmVxdWVzdE9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50KSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgdmFyIGN1cnJlbnREYXRlID0gZGF0ZS5mb3JtYXQoXCJ5eXl5LW1tLWRkXCIpO1xyXG4gIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3RcclxuICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50LmlkX29yZ2FuaXNhdGlvbiArIFwiJmlkX3N0YXR1cz1cIlxyXG4gICAgICArIHN0dWRlbnQuaWRfc3RhdHVzICsgXCImZGF0ZV9jcmVhdGlvbj1cIlxyXG4gICAgICArIGN1cnJlbnREYXRlO1xyXG4gIGF3YWl0IGZldGNoKCcvdXBkYXRlLXJlcXVlc3Qtb3JnYW5pc2F0aW9uJyArIGluZm8sIHBhcmFtcyk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlUmVxdWVzdHNPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudHMpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCB1cmxzID0gW107XHJcbiAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gIHZhciBjdXJyZW50RGF0ZSA9IGRhdGUuZm9ybWF0KFwieXl5eS1tbS1kZFwiKTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiICsgc3R1ZGVudHNbaV0uaWRfb3JnYW5pc2F0aW9uICsgXCImaWRfc3RhdHVzPVwiXHJcbiAgICAgICAgKyBzdHVkZW50c1tpXS5pZF9zdGF0dXMgKyBcIiZkYXRlX2NyZWF0aW9uPVwiXHJcbiAgICAgICAgKyBjdXJyZW50RGF0ZTtcclxuICAgIHVybHMucHVzaCgnL3VwZGF0ZS1yZXF1ZXN0LW9yZ2FuaXNhdGlvbicgKyBpbmZvKTtcclxuICB9XHJcblxyXG4gIGF3YWl0IFByb21pc2UuYWxsKHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0T3JnYW5pc2F0aW9uQnlSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG5cclxuICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0ICsgXCImaWRfc3RhdHVzPVwiXHJcbiAgICAgICsgc3R1ZGVudC5pZF9zdGF0dXMgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50LmlkX29yZ2FuaXNhdGlvbjtcclxuICBhd2FpdCBmZXRjaCgnL3VwZGF0ZS1yZXF1ZXN0LW9yZ2FuaXNhdGlvbi1ieS1yZXF1ZXN0JyArIGluZm8sIHBhcmFtcyk7XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0c09yZ2FuaXNhdGlvbkJ5UmVxdWVzdCA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50cykge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgbGV0IHVybHMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiICsgc3R1ZGVudHNbaV0uaWRfb3JnYW5pc2F0aW9uICsgXCImaWRfc3RhdHVzPVwiXHJcbiAgICAgICAgKyBzdHVkZW50c1tpXS5pZF9zdGF0dXM7XHJcbiAgICB1cmxzLnB1c2goJy91cGRhdGUtcmVxdWVzdC1vcmdhbmlzYXRpb24tYnktcmVxdWVzdCcgKyBpbmZvKTtcclxuICB9XHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwodXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSkpO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuaW5zZXJ0UmVxdWVzdE9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50KSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgdmFyIGN1cnJlbnREYXRlID0gZGF0ZS5mb3JtYXQoXCJ5eXl5LW1tLWRkXCIpO1xyXG4gIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3QgKyBcIiZpZF9vcmdhbmlzYXRpb249XCJcclxuICAgICAgKyBzdHVkZW50LmlkX29yZ2FuaXNhdGlvbiArIFwiJmlkX3N0YXR1cz1cIiArIHN0dWRlbnQuaWRfc3RhdHVzXHJcbiAgICAgICsgXCImZGF0ZV9jcmVhdGlvbj1cIlxyXG4gICAgICArIGN1cnJlbnREYXRlO1xyXG4gIGF3YWl0IGZldGNoKCcvaW5zZXJ0LXJlcXVlc3Qtb3JnYW5pc2F0aW9uJyArIGluZm8sIHBhcmFtcyk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlUmVxdWVzdCA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50KSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgaW5mbyA9IDA7XHJcbiAgaWYgKHN0dWRlbnQuaWRfc3RhdHVzID09PSBSRUpFQ1RFRCkge1xyXG4gICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0XHJcbiAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249bnVsbFwiO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdFxyXG4gICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiICsgc3R1ZGVudC5pZF9vcmdhbmlzYXRpb247XHJcbiAgfVxyXG4gIGF3YWl0IGZldGNoKCcvdXBkYXRlLXJlcXVlc3QnICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RzID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgaW5mbyA9IDA7XHJcbiAgbGV0IHVybHMgPSBbXTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IGluZm8gPSAwO1xyXG4gICAgaWYgKHN0dWRlbnRzW2ldLmlkX3N0YXR1cyA9PT0gUkVKRUNURUQpIHtcclxuICAgICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249bnVsbFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnRzW2ldLmlkX3JlcXVlc3RcclxuICAgICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiICsgc3R1ZGVudHNbaV0uaWRfb3JnYW5pc2F0aW9uO1xyXG4gICAgfVxyXG4gICAgdXJscy5wdXNoKCcvdXBkYXRlLXJlcXVlc3QnICsgaW5mbyk7XHJcbiAgfVxyXG5cclxuICBhd2FpdCBQcm9taXNlLmFsbCh1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsLCBwYXJhbXMpLmNhdGNoKGVyciA9PiBlcnIpKSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2VuZXJhdGVEb2N1bWVudCA9IGFzeW5jIGZ1bmN0aW9uIChkb2N1bWVudCwgdHlwZV9kb2N1bWVudCwgdHlwZV9wcmFjdGljZSkge1xyXG4gICAgdHlwZV9wcmFjdGljZT0gdHlwZV9wcmFjdGljZS50b0xvd2VyQ2FzZSgpO1xyXG4gIGxldCBpbmZvcm1hdGlvbj17XHJcbiAgICBkYXRhOiBkb2N1bWVudCxcclxuICAgICAgdHlwZV9kb2N1bWVudDogdHlwZV9kb2N1bWVudCxcclxuICAgICAgdHlwZV9wcmFjdGljZTogdHlwZV9wcmFjdGljZVxyXG4gIH07XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9kb2N1bWVudCcsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGluZm9ybWF0aW9uKVxyXG4gICAgfSkudGhlbihmdW5jdGlvbihyZXNwKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3AuYmxvYigpO1xyXG4gICAgfSkudGhlbihmdW5jdGlvbihibG9iKSB7XHJcbiAgICAgICAgc2F2ZUFzKGJsb2IsIHR5cGVfZG9jdW1lbnQrJyAnK3R5cGVfcHJhY3RpY2UrJyDQv9GA0LDQutGC0LjQutCwICcrZG9jdW1lbnQuZ3JvdXBfbmFtZStcIi5kb2N4XCIpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQs9C10L3QtdGA0LDRhtC40Lgg0LTQvtC60YPQvNC10L3RgtCwIFwiICsgZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgZGVidWdnZXI7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9Nb2RlbC5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby5jc3Ncbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWljb25zLmNzc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tc2NoZW1lcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3Mvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDaFhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFHQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBYkE7QUFlQTtBQWpCQTtBQXVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVkE7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNycENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFXQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFMQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFMQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFMQTtBQVFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFMQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQUNBO0FBTUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3B0QkE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7OztBIiwic291cmNlUm9vdCI6IiJ9
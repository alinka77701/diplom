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

Controller.prototype.createInputs = async function (isOrder) {
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
        let info_about_practice = this.View.getUserInfoAboutPractice();
        let practice = await this.Model.getPractice(info_about_practice);
        let block = this.View.getElemById("order-block");
        this.View.removeChildren(block);
        this.View.createInputsReport(selectedGroups);
        this.View.changeDisplay("report-block", "block");
        this.View.changeDisplay("order-block", "none");
        this.View.changeInnerHtml("typeDocument", "отчета");
        let organisations = await this.Model.getOrganisationsByPracticeId(practice);
        this.View.fillDialog(practice, organisations);
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
    let groupsObjects = [];
    let documents = 0,
        data = 0;
    if (type_document === "Приказ") {
        if (selectedGroups.length !== 0) {
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
                }
            }
        }
        let organisations = await this.Model.getOrganisationsByPracticeId(practice);
        documents = this.View.getInformationForDocumentOrder(practice, selectedGroups, this.Model.Groups, data, organisations);
    } else {
        let organisations = await this.Model.getOrganisationsByPracticeId(practice);
        documents = this.View.getInformationForDocumentReport(practice, selectedGroups, this.Model.Groups, organisations);
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
    await this.setYears();
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
    }, {
        "name": "БАС",
        "fullName": "09.04.01 «Информатика и вычислительная техника»",
        "profile": "«Информационное и программное обеспечение вычислительных систем»",
        "type": "bachelor"
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
    if (educationLevel === "bachelor") educationLevel = "Бакалавриат";else {
        educationLevel = "Магистратура";
    }
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
    let buttonArray1 = document.getElementById("buttonsArray1");
    this.removeChildren(buttonArray);
    this.removeChildren(buttonArray1);
    for (let i = 0; i < years.length; i++) {
        let span = document.createElement('span');
        span.setAttribute("class", "item year");
        span.innerHTML = years[i];
        buttonArray.appendChild(span);

        let span1 = document.createElement('span');
        span1.setAttribute("class", "item year");
        span1.innerHTML = years[i];
        buttonArray.appendChild(span);
        buttonArray1.appendChild(span1);
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
        let div_group = document.createElement("div");
        div_group.setAttribute("class", "group " + selectedGroups[i]);

        let h4 = document.createElement("h4");
        h4.innerHTML = selectedGroups[i];
        h4.setAttribute("class", "align-center");
        div_group.appendChild(h4);

        let div = document.createElement("div");
        div.setAttribute("class", "field margin20");
        let p = document.createElement("p");
        p.setAttribute("class", "inline-block sub-header");
        p.innerHTML = "Руководитель";
        div.appendChild(p);
        let input = document.createElement("input");
        input.setAttribute("class", "supervisor");
        div.appendChild(input);
        div_group.appendChild(div);

        div = document.createElement("div");
        div.setAttribute("class", "field margin20");
        p = document.createElement("p");
        p.setAttribute("class", "inline-block sub-header");
        p.innerHTML = "Студ. (4 и 5)";
        div.appendChild(p);
        input = document.createElement("input");
        input.setAttribute("class", "good_students");
        div.appendChild(input);
        div_group.appendChild(div);

        div = document.createElement("div");
        div.setAttribute("class", "field margin20");
        p = document.createElement("p");
        p.setAttribute("class", "inline-block sub-header");
        p.innerHTML = "Кол-во препод.-руковод.";
        div.appendChild(p);
        input = document.createElement("input");
        input.setAttribute("class", "teacher_number");
        div.appendChild(input);
        div_group.appendChild(div);
        parent.appendChild(div_group);
    }
};
View.prototype.formatDate = function (date) {
    let year = date.substr(0, 4),
        month = date.substr(5, 2),
        day = date.substr(8, 2);

    return day + '.' + month + '.' + year;
};
View.prototype.getInformationForDocumentOrder = function (practice, selectedGroups, allGroups, data, organisations) {
    let groupsForDocument = [];
    let educational_level = this.getEducationalLevel();
    let blockTeachers = document.getElementById("order-block").getElementsByTagName('div');
    let teachers = [];
    for (let i = 0; i < blockTeachers.length; i++) {
        let groupName = blockTeachers[i].children[0].innerHTML;
        let teacher = blockTeachers[i].children[1].value;
        for (let j = 0; j < selectedGroups.length; j++) {
            if (selectedGroups[j] === groupName) teachers.push({
                "teacher": teacher,
                "groupName": groupName
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

    let start_date = this.formatDate(practice.start_date_practice);
    let end_date = this.formatDate(practice.end_date_practice);
    if (typePractice === "учебной") {
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
    } else if (typePractice === "производственной") {
        for (let i = 0; i < organisations.length; i++) {
            organisations[i].students = [];
        }
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < groupsForDocument.length; j++) {
                if (data[i].group === groupsForDocument[j].name) {
                    for (let k = 0; k < groupsForDocument[j].students.length; k++) {
                        if (data[i].student === groupsForDocument[j].students[k].name) {
                            for (let n = 0; n < organisations.length; n++) {
                                if (data[i].organisation === organisations[n].name) {
                                    organisations[n].group = groupsForDocument[j].name;
                                    organisations[n].organization_name = organisations[n].name;
                                    organisations[n].teacher = groupsForDocument[j].teacher;
                                    let student = data[i].student;
                                    organisations[n].students.push({ "name": student });
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < groupsForDocument.length; i++) {
            let organisations_for_document = [];
            for (let j = 0; j < organisations.length; j++) {
                if (organisations[j].group === groupsForDocument[i].name) {
                    let students = JSON.stringify(organisations[j].students);
                    students = JSON.parse(students);
                    let str = JSON.stringify(organisations[j], ["organization_name", "teacher"]);
                    organisations[j] = JSON.parse(str);
                    organisations[j].students = students;
                    organisations_for_document.push(organisations[j]);
                }
            }
            let document = {
                "direction": groupsForDocument[i].fullName,
                "profile": groupsForDocument[i].profile,
                "dean": dean,
                "course": "1",
                "head_of_department": head_of_department,
                "type_practice": typePractice,
                "start_date": start_date,
                "end_date": end_date,
                "group_name": groupsForDocument[i].name,
                "supervisor": groupsForDocument[i].teacher,
                "organizations": organisations_for_document
            };
            documents.push(document);
        }
    }
    return documents;
};
View.prototype.getEducationalLevel = function () {
    let treeView = 0;
    let frames = document.getElementsByClassName("frames")[0].children;
    for (let i = 0; i < frames.length; i++) {
        if (frames[i].style.display !== "none") {
            treeView = frames[i].children[0];
            break;
        }
    }
    let educational_level = treeView.getAttribute("id");
    if (educational_level.indexOf("bachelor") !== -1) {
        return "bachelor";
    } else {
        return "master";
    }
};
View.prototype.getInformationForDocumentReport = function (practice, selectedGroups, allGroups) {
    let educational_level = this.getEducationalLevel();
    let groupsForDocument = [];
    let blockGroups = document.getElementById("groups-report-block").getElementsByClassName('group');
    let additional_info = [];
    for (let i = 0; i < blockGroups.length; i++) {
        let groupName = blockGroups[i].getElementsByTagName('h4')[0].innerHTML;
        let supervisor = blockGroups[i].getElementsByClassName("supervisor")[0].value;
        let good_students_number = blockGroups[i].getElementsByClassName("good_students")[0].value;
        let teacher_number = blockGroups[i].getElementsByClassName("teacher_number")[0].value;
        for (let j = 0; j < selectedGroups.length; j++) {
            if (selectedGroups[j] === groupName) additional_info.push({
                "groupName": groupName,
                "supervisor": supervisor,
                "good_stud_num": good_students_number,
                "teacher_number": teacher_number
            });
        }
    }
    for (let i = 0; i < selectedGroups.length; i++) {
        for (let j = 0; j < this.infoGroups.length; j++) {
            if (selectedGroups[i].indexOf(this.infoGroups[j].name) !== -1 && this.infoGroups[j].type === educational_level) {
                for (let n = 0; n < allGroups.length; n++) {
                    if (selectedGroups[i] === allGroups[n].name) {
                        for (let k = 0; k < additional_info.length; k++) {
                            if (selectedGroups[i] === additional_info[k].groupName) {
                                allGroups[n].supervisor = additional_info[k].supervisor;
                                allGroups[n].fullName = this.infoGroups[j].fullName;
                                allGroups[n].good_stud_num = additional_info[k].good_stud_num;
                                allGroups[n].teacher_number = additional_info[k].teacher_number;
                                groupsForDocument.push(allGroups[n]);
                            }
                        }
                    }
                }
            }
        }
    }
    let start_date = this.formatDate(practice.start_date_practice);
    let end_date = this.formatDate(practice.end_date_practice);

    let head_of_department = document.getElementById("head_of_department").value;
    let documents = [];
    let typePractice = document.getElementById("selectTypePracticeTab").value;
    typePractice = typePractice.toLowerCase();

    let course = document.getElementById("course").value;
    let base_practice = document.getElementById("base_practice").value;
    let num_base_practice = document.getElementById("num_base_practice").value;
    let num_lections = document.getElementById("num_lections").value;

    for (let i = 0; i < groupsForDocument.length; i++) {
        let document = {
            "direction": groupsForDocument[i].fullName,
            "course": course,
            "type_practice": typePractice,
            "start_date": start_date,
            "end_date": end_date,
            "group_name": groupsForDocument[i].name,
            "base_practice": base_practice,
            "year": practice.year,
            "teacher_number": groupsForDocument[i].teacher_number,
            "student_number": groupsForDocument[i].students.length,
            "good_stud_num": groupsForDocument[i].good_stud_num,
            "num_base_practice": num_base_practice,
            "num_lections": num_lections,
            "supervisor": groupsForDocument[i].supervisor,
            "head_of_department": head_of_department
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

View.prototype.fillDialog = function (practice, organisations) {
    let elem = document.getElementById("base_practice");
    for (let i = 0; i < organisations.length; i++) {
        elem.value += organisations[i].name + ', ';
    }
    elem = document.getElementById("num_base_practice");
    elem.value = organisations.length;
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

Model.prototype.getRequestsOrganisationsByRequestId = async function (requests) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let urls = [];
  let requests_organisations = [];
  for (let i = 0; i < requests.length; i++) {
    urls.push('/organisations-by-request' + '?id_request=' + requests[i].id_request);
  }
  await Promise.all(urls.map(url => fetch(url, params).catch(err => err))).then(responses => Promise.all(responses.map(r => r instanceof Error ? r : r.json().catch(err => err)))).then(results => {
    for (let i = 0; i < results.length; ++i) {
      requests_organisations.push(results[i]);
    }
  });

  return requests_organisations;
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

Model.prototype.getRequestsByPracticeId = async function (practice) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let info = '?id_practice=' + practice.id_practice;
  let result = await fetch('/requests-by-practice' + info, params);
  let requests = await result.json();
  return requests;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGFlMjI3MDgwZGI3N2Y0ZGNjZTY5Iiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9saWJzL0RhdGFUYWJsZXMvZGF0YXRhYmxlcy5taW4uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhZTIyNzA4MGRiNzdmNGRjY2U2OSIsImNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlICgnLi9Db250cm9sbGVyLmpzJyk7XHJcblxyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzJyk7XHJcbnJlcXVpcmUoJy4vbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcycpO1xyXG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcclxuXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gIG5ldyBDb250cm9sbGVyKCk7XHJcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvbWFpbi5qcyIsImNvbnN0IFZpZXcgPSByZXF1aXJlKCcuL1ZpZXcuanMnKTtcclxuY29uc3QgTW9kZWwgPSByZXF1aXJlKCcuL01vZGVsLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBDb250cm9sbGVyKCkge1xyXG4gICAgdGhpcy5WaWV3ID0gbmV3IFZpZXcoKTtcclxuICAgIHRoaXMuTW9kZWwgPSBuZXcgTW9kZWwoKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG5jb25zdCBBUFBST1ZFRCA9IDE7XHJcbmNvbnN0IFJFSkVDVEVEID0gMjtcclxuQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgYXdhaXQgdGhpcy5zZXRZZWFycygpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tOZXh0U3RlcCA9IHRoaXMuZGlzcGxheUdyb3Vwcy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tDcmVhdGVQcmFjdGljZSA9IHRoaXMuZ29Ub1ByYWN0aWNlQ3JlYXRpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQWRkUHJhY3RpY2UgPSB0aGlzLmNyZWF0ZVByYWN0aWNlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSB0aGlzLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbi5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbiA9IHRoaXMuZ29Ub1N0dWRlbnRzU2VjdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tGaW5pc2hCdG4gPSB0aGlzLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrU2VsZWN0R3JvdXBCdG5PayA9IHRoaXMucmVuZGVyRGF0YUluVGFibGUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrWWVhcnNBcnJheSA9IHRoaXMuc2V0R3JvdXBzVHJlZVZpZXcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyA9IHRoaXMuZ2V0T3JnYW5pc2F0aW9ucy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tDcmVhdGVPcmdhbmlzYXRpb24gPSB0aGlzLnVwZGF0ZVRyZWVWaWV3LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0Rpc3BsYXlJbmZvQWJvdXRPcmcgPSB0aGlzLmRpc3BsYXlJbmZvQWJvdXRPcmcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrRGlzcGxheU9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbi5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tFZGl0T3JnYW5pc2F0aW9uID0gdGhpcy5zaG93RGlhbG9nRWRpdE9yZ2FuaXNhdGlvbi5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tVcGRhdGVPcmdhbmlzYXRpb24gPSB0aGlzLnVwZGF0ZU9yZ2FuaXNhdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tBcHByb3ZlU3R1ZGVudCA9IHRoaXMuY2hhbmdlU3R1ZGVudFN0YXR1cy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tSZWplY3RTdHVkZW50ID0gdGhpcy5jaGFuZ2VTdHVkZW50U3RhdHVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvblNob3dEaWFsb2cgPSB0aGlzLmFkZFN0dWRlbnRUb09yZ2FuaXNhdGlvblNob3dEaWFsb2cuYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uID0gdGhpcy5hZGRTdHVkZW50VG9PcmdhbmlzYXRpb24uYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrU2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQgPSB0aGlzLnNob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50LmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0dlbmVyYXRlRG9jdW1lbnQgPSB0aGlzLmdlbmVyYXRlRG9jdW1lbnQuYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNoYW5nZVR5cGVEb2N1bWVudCA9IHRoaXMuaW5pdERpYWxvZy5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3LmluaXQoKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwuaW5pdCgpO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcblxyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdERpYWxvZyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCB0eXBlX2RvY3VtZW50ID0gdGhpcy5WaWV3LmdldFNlbGVjdFZhbHVlKFwiZ2R0eXBlRG9jdW1lbnRcIik7XHJcbiAgICBsZXQgaXNPcmRlciA9IGZhbHNlO1xyXG4gICAgaWYgKHR5cGVfZG9jdW1lbnQgPT09IFwi0J/RgNC40LrQsNC3XCIpIHtcclxuICAgICAgICBpc09yZGVyID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlucHV0cyhpc09yZGVyKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlzT3JkZXIgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlucHV0cyhpc09yZGVyKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmNyZWF0ZUlucHV0cyA9YXN5bmMgIGZ1bmN0aW9uIChpc09yZGVyKSB7XHJcbiAgICBsZXQgc2VsZWN0ZWRHcm91cHMgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRHcm91cHMoKTtcclxuICAgIGlmIChpc09yZGVyKSB7Ly/Qv9GA0LjQutCw0LdcclxuICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLlZpZXcuZ2V0RWxlbUJ5SWQoXCJncm91cHMtcmVwb3J0LWJsb2NrXCIpO1xyXG4gICAgICAgIHRoaXMuVmlldy5yZW1vdmVDaGlsZHJlbihibG9jayk7XHJcbiAgICAgICAgdGhpcy5WaWV3LmNoYW5nZURpc3BsYXkoXCJyZXBvcnQtYmxvY2tcIiwgXCJub25lXCIpO1xyXG4gICAgICAgIHRoaXMuVmlldy5jaGFuZ2VEaXNwbGF5KFwib3JkZXItYmxvY2tcIiwgXCJibG9ja1wiKTtcclxuICAgICAgICB0aGlzLlZpZXcuY3JlYXRlSW5wdXRzT3JkZXIoc2VsZWN0ZWRHcm91cHMpO1xyXG4gICAgICAgIHRoaXMuVmlldy5jaGFuZ2VJbm5lckh0bWwoXCJ0eXBlRG9jdW1lbnRcIiwgXCLQv9GA0LjQutCw0LfQsFwiKTtcclxuICAgIH1cclxuICAgIGVsc2Ugey8v0L7RgtGH0LXRglxyXG4gICAgICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xyXG4gICAgICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XHJcbiAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5WaWV3LmdldEVsZW1CeUlkKFwib3JkZXItYmxvY2tcIik7XHJcbiAgICAgICAgdGhpcy5WaWV3LnJlbW92ZUNoaWxkcmVuKGJsb2NrKTtcclxuICAgICAgICB0aGlzLlZpZXcuY3JlYXRlSW5wdXRzUmVwb3J0KHNlbGVjdGVkR3JvdXBzKTtcclxuICAgICAgICB0aGlzLlZpZXcuY2hhbmdlRGlzcGxheShcInJlcG9ydC1ibG9ja1wiLCBcImJsb2NrXCIpO1xyXG4gICAgICAgIHRoaXMuVmlldy5jaGFuZ2VEaXNwbGF5KFwib3JkZXItYmxvY2tcIiwgXCJub25lXCIpO1xyXG4gICAgICAgIHRoaXMuVmlldy5jaGFuZ2VJbm5lckh0bWwoXCJ0eXBlRG9jdW1lbnRcIiwgXCLQvtGC0YfQtdGC0LBcIik7XHJcbiAgICAgICAgbGV0IG9yZ2FuaXNhdGlvbnM9YXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25zQnlQcmFjdGljZUlkKHByYWN0aWNlKTtcclxuICAgICAgICB0aGlzLlZpZXcuZmlsbERpYWxvZyhwcmFjdGljZSxvcmdhbmlzYXRpb25zKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnNob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGxldCBncm91cHNQcmFjdGljZVBhcnRpY2lwYW50cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0R3JvdXBzQnlQcmFjdGljZUlkKFxyXG4gICAgICAgICAgICBwcmFjdGljZSk7XHJcbiAgICAgICAgaWYgKGdyb3Vwc1ByYWN0aWNlUGFydGljaXBhbnRzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLlZpZXcuZGlhbG9nT3BlbihcIiNkaWFsb2dHZW5lcmF0ZVJlcG9ydFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBhbGVydChcItCf0YDQsNC60YLQutC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIhINCU0LvRjyDQs9C10L3QtdGA0LDRhtC40Lgg0LTQvtC60YPQvNC10L3RgtCwINC/0YDQsNC60YLQuNC60LAg0LTQu9GPINCy0YvQsdGA0LDQvdC90YvRhSDQs9GA0YPQv9C/INC00L7Qu9C20L3QsCDRgdGD0YnQtdGB0YLQstC+0LLQsNGC0YwuXCIpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2VuZXJhdGVEb2N1bWVudCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzZWxlY3RlZEdyb3VwcyA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZEdyb3VwcygpO1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgbGV0IHR5cGVfZG9jdW1lbnQgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0VmFsdWUoXCJnZHR5cGVEb2N1bWVudFwiKTtcclxuICAgIGxldCBncm91cHNPYmplY3RzPVtdO1xyXG4gICAgbGV0IGRvY3VtZW50cyA9IDAsZGF0YT0wO1xyXG4gICAgaWYgKHR5cGVfZG9jdW1lbnQgPT09IFwi0J/RgNC40LrQsNC3XCIpIHtcclxuICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Nb2RlbC5Hcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLk1vZGVsLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBzT2JqZWN0cy5wdXNoKHRoaXMuTW9kZWwuR3JvdXBzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXBzUHJhY3RpY2VQYXJ0aWNpcGFudHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldEdyb3Vwc0J5UHJhY3RpY2VJZChcclxuICAgICAgICAgICAgICAgICAgICBwcmFjdGljZSk7XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RlZEdyb3VwcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHNQcmFjdGljZVBhcnRpY2lwYW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzT2JqZWN0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoK2dyb3Vwc1ByYWN0aWNlUGFydGljaXBhbnRzW2ldLnVpZF9ncm91cFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPT09IGdyb3Vwc09iamVjdHNbal0udWlkX0xEQVApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkR3JvdXBzLnB1c2goZ3JvdXBzT2JqZWN0c1tqXS5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEdyb3Vwcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzKHByYWN0aWNlLCBncm91cHNPYmplY3RzKTtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLk1vZGVsLmFzc29zaWF0ZVJlcXVlc3RUb1N0dWRlbnQocmVxdWVzdHMsIHNlbGVjdGVkR3JvdXBzKTtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0c19vcmdhbmlzYXRpb25zID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRSZXF1ZXN0c09yZ2FuaXNhdGlvbnMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkR3JvdXBzKTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXREYXRhKHNlbGVjdGVkR3JvdXBzLCByZXF1ZXN0c19vcmdhbmlzYXRpb25zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgb3JnYW5pc2F0aW9ucz1hd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbnNCeVByYWN0aWNlSWQocHJhY3RpY2UpO1xyXG4gICAgICAgIGRvY3VtZW50cyA9IHRoaXMuVmlldy5nZXRJbmZvcm1hdGlvbkZvckRvY3VtZW50T3JkZXIocHJhY3RpY2UsIHNlbGVjdGVkR3JvdXBzLCB0aGlzLk1vZGVsLkdyb3VwcyxkYXRhLG9yZ2FuaXNhdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IG9yZ2FuaXNhdGlvbnM9YXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25zQnlQcmFjdGljZUlkKHByYWN0aWNlKTtcclxuICAgICAgICBkb2N1bWVudHMgPSB0aGlzLlZpZXcuZ2V0SW5mb3JtYXRpb25Gb3JEb2N1bWVudFJlcG9ydChwcmFjdGljZSwgc2VsZWN0ZWRHcm91cHMsIHRoaXMuTW9kZWwuR3JvdXBzLG9yZ2FuaXNhdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZG9jdW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5Nb2RlbC5nZW5lcmF0ZURvY3VtZW50KGRvY3VtZW50c1tpXSwgdHlwZV9kb2N1bWVudCwgaW5mb19hYm91dF9wcmFjdGljZS50eXBlUHJhY3RpY2UpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuYWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25QcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICAgIGxldCB1aWRzR3JvdXBzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRHcm91cHNCeVByYWN0aWNlSWQocHJhY3RpY2UpO1xyXG4gICAgbGV0IG5hbWVzR3JvdXBzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRHcm91cHNOYW1lQnlHcm91cHNVSUQodWlkc0dyb3Vwcyk7XHJcbiAgICB0aGlzLlZpZXcuZGlhbG9nRW5hYmxlQ2hlY2tib3hlcyhuYW1lc0dyb3VwcyxcclxuICAgICAgICBcImdyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWRpYWxvZ0FkZC1iYWNoZWxvclwiKTtcclxuICAgIHRoaXMuVmlldy5kaWFsb2dFbmFibGVDaGVja2JveGVzKG5hbWVzR3JvdXBzLFxyXG4gICAgICAgIFwiZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItZGlhbG9nQWRkLW1hc3RlclwiKTtcclxuICAgIHRoaXMuVmlldy5kaWFsb2dPcGVuKFwiI2RpYWxvZ0FkZFN0dWRlbnRcIik7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5hZGRTdHVkZW50VG9PcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgc3R1ZGVudHMgPSBhd2FpdCB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRTdHVkZW50cyhldmVudCk7XHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UoKTtcclxuICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XHJcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXROYW1lT3JnYW5pc2F0aW9uSW5UcmVldmlldyhcclxuICAgICAgICBcIm9yZ2FuaXNhdGlvbkxpc3RcIik7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25CeU5hbWUobmFtZU9yZ2FuaXNhdGlvbik7XHJcbiAgICBsZXQgcmVxdWVzdHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RCeVN0dWRlbnRVSURTKHByYWN0aWNlLFxyXG4gICAgICAgIHN0dWRlbnRzKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJlcXVlc3RzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChzdHVkZW50c1tpXS51aWQgPT09IHJlcXVlc3RzW2pdLnVpZF9zdHVkZW50KSB7XHJcbiAgICAgICAgICAgICAgICBzdHVkZW50c1tpXVsnaWRfcmVxdWVzdCddID0gcmVxdWVzdHNbal0uaWRfcmVxdWVzdDtcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRzW2ldWydpZF9wcmFjdGljZSddID0gcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgICAgICAgICAgICAgICBzdHVkZW50c1tpXVsnaWRfb3JnYW5pc2F0aW9uJ10gPSBvcmdhbmlzYXRpb24uaWQ7XHJcbiAgICAgICAgICAgICAgICBzdHVkZW50c1tpXVsnaWRfc3RhdHVzJ10gPSBBUFBST1ZFRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlUmVxdWVzdHNPcmdhbmlzYXRpb24oc3R1ZGVudHMpO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0cyhzdHVkZW50cyk7XHJcblxyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdHVkZW50cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIHN0dWRlbnRzW2pdWydpZF9zdGF0dXMnXSA9IFJFSkVDVEVEO1xyXG4gICAgfVxyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0c09yZ2FuaXNhdGlvbkJ5UmVxdWVzdChzdHVkZW50cyk7XHJcbiAgICBhd2FpdCB0aGlzLmdldEFwcHJvdmVkQW5kTm9uQXBwcm92ZWRTdHVkZW50cyhvcmdhbmlzYXRpb24pO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuc2V0WWVhcnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgeWVhcnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlWWVhcnMoKTtcclxuICAgIHRoaXMuVmlldy5zZXRZZWFyc0FycmF5KHllYXJzKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbnMoKTtcclxuICAgIGxldCB0eXBlc09yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0VHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvblNlbGVjdCh0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgICB0aGlzLlZpZXcuc2V0T3JnYW5pc2F0aW9uc0xpc3Qob3JnYW5pc2F0aW9ucywgXCJhbGxPcmdhbmlzYXRpb25zTGlzdFwiKTtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgdGhpcy5WaWV3LmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbigpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub1N0dWRlbnRzU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5nb1RvU3R1ZGVudHNTZWN0aW9uKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nb1RvUHJhY3RpY2VDcmVhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5zZWxlY3RlZFllYXIgPSB0aGlzLk1vZGVsLmdldEN1cnJlbnRZZWFyKCk7XHJcbiAgICB0aGlzLlZpZXcuY2xlYXJQcmFjdGljZVNlY3Rpb24oKTtcclxuICAgIGxldCB0eXBlc09yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMudXBkYXRlVHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvblNlbGVjdCh0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub1ByYWN0aWNlQ3JlYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5zZWxlY3RlZFllYXIgPSB0aGlzLk1vZGVsLmdldEN1cnJlbnRZZWFyKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCB0eXBlc09yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0VHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5jbGVhclR5cGVzT3JnYW5pc2F0aW9uKCk7XHJcbiAgICB0aGlzLlZpZXcuc2V0VHlwZXNPcmdhbmlzYXRpb24odHlwZXNPcmdhbmlzYXRpb24pO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbnMoKTtcclxuICAgIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zSW5UcmVlVmlldyhvcmdhbmlzYXRpb25zLCB0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgICByZXR1cm4gdHlwZXNPcmdhbmlzYXRpb247XHJcbn07XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZU9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0SW5mb05ld09yZ2FuaXNhdGlvbigpO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVPcmdhbmlzYXRpb24ob3JnYW5pc2F0aW9uKTtcclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUuc2hvd0RpYWxvZ0VkaXRPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBpZE9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRJZE9yZ2FuaXNhdGlvbihldmVudCk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25CeUlkKGlkT3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5zaG93RGlhbG9nT3JnYW5pc2F0aW9uKG9yZ2FuaXNhdGlvbik7XHJcbn07XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZGlzcGxheUdyb3VwcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5kaXNwbGF5R3JvdXBzKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmNyZWF0ZU5ld09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0SW5mb05ld09yZ2FuaXNhdGlvbigpO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5jcmVhdGVPcmdhbmlzYXRpb24ob3JnYW5pc2F0aW9uKTtcclxuXHJcbn07XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVRyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgYXdhaXQgdGhpcy5jcmVhdGVOZXdPcmdhbmlzYXRpb24oKTtcclxuICAgIGF3YWl0IHRoaXMudXBkYXRlVHlwZXNPcmdhbmlzYXRpb24oKTtcclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUuY3JlYXRlUHJhY3RpY2UgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkSW1hZ2UoKTtcclxuICAgIGxldCBwcmFjdGljZSA9IHRoaXMuVmlldy5QcmFjdGljZTtcclxuICAgIGxldCBncm91cHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldERldGVybWluZWRHcm91cHMocHJhY3RpY2UuZ3JvdXBzKTtcclxuICAgIHByYWN0aWNlLmdyb3VwcyA9IGdyb3VwcztcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwuY3JlYXRlUHJhY3RpY2UocHJhY3RpY2UpO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgIGF3YWl0ICB0aGlzLnNldFllYXJzKCk7XHJcbiAgICB0aGlzLmdvVG9TdHVkZW50c1NlY3Rpb24oKTtcclxufTtcclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZW5kZXJHcm91cHNUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwuZGlzdHJpYnV0ZUdyb3Vwc0J5Q291cnNlcyh0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyKTtcclxuICAgIGF3YWl0IHRoaXMuVmlldy5jbGVhckdyb3Vwc1RyZWVWaWV3KCk7XHJcbiAgICBhd2FpdCB0aGlzLlZpZXcudXBkYXRlR3JvdXBzVHJlZVZpZXcodGhpcy5Nb2RlbC5Db3Vyc2VzLCB0aGlzLk1vZGVsLkdyb3Vwcyk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5zZXRHcm91cHNUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdGhpcy5WaWV3LnVwZGF0ZVllYXIoZXZlbnQpO1xyXG4gICAgaWYgKHRoaXMuVmlldy5zZWxlY3RlZFllYXIgPT09IFwiK1wiKSB7XHJcbiAgICAgICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcclxuICAgICAgICBhd2FpdCB0aGlzLmdvVG9QcmFjdGljZUNyZWF0aW9uKCk7XHJcbiAgICB9XHJcbiAgICBhd2FpdCB0aGlzLnJlbmRlckdyb3Vwc1RyZWVWaWV3KCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZW5kZXJEYXRhSW5UYWJsZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgbGV0IHNlbGVjdGVkR3JvdXBzID0gdGhpcy5WaWV3LmdldFNlbGVjdGVkR3JvdXBzKCk7XHJcbiAgICBsZXQgZ3JvdXBzT2JqZWN0cyA9IFtdO1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBbXSwgZGF0YSA9IDA7XHJcblxyXG4gICAgaWYgKHNlbGVjdGVkR3JvdXBzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICAgICAgICBpZiAocHJhY3RpY2UubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Nb2RlbC5Hcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5Nb2RlbC5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBzT2JqZWN0cy5wdXNoKHRoaXMuTW9kZWwuR3JvdXBzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBncm91cHNQcmFjdGljZVBhcnRpY2lwYW50cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0R3JvdXBzQnlQcmFjdGljZUlkKFxyXG4gICAgICAgICAgICAgICAgcHJhY3RpY2UpO1xyXG4gICAgICAgICAgICBzZWxlY3RlZEdyb3VwcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc1ByYWN0aWNlUGFydGljaXBhbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwc09iamVjdHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoK2dyb3Vwc1ByYWN0aWNlUGFydGljaXBhbnRzW2ldLnVpZF9ncm91cFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA9PT0gZ3JvdXBzT2JqZWN0c1tqXS51aWRfTERBUCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEdyb3Vwcy5wdXNoKGdyb3Vwc09iamVjdHNbal0ubmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEdyb3Vwcy5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0c19vcmdhbmlzYXRpb25zO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3RzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRSZXF1ZXN0cyhwcmFjdGljZSwgZ3JvdXBzT2JqZWN0cyk7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLk1vZGVsLmFzc29zaWF0ZVJlcXVlc3RUb1N0dWRlbnQocmVxdWVzdHMsIHNlbGVjdGVkR3JvdXBzKTtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzT3JnYW5pc2F0aW9ucyhcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEdyb3Vwcyk7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXREYXRhKHNlbGVjdGVkR3JvdXBzLCByZXF1ZXN0c19vcmdhbmlzYXRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByYWN0aWNlID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBkYXRhID0gMDtcclxuICAgICAgICB0aGlzLlZpZXcucmVuZGVyVGFibGUoZGF0YSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLlZpZXcucmVuZGVyVGFibGUoZGF0YSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLlZpZXcuY29sb3JUYWJsZShkYXRhKTtcclxuICAgIHRoaXMuVmlldy5yZW5kZXJJbmZvKHByYWN0aWNlKTtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG59O1xyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09T1JHQU5JU0FUSU9OUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0QXBwcm92ZWRBbmROb25BcHByb3ZlZFN0dWRlbnRzID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbikge1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0Q29uZmlndXJhdGlvblByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgbGV0IGFwcHJvdmVkX3N0dWRlbnRfY291bnQgPSAwLCBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9IDA7XHJcbiAgICBpZiAocHJhY3RpY2UubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9IGF3YWl0IHRoaXMucmVuZGVyU3R1ZGVudExpc3Qob3JnYW5pc2F0aW9uLFxyXG4gICAgICAgICAgICBwcmFjdGljZSwgXCJhcHByb3ZlZFN0dWRlbnRzXCIpO1xyXG4gICAgICAgIG5vbl9hcHByb3ZlZF9zdHVkZW50X2NvdW50ID0gYXdhaXQgdGhpcy5yZW5kZXJTdHVkZW50TGlzdChvcmdhbmlzYXRpb24sXHJcbiAgICAgICAgICAgIHByYWN0aWNlLCBcIm5vbkFwcHJvdmVkU3R1ZGVudHNcIik7XHJcbiAgICB9XHJcbiAgICB0aGlzLlZpZXcudXBkYXRlT3JnYW5pc2F0aW9uVGl0bGUob3JnYW5pc2F0aW9uLm5hbWUsIGFwcHJvdmVkX3N0dWRlbnRfY291bnQsXHJcbiAgICAgICAgbm9uX2FwcHJvdmVkX3N0dWRlbnRfY291bnQpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZGlzcGxheUluZm9BYm91dE9yZyA9IGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IG5hbWVPcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRPcmdhbmlzYXRpb24oZXZlbnQpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlOYW1lKG5hbWVPcmdhbmlzYXRpb24pO1xyXG4gICAgYXdhaXQgdGhpcy5nZXRBcHByb3ZlZEFuZE5vbkFwcHJvdmVkU3R1ZGVudHMob3JnYW5pc2F0aW9uKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlclN0dWRlbnRMaXN0ID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbiwgcHJhY3RpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkTGlzdCkge1xyXG4gICAgbGV0IHN0YXR1cztcclxuICAgIGlmIChpZExpc3QgPT09IFwiYXBwcm92ZWRTdHVkZW50c1wiKSB7XHJcbiAgICAgICAgc3RhdHVzID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN0YXR1cyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgbGV0IHN0dWRlbnRzSW5mbyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdHNCeU9yZ2FuaXNhdGlvbk5hbWUoXHJcbiAgICAgICAgb3JnYW5pc2F0aW9uLCBwcmFjdGljZSwgc3RhdHVzKTtcclxuICAgIGxldCBzdHVkZW50cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0U3R1ZGVudHNCeVVJRChzdHVkZW50c0luZm8pO1xyXG4gICAgdGhpcy5WaWV3LnVwZGF0ZVN0dWRlbnRzTGlzdFZpZXcoc3R1ZGVudHMsIGlkTGlzdCk7XHJcbiAgICByZXR1cm4gc3R1ZGVudHMubGVuZ3RoO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25QcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICAgIGxldCBvcmdhbmlzYXRpb25zID0gMDtcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBvcmdhbmlzYXRpb25zID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25zQnlQcmFjdGljZUlkKHByYWN0aWNlKTtcclxuICAgIH1cclxuICAgIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zTGlzdChvcmdhbmlzYXRpb25zLCBcIm9yZ2FuaXNhdGlvbkxpc3RcIik7XHJcbiAgICB0aGlzLlZpZXcucmVuZGVyT3JnYW5pc2F0aW9uU2VjdGlvbihwcmFjdGljZSk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXROYW1lT3JnYW5pc2F0aW9uQnlUaXRsZSgpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlOYW1lKG5hbWVPcmdhbmlzYXRpb24pO1xyXG4gICAgcmV0dXJuIG9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmNoYW5nZVN0dWRlbnRTdGF0dXMgPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgbGV0IHN0dWRlbnQgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRTdHVkZW50KGV2ZW50KTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlUmVxdWVzdE9yZ2FuaXNhdGlvbihzdHVkZW50KTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlUmVxdWVzdChzdHVkZW50KTtcclxuXHJcbiAgICBzdHVkZW50WydpZF9zdGF0dXMnXSA9IFJFSkVDVEVEO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0T3JnYW5pc2F0aW9uQnlSZXF1ZXN0KHN0dWRlbnQpO1xyXG5cclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLmdldE9yZ2FuaXNhdGlvbigpO1xyXG4gICAgYXdhaXQgdGhpcy5nZXRBcHByb3ZlZEFuZE5vbkFwcHJvdmVkU3R1ZGVudHMob3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvQ29udHJvbGxlci5qcyIsImNvbnN0IGJhY2hlbG9yWWVhciA9IDQ7XHJcbmNvbnN0IG1hc3RlclllYXIgPSA2O1xyXG5sZXQgc2VsZWN0ZWRFbGVtID0gMDtcclxuXHJcbnZhciBWaWV3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5pbmZvR3JvdXBzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0JzQntCQXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwMi4wMy4wMyDCq9Cc0LDRgtC10LzQsNGC0LjRh9C10YHQutC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQuCDQsNC00LzQuNC90LjRgdGC0YDQuNGA0L7QstCw0L3QuNC1INC40L3RhNC+0YDQvNCw0YbQuNC+0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQotC10YXQvdC+0LvQvtCz0LjRjyDQv9GA0L7Qs9GA0LDQvNC80LjRgNC+0LLQsNC90LjRj8K7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0J/QoNCYXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wMy4wNCDCq9Cf0YDQvtCz0YDQsNC80LzQvdCw0Y8g0LjQvdC20LXQvdC10YDQuNGPwrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQoNCw0LfRgNCw0LHQvtGC0LrQsCDQv9GA0L7Qs9GA0LDQvNC80L3Qvi3QuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0JjQktCiLTFcIixcclxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQn9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90L7QuSDRgtC10YXQvdC40LrQuCDQuCDQsNCy0YLQvtC80LDRgtC40LfQuNGA0L7QstCw0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYmFjaGVsb3JcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQmNCS0KItMlwiLFxyXG4gICAgICAgICAgICBcImZ1bGxOYW1lXCI6IFwiMDkuMDMuMDEgwqvQmNC90YTQvtGA0LzQsNGC0LjQutCwINC4INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdCw0Y8g0YLQtdGF0L3QuNC60LDCu1wiLFxyXG4gICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Cf0YDQvtCz0YDQsNC80LzQvdC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QvtC5INGC0LXRhdC90LjQutC4INC4INCw0LLRgtC+0LzQsNGC0LjQt9C40YDQvtCy0LDQvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJiYWNoZWxvclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcItCY0JLQoi0zXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wMy4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXHJcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0J/QoNCYICjQvNCzKVwiLFxyXG4gICAgICAgICAgICBcImZ1bGxOYW1lXCI6IFwiMDkuMDQuMDQgwqvQn9GA0L7Qs9GA0LDQvNC80L3QsNGPINC40L3QttC10L3QtdGA0LjRj8K7XCIsXHJcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0J/RgNC+0LXQutGC0LjRgNC+0LLQsNC90LjQtSDQv9GA0L7Qs9GA0LDQvNC80L3Qvi3QuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1hc3RlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcItCY0JLQoi0xICjQvNCzKVwiLFxyXG4gICAgICAgICAgICBcImZ1bGxOYW1lXCI6IFwiMDkuMDQuMDEgwqvQmNC90YTQvtGA0LzQsNGC0LjQutCwINC4INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdCw0Y8g0YLQtdGF0L3QuNC60LDCu1wiLFxyXG4gICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Ca0L7QvNC/0YzRjtGC0LXRgNC90YvQuSDQsNC90LDQu9C40Lcg0Lgg0LjQvdGC0LXRgNC/0YDQtdGC0LDRhtC40Y8g0LTQsNC90L3Ri9GFwrtcIixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWFzdGVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0JjQktCiLTIgKNC80LMpXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wNC4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXHJcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0JjQvdGE0L7RgNC80LDRhtC40L7QvdC90L7QtSDQuCDQv9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJtYXN0ZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQkdCQ0KFcIixcclxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjA0LjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQmNC90YTQvtGA0LzQsNGG0LjQvtC90L3QvtC1INC4INC/0YDQvtCz0YDQsNC80LzQvdC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgICB9XHJcbiAgICBdO1xyXG4gICAgdGhpcy5vbkNsaWNrTmV4dFN0ZXAgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQWRkUHJhY3RpY2UgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tGaW5pc2hCdG4gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrU2VsZWN0R3JvdXBCdG5PayA9IG51bGw7XHJcbiAgICB0aGlzLm15VGFibGUgPSAkKCcjc3R1ZGVudHNMaXN0VGFibGUnKTtcclxuICAgIHRoaXMub25DbGlja1llYXJzQXJyYXkgPSBudWxsO1xyXG4gICAgdGhpcy5zZWxlY3RlZFllYXIgPSBudWxsO1xyXG4gICAgdGhpcy5pZFRyZWVWaWV3cyA9IFtcclxuICAgICAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDEtYmFjaGVsb3InLFxyXG4gICAgICAgICdncm91cC10cmVldmlldy10YWJjb250cm9sMi1tYXN0ZXInLFxyXG4gICAgICAgICdncm91cHMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb24tYmFjaGVsb3InLFxyXG4gICAgICAgICdncm91cHMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb24tbWFzdGVyJyxcclxuICAgICAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDEtZGlhbG9nQWRkLWJhY2hlbG9yJyxcclxuICAgICAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItZGlhbG9nQWRkLW1hc3RlcidcclxuICAgIF07XHJcbiAgICB0aGlzLm9uQ2xpY2tHZXRPcmdhbmlzYXRpb25zID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5SW5mb0Fib3V0T3JnID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0Rpc3BsYXlPcmdhbmlzYXRpb25zID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0VkaXRPcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQXBwcm92ZVN0dWRlbnQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrUmVqZWN0U3R1ZGVudCA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tVcGRhdGVPcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZyA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tBZGRTdHVkZW50VG9PcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrU2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrR2VuZXJhdGVEb2N1bWVudCA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2hhbmdlVHlwZURvY3VtZW50ID0gbnVsbDtcclxuICAgIHRoaXMuUHJhY3RpY2UgPSBudWxsO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tbmV4dFwiKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrTmV4dFN0ZXApO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkaWFsb2dQcmFjdGljZUNvbXBsZXRlU3VjY2Vzc1wiKS5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgIFwiI3ByYWN0aWNlRmluaXNoZWRPa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25zU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0dWRlbnRzU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1maW5pc2hcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0ZpbmlzaEJ0bik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldEdyb3Vwc0J0bk9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5MVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrWWVhcnNBcnJheSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldE9yZ2FuaXNhdGlvbnNCdG5Pa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZU9yZ2FuaXNhdGlvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJhY3RpY2VGaW5pc2hlZE9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tBZGRQcmFjdGljZSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3dBbGxPcmdhbmlzYXRpb25zXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5T3JnYW5pc2F0aW9ucyk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVwZGF0ZU9yZ2FuaXNhdGlvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrVXBkYXRlT3JnYW5pc2F0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkU3R1ZGVudEJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnRCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1Nob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2VuZXJhdGVEb2N1bWVudEJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrR2VuZXJhdGVEb2N1bWVudCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdkdHlwZURvY3VtZW50XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsXHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZVR5cGVEb2N1bWVudCk7XHJcblxyXG4gICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSh7XHJcbiAgICAgICAgZGF0YTogdGhpcy5Hcm91cHMsXHJcbiAgICAgICAgXCJsYW5ndWFnZVwiOiB7XHJcbiAgICAgICAgICAgIFwiemVyb1JlY29yZHNcIjogXCLQotCw0LrQvtC5INC30LDQv9C40YHQuCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiLFxyXG4gICAgICAgICAgICBcImVtcHR5VGFibGVcIjogXCLQndC4INC+0LTQvdCwINC40Lcg0LPRgNGD0L/QvyDQvdC1INCy0YvQsdGA0LDQvdCwINC70LjQsdC+INC/0YDQsNC60YLQuNC60Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIixcclxuICAgICAgICAgICAgXCJzZWFyY2hcIjogXCLQn9C+0LjRgdC6OlwiLFxyXG4gICAgICAgICAgICBcInBhZ2luYXRlXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiZmlyc3RcIjogXCLQn9C10YDQstGL0LlcIixcclxuICAgICAgICAgICAgICAgIFwibGFzdFwiOiBcItCf0L7RgdC70LXQtNC90LjQuVwiLFxyXG4gICAgICAgICAgICAgICAgXCJuZXh0XCI6IFwi0JLQv9C10YDQtdC0XCIsXHJcbiAgICAgICAgICAgICAgICBcInByZXZpb3VzXCI6IFwi0J3QsNC30LDQtFwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiaW5mb0ZpbHRlcmVkXCI6IFwiKNC40LcgX01BWF8g0YHRgtGD0LTQtdC90YLQvtCyKVwiLFxyXG4gICAgICAgICAgICBcImxlbmd0aE1lbnVcIjogXCLQn9C+0LrQsNC30LDRgtGMIF9NRU5VXyDQt9Cw0L/QuNGB0LXQuVwiLFxyXG4gICAgICAgICAgICBcImluZm9cIjogXCLQntCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INGB0YLRg9C00LXQvdGC0L7QsjogX1RPVEFMXyBcIixcclxuICAgICAgICAgICAgXCJpbmZvRW1wdHlcIjogXCLQktGL0LHQtdGA0LjRgtC1INCz0YDRg9C/0L/Rgy5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJjb2x1bW5zXCI6IFtcclxuICAgICAgICAgICAge1wiZGF0YVwiOiBcImdyb3VwXCJ9LFxyXG4gICAgICAgICAgICB7XCJkYXRhXCI6IFwic3R1ZGVudFwifSxcclxuICAgICAgICAgICAge1wiZGF0YVwiOiBcIm9yZ2FuaXNhdGlvblwifVxyXG4gICAgICAgIF1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub1N0dWRlbnRzU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3JnYW5pc2F0aW9uc1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblxyXG4gICAgbGV0IHRyZWVWaWV3cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmVldmlld1wiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdHJlZVZpZXdzW2ldLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ByYWN0aWNlQ3JlYXRpb25TZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvcmdhbmlzYXRpb25zU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkZW50c1JlcXVlc3RzXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxsT3JnYW5pc2F0aW9uc0xpc3RCbG9ja1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvUHJhY3RpY2VDcmVhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcclxuICAgICAgICBcInRydWVcIik7XHJcbn07XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuVmlldy5wcm90b3R5cGUuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBmaW5pc2hCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLWZpbmlzaFwiKVswXTtcclxuICAgIGZpbmlzaEJ0bi5zZXRBdHRyaWJ1dGUoXCJvbmNsaWNrXCIsXHJcbiAgICAgICAgXCJtZXRyb0RpYWxvZy5vcGVuKCcjZGlhbG9nUHJhY3RpY2VDb21wbGV0ZVN1Y2Nlc3MnKVwiKTtcclxuICAgIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1Y2F0aW9uXCIpLnZhbHVlO1xyXG5pZihlZHVjYXRpb25MZXZlbD09PVwiYmFjaGVsb3JcIilcclxuICAgIGVkdWNhdGlvbkxldmVsPVwi0JHQsNC60LDQu9Cw0LLRgNC40LDRglwiO1xyXG5lbHNle1xyXG4gICAgZWR1Y2F0aW9uTGV2ZWw9XCLQnNCw0LPQuNGB0YLRgNCw0YLRg9GA0LBcIjtcclxufVxyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlXCIpLnZhbHVlO1xyXG5cclxuICAgIGxldCBsZWNOdW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY051bVwiKS52YWx1ZTtcclxuICAgIGxldCBmcm9tRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJvbURhdGVJbnB1dFwiKS52YWx1ZTtcclxuICAgIGxldCB0b0RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvRGF0ZUlucHV0XCIpLnZhbHVlO1xyXG4gICAgbGV0IGRlYWRsaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVybXNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSAnYyAnICsgZnJvbURhdGVcclxuICAgICAgICArICcg0L/QviAnICsgdG9EYXRlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGRlYWRsaW5lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBmcm9tRGF0ZVxyXG4gICAgICAgICsgJyAtICcgKyB0b0RhdGU7XHJcbiAgICBpZiAoZnJvbURhdGUgPT09IFwiXCIpIHtcclxuICAgICAgICBmcm9tRGF0ZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmcm9tRGF0ZSA9IGZyb21EYXRlLnN1YnN0cig4LCA0KSArICctJyArIGZyb21EYXRlLnN1YnN0cig0LCAyKSArICctJ1xyXG4gICAgICAgICAgICArIGZyb21EYXRlLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICAgIH1cclxuICAgIGlmICh0b0RhdGUgPT09IFwiXCIpIHtcclxuICAgICAgICB0b0RhdGUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdG9EYXRlID0gdG9EYXRlLnN1YnN0cig4LCA0KSArICctJyArIHRvRGF0ZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICAgICAgKyB0b0RhdGUuc3Vic3RyKDAsIDIpICsgJyAnICsgJzIxOjAwOjAwLjAwMCArMDA6MDAnO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlYWRsaW5lID09PSBcIlwiKSB7XHJcbiAgICAgICAgZGVhZGxpbmUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZGVhZGxpbmUgPSBkZWFkbGluZS5zdWJzdHIoOCwgNCkgKyAnLScgKyBkZWFkbGluZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICAgICAgKyBkZWFkbGluZS5zdWJzdHIoMCwgMikgKyAnICcgKyAnMjE6MDA6MDAuMDAwICswMDowMCc7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHRyZWVWaWV3ID0gbnVsbDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJwcmFjdGljZVwiKSAhPT0gLTFcclxuICAgICAgICAgICAgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheVxyXG4gICAgICAgICAgICA9PT0gXCJibG9ja1wiKSB7XHJcbiAgICAgICAgICAgIHRyZWVWaWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IGFyckdyb3VwcyA9IHRoaXMuZ2V0U2VsZWN0ZWRHcm91cHModHJlZVZpZXcpO1xyXG4gICAgbGV0IGFyck9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldFNlbGVjdGVkR3JvdXBzKFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eXBlUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJlZHVjYXRpb25hbExldmVsRGlhbG9nXCIpLmlubmVySFRNTCA9IGVkdWNhdGlvbkxldmVsO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncm91cHNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJHcm91cHM7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBcIm9yZ2FuaXNhdGlvbnNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJPcmdhbmlzYXRpb25zO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2VcclxuICAgICAgICArIFwiINC/0YDQsNC60YLQuNC60LBcIjtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY051bURpYWxvZ1wiKS5pbm5lckhUTUwgPSBsZWNOdW07XHJcbiAgICB0aGlzLlByYWN0aWNlID0ge1xyXG4gICAgICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAgICAgJ3N0YXJ0RGF0ZVByYWN0aWNlJzogZnJvbURhdGUsXHJcbiAgICAgICAgJ2VuZERhdGVQcmFjdGljZSc6IHRvRGF0ZSxcclxuICAgICAgICAnZGVhZGxpbmVQcmFjdGljZSc6IGRlYWRsaW5lLFxyXG4gICAgICAgICdsZWNOdW0nOiBsZWNOdW0sXHJcbiAgICAgICAgJ2VkdUxldmVsJzogZWR1Y2F0aW9uTGV2ZWwsXHJcbiAgICAgICAgJ29yZ2FuaXNhdGlvbnMnOiBhcnJPcmdhbmlzYXRpb25zLFxyXG4gICAgICAgICdncm91cHMnOiBhcnJHcm91cHMsXHJcbiAgICAgICAgJ3llYXInOiB0aGlzLnNlbGVjdGVkWWVhclxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5QcmFjdGljZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmRpc3BsYXlHcm91cHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdWNhdGlvblwiKS52YWx1ZTtcclxuICAgIGlmIChlZHVjYXRpb25MZXZlbCA9PT0gXCJiYWNoZWxvclwiKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcImJhY2hlbG9yXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcIm1hc3RlclwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5jbGVhclByYWN0aWNlU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJvbURhdGVJbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvRGF0ZUlucHV0XCIpLnZhbHVlID0gXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVhZGxpbmVcIikudmFsdWUgPSBcIlwiO1xyXG59O1xyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuVmlldy5wcm90b3R5cGUucmVuZGVySW5mbyA9IGZ1bmN0aW9uIChwcmFjdGljZSkge1xyXG4gICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGxldCBzdGFydF95ZWFyID0gcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoMCwgNCksXHJcbiAgICAgICAgICAgIHN0YXJ0X21vbnRoID0gcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoNSwgMiksXHJcbiAgICAgICAgICAgIHN0YXJ0X2RheSA9IHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDgsIDIpLFxyXG4gICAgICAgICAgICBlbmRfeWVhciA9IHByYWN0aWNlLmVuZF9kYXRlX3ByYWN0aWNlLnN1YnN0cigwLCA0KSxcclxuICAgICAgICAgICAgZW5kX21vbnRoID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDUsIDIpLFxyXG4gICAgICAgICAgICBlbmRfZGF5ID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDgsIDIpO1xyXG4gICAgICAgIGxldCBzdGFydF9kYXRlID0gc3RhcnRfZGF5ICsgJy0nICsgc3RhcnRfbW9udGggKyAnLScgKyBzdGFydF95ZWFyO1xyXG4gICAgICAgIGxldCBlbmRfZGF0ZSA9IGVuZF9kYXkgKyAnLScgKyBlbmRfbW9udGggKyAnLScgKyBlbmRfeWVhcjtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSAn0YEgJ1xyXG4gICAgICAgICAgICArIHN0YXJ0X2RhdGUgKyAnINC/0L4gJyArIGVuZF9kYXRlO1xyXG4gICAgICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5nZXRVc2VySW5mb0Fib3V0UHJhY3RpY2UoKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgXCJtYWluV2luZG93VHlwZVByYWN0aWNlXCIpLmlubmVySFRNTCA9IGluZm9fYWJvdXRfcHJhY3RpY2UudHlwZVByYWN0aWNlXHJcbiAgICAgICAgICAgICsgJyDQv9GA0LDQutGC0LjQutCwJztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBcItCf0YDQsNC60YLQuNC60LhcIlxyXG4gICAgICAgICAgICArIFwiINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBcIiBcIjtcclxuICAgIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcclxuICAgICAgICBcInRhYmNvbnRyb2wyXCIpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhY3RpdmVcIilbMF0uY2hpbGRyZW5bMF0udGV4dDtcclxuICAgIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVQcmFjdGljZVRhYlwiKS52YWx1ZTtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0ge1xyXG4gICAgICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAgICAgJ3llYXInOiB0aGlzLnNlbGVjdGVkWWVhcixcclxuICAgICAgICAnZWR1X2xldmVsJzogZWR1Y2F0aW9uTGV2ZWxcclxuICAgIH07XHJcbiAgICByZXR1cm4gaW5mb19hYm91dF9wcmFjdGljZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZU9yZ1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBcInNlbGVjdEVkdUxldmVsT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwic2VsZWN0VHlwZVByYWN0aWNlT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgICBpZiAodHlwZVByYWN0aWNlID09PSBcImVkdWNhdGlvbmFsXCIpIHtcclxuICAgICAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQo9GH0LXQsdC90LDRj1wiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZVByYWN0aWNlID09PSBcImludGVybnNoaXBcIikge1xyXG4gICAgICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQvtC40LfQstC+0LTRgdGC0LLQtdC90L3QsNGPXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwicHJlZGlwbG9tYVwiKSB7XHJcbiAgICAgICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0J/RgNC10LTQtNC40L/Qu9C+0LzQvdCw0Y9cIjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHtcclxuICAgICAgICAndHlwZVByYWN0aWNlJzogdHlwZVByYWN0aWNlVGV4dCxcclxuICAgICAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyLFxyXG4gICAgICAgICdlZHVfbGV2ZWwnOiBlZHVjYXRpb25MZXZlbFxyXG4gICAgfTtcclxuICAgIHJldHVybiBpbmZvX2Fib3V0X3ByYWN0aWNlO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUucmVuZGVyVGFibGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgaWYgKGRhdGEgPT09IDApIHtcclxuICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5DbGVhclRhYmxlKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5DbGVhclRhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuQWRkRGF0YShkYXRhKTtcclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNvbG9yVGFibGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGRhdGFbaV0uc3RhdHVzID09PSAxKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuR2V0Tm9kZXMoaSkpLmFkZENsYXNzKFwiYXBwcm92ZWRfc3R1ZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuR2V0Tm9kZXMoaSkuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcclxuICAgICAgICAgICAgICAgIFwic29ydGluZ18xIGFwcHJvdmVkX3N0dWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRhW2ldLnN0YXR1cyA9PT0gMCkge1xyXG4gICAgICAgICAgICAkKHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkdldE5vZGVzKGkpKS5hZGRDbGFzcyhcImFwcGxpZWRfc3R1ZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuR2V0Tm9kZXMoaSkuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcclxuICAgICAgICAgICAgICAgIFwic29ydGluZ18xIGFwcGxpZWRfc3R1ZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jaGFuZ2VZZWFyID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgIGlmIChzZWxlY3RlZEVsZW0pIHtcclxuICAgICAgICBzZWxlY3RlZEVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnY3VycmVudCcpO1xyXG4gICAgfVxyXG4gICAgc2VsZWN0ZWRFbGVtID0gbm9kZTtcclxuICAgIHNlbGVjdGVkRWxlbS5jbGFzc0xpc3QuYWRkKCdjdXJyZW50Jyk7XHJcbiAgICB0aGlzLnNlbGVjdGVkWWVhciA9IHNlbGVjdGVkRWxlbS5pbm5lckhUTUw7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVZZWFyID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2l0ZW0geWVhcicgfHwgdGFyZ2V0LmNsYXNzTmFtZVxyXG4gICAgICAgICAgICA9PT0gJ2l0ZW0geWVhciBjdXJyZW50Jykge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVllYXIodGFyZ2V0KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RlZEdyb3VwcyA9IGZ1bmN0aW9uICh0cmVlVmlldykge1xyXG4gICAgaWYgKHRyZWVWaWV3ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBsZXQgZnJhbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZyYW1lc1wiKVswXS5jaGlsZHJlbjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZnJhbWVzW2ldLnN0eWxlLmRpc3BsYXkgIT09IFwibm9uZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlVmlldyA9IGZyYW1lc1tpXS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IEdyb3VwcyA9IFtdO1xyXG4gICAgbGV0IGxpTnVtYmVyID0gdHJlZVZpZXcucXVlcnlTZWxlY3RvckFsbCgnbGknKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlOdW1iZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZ3JvdXBzID0gbGlOdW1iZXJbaV0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6Y2hlY2tlZCcpO1xyXG4gICAgICAgIGlmIChncm91cHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXAgPSBncm91cHNbal0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwLmluZGV4T2YoXCLQutGD0YDRgVwiKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBHcm91cHMucHVzaChncm91cCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gR3JvdXBzO1xyXG59O1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsIG5hbWVMZWFmLCB1aWQpIHtcclxuICAgIGF3YWl0IHRyZWUuYWRkTGVhZihub2RlLCBuYW1lTGVhZiwge1xyXG4gICAgICAgIG1vZGU6ICdjaGVja2JveCcsXHJcbiAgICAgICAgY2hlY2tlZDogZmFsc2UsXHJcbiAgICAgICAgdWlkOiB1aWRcclxuICAgIH0pO1xyXG59XHJcblxyXG5WaWV3LnByb3RvdHlwZS5yZW1vdmVDaGlsZHJlbiA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkTm9kZXM7XHJcbiAgICB3aGlsZSAoY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZHJlblswXSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jbGVhckdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGlkID0gMDtcclxuICAgIHdoaWxlIChpZCA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIGxpQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgdGhpcy5pZFRyZWVWaWV3c1tpZF0pLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKGxpQXJyYXlbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZCsrO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVHcm91cHNUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uIChjb3Vyc2VzLCBncm91cHMpIHtcclxuICAgIGxldCBpZENvdW50ZXIgPSAwLCBjb3Vyc2VOdW1iZXIgPSBiYWNoZWxvclllYXIsIGNudDtcclxuICAgIGxldCBjb3Vyc2VzTmFtZSA9IFsnZmlyc3QnLCAnc2Vjb25kJywgJ3RoaXJkJywgJ2ZvdXJ0aCddO1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgd2hpbGUgKGlkQ291bnRlciA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIHRyZWUgPSAkKFwiI1wiICsgdGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdKS5kYXRhKFwidHJlZXZpZXdcIik7XHJcbiAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaWRDb3VudGVyXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBjb3Vyc2VOdW1iZXIgPSBtYXN0ZXJZZWFyO1xyXG4gICAgICAgICAgICBpID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY250ID0gMDtcclxuICAgICAgICBmb3IgKGk7IGkgPCBjb3Vyc2VOdW1iZXI7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdXJzZXNbaV0uZ3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IHRyZWUuZWxlbWVudC5maW5kKCdsaS4nICsgY291cnNlc05hbWVbY250XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaWRDb3VudGVyXVxyXG4gICAgICAgICAgICAgICAgICAgID09PSBcImdyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWRpYWxvZ0FkZC1iYWNoZWxvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgdGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdXHJcbiAgICAgICAgICAgICAgICAgICAgPT09IFwiZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItZGlhbG9nQWRkLW1hc3RlclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZVswXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Vyc2VzW2ldLmdyb3Vwc1tqXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW0gPSBub2RlLmZpbmQoJ3VsJylbMF0uY2hpbGRyZW5bbm9kZS5maW5kKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAndWwnKVswXS5jaGlsZHJlbi5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAkKGVsZW0pLmFkZENsYXNzKFwiY29sbGFwc2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVswXS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHVkZW50cyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBncm91cHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvdXJzZXNbaV0uZ3JvdXBzW2pdID09PSBncm91cHNba10ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1ZGVudHMgPSBncm91cHNba10uc3R1ZGVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHN0dWRlbnRzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCAkKGVsZW0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1ZGVudHNba10ubmFtZSwgc3R1ZGVudHNba10udWlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlucHV0cyA9IGVsZW0ucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdWlkXScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgaW5wdXRzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0c1trXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Vyc2VzW2ldLmdyb3Vwc1tqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY250Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlkQ291bnRlcisrO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5teVVwZGF0ZVRyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKGNvdXJzZXMsIGlkKSB7XHJcbiAgICBsZXQgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyLCBuO1xyXG4gICAgbGV0IGNvdXJzZXNOYW1lID0gWydmaXJzdCcsICdzZWNvbmQnLCAndGhpcmQnLCAnZm91cnRoJ107XHJcbiAgICB2YXIgaSA9IDA7XHJcblxyXG4gICAgdmFyIHRyZWUgPSAkKFwiI1wiICsgaWQpLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgIGlmIChpZC5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgIGNvdXJzZU51bWJlciA9IG1hc3RlclllYXI7XHJcbiAgICAgICAgaSA9IGJhY2hlbG9yWWVhcjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvdXJzZU51bWJlciA9IGJhY2hlbG9yWWVhcjtcclxuICAgICAgICBpID0gMDtcclxuICAgIH1cclxuICAgIG4gPSAwO1xyXG4gICAgZm9yIChpOyBpIDwgY291cnNlTnVtYmVyOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdXJzZXNbaV0uZ3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gdHJlZS5lbGVtZW50LmZpbmQoJ2xpLicgKyBjb3Vyc2VzTmFtZVtuXSk7XHJcbiAgICAgICAgICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLCBjb3Vyc2VzW2ldLmdyb3Vwc1tqXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG4rKztcclxuICAgIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0Q29uZmlndXJhdGlvblByYWN0aWNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwic2VsZWN0VHlwZVByYWN0aWNlT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gICAgbGV0IGVkdUxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVMZXZlbE9yZ2FuaXNhdGlvblNlY1wiKS52YWx1ZTtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0ge1xyXG4gICAgICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAgICAgJ3llYXInOiB0aGlzLnNlbGVjdGVkWWVhcixcclxuICAgICAgICAnZWR1X2xldmVsJzogZWR1TGV2ZWxcclxuICAgIH07XHJcbiAgICByZXR1cm4gaW5mb19hYm91dF9wcmFjdGljZTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHRyZWVfYWRkX2xlYWZfY2hlY2tib3godHJlZSwgbm9kZSwgbmFtZUxlYWYsIGlkVHlwZU9yZ2FuaXNhdGlvbikge1xyXG4gICAgdHJlZS5hZGRMZWFmKG5vZGUsIG5hbWVMZWFmLCB7XHJcbiAgICAgICAgbW9kZTogJ2NoZWNrYm94JyxcclxuICAgICAgICBjaGVja2VkOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICBub2RlLmZpbmQoJ3VsJykuZmluZCgnbGknKS5sYXN0KClbMF0uc2V0QXR0cmlidXRlKFwiaWRcIiwgJ3R5cGVfb3JnXydcclxuICAgICAgICArIGlkVHlwZU9yZ2FuaXNhdGlvbik7XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLnNldFR5cGVzT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgICB2YXIgdHJlZVZpZXdPcmdhbmlzYXRpb25zID0gJChcclxuICAgICAgICBcIiNvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uXCIpLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHlwZXNPcmdhbmlzYXRpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgbm9kZSA9IHRyZWVWaWV3T3JnYW5pc2F0aW9ucy5lbGVtZW50LmZpbmQoJ2xpLm5vZGUnKTtcclxuICAgICAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94KHRyZWVWaWV3T3JnYW5pc2F0aW9ucywgbm9kZSxcclxuICAgICAgICAgICAgdHlwZXNPcmdhbmlzYXRpb25baV0ubmFtZSwgdHlwZXNPcmdhbmlzYXRpb25baV0uaWQpO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5jbGVhclR5cGVzT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGxpQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAnb3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbicpLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbihsaUFycmF5W2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1bCcpWzBdKTtcclxuICAgIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuc2V0T3JnYW5pc2F0aW9uc0luVHJlZVZpZXcgPSBmdW5jdGlvbiAob3JnYW5pc2F0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZXNPcmdhbmlzYXRpb24pIHtcclxuICAgIHZhciB0cmVlID0gJChcIiNvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uXCIpLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3JnYW5pc2F0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdHlwZXNPcmdhbmlzYXRpb24ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKG9yZ2FuaXNhdGlvbnNbaV0uaWRfdHlwZV9vcmdhbmlzYXRpb24gPT09IHR5cGVzT3JnYW5pc2F0aW9uW2pdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGlBcnIgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGknKTtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBsaUFyci5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaUFycltrXS5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gKCd0eXBlX29yZ18nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIHR5cGVzT3JnYW5pc2F0aW9uW2pdLmlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gJChsaUFycltrXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRJbmZvTmV3T3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVDb21wYW55XCIpO1xyXG4gICAgdmFyIHR5cGVPcmcgPSBlLm9wdGlvbnNbZS5zZWxlY3RlZEluZGV4XS50ZXh0O1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IHtcclxuICAgICAgICAnbmFtZSc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmFtZUNvbXBhbnlcIikudmFsdWUsXHJcbiAgICAgICAgJ3R5cGVPcmcnOiB0eXBlT3JnLFxyXG4gICAgICAgICdpbmZvT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICAgICAnZW1haWxPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVtYWlsT3JnXCIpLnZhbHVlLFxyXG4gICAgICAgICdwaG9uZU9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGhvbmVPcmdcIikudmFsdWUsXHJcbiAgICAgICAgJ3BsYWNlc09yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxhY2VzQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICAgICAnbG9naW5PcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICAgICAncHN3ZE9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHN3ZENvbXBhbnlcIikudmFsdWUsXHJcbiAgICAgICAgJ2FkZHJlc3NPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZHJlc3NPcmdcIikudmFsdWUsXHJcbiAgICAgICAgJ2lkJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZENvbXBhbnlcIikuaW5uZXJIVE1MXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0ID0gZnVuY3Rpb24gKHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgdHlwZU9yZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZUNvbXBhbnlcIik7XHJcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKHR5cGVPcmcpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBvcHRpb24uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdHlwZXNPcmdhbmlzYXRpb25baV0uaWQpO1xyXG4gICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSB0eXBlc09yZ2FuaXNhdGlvbltpXS5uYW1lO1xyXG4gICAgICAgIHR5cGVPcmcuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuc2V0T3JnYW5pc2F0aW9uc0xpc3QgPSBmdW5jdGlvbiAob3JnYW5pc2F0aW9ucywgaWRMaXN0KSB7XHJcbiAgICBsZXQgbGlzdE9yZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkTGlzdCk7XHJcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKGxpc3RPcmcpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGRpdl9saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X2xpc3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0XCIpO1xyXG5cclxuICAgICAgICBsZXQgZGl2X2xpc3RfY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LWNvbnRlbnQgaW5saW5lLWJsb2NrXCIpO1xyXG4gICAgICAgIGlmIChpZExpc3QgPT09IFwib3JnYW5pc2F0aW9uTGlzdFwiKSB7XHJcbiAgICAgICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5SW5mb0Fib3V0T3JnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3RfdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC10aXRsZVwiKTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwiaWRfb3JnYW5pc2F0aW9uXCIsIG9yZ2FuaXNhdGlvbnNbaV0uaWQpO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5pbm5lckhUTUwgPSBvcmdhbmlzYXRpb25zW2ldLm5hbWU7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3RfdGl0bGUpO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl9saXN0X3N1YnRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fbGlzdF9zdWJ0aXRsZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3Qtc3VidGl0bGVcIik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3N1YnRpdGxlLmlubmVySFRNTCA9ICfQktGB0LXQs9C+INC80LXRgdGCOiAnXHJcbiAgICAgICAgICAgICsgb3JnYW5pc2F0aW9uc1tpXS5tYXhfc3R1ZGVudHNfbnVtYmVyO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3N1YnRpdGxlKTtcclxuXHJcbiAgICAgICAgbGV0IHNwYW5fbGlzdF9yZW1hcmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3JlbWFyay5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtcmVtYXJrXCIpO1xyXG4gICAgICAgIHNwYW5fbGlzdF9yZW1hcmsuaW5uZXJIVE1MID0gJ9Ce0YHRgtCw0LvQvtGB0Yw6ICdcclxuICAgICAgICAgICAgKyBvcmdhbmlzYXRpb25zW2ldLm1heF9zdHVkZW50c19udW1iZXI7XHJcbiAgICAgICAgLyrQntCR0K/Ql9CQ0KLQldCb0KzQndCeINCY0KHQn9Cg0JDQktCY0KLQrCDQndCQINCa0J7Qm9CY0KfQldCh0KLQktCeINCe0KHQotCQ0JLQqNCY0KXQodCvINCc0JXQodCiLiEhISEhISEhISEhISEhISEhISEhISEhISEhISovXHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3RfcmVtYXJrKTtcclxuXHJcbiAgICAgICAgZGl2X2xpc3QuYXBwZW5kQ2hpbGQoZGl2X2xpc3RfY29udGVudCk7XHJcblxyXG4gICAgICAgIGxldCBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICBcImlubGluZS1ibG9jayBsaXN0LWNvbnRlbnQgc2V0dGluZ3NPcmdhbmlzYXRpb25cIik7XHJcbiAgICAgICAgaWYgKGlkTGlzdCA9PT0gXCJvcmdhbmlzYXRpb25MaXN0XCIpIHtcclxuICAgICAgICAgICAgbGV0IHNwYW5fdXNlcl9wbHVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICBzcGFuX3VzZXJfcGx1cy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJtaWYtdXNlci1wbHVzIG1pZi1sZyBmZy1ncmF5IGFkZC1zdHVkZW50LW9yZ2FuaXNhdGlvblwiKTtcclxuICAgICAgICAgICAgc3Bhbl91c2VyX3BsdXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tBZGRTdHVkZW50VG9PcmdhbmlzYXRpb25TaG93RGlhbG9nKTtcclxuICAgICAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX3VzZXJfcGx1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc3Bhbl9wZW5jaWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9wZW5jaWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcclxuICAgICAgICAgICAgXCJtaWYtcGVuY2lsIG1pZi1sZyBmZy1ncmF5IGVkaXQtb3JnYW5pc2F0aW9uXCIpO1xyXG4gICAgICAgIHNwYW5fcGVuY2lsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uQ2xpY2tFZGl0T3JnYW5pc2F0aW9uKTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fcGVuY2lsKTtcclxuXHJcbiAgICAgICAgLyogbGV0IHNwYW5fY2FuY2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICBzcGFuX2NhbmNlbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1pZi1jYW5jZWwgbWlmLWxnIGZnLXllbGxvd1wiKTtcclxuICAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX2NhbmNlbCk7Ki9cclxuXHJcbiAgICAgICAgZGl2X2xpc3QuYXBwZW5kQ2hpbGQoZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbik7XHJcblxyXG4gICAgICAgIGxpc3RPcmcuYXBwZW5kQ2hpbGQoZGl2X2xpc3QpO1xyXG4gICAgfVxyXG5cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0SWRPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBpZE9yZ2FuaXNhdGlvbiA9IDA7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmlkID09PSBcInVwZGF0ZU9yZ2FuaXNhdGlvblwiKSB7XHJcbiAgICAgICAgaWRPcmdhbmlzYXRpb24gPSArZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMl0uaW5uZXJIVE1MO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWRPcmdhbmlzYXRpb24gPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmdldEF0dHJpYnV0ZShcclxuICAgICAgICAgICAgXCJpZF9vcmdhbmlzYXRpb25cIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaWRPcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXROYW1lT3JnYW5pc2F0aW9uSW5UcmVldmlldyA9IGZ1bmN0aW9uIChpZFRyZWV2aWV3KSB7XHJcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRUcmVldmlldyk7XHJcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbiA9IHBhcmVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxyXG4gICAgICAgIFwiYWN0aXZlXCIpWzBdLnF1ZXJ5U2VsZWN0b3IoJ1tpZF9vcmdhbmlzYXRpb24nKS5pbm5lckhUTUw7XHJcbiAgICByZXR1cm4gbmFtZU9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnNob3dEaWFsb2dPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVDb21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLm5hbWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkQ29tcGFueVwiKS5pbm5lckhUTUwgPSBvcmdhbmlzYXRpb24uaWQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm9Db21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLmluZm9fb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaG9uZU9yZ1wiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5waG9uZV9vcmdhbmlzYXRpb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVtYWlsT3JnXCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLmVtYWlsX29yZ2FuaXNhdGlvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwiYWRkcmVzc09yZ1wiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5hZGRyZXNzX29yZ2FuaXNhdGlvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwicGxhY2VzQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5tYXhfc3R1ZGVudHNfbnVtYmVyO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJsb2dpbkNvbXBhbnlcIikudmFsdWUgPSBvcmdhbmlzYXRpb24ubG9naW5fb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwc3dkQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5wc3dkX29yZ2FuaXNhdGlvbjtcclxuICAgIG1ldHJvRGlhbG9nLm9wZW4oJyNkaWFsb2dDcmVhdGVDb21wYW55Jyk7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmRpYWxvZ09wZW4gPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIG1ldHJvRGlhbG9nLm9wZW4oaWQpO1xyXG59O1xyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVPcmdhbmlzYXRpb25UaXRsZSA9IGZ1bmN0aW9uIChuYW1lT3JnYW5pc2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHByb3ZlZF9zdHVkZW50X2NvdW50LCBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCkge1xyXG4gICAgaWYgKG5vbl9hcHByb3ZlZF9zdHVkZW50X2NvdW50ID09PSAwKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJub25BcHByb3ZlZFN0dWRlbnRMaXN0VGl0bGVcIikuaW5uZXJIVE1MID0gXCIsINC/0YPRgdGCXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5vbkFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdOYW1lXCIpLmlubmVySFRNTCA9IG5hbWVPcmdhbmlzYXRpb247XHJcblxyXG4gICAgaWYgKGFwcHJvdmVkX3N0dWRlbnRfY291bnQgPT09IDApIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgXCJhcHByb3ZlZFN0dWRlbnRMaXN0VGl0bGVcIikuaW5uZXJIVE1MID0gXCLQodC/0LjRgdC+0Log0YPRgtCy0LXRgNC20LTQtdC90L3Ri9GFINGB0YLRg9C00LXQvdGC0L7QsiDQv9GD0YHRgi5cIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICBcImFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcItCh0L/QuNGB0L7QuiDRg9GC0LLQtdGA0LbQtNC10L3QvdGL0YUg0YHRgtGD0LTQtdC90YLQvtCyLlwiO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUgPT09IFwibGlzdC1jb250ZW50IGlubGluZS1ibG9ja1wiKSB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgfVxyXG4gICAgbGV0IG5hbWVPcmdhbmlzYXRpb25DbGljayA9IGVsZW1lbnQuY2hpbGRyZW5bMF0uaW5uZXJIVE1MO1xyXG4gICAgcmV0dXJuIG5hbWVPcmdhbmlzYXRpb25DbGljaztcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldE5hbWVPcmdhbmlzYXRpb25CeVRpdGxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnTmFtZVwiKS5pbm5lckhUTUw7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVTdHVkZW50c0xpc3RWaWV3ID0gZnVuY3Rpb24gKHN0dWRlbnRzLCBpZExpc3QpIHtcclxuICAgIGxldCBsaXN0U3R1ZGVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZExpc3QpO1xyXG4gICAgdGhpcy5yZW1vdmVDaGlsZHJlbihsaXN0U3R1ZGVudHMpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBkaXZfbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdl9saXN0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdFwiKTtcclxuXHJcbiAgICAgICAgbGV0IGRpdl9saXN0X2NvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1jb250ZW50IGlubGluZS1ibG9ja1wiKTtcclxuXHJcbiAgICAgICAgbGV0IHNwYW5fbGlzdF90aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXRpdGxlXCIpO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJyZXF1ZXN0XCIsIHN0dWRlbnRzW2ldLmlkX3JlcXVlc3QpO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJ1aWRcIiwgc3R1ZGVudHNbaV0udWlkX3N0dWRlbnQpO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJvcmdcIiwgc3R1ZGVudHNbaV0uaWRfb3JnYW5pc2F0aW9uKTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuaW5uZXJIVE1MID0gc3R1ZGVudHNbaV0uZGlzcGxheU5hbWU7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3RfdGl0bGUpO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl9saXN0X3N1YnRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fbGlzdF9zdWJ0aXRsZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3Qtc3VidGl0bGVcIik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3N1YnRpdGxlLmlubmVySFRNTCA9IHN0dWRlbnRzW2ldLmdyb3VwX25hbWU7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3Rfc3VidGl0bGUpO1xyXG5cclxuICAgICAgICBsZXQgeWVhciA9IHN0dWRlbnRzW2ldLmRhdGVfY3JlYXRpb25fcmVxdWVzdC5zdWJzdHIoMCwgNCksXHJcbiAgICAgICAgICAgIG1vbnRoID0gc3R1ZGVudHNbaV0uZGF0ZV9jcmVhdGlvbl9yZXF1ZXN0LnN1YnN0cig1LCAyKSxcclxuICAgICAgICAgICAgZGF5ID0gc3R1ZGVudHNbaV0uZGF0ZV9jcmVhdGlvbl9yZXF1ZXN0LnN1YnN0cig4LCAyKTtcclxuICAgICAgICBsZXQgZGF0ZSA9IGRheSArICctJyArIG1vbnRoICsgJy0nICsgeWVhcjtcclxuXHJcbiAgICAgICAgbGV0IHNwYW5fbGlzdF9yZW1hcmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3JlbWFyay5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtcmVtYXJrXCIpO1xyXG4gICAgICAgIHNwYW5fbGlzdF9yZW1hcmsuaW5uZXJIVE1MID0gJ9CU0LDRgtCwINC30LDQv9C40YHQuDogJyArIGRhdGU7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3RfcmVtYXJrKTtcclxuXHJcbiAgICAgICAgZGl2X2xpc3QuYXBwZW5kQ2hpbGQoZGl2X2xpc3RfY29udGVudCk7XHJcblxyXG4gICAgICAgIGxldCBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICBcImlubGluZS1ibG9jayBsaXN0LWNvbnRlbnQgc2V0dGluZ3NPcmdhbmlzYXRpb25cIik7XHJcblxyXG4gICAgICAgIGlmIChpZExpc3QgIT09IFwiYXBwcm92ZWRTdHVkZW50c1wiKSB7XHJcbiAgICAgICAgICAgIGxldCBzcGFuX3N0dWRlbnRfYXBwcm92ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgc3Bhbl9zdHVkZW50X2FwcHJvdmUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcclxuICAgICAgICAgICAgICAgIFwibWlmLWNoZWNrbWFyayBtaWYtbGcgZmctZ3JlZW5cIik7XHJcbiAgICAgICAgICAgIHNwYW5fc3R1ZGVudF9hcHByb3ZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsaWNrQXBwcm92ZVN0dWRlbnQpO1xyXG4gICAgICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fc3R1ZGVudF9hcHByb3ZlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzcGFuX3N0dWRlbnRfcmVqZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fc3R1ZGVudF9yZWplY3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtaWYtY2FuY2VsIG1pZi1sZyBmZy1yZWRcIik7XHJcbiAgICAgICAgc3Bhbl9zdHVkZW50X3JlamVjdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkNsaWNrUmVqZWN0U3R1ZGVudCk7XHJcbiAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX3N0dWRlbnRfcmVqZWN0KTtcclxuXHJcbiAgICAgICAgZGl2X2xpc3QuYXBwZW5kQ2hpbGQoZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbik7XHJcblxyXG4gICAgICAgIGxpc3RTdHVkZW50cy5hcHBlbmRDaGlsZChkaXZfbGlzdCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsbE9yZ2FuaXNhdGlvbnNMaXN0QmxvY2tcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkZW50c1JlcXVlc3RzXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJPcmdhbmlzYXRpb25TZWN0aW9uID0gZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnYW5pc2F0aW9uTGlzdEN1cnJlbnRQcmFjdGljZVRleHRcIik7XHJcbiAgICBpZiAocHJhY3RpY2UubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgdGV4dC5pbm5lckhUTUwgPSBcItCh0L/QuNGB0L7QuiDQvtGA0LPQsNC90LjQt9Cw0YbQuNC5INCyINC/0YDQsNC60YLQuNC60LVcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRleHQuaW5uZXJIVE1MID0gXCLQn9GA0LDQutGC0LjQutC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5PcGVuT3JDbG9zZUxvYWRJbWFnZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBkaXNwbGF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkXCIpLnN0eWxlLmRpc3BsYXk7XHJcbiAgICBpZiAoZGlzcGxheSA9PT0gXCJibG9ja1wiKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RlZFN0dWRlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBub2RlID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICdbcmVxdWVzdF0nKTtcclxuICAgIGxldCBzdHVkZW50ID0ge1xyXG4gICAgICAgICdpZF9yZXF1ZXN0Jzogbm9kZS5nZXRBdHRyaWJ1dGUoXCJyZXF1ZXN0XCIpLFxyXG4gICAgICAgICd1aWRfc3R1ZGVudCc6IG5vZGUuZ2V0QXR0cmlidXRlKFwidWlkXCIpLFxyXG4gICAgICAgICdpZF9vcmdhbmlzYXRpb24nOiBub2RlLmdldEF0dHJpYnV0ZShcIm9yZ1wiKVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImNsYXNzXCIpLmluZGV4T2YoXCJtaWYtY2FuY2VsXCIpID09PSAwKSB7XHJcbiAgICAgICAgc3R1ZGVudFsnaWRfc3RhdHVzJ10gPSAyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc3R1ZGVudFsnaWRfc3RhdHVzJ10gPSAxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0dWRlbnQ7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnNldFllYXJzQXJyYXkgPSBmdW5jdGlvbiAoeWVhcnMpIHtcclxuICAgIGxldCBidXR0b25BcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5XCIpO1xyXG4gICAgbGV0IGJ1dHRvbkFycmF5MSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5MVwiKTtcclxuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oYnV0dG9uQXJyYXkpO1xyXG4gIHRoaXMucmVtb3ZlQ2hpbGRyZW4oYnV0dG9uQXJyYXkxKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgeWVhcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaXRlbSB5ZWFyXCIpO1xyXG4gICAgICAgIHNwYW4uaW5uZXJIVE1MID0geWVhcnNbaV07XHJcbiAgICAgICAgYnV0dG9uQXJyYXkuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcblxyXG4gICAgICBsZXQgc3BhbjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgIHNwYW4xLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaXRlbSB5ZWFyXCIpO1xyXG4gICAgICBzcGFuMS5pbm5lckhUTUwgPSB5ZWFyc1tpXTtcclxuICAgICAgYnV0dG9uQXJyYXkuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgICAgIGJ1dHRvbkFycmF5MS5hcHBlbmRDaGlsZChzcGFuMSk7XHJcbiAgICB9XHJcbiAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIHNwYW4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpdGVtIHllYXJcIik7XHJcbiAgICBzcGFuLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiY3JlYXRlUHJhY3RpY2VCdG5cIik7XHJcbiAgICBzcGFuLmlubmVySFRNTCA9IFwiK1wiO1xyXG4gICAgYnV0dG9uQXJyYXkuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVByYWN0aWNlQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tDcmVhdGVQcmFjdGljZSk7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RlZFN0dWRlbnRzID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgU3R1ZGVudHMgPSBbXTtcclxuICAgIGxldCBub2RlcyA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0OmNoZWNrZWQnKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobm9kZXNbaV0ucGFyZW50RWxlbWVudC5uZXh0U2libGluZy5pbm5lckhUTUwuaW5kZXhPZihcItC60YPRgNGBXCIpID09PSAtMVxyXG4gICAgICAgICAgICAmJiBpc05hTigrbm9kZXNbaV0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MLnN1YnN0cigwLFxyXG4gICAgICAgICAgICAgICAgMikpKSB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gbm9kZXNbaV0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICBsZXQgdWlkID0gbm9kZXNbaV0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtdWlkXCIpO1xyXG4gICAgICAgICAgICBTdHVkZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICB1aWQ6IHVpZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gU3R1ZGVudHM7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5kaWFsb2dFbmFibGVDaGVja2JveGVzID0gZnVuY3Rpb24gKG5hbWVzR3JvdXBzLCBpZEVsZW1lbnQpIHtcclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZEVsZW1lbnQpO1xyXG4gICAgbGV0IGlucHV0cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5hbWVzR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChpbnB1dHNbaV0ucGFyZW50RWxlbWVudC5uZXh0U2libGluZy5pbm5lckhUTUwgPT09IG5hbWVzR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY291cnNlID0gaW5wdXRzW2ldLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoY291cnNlLmdldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiKSA9PT0gXCJjaGVja2JveFwiICYmIGNvdXJzZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKS5pbmRleE9mKFwiYWN0aXZlLWNvdXJzZVwiKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGNvdXJzZSkuYWRkQ2xhc3MoXCJhY3RpdmUtY291cnNlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW5wdXRzW2ldLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0dWRlbnRzQ2hlY2tib3hlcyA9IGlucHV0c1tpXS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICAgICAgICAgICAnW2RhdGEtdWlkXScpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBzdHVkZW50c0NoZWNrYm94ZXMubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHVkZW50c0NoZWNrYm94ZXNbbl0ucXVlcnlTZWxlY3RvcignaW5wdXQnKS5yZW1vdmVBdHRyaWJ1dGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRFbGVtQnlJZCA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgbGV0IGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICByZXR1cm4gZWxlbTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNyZWF0ZUlucHV0c09yZGVyID0gZnVuY3Rpb24gKHNlbGVjdGVkR3JvdXBzKSB7XHJcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmRlci1ibG9ja1wiKTtcclxuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4ocGFyZW50KTtcclxuICAgIGxldCBoNCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcclxuICAgIGg0LmlubmVySFRNTCA9IFwi0KDRg9C60L7QstC+0LTQuNGC0LXQu9C4XCI7XHJcbiAgICBoNC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFsaWduLWNlbnRlclwiKTtcclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChoNCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZmllbGQgbWFyZ2luMjBcIik7XHJcblxyXG4gICAgICAgIGxldCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICAgICAgcC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImlubGluZS1ibG9jayBzdWItaGVhZGVyXCIpO1xyXG4gICAgICAgIHAuaW5uZXJIVE1MID0gc2VsZWN0ZWRHcm91cHNbaV07XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHApO1xyXG5cclxuICAgICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiZ3JvdXBOYW1lXCIsIHNlbGVjdGVkR3JvdXBzW2ldKTtcclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG5cclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNyZWF0ZUlucHV0c1JlcG9ydCA9IGZ1bmN0aW9uIChzZWxlY3RlZEdyb3Vwcykge1xyXG4gICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JvdXBzLXJlcG9ydC1ibG9ja1wiKTtcclxuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4ocGFyZW50KTtcclxuICAgIGxldCBoNCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcclxuICAgIGg0LmlubmVySFRNTCA9IFwi0JjQvdGE0L7RgNC80LDRhtC40Y8g0L/QviDQutCw0LbQtNC+0Lkg0LPRgNGD0L/Qv9C1XCI7XHJcbiAgICBoNC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFsaWduLWNlbnRlclwiKTtcclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChoNCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGRpdl9ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2X2dyb3VwLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZ3JvdXAgXCIgKyBzZWxlY3RlZEdyb3Vwc1tpXSk7XHJcblxyXG4gICAgICAgIGxldCBoNCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcclxuICAgICAgICBoNC5pbm5lckhUTUwgPSBzZWxlY3RlZEdyb3Vwc1tpXTtcclxuICAgICAgICBoNC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFsaWduLWNlbnRlclwiKTtcclxuICAgICAgICBkaXZfZ3JvdXAuYXBwZW5kQ2hpbGQoaDQpO1xyXG5cclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmaWVsZCBtYXJnaW4yMFwiKTtcclxuICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcclxuICAgICAgICBwLmlubmVySFRNTCA9IFwi0KDRg9C60L7QstC+0LTQuNGC0LXQu9GMXCI7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHApO1xyXG4gICAgICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInN1cGVydmlzb3JcIik7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICBkaXZfZ3JvdXAuYXBwZW5kQ2hpbGQoZGl2KTtcclxuXHJcbiAgICAgICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmaWVsZCBtYXJnaW4yMFwiKTtcclxuICAgICAgICBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICAgICAgcC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImlubGluZS1ibG9jayBzdWItaGVhZGVyXCIpO1xyXG4gICAgICAgIHAuaW5uZXJIVE1MID0gXCLQodGC0YPQtC4gKDQg0LggNSlcIjtcclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICAgICAgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJnb29kX3N0dWRlbnRzXCIpO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICAgICAgZGl2X2dyb3VwLmFwcGVuZENoaWxkKGRpdik7XHJcblxyXG4gICAgICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZmllbGQgbWFyZ2luMjBcIik7XHJcbiAgICAgICAgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcclxuICAgICAgICBwLmlubmVySFRNTCA9IFwi0JrQvtC7LdCy0L4g0L/RgNC10L/QvtC0Li3RgNGD0LrQvtCy0L7QtC5cIjtcclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICAgICAgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJ0ZWFjaGVyX251bWJlclwiKTtcclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgICAgIGRpdl9ncm91cC5hcHBlbmRDaGlsZChkaXYpO1xyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChkaXZfZ3JvdXApO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgIGxldCB5ZWFyID0gZGF0ZS5zdWJzdHIoMCwgNCksXHJcbiAgICAgICAgbW9udGggPSBkYXRlLnN1YnN0cig1LCAyKSxcclxuICAgICAgICBkYXkgPSBkYXRlLnN1YnN0cig4LCAyKTtcclxuXHJcbiAgICByZXR1cm4gKGRheSArICcuJyArIG1vbnRoICsgJy4nICsgeWVhcik7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnRPcmRlciA9IGZ1bmN0aW9uIChwcmFjdGljZSwgc2VsZWN0ZWRHcm91cHMsIGFsbEdyb3VwcywgZGF0YSwgb3JnYW5pc2F0aW9ucykge1xyXG4gICAgbGV0IGdyb3Vwc0ZvckRvY3VtZW50ID0gW107XHJcbiAgbGV0IGVkdWNhdGlvbmFsX2xldmVsPXRoaXMuZ2V0RWR1Y2F0aW9uYWxMZXZlbCgpO1xyXG4gICAgbGV0IGJsb2NrVGVhY2hlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZGVyLWJsb2NrXCIpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKTtcclxuICAgIGxldCB0ZWFjaGVycyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja1RlYWNoZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwTmFtZSA9IGJsb2NrVGVhY2hlcnNbaV0uY2hpbGRyZW5bMF0uaW5uZXJIVE1MO1xyXG4gICAgICAgIGxldCB0ZWFjaGVyID0gYmxvY2tUZWFjaGVyc1tpXS5jaGlsZHJlblsxXS52YWx1ZTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEdyb3Vwc1tqXSA9PT0gZ3JvdXBOYW1lKVxyXG4gICAgICAgICAgICAgICAgdGVhY2hlcnMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVhY2hlclwiOiB0ZWFjaGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdyb3VwTmFtZVwiOiBncm91cE5hbWVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuaW5mb0dyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0uaW5kZXhPZih0aGlzLmluZm9Hcm91cHNbal0ubmFtZSkgIT09IC0xICYmIHRoaXMuaW5mb0dyb3Vwc1tqXS50eXBlID09PSBlZHVjYXRpb25hbF9sZXZlbCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBhbGxHcm91cHMubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IGFsbEdyb3Vwc1tuXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGVhY2hlcnMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEdyb3Vwc1tpXSA9PT0gdGVhY2hlcnNba10uZ3JvdXBOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLnRlYWNoZXIgPSB0ZWFjaGVyc1trXS50ZWFjaGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS50eXBlID0gdGhpcy5pbmZvR3JvdXBzW2pdLnR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLmZ1bGxOYW1lID0gdGhpcy5pbmZvR3JvdXBzW2pdLmZ1bGxOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS5wcm9maWxlID0gdGhpcy5pbmZvR3JvdXBzW2pdLnByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBzRm9yRG9jdW1lbnQucHVzaChhbGxHcm91cHNbbl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IGRlYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYW5cIikudmFsdWU7XHJcbiAgICBsZXQgaGVhZF9vZl9kZXBhcnRtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWFkX29mX2RlcGFydG1lbnRcIikudmFsdWU7XHJcbiAgICBsZXQgdHlwZV9kb2N1bWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2R0eXBlRG9jdW1lbnRcIikub3B0aW9uc1tkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdkdHlwZURvY3VtZW50XCIpLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xyXG4gICAgbGV0IGRvY3VtZW50cyA9IFtdO1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlVGFiXCIpLnZhbHVlO1xyXG4gICAgdHlwZVByYWN0aWNlID0gdHlwZVByYWN0aWNlLnJlcGxhY2VBdCh0eXBlUHJhY3RpY2UubGVuZ3RoIC0gMSwgXCLQuVwiKTtcclxuICAgIHR5cGVQcmFjdGljZSA9IHR5cGVQcmFjdGljZS5yZXBsYWNlQXQodHlwZVByYWN0aWNlLmxlbmd0aCAtIDIsIFwi0L5cIik7XHJcbiAgICB0eXBlUHJhY3RpY2UgPSB0eXBlUHJhY3RpY2UudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICBsZXQgc3RhcnRfZGF0ZSA9IHRoaXMuZm9ybWF0RGF0ZShwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlKTtcclxuICAgIGxldCBlbmRfZGF0ZSA9IHRoaXMuZm9ybWF0RGF0ZShwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZSk7XHJcbiAgICBpZiAodHlwZVByYWN0aWNlID09PSBcItGD0YfQtdCx0L3QvtC5XCIpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBzdHVkZW50cyA9IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnN0dWRlbnRzO1xyXG4gICAgICAgICAgICBsZXQgc3RyID0gSlNPTi5zdHJpbmdpZnkoc3R1ZGVudHMsIFtcIm5hbWVcIl0pO1xyXG4gICAgICAgICAgICBzdHVkZW50cyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuICAgICAgICAgICAgbGV0IGRvY3VtZW50ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJkaXJlY3Rpb25cIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0uZnVsbE5hbWUsXHJcbiAgICAgICAgICAgICAgICBcInByb2ZpbGVcIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0ucHJvZmlsZSxcclxuICAgICAgICAgICAgICAgIFwiZGVhblwiOiBkZWFuLFxyXG4gICAgICAgICAgICAgICAgXCJoZWFkX29mX2RlcGFydG1lbnRcIjogaGVhZF9vZl9kZXBhcnRtZW50LFxyXG4gICAgICAgICAgICAgICAgXCJ0eXBlX3ByYWN0aWNlXCI6IHR5cGVQcmFjdGljZSxcclxuICAgICAgICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBzdGFydF9kYXRlLFxyXG4gICAgICAgICAgICAgICAgXCJlbmRfZGF0ZVwiOiBlbmRfZGF0ZSxcclxuICAgICAgICAgICAgICAgIFwiZ3JvdXBfbmFtZVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJzdXBlcnZpc29yXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnRlYWNoZXIsXHJcbiAgICAgICAgICAgICAgICBcInN0dWRlbnRzXCI6IHN0dWRlbnRzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRvY3VtZW50cy5wdXNoKGRvY3VtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwi0L/RgNC+0LjQt9Cy0L7QtNGB0YLQstC10L3QvdC+0LlcIikge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3JnYW5pc2F0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBvcmdhbmlzYXRpb25zW2ldLnN0dWRlbnRzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YVtpXS5ncm91cCA9PT0gZ3JvdXBzRm9yRG9jdW1lbnRbal0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ3JvdXBzRm9yRG9jdW1lbnRbal0uc3R1ZGVudHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFbaV0uc3R1ZGVudCA9PT0gZ3JvdXBzRm9yRG9jdW1lbnRbal0uc3R1ZGVudHNba10ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFbaV0ub3JnYW5pc2F0aW9uID09PSBvcmdhbmlzYXRpb25zW25dLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tuXS5ncm91cCA9IGdyb3Vwc0ZvckRvY3VtZW50W2pdLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbbl0ub3JnYW5pemF0aW9uX25hbWUgPSBvcmdhbmlzYXRpb25zW25dLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbbl0udGVhY2hlciA9IGdyb3Vwc0ZvckRvY3VtZW50W2pdLnRlYWNoZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHVkZW50ID0gZGF0YVtpXS5zdHVkZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zW25dLnN0dWRlbnRzLnB1c2goe1wibmFtZVwiOiBzdHVkZW50fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHNGb3JEb2N1bWVudC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgb3JnYW5pc2F0aW9uc19mb3JfZG9jdW1lbnQ9W107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgb3JnYW5pc2F0aW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9yZ2FuaXNhdGlvbnNbal0uZ3JvdXAgPT09IGdyb3Vwc0ZvckRvY3VtZW50W2ldLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3R1ZGVudHMgPSBKU09OLnN0cmluZ2lmeShvcmdhbmlzYXRpb25zW2pdLnN0dWRlbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICBzdHVkZW50cyA9IEpTT04ucGFyc2Uoc3R1ZGVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHIgPSBKU09OLnN0cmluZ2lmeShvcmdhbmlzYXRpb25zW2pdLCBbXCJvcmdhbml6YXRpb25fbmFtZVwiLCBcInRlYWNoZXJcIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbal0gPSBKU09OLnBhcnNlKHN0cik7XHJcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tqXS5zdHVkZW50cyA9IHN0dWRlbnRzO1xyXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNfZm9yX2RvY3VtZW50LnB1c2gob3JnYW5pc2F0aW9uc1tqXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBkb2N1bWVudCA9IHtcclxuICAgICAgICAgICAgICAgIFwiZGlyZWN0aW9uXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLmZ1bGxOYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJwcm9maWxlXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnByb2ZpbGUsXHJcbiAgICAgICAgICAgICAgICBcImRlYW5cIjogZGVhbixcclxuICAgICAgICAgICAgICAgIFwiY291cnNlXCI6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgXCJoZWFkX29mX2RlcGFydG1lbnRcIjogaGVhZF9vZl9kZXBhcnRtZW50LFxyXG4gICAgICAgICAgICAgICAgXCJ0eXBlX3ByYWN0aWNlXCI6IHR5cGVQcmFjdGljZSxcclxuICAgICAgICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBzdGFydF9kYXRlLFxyXG4gICAgICAgICAgICAgICAgXCJlbmRfZGF0ZVwiOiBlbmRfZGF0ZSxcclxuICAgICAgICAgICAgICAgIFwiZ3JvdXBfbmFtZVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJzdXBlcnZpc29yXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnRlYWNoZXIsXHJcbiAgICAgICAgICAgICAgICBcIm9yZ2FuaXphdGlvbnNcIjogb3JnYW5pc2F0aW9uc19mb3JfZG9jdW1lbnRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZG9jdW1lbnRzLnB1c2goZG9jdW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBkb2N1bWVudHM7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldEVkdWNhdGlvbmFsTGV2ZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgdHJlZVZpZXcgPSAwO1xyXG4gICAgbGV0IGZyYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmcmFtZXNcIilbMF0uY2hpbGRyZW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChmcmFtZXNbaV0uc3R5bGUuZGlzcGxheSAhPT0gXCJub25lXCIpIHtcclxuICAgICAgICAgICAgdHJlZVZpZXcgPSBmcmFtZXNbaV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBlZHVjYXRpb25hbF9sZXZlbCA9IHRyZWVWaWV3LmdldEF0dHJpYnV0ZShcImlkXCIpO1xyXG4gICAgaWYgKGVkdWNhdGlvbmFsX2xldmVsLmluZGV4T2YoXCJiYWNoZWxvclwiKSAhPT0gLTEpIHtcclxuICAgICAgICByZXR1cm4gXCJiYWNoZWxvclwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIFwibWFzdGVyXCI7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnRSZXBvcnQgPSBmdW5jdGlvbiAocHJhY3RpY2UsIHNlbGVjdGVkR3JvdXBzLCBhbGxHcm91cHMpIHtcclxuICAgIGxldCBlZHVjYXRpb25hbF9sZXZlbCA9IHRoaXMuZ2V0RWR1Y2F0aW9uYWxMZXZlbCgpO1xyXG4gICAgbGV0IGdyb3Vwc0ZvckRvY3VtZW50ID0gW107XHJcbiAgICBsZXQgYmxvY2tHcm91cHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyb3Vwcy1yZXBvcnQtYmxvY2tcIikuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZ3JvdXAnKTtcclxuICAgIGxldCBhZGRpdGlvbmFsX2luZm8gPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZ3JvdXBOYW1lID0gYmxvY2tHcm91cHNbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2g0JylbMF0uaW5uZXJIVE1MO1xyXG4gICAgICAgIGxldCBzdXBlcnZpc29yID0gYmxvY2tHcm91cHNbaV0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInN1cGVydmlzb3JcIilbMF0udmFsdWU7XHJcbiAgICAgICAgbGV0IGdvb2Rfc3R1ZGVudHNfbnVtYmVyID0gYmxvY2tHcm91cHNbaV0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImdvb2Rfc3R1ZGVudHNcIilbMF0udmFsdWU7XHJcbiAgICAgICAgbGV0IHRlYWNoZXJfbnVtYmVyID0gYmxvY2tHcm91cHNbaV0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRlYWNoZXJfbnVtYmVyXCIpWzBdLnZhbHVlXHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbal0gPT09IGdyb3VwTmFtZSlcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxfaW5mby5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBcImdyb3VwTmFtZVwiOiBncm91cE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdXBlcnZpc29yXCI6IHN1cGVydmlzb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJnb29kX3N0dWRfbnVtXCI6IGdvb2Rfc3R1ZGVudHNfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVhY2hlcl9udW1iZXJcIjogdGVhY2hlcl9udW1iZXJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuaW5mb0dyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0uaW5kZXhPZih0aGlzLmluZm9Hcm91cHNbal0ubmFtZSkgIT09IC0xICYmIHRoaXMuaW5mb0dyb3Vwc1tqXS50eXBlID09PSBlZHVjYXRpb25hbF9sZXZlbCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBhbGxHcm91cHMubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IGFsbEdyb3Vwc1tuXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYWRkaXRpb25hbF9pbmZvLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IGFkZGl0aW9uYWxfaW5mb1trXS5ncm91cE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0uc3VwZXJ2aXNvciA9IGFkZGl0aW9uYWxfaW5mb1trXS5zdXBlcnZpc29yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS5mdWxsTmFtZSA9IHRoaXMuaW5mb0dyb3Vwc1tqXS5mdWxsTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0uZ29vZF9zdHVkX251bSA9IGFkZGl0aW9uYWxfaW5mb1trXS5nb29kX3N0dWRfbnVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS50ZWFjaGVyX251bWJlciA9IGFkZGl0aW9uYWxfaW5mb1trXS50ZWFjaGVyX251bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cHNGb3JEb2N1bWVudC5wdXNoKGFsbEdyb3Vwc1tuXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgc3RhcnRfZGF0ZSA9IHRoaXMuZm9ybWF0RGF0ZShwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlKTtcclxuICAgIGxldCBlbmRfZGF0ZSA9IHRoaXMuZm9ybWF0RGF0ZShwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZSk7XHJcblxyXG4gICAgbGV0IGhlYWRfb2ZfZGVwYXJ0bWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVhZF9vZl9kZXBhcnRtZW50XCIpLnZhbHVlO1xyXG4gICAgbGV0IGRvY3VtZW50cyA9IFtdO1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlVGFiXCIpLnZhbHVlO1xyXG4gICAgdHlwZVByYWN0aWNlID0gdHlwZVByYWN0aWNlLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgbGV0IGNvdXJzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY291cnNlXCIpLnZhbHVlO1xyXG4gICAgbGV0IGJhc2VfcHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhc2VfcHJhY3RpY2VcIikudmFsdWU7XHJcbiAgICBsZXQgbnVtX2Jhc2VfcHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm51bV9iYXNlX3ByYWN0aWNlXCIpLnZhbHVlO1xyXG4gICAgbGV0IG51bV9sZWN0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2xlY3Rpb25zXCIpLnZhbHVlO1xyXG5cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGRvY3VtZW50ID0ge1xyXG4gICAgICAgICAgICBcImRpcmVjdGlvblwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5mdWxsTmFtZSxcclxuICAgICAgICAgICAgXCJjb3Vyc2VcIjogY291cnNlLFxyXG4gICAgICAgICAgICBcInR5cGVfcHJhY3RpY2VcIjogdHlwZVByYWN0aWNlLFxyXG4gICAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogc3RhcnRfZGF0ZSxcclxuICAgICAgICAgICAgXCJlbmRfZGF0ZVwiOiBlbmRfZGF0ZSxcclxuICAgICAgICAgICAgXCJncm91cF9uYW1lXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLm5hbWUsXHJcbiAgICAgICAgICAgIFwiYmFzZV9wcmFjdGljZVwiOiBiYXNlX3ByYWN0aWNlLFxyXG4gICAgICAgICAgICBcInllYXJcIjogcHJhY3RpY2UueWVhcixcclxuICAgICAgICAgICAgXCJ0ZWFjaGVyX251bWJlclwiOiBncm91cHNGb3JEb2N1bWVudFtpXS50ZWFjaGVyX251bWJlcixcclxuICAgICAgICAgICAgXCJzdHVkZW50X251bWJlclwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5zdHVkZW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgIFwiZ29vZF9zdHVkX251bVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5nb29kX3N0dWRfbnVtLFxyXG4gICAgICAgICAgICBcIm51bV9iYXNlX3ByYWN0aWNlXCI6IG51bV9iYXNlX3ByYWN0aWNlLFxyXG4gICAgICAgICAgICBcIm51bV9sZWN0aW9uc1wiOiBudW1fbGVjdGlvbnMsXHJcbiAgICAgICAgICAgIFwic3VwZXJ2aXNvclwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5zdXBlcnZpc29yLFxyXG4gICAgICAgICAgICBcImhlYWRfb2ZfZGVwYXJ0bWVudFwiOiBoZWFkX29mX2RlcGFydG1lbnRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRvY3VtZW50cy5wdXNoKGRvY3VtZW50KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkb2N1bWVudHM7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdFZhbHVlID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBsZXQgdmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkub3B0aW9uc1tkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuc2VsZWN0ZWRJbmRleF0udmFsdWU7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jaGFuZ2VEaXNwbGF5ID0gZnVuY3Rpb24gKGlkLCB2YWx1ZSkge1xyXG4gICAgbGV0IGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNoYW5nZUlubmVySHRtbCA9IGZ1bmN0aW9uIChpZCwgdmFsdWUpIHtcclxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgZWxlbS5pbm5lckhUTUwgPSB2YWx1ZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmZpbGxEaWFsb2cgPSBmdW5jdGlvbiAocHJhY3RpY2UsIG9yZ2FuaXNhdGlvbnMpIHtcclxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYXNlX3ByYWN0aWNlXCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZWxlbS52YWx1ZSArPSBvcmdhbmlzYXRpb25zW2ldLm5hbWUgKyAnLCAnO1xyXG4gICAgfVxyXG4gICAgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2Jhc2VfcHJhY3RpY2VcIik7XHJcbiAgICBlbGVtLnZhbHVlID0gb3JnYW5pc2F0aW9ucy5sZW5ndGg7XHJcbn07XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBdCA9IGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcclxuICAgIHJldHVybiB0aGlzLnN1YnN0cigwLCBpbmRleCkgKyByZXBsYWNlbWVudCArIHRoaXMuc3Vic3RyKGluZGV4ICsgcmVwbGFjZW1lbnQubGVuZ3RoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmlldztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9WaWV3LmpzIiwiXHJcbmNvbnN0IFNFUFRFTUJFUiA9IDk7XHJcbmNvbnN0IGZpcnN0Q291cnNlID0gMDtcclxuY29uc3Qgc2Vjb25kQ291cnNlID0gMTtcclxuY29uc3QgdGhpcmRDb3Vyc2UgPSAyO1xyXG5jb25zdCBmb3VydGhDb3Vyc2UgPSAzO1xyXG5jb25zdCBtYXN0ZXJGaXJzdENvdXJzZSA9IDQ7XHJcbmNvbnN0IG1hc3RlclNlY29uZENvdXJzZSA9IDU7XHJcbmNvbnN0IFJFSkVDVEVEID0gMjtcclxuY29uc3QgQVBQUk9WRUQgPSAxO1xyXG5jb25zdCBBUFBMWSA9IDA7XHJcbnZhciBNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLkdyb3VwcyA9IFtdO1xyXG4gIHRoaXMuU3R1ZGVudHMgPSBbXTtcclxuICB0aGlzLkNvdXJzZXMgPSBbXTtcclxuICB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uID0gW107XHJcbiAgdGhpcy5PcmdhbmlzYXRpb25zID0gW107XHJcblxyXG59O1xyXG5cclxuY2xhc3MgQ291cnNlIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lQ291cnNlKSB7XHJcbiAgICB0aGlzLm5hbWVDb3Vyc2UgPSBuYW1lQ291cnNlO1xyXG4gICAgdGhpcy5ncm91cHMgPSBbXTtcclxuICB9XHJcblxyXG4gIGFkZEdyb3VwKGdyb3VwKSB7XHJcbiAgICB0aGlzLmdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIEdyb3VwIHtcclxuICBjb25zdHJ1Y3Rvcih1aWRfTERBUCwgbmFtZUdyb3VwKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lR3JvdXA7XHJcbiAgICB0aGlzLnVpZF9MREFQID0gdWlkX0xEQVA7XHJcbiAgICB0aGlzLnN0dWRlbnRzID0gW107XHJcbiAgfVxyXG5cclxuICBhZGRTdHVkZW50KHN0dWRlbnQpIHtcclxuICAgIHRoaXMuc3R1ZGVudHMucHVzaChzdHVkZW50KTtcclxuICB9XHJcbn1cclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0RGF0YSA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZEdyb3VwcyxcclxuICAgIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMpIHtcclxuICBsZXQgZGF0YSA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwLCBsID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyArK2ssICsrbCkge1xyXG4gICAgICAgICAgbGV0IGlzU3R1ZGVudEFwcGx5ID0gZmFsc2U7XHJcbiAgICAgICAgICBkYXRhLnB1c2goe2dyb3VwOiB0aGlzLkdyb3Vwc1tpXS5uYW1lfSk7XHJcbiAgICAgICAgICBkYXRhW2xdLm9yZ2FuaXNhdGlvbiA9ICcgJztcclxuICAgICAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucy5sZW5ndGg7ICsrdykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd10ubGVuZ3RoOyArK24pIHtcclxuICAgICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgICA9PT0gK3JlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0uaWRfcmVxdWVzdCkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50ID0gdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10ubmFtZTtcclxuICAgICAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudF9VSUQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS51aWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5pZF9zdGF0dXMgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdGF0dXMgPSByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLmlkX3N0YXR1cztcclxuICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gPSByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLm5hbWVfb3JnYW5pc2F0aW9uO1xyXG4gICAgICAgICAgICAgICAgICBpc1N0dWRlbnRBcHBseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uICs9IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0ubmFtZV9vcmdhbmlzYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICsgJywgJztcclxuICAgICAgICAgICAgICAgICAgaXNTdHVkZW50QXBwbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKCFpc1N0dWRlbnRBcHBseSkge1xyXG4gICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5uYW1lO1xyXG4gICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnRfVUlEID0gdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10udWlkO1xyXG4gICAgICAgICAgICBkYXRhW2xdLm9yZ2FuaXNhdGlvbiA9IFwi0J3QtSDQt9Cw0L/QuNGB0LDQu9GB0Y9cIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGRhdGE7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0R3JvdXBzID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvZ3JvdXBzJyk7XHJcbiAgbGV0IGxpc3QgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIGxldCBncm91cHMgPSBsaXN0Ll9lbWJlZGRlZC5ncm91cHM7XHJcbiAgcmV0dXJuIGdyb3VwcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRHcm91cHNCeVByYWN0aWNlSWQgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBpbmZvID0gXCI/aWRfcHJhY3RpY2U9XCJcclxuICAgICAgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9ncm91cHMtYnktcHJhY3RpY2UtaWQnICsgaW5mbywgcGFyYW1zKTtcclxuICBsZXQgZ3JvdXBzX3VpZHMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIHJldHVybiBncm91cHNfdWlkcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRHcm91cHNOYW1lQnlHcm91cHNVSUQgPSBhc3luYyBmdW5jdGlvbiAodWlkc0dyb3Vwcykge1xyXG4gIGxldCBncm91cHMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHVpZHNHcm91cHMubGVuZ3RoOyArK2kpIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgaWYgKCt1aWRzR3JvdXBzW2ldLnVpZF9ncm91cCA9PT0gdGhpcy5Hcm91cHNbal0udWlkX0xEQVApIHtcclxuICAgICAgICBncm91cHMucHVzaCh0aGlzLkdyb3Vwc1tqXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZ3JvdXBzO1xyXG59O1xyXG4vKtC/0L7Qu9GD0YfQsNC10Lwg0YHRgtGD0LTQtdC90YLQvtCyINC40Lcg0YXRgNCw0L3QuNC70LjRidCwIExEQVAg0L/QviBJRCDQs9GA0YPQv9C/0YsqL1xyXG4vKk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0J5R3JvdXBJZCA9IGFzeW5jIGZ1bmN0aW9uIChncm91cElEKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJveHkvY29yZS92MS9ncm91cHMvJyArIGdyb3VwSUQpO1xyXG4gIGxldCBsaXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICBsZXQgc3R1ZGVudHNMaXN0ID0gbGlzdC5fZW1iZWRkZWQuc3R1ZGVudHM7XHJcbiAgcmV0dXJuIHN0dWRlbnRzTGlzdDtcclxufTsqL1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFN0dWRlbnRzQnlVSUQgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudHNfaW5mbykge1xyXG4gIGxldCBzdHVkZW50cyA9IFtdLCB1cmxzID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50c19pbmZvLmxlbmd0aDsgKytpKSB7XHJcbiAgICB1cmxzLnB1c2goJy9wcm94eS9jb3JlL3YxL3Blb3BsZS8nICsgc3R1ZGVudHNfaW5mb1tpXS51aWRfc3R1ZGVudCk7XHJcbiAgfVxyXG4gIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApXHJcbiAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICkpXHJcbiAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICBjb25zdCByZXNMZW5ndGggPSByZXN1bHRzLmxlbmd0aDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzTGVuZ3RoOyArK2kpIHtcclxuICAgICAgc3R1ZGVudHMucHVzaCh7XHJcbiAgICAgICAgZGlzcGxheU5hbWU6IHJlc3VsdHNbaV0uZGlzcGxheU5hbWUsXHJcbiAgICAgICAgZ3JvdXBfbmFtZTogcmVzdWx0c1tpXS5fbGlua3MuZ3JvdXBzWzBdLm5hbWUsXHJcbiAgICAgICAgZ3JvdXBfVUlEOiByZXN1bHRzW2ldLl9saW5rcy5ncm91cHNbMF0uaWQsXHJcbiAgICAgICAgZGF0ZV9jcmVhdGlvbl9yZXF1ZXN0OiBzdHVkZW50c19pbmZvW2ldLmRhdGVfY3JlYXRpb24sXHJcbiAgICAgICAgaWRfcmVxdWVzdDogc3R1ZGVudHNfaW5mb1tpXS5pZF9yZXF1ZXN0LFxyXG4gICAgICAgIHVpZF9zdHVkZW50OiBzdHVkZW50c19pbmZvW2ldLnVpZF9zdHVkZW50LFxyXG4gICAgICAgIGlkX29yZ2FuaXNhdGlvbjogc3R1ZGVudHNfaW5mb1tpXS5pZF9vcmdhbmlzYXRpb25cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHN0dWRlbnRzO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuaW5pdCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZ3JvdXBzID0gYXdhaXQgdGhpcy5nZXRHcm91cHMoKTtcclxuICBsZXQgdXJscyA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB0aGlzLkdyb3Vwcy5wdXNoKG5ldyBHcm91cChncm91cHNbaV0uaWQsIGdyb3Vwc1tpXS5uYW1lKSk7XHJcbiAgICB1cmxzLnB1c2goJy9wcm94eS9jb3JlL3YxL2dyb3Vwcy8nICsgZ3JvdXBzW2ldLmlkKTtcclxuICB9XHJcbiAgYXdhaXQgdGhpcy5nZXRTdHVkZW50c0J5R3JvdXBJZHModXJscyk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0U3R1ZGVudHNCeUdyb3VwSWRzID0gYXN5bmMgZnVuY3Rpb24gKHVybHMpIHtcclxuICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgKVxyXG4gIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApKVxyXG4gIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgY29uc3QgcmVzTGVuZ3RoID0gcmVzdWx0cy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBzdHVkZW50cyA9IHJlc3VsdHNbaV0uX2VtYmVkZGVkLnN0dWRlbnRzO1xyXG4gICAgICBjb25zdCBzdExlbmd0aCA9IHN0dWRlbnRzLmxlbmd0aDtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdExlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgbGV0IHN0dWRlbnQgPSB7XHJcbiAgICAgICAgICAnbmFtZSc6IHN0dWRlbnRzW2pdLmRpc3BsYXlOYW1lLFxyXG4gICAgICAgICAgJ3VpZCc6IHN0dWRlbnRzW2pdLnVpZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMucHVzaChzdHVkZW50KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEN1cnJlbnRZZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICBsZXQgY3VycmVudFllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKTtcclxuICByZXR1cm4gY3VycmVudFllYXI7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZGlzdHJpYnV0ZUdyb3Vwc0J5Q291cnNlcyA9IGFzeW5jIGZ1bmN0aW9uIChjdXJyZW50WWVhcikge1xyXG4gIHRoaXMuQ291cnNlcyA9IFtcclxuICAgIG5ldyBDb3Vyc2UoJzEnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzInKSxcclxuICAgIG5ldyBDb3Vyc2UoJzMnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzQnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzEgKNC80LMpJyksXHJcbiAgICBuZXcgQ291cnNlKCcyICjQvNCzKScpXHJcbiAgXTtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICBpZiAoK2N1cnJlbnRNb250aCA8IFNFUFRFTUJFUikge1xyXG4gICAgY3VycmVudFllYXIgLT0gMTtcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgIT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW21hc3RlckZpcnN0Q291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbZmlyc3RDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSAhPT0gLTEpIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbbWFzdGVyU2Vjb25kQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbc2Vjb25kQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgPT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW3RoaXJkQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgPT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW2ZvdXJ0aENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGN1cnJlbnRZZWFyICs9IDM7XHJcbiAgfVxyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UHJhY3RpY2UgPSBhc3luYyBmdW5jdGlvbiAoaW5mb19hYm91dF9wcmFjdGljZSkge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgaW5mb19hYm91dF9wcmFjdGljZSA9IFwiP3llYXI9XCIgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLnllYXIgKyBcIiZlZHVfbGV2ZWw9XCJcclxuICAgICAgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLmVkdV9sZXZlbCArIFwiJnR5cGVQcmFjdGljZT1cIlxyXG4gICAgICArIGluZm9fYWJvdXRfcHJhY3RpY2UudHlwZVByYWN0aWNlO1xyXG4gIGxldCBpbmZvID0gMDtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZScgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLCBwYXJhbXMpXHJcbiAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICBpbmZvID0gcmVzcG9uc2UuanNvbigpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKChyZXNwb25zZSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBpbmZvO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdEJ5U3R1ZGVudFVJRCA9IGFzeW5jIGZ1bmN0aW9uIChwcmFjdGljZSwgc3R1ZGVudCkge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgbGV0IGluZm8gPSAnP3VpZD0nICsgc3R1ZGVudC51aWQgKyBcIiZpZF9wcmFjdGljZT1cIlxyXG4gICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3JlcXVzdC1ieS1zdHVkZW50LXVpZCcgKyBpbmZvLCBwYXJhbXMpO1xyXG4gIGxldCByZXF1ZXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICByZXR1cm4gcmVxdWVzdDtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVJZE9yZ2FuaXNhdGlvbkluUmVxdWVzdCA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50KSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0ICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiXHJcbiAgICAgICsgc3R1ZGVudC5pZF9vcmdhbmlzYXRpb247XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvdXBkYXRlLXJlcXVlc3QnICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0cyA9IGFzeW5jIGZ1bmN0aW9uIChwcmFjdGljZSwgZ3JvdXBzKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgcmVxdWVzdHMgPSBbXTtcclxuICBsZXQgdXJscyA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7IGorKykge1xyXG4gICAgICBsZXQgaW5mbyA9ICc/aWRfc3R1ZGVudD0nICsgZ3JvdXBzW2ldLnN0dWRlbnRzW2pdLnVpZCArIFwiJmlkX3ByYWN0aWNlPVwiXHJcbiAgICAgICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgICB1cmxzLnB1c2goJy9yZXF1c3RzLWJ5LXN0dWRlbnQtcHJhY3RpY2UnICsgaW5mbyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApXHJcbiAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICkpXHJcbiAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgcmVxdWVzdHMucHVzaChyZXN1bHRzW2ldKTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gcmVxdWVzdHM7Ly/Qv9C+0LvRg9GH0LjQu9C4IGFsbCDQt9Cw0Y/QstC+0Log0YHRgtGD0LTQtdC90YLQvtCyINCy0YvQsdGA0LDQvdC90YvRhSDQs9GA0YPQv9C/XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuYXNzb3NpYXRlUmVxdWVzdFRvU3R1ZGVudCA9IGFzeW5jIGZ1bmN0aW9uIChyZXF1ZXN0cywgZ3JvdXBzKSB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IGdyb3Vwc1tqXSkge1xyXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyArK2spIHtcclxuICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcmVxdWVzdHMubGVuZ3RoOyArK24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLnVpZCA9PT0gcmVxdWVzdHNbbl0udWlkX3N0dWRlbnQpIHtcclxuICAgICAgICAgICAgICB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9yZXF1ZXN0ID0gcmVxdWVzdHNbbl0uaWRfcmVxdWVzdDtcclxuICAgICAgICAgICAgICBpZiAocmVxdWVzdHNbbl0uaWRfb3JnYW5pc2F0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9vcmdhbmlzYXRpb24gPSByZXF1ZXN0c1tuXS5pZF9vcmdhbmlzYXRpb247XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzT3JnYW5pc2F0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZEdyb3Vwcykge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgbGV0IHVybHMgPSBbXTtcclxuICBsZXQgb3JnYW5pc2F0aW9uc19ieV9yZXF1ZXN0ID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7ICsraikge1xyXG4gICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLmxlbmd0aDsgKytrKSB7XHJcbiAgICAgICAgICB1cmxzLnB1c2goJy9vcmdhbmlzYXRpb25zLWJ5LXJlcXVlc3QnICsgJz9pZF9yZXF1ZXN0PSdcclxuICAgICAgICAgICAgICArIHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLmlkX3JlcXVlc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApXHJcbiAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICkpXHJcbiAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgb3JnYW5pc2F0aW9uc19ieV9yZXF1ZXN0LnB1c2gocmVzdWx0c1tpXSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIG9yZ2FuaXNhdGlvbnNfYnlfcmVxdWVzdDtcclxufTtcclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RCeVN0dWRlbnRVSURTID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlLCBzdHVkZW50cykge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgbGV0IHVybHMgPSBbXTtcclxuICBsZXQgcmVxdWVzdHMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB1cmxzLnB1c2goJy9yZXF1c3QtYnktc3R1ZGVudC11aWQnICsgJz91aWQ9JyArIHN0dWRlbnRzW2ldLnVpZFxyXG4gICAgICAgICsgXCImaWRfcHJhY3RpY2U9XCJcclxuICAgICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlKTtcclxuICB9XHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgKVxyXG4gIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApKVxyXG4gIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgIHJlcXVlc3RzLnB1c2gocmVzdWx0c1tpXSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiByZXF1ZXN0cztcclxufTtcclxuTW9kZWwucHJvdG90eXBlLmdldFByYWN0aWNlWWVhcnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcveWVhcnMtcHJhY3RpY2UnKTtcclxuICBsZXQgeWVhcnMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIHJldHVybiB5ZWFycztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0c09yZ2FuaXNhdGlvbnNCeVJlcXVlc3RJZCA9IGFzeW5jIGZ1bmN0aW9uIChyZXF1ZXN0cykge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCB1cmxzID0gW107XHJcbiAgICBsZXQgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXF1ZXN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHVybHMucHVzaCgnL29yZ2FuaXNhdGlvbnMtYnktcmVxdWVzdCcgKyAnP2lkX3JlcXVlc3Q9JyArIHJlcXVlc3RzW2ldLmlkX3JlcXVlc3QpO1xyXG4gICAgfVxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgIClcclxuICAgICAgICAudGhlbihyZXNwb25zZXMgPT4gUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICAgICAgKSlcclxuICAgICAgICAudGhlbihyZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0c19vcmdhbmlzYXRpb25zLnB1c2gocmVzdWx0c1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVxdWVzdHNfb3JnYW5pc2F0aW9ucztcclxufTtcclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBDUkVBVElPTlxyXG4gU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuTW9kZWwucHJvdG90eXBlLmdldFR5cGVzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSBbXTtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy90eXBlcy1vcmdhbmlzYXRpb24nKTtcclxuICBsZXQgdHlwZXMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSB0eXBlcztcclxuICByZXR1cm4gdGhpcy50eXBlc09yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbnMnKTtcclxuICBsZXQgb3JncyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgdGhpcy5PcmdhbmlzYXRpb25zID0gb3JncztcclxuICByZXR1cm4gdGhpcy5PcmdhbmlzYXRpb25zO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbnNCeVByYWN0aWNlSWQgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBpbmZvID0gJz9pZF9wcmFjdGljZT0nICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9ucy1ieS1wcmFjdGljZScgKyBpbmZvLCBwYXJhbXMpO1xyXG4gIGxldCBvcmdhbmlzYXRpb25zID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICByZXR1cm4gb3JnYW5pc2F0aW9ucztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25CeUlkID0gYXN5bmMgZnVuY3Rpb24gKGlkKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgaW5mbyA9ICc/aWQ9JyArIGlkO1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbi1ieS1pZCcgKyBpbmZvLCBwYXJhbXMpO1xyXG4gIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIHJldHVybiBvcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdHNCeVByYWN0aWNlSWQgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9ICc/aWRfcHJhY3RpY2U9JyArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcmVxdWVzdHMtYnktcHJhY3RpY2UnICsgaW5mbywgcGFyYW1zKTtcclxuICAgIGxldCByZXF1ZXN0cyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gcmVxdWVzdHM7XHJcbn07XHJcblxyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzQnlPcmdhbmlzYXRpb25OYW1lID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbixcclxuICAgIHByYWN0aWNlLCBpc0FwcHJvdmVkKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgaW5mbyA9IDAsIFNUQVRVUztcclxuICBpZiAoIWlzQXBwcm92ZWQpIHtcclxuICAgIGluZm8gPSBcIj9pZF9wcmFjdGljZT1cIiArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgU1RBVFVTID0gMDtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBpbmZvID0gXCI/aWRfcHJhY3RpY2U9XCIgKyBwcmFjdGljZS5pZF9wcmFjdGljZSArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIlxyXG4gICAgICAgICsgb3JnYW5pc2F0aW9uLmlkO1xyXG4gICAgU1RBVFVTID0gMTtcclxuICB9XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcmVxdWVzdHMtYnktcHJhY3RpY2UnICsgaW5mbywgcGFyYW1zKTtcclxuICBsZXQgcmVxdWVzdHMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIGxldCBzdHVkZW50cyA9IFtdO1xyXG4gIGxldCB1cmxzID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXF1ZXN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgdXJscy5wdXNoKFwiL2V4aXN0LXJlcXVlc3Q/aWRfcmVxdWVzdD1cIiArIHJlcXVlc3RzW2ldLmlkX3JlcXVlc3RcclxuICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIlxyXG4gICAgICAgICsgb3JnYW5pc2F0aW9uLmlkKTtcclxuICB9XHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgKVxyXG4gIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApKVxyXG4gIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgY29uc3QgcmVzTGVuZ3RoID0gcmVzdWx0cy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChyZXN1bHRzW2ldICE9PSAnTm90IGZvdW5kJykge1xyXG4gICAgICAgIGlmIChyZXN1bHRzW2ldLmlkX3N0YXR1cyA9PT0gU1RBVFVTKSB7XHJcbiAgICAgICAgICBzdHVkZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgaWRfcmVxdWVzdDogcmVzdWx0c1tpXS5pZF9yZXF1ZXN0LFxyXG4gICAgICAgICAgICBpZF9vcmdhbmlzYXRpb246IHJlc3VsdHNbaV0uaWRfb3JnYW5pc2F0aW9uLFxyXG4gICAgICAgICAgICBpZF9zdGF0dXM6IHJlc3VsdHNbaV0uaWRfc3RhdHVzLFxyXG4gICAgICAgICAgICB1aWRfc3R1ZGVudDogcmVxdWVzdHNbaV0udWlkX3N0dWRlbnQsXHJcbiAgICAgICAgICAgIGlkX3ByYWN0aWNlOiByZXF1ZXN0c1tpXS5pZF9wcmFjdGljZSxcclxuICAgICAgICAgICAgaWRfcmV2aWV3OiByZXF1ZXN0c1tpXS5pZF9yZXZpZXcsXHJcbiAgICAgICAgICAgIGRhdGVfY3JlYXRpb246IHJlc3VsdHNbaV0uZGF0ZV9jcmVhdGlvblxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHN0dWRlbnRzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbkJ5TmFtZSA9IGFzeW5jIGZ1bmN0aW9uIChuYW1lT3JnYW5pc2F0aW9uKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgaW5mbyA9ICc/bmFtZT0nICsgbmFtZU9yZ2FuaXNhdGlvbjtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tYnktbmFtZScgKyBpbmZvLCBwYXJhbXMpO1xyXG4gIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIHJldHVybiBvcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0RGV0ZXJtaW5lZEdyb3VwcyA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZEdyb3Vwcykge1xyXG4gIGxldCBkZXRlcm1pbmVkR3JvdXBzID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICBkZXRlcm1pbmVkR3JvdXBzLnB1c2godGhpcy5Hcm91cHNbaV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBkZXRlcm1pbmVkR3JvdXBzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZU9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tY3JlYXRlJywge1xyXG4gICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgIH0sXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvcmdhbmlzYXRpb24pXHJcbiAgfSlcclxuICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0L7RgNCz0LDQvdC40LfQsNGG0LjQuCDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZU9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tdXBkYXRlJywge1xyXG4gICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgIH0sXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvcmdhbmlzYXRpb24pXHJcbiAgfSlcclxuICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0L7RgNCz0LDQvdC40LfQsNGG0LjQuCDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZVByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJhY3RpY2UnLCB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByYWN0aWNlKVxyXG4gIH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INC/0YDQsNC60YLQuNC60Lgg0LIg0JHQlCBcIiArIGVycm9yKTtcclxuICB9KTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVPclVwZGF0ZVN0dWRlbnRzID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvc3R1ZGVudHMnLCB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHN0dWRlbnRzKVxyXG4gIH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4IHVpZCDRgdGC0YPQtNC10L3RgtC+0LIg0LIg0JHQlCBcIiArIGVycm9yKTtcclxuICB9KTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICB2YXIgY3VycmVudERhdGUgPSBkYXRlLmZvcm1hdChcInl5eXktbW0tZGRcIik7XHJcbiAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdFxyXG4gICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uICsgXCImaWRfc3RhdHVzPVwiXHJcbiAgICAgICsgc3R1ZGVudC5pZF9zdGF0dXMgKyBcIiZkYXRlX2NyZWF0aW9uPVwiXHJcbiAgICAgICsgY3VycmVudERhdGU7XHJcbiAgYXdhaXQgZmV0Y2goJy91cGRhdGUtcmVxdWVzdC1vcmdhbmlzYXRpb24nICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0c09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50cykge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgbGV0IHVybHMgPSBbXTtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgdmFyIGN1cnJlbnREYXRlID0gZGF0ZS5mb3JtYXQoXCJ5eXl5LW1tLWRkXCIpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0XHJcbiAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb24gKyBcIiZpZF9zdGF0dXM9XCJcclxuICAgICAgICArIHN0dWRlbnRzW2ldLmlkX3N0YXR1cyArIFwiJmRhdGVfY3JlYXRpb249XCJcclxuICAgICAgICArIGN1cnJlbnREYXRlO1xyXG4gICAgdXJscy5wdXNoKCcvdXBkYXRlLXJlcXVlc3Qtb3JnYW5pc2F0aW9uJyArIGluZm8pO1xyXG4gIH1cclxuXHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwodXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSkpO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RPcmdhbmlzYXRpb25CeVJlcXVlc3QgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudCkge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcblxyXG4gIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3QgKyBcIiZpZF9zdGF0dXM9XCJcclxuICAgICAgKyBzdHVkZW50LmlkX3N0YXR1cyArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uO1xyXG4gIGF3YWl0IGZldGNoKCcvdXBkYXRlLXJlcXVlc3Qtb3JnYW5pc2F0aW9uLWJ5LXJlcXVlc3QnICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RzT3JnYW5pc2F0aW9uQnlSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgdXJscyA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0XHJcbiAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb24gKyBcIiZpZF9zdGF0dXM9XCJcclxuICAgICAgICArIHN0dWRlbnRzW2ldLmlkX3N0YXR1cztcclxuICAgIHVybHMucHVzaCgnL3VwZGF0ZS1yZXF1ZXN0LW9yZ2FuaXNhdGlvbi1ieS1yZXF1ZXN0JyArIGluZm8pO1xyXG4gIH1cclxuICBhd2FpdCBQcm9taXNlLmFsbCh1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsLCBwYXJhbXMpLmNhdGNoKGVyciA9PiBlcnIpKSk7XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS5pbnNlcnRSZXF1ZXN0T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICB2YXIgY3VycmVudERhdGUgPSBkYXRlLmZvcm1hdChcInl5eXktbW0tZGRcIik7XHJcbiAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdCArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIlxyXG4gICAgICArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uICsgXCImaWRfc3RhdHVzPVwiICsgc3R1ZGVudC5pZF9zdGF0dXNcclxuICAgICAgKyBcIiZkYXRlX2NyZWF0aW9uPVwiXHJcbiAgICAgICsgY3VycmVudERhdGU7XHJcbiAgYXdhaXQgZmV0Y2goJy9pbnNlcnQtcmVxdWVzdC1vcmdhbmlzYXRpb24nICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBpbmZvID0gMDtcclxuICBpZiAoc3R1ZGVudC5pZF9zdGF0dXMgPT09IFJFSkVDVEVEKSB7XHJcbiAgICBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3RcclxuICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1udWxsXCI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0XHJcbiAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50LmlkX29yZ2FuaXNhdGlvbjtcclxuICB9XHJcbiAgYXdhaXQgZmV0Y2goJy91cGRhdGUtcmVxdWVzdCcgKyBpbmZvLCBwYXJhbXMpO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlUmVxdWVzdHMgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudHMpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBpbmZvID0gMDtcclxuICBsZXQgdXJscyA9IFtdO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgaW5mbyA9IDA7XHJcbiAgICBpZiAoc3R1ZGVudHNbaV0uaWRfc3RhdHVzID09PSBSRUpFQ1RFRCkge1xyXG4gICAgICBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0XHJcbiAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1udWxsXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb247XHJcbiAgICB9XHJcbiAgICB1cmxzLnB1c2goJy91cGRhdGUtcmVxdWVzdCcgKyBpbmZvKTtcclxuICB9XHJcblxyXG4gIGF3YWl0IFByb21pc2UuYWxsKHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZW5lcmF0ZURvY3VtZW50ID0gYXN5bmMgZnVuY3Rpb24gKGRvY3VtZW50LCB0eXBlX2RvY3VtZW50LCB0eXBlX3ByYWN0aWNlKSB7XHJcbiAgICB0eXBlX3ByYWN0aWNlPSB0eXBlX3ByYWN0aWNlLnRvTG93ZXJDYXNlKCk7XHJcbiAgbGV0IGluZm9ybWF0aW9uPXtcclxuICAgIGRhdGE6IGRvY3VtZW50LFxyXG4gICAgICB0eXBlX2RvY3VtZW50OiB0eXBlX2RvY3VtZW50LFxyXG4gICAgICB0eXBlX3ByYWN0aWNlOiB0eXBlX3ByYWN0aWNlXHJcbiAgfTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL2RvY3VtZW50Jywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoaW5mb3JtYXRpb24pXHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3ApIHtcclxuICAgICAgICByZXR1cm4gcmVzcC5ibG9iKCk7XHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uKGJsb2IpIHtcclxuICAgICAgICBzYXZlQXMoYmxvYiwgdHlwZV9kb2N1bWVudCsnICcrdHlwZV9wcmFjdGljZSsnINC/0YDQsNC60YLQuNC60LAgJytkb2N1bWVudC5ncm91cF9uYW1lK1wiLmRvY3hcIik7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INCz0LXQvdC10YDQsNGG0LjQuCDQtNC+0LrRg9C80LXQvdGC0LAgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICBkZWJ1Z2dlcjtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDtcclxuXHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL01vZGVsLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLmNzc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tY29sb3JzLmNzc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tcmVzcG9uc2l2ZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9saWJzL0RhdGFUYWJsZXMvZGF0YXRhYmxlcy5taW4uY3NzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9zdHlsZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFiQTtBQWVBO0FBakJBO0FBdUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVkE7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWQTtBQVlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZkE7QUFpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNydUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFXQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQ0E7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDNXZCQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7O0EiLCJzb3VyY2VSb290IjoiIn0=
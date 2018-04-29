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
    this.View.init();
    await this.Model.init();
    this.View.OpenOrCloseLoadImage();
};
Controller.prototype.showDialogGenerateDocument = async function () {
    this.View.dialogOpen("#dialogGenerateReport");
    let selectedGroups = this.View.getSelectedGroups();
    this.View.createInputs("order-block", selectedGroups);
};
Controller.prototype.generateDocument = async function () {
    let selectedGroups = this.View.getSelectedGroups();
    let info_about_practice = this.View.getUserInfoAboutPractice();
    let practice = await this.Model.getPractice(info_about_practice);
    let information = this.View.getInformationForDocument(selectedGroups, this.Model.Groups);
    this.Model.generateDocument(practice, information);
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

function removeChildren(node) {
    var children = node.childNodes;
    while (children.length) {
        node.removeChild(children[0]);
    }
}

View.prototype.clearGroupsTreeView = async function () {
    var id = 0;
    while (id < this.idTreeViews.length) {
        var liArray = document.getElementById(this.idTreeViews[id]).children[0].children;
        for (let i = 0; i < liArray.length; i++) {
            removeChildren(liArray[i].getElementsByTagName('ul')[0]);
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
        removeChildren(liArray[i].getElementsByTagName('ul')[0]);
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
    removeChildren(typeOrg);
    for (let i = 0; i < typesOrganisation.length; i++) {
        let option = document.createElement('option');
        option.setAttribute("value", typesOrganisation[i].id);
        option.innerHTML = typesOrganisation[i].name;
        typeOrg.appendChild(option);
    }
};
View.prototype.setOrganisationsList = function (organisations, idList) {
    let listOrg = document.getElementById(idList);
    removeChildren(listOrg);
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
    removeChildren(listStudents);
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

View.prototype.createInputs = function (idBlock, selectedGroups) {
    let parent = document.getElementById(idBlock);
    removeChildren(parent);
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
View.prototype.getInformationForDocument = function (selectedGroups, allGroups) {
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
    let information = {
        "type_document": type_document,
        "dean": dean,
        "head_of_department": head_of_department,
        "groups": groupsForDocument
    };
    return information;
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

Model.prototype.generateDocument = async function (practice, information) {
  information['start_date_practice'] = practice.start_date;
  information['end_date_practice'] = practice.end_date;
  information['year'] = practice.year;
  let result = await fetch('/document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(information)
  }).catch(function (error) {
    alert("Ошибка при добавлении практики в БД " + error);
  });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDlhYTM2Y2Y5OTNmZWE2NzE5ZmM1Iiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9saWJzL0RhdGFUYWJsZXMvZGF0YXRhYmxlcy5taW4uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA5YWEzNmNmOTkzZmVhNjcxOWZjNSIsImNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlICgnLi9Db250cm9sbGVyLmpzJyk7XHJcblxyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzJyk7XHJcbnJlcXVpcmUoJy4vbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcycpO1xyXG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgbmV3IENvbnRyb2xsZXIoKTtcclxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9tYWluLmpzIiwiY29uc3QgVmlldyA9IHJlcXVpcmUoJy4vVmlldy5qcycpO1xyXG5jb25zdCBNb2RlbCA9IHJlcXVpcmUoJy4vTW9kZWwuanMnKTtcclxuXHJcbmZ1bmN0aW9uIENvbnRyb2xsZXIoKSB7XHJcbiAgICB0aGlzLlZpZXcgPSBuZXcgVmlldygpO1xyXG4gICAgdGhpcy5Nb2RlbCA9IG5ldyBNb2RlbCgpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbn1cclxuXHJcbmNvbnN0IEFQUFJPVkVEID0gMTtcclxuY29uc3QgUkVKRUNURUQgPSAyO1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5pbml0ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgICBhd2FpdCB0aGlzLnNldFllYXJzKCk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja05leHRTdGVwID0gdGhpcy5kaXNwbGF5R3JvdXBzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZVByYWN0aWNlID0gdGhpcy5nb1RvUHJhY3RpY2VDcmVhdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tBZGRQcmFjdGljZSA9IHRoaXMuY3JlYXRlUHJhY3RpY2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IHRoaXMuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uLmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uID0gdGhpcy5nb1RvU3R1ZGVudHNTZWN0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0ZpbmlzaEJ0biA9IHRoaXMuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rID0gdGhpcy5yZW5kZXJEYXRhSW5UYWJsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tZZWFyc0FycmF5ID0gdGhpcy5zZXRHcm91cHNUcmVlVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tHZXRPcmdhbmlzYXRpb25zID0gdGhpcy5nZXRPcmdhbmlzYXRpb25zLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbiA9IHRoaXMudXBkYXRlVHJlZVZpZXcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrRGlzcGxheUluZm9BYm91dE9yZyA9IHRoaXMuZGlzcGxheUluZm9BYm91dE9yZy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tEaXNwbGF5T3JnYW5pc2F0aW9ucyA9IHRoaXMuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uLmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0VkaXRPcmdhbmlzYXRpb24gPSB0aGlzLnNob3dEaWFsb2dFZGl0T3JnYW5pc2F0aW9uLmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1VwZGF0ZU9yZ2FuaXNhdGlvbiA9IHRoaXMudXBkYXRlT3JnYW5pc2F0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0FwcHJvdmVTdHVkZW50ID0gdGhpcy5jaGFuZ2VTdHVkZW50U3RhdHVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1JlamVjdFN0dWRlbnQgPSB0aGlzLmNoYW5nZVN0dWRlbnRTdGF0dXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZyA9IHRoaXMuYWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZy5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tBZGRTdHVkZW50VG9PcmdhbmlzYXRpb24gPSB0aGlzLmFkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbi5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tTaG93RGlhbG9nR2VuZXJhdGVEb2N1bWVudCA9IHRoaXMuc2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQuYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrR2VuZXJhdGVEb2N1bWVudCA9IHRoaXMuZ2VuZXJhdGVEb2N1bWVudC5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3LmluaXQoKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwuaW5pdCgpO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbn07XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnNob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmRpYWxvZ09wZW4oXCIjZGlhbG9nR2VuZXJhdGVSZXBvcnRcIik7XHJcbiAgICBsZXQgc2VsZWN0ZWRHcm91cHM9dGhpcy5WaWV3LmdldFNlbGVjdGVkR3JvdXBzKCk7XHJcbiAgICB0aGlzLlZpZXcuY3JlYXRlSW5wdXRzKCBcIm9yZGVyLWJsb2NrXCIsc2VsZWN0ZWRHcm91cHMpO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZW5lcmF0ZURvY3VtZW50ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHNlbGVjdGVkR3JvdXBzPXRoaXMuVmlldy5nZXRTZWxlY3RlZEdyb3VwcygpO1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgbGV0IGluZm9ybWF0aW9uPXRoaXMuVmlldy5nZXRJbmZvcm1hdGlvbkZvckRvY3VtZW50KHNlbGVjdGVkR3JvdXBzLCB0aGlzLk1vZGVsLkdyb3Vwcyk7XHJcbiAgICB0aGlzLk1vZGVsLmdlbmVyYXRlRG9jdW1lbnQocHJhY3RpY2UsIGluZm9ybWF0aW9uKTtcclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUuYWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25QcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICAgIGxldCB1aWRzR3JvdXBzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRHcm91cHNCeVByYWN0aWNlSWQocHJhY3RpY2UpO1xyXG4gICAgbGV0IG5hbWVzR3JvdXBzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRHcm91cHNOYW1lQnlHcm91cHNVSUQodWlkc0dyb3Vwcyk7XHJcbiAgICB0aGlzLlZpZXcuZGlhbG9nRW5hYmxlQ2hlY2tib3hlcyhuYW1lc0dyb3VwcyxcclxuICAgICAgICBcImdyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWRpYWxvZ0FkZC1iYWNoZWxvclwiKTtcclxuICAgIHRoaXMuVmlldy5kaWFsb2dFbmFibGVDaGVja2JveGVzKG5hbWVzR3JvdXBzLFxyXG4gICAgICAgIFwiZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItZGlhbG9nQWRkLW1hc3RlclwiKTtcclxuICAgIHRoaXMuVmlldy5kaWFsb2dPcGVuKFwiI2RpYWxvZ0FkZFN0dWRlbnRcIik7XHJcbn07XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmFkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzdHVkZW50cyA9IGF3YWl0IHRoaXMuVmlldy5nZXRTZWxlY3RlZFN0dWRlbnRzKGV2ZW50KTtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25QcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldE5hbWVPcmdhbmlzYXRpb25JblRyZWV2aWV3KFxyXG4gICAgICAgIFwib3JnYW5pc2F0aW9uTGlzdFwiKTtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbkJ5TmFtZShuYW1lT3JnYW5pc2F0aW9uKTtcclxuICAgIGxldCByZXF1ZXN0cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdEJ5U3R1ZGVudFVJRFMocHJhY3RpY2UsXHJcbiAgICAgICAgc3R1ZGVudHMpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcmVxdWVzdHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKHN0dWRlbnRzW2ldLnVpZCA9PT0gcmVxdWVzdHNbal0udWlkX3N0dWRlbnQpIHtcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRzW2ldWydpZF9yZXF1ZXN0J10gPSByZXF1ZXN0c1tqXS5pZF9yZXF1ZXN0O1xyXG4gICAgICAgICAgICAgICAgc3R1ZGVudHNbaV1bJ2lkX3ByYWN0aWNlJ10gPSBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRzW2ldWydpZF9vcmdhbmlzYXRpb24nXSA9IG9yZ2FuaXNhdGlvbi5pZDtcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRzW2ldWydpZF9zdGF0dXMnXSA9IEFQUFJPVkVEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0c09yZ2FuaXNhdGlvbihzdHVkZW50cyk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RzKHN0dWRlbnRzKTtcclxuXHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN0dWRlbnRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgc3R1ZGVudHNbal1bJ2lkX3N0YXR1cyddID0gUkVKRUNURUQ7XHJcbiAgICB9XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RzT3JnYW5pc2F0aW9uQnlSZXF1ZXN0KHN0dWRlbnRzKTtcclxuICAgIGF3YWl0IHRoaXMuZ2V0QXBwcm92ZWRBbmROb25BcHByb3ZlZFN0dWRlbnRzKG9yZ2FuaXNhdGlvbik7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5zZXRZZWFycyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCB5ZWFycyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2VZZWFycygpO1xyXG4gICAgdGhpcy5WaWV3LnNldFllYXJzQXJyYXkoeWVhcnMpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0KHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zTGlzdChvcmdhbmlzYXRpb25zLCBcImFsbE9yZ2FuaXNhdGlvbnNMaXN0XCIpO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nb1RvU3R1ZGVudHNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmdvVG9TdHVkZW50c1NlY3Rpb24oKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9QcmFjdGljZUNyZWF0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcclxuICAgIHRoaXMuVmlldy5jbGVhclByYWN0aWNlU2VjdGlvbigpO1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0KHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5nb1RvUHJhY3RpY2VDcmVhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LmNsZWFyVHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvbih0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xyXG4gICAgdGhpcy5WaWV3LnNldE9yZ2FuaXNhdGlvbnNJblRyZWVWaWV3KG9yZ2FuaXNhdGlvbnMsIHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHJldHVybiB0eXBlc09yZ2FuaXNhdGlvbjtcclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRJbmZvTmV3T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZU9yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb24pO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5zaG93RGlhbG9nRWRpdE9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IGlkT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldElkT3JnYW5pc2F0aW9uKGV2ZW50KTtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbkJ5SWQoaWRPcmdhbmlzYXRpb24pO1xyXG4gICAgdGhpcy5WaWV3LnNob3dEaWFsb2dPcmdhbmlzYXRpb24ob3JnYW5pc2F0aW9uKTtcclxufTtcclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5kaXNwbGF5R3JvdXBzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmRpc3BsYXlHcm91cHMoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCgpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuY3JlYXRlTmV3T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRJbmZvTmV3T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmNyZWF0ZU9yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb24pO1xyXG5cclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBhd2FpdCB0aGlzLmNyZWF0ZU5ld09yZ2FuaXNhdGlvbigpO1xyXG4gICAgYXdhaXQgdGhpcy51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5jcmVhdGVQcmFjdGljZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gdGhpcy5WaWV3LlByYWN0aWNlO1xyXG4gICAgbGV0IGdyb3VwcyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0RGV0ZXJtaW5lZEdyb3VwcyhwcmFjdGljZS5ncm91cHMpO1xyXG4gICAgcHJhY3RpY2UuZ3JvdXBzID0gZ3JvdXBzO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5jcmVhdGVQcmFjdGljZShwcmFjdGljZSk7XHJcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkSW1hZ2UoKTtcclxuICAgIHRoaXMuZ29Ub1N0dWRlbnRzU2VjdGlvbigpO1xyXG59O1xyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNUVURFTlRTIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlckdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5kaXN0cmlidXRlR3JvdXBzQnlDb3Vyc2VzKHRoaXMuVmlldy5zZWxlY3RlZFllYXIpO1xyXG4gICAgYXdhaXQgdGhpcy5WaWV3LmNsZWFyR3JvdXBzVHJlZVZpZXcoKTtcclxuICAgIGF3YWl0IHRoaXMuVmlldy51cGRhdGVHcm91cHNUcmVlVmlldyh0aGlzLk1vZGVsLkNvdXJzZXMsIHRoaXMuTW9kZWwuR3JvdXBzKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldEdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB0aGlzLlZpZXcudXBkYXRlWWVhcihldmVudCk7XHJcbiAgICBpZiAodGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9PT0gXCIrXCIpIHtcclxuICAgICAgICB0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID0gdGhpcy5Nb2RlbC5nZXRDdXJyZW50WWVhcigpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZ29Ub1ByYWN0aWNlQ3JlYXRpb24oKTtcclxuICAgIH1cclxuICAgIGF3YWl0IHRoaXMucmVuZGVyR3JvdXBzVHJlZVZpZXcoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlckRhdGFJblRhYmxlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgICBsZXQgc2VsZWN0ZWRHcm91cHMgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRHcm91cHMoKTtcclxuICAgIGxldCBncm91cHNPYmplY3RzID0gW107XHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRVc2VySW5mb0Fib3V0UHJhY3RpY2UoKTtcclxuICAgIGxldCBwcmFjdGljZSA9IFtdLCBkYXRhID0gMDtcclxuXHJcbiAgICBpZiAoc2VsZWN0ZWRHcm91cHMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLk1vZGVsLkdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLk1vZGVsLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cHNPYmplY3RzLnB1c2godGhpcy5Nb2RlbC5Hcm91cHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGdyb3Vwc1ByYWN0aWNlUGFydGljaXBhbnRzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRHcm91cHNCeVByYWN0aWNlSWQoXHJcbiAgICAgICAgICAgICAgICBwcmFjdGljZSk7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkR3JvdXBzID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzUHJhY3RpY2VQYXJ0aWNpcGFudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzT2JqZWN0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgrZ3JvdXBzUHJhY3RpY2VQYXJ0aWNpcGFudHNbaV0udWlkX2dyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID09PSBncm91cHNPYmplY3RzW2pdLnVpZF9MREFQKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkR3JvdXBzLnB1c2goZ3JvdXBzT2JqZWN0c1tqXS5uYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnM7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzKHByYWN0aWNlLCBncm91cHNPYmplY3RzKTtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuTW9kZWwuYXNzb3NpYXRlUmVxdWVzdFRvU3R1ZGVudChyZXF1ZXN0cywgc2VsZWN0ZWRHcm91cHMpO1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdHNPcmdhbmlzYXRpb25zKFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkR3JvdXBzKTtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCB0aGlzLk1vZGVsLmdldERhdGEoc2VsZWN0ZWRHcm91cHMsIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJhY3RpY2UgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGRhdGEgPSAwO1xyXG4gICAgICAgIHRoaXMuVmlldy5yZW5kZXJUYWJsZShkYXRhKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMuVmlldy5yZW5kZXJUYWJsZShkYXRhKTtcclxuICAgIH1cclxuICAgIHRoaXMuVmlldy5jb2xvclRhYmxlKGRhdGEpO1xyXG4gICAgdGhpcy5WaWV3LnJlbmRlckluZm8ocHJhY3RpY2UpO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbn07XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1PUkdBTklTQVRJT05TIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRBcHByb3ZlZEFuZE5vbkFwcHJvdmVkU3R1ZGVudHMgPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UoKTtcclxuICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XHJcbiAgICBsZXQgYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9IDAsIG5vbl9hcHByb3ZlZF9zdHVkZW50X2NvdW50ID0gMDtcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBhcHByb3ZlZF9zdHVkZW50X2NvdW50ID0gYXdhaXQgdGhpcy5yZW5kZXJTdHVkZW50TGlzdChvcmdhbmlzYXRpb24sXHJcbiAgICAgICAgICAgIHByYWN0aWNlLCBcImFwcHJvdmVkU3R1ZGVudHNcIik7XHJcbiAgICAgICAgbm9uX2FwcHJvdmVkX3N0dWRlbnRfY291bnQgPSBhd2FpdCB0aGlzLnJlbmRlclN0dWRlbnRMaXN0KG9yZ2FuaXNhdGlvbixcclxuICAgICAgICAgICAgcHJhY3RpY2UsIFwibm9uQXBwcm92ZWRTdHVkZW50c1wiKTtcclxuICAgIH1cclxuICAgIHRoaXMuVmlldy51cGRhdGVPcmdhbmlzYXRpb25UaXRsZShvcmdhbmlzYXRpb24ubmFtZSwgYXBwcm92ZWRfc3R1ZGVudF9jb3VudCxcclxuICAgICAgICBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5kaXNwbGF5SW5mb0Fib3V0T3JnID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZE9yZ2FuaXNhdGlvbihldmVudCk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25CeU5hbWUobmFtZU9yZ2FuaXNhdGlvbik7XHJcbiAgICBhd2FpdCB0aGlzLmdldEFwcHJvdmVkQW5kTm9uQXBwcm92ZWRTdHVkZW50cyhvcmdhbmlzYXRpb24pO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyU3R1ZGVudExpc3QgPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uLCBwcmFjdGljZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRMaXN0KSB7XHJcbiAgICBsZXQgc3RhdHVzO1xyXG4gICAgaWYgKGlkTGlzdCA9PT0gXCJhcHByb3ZlZFN0dWRlbnRzXCIpIHtcclxuICAgICAgICBzdGF0dXMgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc3RhdHVzID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBsZXQgc3R1ZGVudHNJbmZvID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRSZXF1ZXN0c0J5T3JnYW5pc2F0aW9uTmFtZShcclxuICAgICAgICBvcmdhbmlzYXRpb24sIHByYWN0aWNlLCBzdGF0dXMpO1xyXG4gICAgbGV0IHN0dWRlbnRzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRTdHVkZW50c0J5VUlEKHN0dWRlbnRzSW5mbyk7XHJcbiAgICB0aGlzLlZpZXcudXBkYXRlU3R1ZGVudHNMaXN0VmlldyhzdHVkZW50cywgaWRMaXN0KTtcclxuICAgIHJldHVybiBzdHVkZW50cy5sZW5ndGg7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0Q29uZmlndXJhdGlvblByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbnMgPSAwO1xyXG4gICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIG9yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbnNCeVByYWN0aWNlSWQocHJhY3RpY2UpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5WaWV3LnNldE9yZ2FuaXNhdGlvbnNMaXN0KG9yZ2FuaXNhdGlvbnMsIFwib3JnYW5pc2F0aW9uTGlzdFwiKTtcclxuICAgIHRoaXMuVmlldy5yZW5kZXJPcmdhbmlzYXRpb25TZWN0aW9uKHByYWN0aWNlKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldE5hbWVPcmdhbmlzYXRpb25CeVRpdGxlKCk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25CeU5hbWUobmFtZU9yZ2FuaXNhdGlvbik7XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuY2hhbmdlU3R1ZGVudFN0YXR1cyA9IGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgICBsZXQgc3R1ZGVudCA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZFN0dWRlbnQoZXZlbnQpO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0T3JnYW5pc2F0aW9uKHN0dWRlbnQpO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0KHN0dWRlbnQpO1xyXG5cclxuICAgIHN0dWRlbnRbJ2lkX3N0YXR1cyddID0gUkVKRUNURUQ7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RPcmdhbmlzYXRpb25CeVJlcXVlc3Qoc3R1ZGVudCk7XHJcblxyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuZ2V0T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLmdldEFwcHJvdmVkQW5kTm9uQXBwcm92ZWRTdHVkZW50cyhvcmdhbmlzYXRpb24pO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9Db250cm9sbGVyLmpzIiwiY29uc3QgYmFjaGVsb3JZZWFyID0gNDtcclxuY29uc3QgbWFzdGVyWWVhciA9IDY7XHJcbmxldCBzZWxlY3RlZEVsZW0gPSAwO1xyXG5cclxudmFyIFZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmluZm9Hcm91cHMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQnNCe0JBcIixcclxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjAyLjAzLjAzIMKr0JzQsNGC0LXQvNCw0YLQuNGH0LXRgdC60L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INC4INCw0LTQvNC40L3QuNGB0YLRgNC40YDQvtCy0LDQvdC40LUg0LjQvdGE0L7RgNC80LDRhtC40L7QvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Ci0LXRhdC90L7Qu9C+0LPQuNGPINC/0YDQvtCz0YDQsNC80LzQuNGA0L7QstCw0L3QuNGPwrtcIixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYmFjaGVsb3JcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQn9Cg0JhcIixcclxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjAzLjA0IMKr0J/RgNC+0LPRgNCw0LzQvNC90LDRjyDQuNC90LbQtdC90LXRgNC40Y/Cu1wiLFxyXG4gICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Cg0LDQt9GA0LDQsdC+0YLQutCwINC/0YDQvtCz0YDQsNC80LzQvdC+LdC40L3RhNC+0YDQvNCw0YbQuNC+0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYmFjaGVsb3JcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQmNCS0KItMVwiLFxyXG4gICAgICAgICAgICBcImZ1bGxOYW1lXCI6IFwiMDkuMDMuMDEgwqvQmNC90YTQvtGA0LzQsNGC0LjQutCwINC4INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdCw0Y8g0YLQtdGF0L3QuNC60LDCu1wiLFxyXG4gICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Cf0YDQvtCz0YDQsNC80LzQvdC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QvtC5INGC0LXRhdC90LjQutC4INC4INCw0LLRgtC+0LzQsNGC0LjQt9C40YDQvtCy0LDQvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJiYWNoZWxvclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcItCY0JLQoi0yXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wMy4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXHJcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0JjQktCiLTNcIixcclxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQn9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90L7QuSDRgtC10YXQvdC40LrQuCDQuCDQsNCy0YLQvtC80LDRgtC40LfQuNGA0L7QstCw0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYmFjaGVsb3JcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQn9Cg0JggKNC80LMpXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wNC4wNCDCq9Cf0YDQvtCz0YDQsNC80LzQvdCw0Y8g0LjQvdC20LXQvdC10YDQuNGPwrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQn9GA0L7QtdC60YLQuNGA0L7QstCw0L3QuNC1INC/0YDQvtCz0YDQsNC80LzQvdC+LdC40L3RhNC+0YDQvNCw0YbQuNC+0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWFzdGVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0JjQktCiLTEgKNC80LMpXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wNC4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXHJcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0JrQvtC80L/RjNGO0YLQtdGA0L3Ri9C5INCw0L3QsNC70LjQtyDQuCDQuNC90YLQtdGA0L/RgNC10YLQsNGG0LjRjyDQtNCw0L3QvdGL0YXCu1wiLFxyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJtYXN0ZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQmNCS0KItMiAo0LzQsylcIixcclxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjA0LjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQmNC90YTQvtGA0LzQsNGG0LjQvtC90L3QvtC1INC4INC/0YDQvtCz0YDQsNC80LzQvdC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1hc3RlclwiXHJcbiAgICAgICAgfVxyXG4gICAgXTtcclxuICAgIHRoaXMub25DbGlja05leHRTdGVwID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1ByYWN0aWNlQ29tcGxldGVkID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0NyZWF0ZVByYWN0aWNlID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0FkZFByYWN0aWNlID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrRmluaXNoQnRuID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1NlbGVjdEdyb3VwQnRuT2sgPSBudWxsO1xyXG4gICAgdGhpcy5teVRhYmxlID0gJCgnI3N0dWRlbnRzTGlzdFRhYmxlJyk7XHJcbiAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5ID0gbnVsbDtcclxuICAgIHRoaXMuc2VsZWN0ZWRZZWFyID0gbnVsbDtcclxuICAgIHRoaXMuaWRUcmVlVmlld3MgPSBbXHJcbiAgICAgICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWJhY2hlbG9yJyxcclxuICAgICAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItbWFzdGVyJyxcclxuICAgICAgICAnZ3JvdXBzLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uLWJhY2hlbG9yJyxcclxuICAgICAgICAnZ3JvdXBzLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uLW1hc3RlcicsXHJcbiAgICAgICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWRpYWxvZ0FkZC1iYWNoZWxvcicsXHJcbiAgICAgICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wyLWRpYWxvZ0FkZC1tYXN0ZXInXHJcbiAgICBdO1xyXG4gICAgdGhpcy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tDcmVhdGVPcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrRGlzcGxheUluZm9BYm91dE9yZyA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5T3JnYW5pc2F0aW9ucyA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tFZGl0T3JnYW5pc2F0aW9uID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0FwcHJvdmVTdHVkZW50ID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1JlamVjdFN0dWRlbnQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrVXBkYXRlT3JnYW5pc2F0aW9uID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvblNob3dEaWFsb2cgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1Nob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50ID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0dlbmVyYXRlRG9jdW1lbnQgPSBudWxsO1xyXG4gICAgdGhpcy5QcmFjdGljZSA9IG51bGw7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1uZXh0XCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tOZXh0U3RlcCk7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RpYWxvZ1ByYWN0aWNlQ29tcGxldGVTdWNjZXNzXCIpLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgXCIjcHJhY3RpY2VGaW5pc2hlZE9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tQcmFjdGljZUNvbXBsZXRlZCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ2FuaXNhdGlvbnNTZWN0aW9uQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tUb09yZ2FuaXNhdGlvbnNTZWN0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3R1ZGVudHNTZWN0aW9uQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLWZpbmlzaFwiKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrRmluaXNoQnRuKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2V0R3JvdXBzQnRuT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1NlbGVjdEdyb3VwQnRuT2spO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25zQXJyYXlcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1llYXJzQXJyYXkpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25zQXJyYXkxXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2V0T3JnYW5pc2F0aW9uc0J0bk9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tHZXRPcmdhbmlzYXRpb25zKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlT3JnYW5pc2F0aW9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tDcmVhdGVPcmdhbmlzYXRpb24pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmFjdGljZUZpbmlzaGVkT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0FkZFByYWN0aWNlKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvd0FsbE9yZ2FuaXNhdGlvbnNcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0Rpc3BsYXlPcmdhbmlzYXRpb25zKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXBkYXRlT3JnYW5pc2F0aW9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tVcGRhdGVPcmdhbmlzYXRpb24pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGRTdHVkZW50QnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tBZGRTdHVkZW50VG9PcmdhbmlzYXRpb24pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaG93RGlhbG9nR2VuZXJhdGVEb2N1bWVudEJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrU2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZW5lcmF0ZURvY3VtZW50QnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tHZW5lcmF0ZURvY3VtZW50KTtcclxuXHJcbiAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKHtcclxuICAgICAgICBkYXRhOiB0aGlzLkdyb3VwcyxcclxuICAgICAgICBcImxhbmd1YWdlXCI6IHtcclxuICAgICAgICAgICAgXCJ6ZXJvUmVjb3Jkc1wiOiBcItCi0LDQutC+0Lkg0LfQsNC/0LjRgdC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCIsXHJcbiAgICAgICAgICAgIFwiZW1wdHlUYWJsZVwiOiBcItCd0Lgg0L7QtNC90LAg0LjQtyDQs9GA0YPQv9C/INC90LUg0LLRi9Cx0YDQsNC90LAg0LvQuNCx0L4g0L/RgNCw0LrRgtC40LrQuCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiLFxyXG4gICAgICAgICAgICBcInNlYXJjaFwiOiBcItCf0L7QuNGB0Lo6XCIsXHJcbiAgICAgICAgICAgIFwicGFnaW5hdGVcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJmaXJzdFwiOiBcItCf0LXRgNCy0YvQuVwiLFxyXG4gICAgICAgICAgICAgICAgXCJsYXN0XCI6IFwi0J/QvtGB0LvQtdC00L3QuNC5XCIsXHJcbiAgICAgICAgICAgICAgICBcIm5leHRcIjogXCLQktC/0LXRgNC10LRcIixcclxuICAgICAgICAgICAgICAgIFwicHJldmlvdXNcIjogXCLQndCw0LfQsNC0XCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJpbmZvRmlsdGVyZWRcIjogXCIo0LjQtyBfTUFYXyDRgdGC0YPQtNC10L3RgtC+0LIpXCIsXHJcbiAgICAgICAgICAgIFwibGVuZ3RoTWVudVwiOiBcItCf0L7QutCw0LfQsNGC0YwgX01FTlVfINC30LDQv9C40YHQtdC5XCIsXHJcbiAgICAgICAgICAgIFwiaW5mb1wiOiBcItCe0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHRgtGD0LTQtdC90YLQvtCyOiBfVE9UQUxfIFwiLFxyXG4gICAgICAgICAgICBcImluZm9FbXB0eVwiOiBcItCS0YvQsdC10YDQuNGC0LUg0LPRgNGD0L/Qv9GDLlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImNvbHVtbnNcIjogW1xyXG4gICAgICAgICAgICB7XCJkYXRhXCI6IFwiZ3JvdXBcIn0sXHJcbiAgICAgICAgICAgIHtcImRhdGFcIjogXCJzdHVkZW50XCJ9LFxyXG4gICAgICAgICAgICB7XCJkYXRhXCI6IFwib3JnYW5pc2F0aW9uXCJ9XHJcbiAgICAgICAgXVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvU3R1ZGVudHNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvcmdhbmlzYXRpb25zU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ByYWN0aWNlQ3JlYXRpb25TZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuXHJcbiAgICBsZXQgdHJlZVZpZXdzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRyZWV2aWV3XCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmVlVmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0cmVlVmlld3NbaV0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI29yZ2FuaXNhdGlvbnNTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0dWRlbnRzUmVxdWVzdHNcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGxPcmdhbmlzYXRpb25zTGlzdEJsb2NrXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVwZGF0ZU9yZ2FuaXNhdGlvblwiKS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9QcmFjdGljZUNyZWF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVwZGF0ZU9yZ2FuaXNhdGlvblwiKS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLFxyXG4gICAgICAgIFwidHJ1ZVwiKTtcclxufTtcclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09UFJBQ1RJQ0UgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5WaWV3LnByb3RvdHlwZS5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGZpbmlzaEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tZmluaXNoXCIpWzBdO1xyXG4gICAgZmluaXNoQnRuLnNldEF0dHJpYnV0ZShcIm9uY2xpY2tcIixcclxuICAgICAgICBcIm1ldHJvRGlhbG9nLm9wZW4oJyNkaWFsb2dQcmFjdGljZUNvbXBsZXRlU3VjY2VzcycpXCIpO1xyXG4gICAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVjYXRpb25cIikudmFsdWU7XHJcblxyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlXCIpLnZhbHVlO1xyXG5cclxuICAgIGxldCBsZWNOdW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY051bVwiKS52YWx1ZTtcclxuICAgIGxldCBmcm9tRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJvbURhdGVJbnB1dFwiKS52YWx1ZTtcclxuICAgIGxldCB0b0RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvRGF0ZUlucHV0XCIpLnZhbHVlO1xyXG4gICAgbGV0IGRlYWRsaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVybXNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSAnYyAnICsgZnJvbURhdGVcclxuICAgICAgICArICcg0L/QviAnICsgdG9EYXRlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGRlYWRsaW5lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBmcm9tRGF0ZVxyXG4gICAgICAgICsgJyAtICcgKyB0b0RhdGU7XHJcbiAgICBpZiAoZnJvbURhdGUgPT09IFwiXCIpIHtcclxuICAgICAgICBmcm9tRGF0ZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmcm9tRGF0ZSA9IGZyb21EYXRlLnN1YnN0cig4LCA0KSArICctJyArIGZyb21EYXRlLnN1YnN0cig0LCAyKSArICctJ1xyXG4gICAgICAgICAgICArIGZyb21EYXRlLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICAgIH1cclxuICAgIGlmICh0b0RhdGUgPT09IFwiXCIpIHtcclxuICAgICAgICB0b0RhdGUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdG9EYXRlID0gdG9EYXRlLnN1YnN0cig4LCA0KSArICctJyArIHRvRGF0ZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICAgICAgKyB0b0RhdGUuc3Vic3RyKDAsIDIpICsgJyAnICsgJzIxOjAwOjAwLjAwMCArMDA6MDAnO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlYWRsaW5lID09PSBcIlwiKSB7XHJcbiAgICAgICAgZGVhZGxpbmUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZGVhZGxpbmUgPSBkZWFkbGluZS5zdWJzdHIoOCwgNCkgKyAnLScgKyBkZWFkbGluZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICAgICAgKyBkZWFkbGluZS5zdWJzdHIoMCwgMikgKyAnICcgKyAnMjE6MDA6MDAuMDAwICswMDowMCc7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHRyZWVWaWV3ID0gbnVsbDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJwcmFjdGljZVwiKSAhPT0gLTFcclxuICAgICAgICAgICAgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheVxyXG4gICAgICAgICAgICA9PT0gXCJibG9ja1wiKSB7XHJcbiAgICAgICAgICAgIHRyZWVWaWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IGFyckdyb3VwcyA9IHRoaXMuZ2V0U2VsZWN0ZWRHcm91cHModHJlZVZpZXcpO1xyXG4gICAgbGV0IGFyck9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldFNlbGVjdGVkR3JvdXBzKFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eXBlUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJlZHVjYXRpb25hbExldmVsRGlhbG9nXCIpLmlubmVySFRNTCA9IGVkdWNhdGlvbkxldmVsO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncm91cHNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJHcm91cHM7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBcIm9yZ2FuaXNhdGlvbnNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJPcmdhbmlzYXRpb25zO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2VcclxuICAgICAgICArIFwiINC/0YDQsNC60YLQuNC60LBcIjtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY051bURpYWxvZ1wiKS5pbm5lckhUTUwgPSBsZWNOdW07XHJcbiAgICB0aGlzLlByYWN0aWNlID0ge1xyXG4gICAgICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAgICAgJ3N0YXJ0RGF0ZVByYWN0aWNlJzogZnJvbURhdGUsXHJcbiAgICAgICAgJ2VuZERhdGVQcmFjdGljZSc6IHRvRGF0ZSxcclxuICAgICAgICAnZGVhZGxpbmVQcmFjdGljZSc6IGRlYWRsaW5lLFxyXG4gICAgICAgICdsZWNOdW0nOiBsZWNOdW0sXHJcbiAgICAgICAgJ2VkdUxldmVsJzogZWR1Y2F0aW9uTGV2ZWwsXHJcbiAgICAgICAgJ29yZ2FuaXNhdGlvbnMnOiBhcnJPcmdhbmlzYXRpb25zLFxyXG4gICAgICAgICdncm91cHMnOiBhcnJHcm91cHMsXHJcbiAgICAgICAgJ3llYXInOiB0aGlzLnNlbGVjdGVkWWVhclxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5QcmFjdGljZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmRpc3BsYXlHcm91cHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdWNhdGlvblwiKS52YWx1ZTtcclxuICAgIGlmIChlZHVjYXRpb25MZXZlbCA9PT0gXCJiYWNoZWxvclwiKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcImJhY2hlbG9yXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcIm1hc3RlclwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5jbGVhclByYWN0aWNlU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJvbURhdGVJbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvRGF0ZUlucHV0XCIpLnZhbHVlID0gXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVhZGxpbmVcIikudmFsdWUgPSBcIlwiO1xyXG59O1xyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuVmlldy5wcm90b3R5cGUucmVuZGVySW5mbyA9IGZ1bmN0aW9uIChwcmFjdGljZSkge1xyXG4gICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGxldCBzdGFydF95ZWFyID0gcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoMCwgNCksXHJcbiAgICAgICAgICAgIHN0YXJ0X21vbnRoID0gcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoNSwgMiksXHJcbiAgICAgICAgICAgIHN0YXJ0X2RheSA9IHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDgsIDIpLFxyXG4gICAgICAgICAgICBlbmRfeWVhciA9IHByYWN0aWNlLmVuZF9kYXRlX3ByYWN0aWNlLnN1YnN0cigwLCA0KSxcclxuICAgICAgICAgICAgZW5kX21vbnRoID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDUsIDIpLFxyXG4gICAgICAgICAgICBlbmRfZGF5ID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDgsIDIpO1xyXG4gICAgICAgIGxldCBzdGFydF9kYXRlID0gc3RhcnRfZGF5ICsgJy0nICsgc3RhcnRfbW9udGggKyAnLScgKyBzdGFydF95ZWFyO1xyXG4gICAgICAgIGxldCBlbmRfZGF0ZSA9IGVuZF9kYXkgKyAnLScgKyBlbmRfbW9udGggKyAnLScgKyBlbmRfeWVhcjtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSAn0YEgJ1xyXG4gICAgICAgICAgICArIHN0YXJ0X2RhdGUgKyAnINC/0L4gJyArIGVuZF9kYXRlO1xyXG4gICAgICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5nZXRVc2VySW5mb0Fib3V0UHJhY3RpY2UoKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgXCJtYWluV2luZG93VHlwZVByYWN0aWNlXCIpLmlubmVySFRNTCA9IGluZm9fYWJvdXRfcHJhY3RpY2UudHlwZVByYWN0aWNlXHJcbiAgICAgICAgICAgICsgJyDQv9GA0LDQutGC0LjQutCwJztcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBcItCf0YDQsNC60YLQuNC60LhcIlxyXG4gICAgICAgICAgICArIFwiINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBcIiBcIjtcclxuICAgIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcclxuICAgICAgICBcInRhYmNvbnRyb2wyXCIpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhY3RpdmVcIilbMF0uY2hpbGRyZW5bMF0udGV4dDtcclxuICAgIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVQcmFjdGljZVRhYlwiKS52YWx1ZTtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0ge1xyXG4gICAgICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAgICAgJ3llYXInOiB0aGlzLnNlbGVjdGVkWWVhcixcclxuICAgICAgICAnZWR1X2xldmVsJzogZWR1Y2F0aW9uTGV2ZWxcclxuICAgIH07XHJcbiAgICByZXR1cm4gaW5mb19hYm91dF9wcmFjdGljZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZU9yZ1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBcInNlbGVjdEVkdUxldmVsT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwic2VsZWN0VHlwZVByYWN0aWNlT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgICBpZiAodHlwZVByYWN0aWNlID09PSBcImVkdWNhdGlvbmFsXCIpIHtcclxuICAgICAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQo9GH0LXQsdC90LDRj1wiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZVByYWN0aWNlID09PSBcImludGVybnNoaXBcIikge1xyXG4gICAgICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQvtC40LfQstC+0LTRgdGC0LLQtdC90L3QsNGPXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwicHJlZGlwbG9tYVwiKSB7XHJcbiAgICAgICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0J/RgNC10LTQtNC40L/Qu9C+0LzQvdCw0Y9cIjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHtcclxuICAgICAgICAndHlwZVByYWN0aWNlJzogdHlwZVByYWN0aWNlVGV4dCxcclxuICAgICAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyLFxyXG4gICAgICAgICdlZHVfbGV2ZWwnOiBlZHVjYXRpb25MZXZlbFxyXG4gICAgfTtcclxuICAgIHJldHVybiBpbmZvX2Fib3V0X3ByYWN0aWNlO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUucmVuZGVyVGFibGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgaWYgKGRhdGEgPT09IDApIHtcclxuICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5DbGVhclRhYmxlKCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5DbGVhclRhYmxlKCk7XHJcbiAgICAgICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuQWRkRGF0YShkYXRhKTtcclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNvbG9yVGFibGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGRhdGFbaV0uc3RhdHVzID09PSAxKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuR2V0Tm9kZXMoaSkpLmFkZENsYXNzKFwiYXBwcm92ZWRfc3R1ZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuR2V0Tm9kZXMoaSkuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcclxuICAgICAgICAgICAgICAgIFwic29ydGluZ18xIGFwcHJvdmVkX3N0dWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRhW2ldLnN0YXR1cyA9PT0gMCkge1xyXG4gICAgICAgICAgICAkKHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkdldE5vZGVzKGkpKS5hZGRDbGFzcyhcImFwcGxpZWRfc3R1ZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuR2V0Tm9kZXMoaSkuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcclxuICAgICAgICAgICAgICAgIFwic29ydGluZ18xIGFwcGxpZWRfc3R1ZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jaGFuZ2VZZWFyID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgIGlmIChzZWxlY3RlZEVsZW0pIHtcclxuICAgICAgICBzZWxlY3RlZEVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnY3VycmVudCcpO1xyXG4gICAgfVxyXG4gICAgc2VsZWN0ZWRFbGVtID0gbm9kZTtcclxuICAgIHNlbGVjdGVkRWxlbS5jbGFzc0xpc3QuYWRkKCdjdXJyZW50Jyk7XHJcbiAgICB0aGlzLnNlbGVjdGVkWWVhciA9IHNlbGVjdGVkRWxlbS5pbm5lckhUTUw7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVZZWFyID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ2l0ZW0geWVhcicgfHwgdGFyZ2V0LmNsYXNzTmFtZVxyXG4gICAgICAgICAgICA9PT0gJ2l0ZW0geWVhciBjdXJyZW50Jykge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVllYXIodGFyZ2V0KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RlZEdyb3VwcyA9IGZ1bmN0aW9uICh0cmVlVmlldykge1xyXG4gICAgaWYgKHRyZWVWaWV3ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBsZXQgZnJhbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZyYW1lc1wiKVswXS5jaGlsZHJlbjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZnJhbWVzW2ldLnN0eWxlLmRpc3BsYXkgIT09IFwibm9uZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlVmlldyA9IGZyYW1lc1tpXS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IEdyb3VwcyA9IFtdO1xyXG4gICAgbGV0IGxpTnVtYmVyID0gdHJlZVZpZXcucXVlcnlTZWxlY3RvckFsbCgnbGknKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlOdW1iZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZ3JvdXBzID0gbGlOdW1iZXJbaV0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6Y2hlY2tlZCcpO1xyXG4gICAgICAgIGlmIChncm91cHMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXAgPSBncm91cHNbal0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwLmluZGV4T2YoXCLQutGD0YDRgVwiKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBHcm91cHMucHVzaChncm91cCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gR3JvdXBzO1xyXG59O1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsIG5hbWVMZWFmLCB1aWQpIHtcclxuICAgIGF3YWl0IHRyZWUuYWRkTGVhZihub2RlLCBuYW1lTGVhZiwge1xyXG4gICAgICAgIG1vZGU6ICdjaGVja2JveCcsXHJcbiAgICAgICAgY2hlY2tlZDogZmFsc2UsXHJcbiAgICAgICAgdWlkOiB1aWRcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlKSB7XHJcbiAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkTm9kZXM7XHJcbiAgICB3aGlsZSAoY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZHJlblswXSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLmNsZWFyR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaWQgPSAwO1xyXG4gICAgd2hpbGUgKGlkIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgbGlBcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICB0aGlzLmlkVHJlZVZpZXdzW2lkXSkuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUNoaWxkcmVuKGxpQXJyYXlbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZCsrO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVHcm91cHNUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uIChjb3Vyc2VzLCBncm91cHMpIHtcclxuICAgIGxldCBpZENvdW50ZXIgPSAwLCBjb3Vyc2VOdW1iZXIgPSBiYWNoZWxvclllYXIsIGNudDtcclxuICAgIGxldCBjb3Vyc2VzTmFtZSA9IFsnZmlyc3QnLCAnc2Vjb25kJywgJ3RoaXJkJywgJ2ZvdXJ0aCddO1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgd2hpbGUgKGlkQ291bnRlciA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIHRyZWUgPSAkKFwiI1wiICsgdGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdKS5kYXRhKFwidHJlZXZpZXdcIik7XHJcbiAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaWRDb3VudGVyXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBjb3Vyc2VOdW1iZXIgPSBtYXN0ZXJZZWFyO1xyXG4gICAgICAgICAgICBpID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgICAgICAgICBpID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY250ID0gMDtcclxuICAgICAgICBmb3IgKGk7IGkgPCBjb3Vyc2VOdW1iZXI7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdXJzZXNbaV0uZ3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IHRyZWUuZWxlbWVudC5maW5kKCdsaS4nICsgY291cnNlc05hbWVbY250XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaWRDb3VudGVyXVxyXG4gICAgICAgICAgICAgICAgICAgID09PSBcImdyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWRpYWxvZ0FkZC1iYWNoZWxvclwiXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgdGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdXHJcbiAgICAgICAgICAgICAgICAgICAgPT09IFwiZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItZGlhbG9nQWRkLW1hc3RlclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZVswXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Vyc2VzW2ldLmdyb3Vwc1tqXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW0gPSBub2RlLmZpbmQoJ3VsJylbMF0uY2hpbGRyZW5bbm9kZS5maW5kKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAndWwnKVswXS5jaGlsZHJlbi5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAkKGVsZW0pLmFkZENsYXNzKFwiY29sbGFwc2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVswXS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHVkZW50cyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBncm91cHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvdXJzZXNbaV0uZ3JvdXBzW2pdID09PSBncm91cHNba10ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1ZGVudHMgPSBncm91cHNba10uc3R1ZGVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHN0dWRlbnRzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCAkKGVsZW0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1ZGVudHNba10ubmFtZSwgc3R1ZGVudHNba10udWlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlucHV0cyA9IGVsZW0ucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdWlkXScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgaW5wdXRzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0c1trXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Vyc2VzW2ldLmdyb3Vwc1tqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY250Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlkQ291bnRlcisrO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5teVVwZGF0ZVRyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKGNvdXJzZXMsIGlkKSB7XHJcbiAgICBsZXQgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyLCBuO1xyXG4gICAgbGV0IGNvdXJzZXNOYW1lID0gWydmaXJzdCcsICdzZWNvbmQnLCAndGhpcmQnLCAnZm91cnRoJ107XHJcbiAgICB2YXIgaSA9IDA7XHJcblxyXG4gICAgdmFyIHRyZWUgPSAkKFwiI1wiICsgaWQpLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgIGlmIChpZC5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgIGNvdXJzZU51bWJlciA9IG1hc3RlclllYXI7XHJcbiAgICAgICAgaSA9IGJhY2hlbG9yWWVhcjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvdXJzZU51bWJlciA9IGJhY2hlbG9yWWVhcjtcclxuICAgICAgICBpID0gMDtcclxuICAgIH1cclxuICAgIG4gPSAwO1xyXG4gICAgZm9yIChpOyBpIDwgY291cnNlTnVtYmVyOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdXJzZXNbaV0uZ3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGxldCBub2RlID0gdHJlZS5lbGVtZW50LmZpbmQoJ2xpLicgKyBjb3Vyc2VzTmFtZVtuXSk7XHJcbiAgICAgICAgICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLCBjb3Vyc2VzW2ldLmdyb3Vwc1tqXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG4rKztcclxuICAgIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0Q29uZmlndXJhdGlvblByYWN0aWNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwic2VsZWN0VHlwZVByYWN0aWNlT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gICAgbGV0IGVkdUxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVMZXZlbE9yZ2FuaXNhdGlvblNlY1wiKS52YWx1ZTtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0ge1xyXG4gICAgICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAgICAgJ3llYXInOiB0aGlzLnNlbGVjdGVkWWVhcixcclxuICAgICAgICAnZWR1X2xldmVsJzogZWR1TGV2ZWxcclxuICAgIH07XHJcbiAgICByZXR1cm4gaW5mb19hYm91dF9wcmFjdGljZTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHRyZWVfYWRkX2xlYWZfY2hlY2tib3godHJlZSwgbm9kZSwgbmFtZUxlYWYsIGlkVHlwZU9yZ2FuaXNhdGlvbikge1xyXG4gICAgdHJlZS5hZGRMZWFmKG5vZGUsIG5hbWVMZWFmLCB7XHJcbiAgICAgICAgbW9kZTogJ2NoZWNrYm94JyxcclxuICAgICAgICBjaGVja2VkOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICBub2RlLmZpbmQoJ3VsJykuZmluZCgnbGknKS5sYXN0KClbMF0uc2V0QXR0cmlidXRlKFwiaWRcIiwgJ3R5cGVfb3JnXydcclxuICAgICAgICArIGlkVHlwZU9yZ2FuaXNhdGlvbik7XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLnNldFR5cGVzT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgICB2YXIgdHJlZVZpZXdPcmdhbmlzYXRpb25zID0gJChcclxuICAgICAgICBcIiNvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uXCIpLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHlwZXNPcmdhbmlzYXRpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgbm9kZSA9IHRyZWVWaWV3T3JnYW5pc2F0aW9ucy5lbGVtZW50LmZpbmQoJ2xpLm5vZGUnKTtcclxuICAgICAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94KHRyZWVWaWV3T3JnYW5pc2F0aW9ucywgbm9kZSxcclxuICAgICAgICAgICAgdHlwZXNPcmdhbmlzYXRpb25baV0ubmFtZSwgdHlwZXNPcmdhbmlzYXRpb25baV0uaWQpO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5jbGVhclR5cGVzT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGxpQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAnb3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbicpLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgcmVtb3ZlQ2hpbGRyZW4obGlBcnJheVtpXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSk7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnNldE9yZ2FuaXNhdGlvbnNJblRyZWVWaWV3ID0gZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgICB2YXIgdHJlZSA9ICQoXCIjb3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKS5kYXRhKFwidHJlZXZpZXdcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZ2FuaXNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHR5cGVzT3JnYW5pc2F0aW9uLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChvcmdhbmlzYXRpb25zW2ldLmlkX3R5cGVfb3JnYW5pc2F0aW9uID09PSB0eXBlc09yZ2FuaXNhdGlvbltqXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpQXJyID0gdHJlZS5lbGVtZW50LmZpbmQoJ2xpJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbGlBcnIubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGlBcnJba10uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09ICgndHlwZV9vcmdfJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyB0eXBlc09yZ2FuaXNhdGlvbltqXS5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9ICQobGlBcnJba10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94X2V4YW1wbGVfY2xpY2sodHJlZSwgbm9kZSxcclxuICAgICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0SW5mb05ld09yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlQ29tcGFueVwiKTtcclxuICAgIHZhciB0eXBlT3JnID0gZS5vcHRpb25zW2Uuc2VsZWN0ZWRJbmRleF0udGV4dDtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSB7XHJcbiAgICAgICAgJ25hbWUnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICd0eXBlT3JnJzogdHlwZU9yZyxcclxuICAgICAgICAnaW5mb09yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mb0NvbXBhbnlcIikudmFsdWUsXHJcbiAgICAgICAgJ2VtYWlsT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbWFpbE9yZ1wiKS52YWx1ZSxcclxuICAgICAgICAncGhvbmVPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBob25lT3JnXCIpLnZhbHVlLFxyXG4gICAgICAgICdwbGFjZXNPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYWNlc0NvbXBhbnlcIikudmFsdWUsXHJcbiAgICAgICAgJ2xvZ2luT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbkNvbXBhbnlcIikudmFsdWUsXHJcbiAgICAgICAgJ3Bzd2RPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBzd2RDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICdhZGRyZXNzT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGRyZXNzT3JnXCIpLnZhbHVlLFxyXG4gICAgICAgICdpZCc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRDb21wYW55XCIpLmlubmVySFRNTFxyXG4gICAgfTtcclxuICAgIHJldHVybiBvcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5zZXRUeXBlc09yZ2FuaXNhdGlvblNlbGVjdCA9IGZ1bmN0aW9uICh0eXBlc09yZ2FuaXNhdGlvbikge1xyXG4gICAgbGV0IHR5cGVPcmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVDb21wYW55XCIpO1xyXG4gICAgcmVtb3ZlQ2hpbGRyZW4odHlwZU9yZyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHR5cGVzT3JnYW5pc2F0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XHJcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9IHR5cGVzT3JnYW5pc2F0aW9uW2ldLm5hbWU7XHJcbiAgICAgICAgdHlwZU9yZy5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5zZXRPcmdhbmlzYXRpb25zTGlzdCA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb25zLCBpZExpc3QpIHtcclxuICAgIGxldCBsaXN0T3JnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRMaXN0KTtcclxuICAgIHJlbW92ZUNoaWxkcmVuKGxpc3RPcmcpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGRpdl9saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X2xpc3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0XCIpO1xyXG5cclxuICAgICAgICBsZXQgZGl2X2xpc3RfY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LWNvbnRlbnQgaW5saW5lLWJsb2NrXCIpO1xyXG4gICAgICAgIGlmIChpZExpc3QgPT09IFwib3JnYW5pc2F0aW9uTGlzdFwiKSB7XHJcbiAgICAgICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5SW5mb0Fib3V0T3JnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3RfdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC10aXRsZVwiKTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwiaWRfb3JnYW5pc2F0aW9uXCIsIG9yZ2FuaXNhdGlvbnNbaV0uaWQpO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5pbm5lckhUTUwgPSBvcmdhbmlzYXRpb25zW2ldLm5hbWU7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3RfdGl0bGUpO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl9saXN0X3N1YnRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fbGlzdF9zdWJ0aXRsZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3Qtc3VidGl0bGVcIik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3N1YnRpdGxlLmlubmVySFRNTCA9ICfQktGB0LXQs9C+INC80LXRgdGCOiAnXHJcbiAgICAgICAgICAgICsgb3JnYW5pc2F0aW9uc1tpXS5tYXhfc3R1ZGVudHNfbnVtYmVyO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3N1YnRpdGxlKTtcclxuXHJcbiAgICAgICAgbGV0IHNwYW5fbGlzdF9yZW1hcmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3JlbWFyay5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtcmVtYXJrXCIpO1xyXG4gICAgICAgIHNwYW5fbGlzdF9yZW1hcmsuaW5uZXJIVE1MID0gJ9Ce0YHRgtCw0LvQvtGB0Yw6ICdcclxuICAgICAgICAgICAgKyBvcmdhbmlzYXRpb25zW2ldLm1heF9zdHVkZW50c19udW1iZXI7XHJcbiAgICAgICAgLyrQntCR0K/Ql9CQ0KLQldCb0KzQndCeINCY0KHQn9Cg0JDQktCY0KLQrCDQndCQINCa0J7Qm9CY0KfQldCh0KLQktCeINCe0KHQotCQ0JLQqNCY0KXQodCvINCc0JXQodCiLiEhISEhISEhISEhISEhISEhISEhISEhISEhISovXHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3RfcmVtYXJrKTtcclxuXHJcbiAgICAgICAgZGl2X2xpc3QuYXBwZW5kQ2hpbGQoZGl2X2xpc3RfY29udGVudCk7XHJcblxyXG4gICAgICAgIGxldCBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICBcImlubGluZS1ibG9jayBsaXN0LWNvbnRlbnQgc2V0dGluZ3NPcmdhbmlzYXRpb25cIik7XHJcbiAgICAgICAgaWYgKGlkTGlzdCA9PT0gXCJvcmdhbmlzYXRpb25MaXN0XCIpIHtcclxuICAgICAgICAgICAgbGV0IHNwYW5fdXNlcl9wbHVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICBzcGFuX3VzZXJfcGx1cy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJtaWYtdXNlci1wbHVzIG1pZi1sZyBmZy1ncmF5IGFkZC1zdHVkZW50LW9yZ2FuaXNhdGlvblwiKTtcclxuICAgICAgICAgICAgc3Bhbl91c2VyX3BsdXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tBZGRTdHVkZW50VG9PcmdhbmlzYXRpb25TaG93RGlhbG9nKTtcclxuICAgICAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX3VzZXJfcGx1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc3Bhbl9wZW5jaWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9wZW5jaWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcclxuICAgICAgICAgICAgXCJtaWYtcGVuY2lsIG1pZi1sZyBmZy1ncmF5IGVkaXQtb3JnYW5pc2F0aW9uXCIpO1xyXG4gICAgICAgIHNwYW5fcGVuY2lsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uQ2xpY2tFZGl0T3JnYW5pc2F0aW9uKTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fcGVuY2lsKTtcclxuXHJcbiAgICAgICAgLyogbGV0IHNwYW5fY2FuY2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICBzcGFuX2NhbmNlbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1pZi1jYW5jZWwgbWlmLWxnIGZnLXllbGxvd1wiKTtcclxuICAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX2NhbmNlbCk7Ki9cclxuXHJcbiAgICAgICAgZGl2X2xpc3QuYXBwZW5kQ2hpbGQoZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbik7XHJcblxyXG4gICAgICAgIGxpc3RPcmcuYXBwZW5kQ2hpbGQoZGl2X2xpc3QpO1xyXG4gICAgfVxyXG5cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0SWRPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBpZE9yZ2FuaXNhdGlvbiA9IDA7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmlkID09PSBcInVwZGF0ZU9yZ2FuaXNhdGlvblwiKSB7XHJcbiAgICAgICAgaWRPcmdhbmlzYXRpb24gPSArZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMl0uaW5uZXJIVE1MO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWRPcmdhbmlzYXRpb24gPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmdldEF0dHJpYnV0ZShcclxuICAgICAgICAgICAgXCJpZF9vcmdhbmlzYXRpb25cIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaWRPcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXROYW1lT3JnYW5pc2F0aW9uSW5UcmVldmlldyA9IGZ1bmN0aW9uIChpZFRyZWV2aWV3KSB7XHJcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRUcmVldmlldyk7XHJcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbiA9IHBhcmVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxyXG4gICAgICAgIFwiYWN0aXZlXCIpWzBdLnF1ZXJ5U2VsZWN0b3IoJ1tpZF9vcmdhbmlzYXRpb24nKS5pbm5lckhUTUw7XHJcbiAgICByZXR1cm4gbmFtZU9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnNob3dEaWFsb2dPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVDb21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLm5hbWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkQ29tcGFueVwiKS5pbm5lckhUTUwgPSBvcmdhbmlzYXRpb24uaWQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm9Db21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLmluZm9fb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaG9uZU9yZ1wiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5waG9uZV9vcmdhbmlzYXRpb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVtYWlsT3JnXCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLmVtYWlsX29yZ2FuaXNhdGlvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwiYWRkcmVzc09yZ1wiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5hZGRyZXNzX29yZ2FuaXNhdGlvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwicGxhY2VzQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5tYXhfc3R1ZGVudHNfbnVtYmVyO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJsb2dpbkNvbXBhbnlcIikudmFsdWUgPSBvcmdhbmlzYXRpb24ubG9naW5fb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwc3dkQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5wc3dkX29yZ2FuaXNhdGlvbjtcclxuICAgIG1ldHJvRGlhbG9nLm9wZW4oJyNkaWFsb2dDcmVhdGVDb21wYW55Jyk7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmRpYWxvZ09wZW4gPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgIG1ldHJvRGlhbG9nLm9wZW4oaWQpO1xyXG59O1xyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVPcmdhbmlzYXRpb25UaXRsZSA9IGZ1bmN0aW9uIChuYW1lT3JnYW5pc2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHByb3ZlZF9zdHVkZW50X2NvdW50LCBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCkge1xyXG4gICAgaWYgKG5vbl9hcHByb3ZlZF9zdHVkZW50X2NvdW50ID09PSAwKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJub25BcHByb3ZlZFN0dWRlbnRMaXN0VGl0bGVcIikuaW5uZXJIVE1MID0gXCIsINC/0YPRgdGCXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5vbkFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdOYW1lXCIpLmlubmVySFRNTCA9IG5hbWVPcmdhbmlzYXRpb247XHJcblxyXG4gICAgaWYgKGFwcHJvdmVkX3N0dWRlbnRfY291bnQgPT09IDApIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgXCJhcHByb3ZlZFN0dWRlbnRMaXN0VGl0bGVcIikuaW5uZXJIVE1MID0gXCLQodC/0LjRgdC+0Log0YPRgtCy0LXRgNC20LTQtdC90L3Ri9GFINGB0YLRg9C00LXQvdGC0L7QsiDQv9GD0YHRgi5cIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICBcImFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcItCh0L/QuNGB0L7QuiDRg9GC0LLQtdGA0LbQtNC10L3QvdGL0YUg0YHRgtGD0LTQtdC90YLQvtCyLlwiO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUgPT09IFwibGlzdC1jb250ZW50IGlubGluZS1ibG9ja1wiKSB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgfVxyXG4gICAgbGV0IG5hbWVPcmdhbmlzYXRpb25DbGljayA9IGVsZW1lbnQuY2hpbGRyZW5bMF0uaW5uZXJIVE1MO1xyXG4gICAgcmV0dXJuIG5hbWVPcmdhbmlzYXRpb25DbGljaztcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldE5hbWVPcmdhbmlzYXRpb25CeVRpdGxlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnTmFtZVwiKS5pbm5lckhUTUw7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVTdHVkZW50c0xpc3RWaWV3ID0gZnVuY3Rpb24gKHN0dWRlbnRzLCBpZExpc3QpIHtcclxuICAgIGxldCBsaXN0U3R1ZGVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZExpc3QpO1xyXG4gICAgcmVtb3ZlQ2hpbGRyZW4obGlzdFN0dWRlbnRzKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZGl2X2xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfbGlzdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3RcIik7XHJcblxyXG4gICAgICAgIGxldCBkaXZfbGlzdF9jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtY29udGVudCBpbmxpbmUtYmxvY2tcIik7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3RfdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC10aXRsZVwiKTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwicmVxdWVzdFwiLCBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0KTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwidWlkXCIsIHN0dWRlbnRzW2ldLnVpZF9zdHVkZW50KTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwib3JnXCIsIHN0dWRlbnRzW2ldLmlkX29yZ2FuaXNhdGlvbik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLmlubmVySFRNTCA9IHN0dWRlbnRzW2ldLmRpc3BsYXlOYW1lO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3RpdGxlKTtcclxuXHJcbiAgICAgICAgbGV0IHNwYW5fbGlzdF9zdWJ0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3Rfc3VidGl0bGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXN1YnRpdGxlXCIpO1xyXG4gICAgICAgIHNwYW5fbGlzdF9zdWJ0aXRsZS5pbm5lckhUTUwgPSBzdHVkZW50c1tpXS5ncm91cF9uYW1lO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3N1YnRpdGxlKTtcclxuXHJcbiAgICAgICAgbGV0IHllYXIgPSBzdHVkZW50c1tpXS5kYXRlX2NyZWF0aW9uX3JlcXVlc3Quc3Vic3RyKDAsIDQpLFxyXG4gICAgICAgICAgICBtb250aCA9IHN0dWRlbnRzW2ldLmRhdGVfY3JlYXRpb25fcmVxdWVzdC5zdWJzdHIoNSwgMiksXHJcbiAgICAgICAgICAgIGRheSA9IHN0dWRlbnRzW2ldLmRhdGVfY3JlYXRpb25fcmVxdWVzdC5zdWJzdHIoOCwgMik7XHJcbiAgICAgICAgbGV0IGRhdGUgPSBkYXkgKyAnLScgKyBtb250aCArICctJyArIHllYXI7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3RfcmVtYXJrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fbGlzdF9yZW1hcmsuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXJlbWFya1wiKTtcclxuICAgICAgICBzcGFuX2xpc3RfcmVtYXJrLmlubmVySFRNTCA9ICfQlNCw0YLQsCDQt9Cw0L/QuNGB0Lg6ICcgKyBkYXRlO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3JlbWFyayk7XHJcblxyXG4gICAgICAgIGRpdl9saXN0LmFwcGVuZENoaWxkKGRpdl9saXN0X2NvbnRlbnQpO1xyXG5cclxuICAgICAgICBsZXQgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcclxuICAgICAgICAgICAgXCJpbmxpbmUtYmxvY2sgbGlzdC1jb250ZW50IHNldHRpbmdzT3JnYW5pc2F0aW9uXCIpO1xyXG5cclxuICAgICAgICBpZiAoaWRMaXN0ICE9PSBcImFwcHJvdmVkU3R1ZGVudHNcIikge1xyXG4gICAgICAgICAgICBsZXQgc3Bhbl9zdHVkZW50X2FwcHJvdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgIHNwYW5fc3R1ZGVudF9hcHByb3ZlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICAgICAgICBcIm1pZi1jaGVja21hcmsgbWlmLWxnIGZnLWdyZWVuXCIpO1xyXG4gICAgICAgICAgICBzcGFuX3N0dWRlbnRfYXBwcm92ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixcclxuICAgICAgICAgICAgICAgIHRoaXMub25DbGlja0FwcHJvdmVTdHVkZW50KTtcclxuICAgICAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX3N0dWRlbnRfYXBwcm92ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc3Bhbl9zdHVkZW50X3JlamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX3N0dWRlbnRfcmVqZWN0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibWlmLWNhbmNlbCBtaWYtbGcgZmctcmVkXCIpO1xyXG4gICAgICAgIHNwYW5fc3R1ZGVudF9yZWplY3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25DbGlja1JlamVjdFN0dWRlbnQpO1xyXG4gICAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uYXBwZW5kQ2hpbGQoc3Bhbl9zdHVkZW50X3JlamVjdCk7XHJcblxyXG4gICAgICAgIGRpdl9saXN0LmFwcGVuZENoaWxkKGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24pO1xyXG5cclxuICAgICAgICBsaXN0U3R1ZGVudHMuYXBwZW5kQ2hpbGQoZGl2X2xpc3QpO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGxPcmdhbmlzYXRpb25zTGlzdEJsb2NrXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3R1ZGVudHNSZXF1ZXN0c1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUucmVuZGVyT3JnYW5pc2F0aW9uU2VjdGlvbiA9IGZ1bmN0aW9uIChwcmFjdGljZSkge1xyXG4gICAgbGV0IHRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ2FuaXNhdGlvbkxpc3RDdXJyZW50UHJhY3RpY2VUZXh0XCIpO1xyXG4gICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIHRleHQuaW5uZXJIVE1MID0gXCLQodC/0LjRgdC+0Log0L7RgNCz0LDQvdC40LfQsNGG0LjQuSDQsiDQv9GA0LDQutGC0LjQutC1XCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0ZXh0LmlubmVySFRNTCA9IFwi0J/RgNCw0LrRgtC40LrQuCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuT3Blbk9yQ2xvc2VMb2FkSW1hZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZFwiKS5zdHlsZS5kaXNwbGF5O1xyXG4gICAgaWYgKGRpc3BsYXkgPT09IFwiYmxvY2tcIikge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRTdHVkZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgbm9kZSA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihcclxuICAgICAgICAnW3JlcXVlc3RdJyk7XHJcbiAgICBsZXQgc3R1ZGVudCA9IHtcclxuICAgICAgICAnaWRfcmVxdWVzdCc6IG5vZGUuZ2V0QXR0cmlidXRlKFwicmVxdWVzdFwiKSxcclxuICAgICAgICAndWlkX3N0dWRlbnQnOiBub2RlLmdldEF0dHJpYnV0ZShcInVpZFwiKSxcclxuICAgICAgICAnaWRfb3JnYW5pc2F0aW9uJzogbm9kZS5nZXRBdHRyaWJ1dGUoXCJvcmdcIilcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKS5pbmRleE9mKFwibWlmLWNhbmNlbFwiKSA9PT0gMCkge1xyXG4gICAgICAgIHN0dWRlbnRbJ2lkX3N0YXR1cyddID0gMjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN0dWRlbnRbJ2lkX3N0YXR1cyddID0gMTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdHVkZW50O1xyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5zZXRZZWFyc0FycmF5ID0gZnVuY3Rpb24gKHllYXJzKSB7XHJcbiAgICBsZXQgYnV0dG9uQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbnNBcnJheVwiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgeWVhcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaXRlbSB5ZWFyXCIpO1xyXG4gICAgICAgIHNwYW4uaW5uZXJIVE1MID0geWVhcnNbaV07XHJcbiAgICAgICAgYnV0dG9uQXJyYXkuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgICB9XHJcbiAgICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIHNwYW4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpdGVtIHllYXJcIik7XHJcbiAgICBzcGFuLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiY3JlYXRlUHJhY3RpY2VCdG5cIik7XHJcbiAgICBzcGFuLmlubmVySFRNTCA9IFwiK1wiO1xyXG4gICAgYnV0dG9uQXJyYXkuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVByYWN0aWNlQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tDcmVhdGVQcmFjdGljZSk7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RlZFN0dWRlbnRzID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgU3R1ZGVudHMgPSBbXTtcclxuICAgIGxldCBub2RlcyA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0OmNoZWNrZWQnKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAobm9kZXNbaV0ucGFyZW50RWxlbWVudC5uZXh0U2libGluZy5pbm5lckhUTUwuaW5kZXhPZihcItC60YPRgNGBXCIpID09PSAtMVxyXG4gICAgICAgICAgICAmJiBpc05hTigrbm9kZXNbaV0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MLnN1YnN0cigwLFxyXG4gICAgICAgICAgICAgICAgMikpKSB7XHJcbiAgICAgICAgICAgIGxldCBuYW1lID0gbm9kZXNbaV0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICBsZXQgdWlkID0gbm9kZXNbaV0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtdWlkXCIpO1xyXG4gICAgICAgICAgICBTdHVkZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICB1aWQ6IHVpZFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gU3R1ZGVudHM7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5kaWFsb2dFbmFibGVDaGVja2JveGVzID0gZnVuY3Rpb24gKG5hbWVzR3JvdXBzLCBpZEVsZW1lbnQpIHtcclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZEVsZW1lbnQpO1xyXG4gICAgbGV0IGlucHV0cyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5hbWVzR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChpbnB1dHNbaV0ucGFyZW50RWxlbWVudC5uZXh0U2libGluZy5pbm5lckhUTUwgPT09IG5hbWVzR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY291cnNlID0gaW5wdXRzW2ldLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoY291cnNlLmdldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiKSA9PT0gXCJjaGVja2JveFwiICYmIGNvdXJzZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKS5pbmRleE9mKFwiYWN0aXZlLWNvdXJzZVwiKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKGNvdXJzZSkuYWRkQ2xhc3MoXCJhY3RpdmUtY291cnNlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW5wdXRzW2ldLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0dWRlbnRzQ2hlY2tib3hlcyA9IGlucHV0c1tpXS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICAgICAgICAgICAnW2RhdGEtdWlkXScpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBzdHVkZW50c0NoZWNrYm94ZXMubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHVkZW50c0NoZWNrYm94ZXNbbl0ucXVlcnlTZWxlY3RvcignaW5wdXQnKS5yZW1vdmVBdHRyaWJ1dGUoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVJbnB1dHMgPSBmdW5jdGlvbiAoaWRCbG9jaywgc2VsZWN0ZWRHcm91cHMpIHtcclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZEJsb2NrKTtcclxuICAgIHJlbW92ZUNoaWxkcmVuKHBhcmVudCk7XHJcbiAgICBsZXQgaDQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XHJcbiAgICBoNC5pbm5lckhUTUwgPSBcItCg0YPQutC+0LLQvtC00LjRgtC10LvQuFwiO1xyXG4gICAgaDQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhbGlnbi1jZW50ZXJcIik7XHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaDQpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZpZWxkIG1hcmdpbjIwXCIpO1xyXG5cclxuICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcclxuICAgICAgICBwLmlubmVySFRNTCA9IHNlbGVjdGVkR3JvdXBzW2ldO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChwKTtcclxuXHJcbiAgICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImdyb3VwTmFtZVwiLCBzZWxlY3RlZEdyb3Vwc1tpXSk7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnQgPSBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMsIGFsbEdyb3Vwcykge1xyXG4gICAgbGV0IHRyZWVWaWV3ID0gMDtcclxuICAgIGxldCBncm91cHNGb3JEb2N1bWVudCA9IFtdO1xyXG4gICAgbGV0IGZyYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmcmFtZXNcIilbMF0uY2hpbGRyZW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChmcmFtZXNbaV0uc3R5bGUuZGlzcGxheSAhPT0gXCJub25lXCIpIHtcclxuICAgICAgICAgICAgdHJlZVZpZXcgPSBmcmFtZXNbaV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBlZHVjYXRpb25hbF9sZXZlbCA9IHRyZWVWaWV3LmdldEF0dHJpYnV0ZShcImlkXCIpO1xyXG4gICAgaWYgKGVkdWNhdGlvbmFsX2xldmVsLmluZGV4T2YoXCJiYWNoZWxvclwiKSAhPT0gLTEpIHtcclxuICAgICAgICBlZHVjYXRpb25hbF9sZXZlbCA9IFwiYmFjaGVsb3JcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGVkdWNhdGlvbmFsX2xldmVsID0gXCJtYXN0ZXJcIjtcclxuICAgIH1cclxuICAgIGxldCBibG9ja1RlYWNoZXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmRlci1ibG9ja1wiKS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZGl2Jyk7XHJcblxyXG4gICAgbGV0IHRlYWNoZXJzPVtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja1RlYWNoZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwTmFtZSA9YmxvY2tUZWFjaGVyc1tpXS5jaGlsZHJlblswXS5pbm5lckhUTUw7XHJcbiAgICAgICAgbGV0IHRlYWNoZXIgPWJsb2NrVGVhY2hlcnNbaV0uY2hpbGRyZW5bMV0udmFsdWU7XHJcbiAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmKHNlbGVjdGVkR3JvdXBzW2pdPT09Z3JvdXBOYW1lKVxyXG4gICAgICAgIHRlYWNoZXJzLnB1c2goe1xyXG4gICAgICAgICAgICBcImdyb3VwTmFtZVwiOmdyb3VwTmFtZSxcclxuICAgICAgICAgICAgXCJ0ZWFjaGVyXCI6IHRlYWNoZXJcclxuICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuaW5mb0dyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0uaW5kZXhPZih0aGlzLmluZm9Hcm91cHNbal0ubmFtZSkgIT09IC0xICYmIHRoaXMuaW5mb0dyb3Vwc1tqXS50eXBlID09PSBlZHVjYXRpb25hbF9sZXZlbCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBhbGxHcm91cHMubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IGFsbEdyb3Vwc1tuXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrPCB0ZWFjaGVycy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2ldID09PSB0ZWFjaGVyc1trXS5ncm91cE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0udGVhY2hlciA9ICB0ZWFjaGVyc1trXS50ZWFjaGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS50eXBlID0gdGhpcy5pbmZvR3JvdXBzW2pdLnR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLmZ1bGxOYW1lID0gdGhpcy5pbmZvR3JvdXBzW2pdLmZ1bGxOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS5wcm9maWxlID0gdGhpcy5pbmZvR3JvdXBzW2pdLnByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBzRm9yRG9jdW1lbnQucHVzaChhbGxHcm91cHNbbl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IGRlYW49ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFuXCIpLnZhbHVlO1xyXG4gICAgbGV0IGhlYWRfb2ZfZGVwYXJ0bWVudD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlYWRfb2ZfZGVwYXJ0bWVudFwiKS52YWx1ZTtcclxuICAgIGxldCB0eXBlX2RvY3VtZW50PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2R0eXBlRG9jdW1lbnRcIikub3B0aW9uc1tkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdkdHlwZURvY3VtZW50XCIpLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xyXG4gICAgbGV0IGluZm9ybWF0aW9uPXtcclxuICAgICAgICBcInR5cGVfZG9jdW1lbnRcIjp0eXBlX2RvY3VtZW50LFxyXG4gICAgICAgIFwiZGVhblwiOiBkZWFuLFxyXG4gICAgICAgIFwiaGVhZF9vZl9kZXBhcnRtZW50XCI6IGhlYWRfb2ZfZGVwYXJ0bWVudCxcclxuICAgICAgICBcImdyb3Vwc1wiOiBncm91cHNGb3JEb2N1bWVudFxyXG4gICAgfTtcclxuICAgIHJldHVybiBpbmZvcm1hdGlvbjtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmlldztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9WaWV3LmpzIiwiXHJcbmNvbnN0IFNFUFRFTUJFUiA9IDk7XHJcbmNvbnN0IGZpcnN0Q291cnNlID0gMDtcclxuY29uc3Qgc2Vjb25kQ291cnNlID0gMTtcclxuY29uc3QgdGhpcmRDb3Vyc2UgPSAyO1xyXG5jb25zdCBmb3VydGhDb3Vyc2UgPSAzO1xyXG5jb25zdCBtYXN0ZXJGaXJzdENvdXJzZSA9IDQ7XHJcbmNvbnN0IG1hc3RlclNlY29uZENvdXJzZSA9IDU7XHJcbmNvbnN0IFJFSkVDVEVEID0gMjtcclxuY29uc3QgQVBQUk9WRUQgPSAxO1xyXG5jb25zdCBBUFBMWSA9IDA7XHJcbnZhciBNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLkdyb3VwcyA9IFtdO1xyXG4gIHRoaXMuU3R1ZGVudHMgPSBbXTtcclxuICB0aGlzLkNvdXJzZXMgPSBbXTtcclxuICB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uID0gW107XHJcbiAgdGhpcy5PcmdhbmlzYXRpb25zID0gW107XHJcblxyXG59O1xyXG5cclxuY2xhc3MgQ291cnNlIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lQ291cnNlKSB7XHJcbiAgICB0aGlzLm5hbWVDb3Vyc2UgPSBuYW1lQ291cnNlO1xyXG4gICAgdGhpcy5ncm91cHMgPSBbXTtcclxuICB9XHJcblxyXG4gIGFkZEdyb3VwKGdyb3VwKSB7XHJcbiAgICB0aGlzLmdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIEdyb3VwIHtcclxuICBjb25zdHJ1Y3Rvcih1aWRfTERBUCwgbmFtZUdyb3VwKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lR3JvdXA7XHJcbiAgICB0aGlzLnVpZF9MREFQID0gdWlkX0xEQVA7XHJcbiAgICB0aGlzLnN0dWRlbnRzID0gW107XHJcbiAgfVxyXG5cclxuICBhZGRTdHVkZW50KHN0dWRlbnQpIHtcclxuICAgIHRoaXMuc3R1ZGVudHMucHVzaChzdHVkZW50KTtcclxuICB9XHJcbn1cclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0RGF0YSA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZEdyb3VwcyxcclxuICAgIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMpIHtcclxuICBsZXQgZGF0YSA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwLCBsID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyArK2ssICsrbCkge1xyXG4gICAgICAgICAgbGV0IGlzU3R1ZGVudEFwcGx5ID0gZmFsc2U7XHJcbiAgICAgICAgICBkYXRhLnB1c2goe2dyb3VwOiB0aGlzLkdyb3Vwc1tpXS5uYW1lfSk7XHJcbiAgICAgICAgICBkYXRhW2xdLm9yZ2FuaXNhdGlvbiA9ICcgJztcclxuICAgICAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucy5sZW5ndGg7ICsrdykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd10ubGVuZ3RoOyArK24pIHtcclxuICAgICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgICA9PT0gK3JlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0uaWRfcmVxdWVzdCkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50ID0gdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10ubmFtZTtcclxuICAgICAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudF9VSUQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS51aWQ7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5pZF9zdGF0dXMgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdGF0dXMgPSByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLmlkX3N0YXR1cztcclxuICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gPSByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLm5hbWVfb3JnYW5pc2F0aW9uO1xyXG4gICAgICAgICAgICAgICAgICBpc1N0dWRlbnRBcHBseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uICs9IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0ubmFtZV9vcmdhbmlzYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICsgJywgJztcclxuICAgICAgICAgICAgICAgICAgaXNTdHVkZW50QXBwbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKCFpc1N0dWRlbnRBcHBseSkge1xyXG4gICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5uYW1lO1xyXG4gICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnRfVUlEID0gdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10udWlkO1xyXG4gICAgICAgICAgICBkYXRhW2xdLm9yZ2FuaXNhdGlvbiA9IFwi0J3QtSDQt9Cw0L/QuNGB0LDQu9GB0Y9cIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGRhdGE7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0R3JvdXBzID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvZ3JvdXBzJyk7XHJcbiAgbGV0IGxpc3QgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIGxldCBncm91cHMgPSBsaXN0Ll9lbWJlZGRlZC5ncm91cHM7XHJcbiAgcmV0dXJuIGdyb3VwcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRHcm91cHNCeVByYWN0aWNlSWQgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBpbmZvID0gXCI/aWRfcHJhY3RpY2U9XCJcclxuICAgICAgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9ncm91cHMtYnktcHJhY3RpY2UtaWQnICsgaW5mbywgcGFyYW1zKTtcclxuICBsZXQgZ3JvdXBzX3VpZHMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIHJldHVybiBncm91cHNfdWlkcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRHcm91cHNOYW1lQnlHcm91cHNVSUQgPSBhc3luYyBmdW5jdGlvbiAodWlkc0dyb3Vwcykge1xyXG4gIGxldCBncm91cHMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHVpZHNHcm91cHMubGVuZ3RoOyArK2kpIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgaWYgKCt1aWRzR3JvdXBzW2ldLnVpZF9ncm91cCA9PT0gdGhpcy5Hcm91cHNbal0udWlkX0xEQVApIHtcclxuICAgICAgICBncm91cHMucHVzaCh0aGlzLkdyb3Vwc1tqXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZ3JvdXBzO1xyXG59O1xyXG4vKtC/0L7Qu9GD0YfQsNC10Lwg0YHRgtGD0LTQtdC90YLQvtCyINC40Lcg0YXRgNCw0L3QuNC70LjRidCwIExEQVAg0L/QviBJRCDQs9GA0YPQv9C/0YsqL1xyXG4vKk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0J5R3JvdXBJZCA9IGFzeW5jIGZ1bmN0aW9uIChncm91cElEKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJveHkvY29yZS92MS9ncm91cHMvJyArIGdyb3VwSUQpO1xyXG4gIGxldCBsaXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICBsZXQgc3R1ZGVudHNMaXN0ID0gbGlzdC5fZW1iZWRkZWQuc3R1ZGVudHM7XHJcbiAgcmV0dXJuIHN0dWRlbnRzTGlzdDtcclxufTsqL1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFN0dWRlbnRzQnlVSUQgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudHNfaW5mbykge1xyXG4gIGxldCBzdHVkZW50cyA9IFtdLCB1cmxzID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50c19pbmZvLmxlbmd0aDsgKytpKSB7XHJcbiAgICB1cmxzLnB1c2goJy9wcm94eS9jb3JlL3YxL3Blb3BsZS8nICsgc3R1ZGVudHNfaW5mb1tpXS51aWRfc3R1ZGVudCk7XHJcbiAgfVxyXG4gIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApXHJcbiAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICkpXHJcbiAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICBjb25zdCByZXNMZW5ndGggPSByZXN1bHRzLmxlbmd0aDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzTGVuZ3RoOyArK2kpIHtcclxuICAgICAgc3R1ZGVudHMucHVzaCh7XHJcbiAgICAgICAgZGlzcGxheU5hbWU6IHJlc3VsdHNbaV0uZGlzcGxheU5hbWUsXHJcbiAgICAgICAgZ3JvdXBfbmFtZTogcmVzdWx0c1tpXS5fbGlua3MuZ3JvdXBzWzBdLm5hbWUsXHJcbiAgICAgICAgZ3JvdXBfVUlEOiByZXN1bHRzW2ldLl9saW5rcy5ncm91cHNbMF0uaWQsXHJcbiAgICAgICAgZGF0ZV9jcmVhdGlvbl9yZXF1ZXN0OiBzdHVkZW50c19pbmZvW2ldLmRhdGVfY3JlYXRpb24sXHJcbiAgICAgICAgaWRfcmVxdWVzdDogc3R1ZGVudHNfaW5mb1tpXS5pZF9yZXF1ZXN0LFxyXG4gICAgICAgIHVpZF9zdHVkZW50OiBzdHVkZW50c19pbmZvW2ldLnVpZF9zdHVkZW50LFxyXG4gICAgICAgIGlkX29yZ2FuaXNhdGlvbjogc3R1ZGVudHNfaW5mb1tpXS5pZF9vcmdhbmlzYXRpb25cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHN0dWRlbnRzO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuaW5pdCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZ3JvdXBzID0gYXdhaXQgdGhpcy5nZXRHcm91cHMoKTtcclxuICBsZXQgdXJscyA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB0aGlzLkdyb3Vwcy5wdXNoKG5ldyBHcm91cChncm91cHNbaV0uaWQsIGdyb3Vwc1tpXS5uYW1lKSk7XHJcbiAgICB1cmxzLnB1c2goJy9wcm94eS9jb3JlL3YxL2dyb3Vwcy8nICsgZ3JvdXBzW2ldLmlkKTtcclxuICB9XHJcbiAgYXdhaXQgdGhpcy5nZXRTdHVkZW50c0J5R3JvdXBJZHModXJscyk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0U3R1ZGVudHNCeUdyb3VwSWRzID0gYXN5bmMgZnVuY3Rpb24gKHVybHMpIHtcclxuICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgKVxyXG4gIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApKVxyXG4gIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgY29uc3QgcmVzTGVuZ3RoID0gcmVzdWx0cy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBzdHVkZW50cyA9IHJlc3VsdHNbaV0uX2VtYmVkZGVkLnN0dWRlbnRzO1xyXG4gICAgICBjb25zdCBzdExlbmd0aCA9IHN0dWRlbnRzLmxlbmd0aDtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdExlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgbGV0IHN0dWRlbnQgPSB7XHJcbiAgICAgICAgICAnbmFtZSc6IHN0dWRlbnRzW2pdLmRpc3BsYXlOYW1lLFxyXG4gICAgICAgICAgJ3VpZCc6IHN0dWRlbnRzW2pdLnVpZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMucHVzaChzdHVkZW50KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEN1cnJlbnRZZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICBsZXQgY3VycmVudFllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKTtcclxuICByZXR1cm4gY3VycmVudFllYXI7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZGlzdHJpYnV0ZUdyb3Vwc0J5Q291cnNlcyA9IGFzeW5jIGZ1bmN0aW9uIChjdXJyZW50WWVhcikge1xyXG4gIHRoaXMuQ291cnNlcyA9IFtcclxuICAgIG5ldyBDb3Vyc2UoJzEnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzInKSxcclxuICAgIG5ldyBDb3Vyc2UoJzMnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzQnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzEgKNC80LMpJyksXHJcbiAgICBuZXcgQ291cnNlKCcyICjQvNCzKScpXHJcbiAgXTtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICBpZiAoK2N1cnJlbnRNb250aCA8IFNFUFRFTUJFUikge1xyXG4gICAgY3VycmVudFllYXIgLT0gMTtcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgIT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW21hc3RlckZpcnN0Q291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbZmlyc3RDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSAhPT0gLTEpIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbbWFzdGVyU2Vjb25kQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbc2Vjb25kQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgPT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW3RoaXJkQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgPT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW2ZvdXJ0aENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGN1cnJlbnRZZWFyICs9IDM7XHJcbiAgfVxyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UHJhY3RpY2UgPSBhc3luYyBmdW5jdGlvbiAoaW5mb19hYm91dF9wcmFjdGljZSkge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgaW5mb19hYm91dF9wcmFjdGljZSA9IFwiP3llYXI9XCIgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLnllYXIgKyBcIiZlZHVfbGV2ZWw9XCJcclxuICAgICAgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLmVkdV9sZXZlbCArIFwiJnR5cGVQcmFjdGljZT1cIlxyXG4gICAgICArIGluZm9fYWJvdXRfcHJhY3RpY2UudHlwZVByYWN0aWNlO1xyXG4gIGxldCBpbmZvID0gMDtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZScgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLCBwYXJhbXMpXHJcbiAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICBpbmZvID0gcmVzcG9uc2UuanNvbigpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKChyZXNwb25zZSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBpbmZvO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdEJ5U3R1ZGVudFVJRCA9IGFzeW5jIGZ1bmN0aW9uIChwcmFjdGljZSwgc3R1ZGVudCkge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgbGV0IGluZm8gPSAnP3VpZD0nICsgc3R1ZGVudC51aWQgKyBcIiZpZF9wcmFjdGljZT1cIlxyXG4gICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3JlcXVzdC1ieS1zdHVkZW50LXVpZCcgKyBpbmZvLCBwYXJhbXMpO1xyXG4gIGxldCByZXF1ZXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICByZXR1cm4gcmVxdWVzdDtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVJZE9yZ2FuaXNhdGlvbkluUmVxdWVzdCA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50KSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0ICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiXHJcbiAgICAgICsgc3R1ZGVudC5pZF9vcmdhbmlzYXRpb247XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvdXBkYXRlLXJlcXVlc3QnICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0cyA9IGFzeW5jIGZ1bmN0aW9uIChwcmFjdGljZSwgZ3JvdXBzKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgcmVxdWVzdHMgPSBbXTtcclxuICBsZXQgdXJscyA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7IGorKykge1xyXG4gICAgICBsZXQgaW5mbyA9ICc/aWRfc3R1ZGVudD0nICsgZ3JvdXBzW2ldLnN0dWRlbnRzW2pdLnVpZCArIFwiJmlkX3ByYWN0aWNlPVwiXHJcbiAgICAgICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgICB1cmxzLnB1c2goJy9yZXF1c3RzLWJ5LXN0dWRlbnQtcHJhY3RpY2UnICsgaW5mbyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApXHJcbiAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICkpXHJcbiAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgcmVxdWVzdHMucHVzaChyZXN1bHRzW2ldKTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gcmVxdWVzdHM7Ly/Qv9C+0LvRg9GH0LjQu9C4IGFsbCDQt9Cw0Y/QstC+0Log0YHRgtGD0LTQtdC90YLQvtCyINCy0YvQsdGA0LDQvdC90YvRhSDQs9GA0YPQv9C/XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuYXNzb3NpYXRlUmVxdWVzdFRvU3R1ZGVudCA9IGFzeW5jIGZ1bmN0aW9uIChyZXF1ZXN0cywgZ3JvdXBzKSB7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IGdyb3Vwc1tqXSkge1xyXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyArK2spIHtcclxuICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcmVxdWVzdHMubGVuZ3RoOyArK24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLnVpZCA9PT0gcmVxdWVzdHNbbl0udWlkX3N0dWRlbnQpIHtcclxuICAgICAgICAgICAgICB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9yZXF1ZXN0ID0gcmVxdWVzdHNbbl0uaWRfcmVxdWVzdDtcclxuICAgICAgICAgICAgICBpZiAocmVxdWVzdHNbbl0uaWRfb3JnYW5pc2F0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9vcmdhbmlzYXRpb24gPSByZXF1ZXN0c1tuXS5pZF9vcmdhbmlzYXRpb247XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzT3JnYW5pc2F0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZEdyb3Vwcykge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgbGV0IHVybHMgPSBbXTtcclxuICBsZXQgb3JnYW5pc2F0aW9uc19ieV9yZXF1ZXN0ID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7ICsraikge1xyXG4gICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLmxlbmd0aDsgKytrKSB7XHJcbiAgICAgICAgICB1cmxzLnB1c2goJy9vcmdhbmlzYXRpb25zLWJ5LXJlcXVlc3QnICsgJz9pZF9yZXF1ZXN0PSdcclxuICAgICAgICAgICAgICArIHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLmlkX3JlcXVlc3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApXHJcbiAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICkpXHJcbiAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgb3JnYW5pc2F0aW9uc19ieV9yZXF1ZXN0LnB1c2gocmVzdWx0c1tpXSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIG9yZ2FuaXNhdGlvbnNfYnlfcmVxdWVzdDtcclxufTtcclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RCeVN0dWRlbnRVSURTID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlLCBzdHVkZW50cykge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgbGV0IHVybHMgPSBbXTtcclxuICBsZXQgcmVxdWVzdHMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB1cmxzLnB1c2goJy9yZXF1c3QtYnktc3R1ZGVudC11aWQnICsgJz91aWQ9JyArIHN0dWRlbnRzW2ldLnVpZFxyXG4gICAgICAgICsgXCImaWRfcHJhY3RpY2U9XCJcclxuICAgICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlKTtcclxuICB9XHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgKVxyXG4gIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApKVxyXG4gIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgIHJlcXVlc3RzLnB1c2gocmVzdWx0c1tpXSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHJldHVybiByZXF1ZXN0cztcclxufTtcclxuTW9kZWwucHJvdG90eXBlLmdldFByYWN0aWNlWWVhcnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcveWVhcnMtcHJhY3RpY2UnKTtcclxuICBsZXQgeWVhcnMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIHJldHVybiB5ZWFycztcclxufTtcclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBDUkVBVElPTlxyXG4gU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuTW9kZWwucHJvdG90eXBlLmdldFR5cGVzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSBbXTtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy90eXBlcy1vcmdhbmlzYXRpb24nKTtcclxuICBsZXQgdHlwZXMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSB0eXBlcztcclxuICByZXR1cm4gdGhpcy50eXBlc09yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbnMnKTtcclxuICBsZXQgb3JncyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgdGhpcy5PcmdhbmlzYXRpb25zID0gb3JncztcclxuICByZXR1cm4gdGhpcy5PcmdhbmlzYXRpb25zO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbnNCeVByYWN0aWNlSWQgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBpbmZvID0gJz9pZF9wcmFjdGljZT0nICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9ucy1ieS1wcmFjdGljZScgKyBpbmZvLCBwYXJhbXMpO1xyXG4gIGxldCBvcmdhbmlzYXRpb25zID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICByZXR1cm4gb3JnYW5pc2F0aW9ucztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25CeUlkID0gYXN5bmMgZnVuY3Rpb24gKGlkKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgaW5mbyA9ICc/aWQ9JyArIGlkO1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbi1ieS1pZCcgKyBpbmZvLCBwYXJhbXMpO1xyXG4gIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIHJldHVybiBvcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdHNCeU9yZ2FuaXNhdGlvbk5hbWUgPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uLFxyXG4gICAgcHJhY3RpY2UsIGlzQXBwcm92ZWQpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBpbmZvID0gMCwgU1RBVFVTO1xyXG4gIGlmICghaXNBcHByb3ZlZCkge1xyXG4gICAgaW5mbyA9IFwiP2lkX3ByYWN0aWNlPVwiICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgICBTVEFUVVMgPSAwO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGluZm8gPSBcIj9pZF9wcmFjdGljZT1cIiArIHByYWN0aWNlLmlkX3ByYWN0aWNlICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiXHJcbiAgICAgICAgKyBvcmdhbmlzYXRpb24uaWQ7XHJcbiAgICBTVEFUVVMgPSAxO1xyXG4gIH1cclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9yZXF1ZXN0cy1ieS1wcmFjdGljZScgKyBpbmZvLCBwYXJhbXMpO1xyXG4gIGxldCByZXF1ZXN0cyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgbGV0IHN0dWRlbnRzID0gW107XHJcbiAgbGV0IHVybHMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcXVlc3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB1cmxzLnB1c2goXCIvZXhpc3QtcmVxdWVzdD9pZF9yZXF1ZXN0PVwiICsgcmVxdWVzdHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiXHJcbiAgICAgICAgKyBvcmdhbmlzYXRpb24uaWQpO1xyXG4gIH1cclxuICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICApXHJcbiAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICkpXHJcbiAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICBjb25zdCByZXNMZW5ndGggPSByZXN1bHRzLmxlbmd0aDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzTGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKHJlc3VsdHNbaV0gIT09ICdOb3QgZm91bmQnKSB7XHJcbiAgICAgICAgaWYgKHJlc3VsdHNbaV0uaWRfc3RhdHVzID09PSBTVEFUVVMpIHtcclxuICAgICAgICAgIHN0dWRlbnRzLnB1c2goe1xyXG4gICAgICAgICAgICBpZF9yZXF1ZXN0OiByZXN1bHRzW2ldLmlkX3JlcXVlc3QsXHJcbiAgICAgICAgICAgIGlkX29yZ2FuaXNhdGlvbjogcmVzdWx0c1tpXS5pZF9vcmdhbmlzYXRpb24sXHJcbiAgICAgICAgICAgIGlkX3N0YXR1czogcmVzdWx0c1tpXS5pZF9zdGF0dXMsXHJcbiAgICAgICAgICAgIHVpZF9zdHVkZW50OiByZXF1ZXN0c1tpXS51aWRfc3R1ZGVudCxcclxuICAgICAgICAgICAgaWRfcHJhY3RpY2U6IHJlcXVlc3RzW2ldLmlkX3ByYWN0aWNlLFxyXG4gICAgICAgICAgICBpZF9yZXZpZXc6IHJlcXVlc3RzW2ldLmlkX3JldmlldyxcclxuICAgICAgICAgICAgZGF0ZV9jcmVhdGlvbjogcmVzdWx0c1tpXS5kYXRlX2NyZWF0aW9uXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gc3R1ZGVudHM7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9uQnlOYW1lID0gYXN5bmMgZnVuY3Rpb24gKG5hbWVPcmdhbmlzYXRpb24pIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBpbmZvID0gJz9uYW1lPScgKyBuYW1lT3JnYW5pc2F0aW9uO1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbi1ieS1uYW1lJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgcmV0dXJuIG9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXREZXRlcm1pbmVkR3JvdXBzID0gYXN5bmMgZnVuY3Rpb24gKHNlbGVjdGVkR3JvdXBzKSB7XHJcbiAgbGV0IGRldGVybWluZWRHcm91cHMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgIGRldGVybWluZWRHcm91cHMucHVzaCh0aGlzLkdyb3Vwc1tpXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGRldGVybWluZWRHcm91cHM7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuY3JlYXRlT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbikge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbi1jcmVhdGUnLCB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9yZ2FuaXNhdGlvbilcclxuICB9KVxyXG4gIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQvtGA0LPQsNC90LjQt9Cw0YbQuNC4INCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbikge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbi11cGRhdGUnLCB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9yZ2FuaXNhdGlvbilcclxuICB9KVxyXG4gIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQvtGA0LPQsNC90LjQt9Cw0YbQuNC4INCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuY3JlYXRlUHJhY3RpY2UgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZScsIHtcclxuICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICB9LFxyXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkocHJhY3RpY2UpXHJcbiAgfSlcclxuICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0L/RgNCw0LrRgtC40LrQuCDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gIH0pO1xyXG5cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVPclVwZGF0ZVN0dWRlbnRzID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvc3R1ZGVudHMnLCB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHN0dWRlbnRzKVxyXG4gIH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4IHVpZCDRgdGC0YPQtNC10L3RgtC+0LIg0LIg0JHQlCBcIiArIGVycm9yKTtcclxuICB9KTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICB2YXIgY3VycmVudERhdGUgPSBkYXRlLmZvcm1hdChcInl5eXktbW0tZGRcIik7XHJcbiAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdFxyXG4gICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uICsgXCImaWRfc3RhdHVzPVwiXHJcbiAgICAgICsgc3R1ZGVudC5pZF9zdGF0dXMgKyBcIiZkYXRlX2NyZWF0aW9uPVwiXHJcbiAgICAgICsgY3VycmVudERhdGU7XHJcbiAgYXdhaXQgZmV0Y2goJy91cGRhdGUtcmVxdWVzdC1vcmdhbmlzYXRpb24nICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0c09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50cykge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgbGV0IHVybHMgPSBbXTtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgdmFyIGN1cnJlbnREYXRlID0gZGF0ZS5mb3JtYXQoXCJ5eXl5LW1tLWRkXCIpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0XHJcbiAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb24gKyBcIiZpZF9zdGF0dXM9XCJcclxuICAgICAgICArIHN0dWRlbnRzW2ldLmlkX3N0YXR1cyArIFwiJmRhdGVfY3JlYXRpb249XCJcclxuICAgICAgICArIGN1cnJlbnREYXRlO1xyXG4gICAgdXJscy5wdXNoKCcvdXBkYXRlLXJlcXVlc3Qtb3JnYW5pc2F0aW9uJyArIGluZm8pO1xyXG4gIH1cclxuXHJcbiAgYXdhaXQgUHJvbWlzZS5hbGwodXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSkpO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RPcmdhbmlzYXRpb25CeVJlcXVlc3QgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudCkge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcblxyXG4gIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3QgKyBcIiZpZF9zdGF0dXM9XCJcclxuICAgICAgKyBzdHVkZW50LmlkX3N0YXR1cyArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uO1xyXG4gIGF3YWl0IGZldGNoKCcvdXBkYXRlLXJlcXVlc3Qtb3JnYW5pc2F0aW9uLWJ5LXJlcXVlc3QnICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RzT3JnYW5pc2F0aW9uQnlSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzKSB7XHJcbiAgbGV0IHBhcmFtcyA9IHtcclxuICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICBtb2RlOiAnY29ycycsXHJcbiAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgfTtcclxuICBsZXQgdXJscyA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0XHJcbiAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb24gKyBcIiZpZF9zdGF0dXM9XCJcclxuICAgICAgICArIHN0dWRlbnRzW2ldLmlkX3N0YXR1cztcclxuICAgIHVybHMucHVzaCgnL3VwZGF0ZS1yZXF1ZXN0LW9yZ2FuaXNhdGlvbi1ieS1yZXF1ZXN0JyArIGluZm8pO1xyXG4gIH1cclxuICBhd2FpdCBQcm9taXNlLmFsbCh1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsLCBwYXJhbXMpLmNhdGNoKGVyciA9PiBlcnIpKSk7XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS5pbnNlcnRSZXF1ZXN0T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICB2YXIgY3VycmVudERhdGUgPSBkYXRlLmZvcm1hdChcInl5eXktbW0tZGRcIik7XHJcbiAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdCArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIlxyXG4gICAgICArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uICsgXCImaWRfc3RhdHVzPVwiICsgc3R1ZGVudC5pZF9zdGF0dXNcclxuICAgICAgKyBcIiZkYXRlX2NyZWF0aW9uPVwiXHJcbiAgICAgICsgY3VycmVudERhdGU7XHJcbiAgYXdhaXQgZmV0Y2goJy9pbnNlcnQtcmVxdWVzdC1vcmdhbmlzYXRpb24nICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBpbmZvID0gMDtcclxuICBpZiAoc3R1ZGVudC5pZF9zdGF0dXMgPT09IFJFSkVDVEVEKSB7XHJcbiAgICBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3RcclxuICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1udWxsXCI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0XHJcbiAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50LmlkX29yZ2FuaXNhdGlvbjtcclxuICB9XHJcbiAgYXdhaXQgZmV0Y2goJy91cGRhdGUtcmVxdWVzdCcgKyBpbmZvLCBwYXJhbXMpO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlUmVxdWVzdHMgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudHMpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBpbmZvID0gMDtcclxuICBsZXQgdXJscyA9IFtdO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgaW5mbyA9IDA7XHJcbiAgICBpZiAoc3R1ZGVudHNbaV0uaWRfc3RhdHVzID09PSBSRUpFQ1RFRCkge1xyXG4gICAgICBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0XHJcbiAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1udWxsXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb247XHJcbiAgICB9XHJcbiAgICB1cmxzLnB1c2goJy91cGRhdGUtcmVxdWVzdCcgKyBpbmZvKTtcclxuICB9XHJcblxyXG4gIGF3YWl0IFByb21pc2UuYWxsKHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZW5lcmF0ZURvY3VtZW50ID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlLCBpbmZvcm1hdGlvbikge1xyXG4gICAgaW5mb3JtYXRpb25bJ3N0YXJ0X2RhdGVfcHJhY3RpY2UnXT1wcmFjdGljZS5zdGFydF9kYXRlO1xyXG4gICAgaW5mb3JtYXRpb25bJ2VuZF9kYXRlX3ByYWN0aWNlJ109cHJhY3RpY2UuZW5kX2RhdGU7XHJcbiAgICBpbmZvcm1hdGlvblsneWVhciddPXByYWN0aWNlLnllYXI7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9kb2N1bWVudCcsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGluZm9ybWF0aW9uKVxyXG4gICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQv9GA0LDQutGC0LjQutC4INCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9Nb2RlbC5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby5jc3Ncbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWljb25zLmNzc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tc2NoZW1lcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3Mvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDclRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFiQTtBQWVBO0FBakJBO0FBdUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVEE7QUFDQTtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDMzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQUNBO0FBV0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBT0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzdzQkE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7OztBIiwic291cmNlUm9vdCI6IiJ9
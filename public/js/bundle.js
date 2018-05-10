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

__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(11);

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
    this.View.OpenOrCloseLoader();
    // await this.Model.init();
    await this.setYears();
    this.View.onClickNextStepDisplayGroupsTreeView = this.displayGroups.bind(this);
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
    await this.Model.getStudentsFromLDAP();
    this.View.OpenOrCloseLoader();
};

Controller.prototype.initDialog = async function () {
    let type_document = this.View.getSelectValue("gdtypeDocument");
    let isOrder = false;
    if (type_document === "Приказ") {
        isOrder = true;
        await this.createInputs(isOrder);
    } else {
        isOrder = false;
        await this.createInputs(isOrder);
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
    let documents = 0,
        data = 0;

    if (type_document === "Приказ") {
        data = await this.getPreferencesStudentsOrganisations();
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
    this.View.OpenOrCloseLoader();
    let organisations = await this.Model.getOrganisations();
    let typesOrganisation = await this.Model.getTypesOrganisation();
    this.View.setTypesOrganisationSelect(typesOrganisation);
    this.View.setOrganisationsList(organisations, "allOrganisationsList");
    this.View.OpenOrCloseLoader();
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
    this.View.OpenOrCloseLoader();
    let practice = this.View.Practice;
    let groups = await this.Model.getDeterminedGroups(practice.groups);
    practice.groups = groups;
    await this.Model.createPractice(practice);
    this.View.OpenOrCloseLoader();
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
Controller.prototype.getPreferencesStudentsOrganisations = async function () {
    let selectedGroups = this.View.getSelectedGroups();
    let info_about_practice = this.View.getUserInfoAboutPractice();
    let practice = [],
        data = 0,
        groupsObjects = [];
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
            }
        }
    }
    return data;
};
Controller.prototype.renderDataInTable = async function () {
    this.View.OpenOrCloseLoader();
    let practice = [],
        data = 0;
    let info_about_practice = this.View.getUserInfoAboutPractice();
    practice = await this.Model.getPractice(info_about_practice);
    data = await this.getPreferencesStudentsOrganisations();
    if (data === 0) {
        practice = [];
        this.View.renderTable(data);
    } else {
        this.View.renderTable(data);
    }
    this.View.colorTable(data);
    this.View.renderInfo(practice);
    this.View.OpenOrCloseLoader();
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
    this.View.OpenOrCloseLoader();
    let student = this.View.getSelectedStudent(event);
    await this.Model.updateRequestOrganisation(student);
    await this.Model.updateRequest(student);

    student['id_status'] = REJECTED;
    await this.Model.updateRequestOrganisationByRequest(student);

    let organisation = await this.getOrganisation();
    await this.getApprovedAndNonApprovedStudents(organisation);
    this.View.OpenOrCloseLoader();
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
    this.onClickNextStepDisplayGroupsTreeView = null;
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
    document.getElementsByClassName("btn-next")[0].addEventListener('click', this.onClickNextStepDisplayGroupsTreeView);
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

function roundPlus(x, n) {
    //x - число, n - количество знаков
    if (isNaN(x) || isNaN(n)) return false;
    var m = Math.pow(10, n);
    return Math.round(x * m) / m;
}
function getWeeks(first_date, second_date) {
    let first_array = first_date.match(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/);
    let second_array = second_date.match(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/);
    let first = Date.UTC(first_array[3], first_array[2] - 1, first_array[1]);
    let second = Date.UTC(second_array[3], second_array[2] - 1, second_array[1]);
    let weeks = Math.ceil((second - first) / (1000 * 60 * 60 * 24)) / 7;
    return weeks;
}
function isInteger(num) {
    return (num ^ 0) === num;
}
View.prototype.displayGroups = function () {
    let toDate = document.getElementById("toDateInput");
    let fromDate = document.getElementById("fromDateInput");
    let toDateCalendar = document.getElementById("toDateCalendar");
    toDateCalendar.display = "none";
    fromDate.onchange = function () {
        toDateCalendar.style.display = "inline-block";
        toDate.value = "";
    };
    toDate.onchange = function () {
        let weeks = getWeeks(fromDate.value.replace(/\s+/g, '') + " 00:00", toDate.value.replace(/\s+/g, '') + " 00:00");
        let text = document.getElementById("textWeeks");
        text.style.display = "block";
        weeks = roundPlus(weeks, 1);
        text.innerHTML = "Количество недель: " + weeks;
        if (isInteger(weeks)) {
            text.setAttribute("class", "margin20 green");
        } else {
            text.setAttribute("class", "margin20 red");
        }
    };
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

View.prototype.OpenOrCloseLoader = function () {
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
        input.setAttribute("type", "number");
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
        input.setAttribute("type", "number");
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
const CONFIG = __webpack_require__(4);
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

Model.prototype.getStudentsFromLDAP = async function () {
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

Model.prototype.init = async function () {
    /*let subID = "57238bd9-36e8-4d84-8160-eb4ad957a841";
    let userToken = getUserToken(), user=0;
    if (!userToken) {
        window.location = CONFIG.no_token_location;
    } else {
        // subID = JSON.parse(atob(userToken.split('.')[1])).sub;
      user=  await this.getUserInfo(subID);
    }
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = '?userType=' + user.typeUser;*/
    await fetch('/user-cabinet' + info, params);
};

Model.prototype.getUserInfo = async function (subID) {
    let user = {};
    let result = await fetch('/proxy/core/v1/people/?uid=' + subID);
    let subject = await result.json();
    let type_user = subject._embedded.people["0"].title;
    if (type_user.length === 2) {
        type_user = subject._embedded.people["0"].title[1];
    }
    let givenName = subject._embedded.people["0"].givenName;
    let sn = subject._embedded.people["0"].sn;
    user.firstName = givenName;
    user.lastName = sn;
    user.typeUser = type_user;
    return user;
};

function getUserToken() {
    return localStorage.getItem('user-token');
}

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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    "server_port": 7777,
    "use_proxy": false,
    "supervisor_path": "/supervisor_cabinet",
    "student_path": "/student_cabinet",
    "no_token_location": "http://esb.iipo.tu-bryansk.ru/authentication/?redirect=http://esb.iipo.tu-bryansk.ru/practice/",
    "origin_location": "/practice/",
    "db": "practice",
    "proxy": "http://esb.iipo.tu-bryansk.ru"
};

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

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGRmYzQzNGEyY2VhZGM3MGMwMWI0Iiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vL2NvbmZpZy9yZWxfY29uZmlnLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1jb2xvcnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWljb25zLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1yZXNwb25zaXZlLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9zdHlsZS5jc3MiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZGZjNDM0YTJjZWFkYzcwYzAxYjQiLCJjb25zdCBDb250cm9sbGVyID0gcmVxdWlyZSAoJy4vQ29udHJvbGxlci5qcycpO1xyXG5cclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1jb2xvcnMuY3NzJyk7XHJcbnJlcXVpcmUoJy4uL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzJyk7XHJcbnJlcXVpcmUoJy4uL2Fzc2V0cy9jc3MvbWV0cm8tc2NoZW1lcy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1yZXNwb25zaXZlLmNzcycpO1xyXG5yZXF1aXJlKCcuL2xpYnMvRGF0YVRhYmxlcy9kYXRhdGFibGVzLm1pbi5jc3MnKTtcclxucmVxdWlyZSAoJy4uL2Fzc2V0cy9jc3Mvc3R5bGUuY3NzJyk7XHJcblxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICBuZXcgQ29udHJvbGxlcigpO1xyXG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL21haW4uanMiLCJjb25zdCBWaWV3ID0gcmVxdWlyZSgnLi9WaWV3LmpzJyk7XHJcbmNvbnN0IE1vZGVsID0gcmVxdWlyZSgnLi9Nb2RlbC5qcycpO1xyXG5cclxuZnVuY3Rpb24gQ29udHJvbGxlcigpIHtcclxuICAgIHRoaXMuVmlldyA9IG5ldyBWaWV3KCk7XHJcbiAgICB0aGlzLk1vZGVsID0gbmV3IE1vZGVsKCk7XHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuY29uc3QgQVBQUk9WRUQgPSAxO1xyXG5jb25zdCBSRUpFQ1RFRCA9IDI7XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmluaXQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkZXIoKTtcclxuICAgLy8gYXdhaXQgdGhpcy5Nb2RlbC5pbml0KCk7XHJcbiAgICBhd2FpdCB0aGlzLnNldFllYXJzKCk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja05leHRTdGVwRGlzcGxheUdyb3Vwc1RyZWVWaWV3ID0gdGhpcy5kaXNwbGF5R3JvdXBzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZVByYWN0aWNlID0gdGhpcy5nb1RvUHJhY3RpY2VDcmVhdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tBZGRQcmFjdGljZSA9IHRoaXMuY3JlYXRlUHJhY3RpY2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IHRoaXMuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uLmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uID0gdGhpcy5nb1RvU3R1ZGVudHNTZWN0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0ZpbmlzaEJ0biA9IHRoaXMuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rID0gdGhpcy5yZW5kZXJEYXRhSW5UYWJsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tZZWFyc0FycmF5ID0gdGhpcy5zZXRHcm91cHNUcmVlVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tHZXRPcmdhbmlzYXRpb25zID0gdGhpcy5nZXRPcmdhbmlzYXRpb25zLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbiA9IHRoaXMudXBkYXRlVHJlZVZpZXcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrRGlzcGxheUluZm9BYm91dE9yZyA9IHRoaXMuZGlzcGxheUluZm9BYm91dE9yZy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tEaXNwbGF5T3JnYW5pc2F0aW9ucyA9IHRoaXMuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uLmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0VkaXRPcmdhbmlzYXRpb24gPSB0aGlzLnNob3dEaWFsb2dFZGl0T3JnYW5pc2F0aW9uLmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1VwZGF0ZU9yZ2FuaXNhdGlvbiA9IHRoaXMudXBkYXRlT3JnYW5pc2F0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0FwcHJvdmVTdHVkZW50ID0gdGhpcy5jaGFuZ2VTdHVkZW50U3RhdHVzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1JlamVjdFN0dWRlbnQgPSB0aGlzLmNoYW5nZVN0dWRlbnRTdGF0dXMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZyA9IHRoaXMuYWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZy5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tBZGRTdHVkZW50VG9PcmdhbmlzYXRpb24gPSB0aGlzLmFkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbi5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tTaG93RGlhbG9nR2VuZXJhdGVEb2N1bWVudCA9IHRoaXMuc2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQuYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrR2VuZXJhdGVEb2N1bWVudCA9IHRoaXMuZ2VuZXJhdGVEb2N1bWVudC5iaW5kKFxyXG4gICAgICAgIHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2hhbmdlVHlwZURvY3VtZW50ID0gdGhpcy5pbml0RGlhbG9nLmJpbmQoXHJcbiAgICAgICAgdGhpcyk7XHJcbiAgICB0aGlzLlZpZXcuaW5pdCgpO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5nZXRTdHVkZW50c0Zyb21MREFQKCk7XHJcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkZXIoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmluaXREaWFsb2cgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgdHlwZV9kb2N1bWVudCA9IHRoaXMuVmlldy5nZXRTZWxlY3RWYWx1ZShcImdkdHlwZURvY3VtZW50XCIpO1xyXG4gICAgbGV0IGlzT3JkZXIgPSBmYWxzZTtcclxuICAgIGlmICh0eXBlX2RvY3VtZW50ID09PSBcItCf0YDQuNC60LDQt1wiKSB7XHJcbiAgICAgICAgaXNPcmRlciA9IHRydWU7XHJcbiAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZUlucHV0cyhpc09yZGVyKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlzT3JkZXIgPSBmYWxzZTtcclxuICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZUlucHV0cyhpc09yZGVyKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmNyZWF0ZUlucHV0cyA9YXN5bmMgIGZ1bmN0aW9uIChpc09yZGVyKSB7XHJcbiAgICBsZXQgc2VsZWN0ZWRHcm91cHMgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRHcm91cHMoKTtcclxuICAgIGlmIChpc09yZGVyKSB7Ly/Qv9GA0LjQutCw0LdcclxuICAgICAgICBsZXQgYmxvY2sgPSB0aGlzLlZpZXcuZ2V0RWxlbUJ5SWQoXCJncm91cHMtcmVwb3J0LWJsb2NrXCIpO1xyXG4gICAgICAgIHRoaXMuVmlldy5yZW1vdmVDaGlsZHJlbihibG9jayk7XHJcbiAgICAgICAgdGhpcy5WaWV3LmNoYW5nZURpc3BsYXkoXCJyZXBvcnQtYmxvY2tcIiwgXCJub25lXCIpO1xyXG4gICAgICAgIHRoaXMuVmlldy5jaGFuZ2VEaXNwbGF5KFwib3JkZXItYmxvY2tcIiwgXCJibG9ja1wiKTtcclxuICAgICAgICB0aGlzLlZpZXcuY3JlYXRlSW5wdXRzT3JkZXIoc2VsZWN0ZWRHcm91cHMpO1xyXG4gICAgICAgIHRoaXMuVmlldy5jaGFuZ2VJbm5lckh0bWwoXCJ0eXBlRG9jdW1lbnRcIiwgXCLQv9GA0LjQutCw0LfQsFwiKTtcclxuICAgIH1cclxuICAgIGVsc2Ugey8v0L7RgtGH0LXRglxyXG4gICAgICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xyXG4gICAgICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XHJcbiAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5WaWV3LmdldEVsZW1CeUlkKFwib3JkZXItYmxvY2tcIik7XHJcbiAgICAgICAgdGhpcy5WaWV3LnJlbW92ZUNoaWxkcmVuKGJsb2NrKTtcclxuICAgICAgICB0aGlzLlZpZXcuY3JlYXRlSW5wdXRzUmVwb3J0KHNlbGVjdGVkR3JvdXBzKTtcclxuICAgICAgICB0aGlzLlZpZXcuY2hhbmdlRGlzcGxheShcInJlcG9ydC1ibG9ja1wiLCBcImJsb2NrXCIpO1xyXG4gICAgICAgIHRoaXMuVmlldy5jaGFuZ2VEaXNwbGF5KFwib3JkZXItYmxvY2tcIiwgXCJub25lXCIpO1xyXG4gICAgICAgIHRoaXMuVmlldy5jaGFuZ2VJbm5lckh0bWwoXCJ0eXBlRG9jdW1lbnRcIiwgXCLQvtGC0YfQtdGC0LBcIik7XHJcbiAgICAgICAgbGV0IG9yZ2FuaXNhdGlvbnM9YXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25zQnlQcmFjdGljZUlkKHByYWN0aWNlKTtcclxuICAgICAgICB0aGlzLlZpZXcuZmlsbERpYWxvZyhwcmFjdGljZSxvcmdhbmlzYXRpb25zKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnNob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGxldCBncm91cHNQcmFjdGljZVBhcnRpY2lwYW50cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0R3JvdXBzQnlQcmFjdGljZUlkKFxyXG4gICAgICAgICAgICBwcmFjdGljZSk7XHJcbiAgICAgICAgaWYgKGdyb3Vwc1ByYWN0aWNlUGFydGljaXBhbnRzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLlZpZXcuZGlhbG9nT3BlbihcIiNkaWFsb2dHZW5lcmF0ZVJlcG9ydFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBhbGVydChcItCf0YDQsNC60YLQutC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIhINCU0LvRjyDQs9C10L3QtdGA0LDRhtC40Lgg0LTQvtC60YPQvNC10L3RgtCwINC/0YDQsNC60YLQuNC60LAg0LTQu9GPINCy0YvQsdGA0LDQvdC90YvRhSDQs9GA0YPQv9C/INC00L7Qu9C20L3QsCDRgdGD0YnQtdGB0YLQstC+0LLQsNGC0YwuXCIpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2VuZXJhdGVEb2N1bWVudCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzZWxlY3RlZEdyb3VwcyA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZEdyb3VwcygpO1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgbGV0IHR5cGVfZG9jdW1lbnQgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0VmFsdWUoXCJnZHR5cGVEb2N1bWVudFwiKTtcclxuICAgIGxldCBkb2N1bWVudHMgPSAwLGRhdGE9MDtcclxuXHJcbiAgICBpZiAodHlwZV9kb2N1bWVudCA9PT0gXCLQn9GA0LjQutCw0LdcIikge1xyXG4gICAgICAgIGRhdGE9YXdhaXQgdGhpcy5nZXRQcmVmZXJlbmNlc1N0dWRlbnRzT3JnYW5pc2F0aW9ucygpO1xyXG4gICAgICAgIGxldCBvcmdhbmlzYXRpb25zPWF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uc0J5UHJhY3RpY2VJZChwcmFjdGljZSk7XHJcbiAgICAgICAgZG9jdW1lbnRzID0gdGhpcy5WaWV3LmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnRPcmRlcihwcmFjdGljZSwgc2VsZWN0ZWRHcm91cHMsIHRoaXMuTW9kZWwuR3JvdXBzLGRhdGEsb3JnYW5pc2F0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBsZXQgb3JnYW5pc2F0aW9ucz1hd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbnNCeVByYWN0aWNlSWQocHJhY3RpY2UpO1xyXG4gICAgICAgIGRvY3VtZW50cyA9IHRoaXMuVmlldy5nZXRJbmZvcm1hdGlvbkZvckRvY3VtZW50UmVwb3J0KHByYWN0aWNlLCBzZWxlY3RlZEdyb3VwcywgdGhpcy5Nb2RlbC5Hcm91cHMsb3JnYW5pc2F0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb2N1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBhd2FpdCB0aGlzLk1vZGVsLmdlbmVyYXRlRG9jdW1lbnQoZG9jdW1lbnRzW2ldLCB0eXBlX2RvY3VtZW50LCBpbmZvX2Fib3V0X3ByYWN0aWNlLnR5cGVQcmFjdGljZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5hZGRTdHVkZW50VG9PcmdhbmlzYXRpb25TaG93RGlhbG9nID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0Q29uZmlndXJhdGlvblByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgbGV0IHVpZHNHcm91cHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldEdyb3Vwc0J5UHJhY3RpY2VJZChwcmFjdGljZSk7XHJcbiAgICBsZXQgbmFtZXNHcm91cHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldEdyb3Vwc05hbWVCeUdyb3Vwc1VJRCh1aWRzR3JvdXBzKTtcclxuICAgIHRoaXMuVmlldy5kaWFsb2dFbmFibGVDaGVja2JveGVzKG5hbWVzR3JvdXBzLFxyXG4gICAgICAgIFwiZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDEtZGlhbG9nQWRkLWJhY2hlbG9yXCIpO1xyXG4gICAgdGhpcy5WaWV3LmRpYWxvZ0VuYWJsZUNoZWNrYm94ZXMobmFtZXNHcm91cHMsXHJcbiAgICAgICAgXCJncm91cC10cmVldmlldy10YWJjb250cm9sMi1kaWFsb2dBZGQtbWFzdGVyXCIpO1xyXG4gICAgdGhpcy5WaWV3LmRpYWxvZ09wZW4oXCIjZGlhbG9nQWRkU3R1ZGVudFwiKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmFkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzdHVkZW50cyA9IGF3YWl0IHRoaXMuVmlldy5nZXRTZWxlY3RlZFN0dWRlbnRzKGV2ZW50KTtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25QcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldE5hbWVPcmdhbmlzYXRpb25JblRyZWV2aWV3KFxyXG4gICAgICAgIFwib3JnYW5pc2F0aW9uTGlzdFwiKTtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbkJ5TmFtZShuYW1lT3JnYW5pc2F0aW9uKTtcclxuICAgIGxldCByZXF1ZXN0cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdEJ5U3R1ZGVudFVJRFMocHJhY3RpY2UsXHJcbiAgICAgICAgc3R1ZGVudHMpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcmVxdWVzdHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKHN0dWRlbnRzW2ldLnVpZCA9PT0gcmVxdWVzdHNbal0udWlkX3N0dWRlbnQpIHtcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRzW2ldWydpZF9yZXF1ZXN0J10gPSByZXF1ZXN0c1tqXS5pZF9yZXF1ZXN0O1xyXG4gICAgICAgICAgICAgICAgc3R1ZGVudHNbaV1bJ2lkX3ByYWN0aWNlJ10gPSBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRzW2ldWydpZF9vcmdhbmlzYXRpb24nXSA9IG9yZ2FuaXNhdGlvbi5pZDtcclxuICAgICAgICAgICAgICAgIHN0dWRlbnRzW2ldWydpZF9zdGF0dXMnXSA9IEFQUFJPVkVEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0c09yZ2FuaXNhdGlvbihzdHVkZW50cyk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RzKHN0dWRlbnRzKTtcclxuXHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN0dWRlbnRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgc3R1ZGVudHNbal1bJ2lkX3N0YXR1cyddID0gUkVKRUNURUQ7XHJcbiAgICB9XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RzT3JnYW5pc2F0aW9uQnlSZXF1ZXN0KHN0dWRlbnRzKTtcclxuICAgIGF3YWl0IHRoaXMuZ2V0QXBwcm92ZWRBbmROb25BcHByb3ZlZFN0dWRlbnRzKG9yZ2FuaXNhdGlvbik7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5zZXRZZWFycyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCB5ZWFycyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2VZZWFycygpO1xyXG4gICAgdGhpcy5WaWV3LnNldFllYXJzQXJyYXkoeWVhcnMpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0KHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zTGlzdChvcmdhbmlzYXRpb25zLCBcImFsbE9yZ2FuaXNhdGlvbnNMaXN0XCIpO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nb1RvU3R1ZGVudHNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmdvVG9TdHVkZW50c1NlY3Rpb24oKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9QcmFjdGljZUNyZWF0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcclxuICAgIHRoaXMuVmlldy5jbGVhclByYWN0aWNlU2VjdGlvbigpO1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0KHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5nb1RvUHJhY3RpY2VDcmVhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LmNsZWFyVHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvbih0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xyXG4gICAgdGhpcy5WaWV3LnNldE9yZ2FuaXNhdGlvbnNJblRyZWVWaWV3KG9yZ2FuaXNhdGlvbnMsIHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHJldHVybiB0eXBlc09yZ2FuaXNhdGlvbjtcclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRJbmZvTmV3T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZU9yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb24pO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5zaG93RGlhbG9nRWRpdE9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IGlkT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldElkT3JnYW5pc2F0aW9uKGV2ZW50KTtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbkJ5SWQoaWRPcmdhbmlzYXRpb24pO1xyXG4gICAgdGhpcy5WaWV3LnNob3dEaWFsb2dPcmdhbmlzYXRpb24ob3JnYW5pc2F0aW9uKTtcclxufTtcclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5kaXNwbGF5R3JvdXBzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmRpc3BsYXlHcm91cHMoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCgpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuY3JlYXRlTmV3T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRJbmZvTmV3T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmNyZWF0ZU9yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb24pO1xyXG5cclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBhd2FpdCB0aGlzLmNyZWF0ZU5ld09yZ2FuaXNhdGlvbigpO1xyXG4gICAgYXdhaXQgdGhpcy51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5jcmVhdGVQcmFjdGljZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRlcigpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gdGhpcy5WaWV3LlByYWN0aWNlO1xyXG4gICAgbGV0IGdyb3VwcyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0RGV0ZXJtaW5lZEdyb3VwcyhwcmFjdGljZS5ncm91cHMpO1xyXG4gICAgcHJhY3RpY2UuZ3JvdXBzID0gZ3JvdXBzO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5jcmVhdGVQcmFjdGljZShwcmFjdGljZSk7XHJcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkZXIoKTtcclxuICAgYXdhaXQgIHRoaXMuc2V0WWVhcnMoKTtcclxuICAgIHRoaXMuZ29Ub1N0dWRlbnRzU2VjdGlvbigpO1xyXG59O1xyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNUVURFTlRTIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlckdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5kaXN0cmlidXRlR3JvdXBzQnlDb3Vyc2VzKHRoaXMuVmlldy5zZWxlY3RlZFllYXIpO1xyXG4gICAgYXdhaXQgdGhpcy5WaWV3LmNsZWFyR3JvdXBzVHJlZVZpZXcoKTtcclxuICAgIGF3YWl0IHRoaXMuVmlldy51cGRhdGVHcm91cHNUcmVlVmlldyh0aGlzLk1vZGVsLkNvdXJzZXMsIHRoaXMuTW9kZWwuR3JvdXBzKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldEdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB0aGlzLlZpZXcudXBkYXRlWWVhcihldmVudCk7XHJcbiAgICBpZiAodGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9PT0gXCIrXCIpIHtcclxuICAgICAgICB0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID0gdGhpcy5Nb2RlbC5nZXRDdXJyZW50WWVhcigpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuZ29Ub1ByYWN0aWNlQ3JlYXRpb24oKTtcclxuICAgIH1cclxuICAgIGF3YWl0IHRoaXMucmVuZGVyR3JvdXBzVHJlZVZpZXcoKTtcclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0UHJlZmVyZW5jZXNTdHVkZW50c09yZ2FuaXNhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgc2VsZWN0ZWRHcm91cHMgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRHcm91cHMoKTtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gW10sIGRhdGEgPSAwLCBncm91cHNPYmplY3RzID0gW107XHJcbiAgICBpZiAoc2VsZWN0ZWRHcm91cHMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLk1vZGVsLkdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLk1vZGVsLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cHNPYmplY3RzLnB1c2godGhpcy5Nb2RlbC5Hcm91cHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZ3JvdXBzUHJhY3RpY2VQYXJ0aWNpcGFudHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldEdyb3Vwc0J5UHJhY3RpY2VJZChcclxuICAgICAgICAgICAgICAgIHByYWN0aWNlKTtcclxuICAgICAgICAgICAgc2VsZWN0ZWRHcm91cHMgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHNQcmFjdGljZVBhcnRpY2lwYW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHNPYmplY3RzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCtncm91cHNQcmFjdGljZVBhcnRpY2lwYW50c1tpXS51aWRfZ3JvdXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPT09IGdyb3Vwc09iamVjdHNbal0udWlkX0xEQVApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRHcm91cHMucHVzaChncm91cHNPYmplY3RzW2pdLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucztcclxuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdHMocHJhY3RpY2UsIGdyb3Vwc09iamVjdHMpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5Nb2RlbC5hc3Nvc2lhdGVSZXF1ZXN0VG9TdHVkZW50KHJlcXVlc3RzLCBzZWxlY3RlZEdyb3Vwcyk7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0c19vcmdhbmlzYXRpb25zID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRSZXF1ZXN0c09yZ2FuaXNhdGlvbnMoXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRHcm91cHMpO1xyXG4gICAgICAgICAgICAgICAgZGF0YSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0RGF0YShzZWxlY3RlZEdyb3VwcywgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbn07XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlckRhdGFJblRhYmxlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XHJcbiAgICAgbGV0IHByYWN0aWNlID0gW10sIGRhdGEgPSAwO1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XHJcbiAgICBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XHJcbiAgICAgZGF0YT0gIGF3YWl0IHRoaXMuZ2V0UHJlZmVyZW5jZXNTdHVkZW50c09yZ2FuaXNhdGlvbnMoKTtcclxuICAgIGlmIChkYXRhID09PSAwKSB7XHJcbiAgICAgICAgcHJhY3RpY2UgPSBbXTtcclxuICAgICAgICB0aGlzLlZpZXcucmVuZGVyVGFibGUoZGF0YSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLlZpZXcucmVuZGVyVGFibGUoZGF0YSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLlZpZXcuY29sb3JUYWJsZShkYXRhKTtcclxuICAgIHRoaXMuVmlldy5yZW5kZXJJbmZvKHByYWN0aWNlKTtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRlcigpO1xyXG59O1xyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09T1JHQU5JU0FUSU9OUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0QXBwcm92ZWRBbmROb25BcHByb3ZlZFN0dWRlbnRzID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbikge1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0Q29uZmlndXJhdGlvblByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgbGV0IGFwcHJvdmVkX3N0dWRlbnRfY291bnQgPSAwLCBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9IDA7XHJcbiAgICBpZiAocHJhY3RpY2UubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9IGF3YWl0IHRoaXMucmVuZGVyU3R1ZGVudExpc3Qob3JnYW5pc2F0aW9uLFxyXG4gICAgICAgICAgICBwcmFjdGljZSwgXCJhcHByb3ZlZFN0dWRlbnRzXCIpO1xyXG4gICAgICAgIG5vbl9hcHByb3ZlZF9zdHVkZW50X2NvdW50ID0gYXdhaXQgdGhpcy5yZW5kZXJTdHVkZW50TGlzdChvcmdhbmlzYXRpb24sXHJcbiAgICAgICAgICAgIHByYWN0aWNlLCBcIm5vbkFwcHJvdmVkU3R1ZGVudHNcIik7XHJcbiAgICB9XHJcbiAgICB0aGlzLlZpZXcudXBkYXRlT3JnYW5pc2F0aW9uVGl0bGUob3JnYW5pc2F0aW9uLm5hbWUsIGFwcHJvdmVkX3N0dWRlbnRfY291bnQsXHJcbiAgICAgICAgbm9uX2FwcHJvdmVkX3N0dWRlbnRfY291bnQpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZGlzcGxheUluZm9BYm91dE9yZyA9IGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IG5hbWVPcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRPcmdhbmlzYXRpb24oZXZlbnQpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlOYW1lKG5hbWVPcmdhbmlzYXRpb24pO1xyXG4gICAgYXdhaXQgdGhpcy5nZXRBcHByb3ZlZEFuZE5vbkFwcHJvdmVkU3R1ZGVudHMob3JnYW5pc2F0aW9uKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlclN0dWRlbnRMaXN0ID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbiwgcHJhY3RpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkTGlzdCkge1xyXG4gICAgbGV0IHN0YXR1cztcclxuICAgIGlmIChpZExpc3QgPT09IFwiYXBwcm92ZWRTdHVkZW50c1wiKSB7XHJcbiAgICAgICAgc3RhdHVzID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN0YXR1cyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgbGV0IHN0dWRlbnRzSW5mbyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdHNCeU9yZ2FuaXNhdGlvbk5hbWUoXHJcbiAgICAgICAgb3JnYW5pc2F0aW9uLCBwcmFjdGljZSwgc3RhdHVzKTtcclxuICAgIGxldCBzdHVkZW50cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0U3R1ZGVudHNCeVVJRChzdHVkZW50c0luZm8pO1xyXG4gICAgdGhpcy5WaWV3LnVwZGF0ZVN0dWRlbnRzTGlzdFZpZXcoc3R1ZGVudHMsIGlkTGlzdCk7XHJcbiAgICByZXR1cm4gc3R1ZGVudHMubGVuZ3RoO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25QcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICAgIGxldCBvcmdhbmlzYXRpb25zID0gMDtcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBvcmdhbmlzYXRpb25zID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25zQnlQcmFjdGljZUlkKHByYWN0aWNlKTtcclxuICAgIH1cclxuICAgIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zTGlzdChvcmdhbmlzYXRpb25zLCBcIm9yZ2FuaXNhdGlvbkxpc3RcIik7XHJcbiAgICB0aGlzLlZpZXcucmVuZGVyT3JnYW5pc2F0aW9uU2VjdGlvbihwcmFjdGljZSk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXROYW1lT3JnYW5pc2F0aW9uQnlUaXRsZSgpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlOYW1lKG5hbWVPcmdhbmlzYXRpb24pO1xyXG4gICAgcmV0dXJuIG9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmNoYW5nZVN0dWRlbnRTdGF0dXMgPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRlcigpO1xyXG4gICAgbGV0IHN0dWRlbnQgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRTdHVkZW50KGV2ZW50KTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlUmVxdWVzdE9yZ2FuaXNhdGlvbihzdHVkZW50KTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlUmVxdWVzdChzdHVkZW50KTtcclxuXHJcbiAgICBzdHVkZW50WydpZF9zdGF0dXMnXSA9IFJFSkVDVEVEO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0T3JnYW5pc2F0aW9uQnlSZXF1ZXN0KHN0dWRlbnQpO1xyXG5cclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLmdldE9yZ2FuaXNhdGlvbigpO1xyXG4gICAgYXdhaXQgdGhpcy5nZXRBcHByb3ZlZEFuZE5vbkFwcHJvdmVkU3R1ZGVudHMob3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRlcigpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvQ29udHJvbGxlci5qcyIsImNvbnN0IGJhY2hlbG9yWWVhciA9IDQ7XHJcbmNvbnN0IG1hc3RlclllYXIgPSA2O1xyXG5sZXQgc2VsZWN0ZWRFbGVtID0gMDtcclxuXHJcbnZhciBWaWV3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5pbmZvR3JvdXBzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0JzQntCQXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwMi4wMy4wMyDCq9Cc0LDRgtC10LzQsNGC0LjRh9C10YHQutC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQuCDQsNC00LzQuNC90LjRgdGC0YDQuNGA0L7QstCw0L3QuNC1INC40L3RhNC+0YDQvNCw0YbQuNC+0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQotC10YXQvdC+0LvQvtCz0LjRjyDQv9GA0L7Qs9GA0LDQvNC80LjRgNC+0LLQsNC90LjRj8K7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0J/QoNCYXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wMy4wNCDCq9Cf0YDQvtCz0YDQsNC80LzQvdCw0Y8g0LjQvdC20LXQvdC10YDQuNGPwrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQoNCw0LfRgNCw0LHQvtGC0LrQsCDQv9GA0L7Qs9GA0LDQvNC80L3Qvi3QuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0JjQktCiLTFcIixcclxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQn9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90L7QuSDRgtC10YXQvdC40LrQuCDQuCDQsNCy0YLQvtC80LDRgtC40LfQuNGA0L7QstCw0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYmFjaGVsb3JcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQmNCS0KItMlwiLFxyXG4gICAgICAgICAgICBcImZ1bGxOYW1lXCI6IFwiMDkuMDMuMDEgwqvQmNC90YTQvtGA0LzQsNGC0LjQutCwINC4INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdCw0Y8g0YLQtdGF0L3QuNC60LDCu1wiLFxyXG4gICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Cf0YDQvtCz0YDQsNC80LzQvdC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QvtC5INGC0LXRhdC90LjQutC4INC4INCw0LLRgtC+0LzQsNGC0LjQt9C40YDQvtCy0LDQvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJiYWNoZWxvclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcItCY0JLQoi0zXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wMy4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXHJcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0J/QoNCYICjQvNCzKVwiLFxyXG4gICAgICAgICAgICBcImZ1bGxOYW1lXCI6IFwiMDkuMDQuMDQgwqvQn9GA0L7Qs9GA0LDQvNC80L3QsNGPINC40L3QttC10L3QtdGA0LjRj8K7XCIsXHJcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0J/RgNC+0LXQutGC0LjRgNC+0LLQsNC90LjQtSDQv9GA0L7Qs9GA0LDQvNC80L3Qvi3QuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1hc3RlclwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIFwibmFtZVwiOiBcItCY0JLQoi0xICjQvNCzKVwiLFxyXG4gICAgICAgICAgICBcImZ1bGxOYW1lXCI6IFwiMDkuMDQuMDEgwqvQmNC90YTQvtGA0LzQsNGC0LjQutCwINC4INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdCw0Y8g0YLQtdGF0L3QuNC60LDCu1wiLFxyXG4gICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Ca0L7QvNC/0YzRjtGC0LXRgNC90YvQuSDQsNC90LDQu9C40Lcg0Lgg0LjQvdGC0LXRgNC/0YDQtdGC0LDRhtC40Y8g0LTQsNC90L3Ri9GFwrtcIixcclxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWFzdGVyXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0JjQktCiLTIgKNC80LMpXCIsXHJcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wNC4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXHJcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0JjQvdGE0L7RgNC80LDRhtC40L7QvdC90L7QtSDQuCDQv9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgICBcInR5cGVcIjogXCJtYXN0ZXJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQkdCQ0KFcIixcclxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjA0LjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcclxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQmNC90YTQvtGA0LzQsNGG0LjQvtC90L3QvtC1INC4INC/0YDQvtCz0YDQsNC80LzQvdC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgICB9XHJcbiAgICBdO1xyXG4gICAgdGhpcy5vbkNsaWNrTmV4dFN0ZXBEaXNwbGF5R3JvdXBzVHJlZVZpZXcgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQWRkUHJhY3RpY2UgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tGaW5pc2hCdG4gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrU2VsZWN0R3JvdXBCdG5PayA9IG51bGw7XHJcbiAgICB0aGlzLm15VGFibGUgPSAkKCcjc3R1ZGVudHNMaXN0VGFibGUnKTtcclxuICAgIHRoaXMub25DbGlja1llYXJzQXJyYXkgPSBudWxsO1xyXG4gICAgdGhpcy5zZWxlY3RlZFllYXIgPSBudWxsO1xyXG4gICAgdGhpcy5pZFRyZWVWaWV3cyA9IFtcclxuICAgICAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDEtYmFjaGVsb3InLFxyXG4gICAgICAgICdncm91cC10cmVldmlldy10YWJjb250cm9sMi1tYXN0ZXInLFxyXG4gICAgICAgICdncm91cHMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb24tYmFjaGVsb3InLFxyXG4gICAgICAgICdncm91cHMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb24tbWFzdGVyJyxcclxuICAgICAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDEtZGlhbG9nQWRkLWJhY2hlbG9yJyxcclxuICAgICAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItZGlhbG9nQWRkLW1hc3RlcidcclxuICAgIF07XHJcbiAgICB0aGlzLm9uQ2xpY2tHZXRPcmdhbmlzYXRpb25zID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5SW5mb0Fib3V0T3JnID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0Rpc3BsYXlPcmdhbmlzYXRpb25zID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0VkaXRPcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQXBwcm92ZVN0dWRlbnQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrUmVqZWN0U3R1ZGVudCA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tVcGRhdGVPcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZyA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tBZGRTdHVkZW50VG9PcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrU2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrR2VuZXJhdGVEb2N1bWVudCA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2hhbmdlVHlwZURvY3VtZW50ID0gbnVsbDtcclxuICAgIHRoaXMuUHJhY3RpY2UgPSBudWxsO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tbmV4dFwiKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrTmV4dFN0ZXBEaXNwbGF5R3JvdXBzVHJlZVZpZXcpO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkaWFsb2dQcmFjdGljZUNvbXBsZXRlU3VjY2Vzc1wiKS5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgIFwiI3ByYWN0aWNlRmluaXNoZWRPa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25zU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0dWRlbnRzU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1maW5pc2hcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0ZpbmlzaEJ0bik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldEdyb3Vwc0J0bk9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5MVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrWWVhcnNBcnJheSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldE9yZ2FuaXNhdGlvbnNCdG5Pa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZU9yZ2FuaXNhdGlvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJhY3RpY2VGaW5pc2hlZE9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tBZGRQcmFjdGljZSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3dBbGxPcmdhbmlzYXRpb25zXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5T3JnYW5pc2F0aW9ucyk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVwZGF0ZU9yZ2FuaXNhdGlvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrVXBkYXRlT3JnYW5pc2F0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkU3R1ZGVudEJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnRCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1Nob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2VuZXJhdGVEb2N1bWVudEJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrR2VuZXJhdGVEb2N1bWVudCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdkdHlwZURvY3VtZW50XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsXHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZVR5cGVEb2N1bWVudCk7XHJcblxyXG4gICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSh7XHJcbiAgICAgICAgZGF0YTogdGhpcy5Hcm91cHMsXHJcbiAgICAgICAgXCJsYW5ndWFnZVwiOiB7XHJcbiAgICAgICAgICAgIFwiemVyb1JlY29yZHNcIjogXCLQotCw0LrQvtC5INC30LDQv9C40YHQuCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiLFxyXG4gICAgICAgICAgICBcImVtcHR5VGFibGVcIjogXCLQndC4INC+0LTQvdCwINC40Lcg0LPRgNGD0L/QvyDQvdC1INCy0YvQsdGA0LDQvdCwINC70LjQsdC+INC/0YDQsNC60YLQuNC60Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIixcclxuICAgICAgICAgICAgXCJzZWFyY2hcIjogXCLQn9C+0LjRgdC6OlwiLFxyXG4gICAgICAgICAgICBcInBhZ2luYXRlXCI6IHtcclxuICAgICAgICAgICAgICAgIFwiZmlyc3RcIjogXCLQn9C10YDQstGL0LlcIixcclxuICAgICAgICAgICAgICAgIFwibGFzdFwiOiBcItCf0L7RgdC70LXQtNC90LjQuVwiLFxyXG4gICAgICAgICAgICAgICAgXCJuZXh0XCI6IFwi0JLQv9C10YDQtdC0XCIsXHJcbiAgICAgICAgICAgICAgICBcInByZXZpb3VzXCI6IFwi0J3QsNC30LDQtFwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiaW5mb0ZpbHRlcmVkXCI6IFwiKNC40LcgX01BWF8g0YHRgtGD0LTQtdC90YLQvtCyKVwiLFxyXG4gICAgICAgICAgICBcImxlbmd0aE1lbnVcIjogXCLQn9C+0LrQsNC30LDRgtGMIF9NRU5VXyDQt9Cw0L/QuNGB0LXQuVwiLFxyXG4gICAgICAgICAgICBcImluZm9cIjogXCLQntCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INGB0YLRg9C00LXQvdGC0L7QsjogX1RPVEFMXyBcIixcclxuICAgICAgICAgICAgXCJpbmZvRW1wdHlcIjogXCLQktGL0LHQtdGA0LjRgtC1INCz0YDRg9C/0L/Rgy5cIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJjb2x1bW5zXCI6IFtcclxuICAgICAgICAgICAge1wiZGF0YVwiOiBcImdyb3VwXCJ9LFxyXG4gICAgICAgICAgICB7XCJkYXRhXCI6IFwic3R1ZGVudFwifSxcclxuICAgICAgICAgICAge1wiZGF0YVwiOiBcIm9yZ2FuaXNhdGlvblwifVxyXG4gICAgICAgIF1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub1N0dWRlbnRzU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3JnYW5pc2F0aW9uc1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcblxyXG4gICAgbGV0IHRyZWVWaWV3cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmVldmlld1wiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdHJlZVZpZXdzW2ldLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ByYWN0aWNlQ3JlYXRpb25TZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvcmdhbmlzYXRpb25zU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkZW50c1JlcXVlc3RzXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxsT3JnYW5pc2F0aW9uc0xpc3RCbG9ja1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvUHJhY3RpY2VDcmVhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcclxuICAgICAgICBcInRydWVcIik7XHJcbn07XHJcblxyXG5cclxuXHJcblxyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09UFJBQ1RJQ0UgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5WaWV3LnByb3RvdHlwZS5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGZpbmlzaEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tZmluaXNoXCIpWzBdO1xyXG4gICAgZmluaXNoQnRuLnNldEF0dHJpYnV0ZShcIm9uY2xpY2tcIixcclxuICAgICAgICBcIm1ldHJvRGlhbG9nLm9wZW4oJyNkaWFsb2dQcmFjdGljZUNvbXBsZXRlU3VjY2VzcycpXCIpO1xyXG4gICAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVjYXRpb25cIikudmFsdWU7XHJcbiAgICBpZiAoZWR1Y2F0aW9uTGV2ZWwgPT09IFwiYmFjaGVsb3JcIilcclxuICAgICAgICBlZHVjYXRpb25MZXZlbCA9IFwi0JHQsNC60LDQu9Cw0LLRgNC40LDRglwiO1xyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZWR1Y2F0aW9uTGV2ZWwgPSBcItCc0LDQs9C40YHRgtGA0LDRgtGD0YDQsFwiO1xyXG4gICAgfVxyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlXCIpLnZhbHVlO1xyXG5cclxuICAgIGxldCBsZWNOdW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY051bVwiKS52YWx1ZTtcclxuICAgIGxldCBmcm9tRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJvbURhdGVJbnB1dFwiKS52YWx1ZTtcclxuICAgIGxldCB0b0RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvRGF0ZUlucHV0XCIpLnZhbHVlO1xyXG4gICAgbGV0IGRlYWRsaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVybXNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSAnYyAnICsgZnJvbURhdGVcclxuICAgICAgICArICcg0L/QviAnICsgdG9EYXRlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGRlYWRsaW5lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBmcm9tRGF0ZVxyXG4gICAgICAgICsgJyAtICcgKyB0b0RhdGU7XHJcbiAgICBpZiAoZnJvbURhdGUgPT09IFwiXCIpIHtcclxuICAgICAgICBmcm9tRGF0ZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmcm9tRGF0ZSA9IGZyb21EYXRlLnN1YnN0cig4LCA0KSArICctJyArIGZyb21EYXRlLnN1YnN0cig0LCAyKSArICctJ1xyXG4gICAgICAgICAgICArIGZyb21EYXRlLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICAgIH1cclxuICAgIGlmICh0b0RhdGUgPT09IFwiXCIpIHtcclxuICAgICAgICB0b0RhdGUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdG9EYXRlID0gdG9EYXRlLnN1YnN0cig4LCA0KSArICctJyArIHRvRGF0ZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICAgICAgKyB0b0RhdGUuc3Vic3RyKDAsIDIpICsgJyAnICsgJzIxOjAwOjAwLjAwMCArMDA6MDAnO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlYWRsaW5lID09PSBcIlwiKSB7XHJcbiAgICAgICAgZGVhZGxpbmUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZGVhZGxpbmUgPSBkZWFkbGluZS5zdWJzdHIoOCwgNCkgKyAnLScgKyBkZWFkbGluZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICAgICAgKyBkZWFkbGluZS5zdWJzdHIoMCwgMikgKyAnICcgKyAnMjE6MDA6MDAuMDAwICswMDowMCc7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHRyZWVWaWV3ID0gbnVsbDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJwcmFjdGljZVwiKSAhPT0gLTFcclxuICAgICAgICAgICAgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheVxyXG4gICAgICAgICAgICA9PT0gXCJibG9ja1wiKSB7XHJcbiAgICAgICAgICAgIHRyZWVWaWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IGFyckdyb3VwcyA9IHRoaXMuZ2V0U2VsZWN0ZWRHcm91cHModHJlZVZpZXcpO1xyXG4gICAgbGV0IGFyck9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldFNlbGVjdGVkR3JvdXBzKFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eXBlUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJlZHVjYXRpb25hbExldmVsRGlhbG9nXCIpLmlubmVySFRNTCA9IGVkdWNhdGlvbkxldmVsO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncm91cHNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJHcm91cHM7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBcIm9yZ2FuaXNhdGlvbnNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJPcmdhbmlzYXRpb25zO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2VcclxuICAgICAgICArIFwiINC/0YDQsNC60YLQuNC60LBcIjtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY051bURpYWxvZ1wiKS5pbm5lckhUTUwgPSBsZWNOdW07XHJcbiAgICB0aGlzLlByYWN0aWNlID0ge1xyXG4gICAgICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAgICAgJ3N0YXJ0RGF0ZVByYWN0aWNlJzogZnJvbURhdGUsXHJcbiAgICAgICAgJ2VuZERhdGVQcmFjdGljZSc6IHRvRGF0ZSxcclxuICAgICAgICAnZGVhZGxpbmVQcmFjdGljZSc6IGRlYWRsaW5lLFxyXG4gICAgICAgICdsZWNOdW0nOiBsZWNOdW0sXHJcbiAgICAgICAgJ2VkdUxldmVsJzogZWR1Y2F0aW9uTGV2ZWwsXHJcbiAgICAgICAgJ29yZ2FuaXNhdGlvbnMnOiBhcnJPcmdhbmlzYXRpb25zLFxyXG4gICAgICAgICdncm91cHMnOiBhcnJHcm91cHMsXHJcbiAgICAgICAgJ3llYXInOiB0aGlzLnNlbGVjdGVkWWVhclxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5QcmFjdGljZTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHJvdW5kUGx1cyh4LCBuKSB7IC8veCAtINGH0LjRgdC70L4sIG4gLSDQutC+0LvQuNGH0LXRgdGC0LLQviDQt9C90LDQutC+0LJcclxuICAgIGlmKGlzTmFOKHgpIHx8IGlzTmFOKG4pKSByZXR1cm4gZmFsc2U7XHJcbiAgICB2YXIgbSA9IE1hdGgucG93KDEwLG4pO1xyXG4gICAgcmV0dXJuIE1hdGgucm91bmQoeCptKS9tO1xyXG59XHJcbmZ1bmN0aW9uIGdldFdlZWtzKGZpcnN0X2RhdGUsIHNlY29uZF9kYXRlKXtcclxuICAgIGxldCBmaXJzdF9hcnJheSA9IGZpcnN0X2RhdGUubWF0Y2goLyhcXGR7Mn0pXFwuKFxcZHsyfSlcXC4oXFxkezR9KSAoXFxkezJ9KTooXFxkezJ9KS8pO1xyXG4gICAgbGV0ICAgc2Vjb25kX2FycmF5ID0gc2Vjb25kX2RhdGUubWF0Y2goLyhcXGR7Mn0pXFwuKFxcZHsyfSlcXC4oXFxkezR9KSAoXFxkezJ9KTooXFxkezJ9KS8pO1xyXG4gICAgbGV0IGZpcnN0ID0gRGF0ZS5VVEMoZmlyc3RfYXJyYXlbM10sIGZpcnN0X2FycmF5WzJdLTEsIGZpcnN0X2FycmF5WzFdKTtcclxuICAgIGxldCBzZWNvbmQgPSBEYXRlLlVUQyhzZWNvbmRfYXJyYXlbM10sIHNlY29uZF9hcnJheVsyXS0xLCBzZWNvbmRfYXJyYXlbMV0pO1xyXG4gICAgbGV0IHdlZWtzID0gKE1hdGguY2VpbCgoc2Vjb25kIC0gZmlyc3QpLygxMDAwKjYwKjYwKjI0KSkpLzc7XHJcbiAgICByZXR1cm4gd2Vla3M7XHJcbn1cclxuZnVuY3Rpb24gaXNJbnRlZ2VyKG51bSkge1xyXG4gICAgcmV0dXJuIChudW0gXiAwKSA9PT0gbnVtO1xyXG59XHJcblZpZXcucHJvdG90eXBlLmRpc3BsYXlHcm91cHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgdG9EYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVJbnB1dFwiKTtcclxuICAgIGxldCBmcm9tRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJvbURhdGVJbnB1dFwiKTtcclxuICAgIGxldCB0b0RhdGVDYWxlbmRhcj0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVDYWxlbmRhclwiKTtcclxuICAgIHRvRGF0ZUNhbGVuZGFyLmRpc3BsYXk9XCJub25lXCI7XHJcbiAgICBmcm9tRGF0ZS5vbmNoYW5nZSAgID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdG9EYXRlQ2FsZW5kYXIuc3R5bGUuZGlzcGxheT1cImlubGluZS1ibG9ja1wiO1xyXG4gICAgICAgICAgICB0b0RhdGUudmFsdWU9XCJcIjtcclxuICAgIH07XHJcbiAgICB0b0RhdGUub25jaGFuZ2UgPSBmdW5jdGlvbigpXHJcbiAgICB7XHJcbiAgICAgICAgbGV0IHdlZWtzPSBnZXRXZWVrcyhmcm9tRGF0ZS52YWx1ZS5yZXBsYWNlKC9cXHMrL2csJycpK1wiIDAwOjAwXCIsdG9EYXRlLnZhbHVlLnJlcGxhY2UoL1xccysvZywnJykrXCIgMDA6MDBcIik7XHJcbiAgICAgICAgbGV0IHRleHQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXh0V2Vla3NcIik7XHJcbiAgICAgICAgdGV4dC5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIjtcclxuICAgICAgICB3ZWVrcz1yb3VuZFBsdXMod2Vla3MsIDEpO1xyXG4gICAgICAgIHRleHQuaW5uZXJIVE1MPVwi0JrQvtC70LjRh9C10YHRgtCy0L4g0L3QtdC00LXQu9GMOiBcIiArd2Vla3M7XHJcbiAgICAgICAgaWYoaXNJbnRlZ2VyKHdlZWtzKSl7XHJcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcIm1hcmdpbjIwIGdyZWVuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0ZXh0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXCJtYXJnaW4yMCByZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1Y2F0aW9uXCIpLnZhbHVlO1xyXG4gICAgaWYgKGVkdWNhdGlvbkxldmVsID09PSBcImJhY2hlbG9yXCIpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcIm1hc3RlclwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJiYWNoZWxvclwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn07XHJcblZpZXcucHJvdG90eXBlLmNsZWFyUHJhY3RpY2VTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcm9tRGF0ZUlucHV0XCIpLnZhbHVlID0gXCJcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9EYXRlSW5wdXRcIikudmFsdWUgPSBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZSA9IFwiXCI7XHJcbn07XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJJbmZvID0gZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBpZiAocHJhY3RpY2UubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgbGV0IHN0YXJ0X3llYXIgPSBwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlLnN1YnN0cigwLCA0KSxcclxuICAgICAgICAgICAgc3RhcnRfbW9udGggPSBwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlLnN1YnN0cig1LCAyKSxcclxuICAgICAgICAgICAgc3RhcnRfZGF5ID0gcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoOCwgMiksXHJcbiAgICAgICAgICAgIGVuZF95ZWFyID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDAsIDQpLFxyXG4gICAgICAgICAgICBlbmRfbW9udGggPSBwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoNSwgMiksXHJcbiAgICAgICAgICAgIGVuZF9kYXkgPSBwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoOCwgMik7XHJcbiAgICAgICAgbGV0IHN0YXJ0X2RhdGUgPSBzdGFydF9kYXkgKyAnLScgKyBzdGFydF9tb250aCArICctJyArIHN0YXJ0X3llYXI7XHJcbiAgICAgICAgbGV0IGVuZF9kYXRlID0gZW5kX2RheSArICctJyArIGVuZF9tb250aCArICctJyArIGVuZF95ZWFyO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUZXJtc1ByYWN0aWNlXCIpLmlubmVySFRNTCA9ICfRgSAnXHJcbiAgICAgICAgICAgICsgc3RhcnRfZGF0ZSArICcg0L/QviAnICsgZW5kX2RhdGU7XHJcbiAgICAgICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICBcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gaW5mb19hYm91dF9wcmFjdGljZS50eXBlUHJhY3RpY2VcclxuICAgICAgICAgICAgKyAnINC/0YDQsNC60YLQuNC60LAnO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VHlwZVByYWN0aWNlXCIpLmlubmVySFRNTCA9IFwi0J/RgNCw0LrRgtC40LrQuFwiXHJcbiAgICAgICAgICAgICsgXCIg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUZXJtc1ByYWN0aWNlXCIpLmlubmVySFRNTCA9IFwiIFwiO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5nZXRVc2VySW5mb0Fib3V0UHJhY3RpY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxyXG4gICAgICAgIFwidGFiY29udHJvbDJcIilbMF0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImFjdGl2ZVwiKVswXS5jaGlsZHJlblswXS50ZXh0O1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlVGFiXCIpLnZhbHVlO1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB7XHJcbiAgICAgICAgJ3R5cGVQcmFjdGljZSc6IHR5cGVQcmFjdGljZSxcclxuICAgICAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyLFxyXG4gICAgICAgICdlZHVfbGV2ZWwnOiBlZHVjYXRpb25MZXZlbFxyXG4gICAgfTtcclxuICAgIHJldHVybiBpbmZvX2Fib3V0X3ByYWN0aWNlO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlT3JnU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwic2VsZWN0RWR1TGV2ZWxPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlVGV4dCA9IFwi0KPRh9C10LHQvdCw0Y9cIjtcclxuICAgIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiZWR1Y2F0aW9uYWxcIikge1xyXG4gICAgICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiaW50ZXJuc2hpcFwiKSB7XHJcbiAgICAgICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0J/RgNC+0LjQt9Cy0L7QtNGB0YLQstC10L3QvdCw0Y9cIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJwcmVkaXBsb21hXCIpIHtcclxuICAgICAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQn9GA0LXQtNC00LjQv9C70L7QvNC90LDRj1wiO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0ge1xyXG4gICAgICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2VUZXh0LFxyXG4gICAgICAgICd5ZWFyJzogdGhpcy5zZWxlY3RlZFllYXIsXHJcbiAgICAgICAgJ2VkdV9sZXZlbCc6IGVkdWNhdGlvbkxldmVsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGluZm9fYWJvdXRfcHJhY3RpY2U7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJUYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBpZiAoZGF0YSA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkNsZWFyVGFibGUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkNsZWFyVGFibGUoKTtcclxuICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5BZGREYXRhKGRhdGEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuY29sb3JUYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoZGF0YVtpXS5zdGF0dXMgPT09IDEpIHtcclxuICAgICAgICAgICAgJCh0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKSkuYWRkQ2xhc3MoXCJhcHByb3ZlZF9zdHVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3J0aW5nXzEgYXBwcm92ZWRfc3R1ZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRhdGFbaV0uc3RhdHVzID09PSAwKSB7XHJcbiAgICAgICAgICAgICQodGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuR2V0Tm9kZXMoaSkpLmFkZENsYXNzKFwiYXBwbGllZF9zdHVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3J0aW5nXzEgYXBwbGllZF9zdHVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNoYW5nZVllYXIgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgaWYgKHNlbGVjdGVkRWxlbSkge1xyXG4gICAgICAgIHNlbGVjdGVkRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdjdXJyZW50Jyk7XHJcbiAgICB9XHJcbiAgICBzZWxlY3RlZEVsZW0gPSBub2RlO1xyXG4gICAgc2VsZWN0ZWRFbGVtLmNsYXNzTGlzdC5hZGQoJ2N1cnJlbnQnKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRZZWFyID0gc2VsZWN0ZWRFbGVtLmlubmVySFRNTDtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZVllYXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGlmICh0YXJnZXQuY2xhc3NOYW1lID09PSAnaXRlbSB5ZWFyJyB8fCB0YXJnZXQuY2xhc3NOYW1lXHJcbiAgICAgICAgICAgID09PSAnaXRlbSB5ZWFyIGN1cnJlbnQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlWWVhcih0YXJnZXQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkR3JvdXBzID0gZnVuY3Rpb24gKHRyZWVWaWV3KSB7XHJcbiAgICBpZiAodHJlZVZpZXcgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGxldCBmcmFtZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZnJhbWVzXCIpWzBdLmNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChmcmFtZXNbaV0uc3R5bGUuZGlzcGxheSAhPT0gXCJub25lXCIpIHtcclxuICAgICAgICAgICAgICAgIHRyZWVWaWV3ID0gZnJhbWVzW2ldLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgR3JvdXBzID0gW107XHJcbiAgICBsZXQgbGlOdW1iZXIgPSB0cmVlVmlldy5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaU51bWJlci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBncm91cHMgPSBsaU51bWJlcltpXS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpjaGVja2VkJyk7XHJcbiAgICAgICAgaWYgKGdyb3Vwcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBncm91cCA9IGdyb3Vwc1tqXS5wYXJlbnRFbGVtZW50Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAuaW5kZXhPZihcItC60YPRgNGBXCIpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBHcm91cHM7XHJcbn07XHJcblxyXG5hc3luYyBmdW5jdGlvbiB0cmVlX2FkZF9sZWFmX2NoZWNrYm94X2V4YW1wbGVfY2xpY2sodHJlZSwgbm9kZSwgbmFtZUxlYWYsIHVpZCkge1xyXG4gICAgYXdhaXQgdHJlZS5hZGRMZWFmKG5vZGUsIG5hbWVMZWFmLCB7XHJcbiAgICAgICAgbW9kZTogJ2NoZWNrYm94JyxcclxuICAgICAgICBjaGVja2VkOiBmYWxzZSxcclxuICAgICAgICB1aWQ6IHVpZFxyXG4gICAgfSk7XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLnJlbW92ZUNoaWxkcmVuID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGROb2RlcztcclxuICAgIHdoaWxlIChjaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgICBub2RlLnJlbW92ZUNoaWxkKGNoaWxkcmVuWzBdKTtcclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNsZWFyR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaWQgPSAwO1xyXG4gICAgd2hpbGUgKGlkIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgbGlBcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICB0aGlzLmlkVHJlZVZpZXdzW2lkXSkuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4obGlBcnJheVtpXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlkKys7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZUdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKGNvdXJzZXMsIGdyb3Vwcykge1xyXG4gICAgbGV0IGlkQ291bnRlciA9IDAsIGNvdXJzZU51bWJlciA9IGJhY2hlbG9yWWVhciwgY250O1xyXG4gICAgbGV0IGNvdXJzZXNOYW1lID0gWydmaXJzdCcsICdzZWNvbmQnLCAndGhpcmQnLCAnZm91cnRoJ107XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB3aGlsZSAoaWRDb3VudGVyIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgdHJlZSA9ICQoXCIjXCIgKyB0aGlzLmlkVHJlZVZpZXdzW2lkQ291bnRlcl0pLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGNvdXJzZU51bWJlciA9IG1hc3RlclllYXI7XHJcbiAgICAgICAgICAgIGkgPSBiYWNoZWxvclllYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb3Vyc2VOdW1iZXIgPSBiYWNoZWxvclllYXI7XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbnQgPSAwO1xyXG4gICAgICAgIGZvciAoaTsgaSA8IGNvdXJzZU51bWJlcjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY291cnNlc1tpXS5ncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlID0gdHJlZS5lbGVtZW50LmZpbmQoJ2xpLicgKyBjb3Vyc2VzTmFtZVtjbnRdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdXHJcbiAgICAgICAgICAgICAgICAgICAgPT09IFwiZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDEtZGlhbG9nQWRkLWJhY2hlbG9yXCJcclxuICAgICAgICAgICAgICAgICAgICB8fCB0aGlzLmlkVHJlZVZpZXdzW2lkQ291bnRlcl1cclxuICAgICAgICAgICAgICAgICAgICA9PT0gXCJncm91cC10cmVldmlldy10YWJjb250cm9sMi1kaWFsb2dBZGQtbWFzdGVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBub2RlWzBdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbMF0uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdXJzZXNbaV0uZ3JvdXBzW2pdKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbSA9IG5vZGUuZmluZCgndWwnKVswXS5jaGlsZHJlbltub2RlLmZpbmQoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd1bCcpWzBdLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgICQoZWxlbSkuYWRkQ2xhc3MoXCJjb2xsYXBzZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0dWRlbnRzID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGdyb3Vwcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY291cnNlc1tpXS5ncm91cHNbal0gPT09IGdyb3Vwc1trXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHVkZW50cyA9IGdyb3Vwc1trXS5zdHVkZW50cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgc3R1ZGVudHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsICQoZWxlbSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHVkZW50c1trXS5uYW1lLCBzdHVkZW50c1trXS51aWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXRzID0gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS11aWRdJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBpbnB1dHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzW2tdLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbMF0uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdXJzZXNbaV0uZ3JvdXBzW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjbnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWRDb3VudGVyKys7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLm15VXBkYXRlVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoY291cnNlcywgaWQpIHtcclxuICAgIGxldCBjb3Vyc2VOdW1iZXIgPSBiYWNoZWxvclllYXIsIG47XHJcbiAgICBsZXQgY291cnNlc05hbWUgPSBbJ2ZpcnN0JywgJ3NlY29uZCcsICd0aGlyZCcsICdmb3VydGgnXTtcclxuICAgIHZhciBpID0gMDtcclxuXHJcbiAgICB2YXIgdHJlZSA9ICQoXCIjXCIgKyBpZCkuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gICAgaWYgKGlkLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgY291cnNlTnVtYmVyID0gbWFzdGVyWWVhcjtcclxuICAgICAgICBpID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgICAgIGkgPSAwO1xyXG4gICAgfVxyXG4gICAgbiA9IDA7XHJcbiAgICBmb3IgKGk7IGkgPCBjb3Vyc2VOdW1iZXI7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY291cnNlc1tpXS5ncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IG5vZGUgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGkuJyArIGNvdXJzZXNOYW1lW25dKTtcclxuICAgICAgICAgICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsIGNvdXJzZXNbaV0uZ3JvdXBzW2pdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbisrO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgICBsZXQgZWR1TGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdUxldmVsT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB7XHJcbiAgICAgICAgJ3R5cGVQcmFjdGljZSc6IHR5cGVQcmFjdGljZSxcclxuICAgICAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyLFxyXG4gICAgICAgICdlZHVfbGV2ZWwnOiBlZHVMZXZlbFxyXG4gICAgfTtcclxuICAgIHJldHVybiBpbmZvX2Fib3V0X3ByYWN0aWNlO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gdHJlZV9hZGRfbGVhZl9jaGVja2JveCh0cmVlLCBub2RlLCBuYW1lTGVhZiwgaWRUeXBlT3JnYW5pc2F0aW9uKSB7XHJcbiAgICB0cmVlLmFkZExlYWYobm9kZSwgbmFtZUxlYWYsIHtcclxuICAgICAgICBtb2RlOiAnY2hlY2tib3gnLFxyXG4gICAgICAgIGNoZWNrZWQ6IGZhbHNlXHJcbiAgICB9KTtcclxuICAgIG5vZGUuZmluZCgndWwnKS5maW5kKCdsaScpLmxhc3QoKVswXS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCAndHlwZV9vcmdfJ1xyXG4gICAgICAgICsgaWRUeXBlT3JnYW5pc2F0aW9uKTtcclxufVxyXG5cclxuVmlldy5wcm90b3R5cGUuc2V0VHlwZXNPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAodHlwZXNPcmdhbmlzYXRpb24pIHtcclxuICAgIHZhciB0cmVlVmlld09yZ2FuaXNhdGlvbnMgPSAkKFxyXG4gICAgICAgIFwiI29yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBub2RlID0gdHJlZVZpZXdPcmdhbmlzYXRpb25zLmVsZW1lbnQuZmluZCgnbGkubm9kZScpO1xyXG4gICAgICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3godHJlZVZpZXdPcmdhbmlzYXRpb25zLCBub2RlLFxyXG4gICAgICAgICAgICB0eXBlc09yZ2FuaXNhdGlvbltpXS5uYW1lLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmNsZWFyVHlwZXNPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgbGlBcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICdvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uJykuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKGxpQXJyYXlbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0pO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5zZXRPcmdhbmlzYXRpb25zSW5UcmVlVmlldyA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlc09yZ2FuaXNhdGlvbikge1xyXG4gICAgdmFyIHRyZWUgPSAkKFwiI29yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAob3JnYW5pc2F0aW9uc1tpXS5pZF90eXBlX29yZ2FuaXNhdGlvbiA9PT0gdHlwZXNPcmdhbmlzYXRpb25bal0uaWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsaUFyciA9IHRyZWUuZWxlbWVudC5maW5kKCdsaScpO1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGxpQXJyLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpQXJyW2tdLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSAoJ3R5cGVfb3JnXydcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgdHlwZXNPcmdhbmlzYXRpb25bal0uaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgPSAkKGxpQXJyW2tdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldEluZm9OZXdPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZUNvbXBhbnlcIik7XHJcbiAgICB2YXIgdHlwZU9yZyA9IGUub3B0aW9uc1tlLnNlbGVjdGVkSW5kZXhdLnRleHQ7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0ge1xyXG4gICAgICAgICduYW1lJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICAgICAndHlwZU9yZyc6IHR5cGVPcmcsXHJcbiAgICAgICAgJ2luZm9PcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm9Db21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICdlbWFpbE9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1haWxPcmdcIikudmFsdWUsXHJcbiAgICAgICAgJ3Bob25lT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaG9uZU9yZ1wiKS52YWx1ZSxcclxuICAgICAgICAncGxhY2VzT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGFjZXNDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICdsb2dpbk9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5Db21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICdwc3dkT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwc3dkQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICAgICAnYWRkcmVzc09yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkcmVzc09yZ1wiKS52YWx1ZSxcclxuICAgICAgICAnaWQnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlkQ29tcGFueVwiKS5pbm5lckhUTUxcclxuICAgIH07XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuc2V0VHlwZXNPcmdhbmlzYXRpb25TZWxlY3QgPSBmdW5jdGlvbiAodHlwZXNPcmdhbmlzYXRpb24pIHtcclxuICAgIGxldCB0eXBlT3JnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlQ29tcGFueVwiKTtcclxuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4odHlwZU9yZyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHR5cGVzT3JnYW5pc2F0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XHJcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9IHR5cGVzT3JnYW5pc2F0aW9uW2ldLm5hbWU7XHJcbiAgICAgICAgdHlwZU9yZy5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5zZXRPcmdhbmlzYXRpb25zTGlzdCA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb25zLCBpZExpc3QpIHtcclxuICAgIGxldCBsaXN0T3JnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRMaXN0KTtcclxuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4obGlzdE9yZyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZ2FuaXNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZGl2X2xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfbGlzdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3RcIik7XHJcblxyXG4gICAgICAgIGxldCBkaXZfbGlzdF9jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtY29udGVudCBpbmxpbmUtYmxvY2tcIik7XHJcbiAgICAgICAgaWYgKGlkTGlzdCA9PT0gXCJvcmdhbmlzYXRpb25MaXN0XCIpIHtcclxuICAgICAgICAgICAgZGl2X2xpc3RfY29udGVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixcclxuICAgICAgICAgICAgICAgIHRoaXMub25DbGlja0Rpc3BsYXlJbmZvQWJvdXRPcmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNwYW5fbGlzdF90aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXRpdGxlXCIpO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJpZF9vcmdhbmlzYXRpb25cIiwgb3JnYW5pc2F0aW9uc1tpXS5pZCk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLmlubmVySFRNTCA9IG9yZ2FuaXNhdGlvbnNbaV0ubmFtZTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF90aXRsZSk7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3Rfc3VidGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3N1YnRpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1zdWJ0aXRsZVwiKTtcclxuICAgICAgICBzcGFuX2xpc3Rfc3VidGl0bGUuaW5uZXJIVE1MID0gJ9CS0YHQtdCz0L4g0LzQtdGB0YI6ICdcclxuICAgICAgICAgICAgKyBvcmdhbmlzYXRpb25zW2ldLm1heF9zdHVkZW50c19udW1iZXI7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3Rfc3VidGl0bGUpO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl9saXN0X3JlbWFyayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3RfcmVtYXJrLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1yZW1hcmtcIik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3JlbWFyay5pbm5lckhUTUwgPSAn0J7RgdGC0LDQu9C+0YHRjDogJ1xyXG4gICAgICAgICAgICArIG9yZ2FuaXNhdGlvbnNbaV0ubWF4X3N0dWRlbnRzX251bWJlcjtcclxuICAgICAgICAvKtCe0JHQr9CX0JDQotCV0JvQrNCd0J4g0JjQodCf0KDQkNCS0JjQotCsINCd0JAg0JrQntCb0JjQp9CV0KHQotCS0J4g0J7QodCi0JDQktCo0JjQpdCh0K8g0JzQldCh0KIuISEhISEhISEhISEhISEhISEhISEhISEhISEhKi9cclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9yZW1hcmspO1xyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfbGlzdF9jb250ZW50KTtcclxuXHJcbiAgICAgICAgbGV0IGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICAgIFwiaW5saW5lLWJsb2NrIGxpc3QtY29udGVudCBzZXR0aW5nc09yZ2FuaXNhdGlvblwiKTtcclxuICAgICAgICBpZiAoaWRMaXN0ID09PSBcIm9yZ2FuaXNhdGlvbkxpc3RcIikge1xyXG4gICAgICAgICAgICBsZXQgc3Bhbl91c2VyX3BsdXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgIHNwYW5fdXNlcl9wbHVzLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICAgICAgICBcIm1pZi11c2VyLXBsdXMgbWlmLWxnIGZnLWdyYXkgYWRkLXN0dWRlbnQtb3JnYW5pc2F0aW9uXCIpO1xyXG4gICAgICAgICAgICBzcGFuX3VzZXJfcGx1cy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixcclxuICAgICAgICAgICAgICAgIHRoaXMub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvblNob3dEaWFsb2cpO1xyXG4gICAgICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fdXNlcl9wbHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzcGFuX3BlbmNpbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX3BlbmNpbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICBcIm1pZi1wZW5jaWwgbWlmLWxnIGZnLWdyYXkgZWRpdC1vcmdhbmlzYXRpb25cIik7XHJcbiAgICAgICAgc3Bhbl9wZW5jaWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25DbGlja0VkaXRPcmdhbmlzYXRpb24pO1xyXG4gICAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uYXBwZW5kQ2hpbGQoc3Bhbl9wZW5jaWwpO1xyXG5cclxuICAgICAgICAvKiBsZXQgc3Bhbl9jYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgIHNwYW5fY2FuY2VsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibWlmLWNhbmNlbCBtaWYtbGcgZmcteWVsbG93XCIpO1xyXG4gICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fY2FuY2VsKTsqL1xyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uKTtcclxuXHJcbiAgICAgICAgbGlzdE9yZy5hcHBlbmRDaGlsZChkaXZfbGlzdCk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5nZXRJZE9yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IGlkT3JnYW5pc2F0aW9uID0gMDtcclxuICAgIGlmIChldmVudC50YXJnZXQuaWQgPT09IFwidXBkYXRlT3JnYW5pc2F0aW9uXCIpIHtcclxuICAgICAgICBpZE9yZ2FuaXNhdGlvbiA9ICtldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jaGlsZHJlblswXS5jaGlsZHJlblsyXS5pbm5lckhUTUw7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZE9yZ2FuaXNhdGlvbiA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uZ2V0QXR0cmlidXRlKFxyXG4gICAgICAgICAgICBcImlkX29yZ2FuaXNhdGlvblwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBpZE9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldE5hbWVPcmdhbmlzYXRpb25JblRyZWV2aWV3ID0gZnVuY3Rpb24gKGlkVHJlZXZpZXcpIHtcclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZFRyZWV2aWV3KTtcclxuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gcGFyZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXHJcbiAgICAgICAgXCJhY3RpdmVcIilbMF0ucXVlcnlTZWxlY3RvcignW2lkX29yZ2FuaXNhdGlvbicpLmlubmVySFRNTDtcclxuICAgIHJldHVybiBuYW1lT3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuc2hvd0RpYWxvZ09yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmFtZUNvbXBhbnlcIikudmFsdWUgPSBvcmdhbmlzYXRpb24ubmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRDb21wYW55XCIpLmlubmVySFRNTCA9IG9yZ2FuaXNhdGlvbi5pZDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mb0NvbXBhbnlcIikudmFsdWUgPSBvcmdhbmlzYXRpb24uaW5mb19vcmdhbmlzYXRpb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBob25lT3JnXCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLnBob25lX29yZ2FuaXNhdGlvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1haWxPcmdcIikudmFsdWUgPSBvcmdhbmlzYXRpb24uZW1haWxfb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJhZGRyZXNzT3JnXCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLmFkZHJlc3Nfb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJwbGFjZXNDb21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLm1heF9zdHVkZW50c19udW1iZXI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBcImxvZ2luQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5sb2dpbl9vcmdhbmlzYXRpb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBzd2RDb21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLnBzd2Rfb3JnYW5pc2F0aW9uO1xyXG4gICAgbWV0cm9EaWFsb2cub3BlbignI2RpYWxvZ0NyZWF0ZUNvbXBhbnknKTtcclxufTtcclxuVmlldy5wcm90b3R5cGUuZGlhbG9nT3BlbiA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgbWV0cm9EaWFsb2cub3BlbihpZCk7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZU9yZ2FuaXNhdGlvblRpdGxlID0gZnVuY3Rpb24gKG5hbWVPcmdhbmlzYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcHJvdmVkX3N0dWRlbnRfY291bnQsIG5vbl9hcHByb3ZlZF9zdHVkZW50X2NvdW50KSB7XHJcbiAgICBpZiAobm9uX2FwcHJvdmVkX3N0dWRlbnRfY291bnQgPT09IDApIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5vbkFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcIiwg0L/Rg9GB0YJcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibm9uQXBwcm92ZWRTdHVkZW50TGlzdFRpdGxlXCIpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ05hbWVcIikuaW5uZXJIVE1MID0gbmFtZU9yZ2FuaXNhdGlvbjtcclxuXHJcbiAgICBpZiAoYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9PT0gMCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICBcImFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcItCh0L/QuNGB0L7QuiDRg9GC0LLQtdGA0LbQtNC10L3QvdGL0YUg0YHRgtGD0LTQtdC90YLQvtCyINC/0YPRgdGCLlwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgIFwiYXBwcm92ZWRTdHVkZW50TGlzdFRpdGxlXCIpLmlubmVySFRNTCA9IFwi0KHQv9C40YHQvtC6INGD0YLQstC10YDQttC00LXQvdC90YvRhSDRgdGC0YPQtNC10L3RgtC+0LIuXCI7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RlZE9yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzTmFtZSA9PT0gXCJsaXN0LWNvbnRlbnQgaW5saW5lLWJsb2NrXCIpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbkNsaWNrID0gZWxlbWVudC5jaGlsZHJlblswXS5pbm5lckhUTUw7XHJcbiAgICByZXR1cm4gbmFtZU9yZ2FuaXNhdGlvbkNsaWNrO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0TmFtZU9yZ2FuaXNhdGlvbkJ5VGl0bGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdOYW1lXCIpLmlubmVySFRNTDtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZVN0dWRlbnRzTGlzdFZpZXcgPSBmdW5jdGlvbiAoc3R1ZGVudHMsIGlkTGlzdCkge1xyXG4gICAgbGV0IGxpc3RTdHVkZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkTGlzdCk7XHJcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKGxpc3RTdHVkZW50cyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGRpdl9saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X2xpc3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0XCIpO1xyXG5cclxuICAgICAgICBsZXQgZGl2X2xpc3RfY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LWNvbnRlbnQgaW5saW5lLWJsb2NrXCIpO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl9saXN0X3RpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtdGl0bGVcIik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcInJlcXVlc3RcIiwgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdCk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcInVpZFwiLCBzdHVkZW50c1tpXS51aWRfc3R1ZGVudCk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcIm9yZ1wiLCBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb24pO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5pbm5lckhUTUwgPSBzdHVkZW50c1tpXS5kaXNwbGF5TmFtZTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF90aXRsZSk7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3Rfc3VidGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3N1YnRpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1zdWJ0aXRsZVwiKTtcclxuICAgICAgICBzcGFuX2xpc3Rfc3VidGl0bGUuaW5uZXJIVE1MID0gc3R1ZGVudHNbaV0uZ3JvdXBfbmFtZTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9zdWJ0aXRsZSk7XHJcblxyXG4gICAgICAgIGxldCB5ZWFyID0gc3R1ZGVudHNbaV0uZGF0ZV9jcmVhdGlvbl9yZXF1ZXN0LnN1YnN0cigwLCA0KSxcclxuICAgICAgICAgICAgbW9udGggPSBzdHVkZW50c1tpXS5kYXRlX2NyZWF0aW9uX3JlcXVlc3Quc3Vic3RyKDUsIDIpLFxyXG4gICAgICAgICAgICBkYXkgPSBzdHVkZW50c1tpXS5kYXRlX2NyZWF0aW9uX3JlcXVlc3Quc3Vic3RyKDgsIDIpO1xyXG4gICAgICAgIGxldCBkYXRlID0gZGF5ICsgJy0nICsgbW9udGggKyAnLScgKyB5ZWFyO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl9saXN0X3JlbWFyayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3RfcmVtYXJrLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1yZW1hcmtcIik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3JlbWFyay5pbm5lckhUTUwgPSAn0JTQsNGC0LAg0LfQsNC/0LjRgdC4OiAnICsgZGF0ZTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9yZW1hcmspO1xyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfbGlzdF9jb250ZW50KTtcclxuXHJcbiAgICAgICAgbGV0IGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICAgIFwiaW5saW5lLWJsb2NrIGxpc3QtY29udGVudCBzZXR0aW5nc09yZ2FuaXNhdGlvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKGlkTGlzdCAhPT0gXCJhcHByb3ZlZFN0dWRlbnRzXCIpIHtcclxuICAgICAgICAgICAgbGV0IHNwYW5fc3R1ZGVudF9hcHByb3ZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICBzcGFuX3N0dWRlbnRfYXBwcm92ZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJtaWYtY2hlY2ttYXJrIG1pZi1sZyBmZy1ncmVlblwiKTtcclxuICAgICAgICAgICAgc3Bhbl9zdHVkZW50X2FwcHJvdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tBcHByb3ZlU3R1ZGVudCk7XHJcbiAgICAgICAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uYXBwZW5kQ2hpbGQoc3Bhbl9zdHVkZW50X2FwcHJvdmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNwYW5fc3R1ZGVudF9yZWplY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9zdHVkZW50X3JlamVjdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1pZi1jYW5jZWwgbWlmLWxnIGZnLXJlZFwiKTtcclxuICAgICAgICBzcGFuX3N0dWRlbnRfcmVqZWN0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uQ2xpY2tSZWplY3RTdHVkZW50KTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fc3R1ZGVudF9yZWplY3QpO1xyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uKTtcclxuXHJcbiAgICAgICAgbGlzdFN0dWRlbnRzLmFwcGVuZENoaWxkKGRpdl9saXN0KTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxsT3JnYW5pc2F0aW9uc0xpc3RCbG9ja1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0dWRlbnRzUmVxdWVzdHNcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnJlbmRlck9yZ2FuaXNhdGlvblNlY3Rpb24gPSBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25MaXN0Q3VycmVudFByYWN0aWNlVGV4dFwiKTtcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICB0ZXh0LmlubmVySFRNTCA9IFwi0KHQv9C40YHQvtC6INC+0YDQs9Cw0L3QuNC30LDRhtC40Lkg0LIg0L/RgNCw0LrRgtC40LrQtVwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGV4dC5pbm5lckhUTUwgPSBcItCf0YDQsNC60YLQuNC60Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIjtcclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLk9wZW5PckNsb3NlTG9hZGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRcIikuc3R5bGUuZGlzcGxheTtcclxuICAgIGlmIChkaXNwbGF5ID09PSBcImJsb2NrXCIpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkU3R1ZGVudCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IG5vZGUgPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICAgJ1tyZXF1ZXN0XScpO1xyXG4gICAgbGV0IHN0dWRlbnQgPSB7XHJcbiAgICAgICAgJ2lkX3JlcXVlc3QnOiBub2RlLmdldEF0dHJpYnV0ZShcInJlcXVlc3RcIiksXHJcbiAgICAgICAgJ3VpZF9zdHVkZW50Jzogbm9kZS5nZXRBdHRyaWJ1dGUoXCJ1aWRcIiksXHJcbiAgICAgICAgJ2lkX29yZ2FuaXNhdGlvbic6IG5vZGUuZ2V0QXR0cmlidXRlKFwib3JnXCIpXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChldmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikuaW5kZXhPZihcIm1pZi1jYW5jZWxcIikgPT09IDApIHtcclxuICAgICAgICBzdHVkZW50WydpZF9zdGF0dXMnXSA9IDI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBzdHVkZW50WydpZF9zdGF0dXMnXSA9IDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3R1ZGVudDtcclxufTtcclxuVmlldy5wcm90b3R5cGUuc2V0WWVhcnNBcnJheSA9IGZ1bmN0aW9uICh5ZWFycykge1xyXG4gICAgbGV0IGJ1dHRvbkFycmF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25zQXJyYXlcIik7XHJcbiAgICBsZXQgYnV0dG9uQXJyYXkxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25zQXJyYXkxXCIpO1xyXG4gICAgdGhpcy5yZW1vdmVDaGlsZHJlbihidXR0b25BcnJheSk7XHJcbiAgdGhpcy5yZW1vdmVDaGlsZHJlbihidXR0b25BcnJheTEpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB5ZWFycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpdGVtIHllYXJcIik7XHJcbiAgICAgICAgc3Bhbi5pbm5lckhUTUwgPSB5ZWFyc1tpXTtcclxuICAgICAgICBidXR0b25BcnJheS5hcHBlbmRDaGlsZChzcGFuKTtcclxuXHJcbiAgICAgIGxldCBzcGFuMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgc3BhbjEuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpdGVtIHllYXJcIik7XHJcbiAgICAgIHNwYW4xLmlubmVySFRNTCA9IHllYXJzW2ldO1xyXG4gICAgICBidXR0b25BcnJheS5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgICAgYnV0dG9uQXJyYXkxLmFwcGVuZENoaWxkKHNwYW4xKTtcclxuICAgIH1cclxuICAgIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgc3Bhbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIml0ZW0geWVhclwiKTtcclxuICAgIHNwYW4uc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJjcmVhdGVQcmFjdGljZUJ0blwiKTtcclxuICAgIHNwYW4uaW5uZXJIVE1MID0gXCIrXCI7XHJcbiAgICBidXR0b25BcnJheS5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlUHJhY3RpY2VCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0NyZWF0ZVByYWN0aWNlKTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkU3R1ZGVudHMgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBTdHVkZW50cyA9IFtdO1xyXG4gICAgbGV0IG5vZGVzID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6Y2hlY2tlZCcpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmIChub2Rlc1tpXS5wYXJlbnRFbGVtZW50Lm5leHRTaWJsaW5nLmlubmVySFRNTC5pbmRleE9mKFwi0LrRg9GA0YFcIikgPT09IC0xXHJcbiAgICAgICAgICAgICYmIGlzTmFOKCtub2Rlc1tpXS5wYXJlbnRFbGVtZW50Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUwuc3Vic3RyKDAsXHJcbiAgICAgICAgICAgICAgICAyKSkpIHtcclxuICAgICAgICAgICAgbGV0IG5hbWUgPSBub2Rlc1tpXS5wYXJlbnRFbGVtZW50Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgIGxldCB1aWQgPSBub2Rlc1tpXS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS11aWRcIik7XHJcbiAgICAgICAgICAgIFN0dWRlbnRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgIHVpZDogdWlkXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBTdHVkZW50cztcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmRpYWxvZ0VuYWJsZUNoZWNrYm94ZXMgPSBmdW5jdGlvbiAobmFtZXNHcm91cHMsIGlkRWxlbWVudCkge1xyXG4gICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkRWxlbWVudCk7XHJcbiAgICBsZXQgaW5wdXRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbmFtZXNHcm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKGlucHV0c1tpXS5wYXJlbnRFbGVtZW50Lm5leHRTaWJsaW5nLmlubmVySFRNTCA9PT0gbmFtZXNHcm91cHNbal0pIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb3Vyc2UgPSBpbnB1dHNbaV0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgICAgICAgIGlmIChjb3Vyc2UuZ2V0QXR0cmlidXRlKFwiZGF0YS1tb2RlXCIpID09PSBcImNoZWNrYm94XCIgJiYgY291cnNlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpLmluZGV4T2YoXCJhY3RpdmUtY291cnNlXCIpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoY291cnNlKS5hZGRDbGFzcyhcImFjdGl2ZS1jb3Vyc2VcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpbnB1dHNbaV0ucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3R1ZGVudHNDaGVja2JveGVzID0gaW5wdXRzW2ldLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFxyXG4gICAgICAgICAgICAgICAgICAgICdbZGF0YS11aWRdJyk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHN0dWRlbnRzQ2hlY2tib3hlcy5sZW5ndGg7IG4rKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0dWRlbnRzQ2hlY2tib3hlc1tuXS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnJlbW92ZUF0dHJpYnV0ZShcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldEVsZW1CeUlkID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBsZXQgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgIHJldHVybiBlbGVtO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuY3JlYXRlSW5wdXRzT3JkZXIgPSBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZGVyLWJsb2NrXCIpO1xyXG4gICAgdGhpcy5yZW1vdmVDaGlsZHJlbihwYXJlbnQpO1xyXG4gICAgbGV0IGg0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xyXG4gICAgaDQuaW5uZXJIVE1MID0gXCLQoNGD0LrQvtCy0L7QtNC40YLQtdC70LhcIjtcclxuICAgIGg0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYWxpZ24tY2VudGVyXCIpO1xyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGg0KTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmaWVsZCBtYXJnaW4yMFwiKTtcclxuXHJcbiAgICAgICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgICAgICBwLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaW5saW5lLWJsb2NrIHN1Yi1oZWFkZXJcIik7XHJcbiAgICAgICAgcC5pbm5lckhUTUwgPSBzZWxlY3RlZEdyb3Vwc1tpXTtcclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocCk7XHJcblxyXG4gICAgICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJncm91cE5hbWVcIiwgc2VsZWN0ZWRHcm91cHNbaV0pO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XHJcblxyXG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChkaXYpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcblZpZXcucHJvdG90eXBlLmNyZWF0ZUlucHV0c1JlcG9ydCA9IGZ1bmN0aW9uIChzZWxlY3RlZEdyb3Vwcykge1xyXG4gICAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JvdXBzLXJlcG9ydC1ibG9ja1wiKTtcclxuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4ocGFyZW50KTtcclxuICAgIGxldCBoNCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcclxuICAgIGg0LmlubmVySFRNTCA9IFwi0JjQvdGE0L7RgNC80LDRhtC40Y8g0L/QviDQutCw0LbQtNC+0Lkg0LPRgNGD0L/Qv9C1XCI7XHJcbiAgICBoNC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFsaWduLWNlbnRlclwiKTtcclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChoNCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGRpdl9ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2X2dyb3VwLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZ3JvdXAgXCIgKyBzZWxlY3RlZEdyb3Vwc1tpXSk7XHJcblxyXG4gICAgICAgIGxldCBoNCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcclxuICAgICAgICBoNC5pbm5lckhUTUwgPSBzZWxlY3RlZEdyb3Vwc1tpXTtcclxuICAgICAgICBoNC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFsaWduLWNlbnRlclwiKTtcclxuICAgICAgICBkaXZfZ3JvdXAuYXBwZW5kQ2hpbGQoaDQpO1xyXG5cclxuICAgICAgICBsZXQgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmaWVsZCBtYXJnaW4yMFwiKTtcclxuICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcclxuICAgICAgICBwLmlubmVySFRNTCA9IFwi0KDRg9C60L7QstC+0LTQuNGC0LXQu9GMXCI7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKHApO1xyXG4gICAgICAgIGxldCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInN1cGVydmlzb3JcIik7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICBkaXZfZ3JvdXAuYXBwZW5kQ2hpbGQoZGl2KTtcclxuXHJcbiAgICAgICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmaWVsZCBtYXJnaW4yMFwiKTtcclxuICAgICAgICBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICAgICAgcC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImlubGluZS1ibG9jayBzdWItaGVhZGVyXCIpO1xyXG4gICAgICAgIHAuaW5uZXJIVE1MID0gXCLQodGC0YPQtC4gKDQg0LggNSlcIjtcclxuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICAgICAgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJnb29kX3N0dWRlbnRzXCIpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJudW1iZXJcIik7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICBkaXZfZ3JvdXAuYXBwZW5kQ2hpbGQoZGl2KTtcclxuXHJcbiAgICAgICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmaWVsZCBtYXJnaW4yMFwiKTtcclxuICAgICAgICBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICAgICAgcC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImlubGluZS1ibG9jayBzdWItaGVhZGVyXCIpO1xyXG4gICAgICAgIHAuaW5uZXJIVE1MID0gXCLQmtC+0Lst0LLQviDQv9GA0LXQv9C+0LQuLdGA0YPQutC+0LLQvtC0LlwiO1xyXG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChwKTtcclxuICAgICAgICBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInRlYWNoZXJfbnVtYmVyXCIpO1xyXG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJudW1iZXJcIik7XHJcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgICAgICBkaXZfZ3JvdXAuYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZGl2X2dyb3VwKTtcclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgbGV0IHllYXIgPSBkYXRlLnN1YnN0cigwLCA0KSxcclxuICAgICAgICBtb250aCA9IGRhdGUuc3Vic3RyKDUsIDIpLFxyXG4gICAgICAgIGRheSA9IGRhdGUuc3Vic3RyKDgsIDIpO1xyXG4gICAgcmV0dXJuIChkYXkgKyAnLicgKyBtb250aCArICcuJyArIHllYXIpO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0SW5mb3JtYXRpb25Gb3JEb2N1bWVudE9yZGVyID0gZnVuY3Rpb24gKHByYWN0aWNlLCBzZWxlY3RlZEdyb3VwcywgYWxsR3JvdXBzLCBkYXRhLCBvcmdhbmlzYXRpb25zKSB7XHJcbiAgICBsZXQgZ3JvdXBzRm9yRG9jdW1lbnQgPSBbXTtcclxuICAgIGxldCBlZHVjYXRpb25hbF9sZXZlbCA9IHRoaXMuZ2V0RWR1Y2F0aW9uYWxMZXZlbCgpO1xyXG4gICAgbGV0IGJsb2NrVGVhY2hlcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZGVyLWJsb2NrXCIpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKTtcclxuICAgIGxldCB0ZWFjaGVycyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja1RlYWNoZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwTmFtZSA9IGJsb2NrVGVhY2hlcnNbaV0uY2hpbGRyZW5bMF0uaW5uZXJIVE1MO1xyXG4gICAgICAgIGxldCB0ZWFjaGVyID0gYmxvY2tUZWFjaGVyc1tpXS5jaGlsZHJlblsxXS52YWx1ZTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEdyb3Vwc1tqXSA9PT0gZ3JvdXBOYW1lKVxyXG4gICAgICAgICAgICAgICAgdGVhY2hlcnMucHVzaChcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidGVhY2hlclwiOiB0ZWFjaGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdyb3VwTmFtZVwiOiBncm91cE5hbWVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuaW5mb0dyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0uaW5kZXhPZih0aGlzLmluZm9Hcm91cHNbal0ubmFtZSkgIT09IC0xICYmIHRoaXMuaW5mb0dyb3Vwc1tqXS50eXBlID09PSBlZHVjYXRpb25hbF9sZXZlbCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBhbGxHcm91cHMubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IGFsbEdyb3Vwc1tuXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGVhY2hlcnMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3RlZEdyb3Vwc1tpXSA9PT0gdGVhY2hlcnNba10uZ3JvdXBOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLnRlYWNoZXIgPSB0ZWFjaGVyc1trXS50ZWFjaGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS50eXBlID0gdGhpcy5pbmZvR3JvdXBzW2pdLnR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLmZ1bGxOYW1lID0gdGhpcy5pbmZvR3JvdXBzW2pdLmZ1bGxOYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS5wcm9maWxlID0gdGhpcy5pbmZvR3JvdXBzW2pdLnByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBzRm9yRG9jdW1lbnQucHVzaChhbGxHcm91cHNbbl0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IGRlYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYW5cIikudmFsdWU7XHJcbiAgICBsZXQgaGVhZF9vZl9kZXBhcnRtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWFkX29mX2RlcGFydG1lbnRcIikudmFsdWU7XHJcbiAgICBsZXQgdHlwZV9kb2N1bWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2R0eXBlRG9jdW1lbnRcIikub3B0aW9uc1tkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdkdHlwZURvY3VtZW50XCIpLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xyXG4gICAgbGV0IGRvY3VtZW50cyA9IFtdO1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlVGFiXCIpLnZhbHVlO1xyXG4gICAgdHlwZVByYWN0aWNlID0gdHlwZVByYWN0aWNlLnJlcGxhY2VBdCh0eXBlUHJhY3RpY2UubGVuZ3RoIC0gMSwgXCLQuVwiKTtcclxuICAgIHR5cGVQcmFjdGljZSA9IHR5cGVQcmFjdGljZS5yZXBsYWNlQXQodHlwZVByYWN0aWNlLmxlbmd0aCAtIDIsIFwi0L5cIik7XHJcbiAgICB0eXBlUHJhY3RpY2UgPSB0eXBlUHJhY3RpY2UudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICBsZXQgc3RhcnRfZGF0ZSA9IHRoaXMuZm9ybWF0RGF0ZShwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlKTtcclxuICAgIGxldCBlbmRfZGF0ZSA9IHRoaXMuZm9ybWF0RGF0ZShwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZSk7XHJcbiAgICBpZiAodHlwZVByYWN0aWNlID09PSBcItGD0YfQtdCx0L3QvtC5XCIpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBzdHVkZW50cyA9IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnN0dWRlbnRzO1xyXG4gICAgICAgICAgICBsZXQgc3RyID0gSlNPTi5zdHJpbmdpZnkoc3R1ZGVudHMsIFtcIm5hbWVcIl0pO1xyXG4gICAgICAgICAgICBzdHVkZW50cyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuICAgICAgICAgICAgbGV0IGRvY3VtZW50ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJkaXJlY3Rpb25cIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0uZnVsbE5hbWUsXHJcbiAgICAgICAgICAgICAgICBcInByb2ZpbGVcIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0ucHJvZmlsZSxcclxuICAgICAgICAgICAgICAgIFwiZGVhblwiOiBkZWFuLFxyXG4gICAgICAgICAgICAgICAgXCJoZWFkX29mX2RlcGFydG1lbnRcIjogaGVhZF9vZl9kZXBhcnRtZW50LFxyXG4gICAgICAgICAgICAgICAgXCJ0eXBlX3ByYWN0aWNlXCI6IHR5cGVQcmFjdGljZSxcclxuICAgICAgICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBzdGFydF9kYXRlLFxyXG4gICAgICAgICAgICAgICAgXCJlbmRfZGF0ZVwiOiBlbmRfZGF0ZSxcclxuICAgICAgICAgICAgICAgIFwiZ3JvdXBfbmFtZVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgXCJzdXBlcnZpc29yXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnRlYWNoZXIsXHJcbiAgICAgICAgICAgICAgICBcInN0dWRlbnRzXCI6IHN0dWRlbnRzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGRvY3VtZW50cy5wdXNoKGRvY3VtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwi0L/RgNC+0LjQt9Cy0L7QtNGB0YLQstC10L3QvdC+0LlcIikge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3JnYW5pc2F0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBvcmdhbmlzYXRpb25zW2ldLnN0dWRlbnRzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YVtpXS5ncm91cCA9PT0gZ3JvdXBzRm9yRG9jdW1lbnRbal0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ3JvdXBzRm9yRG9jdW1lbnRbal0uc3R1ZGVudHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFbaV0uc3R1ZGVudCA9PT0gZ3JvdXBzRm9yRG9jdW1lbnRbal0uc3R1ZGVudHNba10ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFbaV0ub3JnYW5pc2F0aW9uID09PSBvcmdhbmlzYXRpb25zW25dLm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tuXS5ncm91cCA9IGdyb3Vwc0ZvckRvY3VtZW50W2pdLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbbl0ub3JnYW5pemF0aW9uX25hbWUgPSBvcmdhbmlzYXRpb25zW25dLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbbl0udGVhY2hlciA9IGdyb3Vwc0ZvckRvY3VtZW50W2pdLnRlYWNoZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHVkZW50ID0gZGF0YVtpXS5zdHVkZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zW25dLnN0dWRlbnRzLnB1c2goe1wibmFtZVwiOiBzdHVkZW50fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHNGb3JEb2N1bWVudC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgb3JnYW5pc2F0aW9uc19mb3JfZG9jdW1lbnQgPSBbXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3JnYW5pc2F0aW9uc1tqXS5ncm91cCA9PT0gZ3JvdXBzRm9yRG9jdW1lbnRbaV0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHVkZW50cyA9IEpTT04uc3RyaW5naWZ5KG9yZ2FuaXNhdGlvbnNbal0uc3R1ZGVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0dWRlbnRzID0gSlNPTi5wYXJzZShzdHVkZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0ciA9IEpTT04uc3RyaW5naWZ5KG9yZ2FuaXNhdGlvbnNbal0sIFtcIm9yZ2FuaXphdGlvbl9uYW1lXCIsIFwidGVhY2hlclwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tqXSA9IEpTT04ucGFyc2Uoc3RyKTtcclxuICAgICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zW2pdLnN0dWRlbnRzID0gc3R1ZGVudHM7XHJcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc19mb3JfZG9jdW1lbnQucHVzaChvcmdhbmlzYXRpb25zW2pdKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGRvY3VtZW50ID0ge1xyXG4gICAgICAgICAgICAgICAgXCJkaXJlY3Rpb25cIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0uZnVsbE5hbWUsXHJcbiAgICAgICAgICAgICAgICBcInByb2ZpbGVcIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0ucHJvZmlsZSxcclxuICAgICAgICAgICAgICAgIFwiZGVhblwiOiBkZWFuLFxyXG4gICAgICAgICAgICAgICAgXCJjb3Vyc2VcIjogXCIxXCIsXHJcbiAgICAgICAgICAgICAgICBcImhlYWRfb2ZfZGVwYXJ0bWVudFwiOiBoZWFkX29mX2RlcGFydG1lbnQsXHJcbiAgICAgICAgICAgICAgICBcInR5cGVfcHJhY3RpY2VcIjogdHlwZVByYWN0aWNlLFxyXG4gICAgICAgICAgICAgICAgXCJzdGFydF9kYXRlXCI6IHN0YXJ0X2RhdGUsXHJcbiAgICAgICAgICAgICAgICBcImVuZF9kYXRlXCI6IGVuZF9kYXRlLFxyXG4gICAgICAgICAgICAgICAgXCJncm91cF9uYW1lXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBcInN1cGVydmlzb3JcIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0udGVhY2hlcixcclxuICAgICAgICAgICAgICAgIFwib3JnYW5pemF0aW9uc1wiOiBvcmdhbmlzYXRpb25zX2Zvcl9kb2N1bWVudFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBkb2N1bWVudHMucHVzaChkb2N1bWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRvY3VtZW50cztcclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0RWR1Y2F0aW9uYWxMZXZlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCB0cmVlVmlldyA9IDA7XHJcbiAgICBsZXQgZnJhbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZyYW1lc1wiKVswXS5jaGlsZHJlbjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGZyYW1lc1tpXS5zdHlsZS5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xyXG4gICAgICAgICAgICB0cmVlVmlldyA9IGZyYW1lc1tpXS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IGVkdWNhdGlvbmFsX2xldmVsID0gdHJlZVZpZXcuZ2V0QXR0cmlidXRlKFwiaWRcIik7XHJcbiAgICBpZiAoZWR1Y2F0aW9uYWxfbGV2ZWwuaW5kZXhPZihcImJhY2hlbG9yXCIpICE9PSAtMSkge1xyXG4gICAgICAgIHJldHVybiBcImJhY2hlbG9yXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gXCJtYXN0ZXJcIjtcclxuICAgIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0SW5mb3JtYXRpb25Gb3JEb2N1bWVudFJlcG9ydCA9IGZ1bmN0aW9uIChwcmFjdGljZSwgc2VsZWN0ZWRHcm91cHMsIGFsbEdyb3Vwcykge1xyXG4gICAgbGV0IGVkdWNhdGlvbmFsX2xldmVsID0gdGhpcy5nZXRFZHVjYXRpb25hbExldmVsKCk7XHJcbiAgICBsZXQgZ3JvdXBzRm9yRG9jdW1lbnQgPSBbXTtcclxuICAgIGxldCBibG9ja0dyb3VwcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JvdXBzLXJlcG9ydC1ibG9ja1wiKS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdncm91cCcpO1xyXG4gICAgbGV0IGFkZGl0aW9uYWxfaW5mbyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja0dyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBncm91cE5hbWUgPSBibG9ja0dyb3Vwc1tpXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaDQnKVswXS5pbm5lckhUTUw7XHJcbiAgICAgICAgbGV0IHN1cGVydmlzb3IgPSBibG9ja0dyb3Vwc1tpXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3VwZXJ2aXNvclwiKVswXS52YWx1ZTtcclxuICAgICAgICBsZXQgZ29vZF9zdHVkZW50c19udW1iZXIgPSBibG9ja0dyb3Vwc1tpXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ29vZF9zdHVkZW50c1wiKVswXS52YWx1ZTtcclxuICAgICAgICBsZXQgdGVhY2hlcl9udW1iZXIgPSBibG9ja0dyb3Vwc1tpXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidGVhY2hlcl9udW1iZXJcIilbMF0udmFsdWU7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbal0gPT09IGdyb3VwTmFtZSlcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxfaW5mby5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBcImdyb3VwTmFtZVwiOiBncm91cE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdXBlcnZpc29yXCI6IHN1cGVydmlzb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJnb29kX3N0dWRfbnVtXCI6IGdvb2Rfc3R1ZGVudHNfbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGVhY2hlcl9udW1iZXJcIjogdGVhY2hlcl9udW1iZXJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuaW5mb0dyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0uaW5kZXhPZih0aGlzLmluZm9Hcm91cHNbal0ubmFtZSkgIT09IC0xICYmIHRoaXMuaW5mb0dyb3Vwc1tqXS50eXBlID09PSBlZHVjYXRpb25hbF9sZXZlbCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBhbGxHcm91cHMubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IGFsbEdyb3Vwc1tuXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYWRkaXRpb25hbF9pbmZvLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IGFkZGl0aW9uYWxfaW5mb1trXS5ncm91cE5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0uc3VwZXJ2aXNvciA9IGFkZGl0aW9uYWxfaW5mb1trXS5zdXBlcnZpc29yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS5mdWxsTmFtZSA9IHRoaXMuaW5mb0dyb3Vwc1tqXS5mdWxsTmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0uZ29vZF9zdHVkX251bSA9IGFkZGl0aW9uYWxfaW5mb1trXS5nb29kX3N0dWRfbnVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS50ZWFjaGVyX251bWJlciA9IGFkZGl0aW9uYWxfaW5mb1trXS50ZWFjaGVyX251bWJlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncm91cHNGb3JEb2N1bWVudC5wdXNoKGFsbEdyb3Vwc1tuXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgc3RhcnRfZGF0ZSA9IHRoaXMuZm9ybWF0RGF0ZShwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlKTtcclxuICAgIGxldCBlbmRfZGF0ZSA9IHRoaXMuZm9ybWF0RGF0ZShwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZSk7XHJcblxyXG4gICAgbGV0IGhlYWRfb2ZfZGVwYXJ0bWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVhZF9vZl9kZXBhcnRtZW50XCIpLnZhbHVlO1xyXG4gICAgbGV0IGRvY3VtZW50cyA9IFtdO1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlVGFiXCIpLnZhbHVlO1xyXG4gICAgdHlwZVByYWN0aWNlID0gdHlwZVByYWN0aWNlLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgbGV0IGNvdXJzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY291cnNlXCIpLnZhbHVlO1xyXG4gICAgbGV0IGJhc2VfcHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhc2VfcHJhY3RpY2VcIikudmFsdWU7XHJcbiAgICBsZXQgbnVtX2Jhc2VfcHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm51bV9iYXNlX3ByYWN0aWNlXCIpLnZhbHVlO1xyXG4gICAgbGV0IG51bV9sZWN0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2xlY3Rpb25zXCIpLnZhbHVlO1xyXG5cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGRvY3VtZW50ID0ge1xyXG4gICAgICAgICAgICBcImRpcmVjdGlvblwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5mdWxsTmFtZSxcclxuICAgICAgICAgICAgXCJjb3Vyc2VcIjogY291cnNlLFxyXG4gICAgICAgICAgICBcInR5cGVfcHJhY3RpY2VcIjogdHlwZVByYWN0aWNlLFxyXG4gICAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogc3RhcnRfZGF0ZSxcclxuICAgICAgICAgICAgXCJlbmRfZGF0ZVwiOiBlbmRfZGF0ZSxcclxuICAgICAgICAgICAgXCJncm91cF9uYW1lXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLm5hbWUsXHJcbiAgICAgICAgICAgIFwiYmFzZV9wcmFjdGljZVwiOiBiYXNlX3ByYWN0aWNlLFxyXG4gICAgICAgICAgICBcInllYXJcIjogcHJhY3RpY2UueWVhcixcclxuICAgICAgICAgICAgXCJ0ZWFjaGVyX251bWJlclwiOiBncm91cHNGb3JEb2N1bWVudFtpXS50ZWFjaGVyX251bWJlcixcclxuICAgICAgICAgICAgXCJzdHVkZW50X251bWJlclwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5zdHVkZW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgIFwiZ29vZF9zdHVkX251bVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5nb29kX3N0dWRfbnVtLFxyXG4gICAgICAgICAgICBcIm51bV9iYXNlX3ByYWN0aWNlXCI6IG51bV9iYXNlX3ByYWN0aWNlLFxyXG4gICAgICAgICAgICBcIm51bV9sZWN0aW9uc1wiOiBudW1fbGVjdGlvbnMsXHJcbiAgICAgICAgICAgIFwic3VwZXJ2aXNvclwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5zdXBlcnZpc29yLFxyXG4gICAgICAgICAgICBcImhlYWRfb2ZfZGVwYXJ0bWVudFwiOiBoZWFkX29mX2RlcGFydG1lbnRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRvY3VtZW50cy5wdXNoKGRvY3VtZW50KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkb2N1bWVudHM7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdFZhbHVlID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBsZXQgdmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkub3B0aW9uc1tkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuc2VsZWN0ZWRJbmRleF0udmFsdWU7XHJcbiAgICByZXR1cm4gdmFsdWU7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jaGFuZ2VEaXNwbGF5ID0gZnVuY3Rpb24gKGlkLCB2YWx1ZSkge1xyXG4gICAgbGV0IGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSB2YWx1ZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNoYW5nZUlubmVySHRtbCA9IGZ1bmN0aW9uIChpZCwgdmFsdWUpIHtcclxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgZWxlbS5pbm5lckhUTUwgPSB2YWx1ZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmZpbGxEaWFsb2cgPSBmdW5jdGlvbiAocHJhY3RpY2UsIG9yZ2FuaXNhdGlvbnMpIHtcclxuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYXNlX3ByYWN0aWNlXCIpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZWxlbS52YWx1ZSArPSBvcmdhbmlzYXRpb25zW2ldLm5hbWUgKyAnLCAnO1xyXG4gICAgfVxyXG4gICAgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2Jhc2VfcHJhY3RpY2VcIik7XHJcbiAgICBlbGVtLnZhbHVlID0gb3JnYW5pc2F0aW9ucy5sZW5ndGg7XHJcbn07XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBdCA9IGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcclxuICAgIHJldHVybiB0aGlzLnN1YnN0cigwLCBpbmRleCkgKyByZXBsYWNlbWVudCArIHRoaXMuc3Vic3RyKGluZGV4ICsgcmVwbGFjZW1lbnQubGVuZ3RoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVmlldztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9WaWV3LmpzIiwiY29uc3QgU0VQVEVNQkVSID0gOTtcclxuY29uc3QgZmlyc3RDb3Vyc2UgPSAwO1xyXG5jb25zdCBzZWNvbmRDb3Vyc2UgPSAxO1xyXG5jb25zdCB0aGlyZENvdXJzZSA9IDI7XHJcbmNvbnN0IGZvdXJ0aENvdXJzZSA9IDM7XHJcbmNvbnN0IG1hc3RlckZpcnN0Q291cnNlID0gNDtcclxuY29uc3QgbWFzdGVyU2Vjb25kQ291cnNlID0gNTtcclxuY29uc3QgUkVKRUNURUQgPSAyO1xyXG5jb25zdCBBUFBST1ZFRCA9IDE7XHJcbmNvbnN0IEFQUExZID0gMDtcclxuY29uc3QgQ09ORklHID0gcmVxdWlyZSgnLi4vLi4vY29uZmlnL3JlbF9jb25maWcnKTtcclxudmFyIE1vZGVsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5Hcm91cHMgPSBbXTtcclxuICAgIHRoaXMuU3R1ZGVudHMgPSBbXTtcclxuICAgIHRoaXMuQ291cnNlcyA9IFtdO1xyXG4gICAgdGhpcy50eXBlc09yZ2FuaXNhdGlvbiA9IFtdO1xyXG4gICAgdGhpcy5PcmdhbmlzYXRpb25zID0gW107XHJcblxyXG59O1xyXG5cclxuY2xhc3MgQ291cnNlIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWVDb3Vyc2UpIHtcclxuICAgICAgICB0aGlzLm5hbWVDb3Vyc2UgPSBuYW1lQ291cnNlO1xyXG4gICAgICAgIHRoaXMuZ3JvdXBzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgYWRkR3JvdXAoZ3JvdXApIHtcclxuICAgICAgICB0aGlzLmdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgR3JvdXAge1xyXG4gICAgY29uc3RydWN0b3IodWlkX0xEQVAsIG5hbWVHcm91cCkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVHcm91cDtcclxuICAgICAgICB0aGlzLnVpZF9MREFQID0gdWlkX0xEQVA7XHJcbiAgICAgICAgdGhpcy5zdHVkZW50cyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFN0dWRlbnQoc3R1ZGVudCkge1xyXG4gICAgICAgIHRoaXMuc3R1ZGVudHMucHVzaChzdHVkZW50KTtcclxuICAgIH1cclxufVxyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNUVURFTlRTIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbk1vZGVsLnByb3RvdHlwZS5nZXREYXRhID0gYXN5bmMgZnVuY3Rpb24gKHNlbGVjdGVkR3JvdXBzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0c19vcmdhbmlzYXRpb25zKSB7XHJcbiAgICBsZXQgZGF0YSA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7ICsraywgKytsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlzU3R1ZGVudEFwcGx5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5wdXNoKHtncm91cDogdGhpcy5Hcm91cHNbaV0ubmFtZX0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uID0gJyAnO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHcgPSAwOyB3IDwgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucy5sZW5ndGg7ICsrdykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd10ubGVuZ3RoOyArK24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9yZXF1ZXN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPT09ICtyZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLmlkX3JlcXVlc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudF9VSUQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS51aWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0uaWRfc3RhdHVzID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0uc3RhdHVzID0gcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5pZF9zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uID0gcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5uYW1lX29yZ2FuaXNhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTdHVkZW50QXBwbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uICs9IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0ubmFtZV9vcmdhbmlzYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJywgJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTdHVkZW50QXBwbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzU3R1ZGVudEFwcGx5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudF9VSUQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS51aWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uID0gXCLQndC1INC30LDQv9C40YHQsNC70YHRj1wiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEdyb3VwcyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvZ3JvdXBzJyk7XHJcbiAgICBsZXQgbGlzdCA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICBsZXQgZ3JvdXBzID0gbGlzdC5fZW1iZWRkZWQuZ3JvdXBzO1xyXG4gICAgcmV0dXJuIGdyb3VwcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRHcm91cHNCeVByYWN0aWNlSWQgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9IFwiP2lkX3ByYWN0aWNlPVwiXHJcbiAgICAgICAgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL2dyb3Vwcy1ieS1wcmFjdGljZS1pZCcgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgbGV0IGdyb3Vwc191aWRzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHJldHVybiBncm91cHNfdWlkcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRHcm91cHNOYW1lQnlHcm91cHNVSUQgPSBhc3luYyBmdW5jdGlvbiAodWlkc0dyb3Vwcykge1xyXG4gICAgbGV0IGdyb3VwcyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1aWRzR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraikge1xyXG4gICAgICAgICAgICBpZiAoK3VpZHNHcm91cHNbaV0udWlkX2dyb3VwID09PSB0aGlzLkdyb3Vwc1tqXS51aWRfTERBUCkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBzLnB1c2godGhpcy5Hcm91cHNbal0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZ3JvdXBzO1xyXG59O1xyXG4vKtC/0L7Qu9GD0YfQsNC10Lwg0YHRgtGD0LTQtdC90YLQvtCyINC40Lcg0YXRgNCw0L3QuNC70LjRidCwIExEQVAg0L/QviBJRCDQs9GA0YPQv9C/0YsqL1xyXG4vKk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0J5R3JvdXBJZCA9IGFzeW5jIGZ1bmN0aW9uIChncm91cElEKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJveHkvY29yZS92MS9ncm91cHMvJyArIGdyb3VwSUQpO1xyXG4gIGxldCBsaXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICBsZXQgc3R1ZGVudHNMaXN0ID0gbGlzdC5fZW1iZWRkZWQuc3R1ZGVudHM7XHJcbiAgcmV0dXJuIHN0dWRlbnRzTGlzdDtcclxufTsqL1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFN0dWRlbnRzQnlVSUQgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudHNfaW5mbykge1xyXG4gICAgbGV0IHN0dWRlbnRzID0gW10sIHVybHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHNfaW5mby5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIHVybHMucHVzaCgnL3Byb3h5L2NvcmUvdjEvcGVvcGxlLycgKyBzdHVkZW50c19pbmZvW2ldLnVpZF9zdHVkZW50KTtcclxuICAgIH1cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgICAgICApKVxyXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXNMZW5ndGggPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXNMZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgc3R1ZGVudHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheU5hbWU6IHJlc3VsdHNbaV0uZGlzcGxheU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfbmFtZTogcmVzdWx0c1tpXS5fbGlua3MuZ3JvdXBzWzBdLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfVUlEOiByZXN1bHRzW2ldLl9saW5rcy5ncm91cHNbMF0uaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZV9jcmVhdGlvbl9yZXF1ZXN0OiBzdHVkZW50c19pbmZvW2ldLmRhdGVfY3JlYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgaWRfcmVxdWVzdDogc3R1ZGVudHNfaW5mb1tpXS5pZF9yZXF1ZXN0LFxyXG4gICAgICAgICAgICAgICAgICAgIHVpZF9zdHVkZW50OiBzdHVkZW50c19pbmZvW2ldLnVpZF9zdHVkZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGlkX29yZ2FuaXNhdGlvbjogc3R1ZGVudHNfaW5mb1tpXS5pZF9vcmdhbmlzYXRpb25cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICByZXR1cm4gc3R1ZGVudHM7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0U3R1ZGVudHNGcm9tTERBUCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBncm91cHMgPSBhd2FpdCB0aGlzLmdldEdyb3VwcygpO1xyXG4gICAgbGV0IHVybHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5Hcm91cHMucHVzaChuZXcgR3JvdXAoZ3JvdXBzW2ldLmlkLCBncm91cHNbaV0ubmFtZSkpO1xyXG4gICAgICAgIHVybHMucHVzaCgnL3Byb3h5L2NvcmUvdjEvZ3JvdXBzLycgKyBncm91cHNbaV0uaWQpO1xyXG4gICAgfVxyXG4gICAgYXdhaXQgdGhpcy5nZXRTdHVkZW50c0J5R3JvdXBJZHModXJscyk7XHJcbn07XHJcblxyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFN0dWRlbnRzQnlHcm91cElkcyA9IGFzeW5jIGZ1bmN0aW9uICh1cmxzKSB7XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgIClcclxuICAgICAgICAudGhlbihyZXNwb25zZXMgPT4gUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICAgICAgKSlcclxuICAgICAgICAudGhlbihyZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzTGVuZ3RoID0gcmVzdWx0cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBzdHVkZW50cyA9IHJlc3VsdHNbaV0uX2VtYmVkZGVkLnN0dWRlbnRzO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RMZW5ndGggPSBzdHVkZW50cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN0TGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgc3R1ZGVudCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiBzdHVkZW50c1tqXS5kaXNwbGF5TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJ3VpZCc6IHN0dWRlbnRzW2pdLnVpZFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMucHVzaChzdHVkZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEN1cnJlbnRZZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IGN1cnJlbnRZZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XHJcbiAgICByZXR1cm4gY3VycmVudFllYXI7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZGlzdHJpYnV0ZUdyb3Vwc0J5Q291cnNlcyA9IGFzeW5jIGZ1bmN0aW9uIChjdXJyZW50WWVhcikge1xyXG4gICAgdGhpcy5Db3Vyc2VzID0gW1xyXG4gICAgICAgIG5ldyBDb3Vyc2UoJzEnKSxcclxuICAgICAgICBuZXcgQ291cnNlKCcyJyksXHJcbiAgICAgICAgbmV3IENvdXJzZSgnMycpLFxyXG4gICAgICAgIG5ldyBDb3Vyc2UoJzQnKSxcclxuICAgICAgICBuZXcgQ291cnNlKCcxICjQvNCzKScpLFxyXG4gICAgICAgIG5ldyBDb3Vyc2UoJzIgKNC80LMpJylcclxuICAgIF07XHJcbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBsZXQgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xyXG4gICAgaWYgKCtjdXJyZW50TW9udGggPCBTRVBURU1CRVIpIHtcclxuICAgICAgICBjdXJyZW50WWVhciAtPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Db3Vyc2VzW21hc3RlckZpcnN0Q291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ291cnNlc1tmaXJzdENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudFllYXItLTtcclxuICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Db3Vyc2VzW21hc3RlclNlY29uZENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNvdXJzZXNbc2Vjb25kQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNvdXJzZXNbdGhpcmRDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRZZWFyLS07XHJcbiAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ291cnNlc1tmb3VydGhDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRZZWFyICs9IDM7XHJcbiAgICB9XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS5nZXRQcmFjdGljZSA9IGFzeW5jIGZ1bmN0aW9uIChpbmZvX2Fib3V0X3ByYWN0aWNlKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgaW5mb19hYm91dF9wcmFjdGljZSA9IFwiP3llYXI9XCIgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLnllYXIgKyBcIiZlZHVfbGV2ZWw9XCJcclxuICAgICAgICArIGluZm9fYWJvdXRfcHJhY3RpY2UuZWR1X2xldmVsICsgXCImdHlwZVByYWN0aWNlPVwiXHJcbiAgICAgICAgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLnR5cGVQcmFjdGljZTtcclxuICAgIGxldCBpbmZvID0gMDtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3ByYWN0aWNlJyArIGluZm9fYWJvdXRfcHJhY3RpY2UsIHBhcmFtcylcclxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaW5mbyA9IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgcmV0dXJuIGluZm87XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0QnlTdHVkZW50VUlEID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlLCBzdHVkZW50KSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAnP3VpZD0nICsgc3R1ZGVudC51aWQgKyBcIiZpZF9wcmFjdGljZT1cIlxyXG4gICAgICAgICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9yZXF1c3QtYnktc3R1ZGVudC11aWQnICsgaW5mbywgcGFyYW1zKTtcclxuICAgIGxldCByZXF1ZXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHJldHVybiByZXF1ZXN0O1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZUlkT3JnYW5pc2F0aW9uSW5SZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0ICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiXHJcbiAgICAgICAgKyBzdHVkZW50LmlkX29yZ2FuaXNhdGlvbjtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3VwZGF0ZS1yZXF1ZXN0JyArIGluZm8sIHBhcmFtcyk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdHMgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UsIGdyb3Vwcykge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCByZXF1ZXN0cyA9IFtdO1xyXG4gICAgbGV0IHVybHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IGluZm8gPSAnP2lkX3N0dWRlbnQ9JyArIGdyb3Vwc1tpXS5zdHVkZW50c1tqXS51aWQgKyBcIiZpZF9wcmFjdGljZT1cIlxyXG4gICAgICAgICAgICAgICAgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgICAgICAgICAgdXJscy5wdXNoKCcvcmVxdXN0cy1ieS1zdHVkZW50LXByYWN0aWNlJyArIGluZm8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsLCBwYXJhbXMpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgICAgICApKVxyXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3RzLnB1c2gocmVzdWx0c1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIHJldHVybiByZXF1ZXN0czsvL9C/0L7Qu9GD0YfQuNC70LggYWxsINC30LDRj9Cy0L7QuiDRgdGC0YPQtNC10L3RgtC+0LIg0LLRi9Cx0YDQsNC90L3Ri9GFINCz0YDRg9C/0L9cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5hc3Nvc2lhdGVSZXF1ZXN0VG9TdHVkZW50ID0gYXN5bmMgZnVuY3Rpb24gKHJlcXVlc3RzLCBncm91cHMpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwcy5sZW5ndGg7ICsraikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gZ3JvdXBzW2pdKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLmxlbmd0aDsgKytrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCByZXF1ZXN0cy5sZW5ndGg7ICsrbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10udWlkID09PSByZXF1ZXN0c1tuXS51aWRfc3R1ZGVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfcmVxdWVzdCA9IHJlcXVlc3RzW25dLmlkX3JlcXVlc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdHNbbl0uaWRfb3JnYW5pc2F0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfb3JnYW5pc2F0aW9uID0gcmVxdWVzdHNbbl0uaWRfb3JnYW5pc2F0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzT3JnYW5pc2F0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZEdyb3Vwcykge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCB1cmxzID0gW107XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uc19ieV9yZXF1ZXN0ID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7ICsraikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyArK2spIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmxzLnB1c2goJy9vcmdhbmlzYXRpb25zLWJ5LXJlcXVlc3QnICsgJz9pZF9yZXF1ZXN0PSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgKyB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9yZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICApXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICAgICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgICAgICkpXHJcbiAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc19ieV9yZXF1ZXN0LnB1c2gocmVzdWx0c1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIHJldHVybiBvcmdhbmlzYXRpb25zX2J5X3JlcXVlc3Q7XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0QnlTdHVkZW50VUlEUyA9IGFzeW5jIGZ1bmN0aW9uIChwcmFjdGljZSwgc3R1ZGVudHMpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgdXJscyA9IFtdO1xyXG4gICAgbGV0IHJlcXVlc3RzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdXJscy5wdXNoKCcvcmVxdXN0LWJ5LXN0dWRlbnQtdWlkJyArICc/dWlkPScgKyBzdHVkZW50c1tpXS51aWRcclxuICAgICAgICAgICAgKyBcIiZpZF9wcmFjdGljZT1cIlxyXG4gICAgICAgICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlKTtcclxuICAgIH1cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICApXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICAgICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgICAgICkpXHJcbiAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdHMucHVzaChyZXN1bHRzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXF1ZXN0cztcclxufTtcclxuTW9kZWwucHJvdG90eXBlLmdldFByYWN0aWNlWWVhcnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy95ZWFycy1wcmFjdGljZScpO1xyXG4gICAgbGV0IHllYXJzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHJldHVybiB5ZWFycztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0c09yZ2FuaXNhdGlvbnNCeVJlcXVlc3RJZCA9IGFzeW5jIGZ1bmN0aW9uIChyZXF1ZXN0cykge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCB1cmxzID0gW107XHJcbiAgICBsZXQgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXF1ZXN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHVybHMucHVzaCgnL29yZ2FuaXNhdGlvbnMtYnktcmVxdWVzdCcgKyAnP2lkX3JlcXVlc3Q9JyArIHJlcXVlc3RzW2ldLmlkX3JlcXVlc3QpO1xyXG4gICAgfVxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgIClcclxuICAgICAgICAudGhlbihyZXNwb25zZXMgPT4gUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICAgICAgKSlcclxuICAgICAgICAudGhlbihyZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0c19vcmdhbmlzYXRpb25zLnB1c2gocmVzdWx0c1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVxdWVzdHNfb3JnYW5pc2F0aW9ucztcclxufTtcclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBDUkVBVElPTlxyXG4gU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbk1vZGVsLnByb3RvdHlwZS5pbml0ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgLypsZXQgc3ViSUQgPSBcIjU3MjM4YmQ5LTM2ZTgtNGQ4NC04MTYwLWViNGFkOTU3YTg0MVwiO1xyXG4gICAgbGV0IHVzZXJUb2tlbiA9IGdldFVzZXJUb2tlbigpLCB1c2VyPTA7XHJcbiAgICBpZiAoIXVzZXJUb2tlbikge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IENPTkZJRy5ub190b2tlbl9sb2NhdGlvbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gc3ViSUQgPSBKU09OLnBhcnNlKGF0b2IodXNlclRva2VuLnNwbGl0KCcuJylbMV0pKS5zdWI7XHJcbiAgICAgIHVzZXI9ICBhd2FpdCB0aGlzLmdldFVzZXJJbmZvKHN1YklEKTtcclxuICAgIH1cclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9ICc/dXNlclR5cGU9JyArIHVzZXIudHlwZVVzZXI7Ki9cclxuICAgIGF3YWl0IGZldGNoKCcvdXNlci1jYWJpbmV0JyArIGluZm8sIHBhcmFtcyk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0VXNlckluZm8gPSBhc3luYyBmdW5jdGlvbiAoc3ViSUQpIHtcclxuICAgIGxldCB1c2VyID0ge307XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcm94eS9jb3JlL3YxL3Blb3BsZS8/dWlkPScgKyBzdWJJRCk7XHJcbiAgICBsZXQgc3ViamVjdCA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICBsZXQgdHlwZV91c2VyPXN1YmplY3QuX2VtYmVkZGVkLnBlb3BsZVtcIjBcIl0udGl0bGU7XHJcbiAgICBpZih0eXBlX3VzZXIubGVuZ3RoPT09Mil7XHJcbiAgICAgICAgdHlwZV91c2VyPXN1YmplY3QuX2VtYmVkZGVkLnBlb3BsZVtcIjBcIl0udGl0bGVbMV07XHJcbiAgICB9XHJcbiAgICBsZXQgZ2l2ZW5OYW1lID0gc3ViamVjdC5fZW1iZWRkZWQucGVvcGxlW1wiMFwiXS5naXZlbk5hbWU7XHJcbiAgICBsZXQgc24gPSBzdWJqZWN0Ll9lbWJlZGRlZC5wZW9wbGVbXCIwXCJdLnNuO1xyXG4gICAgdXNlci5maXJzdE5hbWU9Z2l2ZW5OYW1lO1xyXG4gICAgdXNlci5sYXN0TmFtZT0gc247XHJcbiAgICB1c2VyLnR5cGVVc2VyPXR5cGVfdXNlcjtcclxuICAgIHJldHVybiB1c2VyO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2V0VXNlclRva2VuKCkge1xyXG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyLXRva2VuJyk7XHJcbn1cclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRUeXBlc09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSBbXTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3R5cGVzLW9yZ2FuaXNhdGlvbicpO1xyXG4gICAgbGV0IHR5cGVzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSB0eXBlcztcclxuICAgIHJldHVybiB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9ucycpO1xyXG4gICAgbGV0IG9yZ3MgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgdGhpcy5PcmdhbmlzYXRpb25zID0gb3JncztcclxuICAgIHJldHVybiB0aGlzLk9yZ2FuaXNhdGlvbnM7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9uc0J5UHJhY3RpY2VJZCA9IGFzeW5jIGZ1bmN0aW9uIChwcmFjdGljZSkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBpbmZvID0gJz9pZF9wcmFjdGljZT0nICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb25zLWJ5LXByYWN0aWNlJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9ucztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25CeUlkID0gYXN5bmMgZnVuY3Rpb24gKGlkKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAnP2lkPScgKyBpZDtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbi1ieS1pZCcgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzQnlQcmFjdGljZUlkID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAnP2lkX3ByYWN0aWNlPScgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3JlcXVlc3RzLWJ5LXByYWN0aWNlJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICBsZXQgcmVxdWVzdHMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgcmV0dXJuIHJlcXVlc3RzO1xyXG59O1xyXG5cclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0c0J5T3JnYW5pc2F0aW9uTmFtZSA9IGFzeW5jIGZ1bmN0aW9uIChvcmdhbmlzYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmFjdGljZSwgaXNBcHByb3ZlZCkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBpbmZvID0gMCwgU1RBVFVTO1xyXG4gICAgaWYgKCFpc0FwcHJvdmVkKSB7XHJcbiAgICAgICAgaW5mbyA9IFwiP2lkX3ByYWN0aWNlPVwiICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgICAgICAgU1RBVFVTID0gMDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGluZm8gPSBcIj9pZF9wcmFjdGljZT1cIiArIHByYWN0aWNlLmlkX3ByYWN0aWNlICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiXHJcbiAgICAgICAgICAgICsgb3JnYW5pc2F0aW9uLmlkO1xyXG4gICAgICAgIFNUQVRVUyA9IDE7XHJcbiAgICB9XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9yZXF1ZXN0cy1ieS1wcmFjdGljZScgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgbGV0IHJlcXVlc3RzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIGxldCBzdHVkZW50cyA9IFtdO1xyXG4gICAgbGV0IHVybHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxdWVzdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB1cmxzLnB1c2goXCIvZXhpc3QtcmVxdWVzdD9pZF9yZXF1ZXN0PVwiICsgcmVxdWVzdHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIlxyXG4gICAgICAgICAgICArIG9yZ2FuaXNhdGlvbi5pZCk7XHJcbiAgICB9XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsLCBwYXJhbXMpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgICAgICApKVxyXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXNMZW5ndGggPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXNMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbaV0gIT09ICdOb3QgZm91bmQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbaV0uaWRfc3RhdHVzID09PSBTVEFUVVMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R1ZGVudHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZF9yZXF1ZXN0OiByZXN1bHRzW2ldLmlkX3JlcXVlc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZF9vcmdhbmlzYXRpb246IHJlc3VsdHNbaV0uaWRfb3JnYW5pc2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRfc3RhdHVzOiByZXN1bHRzW2ldLmlkX3N0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVpZF9zdHVkZW50OiByZXF1ZXN0c1tpXS51aWRfc3R1ZGVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3ByYWN0aWNlOiByZXF1ZXN0c1tpXS5pZF9wcmFjdGljZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3JldmlldzogcmVxdWVzdHNbaV0uaWRfcmV2aWV3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0ZV9jcmVhdGlvbjogcmVzdWx0c1tpXS5kYXRlX2NyZWF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHN0dWRlbnRzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbkJ5TmFtZSA9IGFzeW5jIGZ1bmN0aW9uIChuYW1lT3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAnP25hbWU9JyArIG5hbWVPcmdhbmlzYXRpb247XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tYnktbmFtZScgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldERldGVybWluZWRHcm91cHMgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICAgIGxldCBkZXRlcm1pbmVkR3JvdXBzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICAgICAgICAgIGRldGVybWluZWRHcm91cHMucHVzaCh0aGlzLkdyb3Vwc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGV0ZXJtaW5lZEdyb3VwcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tY3JlYXRlJywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkob3JnYW5pc2F0aW9uKVxyXG4gICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQvtGA0LPQsNC90LjQt9Cw0YbQuNC4INCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbikge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9uLXVwZGF0ZScsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9yZ2FuaXNhdGlvbilcclxuICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0L7RgNCz0LDQvdC40LfQsNGG0LjQuCDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZVByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZScsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByYWN0aWNlKVxyXG4gICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQv9GA0LDQutGC0LjQutC4INCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuY3JlYXRlT3JVcGRhdGVTdHVkZW50cyA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50cykge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvc3R1ZGVudHMnLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzdHVkZW50cylcclxuICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40LggdWlkINGB0YLRg9C00LXQvdGC0L7QsiDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudCkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIHZhciBjdXJyZW50RGF0ZSA9IGRhdGUuZm9ybWF0KFwieXl5eS1tbS1kZFwiKTtcclxuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3RcclxuICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uICsgXCImaWRfc3RhdHVzPVwiXHJcbiAgICAgICAgKyBzdHVkZW50LmlkX3N0YXR1cyArIFwiJmRhdGVfY3JlYXRpb249XCJcclxuICAgICAgICArIGN1cnJlbnREYXRlO1xyXG4gICAgYXdhaXQgZmV0Y2goJy91cGRhdGUtcmVxdWVzdC1vcmdhbmlzYXRpb24nICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0c09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50cykge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCB1cmxzID0gW107XHJcbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICB2YXIgY3VycmVudERhdGUgPSBkYXRlLmZvcm1hdChcInl5eXktbW0tZGRcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnRzW2ldLmlkX3JlcXVlc3RcclxuICAgICAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb24gKyBcIiZpZF9zdGF0dXM9XCJcclxuICAgICAgICAgICAgKyBzdHVkZW50c1tpXS5pZF9zdGF0dXMgKyBcIiZkYXRlX2NyZWF0aW9uPVwiXHJcbiAgICAgICAgICAgICsgY3VycmVudERhdGU7XHJcbiAgICAgICAgdXJscy5wdXNoKCcvdXBkYXRlLXJlcXVlc3Qtb3JnYW5pc2F0aW9uJyArIGluZm8pO1xyXG4gICAgfVxyXG5cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0T3JnYW5pc2F0aW9uQnlSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcblxyXG4gICAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdCArIFwiJmlkX3N0YXR1cz1cIlxyXG4gICAgICAgICsgc3R1ZGVudC5pZF9zdGF0dXMgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50LmlkX29yZ2FuaXNhdGlvbjtcclxuICAgIGF3YWl0IGZldGNoKCcvdXBkYXRlLXJlcXVlc3Qtb3JnYW5pc2F0aW9uLWJ5LXJlcXVlc3QnICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RzT3JnYW5pc2F0aW9uQnlSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IHVybHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnRzW2ldLmlkX29yZ2FuaXNhdGlvbiArIFwiJmlkX3N0YXR1cz1cIlxyXG4gICAgICAgICAgICArIHN0dWRlbnRzW2ldLmlkX3N0YXR1cztcclxuICAgICAgICB1cmxzLnB1c2goJy91cGRhdGUtcmVxdWVzdC1vcmdhbmlzYXRpb24tYnktcmVxdWVzdCcgKyBpbmZvKTtcclxuICAgIH1cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpKTtcclxufTtcclxuTW9kZWwucHJvdG90eXBlLmluc2VydFJlcXVlc3RPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudCkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIHZhciBjdXJyZW50RGF0ZSA9IGRhdGUuZm9ybWF0KFwieXl5eS1tbS1kZFwiKTtcclxuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3QgKyBcIiZpZF9vcmdhbmlzYXRpb249XCJcclxuICAgICAgICArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uICsgXCImaWRfc3RhdHVzPVwiICsgc3R1ZGVudC5pZF9zdGF0dXNcclxuICAgICAgICArIFwiJmRhdGVfY3JlYXRpb249XCJcclxuICAgICAgICArIGN1cnJlbnREYXRlO1xyXG4gICAgYXdhaXQgZmV0Y2goJy9pbnNlcnQtcmVxdWVzdC1vcmdhbmlzYXRpb24nICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0ID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9IDA7XHJcbiAgICBpZiAoc3R1ZGVudC5pZF9zdGF0dXMgPT09IFJFSkVDVEVEKSB7XHJcbiAgICAgICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0XHJcbiAgICAgICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPW51bGxcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uO1xyXG4gICAgfVxyXG4gICAgYXdhaXQgZmV0Y2goJy91cGRhdGUtcmVxdWVzdCcgKyBpbmZvLCBwYXJhbXMpO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlUmVxdWVzdHMgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudHMpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9IDA7XHJcbiAgICBsZXQgdXJscyA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgaW5mbyA9IDA7XHJcbiAgICAgICAgaWYgKHN0dWRlbnRzW2ldLmlkX3N0YXR1cyA9PT0gUkVKRUNURUQpIHtcclxuICAgICAgICAgICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249bnVsbFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVybHMucHVzaCgnL3VwZGF0ZS1yZXF1ZXN0JyArIGluZm8pO1xyXG4gICAgfVxyXG5cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZW5lcmF0ZURvY3VtZW50ID0gYXN5bmMgZnVuY3Rpb24gKGRvY3VtZW50LCB0eXBlX2RvY3VtZW50LCB0eXBlX3ByYWN0aWNlKSB7XHJcbiAgICB0eXBlX3ByYWN0aWNlID0gdHlwZV9wcmFjdGljZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgbGV0IGluZm9ybWF0aW9uID0ge1xyXG4gICAgICAgIGRhdGE6IGRvY3VtZW50LFxyXG4gICAgICAgIHR5cGVfZG9jdW1lbnQ6IHR5cGVfZG9jdW1lbnQsXHJcbiAgICAgICAgdHlwZV9wcmFjdGljZTogdHlwZV9wcmFjdGljZVxyXG4gICAgfTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL2RvY3VtZW50Jywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoaW5mb3JtYXRpb24pXHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXNwKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3AuYmxvYigpO1xyXG4gICAgfSkudGhlbihmdW5jdGlvbiAoYmxvYikge1xyXG4gICAgICAgIHNhdmVBcyhibG9iLCB0eXBlX2RvY3VtZW50ICsgJyAnICsgdHlwZV9wcmFjdGljZSArICcg0L/RgNCw0LrRgtC40LrQsCAnICsgZG9jdW1lbnQuZ3JvdXBfbmFtZSArIFwiLmRvY3hcIik7XHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LPQtdC90LXRgNCw0YbQuNC4INC00L7QutGD0LzQtdC90YLQsCBcIiArIGVycm9yKTtcclxuICAgIH0pO1xyXG4gICAgZGVidWdnZXI7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9Nb2RlbC5qcyIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgXCJzZXJ2ZXJfcG9ydFwiOiA3Nzc3LFxyXG4gICAgXCJ1c2VfcHJveHlcIjogZmFsc2UsXHJcbiAgICBcInN1cGVydmlzb3JfcGF0aFwiOiBcIi9zdXBlcnZpc29yX2NhYmluZXRcIixcclxuICAgIFwic3R1ZGVudF9wYXRoXCI6IFwiL3N0dWRlbnRfY2FiaW5ldFwiLFxyXG4gICAgXCJub190b2tlbl9sb2NhdGlvblwiOiBcImh0dHA6Ly9lc2IuaWlwby50dS1icnlhbnNrLnJ1L2F1dGhlbnRpY2F0aW9uLz9yZWRpcmVjdD1odHRwOi8vZXNiLmlpcG8udHUtYnJ5YW5zay5ydS9wcmFjdGljZS9cIixcclxuICAgIFwib3JpZ2luX2xvY2F0aW9uXCI6IFwiL3ByYWN0aWNlL1wiLFxyXG4gICAgXCJkYlwiOiBcInByYWN0aWNlXCIsXHJcbiAgICBcInByb3h5XCI6IFwiaHR0cDovL2VzYi5paXBvLnR1LWJyeWFuc2sucnVcIlxyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gY29uZmlnL3JlbF9jb25maWcuanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1jb2xvcnMuY3NzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1yZXNwb25zaXZlLmNzc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2xpYnMvRGF0YVRhYmxlcy9kYXRhdGFibGVzLm1pbi5jc3Ncbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9zdHlsZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDMVhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQWJBO0FBZUE7QUFqQkE7QUF1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQUNBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVkE7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWQTtBQVlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBZkE7QUFpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNyeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFDQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVEE7QUFDQTtBQVdBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBR0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBQ0E7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDdnlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7OztBIiwic291cmNlUm9vdCI6IiJ9
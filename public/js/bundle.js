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
__webpack_require__(12);

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

/*========================================GENERATE DOCUMENTS SECTION================================================*/
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
    var d;
    let t = this.View.readTextFile("/js/assets/json/data.json", function (text) {
        d = JSON.parse(text);
        console.log(d);
        return d;
    });

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
    await this.setYears();
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

Controller.prototype.updateOrganisation = async function () {
    let organisation = this.View.getInfoNewOrganisation();
    await this.Model.updateOrganisation(organisation);
};

Controller.prototype.createNewOrganisation = async function () {
    let organisation = this.View.getInfoNewOrganisation();
    await this.Model.createOrganisation(organisation);
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

Controller.prototype.showDialogEditOrganisation = async function (event) {
    let idOrganisation = this.View.getIdOrganisation(event);
    let organisation = await this.Model.getOrganisationById(idOrganisation);
    this.View.showDialogOrganisation(organisation);
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
    this.infoGroups = null;
    /* this.infoGroups = [
         {
             "name": "МОА",
             "fullName": "02.03.03 «Математическое обеспечение и администрирование информационных систем»",
             "profile": "«Технология программирования»",
             "type": "bachelor"
         },
         {
             "name": "ПРИ",
             "fullName": "09.03.04 «Программная инженерия»",
             "profile": "«Разработка программно-информационных систем»",
             "type": "bachelor"
         },
         {
             "name": "ИВТ-1",
             "fullName": "09.03.01 «Информатика и вычислительная техника»",
             "profile": "«Программное обеспечение вычислительной техники и автоматизированных систем»",
             "type": "bachelor"
         },
         {
             "name": "ИВТ-2",
             "fullName": "09.03.01 «Информатика и вычислительная техника»",
             "profile": "«Программное обеспечение вычислительной техники и автоматизированных систем»",
             "type": "bachelor"
         },
         {
             "name": "ИВТ-3",
             "fullName": "09.03.01 «Информатика и вычислительная техника»",
             "profile": "«Программное обеспечение вычислительной техники и автоматизированных систем»",
             "type": "bachelor"
         },
         {
             "name": "ПРИ (мг)",
             "fullName": "09.04.04 «Программная инженерия»",
             "profile": "«Проектирование программно-информационных систем»",
             "type": "master"
         },
         {
             "name": "ИВТ-1 (мг)",
             "fullName": "09.04.01 «Информатика и вычислительная техника»",
             "profile": "«Компьютерный анализ и интерпретация данных»",
             "type": "master"
         },
         {
             "name": "ИВТ-2 (мг)",
             "fullName": "09.04.01 «Информатика и вычислительная техника»",
             "profile": "«Информационное и программное обеспечение вычислительных систем»",
             "type": "master"
         },
         {
             "name": "БАС",
             "fullName": "09.04.01 «Информатика и вычислительная техника»",
             "profile": "«Информационное и программное обеспечение вычислительных систем»",
             "type": "bachelor"
         }
     ];*/
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
    let numWeeks = document.getElementById("textWeeks").innerHTML;
    let toDate = document.getElementById("toDateInput").value + ' ' + numWeeks;
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
View.prototype.createWeeksText = function () {
    let toDate = document.getElementById("toDateInput");
    let fromDate = document.getElementById("fromDateInput");
    let toDateCalendar = document.getElementById("toDateCalendar");
    toDateCalendar.display = "none";

    let text = document.getElementById("textWeeks");
    text.style.display = "none";

    fromDate.onchange = function () {
        toDateCalendar.style.display = "inline-block";
        toDate.value = "";
    };
    toDate.onchange = function () {
        let weeks = getWeeks(fromDate.value.replace(/\s+/g, '') + " 00:00", toDate.value.replace(/\s+/g, '') + " 00:00");
        text.style.display = "block";
        weeks = roundPlus(weeks, 1);
        text.innerHTML = "Количество недель: " + weeks;
        if (isInteger(weeks)) {
            text.setAttribute("class", "margin20 green");
        } else {
            text.setAttribute("class", "margin20 red");
        }
    };
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
    this.createWeeksText();

    let toDateCalendar = document.getElementById("toDateCalendar");
    toDateCalendar.style.display = "none";
    document.getElementById("fromDateInput").value = "";
    document.getElementById("toDateInput").value = "";
    toDateCalendar.value = "";
    document.getElementById("deadline").value = "";
    document.getElementById("lecNum").value = "";
    for (let i = 0; i < this.idTreeViews.length; i++) {
        let inputs = document.getElementById(this.idTreeViews[i]).querySelectorAll('input');
        for (let j = 0; j < inputs.length; j++) {
            $(inputs[j]).attr('checked', false);
        }
    }
    /* let steps= document.getElementsByClassName("steps")[0].children;
     steps[0].style.display="block";
     for(let i=0;i<this.idTreeViews.length;i++){
         steps[i].style.display='none';
     }*/
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
    } else {
        alert("Возможность генерации документов для преддипломной практики в стадии разработки. Приносим свои извинения за предоставленные неудобства");
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

    elem = document.getElementById("num_lections");
    elem.value = +practice.lections_number;
};
View.prototype.readTextFile = function (file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            var res = callback(rawFile.responseText);
            this.infoGroups = res;
            return res;
        }
    };
    rawFile.send(null);
};

//usage:

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

module.exports = [{"name":"МОА","fullName":"02.03.03 «Математическое обеспечение и администрирование информационных систем»","profile":"«Технология программирования»","type":"bachelor"},{"name":"ПРИ","fullName":"09.03.04 «Программная инженерия»","profile":"«Разработка программно-информационных систем»","type":"bachelor"},{"name":"ИВТ-1","fullName":"09.03.01 «Информатика и вычислительная техника»","profile":"«Программное обеспечение вычислительной техники и автоматизированных систем»","type":"bachelor"},{"name":"ИВТ-2","fullName":"09.03.01 «Информатика и вычислительная техника»","profile":"«Программное обеспечение вычислительной техники и автоматизированных систем»","type":"bachelor"},{"name":"ИВТ-3","fullName":"09.03.01 «Информатика и вычислительная техника»","profile":"«Программное обеспечение вычислительной техники и автоматизированных систем»","type":"bachelor"},{"name":"ПРИ (мг)","fullName":"09.04.04 «Программная инженерия»","profile":"«Проектирование программно-информационных систем»","type":"master"},{"name":"ИВТ-1 (мг)","fullName":"09.04.01 «Информатика и вычислительная техника»","profile":"«Компьютерный анализ и интерпретация данных»","type":"master"},{"name":"ИВТ-2 (мг)","fullName":"09.04.01 «Информатика и вычислительная техника»","profile":"«Информационное и программное обеспечение вычислительных систем»","type":"master"},{"name":"БАС","fullName":"09.04.01 «Информатика и вычислительная техника»","profile":"«Информационное и программное обеспечение вычислительных систем»","type":"bachelor"}]

/***/ }),
/* 12 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGQ0ZWFlNDdkMWU1MjMzY2FlN2ZjIiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vL2NvbmZpZy9yZWxfY29uZmlnLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1jb2xvcnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWljb25zLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1yZXNwb25zaXZlLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvYXNzZXRzL2pzb24vZGF0YS5qc29uIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkNGVhZTQ3ZDFlNTIzM2NhZTdmYyIsImNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlICgnLi9Db250cm9sbGVyLmpzJyk7XG5cbnJlcXVpcmUoJy4uL2Fzc2V0cy9jc3MvbWV0cm8uY3NzJyk7XG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MnKTtcbnJlcXVpcmUoJy4uL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzJyk7XG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzJyk7XG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzJyk7XG5yZXF1aXJlKCcuL2xpYnMvRGF0YVRhYmxlcy9kYXRhdGFibGVzLm1pbi5jc3MnKTtcbnJlcXVpcmUoJy4vYXNzZXRzL2pzb24vZGF0YS5qc29uJyk7XG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcblxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBuZXcgQ29udHJvbGxlcigpO1xufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9tYWluLmpzIiwiY29uc3QgVmlldyA9IHJlcXVpcmUoJy4vVmlldy5qcycpO1xuY29uc3QgTW9kZWwgPSByZXF1aXJlKCcuL01vZGVsLmpzJyk7XG5cbmZ1bmN0aW9uIENvbnRyb2xsZXIoKSB7XG4gICAgdGhpcy5WaWV3ID0gbmV3IFZpZXcoKTtcbiAgICB0aGlzLk1vZGVsID0gbmV3IE1vZGVsKCk7XG4gICAgdGhpcy5pbml0KCk7XG59XG5cbmNvbnN0IEFQUFJPVkVEID0gMTtcbmNvbnN0IFJFSkVDVEVEID0gMjtcbkNvbnRyb2xsZXIucHJvdG90eXBlLmluaXQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XG4gICAgLy8gYXdhaXQgdGhpcy5Nb2RlbC5pbml0KCk7XG4gICAgYXdhaXQgdGhpcy5zZXRZZWFycygpO1xuICAgIHRoaXMuVmlldy5vbkNsaWNrTmV4dFN0ZXBEaXNwbGF5R3JvdXBzVHJlZVZpZXcgPSB0aGlzLmRpc3BsYXlHcm91cHMuYmluZCh0aGlzKTtcbiAgICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZVByYWN0aWNlID0gdGhpcy5nb1RvUHJhY3RpY2VDcmVhdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuVmlldy5vbkNsaWNrQWRkUHJhY3RpY2UgPSB0aGlzLmNyZWF0ZVByYWN0aWNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tUb09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gdGhpcy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24uYmluZChcbiAgICAgICAgdGhpcyk7XG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbiA9IHRoaXMuZ29Ub1N0dWRlbnRzU2VjdGlvbi5iaW5kKHRoaXMpO1xuICAgIHRoaXMuVmlldy5vbkNsaWNrRmluaXNoQnRuID0gdGhpcy5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0LmJpbmQodGhpcyk7XG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rID0gdGhpcy5yZW5kZXJEYXRhSW5UYWJsZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuVmlldy5vbkNsaWNrWWVhcnNBcnJheSA9IHRoaXMuc2V0R3JvdXBzVHJlZVZpZXcuYmluZCh0aGlzKTtcbiAgICB0aGlzLlZpZXcub25DbGlja0dldE9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldE9yZ2FuaXNhdGlvbnMuYmluZCh0aGlzKTtcbiAgICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbiA9IHRoaXMudXBkYXRlVHJlZVZpZXcuYmluZCh0aGlzKTtcbiAgICB0aGlzLlZpZXcub25DbGlja0Rpc3BsYXlJbmZvQWJvdXRPcmcgPSB0aGlzLmRpc3BsYXlJbmZvQWJvdXRPcmcuYmluZCh0aGlzKTtcbiAgICB0aGlzLlZpZXcub25DbGlja0Rpc3BsYXlPcmdhbmlzYXRpb25zID0gdGhpcy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24uYmluZChcbiAgICAgICAgdGhpcyk7XG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tFZGl0T3JnYW5pc2F0aW9uID0gdGhpcy5zaG93RGlhbG9nRWRpdE9yZ2FuaXNhdGlvbi5iaW5kKFxuICAgICAgICB0aGlzKTtcbiAgICB0aGlzLlZpZXcub25DbGlja1VwZGF0ZU9yZ2FuaXNhdGlvbiA9IHRoaXMudXBkYXRlT3JnYW5pc2F0aW9uLmJpbmQodGhpcyk7XG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tBcHByb3ZlU3R1ZGVudCA9IHRoaXMuY2hhbmdlU3R1ZGVudFN0YXR1cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuVmlldy5vbkNsaWNrUmVqZWN0U3R1ZGVudCA9IHRoaXMuY2hhbmdlU3R1ZGVudFN0YXR1cy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuVmlldy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZyA9IHRoaXMuYWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZy5iaW5kKFxuICAgICAgICB0aGlzKTtcbiAgICB0aGlzLlZpZXcub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbiA9IHRoaXMuYWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uLmJpbmQoXG4gICAgICAgIHRoaXMpO1xuICAgIHRoaXMuVmlldy5vbkNsaWNrU2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQgPSB0aGlzLnNob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50LmJpbmQoXG4gICAgICAgIHRoaXMpO1xuICAgIHRoaXMuVmlldy5vbkNsaWNrR2VuZXJhdGVEb2N1bWVudCA9IHRoaXMuZ2VuZXJhdGVEb2N1bWVudC5iaW5kKFxuICAgICAgICB0aGlzKTtcbiAgICB0aGlzLlZpZXcub25DaGFuZ2VUeXBlRG9jdW1lbnQgPSB0aGlzLmluaXREaWFsb2cuYmluZChcbiAgICAgICAgdGhpcyk7XG4gICAgdGhpcy5WaWV3LmluaXQoKTtcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmdldFN0dWRlbnRzRnJvbUxEQVAoKTtcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkZXIoKTtcbn07XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUdFTkVSQVRFIERPQ1VNRU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbkNvbnRyb2xsZXIucHJvdG90eXBlLmluaXREaWFsb2cgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHR5cGVfZG9jdW1lbnQgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0VmFsdWUoXCJnZHR5cGVEb2N1bWVudFwiKTtcbiAgICBsZXQgaXNPcmRlciA9IGZhbHNlO1xuICAgIGlmICh0eXBlX2RvY3VtZW50ID09PSBcItCf0YDQuNC60LDQt1wiKSB7XG4gICAgICAgIGlzT3JkZXIgPSB0cnVlO1xuICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZUlucHV0cyhpc09yZGVyKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlzT3JkZXIgPSBmYWxzZTtcbiAgICAgICAgYXdhaXQgdGhpcy5jcmVhdGVJbnB1dHMoaXNPcmRlcik7XG4gICAgfVxufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUuY3JlYXRlSW5wdXRzID0gYXN5bmMgZnVuY3Rpb24gKGlzT3JkZXIpIHtcbiAgICBsZXQgc2VsZWN0ZWRHcm91cHMgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRHcm91cHMoKTtcbiAgICBpZiAoaXNPcmRlcikgey8v0L/RgNC40LrQsNC3XG4gICAgICAgIGxldCBibG9jayA9IHRoaXMuVmlldy5nZXRFbGVtQnlJZChcImdyb3Vwcy1yZXBvcnQtYmxvY2tcIik7XG4gICAgICAgIHRoaXMuVmlldy5yZW1vdmVDaGlsZHJlbihibG9jayk7XG4gICAgICAgIHRoaXMuVmlldy5jaGFuZ2VEaXNwbGF5KFwicmVwb3J0LWJsb2NrXCIsIFwibm9uZVwiKTtcbiAgICAgICAgdGhpcy5WaWV3LmNoYW5nZURpc3BsYXkoXCJvcmRlci1ibG9ja1wiLCBcImJsb2NrXCIpO1xuICAgICAgICB0aGlzLlZpZXcuY3JlYXRlSW5wdXRzT3JkZXIoc2VsZWN0ZWRHcm91cHMpO1xuICAgICAgICB0aGlzLlZpZXcuY2hhbmdlSW5uZXJIdG1sKFwidHlwZURvY3VtZW50XCIsIFwi0L/RgNC40LrQsNC30LBcIik7XG4gICAgfVxuICAgIGVsc2Ugey8v0L7RgtGH0LXRglxuICAgICAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRVc2VySW5mb0Fib3V0UHJhY3RpY2UoKTtcbiAgICAgICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcbiAgICAgICAgbGV0IGJsb2NrID0gdGhpcy5WaWV3LmdldEVsZW1CeUlkKFwib3JkZXItYmxvY2tcIik7XG4gICAgICAgIHRoaXMuVmlldy5yZW1vdmVDaGlsZHJlbihibG9jayk7XG4gICAgICAgIHRoaXMuVmlldy5jcmVhdGVJbnB1dHNSZXBvcnQoc2VsZWN0ZWRHcm91cHMpO1xuICAgICAgICB0aGlzLlZpZXcuY2hhbmdlRGlzcGxheShcInJlcG9ydC1ibG9ja1wiLCBcImJsb2NrXCIpO1xuICAgICAgICB0aGlzLlZpZXcuY2hhbmdlRGlzcGxheShcIm9yZGVyLWJsb2NrXCIsIFwibm9uZVwiKTtcbiAgICAgICAgdGhpcy5WaWV3LmNoYW5nZUlubmVySHRtbChcInR5cGVEb2N1bWVudFwiLCBcItC+0YLRh9C10YLQsFwiKTtcbiAgICAgICAgbGV0IG9yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbnNCeVByYWN0aWNlSWQocHJhY3RpY2UpO1xuICAgICAgICB0aGlzLlZpZXcuZmlsbERpYWxvZyhwcmFjdGljZSwgb3JnYW5pc2F0aW9ucyk7XG4gICAgfVxufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUuc2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcbiAgICBpZiAocHJhY3RpY2UubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIGxldCBncm91cHNQcmFjdGljZVBhcnRpY2lwYW50cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0R3JvdXBzQnlQcmFjdGljZUlkKFxuICAgICAgICAgICAgcHJhY3RpY2UpO1xuICAgICAgICBpZiAoZ3JvdXBzUHJhY3RpY2VQYXJ0aWNpcGFudHMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLlZpZXcuZGlhbG9nT3BlbihcIiNkaWFsb2dHZW5lcmF0ZVJlcG9ydFwiKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCLQn9GA0LDQutGC0LrQuCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCISDQlNC70Y8g0LPQtdC90LXRgNCw0YbQuNC4INC00L7QutGD0LzQtdC90YLQsCDQv9GA0LDQutGC0LjQutCwINC00LvRjyDQstGL0LHRgNCw0L3QvdGL0YUg0LPRgNGD0L/QvyDQtNC+0LvQttC90LAg0YHRg9GJ0LXRgdGC0LLQvtCy0LDRgtGMLlwiKTtcbiAgICB9XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZW5lcmF0ZURvY3VtZW50ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkO1xuICBsZXQgdD10aGlzLlZpZXcucmVhZFRleHRGaWxlKFwiL2pzL2Fzc2V0cy9qc29uL2RhdGEuanNvblwiLCBmdW5jdGlvbiAodGV4dCkge1xuICAgICAgICBkICA9IEpTT04ucGFyc2UodGV4dCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGQpO1xuICAgICAgICByZXR1cm4gZDtcbiAgICB9KTtcblxuICAgIGxldCBzZWxlY3RlZEdyb3VwcyA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZEdyb3VwcygpO1xuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xuICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XG4gICAgbGV0IHR5cGVfZG9jdW1lbnQgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0VmFsdWUoXCJnZHR5cGVEb2N1bWVudFwiKTtcbiAgICBsZXQgZG9jdW1lbnRzID0gMCwgZGF0YSA9IDA7XG5cbiAgICBpZiAodHlwZV9kb2N1bWVudCA9PT0gXCLQn9GA0LjQutCw0LdcIikge1xuICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5nZXRQcmVmZXJlbmNlc1N0dWRlbnRzT3JnYW5pc2F0aW9ucygpO1xuICAgICAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uc0J5UHJhY3RpY2VJZChwcmFjdGljZSk7XG4gICAgICAgIGRvY3VtZW50cyA9IHRoaXMuVmlldy5nZXRJbmZvcm1hdGlvbkZvckRvY3VtZW50T3JkZXIocHJhY3RpY2UsIHNlbGVjdGVkR3JvdXBzLCB0aGlzLk1vZGVsLkdyb3VwcywgZGF0YSwgb3JnYW5pc2F0aW9ucyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uc0J5UHJhY3RpY2VJZChwcmFjdGljZSk7XG4gICAgICAgIGRvY3VtZW50cyA9IHRoaXMuVmlldy5nZXRJbmZvcm1hdGlvbkZvckRvY3VtZW50UmVwb3J0KHByYWN0aWNlLCBzZWxlY3RlZEdyb3VwcywgdGhpcy5Nb2RlbC5Hcm91cHMsIG9yZ2FuaXNhdGlvbnMpO1xuXG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkb2N1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXdhaXQgdGhpcy5Nb2RlbC5nZW5lcmF0ZURvY3VtZW50KGRvY3VtZW50c1tpXSwgdHlwZV9kb2N1bWVudCwgaW5mb19hYm91dF9wcmFjdGljZS50eXBlUHJhY3RpY2UpO1xuICAgIH1cbn07XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub1ByYWN0aWNlQ3JlYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcbiAgICB0aGlzLlZpZXcuY2xlYXJQcmFjdGljZVNlY3Rpb24oKTtcbiAgICBsZXQgdHlwZXNPcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uKCk7XG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0KHR5cGVzT3JnYW5pc2F0aW9uKTtcbiAgICB0aGlzLlZpZXcuZ29Ub1ByYWN0aWNlQ3JlYXRpb24oKTtcbiAgICB0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID0gdGhpcy5Nb2RlbC5nZXRDdXJyZW50WWVhcigpO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUuZGlzcGxheUdyb3VwcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLlZpZXcuZGlzcGxheUdyb3VwcygpO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLlZpZXcuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCgpO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgYXdhaXQgdGhpcy5jcmVhdGVOZXdPcmdhbmlzYXRpb24oKTtcbiAgICBhd2FpdCB0aGlzLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uKCk7XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5jcmVhdGVQcmFjdGljZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkZXIoKTtcbiAgICBsZXQgcHJhY3RpY2UgPSB0aGlzLlZpZXcuUHJhY3RpY2U7XG4gICAgbGV0IGdyb3VwcyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0RGV0ZXJtaW5lZEdyb3VwcyhwcmFjdGljZS5ncm91cHMpO1xuICAgIHByYWN0aWNlLmdyb3VwcyA9IGdyb3VwcztcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmNyZWF0ZVByYWN0aWNlKHByYWN0aWNlKTtcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkZXIoKTtcbiAgICBhd2FpdCAgdGhpcy5zZXRZZWFycygpO1xuICAgIHRoaXMuZ29Ub1N0dWRlbnRzU2VjdGlvbigpO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlVHlwZXNPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRUeXBlc09yZ2FuaXNhdGlvbigpO1xuICAgIHRoaXMuVmlldy5jbGVhclR5cGVzT3JnYW5pc2F0aW9uKCk7XG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uKHR5cGVzT3JnYW5pc2F0aW9uKTtcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xuICAgIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zSW5UcmVlVmlldyhvcmdhbmlzYXRpb25zLCB0eXBlc09yZ2FuaXNhdGlvbik7XG4gICAgcmV0dXJuIHR5cGVzT3JnYW5pc2F0aW9uO1xufTtcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuQ29udHJvbGxlci5wcm90b3R5cGUuc2V0WWVhcnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHllYXJzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZVllYXJzKCk7XG4gICAgdGhpcy5WaWV3LnNldFllYXJzQXJyYXkoeWVhcnMpO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub1N0dWRlbnRzU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLlZpZXcuZ29Ub1N0dWRlbnRzU2VjdGlvbigpO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5kaXN0cmlidXRlR3JvdXBzQnlDb3Vyc2VzKHRoaXMuVmlldy5zZWxlY3RlZFllYXIpO1xuICAgIGF3YWl0IHRoaXMuVmlldy5jbGVhckdyb3Vwc1RyZWVWaWV3KCk7XG4gICAgYXdhaXQgdGhpcy5WaWV3LnVwZGF0ZUdyb3Vwc1RyZWVWaWV3KHRoaXMuTW9kZWwuQ291cnNlcywgdGhpcy5Nb2RlbC5Hcm91cHMpO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUuc2V0R3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB0aGlzLlZpZXcudXBkYXRlWWVhcihldmVudCk7XG4gICAgaWYgKHRoaXMuVmlldy5zZWxlY3RlZFllYXIgPT09IFwiK1wiKSB7XG4gICAgICAgIHRoaXMuVmlldy5zZWxlY3RlZFllYXIgPSB0aGlzLk1vZGVsLmdldEN1cnJlbnRZZWFyKCk7XG4gICAgICAgIGF3YWl0IHRoaXMuZ29Ub1ByYWN0aWNlQ3JlYXRpb24oKTtcbiAgICB9XG4gICAgYXdhaXQgdGhpcy5yZW5kZXJHcm91cHNUcmVlVmlldygpO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0UHJlZmVyZW5jZXNTdHVkZW50c09yZ2FuaXNhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHNlbGVjdGVkR3JvdXBzID0gdGhpcy5WaWV3LmdldFNlbGVjdGVkR3JvdXBzKCk7XG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XG4gICAgbGV0IHByYWN0aWNlID0gW10sIGRhdGEgPSAwLCBncm91cHNPYmplY3RzID0gW107XG4gICAgaWYgKHNlbGVjdGVkR3JvdXBzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XG4gICAgICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Nb2RlbC5Hcm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLk1vZGVsLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBzT2JqZWN0cy5wdXNoKHRoaXMuTW9kZWwuR3JvdXBzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBncm91cHNQcmFjdGljZVBhcnRpY2lwYW50cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0R3JvdXBzQnlQcmFjdGljZUlkKFxuICAgICAgICAgICAgICAgIHByYWN0aWNlKTtcbiAgICAgICAgICAgIHNlbGVjdGVkR3JvdXBzID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc1ByYWN0aWNlUGFydGljaXBhbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHNPYmplY3RzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgrZ3JvdXBzUHJhY3RpY2VQYXJ0aWNpcGFudHNbaV0udWlkX2dyb3VwXG4gICAgICAgICAgICAgICAgICAgICAgICA9PT0gZ3JvdXBzT2JqZWN0c1tqXS51aWRfTERBUCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRHcm91cHMucHVzaChncm91cHNPYmplY3RzW2pdLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0c19vcmdhbmlzYXRpb25zO1xuICAgICAgICAgICAgICAgIGxldCByZXF1ZXN0cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdHMocHJhY3RpY2UsIGdyb3Vwc09iamVjdHMpO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuTW9kZWwuYXNzb3NpYXRlUmVxdWVzdFRvU3R1ZGVudChyZXF1ZXN0cywgc2VsZWN0ZWRHcm91cHMpO1xuICAgICAgICAgICAgICAgIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzT3JnYW5pc2F0aW9ucyhcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRHcm91cHMpO1xuICAgICAgICAgICAgICAgIGRhdGEgPSBhd2FpdCB0aGlzLk1vZGVsLmdldERhdGEoc2VsZWN0ZWRHcm91cHMsIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZW5kZXJEYXRhSW5UYWJsZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkZXIoKTtcbiAgICBsZXQgcHJhY3RpY2UgPSBbXSwgZGF0YSA9IDA7XG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XG4gICAgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xuICAgIGRhdGEgPSBhd2FpdCB0aGlzLmdldFByZWZlcmVuY2VzU3R1ZGVudHNPcmdhbmlzYXRpb25zKCk7XG4gICAgaWYgKGRhdGEgPT09IDApIHtcbiAgICAgICAgcHJhY3RpY2UgPSBbXTtcbiAgICAgICAgdGhpcy5WaWV3LnJlbmRlclRhYmxlKGRhdGEpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5WaWV3LnJlbmRlclRhYmxlKGRhdGEpO1xuICAgIH1cbiAgICB0aGlzLlZpZXcuY29sb3JUYWJsZShkYXRhKTtcbiAgICB0aGlzLlZpZXcucmVuZGVySW5mbyhwcmFjdGljZSk7XG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XG59O1xuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1PUkdBTklTQVRJT05TIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRlcigpO1xuICAgIGxldCBvcmdhbmlzYXRpb25zID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25zKCk7XG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRUeXBlc09yZ2FuaXNhdGlvbigpO1xuICAgIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvblNlbGVjdCh0eXBlc09yZ2FuaXNhdGlvbik7XG4gICAgdGhpcy5WaWV3LnNldE9yZ2FuaXNhdGlvbnNMaXN0KG9yZ2FuaXNhdGlvbnMsIFwiYWxsT3JnYW5pc2F0aW9uc0xpc3RcIik7XG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XG4gICAgdGhpcy5WaWV3LmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbigpO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0QXBwcm92ZWRBbmROb25BcHByb3ZlZFN0dWRlbnRzID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbikge1xuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25QcmFjdGljZSgpO1xuICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XG4gICAgbGV0IGFwcHJvdmVkX3N0dWRlbnRfY291bnQgPSAwLCBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9IDA7XG4gICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICBhcHByb3ZlZF9zdHVkZW50X2NvdW50ID0gYXdhaXQgdGhpcy5yZW5kZXJTdHVkZW50TGlzdChvcmdhbmlzYXRpb24sXG4gICAgICAgICAgICBwcmFjdGljZSwgXCJhcHByb3ZlZFN0dWRlbnRzXCIpO1xuICAgICAgICBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9IGF3YWl0IHRoaXMucmVuZGVyU3R1ZGVudExpc3Qob3JnYW5pc2F0aW9uLFxuICAgICAgICAgICAgcHJhY3RpY2UsIFwibm9uQXBwcm92ZWRTdHVkZW50c1wiKTtcbiAgICB9XG4gICAgdGhpcy5WaWV3LnVwZGF0ZU9yZ2FuaXNhdGlvblRpdGxlKG9yZ2FuaXNhdGlvbi5uYW1lLCBhcHByb3ZlZF9zdHVkZW50X2NvdW50LFxuICAgICAgICBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCk7XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5kaXNwbGF5SW5mb0Fib3V0T3JnID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IG5hbWVPcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRPcmdhbmlzYXRpb24oZXZlbnQpO1xuICAgIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbkJ5TmFtZShuYW1lT3JnYW5pc2F0aW9uKTtcbiAgICBhd2FpdCB0aGlzLmdldEFwcHJvdmVkQW5kTm9uQXBwcm92ZWRTdHVkZW50cyhvcmdhbmlzYXRpb24pO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyU3R1ZGVudExpc3QgPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uLCBwcmFjdGljZSwgaWRMaXN0KSB7XG4gICAgbGV0IHN0YXR1cztcbiAgICBpZiAoaWRMaXN0ID09PSBcImFwcHJvdmVkU3R1ZGVudHNcIikge1xuICAgICAgICBzdGF0dXMgPSB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RhdHVzID0gZmFsc2U7XG4gICAgfVxuICAgIGxldCBzdHVkZW50c0luZm8gPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzQnlPcmdhbmlzYXRpb25OYW1lKFxuICAgICAgICBvcmdhbmlzYXRpb24sIHByYWN0aWNlLCBzdGF0dXMpO1xuICAgIGxldCBzdHVkZW50cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0U3R1ZGVudHNCeVVJRChzdHVkZW50c0luZm8pO1xuICAgIHRoaXMuVmlldy51cGRhdGVTdHVkZW50c0xpc3RWaWV3KHN0dWRlbnRzLCBpZExpc3QpO1xuICAgIHJldHVybiBzdHVkZW50cy5sZW5ndGg7XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25QcmFjdGljZSgpO1xuICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XG4gICAgbGV0IG9yZ2FuaXNhdGlvbnMgPSAwO1xuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uc0J5UHJhY3RpY2VJZChwcmFjdGljZSk7XG4gICAgfVxuICAgIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zTGlzdChvcmdhbmlzYXRpb25zLCBcIm9yZ2FuaXNhdGlvbkxpc3RcIik7XG4gICAgdGhpcy5WaWV3LnJlbmRlck9yZ2FuaXNhdGlvblNlY3Rpb24ocHJhY3RpY2UpO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldE5hbWVPcmdhbmlzYXRpb25CeVRpdGxlKCk7XG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlOYW1lKG5hbWVPcmdhbmlzYXRpb24pO1xuICAgIHJldHVybiBvcmdhbmlzYXRpb247XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5jaGFuZ2VTdHVkZW50U3RhdHVzID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XG4gICAgbGV0IHN0dWRlbnQgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRTdHVkZW50KGV2ZW50KTtcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RPcmdhbmlzYXRpb24oc3R1ZGVudCk7XG4gICAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0KHN0dWRlbnQpO1xuXG4gICAgc3R1ZGVudFsnaWRfc3RhdHVzJ10gPSBSRUpFQ1RFRDtcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RPcmdhbmlzYXRpb25CeVJlcXVlc3Qoc3R1ZGVudCk7XG5cbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5nZXRPcmdhbmlzYXRpb24oKTtcbiAgICBhd2FpdCB0aGlzLmdldEFwcHJvdmVkQW5kTm9uQXBwcm92ZWRTdHVkZW50cyhvcmdhbmlzYXRpb24pO1xuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRlcigpO1xufTtcblxuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGxldCBvcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0SW5mb05ld09yZ2FuaXNhdGlvbigpO1xuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlT3JnYW5pc2F0aW9uKG9yZ2FuaXNhdGlvbik7XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5jcmVhdGVOZXdPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRJbmZvTmV3T3JnYW5pc2F0aW9uKCk7XG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5jcmVhdGVPcmdhbmlzYXRpb24ob3JnYW5pc2F0aW9uKTtcbn1cblxuQ29udHJvbGxlci5wcm90b3R5cGUuYWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UoKTtcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xuICAgIGxldCB1aWRzR3JvdXBzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRHcm91cHNCeVByYWN0aWNlSWQocHJhY3RpY2UpO1xuICAgIGxldCBuYW1lc0dyb3VwcyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0R3JvdXBzTmFtZUJ5R3JvdXBzVUlEKHVpZHNHcm91cHMpO1xuICAgIHRoaXMuVmlldy5kaWFsb2dFbmFibGVDaGVja2JveGVzKG5hbWVzR3JvdXBzLFxuICAgICAgICBcImdyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWRpYWxvZ0FkZC1iYWNoZWxvclwiKTtcbiAgICB0aGlzLlZpZXcuZGlhbG9nRW5hYmxlQ2hlY2tib3hlcyhuYW1lc0dyb3VwcyxcbiAgICAgICAgXCJncm91cC10cmVldmlldy10YWJjb250cm9sMi1kaWFsb2dBZGQtbWFzdGVyXCIpO1xuICAgIHRoaXMuVmlldy5kaWFsb2dPcGVuKFwiI2RpYWxvZ0FkZFN0dWRlbnRcIik7XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5hZGRTdHVkZW50VG9PcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHN0dWRlbnRzID0gYXdhaXQgdGhpcy5WaWV3LmdldFNlbGVjdGVkU3R1ZGVudHMoZXZlbnQpO1xuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25QcmFjdGljZSgpO1xuICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XG4gICAgbGV0IG5hbWVPcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0TmFtZU9yZ2FuaXNhdGlvbkluVHJlZXZpZXcoXG4gICAgICAgIFwib3JnYW5pc2F0aW9uTGlzdFwiKTtcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25CeU5hbWUobmFtZU9yZ2FuaXNhdGlvbik7XG4gICAgbGV0IHJlcXVlc3RzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRSZXF1ZXN0QnlTdHVkZW50VUlEUyhwcmFjdGljZSxcbiAgICAgICAgc3R1ZGVudHMpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByZXF1ZXN0cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKHN0dWRlbnRzW2ldLnVpZCA9PT0gcmVxdWVzdHNbal0udWlkX3N0dWRlbnQpIHtcbiAgICAgICAgICAgICAgICBzdHVkZW50c1tpXVsnaWRfcmVxdWVzdCddID0gcmVxdWVzdHNbal0uaWRfcmVxdWVzdDtcbiAgICAgICAgICAgICAgICBzdHVkZW50c1tpXVsnaWRfcHJhY3RpY2UnXSA9IHByYWN0aWNlLmlkX3ByYWN0aWNlO1xuICAgICAgICAgICAgICAgIHN0dWRlbnRzW2ldWydpZF9vcmdhbmlzYXRpb24nXSA9IG9yZ2FuaXNhdGlvbi5pZDtcbiAgICAgICAgICAgICAgICBzdHVkZW50c1tpXVsnaWRfc3RhdHVzJ10gPSBBUFBST1ZFRDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RzT3JnYW5pc2F0aW9uKHN0dWRlbnRzKTtcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RzKHN0dWRlbnRzKTtcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3R1ZGVudHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgc3R1ZGVudHNbal1bJ2lkX3N0YXR1cyddID0gUkVKRUNURUQ7XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlUmVxdWVzdHNPcmdhbmlzYXRpb25CeVJlcXVlc3Qoc3R1ZGVudHMpO1xuICAgIGF3YWl0IHRoaXMuZ2V0QXBwcm92ZWRBbmROb25BcHByb3ZlZFN0dWRlbnRzKG9yZ2FuaXNhdGlvbik7XG59O1xuXG5Db250cm9sbGVyLnByb3RvdHlwZS5zaG93RGlhbG9nRWRpdE9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGxldCBpZE9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRJZE9yZ2FuaXNhdGlvbihldmVudCk7XG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlJZChpZE9yZ2FuaXNhdGlvbik7XG4gICAgdGhpcy5WaWV3LnNob3dEaWFsb2dPcmdhbmlzYXRpb24ob3JnYW5pc2F0aW9uKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbGxlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJjb25zdCBiYWNoZWxvclllYXIgPSA0O1xuY29uc3QgbWFzdGVyWWVhciA9IDY7XG5sZXQgc2VsZWN0ZWRFbGVtID0gMDtcblxudmFyIFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5pbmZvR3JvdXBzID0gIG51bGw7XG4gICAvKiB0aGlzLmluZm9Hcm91cHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcItCc0J7QkFwiLFxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjAyLjAzLjAzIMKr0JzQsNGC0LXQvNCw0YLQuNGH0LXRgdC60L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INC4INCw0LTQvNC40L3QuNGB0YLRgNC40YDQvtCy0LDQvdC40LUg0LjQvdGE0L7RgNC80LDRhtC40L7QvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQotC10YXQvdC+0LvQvtCz0LjRjyDQv9GA0L7Qs9GA0LDQvNC80LjRgNC+0LLQsNC90LjRj8K7XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJiYWNoZWxvclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcItCf0KDQmFwiLFxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjAzLjA0IMKr0J/RgNC+0LPRgNCw0LzQvNC90LDRjyDQuNC90LbQtdC90LXRgNC40Y/Cu1wiLFxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQoNCw0LfRgNCw0LHQvtGC0LrQsCDQv9GA0L7Qs9GA0LDQvNC80L3Qvi3QuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJiYWNoZWxvclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcItCY0JLQoi0xXCIsXG4gICAgICAgICAgICBcImZ1bGxOYW1lXCI6IFwiMDkuMDMuMDEgwqvQmNC90YTQvtGA0LzQsNGC0LjQutCwINC4INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdCw0Y8g0YLQtdGF0L3QuNC60LDCu1wiLFxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQn9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90L7QuSDRgtC10YXQvdC40LrQuCDQuCDQsNCy0YLQvtC80LDRgtC40LfQuNGA0L7QstCw0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0JjQktCiLTJcIixcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wMy4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXG4gICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Cf0YDQvtCz0YDQsNC80LzQvdC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QvtC5INGC0LXRhdC90LjQutC4INC4INCw0LLRgtC+0LzQsNGC0LjQt9C40YDQvtCy0LDQvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYmFjaGVsb3JcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQmNCS0KItM1wiLFxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJiYWNoZWxvclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcItCf0KDQmCAo0LzQsylcIixcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wNC4wNCDCq9Cf0YDQvtCz0YDQsNC80LzQvdCw0Y8g0LjQvdC20LXQvdC10YDQuNGPwrtcIixcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0J/RgNC+0LXQutGC0LjRgNC+0LLQsNC90LjQtSDQv9GA0L7Qs9GA0LDQvNC80L3Qvi3QuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJtYXN0ZXJcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBcIm5hbWVcIjogXCLQmNCS0KItMSAo0LzQsylcIixcbiAgICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wNC4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXG4gICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Ca0L7QvNC/0YzRjtGC0LXRgNC90YvQuSDQsNC90LDQu9C40Lcg0Lgg0LjQvdGC0LXRgNC/0YDQtdGC0LDRhtC40Y8g0LTQsNC90L3Ri9GFwrtcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIm1hc3RlclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwibmFtZVwiOiBcItCY0JLQoi0yICjQvNCzKVwiLFxuICAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjA0LjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcbiAgICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0JjQvdGE0L7RgNC80LDRhtC40L7QvdC90L7QtSDQuCDQv9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwibWFzdGVyXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgXCJuYW1lXCI6IFwi0JHQkNChXCIsXG4gICAgICAgICAgICBcImZ1bGxOYW1lXCI6IFwiMDkuMDQuMDEgwqvQmNC90YTQvtGA0LzQsNGC0LjQutCwINC4INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdCw0Y8g0YLQtdGF0L3QuNC60LDCu1wiLFxuICAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQmNC90YTQvtGA0LzQsNGG0LjQvtC90L3QvtC1INC4INC/0YDQvtCz0YDQsNC80LzQvdC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJiYWNoZWxvclwiXG4gICAgICAgIH1cbiAgICBdOyovXG4gICAgdGhpcy5vbkNsaWNrTmV4dFN0ZXBEaXNwbGF5R3JvdXBzVHJlZVZpZXcgPSBudWxsO1xuICAgIHRoaXMub25DbGlja1ByYWN0aWNlQ29tcGxldGVkID0gbnVsbDtcbiAgICB0aGlzLm9uQ2xpY2tDcmVhdGVQcmFjdGljZSA9IG51bGw7XG4gICAgdGhpcy5vbkNsaWNrQWRkUHJhY3RpY2UgPSBudWxsO1xuICAgIHRoaXMub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBudWxsO1xuICAgIHRoaXMub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLm9uQ2xpY2tGaW5pc2hCdG4gPSBudWxsO1xuICAgIHRoaXMub25DbGlja1NlbGVjdEdyb3VwQnRuT2sgPSBudWxsO1xuICAgIHRoaXMubXlUYWJsZSA9ICQoJyNzdHVkZW50c0xpc3RUYWJsZScpO1xuICAgIHRoaXMub25DbGlja1llYXJzQXJyYXkgPSBudWxsO1xuICAgIHRoaXMuc2VsZWN0ZWRZZWFyID0gbnVsbDtcbiAgICB0aGlzLmlkVHJlZVZpZXdzID0gW1xuICAgICAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDEtYmFjaGVsb3InLFxuICAgICAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItbWFzdGVyJyxcbiAgICAgICAgJ2dyb3Vwcy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbi1iYWNoZWxvcicsXG4gICAgICAgICdncm91cHMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb24tbWFzdGVyJyxcbiAgICAgICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWRpYWxvZ0FkZC1iYWNoZWxvcicsXG4gICAgICAgICdncm91cC10cmVldmlldy10YWJjb250cm9sMi1kaWFsb2dBZGQtbWFzdGVyJ1xuICAgIF07XG4gICAgdGhpcy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyA9IG51bGw7XG4gICAgdGhpcy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uID0gbnVsbDtcbiAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5SW5mb0Fib3V0T3JnID0gbnVsbDtcbiAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5T3JnYW5pc2F0aW9ucyA9IG51bGw7XG4gICAgdGhpcy5vbkNsaWNrRWRpdE9yZ2FuaXNhdGlvbiA9IG51bGw7XG4gICAgdGhpcy5vbkNsaWNrQXBwcm92ZVN0dWRlbnQgPSBudWxsO1xuICAgIHRoaXMub25DbGlja1JlamVjdFN0dWRlbnQgPSBudWxsO1xuICAgIHRoaXMub25DbGlja1VwZGF0ZU9yZ2FuaXNhdGlvbiA9IG51bGw7XG4gICAgdGhpcy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZyA9IG51bGw7XG4gICAgdGhpcy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uID0gbnVsbDtcbiAgICB0aGlzLm9uQ2xpY2tTaG93RGlhbG9nR2VuZXJhdGVEb2N1bWVudCA9IG51bGw7XG4gICAgdGhpcy5vbkNsaWNrR2VuZXJhdGVEb2N1bWVudCA9IG51bGw7XG4gICAgdGhpcy5vbkNoYW5nZVR5cGVEb2N1bWVudCA9IG51bGw7XG4gICAgdGhpcy5QcmFjdGljZSA9IG51bGw7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tbmV4dFwiKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgIHRoaXMub25DbGlja05leHRTdGVwRGlzcGxheUdyb3Vwc1RyZWVWaWV3KTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RpYWxvZ1ByYWN0aWNlQ29tcGxldGVTdWNjZXNzXCIpLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiI3ByYWN0aWNlRmluaXNoZWRPa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgIHRoaXMub25DbGlja1ByYWN0aWNlQ29tcGxldGVkKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ2FuaXNhdGlvbnNTZWN0aW9uQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcbiAgICAgICAgdGhpcy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkZW50c1NlY3Rpb25CdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICB0aGlzLm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1maW5pc2hcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICB0aGlzLm9uQ2xpY2tGaW5pc2hCdG4pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2V0R3JvdXBzQnRuT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICB0aGlzLm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbnNBcnJheVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgIHRoaXMub25DbGlja1llYXJzQXJyYXkpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5MVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgIHRoaXMub25DbGlja1llYXJzQXJyYXkpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2V0T3JnYW5pc2F0aW9uc0J0bk9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcbiAgICAgICAgdGhpcy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVPcmdhbmlzYXRpb25cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICB0aGlzLm9uQ2xpY2tDcmVhdGVPcmdhbmlzYXRpb24pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJhY3RpY2VGaW5pc2hlZE9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcbiAgICAgICAgdGhpcy5vbkNsaWNrQWRkUHJhY3RpY2UpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvd0FsbE9yZ2FuaXNhdGlvbnNcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5T3JnYW5pc2F0aW9ucyk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICB0aGlzLm9uQ2xpY2tVcGRhdGVPcmdhbmlzYXRpb24pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkU3R1ZGVudEJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgIHRoaXMub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzaG93RGlhbG9nR2VuZXJhdGVEb2N1bWVudEJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgIHRoaXMub25DbGlja1Nob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdlbmVyYXRlRG9jdW1lbnRCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxuICAgICAgICB0aGlzLm9uQ2xpY2tHZW5lcmF0ZURvY3VtZW50KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdkdHlwZURvY3VtZW50XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsXG4gICAgICAgIHRoaXMub25DaGFuZ2VUeXBlRG9jdW1lbnQpO1xuXG4gICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSh7XG4gICAgICAgIGRhdGE6IHRoaXMuR3JvdXBzLFxuICAgICAgICBcImxhbmd1YWdlXCI6IHtcbiAgICAgICAgICAgIFwiemVyb1JlY29yZHNcIjogXCLQotCw0LrQvtC5INC30LDQv9C40YHQuCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiLFxuICAgICAgICAgICAgXCJlbXB0eVRhYmxlXCI6IFwi0J3QuCDQvtC00L3QsCDQuNC3INCz0YDRg9C/0L8g0L3QtSDQstGL0LHRgNCw0L3QsCDQu9C40LHQviDQv9GA0LDQutGC0LjQutC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCIsXG4gICAgICAgICAgICBcInNlYXJjaFwiOiBcItCf0L7QuNGB0Lo6XCIsXG4gICAgICAgICAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAgICAgICAgICAgICBcImZpcnN0XCI6IFwi0J/QtdGA0LLRi9C5XCIsXG4gICAgICAgICAgICAgICAgXCJsYXN0XCI6IFwi0J/QvtGB0LvQtdC00L3QuNC5XCIsXG4gICAgICAgICAgICAgICAgXCJuZXh0XCI6IFwi0JLQv9C10YDQtdC0XCIsXG4gICAgICAgICAgICAgICAgXCJwcmV2aW91c1wiOiBcItCd0LDQt9Cw0LRcIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiaW5mb0ZpbHRlcmVkXCI6IFwiKNC40LcgX01BWF8g0YHRgtGD0LTQtdC90YLQvtCyKVwiLFxuICAgICAgICAgICAgXCJsZW5ndGhNZW51XCI6IFwi0J/QvtC60LDQt9Cw0YLRjCBfTUVOVV8g0LfQsNC/0LjRgdC10LlcIixcbiAgICAgICAgICAgIFwiaW5mb1wiOiBcItCe0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHRgtGD0LTQtdC90YLQvtCyOiBfVE9UQUxfIFwiLFxuICAgICAgICAgICAgXCJpbmZvRW1wdHlcIjogXCLQktGL0LHQtdGA0LjRgtC1INCz0YDRg9C/0L/Rgy5cIlxuICAgICAgICB9LFxuICAgICAgICBcImNvbHVtbnNcIjogW1xuICAgICAgICAgICAge1wiZGF0YVwiOiBcImdyb3VwXCJ9LFxuICAgICAgICAgICAge1wiZGF0YVwiOiBcInN0dWRlbnRcIn0sXG4gICAgICAgICAgICB7XCJkYXRhXCI6IFwib3JnYW5pc2F0aW9uXCJ9XG4gICAgICAgIF1cbiAgICB9KTtcbn07XG5cblZpZXcucHJvdG90eXBlLmdvVG9TdHVkZW50c1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvcmdhbmlzYXRpb25zU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuXG4gICAgbGV0IHRyZWVWaWV3cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmVldmlld1wiKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB0cmVlVmlld3NbaV0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9XG59O1xuXG5WaWV3LnByb3RvdHlwZS5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvcmdhbmlzYXRpb25zU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3R1ZGVudHNSZXF1ZXN0c1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGxPcmdhbmlzYXRpb25zTGlzdEJsb2NrXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5nb1RvUHJhY3RpY2VDcmVhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ByYWN0aWNlQ3JlYXRpb25TZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcbiAgICAgICAgXCJ0cnVlXCIpO1xufTtcblxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5WaWV3LnByb3RvdHlwZS5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBmaW5pc2hCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLWZpbmlzaFwiKVswXTtcbiAgICBmaW5pc2hCdG4uc2V0QXR0cmlidXRlKFwib25jbGlja1wiLFxuICAgICAgICBcIm1ldHJvRGlhbG9nLm9wZW4oJyNkaWFsb2dQcmFjdGljZUNvbXBsZXRlU3VjY2VzcycpXCIpO1xuICAgIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1Y2F0aW9uXCIpLnZhbHVlO1xuICAgIGlmIChlZHVjYXRpb25MZXZlbCA9PT0gXCJiYWNoZWxvclwiKVxuICAgICAgICBlZHVjYXRpb25MZXZlbCA9IFwi0JHQsNC60LDQu9Cw0LLRgNC40LDRglwiO1xuICAgIGVsc2Uge1xuICAgICAgICBlZHVjYXRpb25MZXZlbCA9IFwi0JzQsNCz0LjRgdGC0YDQsNGC0YPRgNCwXCI7XG4gICAgfVxuICAgIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVQcmFjdGljZVwiKS52YWx1ZTtcblxuICAgIGxldCBsZWNOdW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY051bVwiKS52YWx1ZTtcbiAgICBsZXQgZnJvbURhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZyb21EYXRlSW5wdXRcIikudmFsdWU7XG4gICAgbGV0IG51bVdlZWtzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXh0V2Vla3NcIikuaW5uZXJIVE1MO1xuICAgIGxldCB0b0RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvRGF0ZUlucHV0XCIpLnZhbHVlKycgJyArbnVtV2Vla3M7XG4gICAgbGV0IGRlYWRsaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRlcm1zUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gJ2MgJyArIGZyb21EYXRlXG4gICAgICAgICsgJyDQv9C+ICcgKyB0b0RhdGU7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGRlYWRsaW5lO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1Rlcm1zUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gZnJvbURhdGVcbiAgICAgICAgKyAnIC0gJyArIHRvRGF0ZTtcbiAgICBpZiAoZnJvbURhdGUgPT09IFwiXCIpIHtcbiAgICAgICAgZnJvbURhdGUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZnJvbURhdGUgPSBmcm9tRGF0ZS5zdWJzdHIoOCwgNCkgKyAnLScgKyBmcm9tRGF0ZS5zdWJzdHIoNCwgMikgKyAnLSdcbiAgICAgICAgICAgICsgZnJvbURhdGUuc3Vic3RyKDAsIDIpICsgJyAnICsgJzIxOjAwOjAwLjAwMCArMDA6MDAnO1xuICAgIH1cbiAgICBpZiAodG9EYXRlID09PSBcIlwiKSB7XG4gICAgICAgIHRvRGF0ZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0b0RhdGUgPSB0b0RhdGUuc3Vic3RyKDgsIDQpICsgJy0nICsgdG9EYXRlLnN1YnN0cig0LCAyKSArICctJ1xuICAgICAgICAgICAgKyB0b0RhdGUuc3Vic3RyKDAsIDIpICsgJyAnICsgJzIxOjAwOjAwLjAwMCArMDA6MDAnO1xuICAgIH1cbiAgICBpZiAoZGVhZGxpbmUgPT09IFwiXCIpIHtcbiAgICAgICAgZGVhZGxpbmUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZGVhZGxpbmUgPSBkZWFkbGluZS5zdWJzdHIoOCwgNCkgKyAnLScgKyBkZWFkbGluZS5zdWJzdHIoNCwgMikgKyAnLSdcbiAgICAgICAgICAgICsgZGVhZGxpbmUuc3Vic3RyKDAsIDIpICsgJyAnICsgJzIxOjAwOjAwLjAwMCArMDA6MDAnO1xuICAgIH1cblxuICAgIGxldCB0cmVlVmlldyA9IG51bGw7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJwcmFjdGljZVwiKSAhPT0gLTFcbiAgICAgICAgICAgICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXlcbiAgICAgICAgICAgID09PSBcImJsb2NrXCIpIHtcbiAgICAgICAgICAgIHRyZWVWaWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGFyckdyb3VwcyA9IHRoaXMuZ2V0U2VsZWN0ZWRHcm91cHModHJlZVZpZXcpO1xuICAgIGxldCBhcnJPcmdhbmlzYXRpb25zID0gdGhpcy5nZXRTZWxlY3RlZEdyb3VwcyhcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uXCIpKTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHlwZVByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IHR5cGVQcmFjdGljZTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgXCJlZHVjYXRpb25hbExldmVsRGlhbG9nXCIpLmlubmVySFRNTCA9IGVkdWNhdGlvbkxldmVsO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JvdXBzUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gYXJyR3JvdXBzO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICBcIm9yZ2FuaXNhdGlvbnNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJPcmdhbmlzYXRpb25zO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VHlwZVByYWN0aWNlXCIpLmlubmVySFRNTCA9IHR5cGVQcmFjdGljZVxuICAgICAgICArIFwiINC/0YDQsNC60YLQuNC60LBcIjtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVjTnVtRGlhbG9nXCIpLmlubmVySFRNTCA9IGxlY051bTtcbiAgICB0aGlzLlByYWN0aWNlID0ge1xuICAgICAgICAndHlwZVByYWN0aWNlJzogdHlwZVByYWN0aWNlLFxuICAgICAgICAnc3RhcnREYXRlUHJhY3RpY2UnOiBmcm9tRGF0ZSxcbiAgICAgICAgJ2VuZERhdGVQcmFjdGljZSc6IHRvRGF0ZSAsXG4gICAgICAgICdkZWFkbGluZVByYWN0aWNlJzogZGVhZGxpbmUsXG4gICAgICAgICdsZWNOdW0nOiBsZWNOdW0sXG4gICAgICAgICdlZHVMZXZlbCc6IGVkdWNhdGlvbkxldmVsLFxuICAgICAgICAnb3JnYW5pc2F0aW9ucyc6IGFyck9yZ2FuaXNhdGlvbnMsXG4gICAgICAgICdncm91cHMnOiBhcnJHcm91cHMsXG4gICAgICAgICd5ZWFyJzogdGhpcy5zZWxlY3RlZFllYXJcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuUHJhY3RpY2U7XG59O1xuXG5mdW5jdGlvbiByb3VuZFBsdXMoeCwgbikgeyAvL3ggLSDRh9C40YHQu9C+LCBuIC0g0LrQvtC70LjRh9C10YHRgtCy0L4g0LfQvdCw0LrQvtCyXG4gICAgaWYgKGlzTmFOKHgpIHx8IGlzTmFOKG4pKSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIG0gPSBNYXRoLnBvdygxMCwgbik7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoeCAqIG0pIC8gbTtcbn1cblxuZnVuY3Rpb24gZ2V0V2Vla3MoZmlyc3RfZGF0ZSwgc2Vjb25kX2RhdGUpIHtcbiAgICBsZXQgZmlyc3RfYXJyYXkgPSBmaXJzdF9kYXRlLm1hdGNoKC8oXFxkezJ9KVxcLihcXGR7Mn0pXFwuKFxcZHs0fSkgKFxcZHsyfSk6KFxcZHsyfSkvKTtcbiAgICBsZXQgc2Vjb25kX2FycmF5ID0gc2Vjb25kX2RhdGUubWF0Y2goLyhcXGR7Mn0pXFwuKFxcZHsyfSlcXC4oXFxkezR9KSAoXFxkezJ9KTooXFxkezJ9KS8pO1xuICAgIGxldCBmaXJzdCA9IERhdGUuVVRDKGZpcnN0X2FycmF5WzNdLCBmaXJzdF9hcnJheVsyXSAtIDEsIGZpcnN0X2FycmF5WzFdKTtcbiAgICBsZXQgc2Vjb25kID0gRGF0ZS5VVEMoc2Vjb25kX2FycmF5WzNdLCBzZWNvbmRfYXJyYXlbMl0gLSAxLCBzZWNvbmRfYXJyYXlbMV0pO1xuICAgIGxldCB3ZWVrcyA9IChNYXRoLmNlaWwoKHNlY29uZCAtIGZpcnN0KSAvICgxMDAwICogNjAgKiA2MCAqIDI0KSkpIC8gNztcbiAgICByZXR1cm4gd2Vla3M7XG59XG5cbmZ1bmN0aW9uIGlzSW50ZWdlcihudW0pIHtcbiAgICByZXR1cm4gKG51bSBeIDApID09PSBudW07XG59XG5WaWV3LnByb3RvdHlwZS5jcmVhdGVXZWVrc1RleHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHRvRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9EYXRlSW5wdXRcIik7XG4gICAgbGV0IGZyb21EYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcm9tRGF0ZUlucHV0XCIpO1xuICAgIGxldCB0b0RhdGVDYWxlbmRhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9EYXRlQ2FsZW5kYXJcIik7XG4gICAgdG9EYXRlQ2FsZW5kYXIuZGlzcGxheSA9IFwibm9uZVwiO1xuXG4gICAgbGV0IHRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRleHRXZWVrc1wiKTtcbiAgICB0ZXh0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgIGZyb21EYXRlLm9uY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0b0RhdGVDYWxlbmRhci5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIjtcbiAgICAgICAgdG9EYXRlLnZhbHVlID0gXCJcIjtcblxuICAgIH07XG4gICAgdG9EYXRlLm9uY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgd2Vla3MgPSBnZXRXZWVrcyhmcm9tRGF0ZS52YWx1ZS5yZXBsYWNlKC9cXHMrL2csICcnKSArIFwiIDAwOjAwXCIsIHRvRGF0ZS52YWx1ZS5yZXBsYWNlKC9cXHMrL2csICcnKSArIFwiIDAwOjAwXCIpO1xuICAgICAgICB0ZXh0LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHdlZWtzID0gcm91bmRQbHVzKHdlZWtzLCAxKTtcbiAgICAgICAgdGV4dC5pbm5lckhUTUwgPSBcItCa0L7Qu9C40YfQtdGB0YLQstC+INC90LXQtNC10LvRjDogXCIgKyB3ZWVrcztcbiAgICAgICAgaWYgKGlzSW50ZWdlcih3ZWVrcykpIHtcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtYXJnaW4yMCBncmVlblwiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtYXJnaW4yMCByZWRcIik7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblZpZXcucHJvdG90eXBlLmRpc3BsYXlHcm91cHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVjYXRpb25cIikudmFsdWU7XG4gICAgaWYgKGVkdWNhdGlvbkxldmVsID09PSBcImJhY2hlbG9yXCIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJiYWNoZWxvclwiKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJiYWNoZWxvclwiKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn07XG5WaWV3LnByb3RvdHlwZS5jbGVhclByYWN0aWNlU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmNyZWF0ZVdlZWtzVGV4dCgpO1xuXG4gICAgbGV0IHRvRGF0ZUNhbGVuZGFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVDYWxlbmRhclwiKTtcbiAgICB0b0RhdGVDYWxlbmRhci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcm9tRGF0ZUlucHV0XCIpLnZhbHVlID0gXCJcIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvRGF0ZUlucHV0XCIpLnZhbHVlID0gXCJcIjtcbiAgICB0b0RhdGVDYWxlbmRhci52YWx1ZSA9IFwiXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZSA9IFwiXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWNOdW1cIikudmFsdWUgPSBcIlwiO1xuICAgIGZvcihsZXQgaT0wO2k8dGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7aSsrKXtcbiAgICAgICBsZXQgaW5wdXRzPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dCcpO1xuICAgICAgICBmb3IobGV0IGo9MDtqPGlucHV0cy5sZW5ndGg7aisrKXtcbiAgICAgICAgICAgICQoaW5wdXRzW2pdKS5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgLyogbGV0IHN0ZXBzPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3RlcHNcIilbMF0uY2hpbGRyZW47XG4gICAgc3RlcHNbMF0uc3R5bGUuZGlzcGxheT1cImJsb2NrXCI7XG4gICAgZm9yKGxldCBpPTA7aTx0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDtpKyspe1xuICAgICAgICBzdGVwc1tpXS5zdHlsZS5kaXNwbGF5PSdub25lJztcbiAgICB9Ki9cbn07XG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cblZpZXcucHJvdG90eXBlLnJlbmRlckluZm8gPSBmdW5jdGlvbiAocHJhY3RpY2UpIHtcbiAgICBpZiAocHJhY3RpY2UubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIGxldCBzdGFydF95ZWFyID0gcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoMCwgNCksXG4gICAgICAgICAgICBzdGFydF9tb250aCA9IHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDUsIDIpLFxuICAgICAgICAgICAgc3RhcnRfZGF5ID0gcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoOCwgMiksXG4gICAgICAgICAgICBlbmRfeWVhciA9IHByYWN0aWNlLmVuZF9kYXRlX3ByYWN0aWNlLnN1YnN0cigwLCA0KSxcbiAgICAgICAgICAgIGVuZF9tb250aCA9IHByYWN0aWNlLmVuZF9kYXRlX3ByYWN0aWNlLnN1YnN0cig1LCAyKSxcbiAgICAgICAgICAgIGVuZF9kYXkgPSBwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoOCwgMik7XG4gICAgICAgIGxldCBzdGFydF9kYXRlID0gc3RhcnRfZGF5ICsgJy0nICsgc3RhcnRfbW9udGggKyAnLScgKyBzdGFydF95ZWFyO1xuICAgICAgICBsZXQgZW5kX2RhdGUgPSBlbmRfZGF5ICsgJy0nICsgZW5kX21vbnRoICsgJy0nICsgZW5kX3llYXI7XG5cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSAn0YEgJ1xuICAgICAgICAgICAgKyBzdGFydF9kYXRlICsgJyDQv9C+ICcgKyBlbmRfZGF0ZTtcbiAgICAgICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgIFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBpbmZvX2Fib3V0X3ByYWN0aWNlLnR5cGVQcmFjdGljZVxuICAgICAgICAgICAgKyAnINC/0YDQsNC60YLQuNC60LAnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VHlwZVByYWN0aWNlXCIpLmlubmVySFRNTCA9IFwi0J/RgNCw0LrRgtC40LrQuFwiXG4gICAgICAgICAgICArIFwiINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCI7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1Rlcm1zUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gXCIgXCI7XG4gICAgfVxufTtcblZpZXcucHJvdG90eXBlLmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICAgICBcInRhYmNvbnRyb2wyXCIpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhY3RpdmVcIilbMF0uY2hpbGRyZW5bMF0udGV4dDtcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VUYWJcIikudmFsdWU7XG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB7XG4gICAgICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2UsXG4gICAgICAgICd5ZWFyJzogdGhpcy5zZWxlY3RlZFllYXIsXG4gICAgICAgICdlZHVfbGV2ZWwnOiBlZHVjYXRpb25MZXZlbFxuICAgIH07XG4gICAgcmV0dXJuIGluZm9fYWJvdXRfcHJhY3RpY2U7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5nZXRVc2VySW5mb0Fib3V0UHJhY3RpY2VPcmdTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICBcInNlbGVjdEVkdUxldmVsT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xuICAgIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XG4gICAgbGV0IHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XG4gICAgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJlZHVjYXRpb25hbFwiKSB7XG4gICAgICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJpbnRlcm5zaGlwXCIpIHtcbiAgICAgICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0J/RgNC+0LjQt9Cy0L7QtNGB0YLQstC10L3QvdCw0Y9cIjtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZVByYWN0aWNlID09PSBcInByZWRpcGxvbWFcIikge1xuICAgICAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQn9GA0LXQtNC00LjQv9C70L7QvNC90LDRj1wiO1xuICAgIH1cblxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0ge1xuICAgICAgICAndHlwZVByYWN0aWNlJzogdHlwZVByYWN0aWNlVGV4dCxcbiAgICAgICAgJ3llYXInOiB0aGlzLnNlbGVjdGVkWWVhcixcbiAgICAgICAgJ2VkdV9sZXZlbCc6IGVkdWNhdGlvbkxldmVsXG4gICAgfTtcbiAgICByZXR1cm4gaW5mb19hYm91dF9wcmFjdGljZTtcbn07XG5cblZpZXcucHJvdG90eXBlLnJlbmRlclRhYmxlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBpZiAoZGF0YSA9PT0gMCkge1xuICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5DbGVhclRhYmxlKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5DbGVhclRhYmxlKCk7XG4gICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkFkZERhdGEoZGF0YSk7XG4gICAgfVxufTtcblxuVmlldy5wcm90b3R5cGUuY29sb3JUYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChkYXRhW2ldLnN0YXR1cyA9PT0gMSkge1xuICAgICAgICAgICAgJCh0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKSkuYWRkQ2xhc3MoXCJhcHByb3ZlZF9zdHVkXCIpO1xuICAgICAgICAgICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuR2V0Tm9kZXMoaSkuY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcbiAgICAgICAgICAgICAgICBcInNvcnRpbmdfMSBhcHByb3ZlZF9zdHVkXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRhW2ldLnN0YXR1cyA9PT0gMCkge1xuICAgICAgICAgICAgJCh0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKSkuYWRkQ2xhc3MoXCJhcHBsaWVkX3N0dWRcIik7XG4gICAgICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxuICAgICAgICAgICAgICAgIFwic29ydGluZ18xIGFwcGxpZWRfc3R1ZFwiKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblZpZXcucHJvdG90eXBlLmNoYW5nZVllYXIgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIGlmIChzZWxlY3RlZEVsZW0pIHtcbiAgICAgICAgc2VsZWN0ZWRFbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2N1cnJlbnQnKTtcbiAgICB9XG4gICAgc2VsZWN0ZWRFbGVtID0gbm9kZTtcbiAgICBzZWxlY3RlZEVsZW0uY2xhc3NMaXN0LmFkZCgnY3VycmVudCcpO1xuICAgIHRoaXMuc2VsZWN0ZWRZZWFyID0gc2VsZWN0ZWRFbGVtLmlubmVySFRNTDtcbn07XG5cblZpZXcucHJvdG90eXBlLnVwZGF0ZVllYXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGlmICh0YXJnZXQuY2xhc3NOYW1lID09PSAnaXRlbSB5ZWFyJyB8fCB0YXJnZXQuY2xhc3NOYW1lXG4gICAgICAgICAgICA9PT0gJ2l0ZW0geWVhciBjdXJyZW50Jykge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VZZWFyKHRhcmdldCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgfVxuXG59O1xuXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RlZEdyb3VwcyA9IGZ1bmN0aW9uICh0cmVlVmlldykge1xuICAgIGlmICh0cmVlVmlldyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBmcmFtZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZnJhbWVzXCIpWzBdLmNoaWxkcmVuO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGZyYW1lc1tpXS5zdHlsZS5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgIHRyZWVWaWV3ID0gZnJhbWVzW2ldLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBHcm91cHMgPSBbXTtcbiAgICBsZXQgbGlOdW1iZXIgPSB0cmVlVmlldy5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlOdW1iZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGdyb3VwcyA9IGxpTnVtYmVyW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0OmNoZWNrZWQnKTtcbiAgICAgICAgaWYgKGdyb3Vwcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGdyb3VwID0gZ3JvdXBzW2pdLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAuaW5kZXhPZihcItC60YPRgNGBXCIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBHcm91cHMucHVzaChncm91cCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBHcm91cHM7XG59O1xuXG5hc3luYyBmdW5jdGlvbiB0cmVlX2FkZF9sZWFmX2NoZWNrYm94X2V4YW1wbGVfY2xpY2sodHJlZSwgbm9kZSwgbmFtZUxlYWYsIHVpZCkge1xuICAgIGF3YWl0IHRyZWUuYWRkTGVhZihub2RlLCBuYW1lTGVhZiwge1xuICAgICAgICBtb2RlOiAnY2hlY2tib3gnLFxuICAgICAgICBjaGVja2VkOiBmYWxzZSxcbiAgICAgICAgdWlkOiB1aWRcbiAgICB9KTtcbn1cblxuVmlldy5wcm90b3R5cGUucmVtb3ZlQ2hpbGRyZW4gPSBmdW5jdGlvbiAobm9kZSkge1xuICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGROb2RlcztcbiAgICB3aGlsZSAoY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGRyZW5bMF0pO1xuICAgIH1cbn07XG5cblZpZXcucHJvdG90eXBlLmNsZWFyR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlkID0gMDtcbiAgICB3aGlsZSAoaWQgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aCkge1xuICAgICAgICB2YXIgbGlBcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgdGhpcy5pZFRyZWVWaWV3c1tpZF0pLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4obGlBcnJheVtpXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWQrKztcbiAgICB9XG59O1xuVmlldy5wcm90b3R5cGUudXBkYXRlR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoY291cnNlcywgZ3JvdXBzKSB7XG4gICAgbGV0IGlkQ291bnRlciA9IDAsIGNvdXJzZU51bWJlciA9IGJhY2hlbG9yWWVhciwgY250O1xuICAgIGxldCBjb3Vyc2VzTmFtZSA9IFsnZmlyc3QnLCAnc2Vjb25kJywgJ3RoaXJkJywgJ2ZvdXJ0aCddO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaWRDb3VudGVyIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHRyZWUgPSAkKFwiI1wiICsgdGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdKS5kYXRhKFwidHJlZXZpZXdcIik7XG4gICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2lkQ291bnRlcl0uaW5kZXhPZihcIm1hc3RlclwiKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGNvdXJzZU51bWJlciA9IG1hc3RlclllYXI7XG4gICAgICAgICAgICBpID0gYmFjaGVsb3JZZWFyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgY250ID0gMDtcbiAgICAgICAgZm9yIChpOyBpIDwgY291cnNlTnVtYmVyOyBpKyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY291cnNlc1tpXS5ncm91cHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IHRyZWUuZWxlbWVudC5maW5kKCdsaS4nICsgY291cnNlc05hbWVbY250XSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdXG4gICAgICAgICAgICAgICAgICAgID09PSBcImdyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWRpYWxvZ0FkZC1iYWNoZWxvclwiXG4gICAgICAgICAgICAgICAgICAgIHx8IHRoaXMuaWRUcmVlVmlld3NbaWRDb3VudGVyXVxuICAgICAgICAgICAgICAgICAgICA9PT0gXCJncm91cC10cmVldmlldy10YWJjb250cm9sMi1kaWFsb2dBZGQtbWFzdGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZVswXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3Vyc2VzW2ldLmdyb3Vwc1tqXSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBlbGVtID0gbm9kZS5maW5kKCd1bCcpWzBdLmNoaWxkcmVuW25vZGUuZmluZChcbiAgICAgICAgICAgICAgICAgICAgICAgICd1bCcpWzBdLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgICAgICAgICAkKGVsZW0pLmFkZENsYXNzKFwiY29sbGFwc2VkXCIpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIilbMF0uc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHVkZW50cyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ3JvdXBzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY291cnNlc1tpXS5ncm91cHNbal0gPT09IGdyb3Vwc1trXS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1ZGVudHMgPSBncm91cHNba10uc3R1ZGVudHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBzdHVkZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsICQoZWxlbSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R1ZGVudHNba10ubmFtZSwgc3R1ZGVudHNba10udWlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXRzID0gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS11aWRdJyk7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgaW5wdXRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dHNba10uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVswXS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY291cnNlc1tpXS5ncm91cHNbal0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNudCsrO1xuICAgICAgICB9XG4gICAgICAgIGlkQ291bnRlcisrO1xuICAgIH1cbn07XG5WaWV3LnByb3RvdHlwZS5teVVwZGF0ZVRyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKGNvdXJzZXMsIGlkKSB7XG4gICAgbGV0IGNvdXJzZU51bWJlciA9IGJhY2hlbG9yWWVhciwgbjtcbiAgICBsZXQgY291cnNlc05hbWUgPSBbJ2ZpcnN0JywgJ3NlY29uZCcsICd0aGlyZCcsICdmb3VydGgnXTtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICB2YXIgdHJlZSA9ICQoXCIjXCIgKyBpZCkuZGF0YShcInRyZWV2aWV3XCIpO1xuICAgIGlmIChpZC5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xuICAgICAgICBjb3Vyc2VOdW1iZXIgPSBtYXN0ZXJZZWFyO1xuICAgICAgICBpID0gYmFjaGVsb3JZZWFyO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyO1xuICAgICAgICBpID0gMDtcbiAgICB9XG4gICAgbiA9IDA7XG4gICAgZm9yIChpOyBpIDwgY291cnNlTnVtYmVyOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb3Vyc2VzW2ldLmdyb3Vwcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgbGV0IG5vZGUgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGkuJyArIGNvdXJzZXNOYW1lW25dKTtcbiAgICAgICAgICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLCBjb3Vyc2VzW2ldLmdyb3Vwc1tqXSk7XG4gICAgICAgIH1cbiAgICAgICAgbisrO1xuICAgIH1cbn07XG5WaWV3LnByb3RvdHlwZS5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICBcInNlbGVjdFR5cGVQcmFjdGljZU9yZ2FuaXNhdGlvblNlY1wiKS52YWx1ZTtcbiAgICBsZXQgZWR1TGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdUxldmVsT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0ge1xuICAgICAgICAndHlwZVByYWN0aWNlJzogdHlwZVByYWN0aWNlLFxuICAgICAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyLFxuICAgICAgICAnZWR1X2xldmVsJzogZWR1TGV2ZWxcbiAgICB9O1xuICAgIHJldHVybiBpbmZvX2Fib3V0X3ByYWN0aWNlO1xufTtcblxuZnVuY3Rpb24gdHJlZV9hZGRfbGVhZl9jaGVja2JveCh0cmVlLCBub2RlLCBuYW1lTGVhZiwgaWRUeXBlT3JnYW5pc2F0aW9uKSB7XG4gICAgdHJlZS5hZGRMZWFmKG5vZGUsIG5hbWVMZWFmLCB7XG4gICAgICAgIG1vZGU6ICdjaGVja2JveCcsXG4gICAgICAgIGNoZWNrZWQ6IGZhbHNlXG4gICAgfSk7XG4gICAgbm9kZS5maW5kKCd1bCcpLmZpbmQoJ2xpJykubGFzdCgpWzBdLnNldEF0dHJpYnV0ZShcImlkXCIsICd0eXBlX29yZ18nXG4gICAgICAgICsgaWRUeXBlT3JnYW5pc2F0aW9uKTtcbn1cblxuVmlldy5wcm90b3R5cGUuc2V0VHlwZXNPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAodHlwZXNPcmdhbmlzYXRpb24pIHtcbiAgICB2YXIgdHJlZVZpZXdPcmdhbmlzYXRpb25zID0gJChcbiAgICAgICAgXCIjb3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKS5kYXRhKFwidHJlZXZpZXdcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgbm9kZSA9IHRyZWVWaWV3T3JnYW5pc2F0aW9ucy5lbGVtZW50LmZpbmQoJ2xpLm5vZGUnKTtcbiAgICAgICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveCh0cmVlVmlld09yZ2FuaXNhdGlvbnMsIG5vZGUsXG4gICAgICAgICAgICB0eXBlc09yZ2FuaXNhdGlvbltpXS5uYW1lLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XG4gICAgfVxufTtcblZpZXcucHJvdG90eXBlLmNsZWFyVHlwZXNPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxpQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgJ29yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb24nKS5jaGlsZHJlblswXS5jaGlsZHJlbjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbihsaUFycmF5W2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1bCcpWzBdKTtcbiAgICB9XG59O1xuVmlldy5wcm90b3R5cGUuc2V0T3JnYW5pc2F0aW9uc0luVHJlZVZpZXcgPSBmdW5jdGlvbiAob3JnYW5pc2F0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVzT3JnYW5pc2F0aW9uKSB7XG4gICAgdmFyIHRyZWUgPSAkKFwiI29yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikuZGF0YShcInRyZWV2aWV3XCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3JnYW5pc2F0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHR5cGVzT3JnYW5pc2F0aW9uLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAob3JnYW5pc2F0aW9uc1tpXS5pZF90eXBlX29yZ2FuaXNhdGlvbiA9PT0gdHlwZXNPcmdhbmlzYXRpb25bal0uaWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGlBcnIgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGknKTtcbiAgICAgICAgICAgICAgICBsZXQgbm9kZTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGxpQXJyLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaUFycltrXS5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gKCd0eXBlX29yZ18nXG4gICAgICAgICAgICAgICAgICAgICAgICArIHR5cGVzT3JnYW5pc2F0aW9uW2pdLmlkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9ICQobGlBcnJba10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbaV0ubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5WaWV3LnByb3RvdHlwZS5nZXRJbmZvTmV3T3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlQ29tcGFueVwiKTtcbiAgICB2YXIgdHlwZU9yZyA9IGUub3B0aW9uc1tlLnNlbGVjdGVkSW5kZXhdLnRleHQ7XG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IHtcbiAgICAgICAgJ25hbWUnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVDb21wYW55XCIpLnZhbHVlLFxuICAgICAgICAndHlwZU9yZyc6IHR5cGVPcmcsXG4gICAgICAgICdpbmZvT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvQ29tcGFueVwiKS52YWx1ZSxcbiAgICAgICAgJ2VtYWlsT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbWFpbE9yZ1wiKS52YWx1ZSxcbiAgICAgICAgJ3Bob25lT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaG9uZU9yZ1wiKS52YWx1ZSxcbiAgICAgICAgJ3BsYWNlc09yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxhY2VzQ29tcGFueVwiKS52YWx1ZSxcbiAgICAgICAgJ2xvZ2luT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbkNvbXBhbnlcIikudmFsdWUsXG4gICAgICAgICdwc3dkT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwc3dkQ29tcGFueVwiKS52YWx1ZSxcbiAgICAgICAgJ2FkZHJlc3NPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZHJlc3NPcmdcIikudmFsdWUsXG4gICAgICAgICdpZCc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRDb21wYW55XCIpLmlubmVySFRNTFxuICAgIH07XG4gICAgcmV0dXJuIG9yZ2FuaXNhdGlvbjtcbn07XG5cblZpZXcucHJvdG90eXBlLnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0ID0gZnVuY3Rpb24gKHR5cGVzT3JnYW5pc2F0aW9uKSB7XG4gICAgbGV0IHR5cGVPcmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVDb21wYW55XCIpO1xuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4odHlwZU9yZyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XG4gICAgICAgIG9wdGlvbi5pbm5lckhUTUwgPSB0eXBlc09yZ2FuaXNhdGlvbltpXS5uYW1lO1xuICAgICAgICB0eXBlT3JnLmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgfVxufTtcblZpZXcucHJvdG90eXBlLnNldE9yZ2FuaXNhdGlvbnNMaXN0ID0gZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbnMsIGlkTGlzdCkge1xuICAgIGxldCBsaXN0T3JnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRMaXN0KTtcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKGxpc3RPcmcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3JnYW5pc2F0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgZGl2X2xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGl2X2xpc3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0XCIpO1xuXG4gICAgICAgIGxldCBkaXZfbGlzdF9jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LWNvbnRlbnQgaW5saW5lLWJsb2NrXCIpO1xuICAgICAgICBpZiAoaWRMaXN0ID09PSBcIm9yZ2FuaXNhdGlvbkxpc3RcIikge1xuICAgICAgICAgICAgZGl2X2xpc3RfY29udGVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5SW5mb0Fib3V0T3JnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzcGFuX2xpc3RfdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtdGl0bGVcIik7XG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJpZF9vcmdhbmlzYXRpb25cIiwgb3JnYW5pc2F0aW9uc1tpXS5pZCk7XG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5pbm5lckhUTUwgPSBvcmdhbmlzYXRpb25zW2ldLm5hbWU7XG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3RpdGxlKTtcblxuICAgICAgICBsZXQgc3Bhbl9saXN0X3N1YnRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBzcGFuX2xpc3Rfc3VidGl0bGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXN1YnRpdGxlXCIpO1xuICAgICAgICBzcGFuX2xpc3Rfc3VidGl0bGUuaW5uZXJIVE1MID0gJ9CS0YHQtdCz0L4g0LzQtdGB0YI6ICdcbiAgICAgICAgICAgICsgb3JnYW5pc2F0aW9uc1tpXS5tYXhfc3R1ZGVudHNfbnVtYmVyO1xuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9zdWJ0aXRsZSk7XG5cbiAgICAgICAgbGV0IHNwYW5fbGlzdF9yZW1hcmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHNwYW5fbGlzdF9yZW1hcmsuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXJlbWFya1wiKTtcbiAgICAgICAgc3Bhbl9saXN0X3JlbWFyay5pbm5lckhUTUwgPSAn0J7RgdGC0LDQu9C+0YHRjDogJ1xuICAgICAgICAgICAgKyBvcmdhbmlzYXRpb25zW2ldLm1heF9zdHVkZW50c19udW1iZXI7XG4gICAgICAgIC8q0J7QkdCv0JfQkNCi0JXQm9Cs0J3QniDQmNCh0J/QoNCQ0JLQmNCi0Kwg0J3QkCDQmtCe0JvQmNCn0JXQodCi0JLQniDQntCh0KLQkNCS0KjQmNCl0KHQryDQnNCV0KHQoi4hISEhISEhISEhISEhISEhISEhISEhISEhISEqL1xuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9yZW1hcmspO1xuXG4gICAgICAgIGRpdl9saXN0LmFwcGVuZENoaWxkKGRpdl9saXN0X2NvbnRlbnQpO1xuXG4gICAgICAgIGxldCBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcbiAgICAgICAgICAgIFwiaW5saW5lLWJsb2NrIGxpc3QtY29udGVudCBzZXR0aW5nc09yZ2FuaXNhdGlvblwiKTtcbiAgICAgICAgaWYgKGlkTGlzdCA9PT0gXCJvcmdhbmlzYXRpb25MaXN0XCIpIHtcbiAgICAgICAgICAgIGxldCBzcGFuX3VzZXJfcGx1cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIHNwYW5fdXNlcl9wbHVzLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXG4gICAgICAgICAgICAgICAgXCJtaWYtdXNlci1wbHVzIG1pZi1sZyBmZy1ncmF5IGFkZC1zdHVkZW50LW9yZ2FuaXNhdGlvblwiKTtcbiAgICAgICAgICAgIHNwYW5fdXNlcl9wbHVzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIHRoaXMub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvblNob3dEaWFsb2cpO1xuICAgICAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX3VzZXJfcGx1cyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc3Bhbl9wZW5jaWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHNwYW5fcGVuY2lsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXG4gICAgICAgICAgICBcIm1pZi1wZW5jaWwgbWlmLWxnIGZnLWdyYXkgZWRpdC1vcmdhbmlzYXRpb25cIik7XG4gICAgICAgIHNwYW5fcGVuY2lsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLm9uQ2xpY2tFZGl0T3JnYW5pc2F0aW9uKTtcbiAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX3BlbmNpbCk7XG5cbiAgICAgICAgLyogbGV0IHNwYW5fY2FuY2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgc3Bhbl9jYW5jZWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtaWYtY2FuY2VsIG1pZi1sZyBmZy15ZWxsb3dcIik7XG4gICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fY2FuY2VsKTsqL1xuXG4gICAgICAgIGRpdl9saXN0LmFwcGVuZENoaWxkKGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24pO1xuXG4gICAgICAgIGxpc3RPcmcuYXBwZW5kQ2hpbGQoZGl2X2xpc3QpO1xuICAgIH1cblxufTtcblZpZXcucHJvdG90eXBlLmdldElkT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IGlkT3JnYW5pc2F0aW9uID0gMDtcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmlkID09PSBcInVwZGF0ZU9yZ2FuaXNhdGlvblwiKSB7XG4gICAgICAgIGlkT3JnYW5pc2F0aW9uID0gK2V2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNoaWxkcmVuWzBdLmNoaWxkcmVuWzJdLmlubmVySFRNTDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlkT3JnYW5pc2F0aW9uID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5jaGlsZHJlblswXS5nZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICBcImlkX29yZ2FuaXNhdGlvblwiKTtcbiAgICB9XG4gICAgcmV0dXJuIGlkT3JnYW5pc2F0aW9uO1xufTtcblxuVmlldy5wcm90b3R5cGUuZ2V0TmFtZU9yZ2FuaXNhdGlvbkluVHJlZXZpZXcgPSBmdW5jdGlvbiAoaWRUcmVldmlldykge1xuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZFRyZWV2aWV3KTtcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbiA9IHBhcmVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICAgICBcImFjdGl2ZVwiKVswXS5xdWVyeVNlbGVjdG9yKCdbaWRfb3JnYW5pc2F0aW9uJykuaW5uZXJIVE1MO1xuICAgIHJldHVybiBuYW1lT3JnYW5pc2F0aW9uO1xufTtcblxuVmlldy5wcm90b3R5cGUuc2hvd0RpYWxvZ09yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVDb21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLm5hbWU7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpZENvbXBhbnlcIikuaW5uZXJIVE1MID0gb3JnYW5pc2F0aW9uLmlkO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mb0NvbXBhbnlcIikudmFsdWUgPSBvcmdhbmlzYXRpb24uaW5mb19vcmdhbmlzYXRpb247XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaG9uZU9yZ1wiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5waG9uZV9vcmdhbmlzYXRpb247XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbWFpbE9yZ1wiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5lbWFpbF9vcmdhbmlzYXRpb247XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgIFwiYWRkcmVzc09yZ1wiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5hZGRyZXNzX29yZ2FuaXNhdGlvbjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgXCJwbGFjZXNDb21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLm1heF9zdHVkZW50c19udW1iZXI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgIFwibG9naW5Db21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLmxvZ2luX29yZ2FuaXNhdGlvbjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBzd2RDb21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLnBzd2Rfb3JnYW5pc2F0aW9uO1xuICAgIG1ldHJvRGlhbG9nLm9wZW4oJyNkaWFsb2dDcmVhdGVDb21wYW55Jyk7XG59O1xuVmlldy5wcm90b3R5cGUuZGlhbG9nT3BlbiA9IGZ1bmN0aW9uIChpZCkge1xuICAgIG1ldHJvRGlhbG9nLm9wZW4oaWQpO1xufTtcblZpZXcucHJvdG90eXBlLnVwZGF0ZU9yZ2FuaXNhdGlvblRpdGxlID0gZnVuY3Rpb24gKG5hbWVPcmdhbmlzYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHByb3ZlZF9zdHVkZW50X2NvdW50LCBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCkge1xuICAgIGlmIChub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9PT0gMCkge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5vbkFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcIiwg0L/Rg9GB0YJcIjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibm9uQXBwcm92ZWRTdHVkZW50TGlzdFRpdGxlXCIpLmlubmVySFRNTCA9IFwiXCI7XG4gICAgfVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnTmFtZVwiKS5pbm5lckhUTUwgPSBuYW1lT3JnYW5pc2F0aW9uO1xuXG4gICAgaWYgKGFwcHJvdmVkX3N0dWRlbnRfY291bnQgPT09IDApIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICBcImFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcItCh0L/QuNGB0L7QuiDRg9GC0LLQtdGA0LbQtNC10L3QvdGL0YUg0YHRgtGD0LTQtdC90YLQvtCyINC/0YPRgdGCLlwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICBcImFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcItCh0L/QuNGB0L7QuiDRg9GC0LLQtdGA0LbQtNC10L3QvdGL0YUg0YHRgtGD0LTQtdC90YLQvtCyLlwiO1xuICAgIH1cbn07XG5cblZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IGVsZW1lbnQgPSBldmVudC50YXJnZXQ7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NOYW1lID09PSBcImxpc3QtY29udGVudCBpbmxpbmUtYmxvY2tcIikge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICB9XG4gICAgbGV0IG5hbWVPcmdhbmlzYXRpb25DbGljayA9IGVsZW1lbnQuY2hpbGRyZW5bMF0uaW5uZXJIVE1MO1xuICAgIHJldHVybiBuYW1lT3JnYW5pc2F0aW9uQ2xpY2s7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5nZXROYW1lT3JnYW5pc2F0aW9uQnlUaXRsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdOYW1lXCIpLmlubmVySFRNTDtcbn07XG5cblZpZXcucHJvdG90eXBlLnVwZGF0ZVN0dWRlbnRzTGlzdFZpZXcgPSBmdW5jdGlvbiAoc3R1ZGVudHMsIGlkTGlzdCkge1xuICAgIGxldCBsaXN0U3R1ZGVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZExpc3QpO1xuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4obGlzdFN0dWRlbnRzKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBkaXZfbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXZfbGlzdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3RcIik7XG5cbiAgICAgICAgbGV0IGRpdl9saXN0X2NvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtY29udGVudCBpbmxpbmUtYmxvY2tcIik7XG5cbiAgICAgICAgbGV0IHNwYW5fbGlzdF90aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC10aXRsZVwiKTtcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcInJlcXVlc3RcIiwgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdCk7XG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJ1aWRcIiwgc3R1ZGVudHNbaV0udWlkX3N0dWRlbnQpO1xuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwib3JnXCIsIHN0dWRlbnRzW2ldLmlkX29yZ2FuaXNhdGlvbik7XG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5pbm5lckhUTUwgPSBzdHVkZW50c1tpXS5kaXNwbGF5TmFtZTtcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3RfdGl0bGUpO1xuXG4gICAgICAgIGxldCBzcGFuX2xpc3Rfc3VidGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHNwYW5fbGlzdF9zdWJ0aXRsZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3Qtc3VidGl0bGVcIik7XG4gICAgICAgIHNwYW5fbGlzdF9zdWJ0aXRsZS5pbm5lckhUTUwgPSBzdHVkZW50c1tpXS5ncm91cF9uYW1lO1xuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9zdWJ0aXRsZSk7XG5cbiAgICAgICAgbGV0IHllYXIgPSBzdHVkZW50c1tpXS5kYXRlX2NyZWF0aW9uX3JlcXVlc3Quc3Vic3RyKDAsIDQpLFxuICAgICAgICAgICAgbW9udGggPSBzdHVkZW50c1tpXS5kYXRlX2NyZWF0aW9uX3JlcXVlc3Quc3Vic3RyKDUsIDIpLFxuICAgICAgICAgICAgZGF5ID0gc3R1ZGVudHNbaV0uZGF0ZV9jcmVhdGlvbl9yZXF1ZXN0LnN1YnN0cig4LCAyKTtcbiAgICAgICAgbGV0IGRhdGUgPSBkYXkgKyAnLScgKyBtb250aCArICctJyArIHllYXI7XG5cbiAgICAgICAgbGV0IHNwYW5fbGlzdF9yZW1hcmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHNwYW5fbGlzdF9yZW1hcmsuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXJlbWFya1wiKTtcbiAgICAgICAgc3Bhbl9saXN0X3JlbWFyay5pbm5lckhUTUwgPSAn0JTQsNGC0LAg0LfQsNC/0LjRgdC4OiAnICsgZGF0ZTtcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3RfcmVtYXJrKTtcblxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfbGlzdF9jb250ZW50KTtcblxuICAgICAgICBsZXQgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXG4gICAgICAgICAgICBcImlubGluZS1ibG9jayBsaXN0LWNvbnRlbnQgc2V0dGluZ3NPcmdhbmlzYXRpb25cIik7XG5cbiAgICAgICAgaWYgKGlkTGlzdCAhPT0gXCJhcHByb3ZlZFN0dWRlbnRzXCIpIHtcbiAgICAgICAgICAgIGxldCBzcGFuX3N0dWRlbnRfYXBwcm92ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgICAgIHNwYW5fc3R1ZGVudF9hcHByb3ZlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXG4gICAgICAgICAgICAgICAgXCJtaWYtY2hlY2ttYXJrIG1pZi1sZyBmZy1ncmVlblwiKTtcbiAgICAgICAgICAgIHNwYW5fc3R1ZGVudF9hcHByb3ZlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLFxuICAgICAgICAgICAgICAgIHRoaXMub25DbGlja0FwcHJvdmVTdHVkZW50KTtcbiAgICAgICAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uYXBwZW5kQ2hpbGQoc3Bhbl9zdHVkZW50X2FwcHJvdmUpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNwYW5fc3R1ZGVudF9yZWplY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHNwYW5fc3R1ZGVudF9yZWplY3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtaWYtY2FuY2VsIG1pZi1sZyBmZy1yZWRcIik7XG4gICAgICAgIHNwYW5fc3R1ZGVudF9yZWplY3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25DbGlja1JlamVjdFN0dWRlbnQpO1xuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fc3R1ZGVudF9yZWplY3QpO1xuXG4gICAgICAgIGRpdl9saXN0LmFwcGVuZENoaWxkKGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24pO1xuXG4gICAgICAgIGxpc3RTdHVkZW50cy5hcHBlbmRDaGlsZChkaXZfbGlzdCk7XG4gICAgfVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxsT3JnYW5pc2F0aW9uc0xpc3RCbG9ja1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkZW50c1JlcXVlc3RzXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJPcmdhbmlzYXRpb25TZWN0aW9uID0gZnVuY3Rpb24gKHByYWN0aWNlKSB7XG4gICAgbGV0IHRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ2FuaXNhdGlvbkxpc3RDdXJyZW50UHJhY3RpY2VUZXh0XCIpO1xuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgdGV4dC5pbm5lckhUTUwgPSBcItCh0L/QuNGB0L7QuiDQvtGA0LPQsNC90LjQt9Cw0YbQuNC5INCyINC/0YDQsNC60YLQuNC60LVcIjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRleHQuaW5uZXJIVE1MID0gXCLQn9GA0LDQutGC0LjQutC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCI7XG4gICAgfVxufTtcblxuVmlldy5wcm90b3R5cGUuT3Blbk9yQ2xvc2VMb2FkZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IGRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRcIikuc3R5bGUuZGlzcGxheTtcbiAgICBpZiAoZGlzcGxheSA9PT0gXCJibG9ja1wiKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9XG59O1xuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRTdHVkZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgbGV0IG5vZGUgPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICdbcmVxdWVzdF0nKTtcbiAgICBsZXQgc3R1ZGVudCA9IHtcbiAgICAgICAgJ2lkX3JlcXVlc3QnOiBub2RlLmdldEF0dHJpYnV0ZShcInJlcXVlc3RcIiksXG4gICAgICAgICd1aWRfc3R1ZGVudCc6IG5vZGUuZ2V0QXR0cmlidXRlKFwidWlkXCIpLFxuICAgICAgICAnaWRfb3JnYW5pc2F0aW9uJzogbm9kZS5nZXRBdHRyaWJ1dGUoXCJvcmdcIilcbiAgICB9O1xuXG4gICAgaWYgKGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKS5pbmRleE9mKFwibWlmLWNhbmNlbFwiKSA9PT0gMCkge1xuICAgICAgICBzdHVkZW50WydpZF9zdGF0dXMnXSA9IDI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdHVkZW50WydpZF9zdGF0dXMnXSA9IDE7XG4gICAgfVxuICAgIHJldHVybiBzdHVkZW50O1xufTtcblZpZXcucHJvdG90eXBlLnNldFllYXJzQXJyYXkgPSBmdW5jdGlvbiAoeWVhcnMpIHtcbiAgICBsZXQgYnV0dG9uQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbnNBcnJheVwiKTtcbiAgICBsZXQgYnV0dG9uQXJyYXkxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25zQXJyYXkxXCIpO1xuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oYnV0dG9uQXJyYXkpO1xuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4oYnV0dG9uQXJyYXkxKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHllYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBzcGFuLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaXRlbSB5ZWFyXCIpO1xuICAgICAgICBzcGFuLmlubmVySFRNTCA9IHllYXJzW2ldO1xuICAgICAgICBidXR0b25BcnJheS5hcHBlbmRDaGlsZChzcGFuKTtcblxuICAgICAgICBsZXQgc3BhbjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICAgIHNwYW4xLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaXRlbSB5ZWFyXCIpO1xuICAgICAgICBzcGFuMS5pbm5lckhUTUwgPSB5ZWFyc1tpXTtcbiAgICAgICAgYnV0dG9uQXJyYXkuYXBwZW5kQ2hpbGQoc3Bhbik7XG4gICAgICAgIGJ1dHRvbkFycmF5MS5hcHBlbmRDaGlsZChzcGFuMSk7XG4gICAgfVxuICAgIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHNwYW4uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpdGVtIHllYXJcIik7XG4gICAgc3Bhbi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImNyZWF0ZVByYWN0aWNlQnRuXCIpO1xuICAgIHNwYW4uaW5uZXJIVE1MID0gXCIrXCI7XG4gICAgYnV0dG9uQXJyYXkuYXBwZW5kQ2hpbGQoc3Bhbik7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVQcmFjdGljZUJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXG4gICAgICAgIHRoaXMub25DbGlja0NyZWF0ZVByYWN0aWNlKTtcbn07XG5cblZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkU3R1ZGVudHMgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBsZXQgU3R1ZGVudHMgPSBbXTtcbiAgICBsZXQgbm9kZXMgPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpjaGVja2VkJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAobm9kZXNbaV0ucGFyZW50RWxlbWVudC5uZXh0U2libGluZy5pbm5lckhUTUwuaW5kZXhPZihcItC60YPRgNGBXCIpID09PSAtMVxuICAgICAgICAgICAgJiYgaXNOYU4oK25vZGVzW2ldLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTC5zdWJzdHIoMCxcbiAgICAgICAgICAgICAgICAyKSkpIHtcbiAgICAgICAgICAgIGxldCBuYW1lID0gbm9kZXNbaV0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MO1xuICAgICAgICAgICAgbGV0IHVpZCA9IG5vZGVzW2ldLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVpZFwiKTtcbiAgICAgICAgICAgIFN0dWRlbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgdWlkOiB1aWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBTdHVkZW50cztcbn07XG5cblZpZXcucHJvdG90eXBlLmRpYWxvZ0VuYWJsZUNoZWNrYm94ZXMgPSBmdW5jdGlvbiAobmFtZXNHcm91cHMsIGlkRWxlbWVudCkge1xuICAgIGxldCBwYXJlbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZEVsZW1lbnQpO1xuICAgIGxldCBpbnB1dHMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5hbWVzR3JvdXBzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXRzW2ldLnBhcmVudEVsZW1lbnQubmV4dFNpYmxpbmcuaW5uZXJIVE1MID09PSBuYW1lc0dyb3Vwc1tqXSkge1xuICAgICAgICAgICAgICAgIGxldCBjb3Vyc2UgPSBpbnB1dHNbaV0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgICAgICBpZiAoY291cnNlLmdldEF0dHJpYnV0ZShcImRhdGEtbW9kZVwiKSA9PT0gXCJjaGVja2JveFwiICYmIGNvdXJzZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKS5pbmRleE9mKFwiYWN0aXZlLWNvdXJzZVwiKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgJChjb3Vyc2UpLmFkZENsYXNzKFwiYWN0aXZlLWNvdXJzZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5wdXRzW2ldLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIGxldCBzdHVkZW50c0NoZWNrYm94ZXMgPSBpbnB1dHNbaV0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgICAgICAgICdbZGF0YS11aWRdJyk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBzdHVkZW50c0NoZWNrYm94ZXMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3R1ZGVudHNDaGVja2JveGVzW25dLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykucmVtb3ZlQXR0cmlidXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5WaWV3LnByb3RvdHlwZS5nZXRFbGVtQnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIHJldHVybiBlbGVtO1xufTtcblxuVmlldy5wcm90b3R5cGUuY3JlYXRlSW5wdXRzT3JkZXIgPSBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmRlci1ibG9ja1wiKTtcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKHBhcmVudCk7XG4gICAgbGV0IGg0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xuICAgIGg0LmlubmVySFRNTCA9IFwi0KDRg9C60L7QstC+0LTQuNGC0LXQu9C4XCI7XG4gICAgaDQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhbGlnbi1jZW50ZXJcIik7XG4gICAgcGFyZW50LmFwcGVuZENoaWxkKGg0KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmaWVsZCBtYXJnaW4yMFwiKTtcblxuICAgICAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgICAgICBwLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaW5saW5lLWJsb2NrIHN1Yi1oZWFkZXJcIik7XG4gICAgICAgIHAuaW5uZXJIVE1MID0gc2VsZWN0ZWRHcm91cHNbaV07XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChwKTtcblxuICAgICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImdyb3VwTmFtZVwiLCBzZWxlY3RlZEdyb3Vwc1tpXSk7XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XG5cbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGRpdik7XG4gICAgfVxufTtcblxuXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVJbnB1dHNSZXBvcnQgPSBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcbiAgICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncm91cHMtcmVwb3J0LWJsb2NrXCIpO1xuICAgIHRoaXMucmVtb3ZlQ2hpbGRyZW4ocGFyZW50KTtcbiAgICBsZXQgaDQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XG4gICAgaDQuaW5uZXJIVE1MID0gXCLQmNC90YTQvtGA0LzQsNGG0LjRjyDQv9C+INC60LDQttC00L7QuSDQs9GA0YPQv9C/0LVcIjtcbiAgICBoNC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFsaWduLWNlbnRlclwiKTtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaDQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGRpdl9ncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRpdl9ncm91cC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImdyb3VwIFwiICsgc2VsZWN0ZWRHcm91cHNbaV0pO1xuXG4gICAgICAgIGxldCBoNCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcbiAgICAgICAgaDQuaW5uZXJIVE1MID0gc2VsZWN0ZWRHcm91cHNbaV07XG4gICAgICAgIGg0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYWxpZ24tY2VudGVyXCIpO1xuICAgICAgICBkaXZfZ3JvdXAuYXBwZW5kQ2hpbGQoaDQpO1xuXG4gICAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmaWVsZCBtYXJnaW4yMFwiKTtcbiAgICAgICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgcC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImlubGluZS1ibG9jayBzdWItaGVhZGVyXCIpO1xuICAgICAgICBwLmlubmVySFRNTCA9IFwi0KDRg9C60L7QstC+0LTQuNGC0LXQu9GMXCI7XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInN1cGVydmlzb3JcIik7XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgICAgIGRpdl9ncm91cC5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZpZWxkIG1hcmdpbjIwXCIpO1xuICAgICAgICBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcbiAgICAgICAgcC5pbm5lckhUTUwgPSBcItCh0YLRg9C0LiAoNCDQuCA1KVwiO1xuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQocCk7XG4gICAgICAgIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImdvb2Rfc3R1ZGVudHNcIik7XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJudW1iZXJcIik7XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgICAgIGRpdl9ncm91cC5hcHBlbmRDaGlsZChkaXYpO1xuXG4gICAgICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZpZWxkIG1hcmdpbjIwXCIpO1xuICAgICAgICBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcbiAgICAgICAgcC5pbm5lckhUTUwgPSBcItCa0L7Quy3QstC+INC/0YDQtdC/0L7QtC4t0YDRg9C60L7QstC+0LQuXCI7XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChwKTtcbiAgICAgICAgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwidGVhY2hlcl9udW1iZXJcIik7XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJudW1iZXJcIik7XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XG4gICAgICAgIGRpdl9ncm91cC5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZGl2X2dyb3VwKTtcbiAgICB9XG59O1xuXG5WaWV3LnByb3RvdHlwZS5mb3JtYXREYXRlID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICBsZXQgeWVhciA9IGRhdGUuc3Vic3RyKDAsIDQpLFxuICAgICAgICBtb250aCA9IGRhdGUuc3Vic3RyKDUsIDIpLFxuICAgICAgICBkYXkgPSBkYXRlLnN1YnN0cig4LCAyKTtcbiAgICByZXR1cm4gKGRheSArICcuJyArIG1vbnRoICsgJy4nICsgeWVhcik7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5nZXRJbmZvcm1hdGlvbkZvckRvY3VtZW50T3JkZXIgPSBmdW5jdGlvbiAocHJhY3RpY2UsIHNlbGVjdGVkR3JvdXBzLCBhbGxHcm91cHMsIGRhdGEsIG9yZ2FuaXNhdGlvbnMpIHtcbiAgICBsZXQgZ3JvdXBzRm9yRG9jdW1lbnQgPSBbXTtcbiAgICBsZXQgZWR1Y2F0aW9uYWxfbGV2ZWwgPSB0aGlzLmdldEVkdWNhdGlvbmFsTGV2ZWwoKTtcbiAgICBsZXQgYmxvY2tUZWFjaGVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JkZXItYmxvY2tcIikuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpO1xuICAgIGxldCB0ZWFjaGVycyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tUZWFjaGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgZ3JvdXBOYW1lID0gYmxvY2tUZWFjaGVyc1tpXS5jaGlsZHJlblswXS5pbm5lckhUTUw7XG4gICAgICAgIGxldCB0ZWFjaGVyID0gYmxvY2tUZWFjaGVyc1tpXS5jaGlsZHJlblsxXS52YWx1ZTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2pdID09PSBncm91cE5hbWUpXG4gICAgICAgICAgICAgICAgdGVhY2hlcnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZWFjaGVyXCI6IHRlYWNoZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdyb3VwTmFtZVwiOiBncm91cE5hbWVcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuaW5mb0dyb3Vwcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2ldLmluZGV4T2YodGhpcy5pbmZvR3JvdXBzW2pdLm5hbWUpICE9PSAtMSAmJiB0aGlzLmluZm9Hcm91cHNbal0udHlwZSA9PT0gZWR1Y2F0aW9uYWxfbGV2ZWwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IGFsbEdyb3Vwcy5sZW5ndGg7IG4rKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IGFsbEdyb3Vwc1tuXS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRlYWNoZXJzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2ldID09PSB0ZWFjaGVyc1trXS5ncm91cE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLnRlYWNoZXIgPSB0ZWFjaGVyc1trXS50ZWFjaGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0udHlwZSA9IHRoaXMuaW5mb0dyb3Vwc1tqXS50eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0uZnVsbE5hbWUgPSB0aGlzLmluZm9Hcm91cHNbal0uZnVsbE5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS5wcm9maWxlID0gdGhpcy5pbmZvR3JvdXBzW2pdLnByb2ZpbGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3Vwc0ZvckRvY3VtZW50LnB1c2goYWxsR3JvdXBzW25dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IGRlYW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYW5cIikudmFsdWU7XG4gICAgbGV0IGhlYWRfb2ZfZGVwYXJ0bWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGVhZF9vZl9kZXBhcnRtZW50XCIpLnZhbHVlO1xuICAgIGxldCB0eXBlX2RvY3VtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZHR5cGVEb2N1bWVudFwiKS5vcHRpb25zW2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2R0eXBlRG9jdW1lbnRcIikuc2VsZWN0ZWRJbmRleF0udmFsdWU7XG4gICAgbGV0IGRvY3VtZW50cyA9IFtdO1xuICAgIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVQcmFjdGljZVRhYlwiKS52YWx1ZTtcbiAgICB0eXBlUHJhY3RpY2UgPSB0eXBlUHJhY3RpY2UucmVwbGFjZUF0KHR5cGVQcmFjdGljZS5sZW5ndGggLSAxLCBcItC5XCIpO1xuICAgIHR5cGVQcmFjdGljZSA9IHR5cGVQcmFjdGljZS5yZXBsYWNlQXQodHlwZVByYWN0aWNlLmxlbmd0aCAtIDIsIFwi0L5cIik7XG4gICAgdHlwZVByYWN0aWNlID0gdHlwZVByYWN0aWNlLnRvTG93ZXJDYXNlKCk7XG5cbiAgICBsZXQgc3RhcnRfZGF0ZSA9IHRoaXMuZm9ybWF0RGF0ZShwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlKTtcbiAgICBsZXQgZW5kX2RhdGUgPSB0aGlzLmZvcm1hdERhdGUocHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2UpO1xuICAgIGlmICh0eXBlUHJhY3RpY2UgPT09IFwi0YPRh9C10LHQvdC+0LlcIikge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgc3R1ZGVudHMgPSBncm91cHNGb3JEb2N1bWVudFtpXS5zdHVkZW50cztcbiAgICAgICAgICAgIGxldCBzdHIgPSBKU09OLnN0cmluZ2lmeShzdHVkZW50cywgW1wibmFtZVwiXSk7XG4gICAgICAgICAgICBzdHVkZW50cyA9IEpTT04ucGFyc2Uoc3RyKTtcbiAgICAgICAgICAgIGxldCBkb2N1bWVudCA9IHtcbiAgICAgICAgICAgICAgICBcImRpcmVjdGlvblwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5mdWxsTmFtZSxcbiAgICAgICAgICAgICAgICBcInByb2ZpbGVcIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0ucHJvZmlsZSxcbiAgICAgICAgICAgICAgICBcImRlYW5cIjogZGVhbixcbiAgICAgICAgICAgICAgICBcImhlYWRfb2ZfZGVwYXJ0bWVudFwiOiBoZWFkX29mX2RlcGFydG1lbnQsXG4gICAgICAgICAgICAgICAgXCJ0eXBlX3ByYWN0aWNlXCI6IHR5cGVQcmFjdGljZSxcbiAgICAgICAgICAgICAgICBcInN0YXJ0X2RhdGVcIjogc3RhcnRfZGF0ZSxcbiAgICAgICAgICAgICAgICBcImVuZF9kYXRlXCI6IGVuZF9kYXRlLFxuICAgICAgICAgICAgICAgIFwiZ3JvdXBfbmFtZVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5uYW1lLFxuICAgICAgICAgICAgICAgIFwic3VwZXJ2aXNvclwiOiBncm91cHNGb3JEb2N1bWVudFtpXS50ZWFjaGVyLFxuICAgICAgICAgICAgICAgIFwic3R1ZGVudHNcIjogc3R1ZGVudHNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkb2N1bWVudHMucHVzaChkb2N1bWVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZVByYWN0aWNlID09PSBcItC/0YDQvtC40LfQstC+0LTRgdGC0LLQtdC90L3QvtC5XCIpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBvcmdhbmlzYXRpb25zW2ldLnN0dWRlbnRzID0gW107XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGFbaV0uZ3JvdXAgPT09IGdyb3Vwc0ZvckRvY3VtZW50W2pdLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBncm91cHNGb3JEb2N1bWVudFtqXS5zdHVkZW50cy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGFbaV0uc3R1ZGVudCA9PT0gZ3JvdXBzRm9yRG9jdW1lbnRbal0uc3R1ZGVudHNba10ubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgb3JnYW5pc2F0aW9ucy5sZW5ndGg7IG4rKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YVtpXS5vcmdhbmlzYXRpb24gPT09IG9yZ2FuaXNhdGlvbnNbbl0ubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tuXS5ncm91cCA9IGdyb3Vwc0ZvckRvY3VtZW50W2pdLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zW25dLm9yZ2FuaXphdGlvbl9uYW1lID0gb3JnYW5pc2F0aW9uc1tuXS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tuXS50ZWFjaGVyID0gZ3JvdXBzRm9yRG9jdW1lbnRbal0udGVhY2hlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHVkZW50ID0gZGF0YVtpXS5zdHVkZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tuXS5zdHVkZW50cy5wdXNoKHtcIm5hbWVcIjogc3R1ZGVudH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgb3JnYW5pc2F0aW9uc19mb3JfZG9jdW1lbnQgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgb3JnYW5pc2F0aW9ucy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChvcmdhbmlzYXRpb25zW2pdLmdyb3VwID09PSBncm91cHNGb3JEb2N1bWVudFtpXS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHVkZW50cyA9IEpTT04uc3RyaW5naWZ5KG9yZ2FuaXNhdGlvbnNbal0uc3R1ZGVudHMpO1xuICAgICAgICAgICAgICAgICAgICBzdHVkZW50cyA9IEpTT04ucGFyc2Uoc3R1ZGVudHMpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3RyID0gSlNPTi5zdHJpbmdpZnkob3JnYW5pc2F0aW9uc1tqXSwgW1wib3JnYW5pemF0aW9uX25hbWVcIiwgXCJ0ZWFjaGVyXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tqXSA9IEpTT04ucGFyc2Uoc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tqXS5zdHVkZW50cyA9IHN0dWRlbnRzO1xuICAgICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zX2Zvcl9kb2N1bWVudC5wdXNoKG9yZ2FuaXNhdGlvbnNbal0pO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGRvY3VtZW50ID0ge1xuICAgICAgICAgICAgICAgIFwiZGlyZWN0aW9uXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLmZ1bGxOYW1lLFxuICAgICAgICAgICAgICAgIFwicHJvZmlsZVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5wcm9maWxlLFxuICAgICAgICAgICAgICAgIFwiZGVhblwiOiBkZWFuLFxuICAgICAgICAgICAgICAgIFwiY291cnNlXCI6IFwiMVwiLFxuICAgICAgICAgICAgICAgIFwiaGVhZF9vZl9kZXBhcnRtZW50XCI6IGhlYWRfb2ZfZGVwYXJ0bWVudCxcbiAgICAgICAgICAgICAgICBcInR5cGVfcHJhY3RpY2VcIjogdHlwZVByYWN0aWNlLFxuICAgICAgICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBzdGFydF9kYXRlLFxuICAgICAgICAgICAgICAgIFwiZW5kX2RhdGVcIjogZW5kX2RhdGUsXG4gICAgICAgICAgICAgICAgXCJncm91cF9uYW1lXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLm5hbWUsXG4gICAgICAgICAgICAgICAgXCJzdXBlcnZpc29yXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnRlYWNoZXIsXG4gICAgICAgICAgICAgICAgXCJvcmdhbml6YXRpb25zXCI6IG9yZ2FuaXNhdGlvbnNfZm9yX2RvY3VtZW50XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZG9jdW1lbnRzLnB1c2goZG9jdW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhbGVydChcItCS0L7Qt9C80L7QttC90L7RgdGC0Ywg0LPQtdC90LXRgNCw0YbQuNC4INC00L7QutGD0LzQtdC90YLQvtCyINC00LvRjyDQv9GA0LXQtNC00LjQv9C70L7QvNC90L7QuSDQv9GA0LDQutGC0LjQutC4INCyINGB0YLQsNC00LjQuCDRgNCw0LfRgNCw0LHQvtGC0LrQuC4g0J/RgNC40L3QvtGB0LjQvCDRgdCy0L7QuCDQuNC30LLQuNC90LXQvdC40Y8g0LfQsCDQv9GA0LXQtNC+0YHRgtCw0LLQu9C10L3QvdGL0LUg0L3QtdGD0LTQvtCx0YHRgtCy0LBcIilcbiAgICB9XG4gICAgcmV0dXJuIGRvY3VtZW50cztcbn07XG5WaWV3LnByb3RvdHlwZS5nZXRFZHVjYXRpb25hbExldmVsID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCB0cmVlVmlldyA9IDA7XG4gICAgbGV0IGZyYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmcmFtZXNcIilbMF0uY2hpbGRyZW47XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGZyYW1lc1tpXS5zdHlsZS5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgdHJlZVZpZXcgPSBmcmFtZXNbaV0uY2hpbGRyZW5bMF07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgZWR1Y2F0aW9uYWxfbGV2ZWwgPSB0cmVlVmlldy5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICBpZiAoZWR1Y2F0aW9uYWxfbGV2ZWwuaW5kZXhPZihcImJhY2hlbG9yXCIpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gXCJiYWNoZWxvclwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwibWFzdGVyXCI7XG4gICAgfVxufTtcblZpZXcucHJvdG90eXBlLmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnRSZXBvcnQgPSBmdW5jdGlvbiAocHJhY3RpY2UsIHNlbGVjdGVkR3JvdXBzLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgZWR1Y2F0aW9uYWxfbGV2ZWwgPSB0aGlzLmdldEVkdWNhdGlvbmFsTGV2ZWwoKTtcbiAgICBsZXQgZ3JvdXBzRm9yRG9jdW1lbnQgPSBbXTtcbiAgICBsZXQgYmxvY2tHcm91cHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyb3Vwcy1yZXBvcnQtYmxvY2tcIikuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZ3JvdXAnKTtcbiAgICBsZXQgYWRkaXRpb25hbF9pbmZvID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja0dyb3Vwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgZ3JvdXBOYW1lID0gYmxvY2tHcm91cHNbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2g0JylbMF0uaW5uZXJIVE1MO1xuICAgICAgICBsZXQgc3VwZXJ2aXNvciA9IGJsb2NrR3JvdXBzW2ldLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJzdXBlcnZpc29yXCIpWzBdLnZhbHVlO1xuICAgICAgICBsZXQgZ29vZF9zdHVkZW50c19udW1iZXIgPSBibG9ja0dyb3Vwc1tpXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZ29vZF9zdHVkZW50c1wiKVswXS52YWx1ZTtcbiAgICAgICAgbGV0IHRlYWNoZXJfbnVtYmVyID0gYmxvY2tHcm91cHNbaV0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRlYWNoZXJfbnVtYmVyXCIpWzBdLnZhbHVlO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbal0gPT09IGdyb3VwTmFtZSlcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsX2luZm8ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIFwiZ3JvdXBOYW1lXCI6IGdyb3VwTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzdXBlcnZpc29yXCI6IHN1cGVydmlzb3IsXG4gICAgICAgICAgICAgICAgICAgIFwiZ29vZF9zdHVkX251bVwiOiBnb29kX3N0dWRlbnRzX251bWJlcixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZWFjaGVyX251bWJlclwiOiB0ZWFjaGVyX251bWJlclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmluZm9Hcm91cHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEdyb3Vwc1tpXS5pbmRleE9mKHRoaXMuaW5mb0dyb3Vwc1tqXS5uYW1lKSAhPT0gLTEgJiYgdGhpcy5pbmZvR3JvdXBzW2pdLnR5cGUgPT09IGVkdWNhdGlvbmFsX2xldmVsKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBhbGxHcm91cHMubGVuZ3RoOyBuKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2ldID09PSBhbGxHcm91cHNbbl0ubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBhZGRpdGlvbmFsX2luZm8ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IGFkZGl0aW9uYWxfaW5mb1trXS5ncm91cE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLnN1cGVydmlzb3IgPSBhZGRpdGlvbmFsX2luZm9ba10uc3VwZXJ2aXNvcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLmZ1bGxOYW1lID0gdGhpcy5pbmZvR3JvdXBzW2pdLmZ1bGxOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0uZ29vZF9zdHVkX251bSA9IGFkZGl0aW9uYWxfaW5mb1trXS5nb29kX3N0dWRfbnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0udGVhY2hlcl9udW1iZXIgPSBhZGRpdGlvbmFsX2luZm9ba10udGVhY2hlcl9udW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3Vwc0ZvckRvY3VtZW50LnB1c2goYWxsR3JvdXBzW25dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHN0YXJ0X2RhdGUgPSB0aGlzLmZvcm1hdERhdGUocHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZSk7XG4gICAgbGV0IGVuZF9kYXRlID0gdGhpcy5mb3JtYXREYXRlKHByYWN0aWNlLmVuZF9kYXRlX3ByYWN0aWNlKTtcblxuICAgIGxldCBoZWFkX29mX2RlcGFydG1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlYWRfb2ZfZGVwYXJ0bWVudFwiKS52YWx1ZTtcbiAgICBsZXQgZG9jdW1lbnRzID0gW107XG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlVGFiXCIpLnZhbHVlO1xuICAgIHR5cGVQcmFjdGljZSA9IHR5cGVQcmFjdGljZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgbGV0IGNvdXJzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY291cnNlXCIpLnZhbHVlO1xuICAgIGxldCBiYXNlX3ByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYXNlX3ByYWN0aWNlXCIpLnZhbHVlO1xuICAgIGxldCBudW1fYmFzZV9wcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2Jhc2VfcHJhY3RpY2VcIikudmFsdWU7XG4gICAgbGV0IG51bV9sZWN0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2xlY3Rpb25zXCIpLnZhbHVlO1xuXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBkb2N1bWVudCA9IHtcbiAgICAgICAgICAgIFwiZGlyZWN0aW9uXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLmZ1bGxOYW1lLFxuICAgICAgICAgICAgXCJjb3Vyc2VcIjogY291cnNlLFxuICAgICAgICAgICAgXCJ0eXBlX3ByYWN0aWNlXCI6IHR5cGVQcmFjdGljZSxcbiAgICAgICAgICAgIFwic3RhcnRfZGF0ZVwiOiBzdGFydF9kYXRlLFxuICAgICAgICAgICAgXCJlbmRfZGF0ZVwiOiBlbmRfZGF0ZSxcbiAgICAgICAgICAgIFwiZ3JvdXBfbmFtZVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5uYW1lLFxuICAgICAgICAgICAgXCJiYXNlX3ByYWN0aWNlXCI6IGJhc2VfcHJhY3RpY2UsXG4gICAgICAgICAgICBcInllYXJcIjogcHJhY3RpY2UueWVhcixcbiAgICAgICAgICAgIFwidGVhY2hlcl9udW1iZXJcIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0udGVhY2hlcl9udW1iZXIsXG4gICAgICAgICAgICBcInN0dWRlbnRfbnVtYmVyXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnN0dWRlbnRzLmxlbmd0aCxcbiAgICAgICAgICAgIFwiZ29vZF9zdHVkX251bVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5nb29kX3N0dWRfbnVtLFxuICAgICAgICAgICAgXCJudW1fYmFzZV9wcmFjdGljZVwiOiBudW1fYmFzZV9wcmFjdGljZSxcbiAgICAgICAgICAgIFwibnVtX2xlY3Rpb25zXCI6IG51bV9sZWN0aW9ucyxcbiAgICAgICAgICAgIFwic3VwZXJ2aXNvclwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5zdXBlcnZpc29yLFxuICAgICAgICAgICAgXCJoZWFkX29mX2RlcGFydG1lbnRcIjogaGVhZF9vZl9kZXBhcnRtZW50XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50cy5wdXNoKGRvY3VtZW50KTtcbiAgICB9XG4gICAgcmV0dXJuIGRvY3VtZW50cztcbn07XG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RWYWx1ZSA9IGZ1bmN0aW9uIChpZCkge1xuICAgIGxldCB2YWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5vcHRpb25zW2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKS5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICByZXR1cm4gdmFsdWU7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5jaGFuZ2VEaXNwbGF5ID0gZnVuY3Rpb24gKGlkLCB2YWx1ZSkge1xuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9IHZhbHVlO1xufTtcblxuVmlldy5wcm90b3R5cGUuY2hhbmdlSW5uZXJIdG1sID0gZnVuY3Rpb24gKGlkLCB2YWx1ZSkge1xuICAgIGxldCBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIGVsZW0uaW5uZXJIVE1MID0gdmFsdWU7XG59O1xuXG5WaWV3LnByb3RvdHlwZS5maWxsRGlhbG9nID0gZnVuY3Rpb24gKHByYWN0aWNlLCBvcmdhbmlzYXRpb25zKSB7XG4gICAgbGV0IGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhc2VfcHJhY3RpY2VcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGVsZW0udmFsdWUgKz0gb3JnYW5pc2F0aW9uc1tpXS5uYW1lICsgJywgJztcbiAgICB9XG4gICAgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2Jhc2VfcHJhY3RpY2VcIik7XG4gICAgZWxlbS52YWx1ZSA9IG9yZ2FuaXNhdGlvbnMubGVuZ3RoO1xuXG4gICAgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2xlY3Rpb25zXCIpO1xuICAgIGVsZW0udmFsdWUgPSArcHJhY3RpY2UubGVjdGlvbnNfbnVtYmVyO1xufTtcblZpZXcucHJvdG90eXBlLnJlYWRUZXh0RmlsZSA9IGZ1bmN0aW9uIChmaWxlLCBjYWxsYmFjaykge1xuICAgIHZhciByYXdGaWxlID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmF3RmlsZS5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICByYXdGaWxlLm9wZW4oXCJHRVRcIiwgZmlsZSwgdHJ1ZSk7XG4gICAgcmF3RmlsZS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHJhd0ZpbGUucmVhZHlTdGF0ZSA9PT0gNCAmJiByYXdGaWxlLnN0YXR1cyA9PSBcIjIwMFwiKSB7XG4gICAgICAgIHZhciByZXM9IGNhbGxiYWNrKHJhd0ZpbGUucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIHRoaXMuaW5mb0dyb3Vwcz0gcmVzO1xuICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgfVxuICAgIH1cbiAgICByYXdGaWxlLnNlbmQobnVsbCk7XG59XG5cbi8vdXNhZ2U6XG5cblN0cmluZy5wcm90b3R5cGUucmVwbGFjZUF0ID0gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuICAgIHJldHVybiB0aGlzLnN1YnN0cigwLCBpbmRleCkgKyByZXBsYWNlbWVudCArIHRoaXMuc3Vic3RyKGluZGV4ICsgcmVwbGFjZW1lbnQubGVuZ3RoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlldztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvVmlldy5qcyIsImNvbnN0IFNFUFRFTUJFUiA9IDk7XG5jb25zdCBmaXJzdENvdXJzZSA9IDA7XG5jb25zdCBzZWNvbmRDb3Vyc2UgPSAxO1xuY29uc3QgdGhpcmRDb3Vyc2UgPSAyO1xuY29uc3QgZm91cnRoQ291cnNlID0gMztcbmNvbnN0IG1hc3RlckZpcnN0Q291cnNlID0gNDtcbmNvbnN0IG1hc3RlclNlY29uZENvdXJzZSA9IDU7XG5jb25zdCBSRUpFQ1RFRCA9IDI7XG5jb25zdCBBUFBST1ZFRCA9IDE7XG5jb25zdCBBUFBMWSA9IDA7XG5jb25zdCBDT05GSUcgPSByZXF1aXJlKCcuLi8uLi9jb25maWcvcmVsX2NvbmZpZycpO1xudmFyIE1vZGVsID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuR3JvdXBzID0gW107XG4gICAgdGhpcy5TdHVkZW50cyA9IFtdO1xuICAgIHRoaXMuQ291cnNlcyA9IFtdO1xuICAgIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSBbXTtcbiAgICB0aGlzLk9yZ2FuaXNhdGlvbnMgPSBbXTtcblxufTtcblxuY2xhc3MgQ291cnNlIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lQ291cnNlKSB7XG4gICAgICAgIHRoaXMubmFtZUNvdXJzZSA9IG5hbWVDb3Vyc2U7XG4gICAgICAgIHRoaXMuZ3JvdXBzID0gW107XG4gICAgfVxuXG4gICAgYWRkR3JvdXAoZ3JvdXApIHtcbiAgICAgICAgdGhpcy5ncm91cHMucHVzaChncm91cCk7XG4gICAgfVxufVxuXG5jbGFzcyBHcm91cCB7XG4gICAgY29uc3RydWN0b3IodWlkX0xEQVAsIG5hbWVHcm91cCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lR3JvdXA7XG4gICAgICAgIHRoaXMudWlkX0xEQVAgPSB1aWRfTERBUDtcbiAgICAgICAgdGhpcy5zdHVkZW50cyA9IFtdO1xuICAgIH1cblxuICAgIGFkZFN0dWRlbnQoc3R1ZGVudCkge1xuICAgICAgICB0aGlzLnN0dWRlbnRzLnB1c2goc3R1ZGVudCk7XG4gICAgfVxufVxuXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cbk1vZGVsLnByb3RvdHlwZS5nZXREYXRhID0gYXN5bmMgZnVuY3Rpb24gKHNlbGVjdGVkR3JvdXBzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucykge1xuICAgIGxldCBkYXRhID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7ICsraywgKytsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpc1N0dWRlbnRBcHBseSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goe2dyb3VwOiB0aGlzLkdyb3Vwc1tpXS5uYW1lfSk7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uID0gJyAnO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMubGVuZ3RoOyArK3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XS5sZW5ndGg7ICsrbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9yZXF1ZXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID09PSArcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5pZF9yZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudF9VSUQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS51aWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLmlkX3N0YXR1cyA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdGF0dXMgPSByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLmlkX3N0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uID0gcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5uYW1lX29yZ2FuaXNhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU3R1ZGVudEFwcGx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gKz0gcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5uYW1lX29yZ2FuaXNhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJywgJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU3R1ZGVudEFwcGx5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzU3R1ZGVudEFwcGx5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50X1VJRCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLnVpZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uID0gXCLQndC1INC30LDQv9C40YHQsNC70YHRj1wiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYXRhO1xufTtcblxuTW9kZWwucHJvdG90eXBlLmdldEdyb3VwcyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcm94eS9jb3JlL3YxL2dyb3VwcycpO1xuICAgIGxldCBsaXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcbiAgICBsZXQgZ3JvdXBzID0gbGlzdC5fZW1iZWRkZWQuZ3JvdXBzO1xuICAgIHJldHVybiBncm91cHM7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuZ2V0R3JvdXBzQnlQcmFjdGljZUlkID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XG4gICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcbiAgICB9O1xuICAgIGxldCBpbmZvID0gXCI/aWRfcHJhY3RpY2U9XCJcbiAgICAgICAgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9ncm91cHMtYnktcHJhY3RpY2UtaWQnICsgaW5mbywgcGFyYW1zKTtcbiAgICBsZXQgZ3JvdXBzX3VpZHMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xuICAgIHJldHVybiBncm91cHNfdWlkcztcbn07XG5cbk1vZGVsLnByb3RvdHlwZS5nZXRHcm91cHNOYW1lQnlHcm91cHNVSUQgPSBhc3luYyBmdW5jdGlvbiAodWlkc0dyb3Vwcykge1xuICAgIGxldCBncm91cHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVpZHNHcm91cHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraikge1xuICAgICAgICAgICAgaWYgKCt1aWRzR3JvdXBzW2ldLnVpZF9ncm91cCA9PT0gdGhpcy5Hcm91cHNbal0udWlkX0xEQVApIHtcbiAgICAgICAgICAgICAgICBncm91cHMucHVzaCh0aGlzLkdyb3Vwc1tqXS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZ3JvdXBzO1xufTtcbi8q0L/QvtC70YPRh9Cw0LXQvCDRgdGC0YPQtNC10L3RgtC+0LIg0LjQtyDRhdGA0LDQvdC40LvQuNGJ0LAgTERBUCDQv9C+IElEINCz0YDRg9C/0L/RiyovXG4vKk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0J5R3JvdXBJZCA9IGFzeW5jIGZ1bmN0aW9uIChncm91cElEKSB7XG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvZ3JvdXBzLycgKyBncm91cElEKTtcbiAgbGV0IGxpc3QgPSBhd2FpdCByZXN1bHQuanNvbigpO1xuICBsZXQgc3R1ZGVudHNMaXN0ID0gbGlzdC5fZW1iZWRkZWQuc3R1ZGVudHM7XG4gIHJldHVybiBzdHVkZW50c0xpc3Q7XG59OyovXG5cbk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0J5VUlEID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzX2luZm8pIHtcbiAgICBsZXQgc3R1ZGVudHMgPSBbXSwgdXJscyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHNfaW5mby5sZW5ndGg7ICsraSkge1xuICAgICAgICB1cmxzLnB1c2goJy9wcm94eS9jb3JlL3YxL3Blb3BsZS8nICsgc3R1ZGVudHNfaW5mb1tpXS51aWRfc3R1ZGVudCk7XG4gICAgfVxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsKS5jYXRjaChlcnIgPT4gZXJyKSlcbiAgICApXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXG4gICAgICAgICkpXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzTGVuZ3RoID0gcmVzdWx0cy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc0xlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgc3R1ZGVudHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlOYW1lOiByZXN1bHRzW2ldLmRpc3BsYXlOYW1lLFxuICAgICAgICAgICAgICAgICAgICBncm91cF9uYW1lOiByZXN1bHRzW2ldLl9saW5rcy5ncm91cHNbMF0ubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBfVUlEOiByZXN1bHRzW2ldLl9saW5rcy5ncm91cHNbMF0uaWQsXG4gICAgICAgICAgICAgICAgICAgIGRhdGVfY3JlYXRpb25fcmVxdWVzdDogc3R1ZGVudHNfaW5mb1tpXS5kYXRlX2NyZWF0aW9uLFxuICAgICAgICAgICAgICAgICAgICBpZF9yZXF1ZXN0OiBzdHVkZW50c19pbmZvW2ldLmlkX3JlcXVlc3QsXG4gICAgICAgICAgICAgICAgICAgIHVpZF9zdHVkZW50OiBzdHVkZW50c19pbmZvW2ldLnVpZF9zdHVkZW50LFxuICAgICAgICAgICAgICAgICAgICBpZF9vcmdhbmlzYXRpb246IHN0dWRlbnRzX2luZm9baV0uaWRfb3JnYW5pc2F0aW9uXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIHJldHVybiBzdHVkZW50cztcbn07XG5cbk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0Zyb21MREFQID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGxldCBncm91cHMgPSBhd2FpdCB0aGlzLmdldEdyb3VwcygpO1xuICAgIGxldCB1cmxzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdGhpcy5Hcm91cHMucHVzaChuZXcgR3JvdXAoZ3JvdXBzW2ldLmlkLCBncm91cHNbaV0ubmFtZSkpO1xuICAgICAgICB1cmxzLnB1c2goJy9wcm94eS9jb3JlL3YxL2dyb3Vwcy8nICsgZ3JvdXBzW2ldLmlkKTtcbiAgICB9XG4gICAgYXdhaXQgdGhpcy5nZXRTdHVkZW50c0J5R3JvdXBJZHModXJscyk7XG59O1xuXG5cbk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0J5R3JvdXBJZHMgPSBhc3luYyBmdW5jdGlvbiAodXJscykge1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsKS5jYXRjaChlcnIgPT4gZXJyKSlcbiAgICApXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXG4gICAgICAgICkpXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzTGVuZ3RoID0gcmVzdWx0cy5sZW5ndGg7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0dWRlbnRzID0gcmVzdWx0c1tpXS5fZW1iZWRkZWQuc3R1ZGVudHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RMZW5ndGggPSBzdHVkZW50cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdExlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHVkZW50ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ25hbWUnOiBzdHVkZW50c1tqXS5kaXNwbGF5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd1aWQnOiBzdHVkZW50c1tqXS51aWRcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMucHVzaChzdHVkZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufTtcblxuTW9kZWwucHJvdG90eXBlLmdldEN1cnJlbnRZZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBsZXQgY3VycmVudFllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gY3VycmVudFllYXI7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuZGlzdHJpYnV0ZUdyb3Vwc0J5Q291cnNlcyA9IGFzeW5jIGZ1bmN0aW9uIChjdXJyZW50WWVhcikge1xuICAgIHRoaXMuQ291cnNlcyA9IFtcbiAgICAgICAgbmV3IENvdXJzZSgnMScpLFxuICAgICAgICBuZXcgQ291cnNlKCcyJyksXG4gICAgICAgIG5ldyBDb3Vyc2UoJzMnKSxcbiAgICAgICAgbmV3IENvdXJzZSgnNCcpLFxuICAgICAgICBuZXcgQ291cnNlKCcxICjQvNCzKScpLFxuICAgICAgICBuZXcgQ291cnNlKCcyICjQvNCzKScpXG4gICAgXTtcbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcbiAgICBpZiAoK2N1cnJlbnRNb250aCA8IFNFUFRFTUJFUikge1xuICAgICAgICBjdXJyZW50WWVhciAtPSAxO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5Db3Vyc2VzW21hc3RlckZpcnN0Q291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuQ291cnNlc1tmaXJzdENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudFllYXItLTtcbiAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5Db3Vyc2VzW21hc3RlclNlY29uZENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLkNvdXJzZXNbc2Vjb25kQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50WWVhci0tO1xuICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLkNvdXJzZXNbdGhpcmRDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRZZWFyLS07XG4gICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuQ291cnNlc1tmb3VydGhDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRZZWFyICs9IDM7XG4gICAgfVxufTtcbk1vZGVsLnByb3RvdHlwZS5nZXRQcmFjdGljZSA9IGFzeW5jIGZ1bmN0aW9uIChpbmZvX2Fib3V0X3ByYWN0aWNlKSB7XG4gICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcbiAgICB9O1xuICAgIGluZm9fYWJvdXRfcHJhY3RpY2UgPSBcIj95ZWFyPVwiICsgaW5mb19hYm91dF9wcmFjdGljZS55ZWFyICsgXCImZWR1X2xldmVsPVwiXG4gICAgICAgICsgaW5mb19hYm91dF9wcmFjdGljZS5lZHVfbGV2ZWwgKyBcIiZ0eXBlUHJhY3RpY2U9XCJcbiAgICAgICAgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLnR5cGVQcmFjdGljZTtcbiAgICBsZXQgaW5mbyA9IDA7XG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJhY3RpY2UnICsgaW5mb19hYm91dF9wcmFjdGljZSwgcGFyYW1zKVxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGluZm8gPSByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgfSk7XG4gICAgcmV0dXJuIGluZm87XG59O1xuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RCeVN0dWRlbnRVSUQgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UsIHN0dWRlbnQpIHtcbiAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xuICAgIH07XG4gICAgbGV0IGluZm8gPSAnP3VpZD0nICsgc3R1ZGVudC51aWQgKyBcIiZpZF9wcmFjdGljZT1cIlxuICAgICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3JlcXVzdC1ieS1zdHVkZW50LXVpZCcgKyBpbmZvLCBwYXJhbXMpO1xuICAgIGxldCByZXF1ZXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcbiAgICByZXR1cm4gcmVxdWVzdDtcbn07XG5cbk1vZGVsLnByb3RvdHlwZS51cGRhdGVJZE9yZ2FuaXNhdGlvbkluUmVxdWVzdCA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50KSB7XG4gICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcbiAgICB9O1xuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3QgKyBcIiZpZF9vcmdhbmlzYXRpb249XCJcbiAgICAgICAgKyBzdHVkZW50LmlkX29yZ2FuaXNhdGlvbjtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy91cGRhdGUtcmVxdWVzdCcgKyBpbmZvLCBwYXJhbXMpO1xufTtcblxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlLCBncm91cHMpIHtcbiAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xuICAgIH07XG4gICAgbGV0IHJlcXVlc3RzID0gW107XG4gICAgbGV0IHVybHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgbGV0IGluZm8gPSAnP2lkX3N0dWRlbnQ9JyArIGdyb3Vwc1tpXS5zdHVkZW50c1tqXS51aWQgKyBcIiZpZF9wcmFjdGljZT1cIlxuICAgICAgICAgICAgICAgICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XG4gICAgICAgICAgICB1cmxzLnB1c2goJy9yZXF1c3RzLWJ5LXN0dWRlbnQtcHJhY3RpY2UnICsgaW5mbyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcbiAgICApXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXG4gICAgICAgICkpXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdHMucHVzaChyZXN1bHRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgcmV0dXJuIHJlcXVlc3RzOy8v0L/QvtC70YPRh9C40LvQuCBhbGwg0LfQsNGP0LLQvtC6INGB0YLRg9C00LXQvdGC0L7QsiDQstGL0LHRgNCw0L3QvdGL0YUg0LPRgNGD0L/Qv1xufTtcblxuTW9kZWwucHJvdG90eXBlLmFzc29zaWF0ZVJlcXVlc3RUb1N0dWRlbnQgPSBhc3luYyBmdW5jdGlvbiAocmVxdWVzdHMsIGdyb3Vwcykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBncm91cHNbal0pIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLmxlbmd0aDsgKytrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcmVxdWVzdHMubGVuZ3RoOyArK24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS51aWQgPT09IHJlcXVlc3RzW25dLnVpZF9zdHVkZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfcmVxdWVzdCA9IHJlcXVlc3RzW25dLmlkX3JlcXVlc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RzW25dLmlkX29yZ2FuaXNhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9vcmdhbmlzYXRpb24gPSByZXF1ZXN0c1tuXS5pZF9vcmdhbmlzYXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzT3JnYW5pc2F0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZEdyb3Vwcykge1xuICAgIGxldCBwYXJhbXMgPSB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXG4gICAgfTtcbiAgICBsZXQgdXJscyA9IFtdO1xuICAgIGxldCBvcmdhbmlzYXRpb25zX2J5X3JlcXVlc3QgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyArK2spIHtcbiAgICAgICAgICAgICAgICAgICAgdXJscy5wdXNoKCcvb3JnYW5pc2F0aW9ucy1ieS1yZXF1ZXN0JyArICc/aWRfcmVxdWVzdD0nXG4gICAgICAgICAgICAgICAgICAgICAgICArIHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLmlkX3JlcXVlc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcbiAgICApXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXG4gICAgICAgICkpXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc19ieV9yZXF1ZXN0LnB1c2gocmVzdWx0c1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIHJldHVybiBvcmdhbmlzYXRpb25zX2J5X3JlcXVlc3Q7XG59O1xuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RCeVN0dWRlbnRVSURTID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlLCBzdHVkZW50cykge1xuICAgIGxldCBwYXJhbXMgPSB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXG4gICAgfTtcbiAgICBsZXQgdXJscyA9IFtdO1xuICAgIGxldCByZXF1ZXN0cyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdXJscy5wdXNoKCcvcmVxdXN0LWJ5LXN0dWRlbnQtdWlkJyArICc/dWlkPScgKyBzdHVkZW50c1tpXS51aWRcbiAgICAgICAgICAgICsgXCImaWRfcHJhY3RpY2U9XCJcbiAgICAgICAgICAgICsgcHJhY3RpY2UuaWRfcHJhY3RpY2UpO1xuICAgIH1cbiAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcbiAgICApXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcbiAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXG4gICAgICAgICkpXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdHMucHVzaChyZXN1bHRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gcmVxdWVzdHM7XG59O1xuTW9kZWwucHJvdG90eXBlLmdldFByYWN0aWNlWWVhcnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcveWVhcnMtcHJhY3RpY2UnKTtcbiAgICBsZXQgeWVhcnMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xuICAgIHJldHVybiB5ZWFycztcbn07XG5cbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0c09yZ2FuaXNhdGlvbnNCeVJlcXVlc3RJZCA9IGFzeW5jIGZ1bmN0aW9uIChyZXF1ZXN0cykge1xuICAgIGxldCBwYXJhbXMgPSB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXG4gICAgfTtcbiAgICBsZXQgdXJscyA9IFtdO1xuICAgIGxldCByZXF1ZXN0c19vcmdhbmlzYXRpb25zID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXF1ZXN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB1cmxzLnB1c2goJy9vcmdhbmlzYXRpb25zLWJ5LXJlcXVlc3QnICsgJz9pZF9yZXF1ZXN0PScgKyByZXF1ZXN0c1tpXS5pZF9yZXF1ZXN0KTtcbiAgICB9XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpXG4gICAgKVxuICAgICAgICAudGhlbihyZXNwb25zZXMgPT4gUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxuICAgICAgICApKVxuICAgICAgICAudGhlbihyZXN1bHRzID0+IHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMucHVzaChyZXN1bHRzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICByZXR1cm4gcmVxdWVzdHNfb3JnYW5pc2F0aW9ucztcbn07XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBDUkVBVElPTlxuIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG5cbk1vZGVsLnByb3RvdHlwZS5pbml0ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIC8qbGV0IHN1YklEID0gXCI1NzIzOGJkOS0zNmU4LTRkODQtODE2MC1lYjRhZDk1N2E4NDFcIjtcbiAgICBsZXQgdXNlclRva2VuID0gZ2V0VXNlclRva2VuKCksIHVzZXI9MDtcbiAgICBpZiAoIXVzZXJUb2tlbikge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBDT05GSUcubm9fdG9rZW5fbG9jYXRpb247XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gc3ViSUQgPSBKU09OLnBhcnNlKGF0b2IodXNlclRva2VuLnNwbGl0KCcuJylbMV0pKS5zdWI7XG4gICAgICB1c2VyPSAgYXdhaXQgdGhpcy5nZXRVc2VySW5mbyhzdWJJRCk7XG4gICAgfVxuICAgIGxldCBwYXJhbXMgPSB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXG4gICAgfTtcbiAgICBsZXQgaW5mbyA9ICc/dXNlclR5cGU9JyArIHVzZXIudHlwZVVzZXI7Ki9cbiAgICBhd2FpdCBmZXRjaCgnL3VzZXItY2FiaW5ldCcgKyBpbmZvLCBwYXJhbXMpO1xufTtcblxuTW9kZWwucHJvdG90eXBlLmdldFVzZXJJbmZvID0gYXN5bmMgZnVuY3Rpb24gKHN1YklEKSB7XG4gICAgbGV0IHVzZXIgPSB7fTtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcm94eS9jb3JlL3YxL3Blb3BsZS8/dWlkPScgKyBzdWJJRCk7XG4gICAgbGV0IHN1YmplY3QgPSBhd2FpdCByZXN1bHQuanNvbigpO1xuICAgIGxldCB0eXBlX3VzZXI9c3ViamVjdC5fZW1iZWRkZWQucGVvcGxlW1wiMFwiXS50aXRsZTtcbiAgICBpZih0eXBlX3VzZXIubGVuZ3RoPT09Mil7XG4gICAgICAgIHR5cGVfdXNlcj1zdWJqZWN0Ll9lbWJlZGRlZC5wZW9wbGVbXCIwXCJdLnRpdGxlWzFdO1xuICAgIH1cbiAgICBsZXQgZ2l2ZW5OYW1lID0gc3ViamVjdC5fZW1iZWRkZWQucGVvcGxlW1wiMFwiXS5naXZlbk5hbWU7XG4gICAgbGV0IHNuID0gc3ViamVjdC5fZW1iZWRkZWQucGVvcGxlW1wiMFwiXS5zbjtcbiAgICB1c2VyLmZpcnN0TmFtZT1naXZlbk5hbWU7XG4gICAgdXNlci5sYXN0TmFtZT0gc247XG4gICAgdXNlci50eXBlVXNlcj10eXBlX3VzZXI7XG4gICAgcmV0dXJuIHVzZXI7XG59O1xuXG5mdW5jdGlvbiBnZXRVc2VyVG9rZW4oKSB7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyLXRva2VuJyk7XG59XG5cbk1vZGVsLnByb3RvdHlwZS5nZXRUeXBlc09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uID0gW107XG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvdHlwZXMtb3JnYW5pc2F0aW9uJyk7XG4gICAgbGV0IHR5cGVzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcbiAgICB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uID0gdHlwZXM7XG4gICAgcmV0dXJuIHRoaXMudHlwZXNPcmdhbmlzYXRpb247XG59O1xuXG5cbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zID0gYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbnMnKTtcbiAgICBsZXQgb3JncyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XG4gICAgdGhpcy5PcmdhbmlzYXRpb25zID0gb3JncztcbiAgICByZXR1cm4gdGhpcy5PcmdhbmlzYXRpb25zO1xufTtcblxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbnNCeVByYWN0aWNlSWQgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UpIHtcbiAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xuICAgIH07XG4gICAgbGV0IGluZm8gPSAnP2lkX3ByYWN0aWNlPScgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb25zLWJ5LXByYWN0aWNlJyArIGluZm8sIHBhcmFtcyk7XG4gICAgbGV0IG9yZ2FuaXNhdGlvbnMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xuICAgIHJldHVybiBvcmdhbmlzYXRpb25zO1xufTtcblxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbkJ5SWQgPSBhc3luYyBmdW5jdGlvbiAoaWQpIHtcbiAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xuICAgIH07XG4gICAgbGV0IGluZm8gPSAnP2lkPScgKyBpZDtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tYnktaWQnICsgaW5mbywgcGFyYW1zKTtcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xufTtcblxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzQnlQcmFjdGljZUlkID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XG4gICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcbiAgICB9O1xuICAgIGxldCBpbmZvID0gJz9pZF9wcmFjdGljZT0nICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcmVxdWVzdHMtYnktcHJhY3RpY2UnICsgaW5mbywgcGFyYW1zKTtcbiAgICBsZXQgcmVxdWVzdHMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xuICAgIHJldHVybiByZXF1ZXN0cztcbn07XG5cblxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzQnlPcmdhbmlzYXRpb25OYW1lID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmFjdGljZSwgaXNBcHByb3ZlZCkge1xuICAgIGxldCBwYXJhbXMgPSB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXG4gICAgfTtcbiAgICBsZXQgaW5mbyA9IDAsIFNUQVRVUztcbiAgICBpZiAoIWlzQXBwcm92ZWQpIHtcbiAgICAgICAgaW5mbyA9IFwiP2lkX3ByYWN0aWNlPVwiICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XG4gICAgICAgIFNUQVRVUyA9IDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpbmZvID0gXCI/aWRfcHJhY3RpY2U9XCIgKyBwcmFjdGljZS5pZF9wcmFjdGljZSArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIlxuICAgICAgICAgICAgKyBvcmdhbmlzYXRpb24uaWQ7XG4gICAgICAgIFNUQVRVUyA9IDE7XG4gICAgfVxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3JlcXVlc3RzLWJ5LXByYWN0aWNlJyArIGluZm8sIHBhcmFtcyk7XG4gICAgbGV0IHJlcXVlc3RzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcbiAgICBsZXQgc3R1ZGVudHMgPSBbXTtcbiAgICBsZXQgdXJscyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxdWVzdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdXJscy5wdXNoKFwiL2V4aXN0LXJlcXVlc3Q/aWRfcmVxdWVzdD1cIiArIHJlcXVlc3RzW2ldLmlkX3JlcXVlc3RcbiAgICAgICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiXG4gICAgICAgICAgICArIG9yZ2FuaXNhdGlvbi5pZCk7XG4gICAgfVxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsLCBwYXJhbXMpLmNhdGNoKGVyciA9PiBlcnIpKVxuICAgIClcbiAgICAgICAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcbiAgICAgICAgKSlcbiAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXNMZW5ndGggPSByZXN1bHRzLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0c1tpXSAhPT0gJ05vdCBmb3VuZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbaV0uaWRfc3RhdHVzID09PSBTVEFUVVMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0dWRlbnRzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3JlcXVlc3Q6IHJlc3VsdHNbaV0uaWRfcmVxdWVzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZF9vcmdhbmlzYXRpb246IHJlc3VsdHNbaV0uaWRfb3JnYW5pc2F0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3N0YXR1czogcmVzdWx0c1tpXS5pZF9zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWlkX3N0dWRlbnQ6IHJlcXVlc3RzW2ldLnVpZF9zdHVkZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3ByYWN0aWNlOiByZXF1ZXN0c1tpXS5pZF9wcmFjdGljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZF9yZXZpZXc6IHJlcXVlc3RzW2ldLmlkX3JldmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlX2NyZWF0aW9uOiByZXN1bHRzW2ldLmRhdGVfY3JlYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICByZXR1cm4gc3R1ZGVudHM7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9uQnlOYW1lID0gYXN5bmMgZnVuY3Rpb24gKG5hbWVPcmdhbmlzYXRpb24pIHtcbiAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xuICAgIH07XG4gICAgbGV0IGluZm8gPSAnP25hbWU9JyArIG5hbWVPcmdhbmlzYXRpb247XG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9uLWJ5LW5hbWUnICsgaW5mbywgcGFyYW1zKTtcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xufTtcblxuTW9kZWwucHJvdG90eXBlLmdldERldGVybWluZWRHcm91cHMgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcbiAgICBsZXQgZGV0ZXJtaW5lZEdyb3VwcyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XG4gICAgICAgICAgICAgICAgZGV0ZXJtaW5lZEdyb3Vwcy5wdXNoKHRoaXMuR3JvdXBzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGV0ZXJtaW5lZEdyb3Vwcztcbn07XG5cbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9uLWNyZWF0ZScsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkob3JnYW5pc2F0aW9uKVxuICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQvtGA0LPQsNC90LjQt9Cw0YbQuNC4INCyINCR0JQgXCIgKyBlcnJvcik7XG4gICAgICAgIH0pO1xufTtcblxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZU9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tdXBkYXRlJywge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvcmdhbmlzYXRpb24pXG4gICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INC+0YDQs9Cw0L3QuNC30LDRhtC40Lgg0LIg0JHQlCBcIiArIGVycm9yKTtcbiAgICAgICAgfSk7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuY3JlYXRlUHJhY3RpY2UgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UpIHtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZScsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocHJhY3RpY2UpXG4gICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INC/0YDQsNC60YLQuNC60Lgg0LIg0JHQlCBcIiArIGVycm9yKTtcbiAgICAgICAgfSk7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUuY3JlYXRlT3JVcGRhdGVTdHVkZW50cyA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50cykge1xuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3N0dWRlbnRzJywge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzdHVkZW50cylcbiAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40LggdWlkINGB0YLRg9C00LXQvdGC0L7QsiDQsiDQkdCUIFwiICsgZXJyb3IpO1xuICAgICAgICB9KTtcbn07XG5cbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnQpIHtcbiAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xuICAgIH07XG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBjdXJyZW50RGF0ZSA9IGRhdGUuZm9ybWF0KFwieXl5eS1tbS1kZFwiKTtcbiAgICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0XG4gICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiICsgc3R1ZGVudC5pZF9vcmdhbmlzYXRpb24gKyBcIiZpZF9zdGF0dXM9XCJcbiAgICAgICAgKyBzdHVkZW50LmlkX3N0YXR1cyArIFwiJmRhdGVfY3JlYXRpb249XCJcbiAgICAgICAgKyBjdXJyZW50RGF0ZTtcbiAgICBhd2FpdCBmZXRjaCgnL3VwZGF0ZS1yZXF1ZXN0LW9yZ2FuaXNhdGlvbicgKyBpbmZvLCBwYXJhbXMpO1xufTtcblxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzKSB7XG4gICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcbiAgICB9O1xuICAgIGxldCB1cmxzID0gW107XG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHZhciBjdXJyZW50RGF0ZSA9IGRhdGUuZm9ybWF0KFwieXl5eS1tbS1kZFwiKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0XG4gICAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnRzW2ldLmlkX29yZ2FuaXNhdGlvbiArIFwiJmlkX3N0YXR1cz1cIlxuICAgICAgICAgICAgKyBzdHVkZW50c1tpXS5pZF9zdGF0dXMgKyBcIiZkYXRlX2NyZWF0aW9uPVwiXG4gICAgICAgICAgICArIGN1cnJlbnREYXRlO1xuICAgICAgICB1cmxzLnB1c2goJy91cGRhdGUtcmVxdWVzdC1vcmdhbmlzYXRpb24nICsgaW5mbyk7XG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwodXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSkpO1xufTtcblxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RPcmdhbmlzYXRpb25CeVJlcXVlc3QgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudCkge1xuICAgIGxldCBwYXJhbXMgPSB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXG4gICAgfTtcblxuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3QgKyBcIiZpZF9zdGF0dXM9XCJcbiAgICAgICAgKyBzdHVkZW50LmlkX3N0YXR1cyArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uO1xuICAgIGF3YWl0IGZldGNoKCcvdXBkYXRlLXJlcXVlc3Qtb3JnYW5pc2F0aW9uLWJ5LXJlcXVlc3QnICsgaW5mbywgcGFyYW1zKTtcbn07XG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlUmVxdWVzdHNPcmdhbmlzYXRpb25CeVJlcXVlc3QgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudHMpIHtcbiAgICBsZXQgcGFyYW1zID0ge1xuICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICBtb2RlOiAnY29ycycsXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xuICAgIH07XG4gICAgbGV0IHVybHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0XG4gICAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnRzW2ldLmlkX29yZ2FuaXNhdGlvbiArIFwiJmlkX3N0YXR1cz1cIlxuICAgICAgICAgICAgKyBzdHVkZW50c1tpXS5pZF9zdGF0dXM7XG4gICAgICAgIHVybHMucHVzaCgnL3VwZGF0ZS1yZXF1ZXN0LW9yZ2FuaXNhdGlvbi1ieS1yZXF1ZXN0JyArIGluZm8pO1xuICAgIH1cbiAgICBhd2FpdCBQcm9taXNlLmFsbCh1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsLCBwYXJhbXMpLmNhdGNoKGVyciA9PiBlcnIpKSk7XG59O1xuTW9kZWwucHJvdG90eXBlLmluc2VydFJlcXVlc3RPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudCkge1xuICAgIGxldCBwYXJhbXMgPSB7XG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXG4gICAgfTtcbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGN1cnJlbnREYXRlID0gZGF0ZS5mb3JtYXQoXCJ5eXl5LW1tLWRkXCIpO1xuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3QgKyBcIiZpZF9vcmdhbmlzYXRpb249XCJcbiAgICAgICAgKyBzdHVkZW50LmlkX29yZ2FuaXNhdGlvbiArIFwiJmlkX3N0YXR1cz1cIiArIHN0dWRlbnQuaWRfc3RhdHVzXG4gICAgICAgICsgXCImZGF0ZV9jcmVhdGlvbj1cIlxuICAgICAgICArIGN1cnJlbnREYXRlO1xuICAgIGF3YWl0IGZldGNoKCcvaW5zZXJ0LXJlcXVlc3Qtb3JnYW5pc2F0aW9uJyArIGluZm8sIHBhcmFtcyk7XG59O1xuXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlUmVxdWVzdCA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50KSB7XG4gICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcbiAgICB9O1xuICAgIGxldCBpbmZvID0gMDtcbiAgICBpZiAoc3R1ZGVudC5pZF9zdGF0dXMgPT09IFJFSkVDVEVEKSB7XG4gICAgICAgIGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdFxuICAgICAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249bnVsbFwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0XG4gICAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uO1xuICAgIH1cbiAgICBhd2FpdCBmZXRjaCgnL3VwZGF0ZS1yZXF1ZXN0JyArIGluZm8sIHBhcmFtcyk7XG59O1xuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RzID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzKSB7XG4gICAgbGV0IHBhcmFtcyA9IHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcbiAgICB9O1xuICAgIGxldCBpbmZvID0gMDtcbiAgICBsZXQgdXJscyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgaW5mbyA9IDA7XG4gICAgICAgIGlmIChzdHVkZW50c1tpXS5pZF9zdGF0dXMgPT09IFJFSkVDVEVEKSB7XG4gICAgICAgICAgICBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0XG4gICAgICAgICAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249bnVsbFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxuICAgICAgICAgICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiICsgc3R1ZGVudHNbaV0uaWRfb3JnYW5pc2F0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHVybHMucHVzaCgnL3VwZGF0ZS1yZXF1ZXN0JyArIGluZm8pO1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpKTtcbn07XG5cbk1vZGVsLnByb3RvdHlwZS5nZW5lcmF0ZURvY3VtZW50ID0gYXN5bmMgZnVuY3Rpb24gKGRvY3VtZW50LCB0eXBlX2RvY3VtZW50LCB0eXBlX3ByYWN0aWNlKSB7XG4gICAgdHlwZV9wcmFjdGljZSA9IHR5cGVfcHJhY3RpY2UudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgaW5mb3JtYXRpb24gPSB7XG4gICAgICAgIGRhdGE6IGRvY3VtZW50LFxuICAgICAgICB0eXBlX2RvY3VtZW50OiB0eXBlX2RvY3VtZW50LFxuICAgICAgICB0eXBlX3ByYWN0aWNlOiB0eXBlX3ByYWN0aWNlXG4gICAgfTtcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9kb2N1bWVudCcsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoaW5mb3JtYXRpb24pXG4gICAgfSkudGhlbihmdW5jdGlvbiAocmVzcCkge1xuICAgICAgICByZXR1cm4gcmVzcC5ibG9iKCk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoYmxvYikge1xuICAgICAgICBzYXZlQXMoYmxvYiwgdHlwZV9kb2N1bWVudCArICcgJyArIHR5cGVfcHJhY3RpY2UgKyAnINC/0YDQsNC60YLQuNC60LAgJyArIGRvY3VtZW50Lmdyb3VwX25hbWUgKyBcIi5kb2N4XCIpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LPQtdC90LXRgNCw0YbQuNC4INC00L7QutGD0LzQtdC90YLQsCBcIiArIGVycm9yKTtcbiAgICB9KTtcbiAgICBkZWJ1Z2dlcjtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xuXG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvTW9kZWwuanMiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBcInNlcnZlcl9wb3J0XCI6IDc3NzcsXG4gICAgXCJ1c2VfcHJveHlcIjogZmFsc2UsXG4gICAgXCJzdXBlcnZpc29yX3BhdGhcIjogXCIvc3VwZXJ2aXNvcl9jYWJpbmV0XCIsXG4gICAgXCJzdHVkZW50X3BhdGhcIjogXCIvc3R1ZGVudF9jYWJpbmV0XCIsXG4gICAgXCJub190b2tlbl9sb2NhdGlvblwiOiBcImh0dHA6Ly9lc2IuaWlwby50dS1icnlhbnNrLnJ1L2F1dGhlbnRpY2F0aW9uLz9yZWRpcmVjdD1odHRwOi8vZXNiLmlpcG8udHUtYnJ5YW5zay5ydS9wcmFjdGljZS9cIixcbiAgICBcIm9yaWdpbl9sb2NhdGlvblwiOiBcIi9wcmFjdGljZS9cIixcbiAgICBcImRiXCI6IFwicHJhY3RpY2VcIixcbiAgICBcInByb3h5XCI6IFwiaHR0cDovL2VzYi5paXBvLnR1LWJyeWFuc2sucnVcIlxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBjb25maWcvcmVsX2NvbmZpZy5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby5jc3Ncbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWljb25zLmNzc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tc2NoZW1lcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBbe1wibmFtZVwiOlwi0JzQntCQXCIsXCJmdWxsTmFtZVwiOlwiMDIuMDMuMDMgwqvQnNCw0YLQtdC80LDRgtC40YfQtdGB0LrQvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0Lgg0LDQtNC80LjQvdC40YHRgtGA0LjRgNC+0LLQsNC90LjQtSDQuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXCJwcm9maWxlXCI6XCLCq9Ci0LXRhdC90L7Qu9C+0LPQuNGPINC/0YDQvtCz0YDQsNC80LzQuNGA0L7QstCw0L3QuNGPwrtcIixcInR5cGVcIjpcImJhY2hlbG9yXCJ9LHtcIm5hbWVcIjpcItCf0KDQmFwiLFwiZnVsbE5hbWVcIjpcIjA5LjAzLjA0IMKr0J/RgNC+0LPRgNCw0LzQvNC90LDRjyDQuNC90LbQtdC90LXRgNC40Y/Cu1wiLFwicHJvZmlsZVwiOlwiwqvQoNCw0LfRgNCw0LHQvtGC0LrQsCDQv9GA0L7Qs9GA0LDQvNC80L3Qvi3QuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXCJ0eXBlXCI6XCJiYWNoZWxvclwifSx7XCJuYW1lXCI6XCLQmNCS0KItMVwiLFwiZnVsbE5hbWVcIjpcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXCJ0eXBlXCI6XCJiYWNoZWxvclwifSx7XCJuYW1lXCI6XCLQmNCS0KItMlwiLFwiZnVsbE5hbWVcIjpcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXCJ0eXBlXCI6XCJiYWNoZWxvclwifSx7XCJuYW1lXCI6XCLQmNCS0KItM1wiLFwiZnVsbE5hbWVcIjpcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXCJ0eXBlXCI6XCJiYWNoZWxvclwifSx7XCJuYW1lXCI6XCLQn9Cg0JggKNC80LMpXCIsXCJmdWxsTmFtZVwiOlwiMDkuMDQuMDQgwqvQn9GA0L7Qs9GA0LDQvNC80L3QsNGPINC40L3QttC10L3QtdGA0LjRj8K7XCIsXCJwcm9maWxlXCI6XCLCq9Cf0YDQvtC10LrRgtC40YDQvtCy0LDQvdC40LUg0L/RgNC+0LPRgNCw0LzQvNC90L4t0LjQvdGE0L7RgNC80LDRhtC40L7QvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFwidHlwZVwiOlwibWFzdGVyXCJ9LHtcIm5hbWVcIjpcItCY0JLQoi0xICjQvNCzKVwiLFwiZnVsbE5hbWVcIjpcIjA5LjA0LjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0JrQvtC80L/RjNGO0YLQtdGA0L3Ri9C5INCw0L3QsNC70LjQtyDQuCDQuNC90YLQtdGA0L/RgNC10YLQsNGG0LjRjyDQtNCw0L3QvdGL0YXCu1wiLFwidHlwZVwiOlwibWFzdGVyXCJ9LHtcIm5hbWVcIjpcItCY0JLQoi0yICjQvNCzKVwiLFwiZnVsbE5hbWVcIjpcIjA5LjA0LjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0JjQvdGE0L7RgNC80LDRhtC40L7QvdC90L7QtSDQuCDQv9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90YvRhSDRgdC40YHRgtC10LzCu1wiLFwidHlwZVwiOlwibWFzdGVyXCJ9LHtcIm5hbWVcIjpcItCR0JDQoVwiLFwiZnVsbE5hbWVcIjpcIjA5LjA0LjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0JjQvdGE0L7RgNC80LDRhtC40L7QvdC90L7QtSDQuCDQv9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90YvRhSDRgdC40YHRgtC10LzCu1wiLFwidHlwZVwiOlwiYmFjaGVsb3JcIn1dXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvYXNzZXRzL2pzb24vZGF0YS5qc29uXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3Mvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUN0WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQWJBO0FBZUE7QUFqQkE7QUF1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBR0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVZBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVkE7QUFZQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBYUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFmQTtBQWlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ2owQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQUNBO0FBV0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBT0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUN2eUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7OztBIiwic291cmNlUm9vdCI6IiJ9
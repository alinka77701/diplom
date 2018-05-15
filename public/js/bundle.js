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
  await this.View.readTextFile("/js/assets/json/data.json", function (text) {
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
  if (educationLevel === "bachelor") {
    educationLevel = "Бакалавриат";
  } else {
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
  if (isNaN(x) || isNaN(n)) {
    return false;
  }
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
      if (selectedGroups[j] === groupName) {
        teachers.push({
          "teacher": teacher,
          "groupName": groupName
        });
      }
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
      if (selectedGroups[j] === groupName) {
        additional_info.push({
          "groupName": groupName,
          "supervisor": supervisor,
          "good_stud_num": good_students_number,
          "teacher_number": teacher_number
        });
      }
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
  }.bind(this);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDNiMThhZTI2ZjQ5NDAyZWM4YmJlIiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vL2NvbmZpZy9yZWxfY29uZmlnLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1jb2xvcnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWljb25zLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1yZXNwb25zaXZlLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvanMvYXNzZXRzL2pzb24vZGF0YS5qc29uIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzYjE4YWUyNmY0OTQwMmVjOGJiZSIsImNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlICgnLi9Db250cm9sbGVyLmpzJyk7XHJcblxyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzJyk7XHJcbnJlcXVpcmUoJy4vbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcycpO1xyXG5yZXF1aXJlKCcuL2Fzc2V0cy9qc29uL2RhdGEuanNvbicpO1xyXG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcclxuXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gIG5ldyBDb250cm9sbGVyKCk7XHJcbn0pO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvbWFpbi5qcyIsImNvbnN0IFZpZXcgPSByZXF1aXJlKCcuL1ZpZXcuanMnKTtcclxuY29uc3QgTW9kZWwgPSByZXF1aXJlKCcuL01vZGVsLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBDb250cm9sbGVyKCkge1xyXG4gIHRoaXMuVmlldyA9IG5ldyBWaWV3KCk7XHJcbiAgdGhpcy5Nb2RlbCA9IG5ldyBNb2RlbCgpO1xyXG4gIHRoaXMuaW5pdCgpO1xyXG59XHJcblxyXG5jb25zdCBBUFBST1ZFRCA9IDE7XHJcbmNvbnN0IFJFSkVDVEVEID0gMjtcclxuQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkZXIoKTtcclxuICAvLyBhd2FpdCB0aGlzLk1vZGVsLmluaXQoKTtcclxuICBhd2FpdCB0aGlzLnNldFllYXJzKCk7XHJcbiAgdGhpcy5WaWV3Lm9uQ2xpY2tOZXh0U3RlcERpc3BsYXlHcm91cHNUcmVlVmlldyA9IHRoaXMuZGlzcGxheUdyb3Vwcy5iaW5kKFxyXG4gICAgICB0aGlzKTtcclxuICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZVByYWN0aWNlID0gdGhpcy5nb1RvUHJhY3RpY2VDcmVhdGlvbi5iaW5kKHRoaXMpO1xyXG4gIHRoaXMuVmlldy5vbkNsaWNrQWRkUHJhY3RpY2UgPSB0aGlzLmNyZWF0ZVByYWN0aWNlLmJpbmQodGhpcyk7XHJcbiAgdGhpcy5WaWV3Lm9uQ2xpY2tUb09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gdGhpcy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24uYmluZChcclxuICAgICAgdGhpcyk7XHJcbiAgdGhpcy5WaWV3Lm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbiA9IHRoaXMuZ29Ub1N0dWRlbnRzU2VjdGlvbi5iaW5kKHRoaXMpO1xyXG4gIHRoaXMuVmlldy5vbkNsaWNrRmluaXNoQnRuID0gdGhpcy5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0LmJpbmQodGhpcyk7XHJcbiAgdGhpcy5WaWV3Lm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rID0gdGhpcy5yZW5kZXJEYXRhSW5UYWJsZS5iaW5kKHRoaXMpO1xyXG4gIHRoaXMuVmlldy5vbkNsaWNrWWVhcnNBcnJheSA9IHRoaXMuc2V0R3JvdXBzVHJlZVZpZXcuYmluZCh0aGlzKTtcclxuICB0aGlzLlZpZXcub25DbGlja0dldE9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldE9yZ2FuaXNhdGlvbnMuYmluZCh0aGlzKTtcclxuICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbiA9IHRoaXMudXBkYXRlVHJlZVZpZXcuYmluZCh0aGlzKTtcclxuICB0aGlzLlZpZXcub25DbGlja0Rpc3BsYXlJbmZvQWJvdXRPcmcgPSB0aGlzLmRpc3BsYXlJbmZvQWJvdXRPcmcuYmluZCh0aGlzKTtcclxuICB0aGlzLlZpZXcub25DbGlja0Rpc3BsYXlPcmdhbmlzYXRpb25zID0gdGhpcy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24uYmluZChcclxuICAgICAgdGhpcyk7XHJcbiAgdGhpcy5WaWV3Lm9uQ2xpY2tFZGl0T3JnYW5pc2F0aW9uID0gdGhpcy5zaG93RGlhbG9nRWRpdE9yZ2FuaXNhdGlvbi5iaW5kKFxyXG4gICAgICB0aGlzKTtcclxuICB0aGlzLlZpZXcub25DbGlja1VwZGF0ZU9yZ2FuaXNhdGlvbiA9IHRoaXMudXBkYXRlT3JnYW5pc2F0aW9uLmJpbmQodGhpcyk7XHJcbiAgdGhpcy5WaWV3Lm9uQ2xpY2tBcHByb3ZlU3R1ZGVudCA9IHRoaXMuY2hhbmdlU3R1ZGVudFN0YXR1cy5iaW5kKHRoaXMpO1xyXG4gIHRoaXMuVmlldy5vbkNsaWNrUmVqZWN0U3R1ZGVudCA9IHRoaXMuY2hhbmdlU3R1ZGVudFN0YXR1cy5iaW5kKHRoaXMpO1xyXG4gIHRoaXMuVmlldy5vbkNsaWNrQWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZyA9IHRoaXMuYWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uU2hvd0RpYWxvZy5iaW5kKFxyXG4gICAgICB0aGlzKTtcclxuICB0aGlzLlZpZXcub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbiA9IHRoaXMuYWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uLmJpbmQoXHJcbiAgICAgIHRoaXMpO1xyXG4gIHRoaXMuVmlldy5vbkNsaWNrU2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQgPSB0aGlzLnNob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50LmJpbmQoXHJcbiAgICAgIHRoaXMpO1xyXG4gIHRoaXMuVmlldy5vbkNsaWNrR2VuZXJhdGVEb2N1bWVudCA9IHRoaXMuZ2VuZXJhdGVEb2N1bWVudC5iaW5kKFxyXG4gICAgICB0aGlzKTtcclxuICB0aGlzLlZpZXcub25DaGFuZ2VUeXBlRG9jdW1lbnQgPSB0aGlzLmluaXREaWFsb2cuYmluZChcclxuICAgICAgdGhpcyk7XHJcbiAgdGhpcy5WaWV3LmluaXQoKTtcclxuICBhd2FpdCB0aGlzLk1vZGVsLmdldFN0dWRlbnRzRnJvbUxEQVAoKTtcclxuICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkZXIoKTtcclxufTtcclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PUdFTkVSQVRFIERPQ1VNRU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdERpYWxvZyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHlwZV9kb2N1bWVudCA9IHRoaXMuVmlldy5nZXRTZWxlY3RWYWx1ZShcImdkdHlwZURvY3VtZW50XCIpO1xyXG4gIGxldCBpc09yZGVyID0gZmFsc2U7XHJcbiAgaWYgKHR5cGVfZG9jdW1lbnQgPT09IFwi0J/RgNC40LrQsNC3XCIpIHtcclxuICAgIGlzT3JkZXIgPSB0cnVlO1xyXG4gICAgYXdhaXQgdGhpcy5jcmVhdGVJbnB1dHMoaXNPcmRlcik7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgaXNPcmRlciA9IGZhbHNlO1xyXG4gICAgYXdhaXQgdGhpcy5jcmVhdGVJbnB1dHMoaXNPcmRlcik7XHJcbiAgfVxyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuY3JlYXRlSW5wdXRzID0gYXN5bmMgZnVuY3Rpb24gKGlzT3JkZXIpIHtcclxuICBsZXQgc2VsZWN0ZWRHcm91cHMgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRHcm91cHMoKTtcclxuICBpZiAoaXNPcmRlcikgey8v0L/RgNC40LrQsNC3XHJcbiAgICBsZXQgYmxvY2sgPSB0aGlzLlZpZXcuZ2V0RWxlbUJ5SWQoXCJncm91cHMtcmVwb3J0LWJsb2NrXCIpO1xyXG4gICAgdGhpcy5WaWV3LnJlbW92ZUNoaWxkcmVuKGJsb2NrKTtcclxuICAgIHRoaXMuVmlldy5jaGFuZ2VEaXNwbGF5KFwicmVwb3J0LWJsb2NrXCIsIFwibm9uZVwiKTtcclxuICAgIHRoaXMuVmlldy5jaGFuZ2VEaXNwbGF5KFwib3JkZXItYmxvY2tcIiwgXCJibG9ja1wiKTtcclxuICAgIHRoaXMuVmlldy5jcmVhdGVJbnB1dHNPcmRlcihzZWxlY3RlZEdyb3Vwcyk7XHJcbiAgICB0aGlzLlZpZXcuY2hhbmdlSW5uZXJIdG1sKFwidHlwZURvY3VtZW50XCIsIFwi0L/RgNC40LrQsNC30LBcIik7XHJcbiAgfVxyXG4gIGVsc2Ugey8v0L7RgtGH0LXRglxyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgbGV0IGJsb2NrID0gdGhpcy5WaWV3LmdldEVsZW1CeUlkKFwib3JkZXItYmxvY2tcIik7XHJcbiAgICB0aGlzLlZpZXcucmVtb3ZlQ2hpbGRyZW4oYmxvY2spO1xyXG4gICAgdGhpcy5WaWV3LmNyZWF0ZUlucHV0c1JlcG9ydChzZWxlY3RlZEdyb3Vwcyk7XHJcbiAgICB0aGlzLlZpZXcuY2hhbmdlRGlzcGxheShcInJlcG9ydC1ibG9ja1wiLCBcImJsb2NrXCIpO1xyXG4gICAgdGhpcy5WaWV3LmNoYW5nZURpc3BsYXkoXCJvcmRlci1ibG9ja1wiLCBcIm5vbmVcIik7XHJcbiAgICB0aGlzLlZpZXcuY2hhbmdlSW5uZXJIdG1sKFwidHlwZURvY3VtZW50XCIsIFwi0L7RgtGH0LXRgtCwXCIpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbnNCeVByYWN0aWNlSWQocHJhY3RpY2UpO1xyXG4gICAgdGhpcy5WaWV3LmZpbGxEaWFsb2cocHJhY3RpY2UsIG9yZ2FuaXNhdGlvbnMpO1xyXG4gIH1cclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnNob3dEaWFsb2dHZW5lcmF0ZURvY3VtZW50ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xyXG4gIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XHJcbiAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgbGV0IGdyb3Vwc1ByYWN0aWNlUGFydGljaXBhbnRzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRHcm91cHNCeVByYWN0aWNlSWQoXHJcbiAgICAgICAgcHJhY3RpY2UpO1xyXG4gICAgaWYgKGdyb3Vwc1ByYWN0aWNlUGFydGljaXBhbnRzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICB0aGlzLlZpZXcuZGlhbG9nT3BlbihcIiNkaWFsb2dHZW5lcmF0ZVJlcG9ydFwiKTtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBhbGVydChcclxuICAgICAgICBcItCf0YDQsNC60YLQutC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIhINCU0LvRjyDQs9C10L3QtdGA0LDRhtC40Lgg0LTQvtC60YPQvNC10L3RgtCwINC/0YDQsNC60YLQuNC60LAg0LTQu9GPINCy0YvQsdGA0LDQvdC90YvRhSDQs9GA0YPQv9C/INC00L7Qu9C20L3QsCDRgdGD0YnQtdGB0YLQstC+0LLQsNGC0YwuXCIpO1xyXG4gIH1cclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdlbmVyYXRlRG9jdW1lbnQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGQ7XHJcbiAgYXdhaXQgdGhpcy5WaWV3LnJlYWRUZXh0RmlsZShcIi9qcy9hc3NldHMvanNvbi9kYXRhLmpzb25cIiwgZnVuY3Rpb24gKHRleHQpIHtcclxuICAgIGQgPSBKU09OLnBhcnNlKHRleHQpO1xyXG4gICAgY29uc29sZS5sb2coZCk7XHJcbiAgICByZXR1cm4gZDtcclxuICB9KTtcclxuXHJcbiAgbGV0IHNlbGVjdGVkR3JvdXBzID0gdGhpcy5WaWV3LmdldFNlbGVjdGVkR3JvdXBzKCk7XHJcbiAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XHJcbiAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICBsZXQgdHlwZV9kb2N1bWVudCA9IHRoaXMuVmlldy5nZXRTZWxlY3RWYWx1ZShcImdkdHlwZURvY3VtZW50XCIpO1xyXG4gIGxldCBkb2N1bWVudHMgPSAwLCBkYXRhID0gMDtcclxuXHJcbiAgaWYgKHR5cGVfZG9jdW1lbnQgPT09IFwi0J/RgNC40LrQsNC3XCIpIHtcclxuICAgIGRhdGEgPSBhd2FpdCB0aGlzLmdldFByZWZlcmVuY2VzU3R1ZGVudHNPcmdhbmlzYXRpb25zKCk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uc0J5UHJhY3RpY2VJZChwcmFjdGljZSk7XHJcbiAgICBkb2N1bWVudHMgPSB0aGlzLlZpZXcuZ2V0SW5mb3JtYXRpb25Gb3JEb2N1bWVudE9yZGVyKHByYWN0aWNlLFxyXG4gICAgICAgIHNlbGVjdGVkR3JvdXBzLCB0aGlzLk1vZGVsLkdyb3VwcywgZGF0YSwgb3JnYW5pc2F0aW9ucyk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbnNCeVByYWN0aWNlSWQocHJhY3RpY2UpO1xyXG4gICAgZG9jdW1lbnRzID0gdGhpcy5WaWV3LmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnRSZXBvcnQocHJhY3RpY2UsXHJcbiAgICAgICAgc2VsZWN0ZWRHcm91cHMsIHRoaXMuTW9kZWwuR3JvdXBzLCBvcmdhbmlzYXRpb25zKTtcclxuXHJcbiAgfVxyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRvY3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5nZW5lcmF0ZURvY3VtZW50KGRvY3VtZW50c1tpXSwgdHlwZV9kb2N1bWVudCxcclxuICAgICAgICBpbmZvX2Fib3V0X3ByYWN0aWNlLnR5cGVQcmFjdGljZSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09UFJBQ1RJQ0UgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9QcmFjdGljZUNyZWF0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuVmlldy5zZWxlY3RlZFllYXIgPSB0aGlzLk1vZGVsLmdldEN1cnJlbnRZZWFyKCk7XHJcbiAgdGhpcy5WaWV3LmNsZWFyUHJhY3RpY2VTZWN0aW9uKCk7XHJcbiAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvblNlbGVjdCh0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgdGhpcy5WaWV3LmdvVG9QcmFjdGljZUNyZWF0aW9uKCk7XHJcbiAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpc3BsYXlHcm91cHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5WaWV3LmRpc3BsYXlHcm91cHMoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5WaWV3LmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVRyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGF3YWl0IHRoaXMuY3JlYXRlTmV3T3JnYW5pc2F0aW9uKCk7XHJcbiAgYXdhaXQgdGhpcy51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuY3JlYXRlUHJhY3RpY2UgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XHJcbiAgbGV0IHByYWN0aWNlID0gdGhpcy5WaWV3LlByYWN0aWNlO1xyXG4gIGxldCBncm91cHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldERldGVybWluZWRHcm91cHMocHJhY3RpY2UuZ3JvdXBzKTtcclxuICBwcmFjdGljZS5ncm91cHMgPSBncm91cHM7XHJcbiAgYXdhaXQgdGhpcy5Nb2RlbC5jcmVhdGVQcmFjdGljZShwcmFjdGljZSk7XHJcbiAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XHJcbiAgYXdhaXQgIHRoaXMuc2V0WWVhcnMoKTtcclxuICB0aGlzLmdvVG9TdHVkZW50c1NlY3Rpb24oKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0eXBlc09yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0VHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICB0aGlzLlZpZXcuY2xlYXJUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvbih0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgbGV0IG9yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbnMoKTtcclxuICB0aGlzLlZpZXcuc2V0T3JnYW5pc2F0aW9uc0luVHJlZVZpZXcob3JnYW5pc2F0aW9ucywgdHlwZXNPcmdhbmlzYXRpb24pO1xyXG4gIHJldHVybiB0eXBlc09yZ2FuaXNhdGlvbjtcclxufTtcclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNUVURFTlRTIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldFllYXJzID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCB5ZWFycyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2VZZWFycygpO1xyXG4gIHRoaXMuVmlldy5zZXRZZWFyc0FycmF5KHllYXJzKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9TdHVkZW50c1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5WaWV3LmdvVG9TdHVkZW50c1NlY3Rpb24oKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlckdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGF3YWl0IHRoaXMuTW9kZWwuZGlzdHJpYnV0ZUdyb3Vwc0J5Q291cnNlcyh0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyKTtcclxuICBhd2FpdCB0aGlzLlZpZXcuY2xlYXJHcm91cHNUcmVlVmlldygpO1xyXG4gIGF3YWl0IHRoaXMuVmlldy51cGRhdGVHcm91cHNUcmVlVmlldyh0aGlzLk1vZGVsLkNvdXJzZXMsIHRoaXMuTW9kZWwuR3JvdXBzKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldEdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgdGhpcy5WaWV3LnVwZGF0ZVllYXIoZXZlbnQpO1xyXG4gIGlmICh0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID09PSBcIitcIikge1xyXG4gICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcclxuICAgIGF3YWl0IHRoaXMuZ29Ub1ByYWN0aWNlQ3JlYXRpb24oKTtcclxuICB9XHJcbiAgYXdhaXQgdGhpcy5yZW5kZXJHcm91cHNUcmVlVmlldygpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0UHJlZmVyZW5jZXNTdHVkZW50c09yZ2FuaXNhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHNlbGVjdGVkR3JvdXBzID0gdGhpcy5WaWV3LmdldFNlbGVjdGVkR3JvdXBzKCk7XHJcbiAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XHJcbiAgbGV0IHByYWN0aWNlID0gW10sIGRhdGEgPSAwLCBncm91cHNPYmplY3RzID0gW107XHJcbiAgaWYgKHNlbGVjdGVkR3JvdXBzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuTW9kZWwuR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgaWYgKHRoaXMuTW9kZWwuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgICAgIGdyb3Vwc09iamVjdHMucHVzaCh0aGlzLk1vZGVsLkdyb3Vwc1tpXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBncm91cHNQcmFjdGljZVBhcnRpY2lwYW50cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0R3JvdXBzQnlQcmFjdGljZUlkKFxyXG4gICAgICAgICAgcHJhY3RpY2UpO1xyXG4gICAgICBzZWxlY3RlZEdyb3VwcyA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc1ByYWN0aWNlUGFydGljaXBhbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHNPYmplY3RzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICBpZiAoK2dyb3Vwc1ByYWN0aWNlUGFydGljaXBhbnRzW2ldLnVpZF9ncm91cFxyXG4gICAgICAgICAgICAgID09PSBncm91cHNPYmplY3RzW2pdLnVpZF9MREFQKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdGVkR3JvdXBzLnB1c2goZ3JvdXBzT2JqZWN0c1tqXS5uYW1lKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGxldCByZXF1ZXN0c19vcmdhbmlzYXRpb25zO1xyXG4gICAgICAgIGxldCByZXF1ZXN0cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdHMocHJhY3RpY2UsIGdyb3Vwc09iamVjdHMpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuTW9kZWwuYXNzb3NpYXRlUmVxdWVzdFRvU3R1ZGVudChyZXF1ZXN0cywgc2VsZWN0ZWRHcm91cHMpO1xyXG4gICAgICAgIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzT3JnYW5pc2F0aW9ucyhcclxuICAgICAgICAgICAgc2VsZWN0ZWRHcm91cHMpO1xyXG4gICAgICAgIGRhdGEgPSBhd2FpdCB0aGlzLk1vZGVsLmdldERhdGEoc2VsZWN0ZWRHcm91cHMsIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMpO1xyXG5cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZGF0YTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlckRhdGFJblRhYmxlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRlcigpO1xyXG4gIGxldCBwcmFjdGljZSA9IFtdLCBkYXRhID0gMDtcclxuICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRVc2VySW5mb0Fib3V0UHJhY3RpY2UoKTtcclxuICBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XHJcbiAgZGF0YSA9IGF3YWl0IHRoaXMuZ2V0UHJlZmVyZW5jZXNTdHVkZW50c09yZ2FuaXNhdGlvbnMoKTtcclxuICBpZiAoZGF0YSA9PT0gMCkge1xyXG4gICAgcHJhY3RpY2UgPSBbXTtcclxuICAgIHRoaXMuVmlldy5yZW5kZXJUYWJsZShkYXRhKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLlZpZXcucmVuZGVyVGFibGUoZGF0YSk7XHJcbiAgfVxyXG4gIHRoaXMuVmlldy5jb2xvclRhYmxlKGRhdGEpO1xyXG4gIHRoaXMuVmlldy5yZW5kZXJJbmZvKHByYWN0aWNlKTtcclxuICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkZXIoKTtcclxufTtcclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PU9SR0FOSVNBVElPTlMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkZXIoKTtcclxuICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xyXG4gIGxldCB0eXBlc09yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0VHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICB0aGlzLlZpZXcuc2V0VHlwZXNPcmdhbmlzYXRpb25TZWxlY3QodHlwZXNPcmdhbmlzYXRpb24pO1xyXG4gIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zTGlzdChvcmdhbmlzYXRpb25zLCBcImFsbE9yZ2FuaXNhdGlvbnNMaXN0XCIpO1xyXG4gIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRlcigpO1xyXG4gIHRoaXMuVmlldy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24oKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdldEFwcHJvdmVkQW5kTm9uQXBwcm92ZWRTdHVkZW50cyA9IGFzeW5jIGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcclxuICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UoKTtcclxuICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gIGxldCBhcHByb3ZlZF9zdHVkZW50X2NvdW50ID0gMCwgbm9uX2FwcHJvdmVkX3N0dWRlbnRfY291bnQgPSAwO1xyXG4gIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgIGFwcHJvdmVkX3N0dWRlbnRfY291bnQgPSBhd2FpdCB0aGlzLnJlbmRlclN0dWRlbnRMaXN0KG9yZ2FuaXNhdGlvbixcclxuICAgICAgICBwcmFjdGljZSwgXCJhcHByb3ZlZFN0dWRlbnRzXCIpO1xyXG4gICAgbm9uX2FwcHJvdmVkX3N0dWRlbnRfY291bnQgPSBhd2FpdCB0aGlzLnJlbmRlclN0dWRlbnRMaXN0KG9yZ2FuaXNhdGlvbixcclxuICAgICAgICBwcmFjdGljZSwgXCJub25BcHByb3ZlZFN0dWRlbnRzXCIpO1xyXG4gIH1cclxuICB0aGlzLlZpZXcudXBkYXRlT3JnYW5pc2F0aW9uVGl0bGUob3JnYW5pc2F0aW9uLm5hbWUsIGFwcHJvdmVkX3N0dWRlbnRfY291bnQsXHJcbiAgICAgIG5vbl9hcHByb3ZlZF9zdHVkZW50X2NvdW50KTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpc3BsYXlJbmZvQWJvdXRPcmcgPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICBsZXQgbmFtZU9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZE9yZ2FuaXNhdGlvbihldmVudCk7XHJcbiAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlOYW1lKG5hbWVPcmdhbmlzYXRpb24pO1xyXG4gIGF3YWl0IHRoaXMuZ2V0QXBwcm92ZWRBbmROb25BcHByb3ZlZFN0dWRlbnRzKG9yZ2FuaXNhdGlvbik7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZW5kZXJTdHVkZW50TGlzdCA9IGFzeW5jIGZ1bmN0aW9uIChvcmdhbmlzYXRpb24sIHByYWN0aWNlLFxyXG4gICAgaWRMaXN0KSB7XHJcbiAgbGV0IHN0YXR1cztcclxuICBpZiAoaWRMaXN0ID09PSBcImFwcHJvdmVkU3R1ZGVudHNcIikge1xyXG4gICAgc3RhdHVzID0gdHJ1ZTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBzdGF0dXMgPSBmYWxzZTtcclxuICB9XHJcbiAgbGV0IHN0dWRlbnRzSW5mbyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdHNCeU9yZ2FuaXNhdGlvbk5hbWUoXHJcbiAgICAgIG9yZ2FuaXNhdGlvbiwgcHJhY3RpY2UsIHN0YXR1cyk7XHJcbiAgbGV0IHN0dWRlbnRzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRTdHVkZW50c0J5VUlEKHN0dWRlbnRzSW5mbyk7XHJcbiAgdGhpcy5WaWV3LnVwZGF0ZVN0dWRlbnRzTGlzdFZpZXcoc3R1ZGVudHMsIGlkTGlzdCk7XHJcbiAgcmV0dXJuIHN0dWRlbnRzLmxlbmd0aDtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0Q29uZmlndXJhdGlvblByYWN0aWNlKCk7XHJcbiAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICBsZXQgb3JnYW5pc2F0aW9ucyA9IDA7XHJcbiAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uc0J5UHJhY3RpY2VJZChwcmFjdGljZSk7XHJcbiAgfVxyXG4gIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zTGlzdChvcmdhbmlzYXRpb25zLCBcIm9yZ2FuaXNhdGlvbkxpc3RcIik7XHJcbiAgdGhpcy5WaWV3LnJlbmRlck9yZ2FuaXNhdGlvblNlY3Rpb24ocHJhY3RpY2UpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldE5hbWVPcmdhbmlzYXRpb25CeVRpdGxlKCk7XHJcbiAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlOYW1lKG5hbWVPcmdhbmlzYXRpb24pO1xyXG4gIHJldHVybiBvcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5jaGFuZ2VTdHVkZW50U3RhdHVzID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZGVyKCk7XHJcbiAgbGV0IHN0dWRlbnQgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRTdHVkZW50KGV2ZW50KTtcclxuICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RPcmdhbmlzYXRpb24oc3R1ZGVudCk7XHJcbiAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0KHN0dWRlbnQpO1xyXG5cclxuICBzdHVkZW50WydpZF9zdGF0dXMnXSA9IFJFSkVDVEVEO1xyXG4gIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlUmVxdWVzdE9yZ2FuaXNhdGlvbkJ5UmVxdWVzdChzdHVkZW50KTtcclxuXHJcbiAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuZ2V0T3JnYW5pc2F0aW9uKCk7XHJcbiAgYXdhaXQgdGhpcy5nZXRBcHByb3ZlZEFuZE5vbkFwcHJvdmVkU3R1ZGVudHMob3JnYW5pc2F0aW9uKTtcclxuICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkZXIoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZU9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgb3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldEluZm9OZXdPcmdhbmlzYXRpb24oKTtcclxuICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZU9yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb24pO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuY3JlYXRlTmV3T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCBvcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0SW5mb05ld09yZ2FuaXNhdGlvbigpO1xyXG4gIGF3YWl0IHRoaXMuTW9kZWwuY3JlYXRlT3JnYW5pc2F0aW9uKG9yZ2FuaXNhdGlvbik7XHJcbn1cclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmFkZFN0dWRlbnRUb09yZ2FuaXNhdGlvblNob3dEaWFsb2cgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLlZpZXcuZ2V0Q29uZmlndXJhdGlvblByYWN0aWNlKCk7XHJcbiAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICBsZXQgdWlkc0dyb3VwcyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0R3JvdXBzQnlQcmFjdGljZUlkKHByYWN0aWNlKTtcclxuICBsZXQgbmFtZXNHcm91cHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldEdyb3Vwc05hbWVCeUdyb3Vwc1VJRCh1aWRzR3JvdXBzKTtcclxuICB0aGlzLlZpZXcuZGlhbG9nRW5hYmxlQ2hlY2tib3hlcyhuYW1lc0dyb3VwcyxcclxuICAgICAgXCJncm91cC10cmVldmlldy10YWJjb250cm9sMS1kaWFsb2dBZGQtYmFjaGVsb3JcIik7XHJcbiAgdGhpcy5WaWV3LmRpYWxvZ0VuYWJsZUNoZWNrYm94ZXMobmFtZXNHcm91cHMsXHJcbiAgICAgIFwiZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItZGlhbG9nQWRkLW1hc3RlclwiKTtcclxuICB0aGlzLlZpZXcuZGlhbG9nT3BlbihcIiNkaWFsb2dBZGRTdHVkZW50XCIpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuYWRkU3R1ZGVudFRvT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCBzdHVkZW50cyA9IGF3YWl0IHRoaXMuVmlldy5nZXRTZWxlY3RlZFN0dWRlbnRzKGV2ZW50KTtcclxuICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UoKTtcclxuICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlKGluZm9fYWJvdXRfcHJhY3RpY2UpO1xyXG4gIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldE5hbWVPcmdhbmlzYXRpb25JblRyZWV2aWV3KFxyXG4gICAgICBcIm9yZ2FuaXNhdGlvbkxpc3RcIik7XHJcbiAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlOYW1lKG5hbWVPcmdhbmlzYXRpb24pO1xyXG4gIGxldCByZXF1ZXN0cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdEJ5U3R1ZGVudFVJRFMocHJhY3RpY2UsXHJcbiAgICAgIHN0dWRlbnRzKTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0dWRlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJlcXVlc3RzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGlmIChzdHVkZW50c1tpXS51aWQgPT09IHJlcXVlc3RzW2pdLnVpZF9zdHVkZW50KSB7XHJcbiAgICAgICAgc3R1ZGVudHNbaV1bJ2lkX3JlcXVlc3QnXSA9IHJlcXVlc3RzW2pdLmlkX3JlcXVlc3Q7XHJcbiAgICAgICAgc3R1ZGVudHNbaV1bJ2lkX3ByYWN0aWNlJ10gPSBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgICAgICBzdHVkZW50c1tpXVsnaWRfb3JnYW5pc2F0aW9uJ10gPSBvcmdhbmlzYXRpb24uaWQ7XHJcbiAgICAgICAgc3R1ZGVudHNbaV1bJ2lkX3N0YXR1cyddID0gQVBQUk9WRUQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0c09yZ2FuaXNhdGlvbihzdHVkZW50cyk7XHJcbiAgYXdhaXQgdGhpcy5Nb2RlbC51cGRhdGVSZXF1ZXN0cyhzdHVkZW50cyk7XHJcblxyXG4gIGZvciAobGV0IGogPSAwOyBqIDwgc3R1ZGVudHMubGVuZ3RoOyBqKyspIHtcclxuICAgIHN0dWRlbnRzW2pdWydpZF9zdGF0dXMnXSA9IFJFSkVDVEVEO1xyXG4gIH1cclxuICBhd2FpdCB0aGlzLk1vZGVsLnVwZGF0ZVJlcXVlc3RzT3JnYW5pc2F0aW9uQnlSZXF1ZXN0KHN0dWRlbnRzKTtcclxuICBhd2FpdCB0aGlzLmdldEFwcHJvdmVkQW5kTm9uQXBwcm92ZWRTdHVkZW50cyhvcmdhbmlzYXRpb24pO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuc2hvd0RpYWxvZ0VkaXRPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICBsZXQgaWRPcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0SWRPcmdhbmlzYXRpb24oZXZlbnQpO1xyXG4gIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbkJ5SWQoaWRPcmdhbmlzYXRpb24pO1xyXG4gIHRoaXMuVmlldy5zaG93RGlhbG9nT3JnYW5pc2F0aW9uKG9yZ2FuaXNhdGlvbik7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9Db250cm9sbGVyLmpzIiwiY29uc3QgYmFjaGVsb3JZZWFyID0gNDtcclxuY29uc3QgbWFzdGVyWWVhciA9IDY7XHJcbmxldCBzZWxlY3RlZEVsZW0gPSAwO1xyXG5cclxudmFyIFZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5pbmZvR3JvdXBzID0gbnVsbDtcclxuICAvKiB0aGlzLmluZm9Hcm91cHMgPSBbXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgXCJuYW1lXCI6IFwi0JzQntCQXCIsXHJcbiAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjAyLjAzLjAzIMKr0JzQsNGC0LXQvNCw0YLQuNGH0LXRgdC60L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INC4INCw0LTQvNC40L3QuNGB0YLRgNC40YDQvtCy0LDQvdC40LUg0LjQvdGE0L7RgNC80LDRhtC40L7QvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0KLQtdGF0L3QvtC70L7Qs9C40Y8g0L/RgNC+0LPRgNCw0LzQvNC40YDQvtCy0LDQvdC40Y/Cu1wiLFxyXG4gICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgIH0sXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgXCJuYW1lXCI6IFwi0J/QoNCYXCIsXHJcbiAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjAzLjA0IMKr0J/RgNC+0LPRgNCw0LzQvNC90LDRjyDQuNC90LbQtdC90LXRgNC40Y/Cu1wiLFxyXG4gICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0KDQsNC30YDQsNCx0L7RgtC60LAg0L/RgNC+0LPRgNCw0LzQvNC90L4t0LjQvdGE0L7RgNC80LDRhtC40L7QvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgIH0sXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgXCJuYW1lXCI6IFwi0JjQktCiLTFcIixcclxuICAgICAgICAgICBcImZ1bGxOYW1lXCI6IFwiMDkuMDMuMDEgwqvQmNC90YTQvtGA0LzQsNGC0LjQutCwINC4INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdCw0Y8g0YLQtdGF0L3QuNC60LDCu1wiLFxyXG4gICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXHJcbiAgICAgICAgICAgXCJ0eXBlXCI6IFwiYmFjaGVsb3JcIlxyXG4gICAgICAgfSxcclxuICAgICAgIHtcclxuICAgICAgICAgICBcIm5hbWVcIjogXCLQmNCS0KItMlwiLFxyXG4gICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wMy4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXHJcbiAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQn9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90L7QuSDRgtC10YXQvdC40LrQuCDQuCDQsNCy0YLQvtC80LDRgtC40LfQuNGA0L7QstCw0L3QvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcclxuICAgICAgICAgICBcInR5cGVcIjogXCJiYWNoZWxvclwiXHJcbiAgICAgICB9LFxyXG4gICAgICAge1xyXG4gICAgICAgICAgIFwibmFtZVwiOiBcItCY0JLQoi0zXCIsXHJcbiAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcclxuICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Cf0YDQvtCz0YDQsNC80LzQvdC+0LUg0L7QsdC10YHQv9C10YfQtdC90LjQtSDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QvtC5INGC0LXRhdC90LjQutC4INC4INCw0LLRgtC+0LzQsNGC0LjQt9C40YDQvtCy0LDQvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgIH0sXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgXCJuYW1lXCI6IFwi0J/QoNCYICjQvNCzKVwiLFxyXG4gICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wNC4wNCDCq9Cf0YDQvtCz0YDQsNC80LzQvdCw0Y8g0LjQvdC20LXQvdC10YDQuNGPwrtcIixcclxuICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9Cf0YDQvtC10LrRgtC40YDQvtCy0LDQvdC40LUg0L/RgNC+0LPRgNCw0LzQvNC90L4t0LjQvdGE0L7RgNC80LDRhtC40L7QvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgIFwidHlwZVwiOiBcIm1hc3RlclwiXHJcbiAgICAgICB9LFxyXG4gICAgICAge1xyXG4gICAgICAgICAgIFwibmFtZVwiOiBcItCY0JLQoi0xICjQvNCzKVwiLFxyXG4gICAgICAgICAgIFwiZnVsbE5hbWVcIjogXCIwOS4wNC4wMSDCq9CY0L3RhNC+0YDQvNCw0YLQuNC60LAg0Lgg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90LDRjyDRgtC10YXQvdC40LrQsMK7XCIsXHJcbiAgICAgICAgICAgXCJwcm9maWxlXCI6IFwiwqvQmtC+0LzQv9GM0Y7RgtC10YDQvdGL0Lkg0LDQvdCw0LvQuNC3INC4INC40L3RgtC10YDQv9GA0LXRgtCw0YbQuNGPINC00LDQvdC90YvRhcK7XCIsXHJcbiAgICAgICAgICAgXCJ0eXBlXCI6IFwibWFzdGVyXCJcclxuICAgICAgIH0sXHJcbiAgICAgICB7XHJcbiAgICAgICAgICAgXCJuYW1lXCI6IFwi0JjQktCiLTIgKNC80LMpXCIsXHJcbiAgICAgICAgICAgXCJmdWxsTmFtZVwiOiBcIjA5LjA0LjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcclxuICAgICAgICAgICBcInByb2ZpbGVcIjogXCLCq9CY0L3RhNC+0YDQvNCw0YbQuNC+0L3QvdC+0LUg0Lgg0L/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdGL0YUg0YHQuNGB0YLQtdC8wrtcIixcclxuICAgICAgICAgICBcInR5cGVcIjogXCJtYXN0ZXJcIlxyXG4gICAgICAgfSxcclxuICAgICAgIHtcclxuICAgICAgICAgICBcIm5hbWVcIjogXCLQkdCQ0KFcIixcclxuICAgICAgICAgICBcImZ1bGxOYW1lXCI6IFwiMDkuMDQuMDEgwqvQmNC90YTQvtGA0LzQsNGC0LjQutCwINC4INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdCw0Y8g0YLQtdGF0L3QuNC60LDCu1wiLFxyXG4gICAgICAgICAgIFwicHJvZmlsZVwiOiBcIsKr0JjQvdGE0L7RgNC80LDRhtC40L7QvdC90L7QtSDQuCDQv9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90YvRhSDRgdC40YHRgtC10LzCu1wiLFxyXG4gICAgICAgICAgIFwidHlwZVwiOiBcImJhY2hlbG9yXCJcclxuICAgICAgIH1cclxuICAgXTsqL1xyXG4gIHRoaXMub25DbGlja05leHRTdGVwRGlzcGxheUdyb3Vwc1RyZWVWaWV3ID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tQcmFjdGljZUNvbXBsZXRlZCA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja0FkZFByYWN0aWNlID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tUb09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbiA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrRmluaXNoQnRuID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rID0gbnVsbDtcclxuICB0aGlzLm15VGFibGUgPSAkKCcjc3R1ZGVudHNMaXN0VGFibGUnKTtcclxuICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5ID0gbnVsbDtcclxuICB0aGlzLnNlbGVjdGVkWWVhciA9IG51bGw7XHJcbiAgdGhpcy5pZFRyZWVWaWV3cyA9IFtcclxuICAgICdncm91cC10cmVldmlldy10YWJjb250cm9sMS1iYWNoZWxvcicsXHJcbiAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItbWFzdGVyJyxcclxuICAgICdncm91cHMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb24tYmFjaGVsb3InLFxyXG4gICAgJ2dyb3Vwcy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbi1tYXN0ZXInLFxyXG4gICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWRpYWxvZ0FkZC1iYWNoZWxvcicsXHJcbiAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItZGlhbG9nQWRkLW1hc3RlcidcclxuICBdO1xyXG4gIHRoaXMub25DbGlja0dldE9yZ2FuaXNhdGlvbnMgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbiA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrRGlzcGxheUluZm9BYm91dE9yZyA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrRGlzcGxheU9yZ2FuaXNhdGlvbnMgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja0VkaXRPcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gIHRoaXMub25DbGlja0FwcHJvdmVTdHVkZW50ID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tSZWplY3RTdHVkZW50ID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tVcGRhdGVPcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gIHRoaXMub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvblNob3dEaWFsb2cgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja0FkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbiA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrU2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja0dlbmVyYXRlRG9jdW1lbnQgPSBudWxsO1xyXG4gIHRoaXMub25DaGFuZ2VUeXBlRG9jdW1lbnQgPSBudWxsO1xyXG4gIHRoaXMuUHJhY3RpY2UgPSBudWxsO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLW5leHRcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tOZXh0U3RlcERpc3BsYXlHcm91cHNUcmVlVmlldyk7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkaWFsb2dQcmFjdGljZUNvbXBsZXRlU3VjY2Vzc1wiKS5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICBcIiNwcmFjdGljZUZpbmlzaGVkT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tQcmFjdGljZUNvbXBsZXRlZCk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25zU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24pO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3R1ZGVudHNTZWN0aW9uQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24pO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tZmluaXNoXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrRmluaXNoQnRuKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldEdyb3Vwc0J0bk9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrU2VsZWN0R3JvdXBCdG5Payk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25zQXJyYXlcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5KTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbnNBcnJheTFcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5KTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldE9yZ2FuaXNhdGlvbnNCdG5Pa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja0dldE9yZ2FuaXNhdGlvbnMpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlT3JnYW5pc2F0aW9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByYWN0aWNlRmluaXNoZWRPa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja0FkZFByYWN0aWNlKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3dBbGxPcmdhbmlzYXRpb25zXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrRGlzcGxheU9yZ2FuaXNhdGlvbnMpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXBkYXRlT3JnYW5pc2F0aW9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrVXBkYXRlT3JnYW5pc2F0aW9uKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZFN0dWRlbnRCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tBZGRTdHVkZW50VG9PcmdhbmlzYXRpb24pO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnRCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrU2hvd0RpYWxvZ0dlbmVyYXRlRG9jdW1lbnQpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2VuZXJhdGVEb2N1bWVudEJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja0dlbmVyYXRlRG9jdW1lbnQpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2R0eXBlRG9jdW1lbnRcIikuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJyxcclxuICAgICAgdGhpcy5vbkNoYW5nZVR5cGVEb2N1bWVudCk7XHJcblxyXG4gIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoe1xyXG4gICAgZGF0YTogdGhpcy5Hcm91cHMsXHJcbiAgICBcImxhbmd1YWdlXCI6IHtcclxuICAgICAgXCJ6ZXJvUmVjb3Jkc1wiOiBcItCi0LDQutC+0Lkg0LfQsNC/0LjRgdC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCIsXHJcbiAgICAgIFwiZW1wdHlUYWJsZVwiOiBcItCd0Lgg0L7QtNC90LAg0LjQtyDQs9GA0YPQv9C/INC90LUg0LLRi9Cx0YDQsNC90LAg0LvQuNCx0L4g0L/RgNCw0LrRgtC40LrQuCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiLFxyXG4gICAgICBcInNlYXJjaFwiOiBcItCf0L7QuNGB0Lo6XCIsXHJcbiAgICAgIFwicGFnaW5hdGVcIjoge1xyXG4gICAgICAgIFwiZmlyc3RcIjogXCLQn9C10YDQstGL0LlcIixcclxuICAgICAgICBcImxhc3RcIjogXCLQn9C+0YHQu9C10LTQvdC40LlcIixcclxuICAgICAgICBcIm5leHRcIjogXCLQktC/0LXRgNC10LRcIixcclxuICAgICAgICBcInByZXZpb3VzXCI6IFwi0J3QsNC30LDQtFwiXHJcbiAgICAgIH0sXHJcbiAgICAgIFwiaW5mb0ZpbHRlcmVkXCI6IFwiKNC40LcgX01BWF8g0YHRgtGD0LTQtdC90YLQvtCyKVwiLFxyXG4gICAgICBcImxlbmd0aE1lbnVcIjogXCLQn9C+0LrQsNC30LDRgtGMIF9NRU5VXyDQt9Cw0L/QuNGB0LXQuVwiLFxyXG4gICAgICBcImluZm9cIjogXCLQntCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INGB0YLRg9C00LXQvdGC0L7QsjogX1RPVEFMXyBcIixcclxuICAgICAgXCJpbmZvRW1wdHlcIjogXCLQktGL0LHQtdGA0LjRgtC1INCz0YDRg9C/0L/Rgy5cIlxyXG4gICAgfSxcclxuICAgIFwiY29sdW1uc1wiOiBbXHJcbiAgICAgIHtcImRhdGFcIjogXCJncm91cFwifSxcclxuICAgICAge1wiZGF0YVwiOiBcInN0dWRlbnRcIn0sXHJcbiAgICAgIHtcImRhdGFcIjogXCJvcmdhbmlzYXRpb25cIn1cclxuICAgIF1cclxuICB9KTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9TdHVkZW50c1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvcmdhbmlzYXRpb25zU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG5cclxuICBsZXQgdHJlZVZpZXdzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRyZWV2aWV3XCIpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB0cmVlVmlld3NbaV0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvcmdhbmlzYXRpb25zU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3R1ZGVudHNSZXF1ZXN0c1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhbGxPcmdhbmlzYXRpb25zTGlzdEJsb2NrXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvUHJhY3RpY2VDcmVhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ByYWN0aWNlQ3JlYXRpb25TZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcclxuICAgICAgXCJ0cnVlXCIpO1xyXG59O1xyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09UFJBQ1RJQ0UgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5WaWV3LnByb3RvdHlwZS5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCBmaW5pc2hCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLWZpbmlzaFwiKVswXTtcclxuICBmaW5pc2hCdG4uc2V0QXR0cmlidXRlKFwib25jbGlja1wiLFxyXG4gICAgICBcIm1ldHJvRGlhbG9nLm9wZW4oJyNkaWFsb2dQcmFjdGljZUNvbXBsZXRlU3VjY2VzcycpXCIpO1xyXG4gIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1Y2F0aW9uXCIpLnZhbHVlO1xyXG4gIGlmIChlZHVjYXRpb25MZXZlbCA9PT0gXCJiYWNoZWxvclwiKSB7XHJcbiAgICBlZHVjYXRpb25MZXZlbCA9IFwi0JHQsNC60LDQu9Cw0LLRgNC40LDRglwiO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVkdWNhdGlvbkxldmVsID0gXCLQnNCw0LPQuNGB0YLRgNCw0YLRg9GA0LBcIjtcclxuICB9XHJcbiAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlXCIpLnZhbHVlO1xyXG5cclxuICBsZXQgbGVjTnVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWNOdW1cIikudmFsdWU7XHJcbiAgbGV0IGZyb21EYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcm9tRGF0ZUlucHV0XCIpLnZhbHVlO1xyXG4gIGxldCBudW1XZWVrcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV4dFdlZWtzXCIpLmlubmVySFRNTDtcclxuICBsZXQgdG9EYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVJbnB1dFwiKS52YWx1ZSArICcgJyArIG51bVdlZWtzO1xyXG4gIGxldCBkZWFkbGluZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVhZGxpbmVcIikudmFsdWU7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXJtc1ByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9ICdjICcgKyBmcm9tRGF0ZVxyXG4gICAgICArICcg0L/QviAnICsgdG9EYXRlO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVhZGxpbmVQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBkZWFkbGluZTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUZXJtc1ByYWN0aWNlXCIpLmlubmVySFRNTCA9IGZyb21EYXRlXHJcbiAgICAgICsgJyAtICcgKyB0b0RhdGU7XHJcbiAgaWYgKGZyb21EYXRlID09PSBcIlwiKSB7XHJcbiAgICBmcm9tRGF0ZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZnJvbURhdGUgPSBmcm9tRGF0ZS5zdWJzdHIoOCwgNCkgKyAnLScgKyBmcm9tRGF0ZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICArIGZyb21EYXRlLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICB9XHJcbiAgaWYgKHRvRGF0ZSA9PT0gXCJcIikge1xyXG4gICAgdG9EYXRlID0gXCIyMDAwLTAxLTAxIDIxOjAwOjAwLjAwMCArMDA6MDBcIjtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0b0RhdGUgPSB0b0RhdGUuc3Vic3RyKDgsIDQpICsgJy0nICsgdG9EYXRlLnN1YnN0cig0LCAyKSArICctJ1xyXG4gICAgICAgICsgdG9EYXRlLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICB9XHJcbiAgaWYgKGRlYWRsaW5lID09PSBcIlwiKSB7XHJcbiAgICBkZWFkbGluZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZGVhZGxpbmUgPSBkZWFkbGluZS5zdWJzdHIoOCwgNCkgKyAnLScgKyBkZWFkbGluZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICArIGRlYWRsaW5lLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICB9XHJcblxyXG4gIGxldCB0cmVlVmlldyA9IG51bGw7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwicHJhY3RpY2VcIikgIT09IC0xXHJcbiAgICAgICAgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheVxyXG4gICAgICAgID09PSBcImJsb2NrXCIpIHtcclxuICAgICAgdHJlZVZpZXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKTtcclxuICAgIH1cclxuICB9XHJcbiAgbGV0IGFyckdyb3VwcyA9IHRoaXMuZ2V0U2VsZWN0ZWRHcm91cHModHJlZVZpZXcpO1xyXG4gIGxldCBhcnJPcmdhbmlzYXRpb25zID0gdGhpcy5nZXRTZWxlY3RlZEdyb3VwcyhcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uXCIpKTtcclxuXHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eXBlUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImVkdWNhdGlvbmFsTGV2ZWxEaWFsb2dcIikuaW5uZXJIVE1MID0gZWR1Y2F0aW9uTGV2ZWw7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncm91cHNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJHcm91cHM7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIFwib3JnYW5pc2F0aW9uc1ByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGFyck9yZ2FuaXNhdGlvbnM7XHJcblxyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2VcclxuICAgICAgKyBcIiDQv9GA0LDQutGC0LjQutCwXCI7XHJcblxyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVjTnVtRGlhbG9nXCIpLmlubmVySFRNTCA9IGxlY051bTtcclxuICB0aGlzLlByYWN0aWNlID0ge1xyXG4gICAgJ3R5cGVQcmFjdGljZSc6IHR5cGVQcmFjdGljZSxcclxuICAgICdzdGFydERhdGVQcmFjdGljZSc6IGZyb21EYXRlLFxyXG4gICAgJ2VuZERhdGVQcmFjdGljZSc6IHRvRGF0ZSxcclxuICAgICdkZWFkbGluZVByYWN0aWNlJzogZGVhZGxpbmUsXHJcbiAgICAnbGVjTnVtJzogbGVjTnVtLFxyXG4gICAgJ2VkdUxldmVsJzogZWR1Y2F0aW9uTGV2ZWwsXHJcbiAgICAnb3JnYW5pc2F0aW9ucyc6IGFyck9yZ2FuaXNhdGlvbnMsXHJcbiAgICAnZ3JvdXBzJzogYXJyR3JvdXBzLFxyXG4gICAgJ3llYXInOiB0aGlzLnNlbGVjdGVkWWVhclxyXG4gIH07XHJcblxyXG4gIHJldHVybiB0aGlzLlByYWN0aWNlO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gcm91bmRQbHVzKHgsIG4pIHsgLy94IC0g0YfQuNGB0LvQviwgbiAtINC60L7Qu9C40YfQtdGB0YLQstC+INC30L3QsNC60L7QslxyXG4gIGlmIChpc05hTih4KSB8fCBpc05hTihuKSkge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICB2YXIgbSA9IE1hdGgucG93KDEwLCBuKTtcclxuICByZXR1cm4gTWF0aC5yb3VuZCh4ICogbSkgLyBtO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRXZWVrcyhmaXJzdF9kYXRlLCBzZWNvbmRfZGF0ZSkge1xyXG4gIGxldCBmaXJzdF9hcnJheSA9IGZpcnN0X2RhdGUubWF0Y2goXHJcbiAgICAgIC8oXFxkezJ9KVxcLihcXGR7Mn0pXFwuKFxcZHs0fSkgKFxcZHsyfSk6KFxcZHsyfSkvKTtcclxuICBsZXQgc2Vjb25kX2FycmF5ID0gc2Vjb25kX2RhdGUubWF0Y2goXHJcbiAgICAgIC8oXFxkezJ9KVxcLihcXGR7Mn0pXFwuKFxcZHs0fSkgKFxcZHsyfSk6KFxcZHsyfSkvKTtcclxuICBsZXQgZmlyc3QgPSBEYXRlLlVUQyhmaXJzdF9hcnJheVszXSwgZmlyc3RfYXJyYXlbMl0gLSAxLCBmaXJzdF9hcnJheVsxXSk7XHJcbiAgbGV0IHNlY29uZCA9IERhdGUuVVRDKHNlY29uZF9hcnJheVszXSwgc2Vjb25kX2FycmF5WzJdIC0gMSwgc2Vjb25kX2FycmF5WzFdKTtcclxuICBsZXQgd2Vla3MgPSAoTWF0aC5jZWlsKChzZWNvbmQgLSBmaXJzdCkgLyAoMTAwMCAqIDYwICogNjAgKiAyNCkpKSAvIDc7XHJcbiAgcmV0dXJuIHdlZWtzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0ludGVnZXIobnVtKSB7XHJcbiAgcmV0dXJuIChudW0gXiAwKSA9PT0gbnVtO1xyXG59XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVXZWVrc1RleHQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHRvRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9EYXRlSW5wdXRcIik7XHJcbiAgbGV0IGZyb21EYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcm9tRGF0ZUlucHV0XCIpO1xyXG4gIGxldCB0b0RhdGVDYWxlbmRhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9EYXRlQ2FsZW5kYXJcIik7XHJcbiAgdG9EYXRlQ2FsZW5kYXIuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cclxuICBsZXQgdGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGV4dFdlZWtzXCIpO1xyXG4gIHRleHQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cclxuICBmcm9tRGF0ZS5vbmNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRvRGF0ZUNhbGVuZGFyLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZS1ibG9ja1wiO1xyXG4gICAgdG9EYXRlLnZhbHVlID0gXCJcIjtcclxuXHJcbiAgfTtcclxuICB0b0RhdGUub25jaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgd2Vla3MgPSBnZXRXZWVrcyhmcm9tRGF0ZS52YWx1ZS5yZXBsYWNlKC9cXHMrL2csICcnKVxyXG4gICAgICAgICsgXCIgMDA6MDBcIiwgdG9EYXRlLnZhbHVlLnJlcGxhY2UoL1xccysvZywgJycpICsgXCIgMDA6MDBcIik7XHJcbiAgICB0ZXh0LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICB3ZWVrcyA9IHJvdW5kUGx1cyh3ZWVrcywgMSk7XHJcbiAgICB0ZXh0LmlubmVySFRNTCA9IFwi0JrQvtC70LjRh9C10YHRgtCy0L4g0L3QtdC00LXQu9GMOiBcIiArIHdlZWtzO1xyXG4gICAgaWYgKGlzSW50ZWdlcih3ZWVrcykpIHtcclxuICAgICAgdGV4dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1hcmdpbjIwIGdyZWVuXCIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRleHQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtYXJnaW4yMCByZWRcIik7XHJcbiAgICB9XHJcbiAgfTtcclxufTtcclxuVmlldy5wcm90b3R5cGUuZGlzcGxheUdyb3VwcyA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdWNhdGlvblwiKS52YWx1ZTtcclxuICBpZiAoZWR1Y2F0aW9uTGV2ZWwgPT09IFwiYmFjaGVsb3JcIikge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJiYWNoZWxvclwiKSAhPT0gLTEpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJiYWNoZWxvclwiKSAhPT0gLTEpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcIm1hc3RlclwiKSAhPT0gLTEpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufTtcclxuVmlldy5wcm90b3R5cGUuY2xlYXJQcmFjdGljZVNlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5jcmVhdGVXZWVrc1RleHQoKTtcclxuXHJcbiAgbGV0IHRvRGF0ZUNhbGVuZGFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVDYWxlbmRhclwiKTtcclxuICB0b0RhdGVDYWxlbmRhci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcm9tRGF0ZUlucHV0XCIpLnZhbHVlID0gXCJcIjtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvRGF0ZUlucHV0XCIpLnZhbHVlID0gXCJcIjtcclxuICB0b0RhdGVDYWxlbmRhci52YWx1ZSA9IFwiXCI7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWNOdW1cIikudmFsdWUgPSBcIlwiO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IGlucHV0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnF1ZXJ5U2VsZWN0b3JBbGwoXHJcbiAgICAgICAgJ2lucHV0Jyk7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGlucHV0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAkKGlucHV0c1tqXSkuYXR0cignY2hlY2tlZCcsIGZhbHNlKTtcclxuICAgIH1cclxuICB9XHJcbiAgLyogbGV0IHN0ZXBzPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic3RlcHNcIilbMF0uY2hpbGRyZW47XHJcbiAgIHN0ZXBzWzBdLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xyXG4gICBmb3IobGV0IGk9MDtpPHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoO2krKyl7XHJcbiAgICAgICBzdGVwc1tpXS5zdHlsZS5kaXNwbGF5PSdub25lJztcclxuICAgfSovXHJcbn07XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJJbmZvID0gZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgbGV0IHN0YXJ0X3llYXIgPSBwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlLnN1YnN0cigwLCA0KSxcclxuICAgICAgICBzdGFydF9tb250aCA9IHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDUsIDIpLFxyXG4gICAgICAgIHN0YXJ0X2RheSA9IHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDgsIDIpLFxyXG4gICAgICAgIGVuZF95ZWFyID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDAsIDQpLFxyXG4gICAgICAgIGVuZF9tb250aCA9IHByYWN0aWNlLmVuZF9kYXRlX3ByYWN0aWNlLnN1YnN0cig1LCAyKSxcclxuICAgICAgICBlbmRfZGF5ID0gcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDgsIDIpO1xyXG4gICAgbGV0IHN0YXJ0X2RhdGUgPSBzdGFydF9kYXkgKyAnLScgKyBzdGFydF9tb250aCArICctJyArIHN0YXJ0X3llYXI7XHJcbiAgICBsZXQgZW5kX2RhdGUgPSBlbmRfZGF5ICsgJy0nICsgZW5kX21vbnRoICsgJy0nICsgZW5kX3llYXI7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSAn0YEgJ1xyXG4gICAgICAgICsgc3RhcnRfZGF0ZSArICcg0L/QviAnICsgZW5kX2RhdGU7XHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gaW5mb19hYm91dF9wcmFjdGljZS50eXBlUHJhY3RpY2VcclxuICAgICAgICArICcg0L/RgNCw0LrRgtC40LrQsCc7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VHlwZVByYWN0aWNlXCIpLmlubmVySFRNTCA9IFwi0J/RgNCw0LrRgtC40LrQuFwiXHJcbiAgICAgICAgKyBcIiDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBcIiBcIjtcclxuICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxyXG4gICAgICBcInRhYmNvbnRyb2wyXCIpWzBdLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhY3RpdmVcIilbMF0uY2hpbGRyZW5bMF0udGV4dDtcclxuICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VUYWJcIikudmFsdWU7XHJcbiAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB7XHJcbiAgICAndHlwZVByYWN0aWNlJzogdHlwZVByYWN0aWNlLFxyXG4gICAgJ3llYXInOiB0aGlzLnNlbGVjdGVkWWVhcixcclxuICAgICdlZHVfbGV2ZWwnOiBlZHVjYXRpb25MZXZlbFxyXG4gIH07XHJcbiAgcmV0dXJuIGluZm9fYWJvdXRfcHJhY3RpY2U7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRVc2VySW5mb0Fib3V0UHJhY3RpY2VPcmdTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcInNlbGVjdEVkdUxldmVsT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgbGV0IHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJlZHVjYXRpb25hbFwiKSB7XHJcbiAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQo9GH0LXQsdC90LDRj1wiO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiaW50ZXJuc2hpcFwiKSB7XHJcbiAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQn9GA0L7QuNC30LLQvtC00YHRgtCy0LXQvdC90LDRj1wiO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwicHJlZGlwbG9tYVwiKSB7XHJcbiAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQn9GA0LXQtNC00LjQv9C70L7QvNC90LDRj1wiO1xyXG4gIH1cclxuXHJcbiAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB7XHJcbiAgICAndHlwZVByYWN0aWNlJzogdHlwZVByYWN0aWNlVGV4dCxcclxuICAgICd5ZWFyJzogdGhpcy5zZWxlY3RlZFllYXIsXHJcbiAgICAnZWR1X2xldmVsJzogZWR1Y2F0aW9uTGV2ZWxcclxuICB9O1xyXG4gIHJldHVybiBpbmZvX2Fib3V0X3ByYWN0aWNlO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUucmVuZGVyVGFibGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gIGlmIChkYXRhID09PSAwKSB7XHJcbiAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5DbGVhclRhYmxlKCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuQ2xlYXJUYWJsZSgpO1xyXG4gICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuQWRkRGF0YShkYXRhKTtcclxuICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jb2xvclRhYmxlID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChkYXRhW2ldLnN0YXR1cyA9PT0gMSkge1xyXG4gICAgICAkKHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkdldE5vZGVzKGkpKS5hZGRDbGFzcyhcImFwcHJvdmVkX3N0dWRcIik7XHJcbiAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkdldE5vZGVzKGkpLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICBcInNvcnRpbmdfMSBhcHByb3ZlZF9zdHVkXCIpO1xyXG4gICAgfVxyXG4gICAgaWYgKGRhdGFbaV0uc3RhdHVzID09PSAwKSB7XHJcbiAgICAgICQodGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuR2V0Tm9kZXMoaSkpLmFkZENsYXNzKFwiYXBwbGllZF9zdHVkXCIpO1xyXG4gICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgXCJzb3J0aW5nXzEgYXBwbGllZF9zdHVkXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNoYW5nZVllYXIgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gIGlmIChzZWxlY3RlZEVsZW0pIHtcclxuICAgIHNlbGVjdGVkRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdjdXJyZW50Jyk7XHJcbiAgfVxyXG4gIHNlbGVjdGVkRWxlbSA9IG5vZGU7XHJcbiAgc2VsZWN0ZWRFbGVtLmNsYXNzTGlzdC5hZGQoJ2N1cnJlbnQnKTtcclxuICB0aGlzLnNlbGVjdGVkWWVhciA9IHNlbGVjdGVkRWxlbS5pbm5lckhUTUw7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVZZWFyID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgaWYgKHRhcmdldC5jbGFzc05hbWUgPT09ICdpdGVtIHllYXInIHx8IHRhcmdldC5jbGFzc05hbWVcclxuICAgICAgICA9PT0gJ2l0ZW0geWVhciBjdXJyZW50Jykge1xyXG4gICAgICB0aGlzLmNoYW5nZVllYXIodGFyZ2V0KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XHJcbiAgfVxyXG5cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkR3JvdXBzID0gZnVuY3Rpb24gKHRyZWVWaWV3KSB7XHJcbiAgaWYgKHRyZWVWaWV3ID09PSB1bmRlZmluZWQpIHtcclxuICAgIGxldCBmcmFtZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZnJhbWVzXCIpWzBdLmNoaWxkcmVuO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKGZyYW1lc1tpXS5zdHlsZS5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xyXG4gICAgICAgIHRyZWVWaWV3ID0gZnJhbWVzW2ldLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGxldCBHcm91cHMgPSBbXTtcclxuICBsZXQgbGlOdW1iZXIgPSB0cmVlVmlldy5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlOdW1iZXIubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBncm91cHMgPSBsaU51bWJlcltpXS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpjaGVja2VkJyk7XHJcbiAgICBpZiAoZ3JvdXBzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGxldCBncm91cCA9IGdyb3Vwc1tqXS5wYXJlbnRFbGVtZW50Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUw7XHJcbiAgICAgICAgaWYgKGdyb3VwLmluZGV4T2YoXCLQutGD0YDRgVwiKSA9PT0gLTEpIHtcclxuICAgICAgICAgIEdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIEdyb3VwcztcclxufTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLCBuYW1lTGVhZiwgdWlkKSB7XHJcbiAgYXdhaXQgdHJlZS5hZGRMZWFmKG5vZGUsIG5hbWVMZWFmLCB7XHJcbiAgICBtb2RlOiAnY2hlY2tib3gnLFxyXG4gICAgY2hlY2tlZDogZmFsc2UsXHJcbiAgICB1aWQ6IHVpZFxyXG4gIH0pO1xyXG59XHJcblxyXG5WaWV3LnByb3RvdHlwZS5yZW1vdmVDaGlsZHJlbiA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZE5vZGVzO1xyXG4gIHdoaWxlIChjaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGRyZW5bMF0pO1xyXG4gIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNsZWFyR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGlkID0gMDtcclxuICB3aGlsZSAoaWQgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aCkge1xyXG4gICAgdmFyIGxpQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICB0aGlzLmlkVHJlZVZpZXdzW2lkXSkuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdGhpcy5yZW1vdmVDaGlsZHJlbihsaUFycmF5W2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1bCcpWzBdKTtcclxuICAgIH1cclxuICAgIGlkKys7XHJcbiAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVHcm91cHNUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uIChjb3Vyc2VzLCBncm91cHMpIHtcclxuICBsZXQgaWRDb3VudGVyID0gMCwgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyLCBjbnQ7XHJcbiAgbGV0IGNvdXJzZXNOYW1lID0gWydmaXJzdCcsICdzZWNvbmQnLCAndGhpcmQnLCAnZm91cnRoJ107XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHdoaWxlIChpZENvdW50ZXIgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aCkge1xyXG4gICAgdmFyIHRyZWUgPSAkKFwiI1wiICsgdGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdKS5kYXRhKFwidHJlZXZpZXdcIik7XHJcbiAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgIGNvdXJzZU51bWJlciA9IG1hc3RlclllYXI7XHJcbiAgICAgIGkgPSBiYWNoZWxvclllYXI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgICBpID0gMDtcclxuICAgIH1cclxuICAgIGNudCA9IDA7XHJcbiAgICBmb3IgKGk7IGkgPCBjb3Vyc2VOdW1iZXI7IGkrKykge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdXJzZXNbaV0uZ3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgbGV0IG5vZGUgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGkuJyArIGNvdXJzZXNOYW1lW2NudF0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdXHJcbiAgICAgICAgICAgID09PSBcImdyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWRpYWxvZ0FkZC1iYWNoZWxvclwiXHJcbiAgICAgICAgICAgIHx8IHRoaXMuaWRUcmVlVmlld3NbaWRDb3VudGVyXVxyXG4gICAgICAgICAgICA9PT0gXCJncm91cC10cmVldmlldy10YWJjb250cm9sMi1kaWFsb2dBZGQtbWFzdGVyXCIpIHtcclxuICAgICAgICAgIG5vZGVbMF0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVswXS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLFxyXG4gICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICBhd2FpdCAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXHJcbiAgICAgICAgICAgICAgY291cnNlc1tpXS5ncm91cHNbal0pO1xyXG4gICAgICAgICAgbGV0IGVsZW0gPSBub2RlLmZpbmQoJ3VsJylbMF0uY2hpbGRyZW5bbm9kZS5maW5kKFxyXG4gICAgICAgICAgICAgICd1bCcpWzBdLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgJChlbGVtKS5hZGRDbGFzcyhcImNvbGxhcHNlZFwiKTtcclxuICAgICAgICAgIGVsZW0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbnB1dFwiKVswXS5zZXRBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiLFxyXG4gICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICBsZXQgc3R1ZGVudHMgPSAwO1xyXG4gICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBncm91cHMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgaWYgKGNvdXJzZXNbaV0uZ3JvdXBzW2pdID09PSBncm91cHNba10ubmFtZSkge1xyXG4gICAgICAgICAgICAgIHN0dWRlbnRzID0gZ3JvdXBzW2tdLnN0dWRlbnRzO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHN0dWRlbnRzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCAkKGVsZW0pLFxyXG4gICAgICAgICAgICAgICAgc3R1ZGVudHNba10ubmFtZSwgc3R1ZGVudHNba10udWlkKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGxldCBpbnB1dHMgPSBlbGVtLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXVpZF0nKTtcclxuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgaW5wdXRzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgIGlucHV0c1trXS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImlucHV0XCIpWzBdLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsXHJcbiAgICAgICAgICAgICAgICBcImRpc2FibGVkXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGF3YWl0IHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLFxyXG4gICAgICAgICAgICAgIGNvdXJzZXNbaV0uZ3JvdXBzW2pdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY250Kys7XHJcbiAgICB9XHJcbiAgICBpZENvdW50ZXIrKztcclxuICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLm15VXBkYXRlVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoY291cnNlcywgaWQpIHtcclxuICBsZXQgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyLCBuO1xyXG4gIGxldCBjb3Vyc2VzTmFtZSA9IFsnZmlyc3QnLCAnc2Vjb25kJywgJ3RoaXJkJywgJ2ZvdXJ0aCddO1xyXG4gIHZhciBpID0gMDtcclxuXHJcbiAgdmFyIHRyZWUgPSAkKFwiI1wiICsgaWQpLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICBpZiAoaWQuaW5kZXhPZihcIm1hc3RlclwiKSAhPT0gLTEpIHtcclxuICAgIGNvdXJzZU51bWJlciA9IG1hc3RlclllYXI7XHJcbiAgICBpID0gYmFjaGVsb3JZZWFyO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGNvdXJzZU51bWJlciA9IGJhY2hlbG9yWWVhcjtcclxuICAgIGkgPSAwO1xyXG4gIH1cclxuICBuID0gMDtcclxuICBmb3IgKGk7IGkgPCBjb3Vyc2VOdW1iZXI7IGkrKykge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb3Vyc2VzW2ldLmdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICBsZXQgbm9kZSA9IHRyZWUuZWxlbWVudC5maW5kKCdsaS4nICsgY291cnNlc05hbWVbbl0pO1xyXG4gICAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94X2V4YW1wbGVfY2xpY2sodHJlZSwgbm9kZSwgY291cnNlc1tpXS5ncm91cHNbal0pO1xyXG4gICAgfVxyXG4gICAgbisrO1xyXG4gIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0Q29uZmlndXJhdGlvblByYWN0aWNlID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgbGV0IGVkdUxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVMZXZlbE9yZ2FuaXNhdGlvblNlY1wiKS52YWx1ZTtcclxuICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHtcclxuICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyLFxyXG4gICAgJ2VkdV9sZXZlbCc6IGVkdUxldmVsXHJcbiAgfTtcclxuICByZXR1cm4gaW5mb19hYm91dF9wcmFjdGljZTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHRyZWVfYWRkX2xlYWZfY2hlY2tib3godHJlZSwgbm9kZSwgbmFtZUxlYWYsIGlkVHlwZU9yZ2FuaXNhdGlvbikge1xyXG4gIHRyZWUuYWRkTGVhZihub2RlLCBuYW1lTGVhZiwge1xyXG4gICAgbW9kZTogJ2NoZWNrYm94JyxcclxuICAgIGNoZWNrZWQ6IGZhbHNlXHJcbiAgfSk7XHJcbiAgbm9kZS5maW5kKCd1bCcpLmZpbmQoJ2xpJykubGFzdCgpWzBdLnNldEF0dHJpYnV0ZShcImlkXCIsICd0eXBlX29yZ18nXHJcbiAgICAgICsgaWRUeXBlT3JnYW5pc2F0aW9uKTtcclxufVxyXG5cclxuVmlldy5wcm90b3R5cGUuc2V0VHlwZXNPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAodHlwZXNPcmdhbmlzYXRpb24pIHtcclxuICB2YXIgdHJlZVZpZXdPcmdhbmlzYXRpb25zID0gJChcclxuICAgICAgXCIjb3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKS5kYXRhKFwidHJlZXZpZXdcIik7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IG5vZGUgPSB0cmVlVmlld09yZ2FuaXNhdGlvbnMuZWxlbWVudC5maW5kKCdsaS5ub2RlJyk7XHJcbiAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94KHRyZWVWaWV3T3JnYW5pc2F0aW9ucywgbm9kZSxcclxuICAgICAgICB0eXBlc09yZ2FuaXNhdGlvbltpXS5uYW1lLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XHJcbiAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5jbGVhclR5cGVzT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBsaUFycmF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICdvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uJykuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICB0aGlzLnJlbW92ZUNoaWxkcmVuKGxpQXJyYXlbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0pO1xyXG4gIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuc2V0T3JnYW5pc2F0aW9uc0luVHJlZVZpZXcgPSBmdW5jdGlvbiAob3JnYW5pc2F0aW9ucyxcclxuICAgIHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgdmFyIHRyZWUgPSAkKFwiI29yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgb3JnYW5pc2F0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGorKykge1xyXG4gICAgICBpZiAob3JnYW5pc2F0aW9uc1tpXS5pZF90eXBlX29yZ2FuaXNhdGlvbiA9PT0gdHlwZXNPcmdhbmlzYXRpb25bal0uaWQpIHtcclxuICAgICAgICBsZXQgbGlBcnIgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGknKTtcclxuICAgICAgICBsZXQgbm9kZTtcclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGxpQXJyLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICBpZiAobGlBcnJba10uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09ICgndHlwZV9vcmdfJ1xyXG4gICAgICAgICAgICAgICAgICArIHR5cGVzT3JnYW5pc2F0aW9uW2pdLmlkKSkge1xyXG4gICAgICAgICAgICBub2RlID0gJChsaUFycltrXSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94X2V4YW1wbGVfY2xpY2sodHJlZSwgbm9kZSxcclxuICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldEluZm9OZXdPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVDb21wYW55XCIpO1xyXG4gIHZhciB0eXBlT3JnID0gZS5vcHRpb25zW2Uuc2VsZWN0ZWRJbmRleF0udGV4dDtcclxuICBsZXQgb3JnYW5pc2F0aW9uID0ge1xyXG4gICAgJ25hbWUnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgJ3R5cGVPcmcnOiB0eXBlT3JnLFxyXG4gICAgJ2luZm9PcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm9Db21wYW55XCIpLnZhbHVlLFxyXG4gICAgJ2VtYWlsT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbWFpbE9yZ1wiKS52YWx1ZSxcclxuICAgICdwaG9uZU9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGhvbmVPcmdcIikudmFsdWUsXHJcbiAgICAncGxhY2VzT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGFjZXNDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgJ2xvZ2luT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbkNvbXBhbnlcIikudmFsdWUsXHJcbiAgICAncHN3ZE9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHN3ZENvbXBhbnlcIikudmFsdWUsXHJcbiAgICAnYWRkcmVzc09yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkcmVzc09yZ1wiKS52YWx1ZSxcclxuICAgICdpZCc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRDb21wYW55XCIpLmlubmVySFRNTFxyXG4gIH07XHJcbiAgcmV0dXJuIG9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0ID0gZnVuY3Rpb24gKHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgbGV0IHR5cGVPcmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVDb21wYW55XCIpO1xyXG4gIHRoaXMucmVtb3ZlQ2hpbGRyZW4odHlwZU9yZyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgb3B0aW9uLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHR5cGVzT3JnYW5pc2F0aW9uW2ldLmlkKTtcclxuICAgIG9wdGlvbi5pbm5lckhUTUwgPSB0eXBlc09yZ2FuaXNhdGlvbltpXS5uYW1lO1xyXG4gICAgdHlwZU9yZy5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuc2V0T3JnYW5pc2F0aW9uc0xpc3QgPSBmdW5jdGlvbiAob3JnYW5pc2F0aW9ucywgaWRMaXN0KSB7XHJcbiAgbGV0IGxpc3RPcmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZExpc3QpO1xyXG4gIHRoaXMucmVtb3ZlQ2hpbGRyZW4obGlzdE9yZyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgZGl2X2xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdl9saXN0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdFwiKTtcclxuXHJcbiAgICBsZXQgZGl2X2xpc3RfY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgZGl2X2xpc3RfY29udGVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtY29udGVudCBpbmxpbmUtYmxvY2tcIik7XHJcbiAgICBpZiAoaWRMaXN0ID09PSBcIm9yZ2FuaXNhdGlvbkxpc3RcIikge1xyXG4gICAgICBkaXZfbGlzdF9jb250ZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLFxyXG4gICAgICAgICAgdGhpcy5vbkNsaWNrRGlzcGxheUluZm9BYm91dE9yZyk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHNwYW5fbGlzdF90aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtdGl0bGVcIik7XHJcbiAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwiaWRfb3JnYW5pc2F0aW9uXCIsIG9yZ2FuaXNhdGlvbnNbaV0uaWQpO1xyXG4gICAgc3Bhbl9saXN0X3RpdGxlLmlubmVySFRNTCA9IG9yZ2FuaXNhdGlvbnNbaV0ubmFtZTtcclxuICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3RpdGxlKTtcclxuXHJcbiAgICBsZXQgc3Bhbl9saXN0X3N1YnRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgc3Bhbl9saXN0X3N1YnRpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1zdWJ0aXRsZVwiKTtcclxuICAgIHNwYW5fbGlzdF9zdWJ0aXRsZS5pbm5lckhUTUwgPSAn0JLRgdC10LPQviDQvNC10YHRgjogJ1xyXG4gICAgICAgICsgb3JnYW5pc2F0aW9uc1tpXS5tYXhfc3R1ZGVudHNfbnVtYmVyO1xyXG4gICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3Rfc3VidGl0bGUpO1xyXG5cclxuICAgIGxldCBzcGFuX2xpc3RfcmVtYXJrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgc3Bhbl9saXN0X3JlbWFyay5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtcmVtYXJrXCIpO1xyXG4gICAgc3Bhbl9saXN0X3JlbWFyay5pbm5lckhUTUwgPSAn0J7RgdGC0LDQu9C+0YHRjDogJ1xyXG4gICAgICAgICsgb3JnYW5pc2F0aW9uc1tpXS5tYXhfc3R1ZGVudHNfbnVtYmVyO1xyXG4gICAgLyrQntCR0K/Ql9CQ0KLQldCb0KzQndCeINCY0KHQn9Cg0JDQktCY0KLQrCDQndCQINCa0J7Qm9CY0KfQldCh0KLQktCeINCe0KHQotCQ0JLQqNCY0KXQodCvINCc0JXQodCiLiEhISEhISEhISEhISEhISEhISEhISEhISEhISovXHJcbiAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9yZW1hcmspO1xyXG5cclxuICAgIGRpdl9saXN0LmFwcGVuZENoaWxkKGRpdl9saXN0X2NvbnRlbnQpO1xyXG5cclxuICAgIGxldCBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgXCJpbmxpbmUtYmxvY2sgbGlzdC1jb250ZW50IHNldHRpbmdzT3JnYW5pc2F0aW9uXCIpO1xyXG4gICAgaWYgKGlkTGlzdCA9PT0gXCJvcmdhbmlzYXRpb25MaXN0XCIpIHtcclxuICAgICAgbGV0IHNwYW5fdXNlcl9wbHVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICBzcGFuX3VzZXJfcGx1cy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgXCJtaWYtdXNlci1wbHVzIG1pZi1sZyBmZy1ncmF5IGFkZC1zdHVkZW50LW9yZ2FuaXNhdGlvblwiKTtcclxuICAgICAgc3Bhbl91c2VyX3BsdXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXHJcbiAgICAgICAgICB0aGlzLm9uQ2xpY2tBZGRTdHVkZW50VG9PcmdhbmlzYXRpb25TaG93RGlhbG9nKTtcclxuICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX3VzZXJfcGx1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHNwYW5fcGVuY2lsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgc3Bhbl9wZW5jaWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcclxuICAgICAgICBcIm1pZi1wZW5jaWwgbWlmLWxnIGZnLWdyYXkgZWRpdC1vcmdhbmlzYXRpb25cIik7XHJcbiAgICBzcGFuX3BlbmNpbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkNsaWNrRWRpdE9yZ2FuaXNhdGlvbik7XHJcbiAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fcGVuY2lsKTtcclxuXHJcbiAgICAvKiBsZXQgc3Bhbl9jYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgc3Bhbl9jYW5jZWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtaWYtY2FuY2VsIG1pZi1sZyBmZy15ZWxsb3dcIik7XHJcbiAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX2NhbmNlbCk7Ki9cclxuXHJcbiAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uKTtcclxuXHJcbiAgICBsaXN0T3JnLmFwcGVuZENoaWxkKGRpdl9saXN0KTtcclxuICB9XHJcblxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5nZXRJZE9yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gIGxldCBpZE9yZ2FuaXNhdGlvbiA9IDA7XHJcbiAgaWYgKGV2ZW50LnRhcmdldC5pZCA9PT0gXCJ1cGRhdGVPcmdhbmlzYXRpb25cIikge1xyXG4gICAgaWRPcmdhbmlzYXRpb24gPSArZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMl0uaW5uZXJIVE1MO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGlkT3JnYW5pc2F0aW9uID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5jaGlsZHJlblswXS5nZXRBdHRyaWJ1dGUoXHJcbiAgICAgICAgXCJpZF9vcmdhbmlzYXRpb25cIik7XHJcbiAgfVxyXG4gIHJldHVybiBpZE9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldE5hbWVPcmdhbmlzYXRpb25JblRyZWV2aWV3ID0gZnVuY3Rpb24gKGlkVHJlZXZpZXcpIHtcclxuICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRUcmVldmlldyk7XHJcbiAgbGV0IG5hbWVPcmdhbmlzYXRpb24gPSBwYXJlbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcclxuICAgICAgXCJhY3RpdmVcIilbMF0ucXVlcnlTZWxlY3RvcignW2lkX29yZ2FuaXNhdGlvbicpLmlubmVySFRNTDtcclxuICByZXR1cm4gbmFtZU9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnNob3dEaWFsb2dPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5uYW1lO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRDb21wYW55XCIpLmlubmVySFRNTCA9IG9yZ2FuaXNhdGlvbi5pZDtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm9Db21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLmluZm9fb3JnYW5pc2F0aW9uO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGhvbmVPcmdcIikudmFsdWUgPSBvcmdhbmlzYXRpb24ucGhvbmVfb3JnYW5pc2F0aW9uO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1haWxPcmdcIikudmFsdWUgPSBvcmdhbmlzYXRpb24uZW1haWxfb3JnYW5pc2F0aW9uO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImFkZHJlc3NPcmdcIikudmFsdWUgPSBvcmdhbmlzYXRpb24uYWRkcmVzc19vcmdhbmlzYXRpb247XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIFwicGxhY2VzQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5tYXhfc3R1ZGVudHNfbnVtYmVyO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImxvZ2luQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5sb2dpbl9vcmdhbmlzYXRpb247XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwc3dkQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5wc3dkX29yZ2FuaXNhdGlvbjtcclxuICBtZXRyb0RpYWxvZy5vcGVuKCcjZGlhbG9nQ3JlYXRlQ29tcGFueScpO1xyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5kaWFsb2dPcGVuID0gZnVuY3Rpb24gKGlkKSB7XHJcbiAgbWV0cm9EaWFsb2cub3BlbihpZCk7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZU9yZ2FuaXNhdGlvblRpdGxlID0gZnVuY3Rpb24gKG5hbWVPcmdhbmlzYXRpb24sXHJcbiAgICBhcHByb3ZlZF9zdHVkZW50X2NvdW50LCBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCkge1xyXG4gIGlmIChub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9PT0gMCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJub25BcHByb3ZlZFN0dWRlbnRMaXN0VGl0bGVcIikuaW5uZXJIVE1MID0gXCIsINC/0YPRgdGCXCI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJub25BcHByb3ZlZFN0dWRlbnRMaXN0VGl0bGVcIikuaW5uZXJIVE1MID0gXCJcIjtcclxuICB9XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdOYW1lXCIpLmlubmVySFRNTCA9IG5hbWVPcmdhbmlzYXRpb247XHJcblxyXG4gIGlmIChhcHByb3ZlZF9zdHVkZW50X2NvdW50ID09PSAwKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICBcImFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcItCh0L/QuNGB0L7QuiDRg9GC0LLQtdGA0LbQtNC10L3QvdGL0YUg0YHRgtGD0LTQtdC90YLQvtCyINC/0YPRgdGCLlwiO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwiYXBwcm92ZWRTdHVkZW50TGlzdFRpdGxlXCIpLmlubmVySFRNTCA9IFwi0KHQv9C40YHQvtC6INGD0YLQstC10YDQttC00LXQvdC90YvRhSDRgdGC0YPQtNC10L3RgtC+0LIuXCI7XHJcbiAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICBsZXQgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcclxuICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgaWYgKGVsZW1lbnQuY2xhc3NOYW1lID09PSBcImxpc3QtY29udGVudCBpbmxpbmUtYmxvY2tcIikge1xyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgfVxyXG4gIGxldCBuYW1lT3JnYW5pc2F0aW9uQ2xpY2sgPSBlbGVtZW50LmNoaWxkcmVuWzBdLmlubmVySFRNTDtcclxuICByZXR1cm4gbmFtZU9yZ2FuaXNhdGlvbkNsaWNrO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0TmFtZU9yZ2FuaXNhdGlvbkJ5VGl0bGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnTmFtZVwiKS5pbm5lckhUTUw7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVTdHVkZW50c0xpc3RWaWV3ID0gZnVuY3Rpb24gKHN0dWRlbnRzLCBpZExpc3QpIHtcclxuICBsZXQgbGlzdFN0dWRlbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRMaXN0KTtcclxuICB0aGlzLnJlbW92ZUNoaWxkcmVuKGxpc3RTdHVkZW50cyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IGRpdl9saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBkaXZfbGlzdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3RcIik7XHJcblxyXG4gICAgbGV0IGRpdl9saXN0X2NvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdl9saXN0X2NvbnRlbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LWNvbnRlbnQgaW5saW5lLWJsb2NrXCIpO1xyXG5cclxuICAgIGxldCBzcGFuX2xpc3RfdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXRpdGxlXCIpO1xyXG4gICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcInJlcXVlc3RcIiwgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdCk7XHJcbiAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwidWlkXCIsIHN0dWRlbnRzW2ldLnVpZF9zdHVkZW50KTtcclxuICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJvcmdcIiwgc3R1ZGVudHNbaV0uaWRfb3JnYW5pc2F0aW9uKTtcclxuICAgIHNwYW5fbGlzdF90aXRsZS5pbm5lckhUTUwgPSBzdHVkZW50c1tpXS5kaXNwbGF5TmFtZTtcclxuICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3RpdGxlKTtcclxuXHJcbiAgICBsZXQgc3Bhbl9saXN0X3N1YnRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgc3Bhbl9saXN0X3N1YnRpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1zdWJ0aXRsZVwiKTtcclxuICAgIHNwYW5fbGlzdF9zdWJ0aXRsZS5pbm5lckhUTUwgPSBzdHVkZW50c1tpXS5ncm91cF9uYW1lO1xyXG4gICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3Rfc3VidGl0bGUpO1xyXG5cclxuICAgIGxldCB5ZWFyID0gc3R1ZGVudHNbaV0uZGF0ZV9jcmVhdGlvbl9yZXF1ZXN0LnN1YnN0cigwLCA0KSxcclxuICAgICAgICBtb250aCA9IHN0dWRlbnRzW2ldLmRhdGVfY3JlYXRpb25fcmVxdWVzdC5zdWJzdHIoNSwgMiksXHJcbiAgICAgICAgZGF5ID0gc3R1ZGVudHNbaV0uZGF0ZV9jcmVhdGlvbl9yZXF1ZXN0LnN1YnN0cig4LCAyKTtcclxuICAgIGxldCBkYXRlID0gZGF5ICsgJy0nICsgbW9udGggKyAnLScgKyB5ZWFyO1xyXG5cclxuICAgIGxldCBzcGFuX2xpc3RfcmVtYXJrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgc3Bhbl9saXN0X3JlbWFyay5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtcmVtYXJrXCIpO1xyXG4gICAgc3Bhbl9saXN0X3JlbWFyay5pbm5lckhUTUwgPSAn0JTQsNGC0LAg0LfQsNC/0LjRgdC4OiAnICsgZGF0ZTtcclxuICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3JlbWFyayk7XHJcblxyXG4gICAgZGl2X2xpc3QuYXBwZW5kQ2hpbGQoZGl2X2xpc3RfY29udGVudCk7XHJcblxyXG4gICAgbGV0IGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIixcclxuICAgICAgICBcImlubGluZS1ibG9jayBsaXN0LWNvbnRlbnQgc2V0dGluZ3NPcmdhbmlzYXRpb25cIik7XHJcblxyXG4gICAgaWYgKGlkTGlzdCAhPT0gXCJhcHByb3ZlZFN0dWRlbnRzXCIpIHtcclxuICAgICAgbGV0IHNwYW5fc3R1ZGVudF9hcHByb3ZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICBzcGFuX3N0dWRlbnRfYXBwcm92ZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgXCJtaWYtY2hlY2ttYXJrIG1pZi1sZyBmZy1ncmVlblwiKTtcclxuICAgICAgc3Bhbl9zdHVkZW50X2FwcHJvdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXHJcbiAgICAgICAgICB0aGlzLm9uQ2xpY2tBcHByb3ZlU3R1ZGVudCk7XHJcbiAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uYXBwZW5kQ2hpbGQoc3Bhbl9zdHVkZW50X2FwcHJvdmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzcGFuX3N0dWRlbnRfcmVqZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgc3Bhbl9zdHVkZW50X3JlamVjdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1pZi1jYW5jZWwgbWlmLWxnIGZnLXJlZFwiKTtcclxuICAgIHNwYW5fc3R1ZGVudF9yZWplY3QuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25DbGlja1JlamVjdFN0dWRlbnQpO1xyXG4gICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX3N0dWRlbnRfcmVqZWN0KTtcclxuXHJcbiAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uKTtcclxuXHJcbiAgICBsaXN0U3R1ZGVudHMuYXBwZW5kQ2hpbGQoZGl2X2xpc3QpO1xyXG4gIH1cclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsbE9yZ2FuaXNhdGlvbnNMaXN0QmxvY2tcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3R1ZGVudHNSZXF1ZXN0c1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUucmVuZGVyT3JnYW5pc2F0aW9uU2VjdGlvbiA9IGZ1bmN0aW9uIChwcmFjdGljZSkge1xyXG4gIGxldCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25MaXN0Q3VycmVudFByYWN0aWNlVGV4dFwiKTtcclxuICBpZiAocHJhY3RpY2UubGVuZ3RoICE9PSAwKSB7XHJcbiAgICB0ZXh0LmlubmVySFRNTCA9IFwi0KHQv9C40YHQvtC6INC+0YDQs9Cw0L3QuNC30LDRhtC40Lkg0LIg0L/RgNCw0LrRgtC40LrQtVwiO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRleHQuaW5uZXJIVE1MID0gXCLQn9GA0LDQutGC0LjQutC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCI7XHJcbiAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuT3Blbk9yQ2xvc2VMb2FkZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGRpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRcIikuc3R5bGUuZGlzcGxheTtcclxuICBpZiAoZGlzcGxheSA9PT0gXCJibG9ja1wiKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRTdHVkZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgbGV0IG5vZGUgPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgICdbcmVxdWVzdF0nKTtcclxuICBsZXQgc3R1ZGVudCA9IHtcclxuICAgICdpZF9yZXF1ZXN0Jzogbm9kZS5nZXRBdHRyaWJ1dGUoXCJyZXF1ZXN0XCIpLFxyXG4gICAgJ3VpZF9zdHVkZW50Jzogbm9kZS5nZXRBdHRyaWJ1dGUoXCJ1aWRcIiksXHJcbiAgICAnaWRfb3JnYW5pc2F0aW9uJzogbm9kZS5nZXRBdHRyaWJ1dGUoXCJvcmdcIilcclxuICB9O1xyXG5cclxuICBpZiAoZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZShcImNsYXNzXCIpLmluZGV4T2YoXCJtaWYtY2FuY2VsXCIpID09PSAwKSB7XHJcbiAgICBzdHVkZW50WydpZF9zdGF0dXMnXSA9IDI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgc3R1ZGVudFsnaWRfc3RhdHVzJ10gPSAxO1xyXG4gIH1cclxuICByZXR1cm4gc3R1ZGVudDtcclxufTtcclxuVmlldy5wcm90b3R5cGUuc2V0WWVhcnNBcnJheSA9IGZ1bmN0aW9uICh5ZWFycykge1xyXG4gIGxldCBidXR0b25BcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5XCIpO1xyXG4gIGxldCBidXR0b25BcnJheTEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbnNBcnJheTFcIik7XHJcbiAgdGhpcy5yZW1vdmVDaGlsZHJlbihidXR0b25BcnJheSk7XHJcbiAgdGhpcy5yZW1vdmVDaGlsZHJlbihidXR0b25BcnJheTEpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgeWVhcnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgc3Bhbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIml0ZW0geWVhclwiKTtcclxuICAgIHNwYW4uaW5uZXJIVE1MID0geWVhcnNbaV07XHJcbiAgICBidXR0b25BcnJheS5hcHBlbmRDaGlsZChzcGFuKTtcclxuXHJcbiAgICBsZXQgc3BhbjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICBzcGFuMS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIml0ZW0geWVhclwiKTtcclxuICAgIHNwYW4xLmlubmVySFRNTCA9IHllYXJzW2ldO1xyXG4gICAgYnV0dG9uQXJyYXkuYXBwZW5kQ2hpbGQoc3Bhbik7XHJcbiAgICBidXR0b25BcnJheTEuYXBwZW5kQ2hpbGQoc3BhbjEpO1xyXG4gIH1cclxuICBsZXQgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICBzcGFuLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaXRlbSB5ZWFyXCIpO1xyXG4gIHNwYW4uc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJjcmVhdGVQcmFjdGljZUJ0blwiKTtcclxuICBzcGFuLmlubmVySFRNTCA9IFwiK1wiO1xyXG4gIGJ1dHRvbkFycmF5LmFwcGVuZENoaWxkKHNwYW4pO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlUHJhY3RpY2VCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tDcmVhdGVQcmFjdGljZSk7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RlZFN0dWRlbnRzID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgbGV0IFN0dWRlbnRzID0gW107XHJcbiAgbGV0IG5vZGVzID0gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6Y2hlY2tlZCcpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmIChub2Rlc1tpXS5wYXJlbnRFbGVtZW50Lm5leHRTaWJsaW5nLmlubmVySFRNTC5pbmRleE9mKFwi0LrRg9GA0YFcIikgPT09IC0xXHJcbiAgICAgICAgJiYgaXNOYU4oK25vZGVzW2ldLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTC5zdWJzdHIoMCxcclxuICAgICAgICAgICAgMikpKSB7XHJcbiAgICAgIGxldCBuYW1lID0gbm9kZXNbaV0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MO1xyXG4gICAgICBsZXQgdWlkID0gbm9kZXNbaV0ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtdWlkXCIpO1xyXG4gICAgICBTdHVkZW50cy5wdXNoKHtcclxuICAgICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICAgIHVpZDogdWlkXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gU3R1ZGVudHM7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5kaWFsb2dFbmFibGVDaGVja2JveGVzID0gZnVuY3Rpb24gKG5hbWVzR3JvdXBzLCBpZEVsZW1lbnQpIHtcclxuICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRFbGVtZW50KTtcclxuICBsZXQgaW5wdXRzID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0Jyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbmFtZXNHcm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgaWYgKGlucHV0c1tpXS5wYXJlbnRFbGVtZW50Lm5leHRTaWJsaW5nLmlubmVySFRNTCA9PT0gbmFtZXNHcm91cHNbal0pIHtcclxuICAgICAgICBsZXQgY291cnNlID0gaW5wdXRzW2ldLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgaWYgKGNvdXJzZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1vZGVcIikgPT09IFwiY2hlY2tib3hcIlxyXG4gICAgICAgICAgICAmJiBjb3Vyc2UuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikuaW5kZXhPZihcImFjdGl2ZS1jb3Vyc2VcIikgPT09IC0xKSB7XHJcbiAgICAgICAgICAkKGNvdXJzZSkuYWRkQ2xhc3MoXCJhY3RpdmUtY291cnNlXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbnB1dHNbaV0ucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgbGV0IHN0dWRlbnRzQ2hlY2tib3hlcyA9IGlucHV0c1tpXS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcclxuICAgICAgICAgICAgJ1tkYXRhLXVpZF0nKTtcclxuICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHN0dWRlbnRzQ2hlY2tib3hlcy5sZW5ndGg7IG4rKykge1xyXG4gICAgICAgICAgc3R1ZGVudHNDaGVja2JveGVzW25dLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykucmVtb3ZlQXR0cmlidXRlKFxyXG4gICAgICAgICAgICAgIFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0RWxlbUJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcclxuICBsZXQgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICByZXR1cm4gZWxlbTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNyZWF0ZUlucHV0c09yZGVyID0gZnVuY3Rpb24gKHNlbGVjdGVkR3JvdXBzKSB7XHJcbiAgbGV0IHBhcmVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JkZXItYmxvY2tcIik7XHJcbiAgdGhpcy5yZW1vdmVDaGlsZHJlbihwYXJlbnQpO1xyXG4gIGxldCBoNCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcclxuICBoNC5pbm5lckhUTUwgPSBcItCg0YPQutC+0LLQvtC00LjRgtC10LvQuFwiO1xyXG4gIGg0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYWxpZ24tY2VudGVyXCIpO1xyXG4gIHBhcmVudC5hcHBlbmRDaGlsZChoNCk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBkaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmaWVsZCBtYXJnaW4yMFwiKTtcclxuXHJcbiAgICBsZXQgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgcC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImlubGluZS1ibG9jayBzdWItaGVhZGVyXCIpO1xyXG4gICAgcC5pbm5lckhUTUwgPSBzZWxlY3RlZEdyb3Vwc1tpXTtcclxuICAgIGRpdi5hcHBlbmRDaGlsZChwKTtcclxuXHJcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJncm91cE5hbWVcIiwgc2VsZWN0ZWRHcm91cHNbaV0pO1xyXG4gICAgZGl2LmFwcGVuZENoaWxkKGlucHV0KTtcclxuXHJcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZGl2KTtcclxuICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jcmVhdGVJbnB1dHNSZXBvcnQgPSBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICBsZXQgcGFyZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncm91cHMtcmVwb3J0LWJsb2NrXCIpO1xyXG4gIHRoaXMucmVtb3ZlQ2hpbGRyZW4ocGFyZW50KTtcclxuICBsZXQgaDQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XHJcbiAgaDQuaW5uZXJIVE1MID0gXCLQmNC90YTQvtGA0LzQsNGG0LjRjyDQv9C+INC60LDQttC00L7QuSDQs9GA0YPQv9C/0LVcIjtcclxuICBoNC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFsaWduLWNlbnRlclwiKTtcclxuICBwYXJlbnQuYXBwZW5kQ2hpbGQoaDQpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBkaXZfZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgZGl2X2dyb3VwLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiZ3JvdXAgXCIgKyBzZWxlY3RlZEdyb3Vwc1tpXSk7XHJcblxyXG4gICAgbGV0IGg0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImg0XCIpO1xyXG4gICAgaDQuaW5uZXJIVE1MID0gc2VsZWN0ZWRHcm91cHNbaV07XHJcbiAgICBoNC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFsaWduLWNlbnRlclwiKTtcclxuICAgIGRpdl9ncm91cC5hcHBlbmRDaGlsZChoNCk7XHJcblxyXG4gICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBkaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmaWVsZCBtYXJnaW4yMFwiKTtcclxuICAgIGxldCBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICBwLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaW5saW5lLWJsb2NrIHN1Yi1oZWFkZXJcIik7XHJcbiAgICBwLmlubmVySFRNTCA9IFwi0KDRg9C60L7QstC+0LTQuNGC0LXQu9GMXCI7XHJcbiAgICBkaXYuYXBwZW5kQ2hpbGQocCk7XHJcbiAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInN1cGVydmlzb3JcIik7XHJcbiAgICBkaXYuYXBwZW5kQ2hpbGQoaW5wdXQpO1xyXG4gICAgZGl2X2dyb3VwLmFwcGVuZENoaWxkKGRpdik7XHJcblxyXG4gICAgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGRpdi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZpZWxkIG1hcmdpbjIwXCIpO1xyXG4gICAgcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgcC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImlubGluZS1ibG9jayBzdWItaGVhZGVyXCIpO1xyXG4gICAgcC5pbm5lckhUTUwgPSBcItCh0YLRg9C0LiAoNCDQuCA1KVwiO1xyXG4gICAgZGl2LmFwcGVuZENoaWxkKHApO1xyXG4gICAgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImdvb2Rfc3R1ZGVudHNcIik7XHJcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwibnVtYmVyXCIpO1xyXG4gICAgZGl2LmFwcGVuZENoaWxkKGlucHV0KTtcclxuICAgIGRpdl9ncm91cC5hcHBlbmRDaGlsZChkaXYpO1xyXG5cclxuICAgIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBkaXYuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmaWVsZCBtYXJnaW4yMFwiKTtcclxuICAgIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgIHAuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgc3ViLWhlYWRlclwiKTtcclxuICAgIHAuaW5uZXJIVE1MID0gXCLQmtC+0Lst0LLQviDQv9GA0LXQv9C+0LQuLdGA0YPQutC+0LLQvtC0LlwiO1xyXG4gICAgZGl2LmFwcGVuZENoaWxkKHApO1xyXG4gICAgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XHJcbiAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInRlYWNoZXJfbnVtYmVyXCIpO1xyXG4gICAgaW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcIm51bWJlclwiKTtcclxuICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dCk7XHJcbiAgICBkaXZfZ3JvdXAuYXBwZW5kQ2hpbGQoZGl2KTtcclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChkaXZfZ3JvdXApO1xyXG4gIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmZvcm1hdERhdGUgPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gIGxldCB5ZWFyID0gZGF0ZS5zdWJzdHIoMCwgNCksXHJcbiAgICAgIG1vbnRoID0gZGF0ZS5zdWJzdHIoNSwgMiksXHJcbiAgICAgIGRheSA9IGRhdGUuc3Vic3RyKDgsIDIpO1xyXG4gIHJldHVybiAoZGF5ICsgJy4nICsgbW9udGggKyAnLicgKyB5ZWFyKTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldEluZm9ybWF0aW9uRm9yRG9jdW1lbnRPcmRlciA9IGZ1bmN0aW9uIChwcmFjdGljZSxcclxuICAgIHNlbGVjdGVkR3JvdXBzLCBhbGxHcm91cHMsIGRhdGEsIG9yZ2FuaXNhdGlvbnMpIHtcclxuICBsZXQgZ3JvdXBzRm9yRG9jdW1lbnQgPSBbXTtcclxuICBsZXQgZWR1Y2F0aW9uYWxfbGV2ZWwgPSB0aGlzLmdldEVkdWNhdGlvbmFsTGV2ZWwoKTtcclxuICBsZXQgYmxvY2tUZWFjaGVycyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcIm9yZGVyLWJsb2NrXCIpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKTtcclxuICBsZXQgdGVhY2hlcnMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGJsb2NrVGVhY2hlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBncm91cE5hbWUgPSBibG9ja1RlYWNoZXJzW2ldLmNoaWxkcmVuWzBdLmlubmVySFRNTDtcclxuICAgIGxldCB0ZWFjaGVyID0gYmxvY2tUZWFjaGVyc1tpXS5jaGlsZHJlblsxXS52YWx1ZTtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2pdID09PSBncm91cE5hbWUpIHtcclxuICAgICAgICB0ZWFjaGVycy5wdXNoKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJ0ZWFjaGVyXCI6IHRlYWNoZXIsXHJcbiAgICAgICAgICAgICAgXCJncm91cE5hbWVcIjogZ3JvdXBOYW1lXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5pbmZvR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGlmIChzZWxlY3RlZEdyb3Vwc1tpXS5pbmRleE9mKHRoaXMuaW5mb0dyb3Vwc1tqXS5uYW1lKSAhPT0gLTFcclxuICAgICAgICAgICYmIHRoaXMuaW5mb0dyb3Vwc1tqXS50eXBlID09PSBlZHVjYXRpb25hbF9sZXZlbCkge1xyXG4gICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgYWxsR3JvdXBzLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IGFsbEdyb3Vwc1tuXS5uYW1lKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGVhY2hlcnMubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IHRlYWNoZXJzW2tdLmdyb3VwTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLnRlYWNoZXIgPSB0ZWFjaGVyc1trXS50ZWFjaGVyO1xyXG4gICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLnR5cGUgPSB0aGlzLmluZm9Hcm91cHNbal0udHlwZTtcclxuICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS5mdWxsTmFtZSA9IHRoaXMuaW5mb0dyb3Vwc1tqXS5mdWxsTmFtZTtcclxuICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS5wcm9maWxlID0gdGhpcy5pbmZvR3JvdXBzW2pdLnByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICBncm91cHNGb3JEb2N1bWVudC5wdXNoKGFsbEdyb3Vwc1tuXSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGxldCBkZWFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFuXCIpLnZhbHVlO1xyXG4gIGxldCBoZWFkX29mX2RlcGFydG1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhlYWRfb2ZfZGVwYXJ0bWVudFwiKS52YWx1ZTtcclxuICBsZXQgdHlwZV9kb2N1bWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImdkdHlwZURvY3VtZW50XCIpLm9wdGlvbnNbZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIFwiZ2R0eXBlRG9jdW1lbnRcIikuc2VsZWN0ZWRJbmRleF0udmFsdWU7XHJcbiAgbGV0IGRvY3VtZW50cyA9IFtdO1xyXG4gIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVQcmFjdGljZVRhYlwiKS52YWx1ZTtcclxuICB0eXBlUHJhY3RpY2UgPSB0eXBlUHJhY3RpY2UucmVwbGFjZUF0KHR5cGVQcmFjdGljZS5sZW5ndGggLSAxLCBcItC5XCIpO1xyXG4gIHR5cGVQcmFjdGljZSA9IHR5cGVQcmFjdGljZS5yZXBsYWNlQXQodHlwZVByYWN0aWNlLmxlbmd0aCAtIDIsIFwi0L5cIik7XHJcbiAgdHlwZVByYWN0aWNlID0gdHlwZVByYWN0aWNlLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gIGxldCBzdGFydF9kYXRlID0gdGhpcy5mb3JtYXREYXRlKHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2UpO1xyXG4gIGxldCBlbmRfZGF0ZSA9IHRoaXMuZm9ybWF0RGF0ZShwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZSk7XHJcbiAgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCLRg9GH0LXQsdC90L7QuVwiKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBzdHVkZW50cyA9IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnN0dWRlbnRzO1xyXG4gICAgICBsZXQgc3RyID0gSlNPTi5zdHJpbmdpZnkoc3R1ZGVudHMsIFtcIm5hbWVcIl0pO1xyXG4gICAgICBzdHVkZW50cyA9IEpTT04ucGFyc2Uoc3RyKTtcclxuICAgICAgbGV0IGRvY3VtZW50ID0ge1xyXG4gICAgICAgIFwiZGlyZWN0aW9uXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLmZ1bGxOYW1lLFxyXG4gICAgICAgIFwicHJvZmlsZVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5wcm9maWxlLFxyXG4gICAgICAgIFwiZGVhblwiOiBkZWFuLFxyXG4gICAgICAgIFwiaGVhZF9vZl9kZXBhcnRtZW50XCI6IGhlYWRfb2ZfZGVwYXJ0bWVudCxcclxuICAgICAgICBcInR5cGVfcHJhY3RpY2VcIjogdHlwZVByYWN0aWNlLFxyXG4gICAgICAgIFwic3RhcnRfZGF0ZVwiOiBzdGFydF9kYXRlLFxyXG4gICAgICAgIFwiZW5kX2RhdGVcIjogZW5kX2RhdGUsXHJcbiAgICAgICAgXCJncm91cF9uYW1lXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLm5hbWUsXHJcbiAgICAgICAgXCJzdXBlcnZpc29yXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnRlYWNoZXIsXHJcbiAgICAgICAgXCJzdHVkZW50c1wiOiBzdHVkZW50c1xyXG4gICAgICB9O1xyXG4gICAgICBkb2N1bWVudHMucHVzaChkb2N1bWVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCLQv9GA0L7QuNC30LLQvtC00YHRgtCy0LXQvdC90L7QuVwiKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZ2FuaXNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgb3JnYW5pc2F0aW9uc1tpXS5zdHVkZW50cyA9IFtdO1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzRm9yRG9jdW1lbnQubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBpZiAoZGF0YVtpXS5ncm91cCA9PT0gZ3JvdXBzRm9yRG9jdW1lbnRbal0ubmFtZSkge1xyXG4gICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBncm91cHNGb3JEb2N1bWVudFtqXS5zdHVkZW50cy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICBpZiAoZGF0YVtpXS5zdHVkZW50ID09PSBncm91cHNGb3JEb2N1bWVudFtqXS5zdHVkZW50c1trXS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YVtpXS5vcmdhbmlzYXRpb24gPT09IG9yZ2FuaXNhdGlvbnNbbl0ubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zW25dLmdyb3VwID0gZ3JvdXBzRm9yRG9jdW1lbnRbal0ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tuXS5vcmdhbml6YXRpb25fbmFtZSA9IG9yZ2FuaXNhdGlvbnNbbl0ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tuXS50ZWFjaGVyID0gZ3JvdXBzRm9yRG9jdW1lbnRbal0udGVhY2hlcjtcclxuICAgICAgICAgICAgICAgICAgbGV0IHN0dWRlbnQgPSBkYXRhW2ldLnN0dWRlbnQ7XHJcbiAgICAgICAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbbl0uc3R1ZGVudHMucHVzaCh7XCJuYW1lXCI6IHN0dWRlbnR9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHNGb3JEb2N1bWVudC5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgb3JnYW5pc2F0aW9uc19mb3JfZG9jdW1lbnQgPSBbXTtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgaWYgKG9yZ2FuaXNhdGlvbnNbal0uZ3JvdXAgPT09IGdyb3Vwc0ZvckRvY3VtZW50W2ldLm5hbWUpIHtcclxuICAgICAgICAgIGxldCBzdHVkZW50cyA9IEpTT04uc3RyaW5naWZ5KG9yZ2FuaXNhdGlvbnNbal0uc3R1ZGVudHMpO1xyXG4gICAgICAgICAgc3R1ZGVudHMgPSBKU09OLnBhcnNlKHN0dWRlbnRzKTtcclxuICAgICAgICAgIGxldCBzdHIgPSBKU09OLnN0cmluZ2lmeShvcmdhbmlzYXRpb25zW2pdLFxyXG4gICAgICAgICAgICAgIFtcIm9yZ2FuaXphdGlvbl9uYW1lXCIsIFwidGVhY2hlclwiXSk7XHJcbiAgICAgICAgICBvcmdhbmlzYXRpb25zW2pdID0gSlNPTi5wYXJzZShzdHIpO1xyXG4gICAgICAgICAgb3JnYW5pc2F0aW9uc1tqXS5zdHVkZW50cyA9IHN0dWRlbnRzO1xyXG4gICAgICAgICAgb3JnYW5pc2F0aW9uc19mb3JfZG9jdW1lbnQucHVzaChvcmdhbmlzYXRpb25zW2pdKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBkb2N1bWVudCA9IHtcclxuICAgICAgICBcImRpcmVjdGlvblwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5mdWxsTmFtZSxcclxuICAgICAgICBcInByb2ZpbGVcIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0ucHJvZmlsZSxcclxuICAgICAgICBcImRlYW5cIjogZGVhbixcclxuICAgICAgICBcImNvdXJzZVwiOiBcIjFcIixcclxuICAgICAgICBcImhlYWRfb2ZfZGVwYXJ0bWVudFwiOiBoZWFkX29mX2RlcGFydG1lbnQsXHJcbiAgICAgICAgXCJ0eXBlX3ByYWN0aWNlXCI6IHR5cGVQcmFjdGljZSxcclxuICAgICAgICBcInN0YXJ0X2RhdGVcIjogc3RhcnRfZGF0ZSxcclxuICAgICAgICBcImVuZF9kYXRlXCI6IGVuZF9kYXRlLFxyXG4gICAgICAgIFwiZ3JvdXBfbmFtZVwiOiBncm91cHNGb3JEb2N1bWVudFtpXS5uYW1lLFxyXG4gICAgICAgIFwic3VwZXJ2aXNvclwiOiBncm91cHNGb3JEb2N1bWVudFtpXS50ZWFjaGVyLFxyXG4gICAgICAgIFwib3JnYW5pemF0aW9uc1wiOiBvcmdhbmlzYXRpb25zX2Zvcl9kb2N1bWVudFxyXG4gICAgICB9O1xyXG4gICAgICBkb2N1bWVudHMucHVzaChkb2N1bWVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgYWxlcnQoXHJcbiAgICAgICAgXCLQktC+0LfQvNC+0LbQvdC+0YHRgtGMINCz0LXQvdC10YDQsNGG0LjQuCDQtNC+0LrRg9C80LXQvdGC0L7QsiDQtNC70Y8g0L/RgNC10LTQtNC40L/Qu9C+0LzQvdC+0Lkg0L/RgNCw0LrRgtC40LrQuCDQsiDRgdGC0LDQtNC40Lgg0YDQsNC30YDQsNCx0L7RgtC60LguINCf0YDQuNC90L7RgdC40Lwg0YHQstC+0Lgg0LjQt9Cy0LjQvdC10L3QuNGPINC30LAg0L/RgNC10LTQvtGB0YLQsNCy0LvQtdC90L3Ri9C1INC90LXRg9C00L7QsdGB0YLQstCwXCIpXHJcbiAgfVxyXG4gIHJldHVybiBkb2N1bWVudHM7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldEVkdWNhdGlvbmFsTGV2ZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHRyZWVWaWV3ID0gMDtcclxuICBsZXQgZnJhbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZyYW1lc1wiKVswXS5jaGlsZHJlbjtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKGZyYW1lc1tpXS5zdHlsZS5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xyXG4gICAgICB0cmVlVmlldyA9IGZyYW1lc1tpXS5jaGlsZHJlblswXTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGxldCBlZHVjYXRpb25hbF9sZXZlbCA9IHRyZWVWaWV3LmdldEF0dHJpYnV0ZShcImlkXCIpO1xyXG4gIGlmIChlZHVjYXRpb25hbF9sZXZlbC5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICByZXR1cm4gXCJiYWNoZWxvclwiO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHJldHVybiBcIm1hc3RlclwiO1xyXG4gIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0SW5mb3JtYXRpb25Gb3JEb2N1bWVudFJlcG9ydCA9IGZ1bmN0aW9uIChwcmFjdGljZSxcclxuICAgIHNlbGVjdGVkR3JvdXBzLCBhbGxHcm91cHMpIHtcclxuICBsZXQgZWR1Y2F0aW9uYWxfbGV2ZWwgPSB0aGlzLmdldEVkdWNhdGlvbmFsTGV2ZWwoKTtcclxuICBsZXQgZ3JvdXBzRm9yRG9jdW1lbnQgPSBbXTtcclxuICBsZXQgYmxvY2tHcm91cHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgXCJncm91cHMtcmVwb3J0LWJsb2NrXCIpLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2dyb3VwJyk7XHJcbiAgbGV0IGFkZGl0aW9uYWxfaW5mbyA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYmxvY2tHcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBncm91cE5hbWUgPSBibG9ja0dyb3Vwc1tpXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaDQnKVswXS5pbm5lckhUTUw7XHJcbiAgICBsZXQgc3VwZXJ2aXNvciA9IGJsb2NrR3JvdXBzW2ldLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXHJcbiAgICAgICAgXCJzdXBlcnZpc29yXCIpWzBdLnZhbHVlO1xyXG4gICAgbGV0IGdvb2Rfc3R1ZGVudHNfbnVtYmVyID0gYmxvY2tHcm91cHNbaV0uZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcclxuICAgICAgICBcImdvb2Rfc3R1ZGVudHNcIilbMF0udmFsdWU7XHJcbiAgICBsZXQgdGVhY2hlcl9udW1iZXIgPSBibG9ja0dyb3Vwc1tpXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxyXG4gICAgICAgIFwidGVhY2hlcl9udW1iZXJcIilbMF0udmFsdWU7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGlmIChzZWxlY3RlZEdyb3Vwc1tqXSA9PT0gZ3JvdXBOYW1lKSB7XHJcbiAgICAgICAgYWRkaXRpb25hbF9pbmZvLnB1c2goe1xyXG4gICAgICAgICAgXCJncm91cE5hbWVcIjogZ3JvdXBOYW1lLFxyXG4gICAgICAgICAgXCJzdXBlcnZpc29yXCI6IHN1cGVydmlzb3IsXHJcbiAgICAgICAgICBcImdvb2Rfc3R1ZF9udW1cIjogZ29vZF9zdHVkZW50c19udW1iZXIsXHJcbiAgICAgICAgICBcInRlYWNoZXJfbnVtYmVyXCI6IHRlYWNoZXJfbnVtYmVyXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLmluZm9Hcm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgaWYgKHNlbGVjdGVkR3JvdXBzW2ldLmluZGV4T2YodGhpcy5pbmZvR3JvdXBzW2pdLm5hbWUpICE9PSAtMVxyXG4gICAgICAgICAgJiYgdGhpcy5pbmZvR3JvdXBzW2pdLnR5cGUgPT09IGVkdWNhdGlvbmFsX2xldmVsKSB7XHJcbiAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCBhbGxHcm91cHMubGVuZ3RoOyBuKyspIHtcclxuICAgICAgICAgIGlmIChzZWxlY3RlZEdyb3Vwc1tpXSA9PT0gYWxsR3JvdXBzW25dLm5hbWUpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBhZGRpdGlvbmFsX2luZm8ubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICBpZiAoc2VsZWN0ZWRHcm91cHNbaV0gPT09IGFkZGl0aW9uYWxfaW5mb1trXS5ncm91cE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGFsbEdyb3Vwc1tuXS5zdXBlcnZpc29yID0gYWRkaXRpb25hbF9pbmZvW2tdLnN1cGVydmlzb3I7XHJcbiAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0uZnVsbE5hbWUgPSB0aGlzLmluZm9Hcm91cHNbal0uZnVsbE5hbWU7XHJcbiAgICAgICAgICAgICAgICBhbGxHcm91cHNbbl0uZ29vZF9zdHVkX251bSA9IGFkZGl0aW9uYWxfaW5mb1trXS5nb29kX3N0dWRfbnVtO1xyXG4gICAgICAgICAgICAgICAgYWxsR3JvdXBzW25dLnRlYWNoZXJfbnVtYmVyID0gYWRkaXRpb25hbF9pbmZvW2tdLnRlYWNoZXJfbnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBzRm9yRG9jdW1lbnQucHVzaChhbGxHcm91cHNbbl0pO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBsZXQgc3RhcnRfZGF0ZSA9IHRoaXMuZm9ybWF0RGF0ZShwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlKTtcclxuICBsZXQgZW5kX2RhdGUgPSB0aGlzLmZvcm1hdERhdGUocHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2UpO1xyXG5cclxuICBsZXQgaGVhZF9vZl9kZXBhcnRtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoZWFkX29mX2RlcGFydG1lbnRcIikudmFsdWU7XHJcbiAgbGV0IGRvY3VtZW50cyA9IFtdO1xyXG4gIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVQcmFjdGljZVRhYlwiKS52YWx1ZTtcclxuICB0eXBlUHJhY3RpY2UgPSB0eXBlUHJhY3RpY2UudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgbGV0IGNvdXJzZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY291cnNlXCIpLnZhbHVlO1xyXG4gIGxldCBiYXNlX3ByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYXNlX3ByYWN0aWNlXCIpLnZhbHVlO1xyXG4gIGxldCBudW1fYmFzZV9wcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2Jhc2VfcHJhY3RpY2VcIikudmFsdWU7XHJcbiAgbGV0IG51bV9sZWN0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2xlY3Rpb25zXCIpLnZhbHVlO1xyXG5cclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGdyb3Vwc0ZvckRvY3VtZW50Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgZG9jdW1lbnQgPSB7XHJcbiAgICAgIFwiZGlyZWN0aW9uXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLmZ1bGxOYW1lLFxyXG4gICAgICBcImNvdXJzZVwiOiBjb3Vyc2UsXHJcbiAgICAgIFwidHlwZV9wcmFjdGljZVwiOiB0eXBlUHJhY3RpY2UsXHJcbiAgICAgIFwic3RhcnRfZGF0ZVwiOiBzdGFydF9kYXRlLFxyXG4gICAgICBcImVuZF9kYXRlXCI6IGVuZF9kYXRlLFxyXG4gICAgICBcImdyb3VwX25hbWVcIjogZ3JvdXBzRm9yRG9jdW1lbnRbaV0ubmFtZSxcclxuICAgICAgXCJiYXNlX3ByYWN0aWNlXCI6IGJhc2VfcHJhY3RpY2UsXHJcbiAgICAgIFwieWVhclwiOiBwcmFjdGljZS55ZWFyLFxyXG4gICAgICBcInRlYWNoZXJfbnVtYmVyXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnRlYWNoZXJfbnVtYmVyLFxyXG4gICAgICBcInN0dWRlbnRfbnVtYmVyXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnN0dWRlbnRzLmxlbmd0aCxcclxuICAgICAgXCJnb29kX3N0dWRfbnVtXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLmdvb2Rfc3R1ZF9udW0sXHJcbiAgICAgIFwibnVtX2Jhc2VfcHJhY3RpY2VcIjogbnVtX2Jhc2VfcHJhY3RpY2UsXHJcbiAgICAgIFwibnVtX2xlY3Rpb25zXCI6IG51bV9sZWN0aW9ucyxcclxuICAgICAgXCJzdXBlcnZpc29yXCI6IGdyb3Vwc0ZvckRvY3VtZW50W2ldLnN1cGVydmlzb3IsXHJcbiAgICAgIFwiaGVhZF9vZl9kZXBhcnRtZW50XCI6IGhlYWRfb2ZfZGVwYXJ0bWVudFxyXG4gICAgfTtcclxuICAgIGRvY3VtZW50cy5wdXNoKGRvY3VtZW50KTtcclxuICB9XHJcbiAgcmV0dXJuIGRvY3VtZW50cztcclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0VmFsdWUgPSBmdW5jdGlvbiAoaWQpIHtcclxuICBsZXQgdmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkub3B0aW9uc1tkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgaWQpLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xyXG4gIHJldHVybiB2YWx1ZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNoYW5nZURpc3BsYXkgPSBmdW5jdGlvbiAoaWQsIHZhbHVlKSB7XHJcbiAgbGV0IGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgZWxlbS5zdHlsZS5kaXNwbGF5ID0gdmFsdWU7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jaGFuZ2VJbm5lckh0bWwgPSBmdW5jdGlvbiAoaWQsIHZhbHVlKSB7XHJcbiAgbGV0IGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XHJcbiAgZWxlbS5pbm5lckhUTUwgPSB2YWx1ZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmZpbGxEaWFsb2cgPSBmdW5jdGlvbiAocHJhY3RpY2UsIG9yZ2FuaXNhdGlvbnMpIHtcclxuICBsZXQgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFzZV9wcmFjdGljZVwiKTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZ2FuaXNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGVsZW0udmFsdWUgKz0gb3JnYW5pc2F0aW9uc1tpXS5uYW1lICsgJywgJztcclxuICB9XHJcbiAgZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibnVtX2Jhc2VfcHJhY3RpY2VcIik7XHJcbiAgZWxlbS52YWx1ZSA9IG9yZ2FuaXNhdGlvbnMubGVuZ3RoO1xyXG5cclxuICBlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJudW1fbGVjdGlvbnNcIik7XHJcbiAgZWxlbS52YWx1ZSA9ICtwcmFjdGljZS5sZWN0aW9uc19udW1iZXI7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnJlYWRUZXh0RmlsZSA9IGZ1bmN0aW9uIChmaWxlLCBjYWxsYmFjaykge1xyXG4gIHZhciByYXdGaWxlID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgcmF3RmlsZS5vdmVycmlkZU1pbWVUeXBlKFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICByYXdGaWxlLm9wZW4oXCJHRVRcIiwgZmlsZSwgdHJ1ZSk7XHJcbiAgcmF3RmlsZS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAocmF3RmlsZS5yZWFkeVN0YXRlID09PSA0ICYmIHJhd0ZpbGUuc3RhdHVzID09IFwiMjAwXCIpIHtcclxuICAgICAgdmFyIHJlcyA9IGNhbGxiYWNrKHJhd0ZpbGUucmVzcG9uc2VUZXh0KTtcclxuICAgICAgdGhpcy5pbmZvR3JvdXBzID0gcmVzO1xyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gIH0uYmluZCh0aGlzKTtcclxuICByYXdGaWxlLnNlbmQobnVsbCk7XHJcbn07XHJcblxyXG4vL3VzYWdlOlxyXG5cclxuU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQXQgPSBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XHJcbiAgcmV0dXJuIHRoaXMuc3Vic3RyKDAsIGluZGV4KSArIHJlcGxhY2VtZW50ICsgdGhpcy5zdWJzdHIoaW5kZXhcclxuICAgICAgKyByZXBsYWNlbWVudC5sZW5ndGgpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBWaWV3O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL1ZpZXcuanMiLCJjb25zdCBTRVBURU1CRVIgPSA5O1xyXG5jb25zdCBmaXJzdENvdXJzZSA9IDA7XHJcbmNvbnN0IHNlY29uZENvdXJzZSA9IDE7XHJcbmNvbnN0IHRoaXJkQ291cnNlID0gMjtcclxuY29uc3QgZm91cnRoQ291cnNlID0gMztcclxuY29uc3QgbWFzdGVyRmlyc3RDb3Vyc2UgPSA0O1xyXG5jb25zdCBtYXN0ZXJTZWNvbmRDb3Vyc2UgPSA1O1xyXG5jb25zdCBSRUpFQ1RFRCA9IDI7XHJcbmNvbnN0IEFQUFJPVkVEID0gMTtcclxuY29uc3QgQVBQTFkgPSAwO1xyXG5jb25zdCBDT05GSUcgPSByZXF1aXJlKCcuLi8uLi9jb25maWcvcmVsX2NvbmZpZycpO1xyXG52YXIgTW9kZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLkdyb3VwcyA9IFtdO1xyXG4gICAgdGhpcy5TdHVkZW50cyA9IFtdO1xyXG4gICAgdGhpcy5Db3Vyc2VzID0gW107XHJcbiAgICB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uID0gW107XHJcbiAgICB0aGlzLk9yZ2FuaXNhdGlvbnMgPSBbXTtcclxuXHJcbn07XHJcblxyXG5jbGFzcyBDb3Vyc2Uge1xyXG4gICAgY29uc3RydWN0b3IobmFtZUNvdXJzZSkge1xyXG4gICAgICAgIHRoaXMubmFtZUNvdXJzZSA9IG5hbWVDb3Vyc2U7XHJcbiAgICAgICAgdGhpcy5ncm91cHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRHcm91cChncm91cCkge1xyXG4gICAgICAgIHRoaXMuZ3JvdXBzLnB1c2goZ3JvdXApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBHcm91cCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1aWRfTERBUCwgbmFtZUdyb3VwKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZUdyb3VwO1xyXG4gICAgICAgIHRoaXMudWlkX0xEQVAgPSB1aWRfTERBUDtcclxuICAgICAgICB0aGlzLnN0dWRlbnRzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgYWRkU3R1ZGVudChzdHVkZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdHVkZW50cy5wdXNoKHN0dWRlbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuTW9kZWwucHJvdG90eXBlLmdldERhdGEgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMpIHtcclxuICAgIGxldCBkYXRhID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLmxlbmd0aDsgKytrLCArK2wpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNTdHVkZW50QXBwbHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goe2dyb3VwOiB0aGlzLkdyb3Vwc1tpXS5uYW1lfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gPSAnICc7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCByZXF1ZXN0c19vcmdhbmlzYXRpb25zLmxlbmd0aDsgKyt3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XS5sZW5ndGg7ICsrbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLmlkX3JlcXVlc3RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA9PT0gK3JlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0uaWRfcmVxdWVzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50X1VJRCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLnVpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5pZF9zdGF0dXMgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdGF0dXMgPSByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLmlkX3N0YXR1cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gPSByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLm5hbWVfb3JnYW5pc2F0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1N0dWRlbnRBcHBseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gKz0gcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5uYW1lX29yZ2FuaXNhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAnLCAnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1N0dWRlbnRBcHBseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNTdHVkZW50QXBwbHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50ID0gdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50X1VJRCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLnVpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gPSBcItCd0LUg0LfQsNC/0LjRgdCw0LvRgdGPXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0R3JvdXBzID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJveHkvY29yZS92MS9ncm91cHMnKTtcclxuICAgIGxldCBsaXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIGxldCBncm91cHMgPSBsaXN0Ll9lbWJlZGRlZC5ncm91cHM7XHJcbiAgICByZXR1cm4gZ3JvdXBzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEdyb3Vwc0J5UHJhY3RpY2VJZCA9IGFzeW5jIGZ1bmN0aW9uIChwcmFjdGljZSkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBpbmZvID0gXCI/aWRfcHJhY3RpY2U9XCJcclxuICAgICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvZ3JvdXBzLWJ5LXByYWN0aWNlLWlkJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICBsZXQgZ3JvdXBzX3VpZHMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgcmV0dXJuIGdyb3Vwc191aWRzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEdyb3Vwc05hbWVCeUdyb3Vwc1VJRCA9IGFzeW5jIGZ1bmN0aW9uICh1aWRzR3JvdXBzKSB7XHJcbiAgICBsZXQgZ3JvdXBzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVpZHNHcm91cHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgIGlmICgrdWlkc0dyb3Vwc1tpXS51aWRfZ3JvdXAgPT09IHRoaXMuR3JvdXBzW2pdLnVpZF9MREFQKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cHMucHVzaCh0aGlzLkdyb3Vwc1tqXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBncm91cHM7XHJcbn07XHJcbi8q0L/QvtC70YPRh9Cw0LXQvCDRgdGC0YPQtNC10L3RgtC+0LIg0LjQtyDRhdGA0LDQvdC40LvQuNGJ0LAgTERBUCDQv9C+IElEINCz0YDRg9C/0L/RiyovXHJcbi8qTW9kZWwucHJvdG90eXBlLmdldFN0dWRlbnRzQnlHcm91cElkID0gYXN5bmMgZnVuY3Rpb24gKGdyb3VwSUQpIHtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcm94eS9jb3JlL3YxL2dyb3Vwcy8nICsgZ3JvdXBJRCk7XHJcbiAgbGV0IGxpc3QgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIGxldCBzdHVkZW50c0xpc3QgPSBsaXN0Ll9lbWJlZGRlZC5zdHVkZW50cztcclxuICByZXR1cm4gc3R1ZGVudHNMaXN0O1xyXG59OyovXHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0U3R1ZGVudHNCeVVJRCA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50c19pbmZvKSB7XHJcbiAgICBsZXQgc3R1ZGVudHMgPSBbXSwgdXJscyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50c19pbmZvLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgdXJscy5wdXNoKCcvcHJveHkvY29yZS92MS9wZW9wbGUvJyArIHN0dWRlbnRzX2luZm9baV0udWlkX3N0dWRlbnQpO1xyXG4gICAgfVxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICApXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICAgICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgICAgICkpXHJcbiAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc0xlbmd0aCA9IHJlc3VsdHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc0xlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBzdHVkZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TmFtZTogcmVzdWx0c1tpXS5kaXNwbGF5TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBncm91cF9uYW1lOiByZXN1bHRzW2ldLl9saW5rcy5ncm91cHNbMF0ubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBncm91cF9VSUQ6IHJlc3VsdHNbaV0uX2xpbmtzLmdyb3Vwc1swXS5pZCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRlX2NyZWF0aW9uX3JlcXVlc3Q6IHN0dWRlbnRzX2luZm9baV0uZGF0ZV9jcmVhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBpZF9yZXF1ZXN0OiBzdHVkZW50c19pbmZvW2ldLmlkX3JlcXVlc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgdWlkX3N0dWRlbnQ6IHN0dWRlbnRzX2luZm9baV0udWlkX3N0dWRlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgaWRfb3JnYW5pc2F0aW9uOiBzdHVkZW50c19pbmZvW2ldLmlkX29yZ2FuaXNhdGlvblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIHJldHVybiBzdHVkZW50cztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0Zyb21MREFQID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGdyb3VwcyA9IGF3YWl0IHRoaXMuZ2V0R3JvdXBzKCk7XHJcbiAgICBsZXQgdXJscyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLkdyb3Vwcy5wdXNoKG5ldyBHcm91cChncm91cHNbaV0uaWQsIGdyb3Vwc1tpXS5uYW1lKSk7XHJcbiAgICAgICAgdXJscy5wdXNoKCcvcHJveHkvY29yZS92MS9ncm91cHMvJyArIGdyb3Vwc1tpXS5pZCk7XHJcbiAgICB9XHJcbiAgICBhd2FpdCB0aGlzLmdldFN0dWRlbnRzQnlHcm91cElkcyh1cmxzKTtcclxufTtcclxuXHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0U3R1ZGVudHNCeUdyb3VwSWRzID0gYXN5bmMgZnVuY3Rpb24gKHVybHMpIHtcclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgICAgICApKVxyXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXNMZW5ndGggPSByZXN1bHRzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXNMZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHN0dWRlbnRzID0gcmVzdWx0c1tpXS5fZW1iZWRkZWQuc3R1ZGVudHM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdExlbmd0aCA9IHN0dWRlbnRzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3RMZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHVkZW50ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnbmFtZSc6IHN0dWRlbnRzW2pdLmRpc3BsYXlOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAndWlkJzogc3R1ZGVudHNbal0udWlkXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50cy5wdXNoKHN0dWRlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0Q3VycmVudFllYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBsZXQgY3VycmVudFllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKTtcclxuICAgIHJldHVybiBjdXJyZW50WWVhcjtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5kaXN0cmlidXRlR3JvdXBzQnlDb3Vyc2VzID0gYXN5bmMgZnVuY3Rpb24gKGN1cnJlbnRZZWFyKSB7XHJcbiAgICB0aGlzLkNvdXJzZXMgPSBbXHJcbiAgICAgICAgbmV3IENvdXJzZSgnMScpLFxyXG4gICAgICAgIG5ldyBDb3Vyc2UoJzInKSxcclxuICAgICAgICBuZXcgQ291cnNlKCczJyksXHJcbiAgICAgICAgbmV3IENvdXJzZSgnNCcpLFxyXG4gICAgICAgIG5ldyBDb3Vyc2UoJzEgKNC80LMpJyksXHJcbiAgICAgICAgbmV3IENvdXJzZSgnMiAo0LzQsyknKVxyXG4gICAgXTtcclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGxldCBjdXJyZW50TW9udGggPSBkYXRlLmdldE1vbnRoKCk7XHJcbiAgICBpZiAoK2N1cnJlbnRNb250aCA8IFNFUFRFTUJFUikge1xyXG4gICAgICAgIGN1cnJlbnRZZWFyIC09IDE7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNvdXJzZXNbbWFzdGVyRmlyc3RDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Db3Vyc2VzW2ZpcnN0Q291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNvdXJzZXNbbWFzdGVyU2Vjb25kQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ291cnNlc1tzZWNvbmRDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRZZWFyLS07XHJcbiAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ291cnNlc1t0aGlyZENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudFllYXItLTtcclxuICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Db3Vyc2VzW2ZvdXJ0aENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudFllYXIgKz0gMztcclxuICAgIH1cclxufTtcclxuTW9kZWwucHJvdG90eXBlLmdldFByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKGluZm9fYWJvdXRfcHJhY3RpY2UpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBpbmZvX2Fib3V0X3ByYWN0aWNlID0gXCI/eWVhcj1cIiArIGluZm9fYWJvdXRfcHJhY3RpY2UueWVhciArIFwiJmVkdV9sZXZlbD1cIlxyXG4gICAgICAgICsgaW5mb19hYm91dF9wcmFjdGljZS5lZHVfbGV2ZWwgKyBcIiZ0eXBlUHJhY3RpY2U9XCJcclxuICAgICAgICArIGluZm9fYWJvdXRfcHJhY3RpY2UudHlwZVByYWN0aWNlO1xyXG4gICAgbGV0IGluZm8gPSAwO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJhY3RpY2UnICsgaW5mb19hYm91dF9wcmFjdGljZSwgcGFyYW1zKVxyXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpbmZvID0gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICByZXR1cm4gaW5mbztcclxufTtcclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RCeVN0dWRlbnRVSUQgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UsIHN0dWRlbnQpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9ICc/dWlkPScgKyBzdHVkZW50LnVpZCArIFwiJmlkX3ByYWN0aWNlPVwiXHJcbiAgICAgICAgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3JlcXVzdC1ieS1zdHVkZW50LXVpZCcgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgbGV0IHJlcXVlc3QgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgcmV0dXJuIHJlcXVlc3Q7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlSWRPcmdhbmlzYXRpb25JblJlcXVlc3QgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudCkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3QgKyBcIiZpZF9vcmdhbmlzYXRpb249XCJcclxuICAgICAgICArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvdXBkYXRlLXJlcXVlc3QnICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0cyA9IGFzeW5jIGZ1bmN0aW9uIChwcmFjdGljZSwgZ3JvdXBzKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IHJlcXVlc3RzID0gW107XHJcbiAgICBsZXQgdXJscyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBsZXQgaW5mbyA9ICc/aWRfc3R1ZGVudD0nICsgZ3JvdXBzW2ldLnN0dWRlbnRzW2pdLnVpZCArIFwiJmlkX3ByYWN0aWNlPVwiXHJcbiAgICAgICAgICAgICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgICAgICAgICB1cmxzLnB1c2goJy9yZXF1c3RzLWJ5LXN0dWRlbnQtcHJhY3RpY2UnICsgaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICApXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICAgICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgICAgICkpXHJcbiAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgcmVxdWVzdHMucHVzaChyZXN1bHRzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlcXVlc3RzOy8v0L/QvtC70YPRh9C40LvQuCBhbGwg0LfQsNGP0LLQvtC6INGB0YLRg9C00LXQvdGC0L7QsiDQstGL0LHRgNCw0L3QvdGL0YUg0LPRgNGD0L/Qv1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmFzc29zaWF0ZVJlcXVlc3RUb1N0dWRlbnQgPSBhc3luYyBmdW5jdGlvbiAocmVxdWVzdHMsIGdyb3Vwcykge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBncm91cHNbal0pIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyArK2spIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHJlcXVlc3RzLmxlbmd0aDsgKytuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS51aWQgPT09IHJlcXVlc3RzW25dLnVpZF9zdHVkZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9yZXF1ZXN0ID0gcmVxdWVzdHNbbl0uaWRfcmVxdWVzdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0c1tuXS5pZF9vcmdhbmlzYXRpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9vcmdhbmlzYXRpb24gPSByZXF1ZXN0c1tuXS5pZF9vcmdhbmlzYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdHNPcmdhbmlzYXRpb25zID0gYXN5bmMgZnVuY3Rpb24gKHNlbGVjdGVkR3JvdXBzKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IHVybHMgPSBbXTtcclxuICAgIGxldCBvcmdhbmlzYXRpb25zX2J5X3JlcXVlc3QgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7ICsraykge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybHMucHVzaCgnL29yZ2FuaXNhdGlvbnMtYnktcmVxdWVzdCcgKyAnP2lkX3JlcXVlc3Q9J1xyXG4gICAgICAgICAgICAgICAgICAgICAgICArIHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLmlkX3JlcXVlc3QpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgIClcclxuICAgICAgICAudGhlbihyZXNwb25zZXMgPT4gUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICAgICAgKSlcclxuICAgICAgICAudGhlbihyZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zX2J5X3JlcXVlc3QucHVzaChyZXN1bHRzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgcmV0dXJuIG9yZ2FuaXNhdGlvbnNfYnlfcmVxdWVzdDtcclxufTtcclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RCeVN0dWRlbnRVSURTID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlLCBzdHVkZW50cykge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCB1cmxzID0gW107XHJcbiAgICBsZXQgcmVxdWVzdHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB1cmxzLnB1c2goJy9yZXF1c3QtYnktc3R1ZGVudC11aWQnICsgJz91aWQ9JyArIHN0dWRlbnRzW2ldLnVpZFxyXG4gICAgICAgICAgICArIFwiJmlkX3ByYWN0aWNlPVwiXHJcbiAgICAgICAgICAgICsgcHJhY3RpY2UuaWRfcHJhY3RpY2UpO1xyXG4gICAgfVxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgdXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgIClcclxuICAgICAgICAudGhlbihyZXNwb25zZXMgPT4gUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgICAgIHJlc3BvbnNlcy5tYXAociA9PiByIGluc3RhbmNlb2YgRXJyb3IgPyByIDogci5qc29uKCkuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICAgICAgKSlcclxuICAgICAgICAudGhlbihyZXN1bHRzID0+IHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0cy5wdXNoKHJlc3VsdHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlcXVlc3RzO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UHJhY3RpY2VZZWFycyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3llYXJzLXByYWN0aWNlJyk7XHJcbiAgICBsZXQgeWVhcnMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgcmV0dXJuIHllYXJzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzT3JnYW5pc2F0aW9uc0J5UmVxdWVzdElkID0gYXN5bmMgZnVuY3Rpb24gKHJlcXVlc3RzKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IHVybHMgPSBbXTtcclxuICAgIGxldCByZXF1ZXN0c19vcmdhbmlzYXRpb25zID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcXVlc3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdXJscy5wdXNoKCcvb3JnYW5pc2F0aW9ucy1ieS1yZXF1ZXN0JyArICc/aWRfcmVxdWVzdD0nICsgcmVxdWVzdHNbaV0uaWRfcmVxdWVzdCk7XHJcbiAgICB9XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChcclxuICAgICAgICB1cmxzLm1hcCh1cmwgPT4gZmV0Y2godXJsLCBwYXJhbXMpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgKVxyXG4gICAgICAgIC50aGVuKHJlc3BvbnNlcyA9PiBQcm9taXNlLmFsbChcclxuICAgICAgICAgICAgcmVzcG9uc2VzLm1hcChyID0+IHIgaW5zdGFuY2VvZiBFcnJvciA/IHIgOiByLmpzb24oKS5jYXRjaChlcnIgPT4gZXJyKSlcclxuICAgICAgICApKVxyXG4gICAgICAgIC50aGVuKHJlc3VsdHMgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMucHVzaChyZXN1bHRzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXF1ZXN0c19vcmdhbmlzYXRpb25zO1xyXG59O1xyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIENSRUFUSU9OXHJcbiBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmluaXQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICAvKmxldCBzdWJJRCA9IFwiNTcyMzhiZDktMzZlOC00ZDg0LTgxNjAtZWI0YWQ5NTdhODQxXCI7XHJcbiAgICBsZXQgdXNlclRva2VuID0gZ2V0VXNlclRva2VuKCksIHVzZXI9MDtcclxuICAgIGlmICghdXNlclRva2VuKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gQ09ORklHLm5vX3Rva2VuX2xvY2F0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBzdWJJRCA9IEpTT04ucGFyc2UoYXRvYih1c2VyVG9rZW4uc3BsaXQoJy4nKVsxXSkpLnN1YjtcclxuICAgICAgdXNlcj0gIGF3YWl0IHRoaXMuZ2V0VXNlckluZm8oc3ViSUQpO1xyXG4gICAgfVxyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBpbmZvID0gJz91c2VyVHlwZT0nICsgdXNlci50eXBlVXNlcjsqL1xyXG4gICAgYXdhaXQgZmV0Y2goJy91c2VyLWNhYmluZXQnICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRVc2VySW5mbyA9IGFzeW5jIGZ1bmN0aW9uIChzdWJJRCkge1xyXG4gICAgbGV0IHVzZXIgPSB7fTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvcGVvcGxlLz91aWQ9JyArIHN1YklEKTtcclxuICAgIGxldCBzdWJqZWN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIGxldCB0eXBlX3VzZXI9c3ViamVjdC5fZW1iZWRkZWQucGVvcGxlW1wiMFwiXS50aXRsZTtcclxuICAgIGlmKHR5cGVfdXNlci5sZW5ndGg9PT0yKXtcclxuICAgICAgICB0eXBlX3VzZXI9c3ViamVjdC5fZW1iZWRkZWQucGVvcGxlW1wiMFwiXS50aXRsZVsxXTtcclxuICAgIH1cclxuICAgIGxldCBnaXZlbk5hbWUgPSBzdWJqZWN0Ll9lbWJlZGRlZC5wZW9wbGVbXCIwXCJdLmdpdmVuTmFtZTtcclxuICAgIGxldCBzbiA9IHN1YmplY3QuX2VtYmVkZGVkLnBlb3BsZVtcIjBcIl0uc247XHJcbiAgICB1c2VyLmZpcnN0TmFtZT1naXZlbk5hbWU7XHJcbiAgICB1c2VyLmxhc3ROYW1lPSBzbjtcclxuICAgIHVzZXIudHlwZVVzZXI9dHlwZV91c2VyO1xyXG4gICAgcmV0dXJuIHVzZXI7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBnZXRVc2VyVG9rZW4oKSB7XHJcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3VzZXItdG9rZW4nKTtcclxufVxyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFR5cGVzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy50eXBlc09yZ2FuaXNhdGlvbiA9IFtdO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvdHlwZXMtb3JnYW5pc2F0aW9uJyk7XHJcbiAgICBsZXQgdHlwZXMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgdGhpcy50eXBlc09yZ2FuaXNhdGlvbiA9IHR5cGVzO1xyXG4gICAgcmV0dXJuIHRoaXMudHlwZXNPcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb25zJyk7XHJcbiAgICBsZXQgb3JncyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICB0aGlzLk9yZ2FuaXNhdGlvbnMgPSBvcmdzO1xyXG4gICAgcmV0dXJuIHRoaXMuT3JnYW5pc2F0aW9ucztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zQnlQcmFjdGljZUlkID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAnP2lkX3ByYWN0aWNlPScgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbnMtYnktcHJhY3RpY2UnICsgaW5mbywgcGFyYW1zKTtcclxuICAgIGxldCBvcmdhbmlzYXRpb25zID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHJldHVybiBvcmdhbmlzYXRpb25zO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbkJ5SWQgPSBhc3luYyBmdW5jdGlvbiAoaWQpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9ICc/aWQ9JyArIGlkO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9uLWJ5LWlkJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHJldHVybiBvcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdHNCeVByYWN0aWNlSWQgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9ICc/aWRfcHJhY3RpY2U9JyArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcmVxdWVzdHMtYnktcHJhY3RpY2UnICsgaW5mbywgcGFyYW1zKTtcclxuICAgIGxldCByZXF1ZXN0cyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gcmVxdWVzdHM7XHJcbn07XHJcblxyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzQnlPcmdhbmlzYXRpb25OYW1lID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByYWN0aWNlLCBpc0FwcHJvdmVkKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAwLCBTVEFUVVM7XHJcbiAgICBpZiAoIWlzQXBwcm92ZWQpIHtcclxuICAgICAgICBpbmZvID0gXCI/aWRfcHJhY3RpY2U9XCIgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgICAgICBTVEFUVVMgPSAwO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaW5mbyA9IFwiP2lkX3ByYWN0aWNlPVwiICsgcHJhY3RpY2UuaWRfcHJhY3RpY2UgKyBcIiZpZF9vcmdhbmlzYXRpb249XCJcclxuICAgICAgICAgICAgKyBvcmdhbmlzYXRpb24uaWQ7XHJcbiAgICAgICAgU1RBVFVTID0gMTtcclxuICAgIH1cclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3JlcXVlc3RzLWJ5LXByYWN0aWNlJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICBsZXQgcmVxdWVzdHMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgbGV0IHN0dWRlbnRzID0gW107XHJcbiAgICBsZXQgdXJscyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXF1ZXN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHVybHMucHVzaChcIi9leGlzdC1yZXF1ZXN0P2lkX3JlcXVlc3Q9XCIgKyByZXF1ZXN0c1tpXS5pZF9yZXF1ZXN0XHJcbiAgICAgICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiXHJcbiAgICAgICAgICAgICsgb3JnYW5pc2F0aW9uLmlkKTtcclxuICAgIH1cclxuICAgIGF3YWl0IFByb21pc2UuYWxsKFxyXG4gICAgICAgIHVybHMubWFwKHVybCA9PiBmZXRjaCh1cmwsIHBhcmFtcykuY2F0Y2goZXJyID0+IGVycikpXHJcbiAgICApXHJcbiAgICAgICAgLnRoZW4ocmVzcG9uc2VzID0+IFByb21pc2UuYWxsKFxyXG4gICAgICAgICAgICByZXNwb25zZXMubWFwKHIgPT4gciBpbnN0YW5jZW9mIEVycm9yID8gciA6IHIuanNvbigpLmNhdGNoKGVyciA9PiBlcnIpKVxyXG4gICAgICAgICkpXHJcbiAgICAgICAgLnRoZW4ocmVzdWx0cyA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc0xlbmd0aCA9IHJlc3VsdHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0c1tpXSAhPT0gJ05vdCBmb3VuZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0c1tpXS5pZF9zdGF0dXMgPT09IFNUQVRVUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHVkZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX3JlcXVlc3Q6IHJlc3VsdHNbaV0uaWRfcmVxdWVzdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkX29yZ2FuaXNhdGlvbjogcmVzdWx0c1tpXS5pZF9vcmdhbmlzYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZF9zdGF0dXM6IHJlc3VsdHNbaV0uaWRfc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWlkX3N0dWRlbnQ6IHJlcXVlc3RzW2ldLnVpZF9zdHVkZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRfcHJhY3RpY2U6IHJlcXVlc3RzW2ldLmlkX3ByYWN0aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRfcmV2aWV3OiByZXF1ZXN0c1tpXS5pZF9yZXZpZXcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRlX2NyZWF0aW9uOiByZXN1bHRzW2ldLmRhdGVfY3JlYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICByZXR1cm4gc3R1ZGVudHM7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9uQnlOYW1lID0gYXN5bmMgZnVuY3Rpb24gKG5hbWVPcmdhbmlzYXRpb24pIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9ICc/bmFtZT0nICsgbmFtZU9yZ2FuaXNhdGlvbjtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbi1ieS1uYW1lJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHJldHVybiBvcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0RGV0ZXJtaW5lZEdyb3VwcyA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZEdyb3Vwcykge1xyXG4gICAgbGV0IGRldGVybWluZWRHcm91cHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgZGV0ZXJtaW5lZEdyb3Vwcy5wdXNoKHRoaXMuR3JvdXBzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBkZXRlcm1pbmVkR3JvdXBzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZU9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbi1jcmVhdGUnLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvcmdhbmlzYXRpb24pXHJcbiAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INC+0YDQs9Cw0L3QuNC30LDRhtC40Lgg0LIg0JHQlCBcIiArIGVycm9yKTtcclxuICAgICAgICB9KTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tdXBkYXRlJywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkob3JnYW5pc2F0aW9uKVxyXG4gICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQvtGA0LPQsNC90LjQt9Cw0YbQuNC4INCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuY3JlYXRlUHJhY3RpY2UgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3ByYWN0aWNlJywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocHJhY3RpY2UpXHJcbiAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INC/0YDQsNC60YLQuNC60Lgg0LIg0JHQlCBcIiArIGVycm9yKTtcclxuICAgICAgICB9KTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVPclVwZGF0ZVN0dWRlbnRzID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9zdHVkZW50cycsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHN0dWRlbnRzKVxyXG4gICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCB1aWQg0YHRgtGD0LTQtdC90YLQvtCyINCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlUmVxdWVzdE9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50KSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgdmFyIGN1cnJlbnREYXRlID0gZGF0ZS5mb3JtYXQoXCJ5eXl5LW1tLWRkXCIpO1xyXG4gICAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdFxyXG4gICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiICsgc3R1ZGVudC5pZF9vcmdhbmlzYXRpb24gKyBcIiZpZF9zdGF0dXM9XCJcclxuICAgICAgICArIHN0dWRlbnQuaWRfc3RhdHVzICsgXCImZGF0ZV9jcmVhdGlvbj1cIlxyXG4gICAgICAgICsgY3VycmVudERhdGU7XHJcbiAgICBhd2FpdCBmZXRjaCgnL3VwZGF0ZS1yZXF1ZXN0LW9yZ2FuaXNhdGlvbicgKyBpbmZvLCBwYXJhbXMpO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IHVybHMgPSBbXTtcclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIHZhciBjdXJyZW50RGF0ZSA9IGRhdGUuZm9ybWF0KFwieXl5eS1tbS1kZFwiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudHNbaV0uaWRfcmVxdWVzdFxyXG4gICAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnRzW2ldLmlkX29yZ2FuaXNhdGlvbiArIFwiJmlkX3N0YXR1cz1cIlxyXG4gICAgICAgICAgICArIHN0dWRlbnRzW2ldLmlkX3N0YXR1cyArIFwiJmRhdGVfY3JlYXRpb249XCJcclxuICAgICAgICAgICAgKyBjdXJyZW50RGF0ZTtcclxuICAgICAgICB1cmxzLnB1c2goJy91cGRhdGUtcmVxdWVzdC1vcmdhbmlzYXRpb24nICsgaW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwodXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSkpO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3RPcmdhbmlzYXRpb25CeVJlcXVlc3QgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudCkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0ICsgXCImaWRfc3RhdHVzPVwiXHJcbiAgICAgICAgKyBzdHVkZW50LmlkX3N0YXR1cyArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnQuaWRfb3JnYW5pc2F0aW9uO1xyXG4gICAgYXdhaXQgZmV0Y2goJy91cGRhdGUtcmVxdWVzdC1vcmdhbmlzYXRpb24tYnktcmVxdWVzdCcgKyBpbmZvLCBwYXJhbXMpO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlUmVxdWVzdHNPcmdhbmlzYXRpb25CeVJlcXVlc3QgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudHMpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgdXJscyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0XHJcbiAgICAgICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiICsgc3R1ZGVudHNbaV0uaWRfb3JnYW5pc2F0aW9uICsgXCImaWRfc3RhdHVzPVwiXHJcbiAgICAgICAgICAgICsgc3R1ZGVudHNbaV0uaWRfc3RhdHVzO1xyXG4gICAgICAgIHVybHMucHVzaCgnL3VwZGF0ZS1yZXF1ZXN0LW9yZ2FuaXNhdGlvbi1ieS1yZXF1ZXN0JyArIGluZm8pO1xyXG4gICAgfVxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwodXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSkpO1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuaW5zZXJ0UmVxdWVzdE9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50KSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgdmFyIGN1cnJlbnREYXRlID0gZGF0ZS5mb3JtYXQoXCJ5eXl5LW1tLWRkXCIpO1xyXG4gICAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnQuaWRfcmVxdWVzdCArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIlxyXG4gICAgICAgICsgc3R1ZGVudC5pZF9vcmdhbmlzYXRpb24gKyBcIiZpZF9zdGF0dXM9XCIgKyBzdHVkZW50LmlkX3N0YXR1c1xyXG4gICAgICAgICsgXCImZGF0ZV9jcmVhdGlvbj1cIlxyXG4gICAgICAgICsgY3VycmVudERhdGU7XHJcbiAgICBhd2FpdCBmZXRjaCgnL2luc2VydC1yZXF1ZXN0LW9yZ2FuaXNhdGlvbicgKyBpbmZvLCBwYXJhbXMpO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3QgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudCkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBpbmZvID0gMDtcclxuICAgIGlmIChzdHVkZW50LmlkX3N0YXR1cyA9PT0gUkVKRUNURUQpIHtcclxuICAgICAgICBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50LmlkX3JlcXVlc3RcclxuICAgICAgICAgICAgKyBcIiZpZF9vcmdhbmlzYXRpb249bnVsbFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudC5pZF9yZXF1ZXN0XHJcbiAgICAgICAgICAgICsgXCImaWRfb3JnYW5pc2F0aW9uPVwiICsgc3R1ZGVudC5pZF9vcmdhbmlzYXRpb247XHJcbiAgICB9XHJcbiAgICBhd2FpdCBmZXRjaCgnL3VwZGF0ZS1yZXF1ZXN0JyArIGluZm8sIHBhcmFtcyk7XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS51cGRhdGVSZXF1ZXN0cyA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50cykge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBpbmZvID0gMDtcclxuICAgIGxldCB1cmxzID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHVkZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBpbmZvID0gMDtcclxuICAgICAgICBpZiAoc3R1ZGVudHNbaV0uaWRfc3RhdHVzID09PSBSRUpFQ1RFRCkge1xyXG4gICAgICAgICAgICBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0XHJcbiAgICAgICAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1udWxsXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0XHJcbiAgICAgICAgICAgICAgICArIFwiJmlkX29yZ2FuaXNhdGlvbj1cIiArIHN0dWRlbnRzW2ldLmlkX29yZ2FuaXNhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXJscy5wdXNoKCcvdXBkYXRlLXJlcXVlc3QnICsgaW5mbyk7XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwodXJscy5tYXAodXJsID0+IGZldGNoKHVybCwgcGFyYW1zKS5jYXRjaChlcnIgPT4gZXJyKSkpO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdlbmVyYXRlRG9jdW1lbnQgPSBhc3luYyBmdW5jdGlvbiAoZG9jdW1lbnQsIHR5cGVfZG9jdW1lbnQsIHR5cGVfcHJhY3RpY2UpIHtcclxuICAgIHR5cGVfcHJhY3RpY2UgPSB0eXBlX3ByYWN0aWNlLnRvTG93ZXJDYXNlKCk7XHJcbiAgICBsZXQgaW5mb3JtYXRpb24gPSB7XHJcbiAgICAgICAgZGF0YTogZG9jdW1lbnQsXHJcbiAgICAgICAgdHlwZV9kb2N1bWVudDogdHlwZV9kb2N1bWVudCxcclxuICAgICAgICB0eXBlX3ByYWN0aWNlOiB0eXBlX3ByYWN0aWNlXHJcbiAgICB9O1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvZG9jdW1lbnQnLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShpbmZvcm1hdGlvbilcclxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3ApIHtcclxuICAgICAgICByZXR1cm4gcmVzcC5ibG9iKCk7XHJcbiAgICB9KS50aGVuKGZ1bmN0aW9uIChibG9iKSB7XHJcbiAgICAgICAgc2F2ZUFzKGJsb2IsIHR5cGVfZG9jdW1lbnQgKyAnICcgKyB0eXBlX3ByYWN0aWNlICsgJyDQv9GA0LDQutGC0LjQutCwICcgKyBkb2N1bWVudC5ncm91cF9uYW1lICsgXCIuZG9jeFwiKTtcclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQs9C10L3QtdGA0LDRhtC40Lgg0LTQvtC60YPQvNC10L3RgtCwIFwiICsgZXJyb3IpO1xyXG4gICAgfSk7XHJcbiAgICBkZWJ1Z2dlcjtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDtcclxuXHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL01vZGVsLmpzIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBcInNlcnZlcl9wb3J0XCI6IDc3NzcsXHJcbiAgICBcInVzZV9wcm94eVwiOiBmYWxzZSxcclxuICAgIFwic3VwZXJ2aXNvcl9wYXRoXCI6IFwiL3N1cGVydmlzb3JfY2FiaW5ldFwiLFxyXG4gICAgXCJzdHVkZW50X3BhdGhcIjogXCIvc3R1ZGVudF9jYWJpbmV0XCIsXHJcbiAgICBcIm5vX3Rva2VuX2xvY2F0aW9uXCI6IFwiaHR0cDovL2VzYi5paXBvLnR1LWJyeWFuc2sucnUvYXV0aGVudGljYXRpb24vP3JlZGlyZWN0PWh0dHA6Ly9lc2IuaWlwby50dS1icnlhbnNrLnJ1L3ByYWN0aWNlL1wiLFxyXG4gICAgXCJvcmlnaW5fbG9jYXRpb25cIjogXCIvcHJhY3RpY2UvXCIsXHJcbiAgICBcImRiXCI6IFwicHJhY3RpY2VcIixcclxuICAgIFwicHJveHlcIjogXCJodHRwOi8vZXNiLmlpcG8udHUtYnJ5YW5zay5ydVwiXHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBjb25maWcvcmVsX2NvbmZpZy5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby5jc3Ncbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWljb25zLmNzc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tc2NoZW1lcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBbe1wibmFtZVwiOlwi0JzQntCQXCIsXCJmdWxsTmFtZVwiOlwiMDIuMDMuMDMgwqvQnNCw0YLQtdC80LDRgtC40YfQtdGB0LrQvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0Lgg0LDQtNC80LjQvdC40YHRgtGA0LjRgNC+0LLQsNC90LjQtSDQuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXCJwcm9maWxlXCI6XCLCq9Ci0LXRhdC90L7Qu9C+0LPQuNGPINC/0YDQvtCz0YDQsNC80LzQuNGA0L7QstCw0L3QuNGPwrtcIixcInR5cGVcIjpcImJhY2hlbG9yXCJ9LHtcIm5hbWVcIjpcItCf0KDQmFwiLFwiZnVsbE5hbWVcIjpcIjA5LjAzLjA0IMKr0J/RgNC+0LPRgNCw0LzQvNC90LDRjyDQuNC90LbQtdC90LXRgNC40Y/Cu1wiLFwicHJvZmlsZVwiOlwiwqvQoNCw0LfRgNCw0LHQvtGC0LrQsCDQv9GA0L7Qs9GA0LDQvNC80L3Qvi3QuNC90YTQvtGA0LzQsNGG0LjQvtC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXCJ0eXBlXCI6XCJiYWNoZWxvclwifSx7XCJuYW1lXCI6XCLQmNCS0KItMVwiLFwiZnVsbE5hbWVcIjpcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXCJ0eXBlXCI6XCJiYWNoZWxvclwifSx7XCJuYW1lXCI6XCLQmNCS0KItMlwiLFwiZnVsbE5hbWVcIjpcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXCJ0eXBlXCI6XCJiYWNoZWxvclwifSx7XCJuYW1lXCI6XCLQmNCS0KItM1wiLFwiZnVsbE5hbWVcIjpcIjA5LjAzLjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0J/RgNC+0LPRgNCw0LzQvNC90L7QtSDQvtCx0LXRgdC/0LXRh9C10L3QuNC1INCy0YvRh9C40YHQu9C40YLQtdC70YzQvdC+0Lkg0YLQtdGF0L3QuNC60Lgg0Lgg0LDQstGC0L7QvNCw0YLQuNC30LjRgNC+0LLQsNC90L3Ri9GFINGB0LjRgdGC0LXQvMK7XCIsXCJ0eXBlXCI6XCJiYWNoZWxvclwifSx7XCJuYW1lXCI6XCLQn9Cg0JggKNC80LMpXCIsXCJmdWxsTmFtZVwiOlwiMDkuMDQuMDQgwqvQn9GA0L7Qs9GA0LDQvNC80L3QsNGPINC40L3QttC10L3QtdGA0LjRj8K7XCIsXCJwcm9maWxlXCI6XCLCq9Cf0YDQvtC10LrRgtC40YDQvtCy0LDQvdC40LUg0L/RgNC+0LPRgNCw0LzQvNC90L4t0LjQvdGE0L7RgNC80LDRhtC40L7QvdC90YvRhSDRgdC40YHRgtC10LzCu1wiLFwidHlwZVwiOlwibWFzdGVyXCJ9LHtcIm5hbWVcIjpcItCY0JLQoi0xICjQvNCzKVwiLFwiZnVsbE5hbWVcIjpcIjA5LjA0LjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0JrQvtC80L/RjNGO0YLQtdGA0L3Ri9C5INCw0L3QsNC70LjQtyDQuCDQuNC90YLQtdGA0L/RgNC10YLQsNGG0LjRjyDQtNCw0L3QvdGL0YXCu1wiLFwidHlwZVwiOlwibWFzdGVyXCJ9LHtcIm5hbWVcIjpcItCY0JLQoi0yICjQvNCzKVwiLFwiZnVsbE5hbWVcIjpcIjA5LjA0LjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0JjQvdGE0L7RgNC80LDRhtC40L7QvdC90L7QtSDQuCDQv9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90YvRhSDRgdC40YHRgtC10LzCu1wiLFwidHlwZVwiOlwibWFzdGVyXCJ9LHtcIm5hbWVcIjpcItCR0JDQoVwiLFwiZnVsbE5hbWVcIjpcIjA5LjA0LjAxIMKr0JjQvdGE0L7RgNC80LDRgtC40LrQsCDQuCDQstGL0YfQuNGB0LvQuNGC0LXQu9GM0L3QsNGPINGC0LXRhdC90LjQutCwwrtcIixcInByb2ZpbGVcIjpcIsKr0JjQvdGE0L7RgNC80LDRhtC40L7QvdC90L7QtSDQuCDQv9GA0L7Qs9GA0LDQvNC80L3QvtC1INC+0LHQtdGB0L/QtdGH0LXQvdC40LUg0LLRi9GH0LjRgdC70LjRgtC10LvRjNC90YvRhSDRgdC40YHRgtC10LzCu1wiLFwidHlwZVwiOlwiYmFjaGVsb3JcIn1dXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvYXNzZXRzL2pzb24vZGF0YS5qc29uXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3Mvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUM1WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFHQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQWJBO0FBZUE7QUFqQkE7QUF1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQUNBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUdBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUZBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWQTtBQVlBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWEE7QUFhQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFmQTtBQWlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3oxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQUNBO0FBV0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBT0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFDQTtBQU1BO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUN2eUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7OztBIiwic291cmNlUm9vdCI6IiJ9
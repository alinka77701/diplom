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

/*========================================PRACTICE SECTION================================================*/
Controller.prototype.displayGroups = function () {
    this.View.displayGroups();
};

Controller.prototype.dialogPracticeCreatedInit = function () {
    this.View.dialogPracticeCreatedInit();
};

Controller.prototype.createNewOrganisation = async function () {
    let organisation = this.View.getInfoNewOrganisation();
    await this.Model.createOrUpdateOrganisation(organisation);
    await this.updateTypesOrganisation();
};

Controller.prototype.createPractice = async function () {
    this.View.Wait();
    let practice = this.View.Practice;
    let groups = await this.Model.getDeterminedGroups(practice.groups);
    practice.groups = groups;
    await this.Model.createPractice(practice);
    this.View.Stop();
    this.goToStudentsSection();
};

/*============================================STUDENTS SECTION=====================================================*/
Controller.prototype.renderGroupsTreeView = async function () {
    if (this.View.selectedYear !== " + ") {
        await this.Model.distributeGroupsByCourses(this.View.selectedYear);
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
    let groupsObjects = [];
    for (let i = 0; i < this.Model.Groups.length; i++) {
        for (let j = 0; j < selectedGroups.length; j++) {
            if (this.Model.Groups[i].name === selectedGroups[j]) {
                groupsObjects.push(this.Model.Groups[i]);
            }
        }
    }

    let info_about_practice = this.View.getUserInfoAboutPractice();
    let practice = await this.Model.getPractice(info_about_practice);
    let data = 0,
        requests_organisations;
    if (practice.length !== 0) {
        let requests = await this.Model.getRequests(practice, groupsObjects);
        await this.Model.assosiateRequestToStudent(requests, selectedGroups);
        requests_organisations = await this.Model.getRequestsOrganisations(selectedGroups);
        data = await this.Model.getData(selectedGroups, requests_organisations);
        if (data.length === 0) {
            data = 0;
            this.View.renderTable(data);
        } else this.View.renderTable(data);
        this.View.colorTable(data);
    }

    this.View.renderInfo(practice);
};

Controller.prototype.getOrganisations = function () {
    this.View.getConfigurations();
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
  this.idTreeViews = ['group-treeview-tabcontrol1-bachelor', 'group-treeview-tabcontrol2-master', 'groups-treeview-practice-creation-bachelor', 'groups-treeview-practice-creation-master'];
  this.onClickGetOrganisations = null;
  this.onClickCreateOrganisation = null;
  this.Practice = null;
};

View.prototype.init = function () {
  document.getElementsByClassName("btn-next")[0].addEventListener('click', this.onClickNextStep);
  document.querySelector("#dialogPracticeCompleteSuccess").querySelector("#practiceFinishedOk").addEventListener('click', this.onClickPracticeCompleted);
  document.getElementById("createPracticeBtn").addEventListener('click', this.onClickCreatePractice);
  document.getElementById("organisationsSectionBtn").addEventListener('click', this.onClickToOrganisationsSection);
  document.getElementById("studentsSectionBtn").addEventListener('click', this.onClickToStudentsSection);
  document.getElementsByClassName("btn-finish")[0].addEventListener('click', this.onClickFinishBtn);
  document.getElementById("getGroupsBtnOk").addEventListener('click', this.onClickSelectGroupBtnOk);
  document.getElementById("buttonsArray").addEventListener('click', this.onClickYearsArray);
  document.getElementById("buttonsArray1").addEventListener('click', this.onClickYearsArray);
  document.getElementById("getOrganisationsBtnOk").addEventListener('click', this.onClickGetOrganisations);
  document.getElementById("createOrganisation").addEventListener('click', this.onClickCreateOrganisation);
  document.getElementById("practiceFinishedOk").addEventListener('click', this.onClickAddPractice);
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
  let treeViews = document.getElementsByClassName("treeview ");
  for (let i = 0; i < treeViews.length; i++) {
    treeViews[i].style.display = "block";
  }
};

View.prototype.goToOrganisationsSection = function () {
  document.querySelector("#practiceCreationSection").style.display = "none";
  document.querySelector("#mainWindowSection").style.display = "none";
  document.querySelector("#organisationsSection").style.display = "block";
};

View.prototype.goToPracticeCreation = function () {
  document.querySelector("#practiceCreationSection").style.display = "block";
  document.querySelector("#mainWindowSection").style.display = "none";
};
/*========================================PRACTICE SECTION==============================================*/
View.prototype.dialogPracticeCreatedInit = function () {
  let finishBtn = document.getElementsByClassName("btn-finish")[0];
  finishBtn.setAttribute("onclick", "metroDialog.open('#dialogPracticeCompleteSuccess')");
  let educationLevel = document.getElementById("selectEducation").value;
  let typePracticeText = "Учебная";
  let typePractice = document.getElementById("selectTypePractice").value;
  let educationLevelText = "Бакалавриат";
  if (educationLevel === "bachelor") {
    educationLevelText = "Бакалавриат";
  } else {
    educationLevelText = "Магистратура";
  }
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

  if (typePractice === "educational") {
    typePracticeText = "Учебная";
  } else if (typePractice === "internship") {
    typePracticeText = "Производственная";
  } else if (typePractice === "prediploma") {
    typePracticeText = "Преддипломная";
  }
  let treeView = null;
  for (let i = 0; i < this.idTreeViews.length; i++) {
    if (this.idTreeViews[i].indexOf("practice") !== -1 && document.getElementById(this.idTreeViews[i]).style.display === "block") {
      treeView = document.getElementById(this.idTreeViews[i]);
    }
  }
  let arrGroups = this.getSelectedGroups(treeView);
  let arrOrganisations = this.getSelectedGroups(document.getElementById("organisations-treeview-practice-creation"));

  document.getElementById("typePracticeDialog").innerHTML = typePracticeText;
  document.getElementById("educationalLevelDialog").innerHTML = educationLevelText;
  document.getElementById("groupsPracticeDialog").innerHTML = arrGroups;
  document.getElementById("organisationsPracticeDialog").innerHTML = arrOrganisations;

  document.getElementById("mainWindowTypePractice").innerHTML = typePracticeText + " практика";

  document.getElementById("lecNumDialog").innerHTML = lecNum;
  this.Practice = {
    'typePractice': typePracticeText,
    'startDatePractice': fromDate,
    'endDatePractice': toDate,
    'deadlinePractice': deadline,
    'lecNum': lecNum,
    'eduLevel': educationLevelText,
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
    document.getElementById("mainWindowTermsPractice").innerHTML = 'с ' + practice.start_date_practice + ' по ' + practice.end_date_practice;
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
    if (data[i].status) {
      $(this.myTable.dataTable().fnGetNodes(i)).addClass("approved_stud");
      this.myTable.dataTable().fnGetNodes(i).children[0].setAttribute("class", "sorting_1 approved_stud");
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
  while (target != buttonsArray) {
    if (target.className == 'item year') {
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
      if (frames[i].style.display == "block") {
        treeView = frames[i].children[0];
        break;
      }
    }
  }
  let Groups = [];
  let liNumber = treeView.querySelectorAll('li');
  for (let i = 0; i < liNumber.length; i++) {
    let groups = liNumber[i].querySelectorAll('input:checked');
    if (groups.length == 1) {
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

function tree_add_leaf_checkbox_example_click(tree, node, nameLeaf) {
  tree.addLeaf(node, nameLeaf, {
    mode: 'checkbox',
    checked: false
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
View.prototype.updateGroupsTreeView = async function (courses) {
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
        tree_add_leaf_checkbox_example_click(tree, node, courses[i].groups[j]);
      }
      cnt++;
    }
    idCounter++;
  }
};

View.prototype.getConfigurations = function () {
  let typePractice = document.getElementById("selectTypePracticeOrganisationSec").value;
  let eduLevel = document.getElementById("selectEduLevelOrganisationSec").value;
  let years = document.getElementsByClassName("years");
  console.log(typePractice);
  console.log(eduLevel);
  console.log(this.selectedYear);
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
    'addressOrg': document.getElementById("addressOrg").value
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

View.prototype.Wait = function () {
  metroDialog.open('#dialogWaiting');
};

View.prototype.Stop = function () {
  metroDialog.close('#dialogWaiting');
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

/*получаем студентов из хранилища LDAP по ID группы*/
Model.prototype.getStudentsByGroupId = async function (groupID) {
  let result = await fetch('/proxy/core/v1/groups/' + groupID);
  let list = await result.json();
  let studentsList = list._embedded.students;
  return studentsList;
};

/*получаем группы и их студентов из хранилища LDAP, обновляем таблицу Students*/
Model.prototype.init = async function () {
  let groups = await this.getGroups();

  for (let i = 0; i < groups.length; i++) {
    this.Groups.push(new Group(groups[i].id, groups[i].name));
  }

  for (let i = 0, n = 0; i < this.Groups.length; ++i) {
    let studentsList = await this.getStudentsByGroupId(this.Groups[i].uid_LDAP);
    for (let j = 0; j < studentsList.length; ++j, n++) {
      let student = {
        'name': studentsList[j].displayName,
        'uid': studentsList[j].uid
      };
      this.Groups[i].addStudent(student);
    }
    //await this.createOrUpdateStudents(this.Groups[i].students);
  }
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

Model.prototype.getRequests = async function (practice, groups) {
  let params = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin'
  };
  let requests = [];
  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < groups[i].students.length; j++) {
      let info = '?id_student=' + groups[i].students[j].uid + "&id_practice=" + practice.id_practice;
      let result = await fetch('/filter-requsts' + info, params);
      info = await result.json();
      requests.push(info);
    }
  }
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
  let organisations_by_request = [];
  for (let i = 0; i < this.Groups.length; ++i) {
    for (let j = 0; j < selectedGroups.length; ++j) {
      if (this.Groups[i].name === selectedGroups[j]) {
        for (let k = 0; k < this.Groups[i].students.length; ++k) {
          let info = '?id_request=' + this.Groups[i].students[k].id_request;
          let result = await fetch('/organisations-by-request' + info, params);
          info = await result.json();
          organisations_by_request.push(info);
        }
      }
    }
  }
  return organisations_by_request;
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

Model.prototype.createOrUpdateOrganisation = async function (organisation) {
  let result = await fetch('/organisation', {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGQ1MWNiZTBhMzM4MzJmZTNjNTc5Iiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9saWJzL0RhdGFUYWJsZXMvZGF0YXRhYmxlcy5taW4uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkNTFjYmUwYTMzODMyZmUzYzU3OSIsImNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlICgnLi9Db250cm9sbGVyLmpzJyk7XHJcblxyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzJyk7XHJcbnJlcXVpcmUoJy4vbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcycpO1xyXG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgbmV3IENvbnRyb2xsZXIoKTtcclxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9tYWluLmpzIiwiY29uc3QgVmlldyA9IHJlcXVpcmUoJy4vVmlldy5qcycpO1xyXG5jb25zdCBNb2RlbCA9IHJlcXVpcmUoJy4vTW9kZWwuanMnKTtcclxuXHJcbmZ1bmN0aW9uIENvbnRyb2xsZXIoKSB7XHJcbiAgICB0aGlzLlZpZXcgPSBuZXcgVmlldygpO1xyXG4gICAgdGhpcy5Nb2RlbCA9IG5ldyBNb2RlbCgpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbn1cclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmluaXQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja05leHRTdGVwID0gdGhpcy5kaXNwbGF5R3JvdXBzLmJpbmQodGhpcyk7XHJcbiAgICAvLyB0aGlzLlZpZXcub25DbGlja1ByYWN0aWNlQ29tcGxldGVkID0gdGhpcy5nb1RvU3R1ZGVudHNTZWN0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZVByYWN0aWNlID0gdGhpcy5nb1RvUHJhY3RpY2VDcmVhdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tBZGRQcmFjdGljZSA9IHRoaXMuY3JlYXRlUHJhY3RpY2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IHRoaXMuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uID0gdGhpcy5nb1RvU3R1ZGVudHNTZWN0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0ZpbmlzaEJ0biA9IHRoaXMuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rID0gdGhpcy5yZW5kZXJEYXRhSW5UYWJsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tZZWFyc0FycmF5ID0gdGhpcy5zZXRHcm91cHNUcmVlVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tHZXRPcmdhbmlzYXRpb25zID0gdGhpcy5nZXRPcmdhbmlzYXRpb25zLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbiA9IHRoaXMuY3JlYXRlTmV3T3JnYW5pc2F0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcuaW5pdCgpO1xyXG4gICAgYXdhaXQgdGhpcy5Nb2RlbC5pbml0KCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nb1RvU3R1ZGVudHNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmdvVG9TdHVkZW50c1NlY3Rpb24oKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9QcmFjdGljZUNyZWF0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcclxuICAgIGF3YWl0IHRoaXMucmVuZGVyR3JvdXBzVHJlZVZpZXcoKTtcclxuICAgIHRoaXMuVmlldy5jbGVhclByYWN0aWNlU2VjdGlvbigpO1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0KHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5nb1RvUHJhY3RpY2VDcmVhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LmNsZWFyVHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvbih0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xyXG4gICAgdGhpcy5WaWV3LnNldE9yZ2FuaXNhdGlvbnNJblRyZWVWaWV3KG9yZ2FuaXNhdGlvbnMsIHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHJldHVybiB0eXBlc09yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5kaXNwbGF5R3JvdXBzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmRpc3BsYXlHcm91cHMoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCgpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuY3JlYXRlTmV3T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRJbmZvTmV3T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmNyZWF0ZU9yVXBkYXRlT3JnYW5pc2F0aW9uKG9yZ2FuaXNhdGlvbik7XHJcbiAgICBhd2FpdCB0aGlzLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5jcmVhdGVQcmFjdGljZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5XYWl0KCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSB0aGlzLlZpZXcuUHJhY3RpY2U7XHJcbiAgICBsZXQgZ3JvdXBzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXREZXRlcm1pbmVkR3JvdXBzKHByYWN0aWNlLmdyb3Vwcyk7XHJcbiAgICBwcmFjdGljZS5ncm91cHMgPSBncm91cHM7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmNyZWF0ZVByYWN0aWNlKHByYWN0aWNlKTtcclxuICAgIHRoaXMuVmlldy5TdG9wKCk7XHJcbiAgICB0aGlzLmdvVG9TdHVkZW50c1NlY3Rpb24oKTtcclxufTtcclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZW5kZXJHcm91cHNUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyICE9PSBcIiArIFwiKSB7XHJcbiAgICAgICAgYXdhaXQgIHRoaXMuTW9kZWwuZGlzdHJpYnV0ZUdyb3Vwc0J5Q291cnNlcyh0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyKTtcclxuICAgICAgICBhd2FpdCB0aGlzLlZpZXcuY2xlYXJHcm91cHNUcmVlVmlldygpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuVmlldy51cGRhdGVHcm91cHNUcmVlVmlldyh0aGlzLk1vZGVsLkNvdXJzZXMpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuc2V0R3JvdXBzVHJlZVZpZXcgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHRoaXMuVmlldy51cGRhdGVZZWFyKGV2ZW50KTtcclxuICAgIHRoaXMucmVuZGVyR3JvdXBzVHJlZVZpZXcoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlckRhdGFJblRhYmxlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHNlbGVjdGVkR3JvdXBzID0gdGhpcy5WaWV3LmdldFNlbGVjdGVkR3JvdXBzKCk7XHJcbiAgICBsZXQgZ3JvdXBzT2JqZWN0cyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLk1vZGVsLkdyb3Vwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuTW9kZWwuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cHNPYmplY3RzLnB1c2godGhpcy5Nb2RlbC5Hcm91cHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICAgIGxldCBkYXRhID0gMCwgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucztcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBsZXQgcmVxdWVzdHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzKHByYWN0aWNlLCBncm91cHNPYmplY3RzKTtcclxuICAgICAgICBhd2FpdCB0aGlzLk1vZGVsLmFzc29zaWF0ZVJlcXVlc3RUb1N0dWRlbnQocmVxdWVzdHMsIHNlbGVjdGVkR3JvdXBzKTtcclxuICAgICAgICByZXF1ZXN0c19vcmdhbmlzYXRpb25zID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRSZXF1ZXN0c09yZ2FuaXNhdGlvbnMoc2VsZWN0ZWRHcm91cHMpO1xyXG4gICAgICAgIGRhdGEgPSBhd2FpdCB0aGlzLk1vZGVsLmdldERhdGEoc2VsZWN0ZWRHcm91cHMsIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMpO1xyXG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBkYXRhID0gMDtcclxuICAgICAgICAgICAgdGhpcy5WaWV3LnJlbmRlclRhYmxlKGRhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuVmlldy5yZW5kZXJUYWJsZShkYXRhKTtcclxuICAgICAgICB0aGlzLlZpZXcuY29sb3JUYWJsZShkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLlZpZXcucmVuZGVySW5mbyhwcmFjdGljZSk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25zKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9Db250cm9sbGVyLmpzIiwiY29uc3QgYmFjaGVsb3JZZWFyID0gNDtcclxuY29uc3QgbWFzdGVyWWVhciA9IDY7XHJcbmxldCBzZWxlY3RlZEVsZW0gPSAwO1xyXG5cclxudmFyIFZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5vbkNsaWNrTmV4dFN0ZXAgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja1ByYWN0aWNlQ29tcGxldGVkID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tDcmVhdGVQcmFjdGljZSA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrQWRkUHJhY3RpY2UgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBudWxsO1xyXG4gIHRoaXMub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tGaW5pc2hCdG4gPSBudWxsO1xyXG4gIHRoaXMub25DbGlja1NlbGVjdEdyb3VwQnRuT2sgPSBudWxsO1xyXG4gIHRoaXMubXlUYWJsZSA9ICQoJyNzdHVkZW50c0xpc3RUYWJsZScpO1xyXG4gIHRoaXMub25DbGlja1llYXJzQXJyYXkgPSBudWxsO1xyXG4gIHRoaXMuc2VsZWN0ZWRZZWFyID0gbnVsbDtcclxuICB0aGlzLmlkVHJlZVZpZXdzID0gW1xyXG4gICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWJhY2hlbG9yJyxcclxuICAgICdncm91cC10cmVldmlldy10YWJjb250cm9sMi1tYXN0ZXInLFxyXG4gICAgJ2dyb3Vwcy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbi1iYWNoZWxvcicsXHJcbiAgICAnZ3JvdXBzLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uLW1hc3RlcidcclxuICBdO1xyXG4gIHRoaXMub25DbGlja0dldE9yZ2FuaXNhdGlvbnMgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbiA9IG51bGw7XHJcbiAgdGhpcy5QcmFjdGljZSA9IG51bGw7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tbmV4dFwiKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja05leHRTdGVwKTtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RpYWxvZ1ByYWN0aWNlQ29tcGxldGVTdWNjZXNzXCIpLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIFwiI3ByYWN0aWNlRmluaXNoZWRPa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja1ByYWN0aWNlQ29tcGxldGVkKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVByYWN0aWNlQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnYW5pc2F0aW9uc1NlY3Rpb25CdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tUb09yZ2FuaXNhdGlvbnNTZWN0aW9uKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0dWRlbnRzU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLWZpbmlzaFwiKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja0ZpbmlzaEJ0bik7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZXRHcm91cHNCdG5Pa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja1NlbGVjdEdyb3VwQnRuT2spO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrWWVhcnNBcnJheSk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25zQXJyYXkxXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrWWVhcnNBcnJheSk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZXRPcmdhbmlzYXRpb25zQnRuT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tHZXRPcmdhbmlzYXRpb25zKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZU9yZ2FuaXNhdGlvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbik7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmFjdGljZUZpbmlzaGVkT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tBZGRQcmFjdGljZSk7XHJcbiAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSh7XHJcbiAgICBkYXRhOiB0aGlzLkdyb3VwcyxcclxuICAgIFwibGFuZ3VhZ2VcIjoge1xyXG4gICAgICBcInplcm9SZWNvcmRzXCI6IFwi0KLQsNC60L7QuSDQt9Cw0L/QuNGB0Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIixcclxuICAgICAgXCJlbXB0eVRhYmxlXCI6IFwi0J3QuCDQvtC00L3QsCDQuNC3INCz0YDRg9C/0L8g0L3QtSDQstGL0LHRgNCw0L3QsCDQu9C40LHQviDQv9GA0LDQutGC0LjQutC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCIsXHJcbiAgICAgIFwic2VhcmNoXCI6IFwi0J/QvtC40YHQujpcIixcclxuICAgICAgXCJwYWdpbmF0ZVwiOiB7XHJcbiAgICAgICAgXCJmaXJzdFwiOiBcItCf0LXRgNCy0YvQuVwiLFxyXG4gICAgICAgIFwibGFzdFwiOiBcItCf0L7RgdC70LXQtNC90LjQuVwiLFxyXG4gICAgICAgIFwibmV4dFwiOiBcItCS0L/QtdGA0LXQtFwiLFxyXG4gICAgICAgIFwicHJldmlvdXNcIjogXCLQndCw0LfQsNC0XCJcclxuICAgICAgfSxcclxuICAgICAgXCJpbmZvRmlsdGVyZWRcIjogXCIo0LjQtyBfTUFYXyDRgdGC0YPQtNC10L3RgtC+0LIpXCIsXHJcbiAgICAgIFwibGVuZ3RoTWVudVwiOiBcItCf0L7QutCw0LfQsNGC0YwgX01FTlVfINC30LDQv9C40YHQtdC5XCIsXHJcbiAgICAgIFwiaW5mb1wiOiBcItCe0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHRgtGD0LTQtdC90YLQvtCyOiBfVE9UQUxfIFwiLFxyXG4gICAgICBcImluZm9FbXB0eVwiOiBcItCS0YvQsdC10YDQuNGC0LUg0LPRgNGD0L/Qv9GDLlwiXHJcbiAgICB9LFxyXG4gICAgXCJjb2x1bW5zXCI6IFtcclxuICAgICAge1wiZGF0YVwiOiBcImdyb3VwXCJ9LFxyXG4gICAgICB7XCJkYXRhXCI6IFwic3R1ZGVudFwifSxcclxuICAgICAge1wiZGF0YVwiOiBcIm9yZ2FuaXNhdGlvblwifVxyXG4gICAgXVxyXG4gIH0pO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub1N0dWRlbnRzU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI29yZ2FuaXNhdGlvbnNTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ByYWN0aWNlQ3JlYXRpb25TZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgbGV0IHRyZWVWaWV3cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmVldmlldyBcIik7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmVlVmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgIHRyZWVWaWV3c1tpXS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ByYWN0aWNlQ3JlYXRpb25TZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI29yZ2FuaXNhdGlvbnNTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvUHJhY3RpY2VDcmVhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ByYWN0aWNlQ3JlYXRpb25TZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbn07XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuVmlldy5wcm90b3R5cGUuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZmluaXNoQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1maW5pc2hcIilbMF07XHJcbiAgZmluaXNoQnRuLnNldEF0dHJpYnV0ZShcIm9uY2xpY2tcIixcclxuICAgICAgXCJtZXRyb0RpYWxvZy5vcGVuKCcjZGlhbG9nUHJhY3RpY2VDb21wbGV0ZVN1Y2Nlc3MnKVwiKTtcclxuICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdWNhdGlvblwiKS52YWx1ZTtcclxuICBsZXQgdHlwZVByYWN0aWNlVGV4dCA9IFwi0KPRh9C10LHQvdCw0Y9cIjtcclxuICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VcIikudmFsdWU7XHJcbiAgbGV0IGVkdWNhdGlvbkxldmVsVGV4dCA9IFwi0JHQsNC60LDQu9Cw0LLRgNC40LDRglwiO1xyXG4gIGlmIChlZHVjYXRpb25MZXZlbCA9PT0gXCJiYWNoZWxvclwiKSB7XHJcbiAgICBlZHVjYXRpb25MZXZlbFRleHQgPSBcItCR0LDQutCw0LvQsNCy0YDQuNCw0YJcIjtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlZHVjYXRpb25MZXZlbFRleHQgPSBcItCc0LDQs9C40YHRgtGA0LDRgtGD0YDQsFwiO1xyXG4gIH1cclxuICBsZXQgbGVjTnVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWNOdW1cIikudmFsdWU7XHJcbiAgbGV0IGZyb21EYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcm9tRGF0ZUlucHV0XCIpLnZhbHVlO1xyXG4gIGxldCB0b0RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvRGF0ZUlucHV0XCIpLnZhbHVlO1xyXG4gIGxldCBkZWFkbGluZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVhZGxpbmVcIikudmFsdWU7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0ZXJtc1ByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9ICdjICcgKyBmcm9tRGF0ZVxyXG4gICAgICArICcg0L/QviAnICsgdG9EYXRlO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVhZGxpbmVQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBkZWFkbGluZTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUZXJtc1ByYWN0aWNlXCIpLmlubmVySFRNTCA9IGZyb21EYXRlXHJcbiAgICAgICsgJyAtICcgKyB0b0RhdGU7XHJcbiAgaWYgKGZyb21EYXRlID09PSBcIlwiKSB7XHJcbiAgICBmcm9tRGF0ZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZnJvbURhdGUgPSBmcm9tRGF0ZS5zdWJzdHIoOCwgNCkgKyAnLScgKyBmcm9tRGF0ZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICArIGZyb21EYXRlLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICB9XHJcbiAgaWYgKHRvRGF0ZSA9PT0gXCJcIikge1xyXG4gICAgdG9EYXRlID0gXCIyMDAwLTAxLTAxIDIxOjAwOjAwLjAwMCArMDA6MDBcIjtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0b0RhdGUgPSB0b0RhdGUuc3Vic3RyKDgsIDQpICsgJy0nICsgdG9EYXRlLnN1YnN0cig0LCAyKSArICctJ1xyXG4gICAgICAgICsgdG9EYXRlLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICB9XHJcbiAgaWYgKGRlYWRsaW5lID09PSBcIlwiKSB7XHJcbiAgICBkZWFkbGluZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZGVhZGxpbmUgPSBkZWFkbGluZS5zdWJzdHIoOCwgNCkgKyAnLScgKyBkZWFkbGluZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICArIGRlYWRsaW5lLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICB9XHJcblxyXG4gIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiZWR1Y2F0aW9uYWxcIikge1xyXG4gICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0KPRh9C10LHQvdCw0Y9cIjtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZVByYWN0aWNlID09PSBcImludGVybnNoaXBcIikge1xyXG4gICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0J/RgNC+0LjQt9Cy0L7QtNGB0YLQstC10L3QvdCw0Y9cIjtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZVByYWN0aWNlID09PSBcInByZWRpcGxvbWFcIikge1xyXG4gICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0J/RgNC10LTQtNC40L/Qu9C+0LzQvdCw0Y9cIjtcclxuICB9XHJcbiAgbGV0IHRyZWVWaWV3ID0gbnVsbDtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJwcmFjdGljZVwiKSAhPT0gLTFcclxuICAgICAgICAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5XHJcbiAgICAgICAgPT09IFwiYmxvY2tcIikge1xyXG4gICAgICB0cmVlVmlldyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBsZXQgYXJyR3JvdXBzID0gdGhpcy5nZXRTZWxlY3RlZEdyb3Vwcyh0cmVlVmlldyk7XHJcbiAgbGV0IGFyck9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldFNlbGVjdGVkR3JvdXBzKFxyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikpO1xyXG5cclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR5cGVQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2VUZXh0O1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImVkdWNhdGlvbmFsTGV2ZWxEaWFsb2dcIikuaW5uZXJIVE1MID0gZWR1Y2F0aW9uTGV2ZWxUZXh0O1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JvdXBzUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gYXJyR3JvdXBzO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcIm9yZ2FuaXNhdGlvbnNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJPcmdhbmlzYXRpb25zO1xyXG5cclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlVGV4dFxyXG4gICAgICArIFwiINC/0YDQsNC60YLQuNC60LBcIjtcclxuXHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWNOdW1EaWFsb2dcIikuaW5uZXJIVE1MID0gbGVjTnVtO1xyXG4gIHRoaXMuUHJhY3RpY2UgPSB7XHJcbiAgICAndHlwZVByYWN0aWNlJzogdHlwZVByYWN0aWNlVGV4dCxcclxuICAgICdzdGFydERhdGVQcmFjdGljZSc6IGZyb21EYXRlLFxyXG4gICAgJ2VuZERhdGVQcmFjdGljZSc6IHRvRGF0ZSxcclxuICAgICdkZWFkbGluZVByYWN0aWNlJzogZGVhZGxpbmUsXHJcbiAgICAnbGVjTnVtJzogbGVjTnVtLFxyXG4gICAgJ2VkdUxldmVsJzogZWR1Y2F0aW9uTGV2ZWxUZXh0LFxyXG4gICAgJ29yZ2FuaXNhdGlvbnMnOiBhcnJPcmdhbmlzYXRpb25zLFxyXG4gICAgJ2dyb3Vwcyc6IGFyckdyb3VwcyxcclxuICAgICd5ZWFyJzogdGhpcy5zZWxlY3RlZFllYXJcclxuICB9O1xyXG5cclxuICByZXR1cm4gdGhpcy5QcmFjdGljZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmRpc3BsYXlHcm91cHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVjYXRpb25cIikudmFsdWU7XHJcbiAgaWYgKGVkdWNhdGlvbkxldmVsID09PSBcImJhY2hlbG9yXCIpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn07XHJcblZpZXcucHJvdG90eXBlLmNsZWFyUHJhY3RpY2VTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJvbURhdGVJbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVJbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZSA9IFwiXCI7XHJcbn07XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJJbmZvID0gZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgaWYocHJhY3RpY2UubGVuZ3RoIT09MClcclxuICB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUZXJtc1ByYWN0aWNlXCIpLmlubmVySFRNTD0n0YEgJytwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlKycg0L/QviAnK3ByYWN0aWNlLmVuZF9kYXRlX3ByYWN0aWNlO1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2U9dGhpcy5nZXRVc2VySW5mb0Fib3V0UHJhY3RpY2UoKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBpbmZvX2Fib3V0X3ByYWN0aWNlLnR5cGVQcmFjdGljZVxyXG4gICAgICAgICsgJyDQv9GA0LDQutGC0LjQutCwJztcclxuICB9XHJcbiAgZWxzZVxyXG4gIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBcItCf0YDQsNC60YLQuNC60LhcIlxyXG4gICAgICAgICsgXCIg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1Rlcm1zUHJhY3RpY2VcIikuaW5uZXJIVE1MPVwiIFwiO1xyXG4gIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0YWJjb250cm9sMlwiKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYWN0aXZlXCIpWzBdLmNoaWxkcmVuWzBdLnRleHQ7XHJcbiAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlVGFiXCIpLnZhbHVlO1xyXG4gIGxldCB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQo9GH0LXQsdC90LDRj1wiO1xyXG4gIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiZWR1Y2F0aW9uYWxcIikge1xyXG4gICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0KPRh9C10LHQvdCw0Y9cIjtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZVByYWN0aWNlID09PSBcImludGVybnNoaXBcIikge1xyXG4gICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0J/RgNC+0LjQt9Cy0L7QtNGB0YLQstC10L3QvdCw0Y9cIjtcclxuICB9XHJcbiAgZWxzZSBpZiAodHlwZVByYWN0aWNlID09PSBcInByZWRpcGxvbWFcIikge1xyXG4gICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0J/RgNC10LTQtNC40L/Qu9C+0LzQvdCw0Y9cIjtcclxuICB9XHJcbiAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2U9e1xyXG4gICAgJ3R5cGVQcmFjdGljZSc6dHlwZVByYWN0aWNlVGV4dCxcclxuICAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyLFxyXG4gICAgJ2VkdV9sZXZlbCc6IGVkdWNhdGlvbkxldmVsXHJcbiAgfTtcclxuICByZXR1cm4gaW5mb19hYm91dF9wcmFjdGljZTtcclxufTtcclxuXHJcblxyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJUYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgaWYgKGRhdGEgPT09IDApIHtcclxuICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkNsZWFyVGFibGUoKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5DbGVhclRhYmxlKCk7XHJcbiAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5BZGREYXRhKGRhdGEpO1xyXG4gIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNvbG9yVGFibGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gIGZvcihsZXQgaT0wO2k8ZGF0YS5sZW5ndGg7aSsrKXtcclxuICAgIGlmKGRhdGFbaV0uc3RhdHVzKSB7XHJcbiAgICAgICAgJCh0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKSkuYWRkQ2xhc3MoXCJhcHByb3ZlZF9zdHVkXCIpO1xyXG4gICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkdldE5vZGVzKGkpLmNoaWxkcmVuWzBdLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwic29ydGluZ18xIGFwcHJvdmVkX3N0dWRcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuY2hhbmdlWWVhciA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgaWYgKHNlbGVjdGVkRWxlbSkge1xyXG4gICAgc2VsZWN0ZWRFbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2N1cnJlbnQnKTtcclxuICB9XHJcbiAgc2VsZWN0ZWRFbGVtID0gbm9kZTtcclxuICBzZWxlY3RlZEVsZW0uY2xhc3NMaXN0LmFkZCgnY3VycmVudCcpO1xyXG4gIHRoaXMuc2VsZWN0ZWRZZWFyID0gc2VsZWN0ZWRFbGVtLmlubmVySFRNTDtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZVllYXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gIHdoaWxlICh0YXJnZXQgIT0gYnV0dG9uc0FycmF5KSB7XHJcbiAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZSA9PSAnaXRlbSB5ZWFyJykge1xyXG4gICAgICB0aGlzLmNoYW5nZVllYXIodGFyZ2V0KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XHJcbiAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRHcm91cHMgPSBmdW5jdGlvbiAodHJlZVZpZXcpIHtcclxuICBpZiAodHJlZVZpZXcgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IGZyYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmcmFtZXNcIilbMF0uY2hpbGRyZW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoZnJhbWVzW2ldLnN0eWxlLmRpc3BsYXkgPT0gXCJibG9ja1wiKSB7XHJcbiAgICAgICAgdHJlZVZpZXcgPSBmcmFtZXNbaV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgbGV0IEdyb3VwcyA9IFtdO1xyXG4gIGxldCBsaU51bWJlciA9IHRyZWVWaWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaU51bWJlci5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IGdyb3VwcyA9IGxpTnVtYmVyW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0OmNoZWNrZWQnKTtcclxuICAgIGlmIChncm91cHMubGVuZ3RoID09IDEpIHtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBsZXQgZ3JvdXAgPSBncm91cHNbal0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MO1xyXG4gICAgICAgIGlmIChncm91cC5pbmRleE9mKFwi0LrRg9GA0YFcIikgPT09IC0xKSB7XHJcbiAgICAgICAgICBHcm91cHMucHVzaChncm91cCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBHcm91cHM7XHJcbn07XHJcblxyXG5mdW5jdGlvbiB0cmVlX2FkZF9sZWFmX2NoZWNrYm94X2V4YW1wbGVfY2xpY2sodHJlZSwgbm9kZSwgbmFtZUxlYWYpIHtcclxuICB0cmVlLmFkZExlYWYobm9kZSwgbmFtZUxlYWYsIHtcclxuICAgIG1vZGU6ICdjaGVja2JveCcsXHJcbiAgICBjaGVja2VkOiBmYWxzZVxyXG4gIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlKSB7XHJcbiAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZE5vZGVzO1xyXG4gIHdoaWxlIChjaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGRyZW5bMF0pO1xyXG4gIH1cclxufVxyXG5cclxuVmlldy5wcm90b3R5cGUuY2xlYXJHcm91cHNUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICB2YXIgaWQgPSAwO1xyXG4gIHdoaWxlIChpZCA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoKSB7XHJcbiAgICB2YXIgbGlBcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIHRoaXMuaWRUcmVlVmlld3NbaWRdKS5jaGlsZHJlblswXS5jaGlsZHJlbjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICByZW1vdmVDaGlsZHJlbihsaUFycmF5W2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1bCcpWzBdKTtcclxuICAgIH1cclxuICAgIGlkKys7XHJcbiAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVHcm91cHNUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uIChjb3Vyc2VzKSB7XHJcbiAgbGV0IGlkQ291bnRlciA9IDAsIGNvdXJzZU51bWJlciA9IGJhY2hlbG9yWWVhciwgY250O1xyXG4gIGxldCBjb3Vyc2VzTmFtZSA9IFsnZmlyc3QnLCAnc2Vjb25kJywgJ3RoaXJkJywgJ2ZvdXJ0aCddO1xyXG4gIHZhciBpID0gMDtcclxuICB3aGlsZSAoaWRDb3VudGVyIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcclxuICAgIHZhciB0cmVlID0gJChcIiNcIiArIHRoaXMuaWRUcmVlVmlld3NbaWRDb3VudGVyXSkuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaWRDb3VudGVyXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICBjb3Vyc2VOdW1iZXIgPSBtYXN0ZXJZZWFyO1xyXG4gICAgICBpID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGNvdXJzZU51bWJlciA9IGJhY2hlbG9yWWVhcjtcclxuICAgICAgaSA9IDA7XHJcbiAgICB9XHJcbiAgICBjbnQgPSAwO1xyXG4gICAgZm9yIChpOyBpIDwgY291cnNlTnVtYmVyOyBpKyspIHtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb3Vyc2VzW2ldLmdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGxldCBub2RlID0gdHJlZS5lbGVtZW50LmZpbmQoJ2xpLicgKyBjb3Vyc2VzTmFtZVtjbnRdKTtcclxuICAgICAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94X2V4YW1wbGVfY2xpY2sodHJlZSwgbm9kZSwgY291cnNlc1tpXS5ncm91cHNbal0pO1xyXG4gICAgICB9XHJcbiAgICAgIGNudCsrO1xyXG4gICAgfVxyXG4gICAgaWRDb3VudGVyKys7XHJcbiAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0Q29uZmlndXJhdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcInNlbGVjdFR5cGVQcmFjdGljZU9yZ2FuaXNhdGlvblNlY1wiKS52YWx1ZTtcclxuICBsZXQgZWR1TGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdUxldmVsT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gIGxldCB5ZWFycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ5ZWFyc1wiKTtcclxuICBjb25zb2xlLmxvZyh0eXBlUHJhY3RpY2UpO1xyXG4gIGNvbnNvbGUubG9nKGVkdUxldmVsKTtcclxuICBjb25zb2xlLmxvZyh0aGlzLnNlbGVjdGVkWWVhcik7XHJcbn07XHJcblxyXG5mdW5jdGlvbiB0cmVlX2FkZF9sZWFmX2NoZWNrYm94KHRyZWUsIG5vZGUsIG5hbWVMZWFmLCBpZFR5cGVPcmdhbmlzYXRpb24pIHtcclxuICB0cmVlLmFkZExlYWYobm9kZSwgbmFtZUxlYWYsIHtcclxuICAgIG1vZGU6ICdjaGVja2JveCcsXHJcbiAgICBjaGVja2VkOiBmYWxzZVxyXG4gIH0pO1xyXG4gIG5vZGUuZmluZCgndWwnKS5maW5kKCdsaScpLmxhc3QoKVswXS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCAndHlwZV9vcmdfJ1xyXG4gICAgICArIGlkVHlwZU9yZ2FuaXNhdGlvbik7XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLnNldFR5cGVzT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgdmFyIHRyZWVWaWV3T3JnYW5pc2F0aW9ucyA9ICQoXHJcbiAgICAgIFwiI29yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHlwZXNPcmdhbmlzYXRpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBub2RlID0gdHJlZVZpZXdPcmdhbmlzYXRpb25zLmVsZW1lbnQuZmluZCgnbGkubm9kZScpO1xyXG4gICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveCh0cmVlVmlld09yZ2FuaXNhdGlvbnMsIG5vZGUsXHJcbiAgICAgICAgdHlwZXNPcmdhbmlzYXRpb25baV0ubmFtZSwgdHlwZXNPcmdhbmlzYXRpb25baV0uaWQpO1xyXG4gIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuY2xlYXJUeXBlc09yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgbGlBcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAnb3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbicpLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgcmVtb3ZlQ2hpbGRyZW4obGlBcnJheVtpXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSk7XHJcbiAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5zZXRPcmdhbmlzYXRpb25zSW5UcmVlVmlldyA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb25zLFxyXG4gICAgdHlwZXNPcmdhbmlzYXRpb24pIHtcclxuICB2YXIgdHJlZSA9ICQoXCIjb3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKS5kYXRhKFwidHJlZXZpZXdcIik7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHR5cGVzT3JnYW5pc2F0aW9uLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGlmIChvcmdhbmlzYXRpb25zW2ldLmlkX3R5cGVfb3JnYW5pc2F0aW9uID09PSB0eXBlc09yZ2FuaXNhdGlvbltqXS5pZCkge1xyXG4gICAgICAgIGxldCBsaUFyciA9IHRyZWUuZWxlbWVudC5maW5kKCdsaScpO1xyXG4gICAgICAgIGxldCBub2RlO1xyXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbGlBcnIubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgIGlmIChsaUFycltrXS5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gKCd0eXBlX29yZ18nXHJcbiAgICAgICAgICAgICAgICAgICsgdHlwZXNPcmdhbmlzYXRpb25bal0uaWQpKSB7XHJcbiAgICAgICAgICAgIG5vZGUgPSAkKGxpQXJyW2tdKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLFxyXG4gICAgICAgICAgICBvcmdhbmlzYXRpb25zW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0SW5mb05ld09yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZUNvbXBhbnlcIik7XHJcbiAgdmFyIHR5cGVPcmcgPSBlLm9wdGlvbnNbZS5zZWxlY3RlZEluZGV4XS50ZXh0O1xyXG4gIGxldCBvcmdhbmlzYXRpb24gPSB7XHJcbiAgICAnbmFtZSc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmFtZUNvbXBhbnlcIikudmFsdWUsXHJcbiAgICAndHlwZU9yZyc6IHR5cGVPcmcsXHJcbiAgICAnaW5mb09yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mb0NvbXBhbnlcIikudmFsdWUsXHJcbiAgICAnZW1haWxPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVtYWlsT3JnXCIpLnZhbHVlLFxyXG4gICAgJ3Bob25lT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaG9uZU9yZ1wiKS52YWx1ZSxcclxuICAgICdwbGFjZXNPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYWNlc0NvbXBhbnlcIikudmFsdWUsXHJcbiAgICAnbG9naW5PcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICdwc3dkT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwc3dkQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICdhZGRyZXNzT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGRyZXNzT3JnXCIpLnZhbHVlXHJcbiAgfTtcclxuICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuc2V0VHlwZXNPcmdhbmlzYXRpb25TZWxlY3QgPSBmdW5jdGlvbiAodHlwZXNPcmdhbmlzYXRpb24pIHtcclxuICBsZXQgdHlwZU9yZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZUNvbXBhbnlcIik7XHJcbiAgcmVtb3ZlQ2hpbGRyZW4odHlwZU9yZyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgb3B0aW9uLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHR5cGVzT3JnYW5pc2F0aW9uW2ldLmlkKTtcclxuICAgIG9wdGlvbi5pbm5lckhUTUwgPSB0eXBlc09yZ2FuaXNhdGlvbltpXS5uYW1lO1xyXG4gICAgdHlwZU9yZy5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLldhaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbWV0cm9EaWFsb2cub3BlbignI2RpYWxvZ1dhaXRpbmcnKTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLlN0b3AgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbWV0cm9EaWFsb2cuY2xvc2UoJyNkaWFsb2dXYWl0aW5nJyk7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gVmlldztcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9WaWV3LmpzIiwiY29uc3QgU0VQVEVNQkVSID0gOTtcclxuY29uc3QgZmlyc3RDb3Vyc2UgPSAwO1xyXG5jb25zdCBzZWNvbmRDb3Vyc2UgPSAxO1xyXG5jb25zdCB0aGlyZENvdXJzZSA9IDI7XHJcbmNvbnN0IGZvdXJ0aENvdXJzZSA9IDM7XHJcbmNvbnN0IG1hc3RlckZpcnN0Q291cnNlID0gNDtcclxuY29uc3QgbWFzdGVyU2Vjb25kQ291cnNlID0gNTtcclxuXHJcbnZhciBNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLkdyb3VwcyA9IFtdO1xyXG4gIHRoaXMuU3R1ZGVudHMgPSBbXTtcclxuICB0aGlzLkNvdXJzZXMgPSBbXTtcclxuICB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uID0gW107XHJcbiAgdGhpcy5PcmdhbmlzYXRpb25zID0gW107XHJcbn07XHJcblxyXG5jbGFzcyBDb3Vyc2Uge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWVDb3Vyc2UpIHtcclxuICAgIHRoaXMubmFtZUNvdXJzZSA9IG5hbWVDb3Vyc2U7XHJcbiAgICB0aGlzLmdyb3VwcyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgYWRkR3JvdXAoZ3JvdXApIHtcclxuICAgIHRoaXMuZ3JvdXBzLnB1c2goZ3JvdXApO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgR3JvdXAge1xyXG4gIGNvbnN0cnVjdG9yKHVpZF9MREFQLCBuYW1lR3JvdXApIHtcclxuICAgIHRoaXMubmFtZSA9IG5hbWVHcm91cDtcclxuICAgIHRoaXMudWlkX0xEQVAgPSB1aWRfTERBUDtcclxuICAgIHRoaXMuc3R1ZGVudHMgPSBbXTtcclxuICB9XHJcblxyXG4gIGFkZFN0dWRlbnQoc3R1ZGVudCkge1xyXG4gICAgdGhpcy5zdHVkZW50cy5wdXNoKHN0dWRlbnQpO1xyXG4gIH1cclxufVxyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNUVURFTlRTIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbk1vZGVsLnByb3RvdHlwZS5nZXREYXRhID0gYXN5bmMgZnVuY3Rpb24gKHNlbGVjdGVkR3JvdXBzLFxyXG4gICAgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucykge1xyXG4gIGxldCBkYXRhID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDAsIGwgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2kpIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7ICsraywgKytsKSB7XHJcbiAgICAgICAgICBsZXQgaXNTdHVkZW50QXBwbHkgPSBmYWxzZTtcclxuICAgICAgICAgIGRhdGEucHVzaCh7Z3JvdXA6IHRoaXMuR3JvdXBzW2ldLm5hbWV9KTtcclxuICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uID0gJyAnO1xyXG4gICAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCByZXF1ZXN0c19vcmdhbmlzYXRpb25zLmxlbmd0aDsgKyt3KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XS5sZW5ndGg7ICsrbikge1xyXG4gICAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9yZXF1ZXN0ID09PSArcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5pZF9yZXF1ZXN0KSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50X1VJRCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLnVpZDtcclxuICAgICAgICAgICAgICAgIGlmKHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0uaWRfc3RhdHVzPT09MSl7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdGF0dXM9cmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5pZF9zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gPSByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLm5hbWVfb3JnYW5pc2F0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzU3R1ZGVudEFwcGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gKz0gcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5uYW1lX29yZ2FuaXNhdGlvbiArJywgJztcclxuICAgICAgICAgICAgICAgICAgICBpc1N0dWRlbnRBcHBseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoIWlzU3R1ZGVudEFwcGx5KSB7XHJcbiAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLm5hbWU7XHJcbiAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudF9VSUQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS51aWQ7XHJcbiAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uID0gXCLQndC1INC30LDQv9C40YHQsNC70YHRj1wiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZGF0YTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRHcm91cHMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJveHkvY29yZS92MS9ncm91cHMnKTtcclxuICBsZXQgbGlzdCA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgbGV0IGdyb3VwcyA9IGxpc3QuX2VtYmVkZGVkLmdyb3VwcztcclxuICByZXR1cm4gZ3JvdXBzO1xyXG59O1xyXG5cclxuLyrQv9C+0LvRg9GH0LDQtdC8INGB0YLRg9C00LXQvdGC0L7QsiDQuNC3INGF0YDQsNC90LjQu9C40YnQsCBMREFQINC/0L4gSUQg0LPRgNGD0L/Qv9GLKi9cclxuTW9kZWwucHJvdG90eXBlLmdldFN0dWRlbnRzQnlHcm91cElkID0gYXN5bmMgZnVuY3Rpb24gKGdyb3VwSUQpIHtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcm94eS9jb3JlL3YxL2dyb3Vwcy8nICsgZ3JvdXBJRCk7XHJcbiAgbGV0IGxpc3QgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIGxldCBzdHVkZW50c0xpc3QgPSBsaXN0Ll9lbWJlZGRlZC5zdHVkZW50cztcclxuICByZXR1cm4gc3R1ZGVudHNMaXN0O1xyXG59O1xyXG5cclxuLyrQv9C+0LvRg9GH0LDQtdC8INCz0YDRg9C/0L/RiyDQuCDQuNGFINGB0YLRg9C00LXQvdGC0L7QsiDQuNC3INGF0YDQsNC90LjQu9C40YnQsCBMREFQLCDQvtCx0L3QvtCy0LvRj9C10Lwg0YLQsNCx0LvQuNGG0YMgU3R1ZGVudHMqL1xyXG5Nb2RlbC5wcm90b3R5cGUuaW5pdCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZ3JvdXBzID0gYXdhaXQgdGhpcy5nZXRHcm91cHMoKTtcclxuXHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgIHRoaXMuR3JvdXBzLnB1c2gobmV3IEdyb3VwKGdyb3Vwc1tpXS5pZCwgZ3JvdXBzW2ldLm5hbWUpKTtcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGkgPSAwLCBuID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBsZXQgc3R1ZGVudHNMaXN0ID0gYXdhaXQgdGhpcy5nZXRTdHVkZW50c0J5R3JvdXBJZCh0aGlzLkdyb3Vwc1tpXS51aWRfTERBUCk7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN0dWRlbnRzTGlzdC5sZW5ndGg7ICsraiwgbisrKSB7XHJcbiAgICAgIGxldCBzdHVkZW50ID0ge1xyXG4gICAgICAgICduYW1lJzogc3R1ZGVudHNMaXN0W2pdLmRpc3BsYXlOYW1lLFxyXG4gICAgICAgICd1aWQnOiBzdHVkZW50c0xpc3Rbal0udWlkXHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMuR3JvdXBzW2ldLmFkZFN0dWRlbnQoc3R1ZGVudCk7XHJcbiAgICB9XHJcbiAgICAvL2F3YWl0IHRoaXMuY3JlYXRlT3JVcGRhdGVTdHVkZW50cyh0aGlzLkdyb3Vwc1tpXS5zdHVkZW50cyk7XHJcbiAgfVxyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEN1cnJlbnRZZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICBsZXQgY3VycmVudFllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKTtcclxuICByZXR1cm4gY3VycmVudFllYXI7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZGlzdHJpYnV0ZUdyb3Vwc0J5Q291cnNlcyA9IGFzeW5jIGZ1bmN0aW9uIChjdXJyZW50WWVhcikge1xyXG4gIHRoaXMuQ291cnNlcyA9IFtcclxuICAgIG5ldyBDb3Vyc2UoJzEnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzInKSxcclxuICAgIG5ldyBDb3Vyc2UoJzMnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzQnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzEgKNC80LMpJyksXHJcbiAgICBuZXcgQ291cnNlKCcyICjQvNCzKScpXHJcbiAgXTtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICBpZiAoK2N1cnJlbnRNb250aCA8IFNFUFRFTUJFUikge1xyXG4gICAgY3VycmVudFllYXIgLT0gMTtcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgIT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW21hc3RlckZpcnN0Q291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbZmlyc3RDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSAhPT0gLTEpIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbbWFzdGVyU2Vjb25kQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbc2Vjb25kQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgPT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW3RoaXJkQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgPT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW2ZvdXJ0aENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGN1cnJlbnRZZWFyICs9IDM7XHJcbiAgfVxyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UHJhY3RpY2UgPSBhc3luYyBmdW5jdGlvbiAoaW5mb19hYm91dF9wcmFjdGljZSkge1xyXG4gIGxldCBwYXJhbXMgPSB7XHJcbiAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gIH07XHJcbiAgaW5mb19hYm91dF9wcmFjdGljZSA9IFwiP3llYXI9XCIgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLnllYXIgKyBcIiZlZHVfbGV2ZWw9XCJcclxuICAgICAgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLmVkdV9sZXZlbCArIFwiJnR5cGVQcmFjdGljZT1cIlxyXG4gICAgICArIGluZm9fYWJvdXRfcHJhY3RpY2UudHlwZVByYWN0aWNlO1xyXG4gIGxldCBpbmZvID0gMDtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZScgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLCBwYXJhbXMpXHJcbiAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICBpbmZvID0gcmVzcG9uc2UuanNvbigpO1xyXG4gIH0pXHJcbiAgLmNhdGNoKChyZXNwb25zZSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBpbmZvO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlLCBncm91cHMpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCByZXF1ZXN0cyA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7IGorKykge1xyXG4gICAgICBsZXQgaW5mbyA9ICc/aWRfc3R1ZGVudD0nICsgZ3JvdXBzW2ldLnN0dWRlbnRzW2pdLnVpZCArIFwiJmlkX3ByYWN0aWNlPVwiXHJcbiAgICAgICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9maWx0ZXItcmVxdXN0cycgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgICBpbmZvID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgICAgcmVxdWVzdHMucHVzaChpbmZvKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlcXVlc3RzOy8v0L/QvtC70YPRh9C40LvQuCBhbGwg0LfQsNGP0LLQvtC6INGB0YLRg9C00LXQvdGC0L7QsiDQstGL0LHRgNCw0L3QvdGL0YUg0LPRgNGD0L/Qv1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmFzc29zaWF0ZVJlcXVlc3RUb1N0dWRlbnQgPSBhc3luYyBmdW5jdGlvbiAocmVxdWVzdHMsIGdyb3Vwcykge1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2kpIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBncm91cHNbal0pIHtcclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLmxlbmd0aDsgKytrKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHJlcXVlc3RzLmxlbmd0aDsgKytuKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS51aWQgPT09IHJlcXVlc3RzW25dLnVpZF9zdHVkZW50KSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfcmVxdWVzdCA9IHJlcXVlc3RzW25dLmlkX3JlcXVlc3Q7XHJcbiAgICAgICAgICAgICAgaWYgKHJlcXVlc3RzW25dLmlkX29yZ2FuaXNhdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfb3JnYW5pc2F0aW9uID0gcmVxdWVzdHNbbl0uaWRfb3JnYW5pc2F0aW9uO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0c09yZ2FuaXNhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICBsZXQgcGFyYW1zID0ge1xyXG4gICAgbWV0aG9kOiAnR0VUJyxcclxuICAgIG1vZGU6ICdjb3JzJyxcclxuICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICB9O1xyXG4gIGxldCBvcmdhbmlzYXRpb25zX2J5X3JlcXVlc3QgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyArK2spIHtcclxuICAgICAgICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9yZXF1ZXN0O1xyXG4gICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9ucy1ieS1yZXF1ZXN0JyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICAgICAgICBpbmZvID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgICAgICAgIG9yZ2FuaXNhdGlvbnNfYnlfcmVxdWVzdC5wdXNoKGluZm8pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gb3JnYW5pc2F0aW9uc19ieV9yZXF1ZXN0O1xyXG59O1xyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09UFJBQ1RJQ0UgQ1JFQVRJT05cclxuIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRUeXBlc09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uID0gW107XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvdHlwZXMtb3JnYW5pc2F0aW9uJyk7XHJcbiAgbGV0IHR5cGVzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uID0gdHlwZXM7XHJcbiAgcmV0dXJuIHRoaXMudHlwZXNPcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb25zJyk7XHJcbiAgbGV0IG9yZ3MgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIHRoaXMuT3JnYW5pc2F0aW9ucyA9IG9yZ3M7XHJcbiAgcmV0dXJuIHRoaXMuT3JnYW5pc2F0aW9ucztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXREZXRlcm1pbmVkR3JvdXBzID0gYXN5bmMgZnVuY3Rpb24gKHNlbGVjdGVkR3JvdXBzKSB7XHJcbiAgbGV0IGRldGVybWluZWRHcm91cHMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgIGRldGVybWluZWRHcm91cHMucHVzaCh0aGlzLkdyb3Vwc1tpXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGRldGVybWluZWRHcm91cHM7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuY3JlYXRlT3JVcGRhdGVPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9uJywge1xyXG4gICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgIH0sXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShvcmdhbmlzYXRpb24pXHJcbiAgfSlcclxuICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0L7RgNCz0LDQvdC40LfQsNGG0LjQuCDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZVByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJhY3RpY2UnLCB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByYWN0aWNlKVxyXG4gIH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INC/0YDQsNC60YLQuNC60Lgg0LIg0JHQlCBcIiArIGVycm9yKTtcclxuICB9KTtcclxuXHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuY3JlYXRlT3JVcGRhdGVTdHVkZW50cyA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50cykge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3N0dWRlbnRzJywge1xyXG4gICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgIH0sXHJcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShzdHVkZW50cylcclxuICB9KVxyXG4gIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCB1aWQg0YHRgtGD0LTQtdC90YLQvtCyINCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL01vZGVsLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLmNzc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tY29sb3JzLmNzc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tcmVzcG9uc2l2ZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9qcy9saWJzL0RhdGFUYWJsZXMvZGF0YXRhYmxlcy5taW4uY3NzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9zdHlsZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQWJBO0FBZUE7QUFqQkE7QUF1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNsZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQUNBO0FBV0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNqVUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7OztBIiwic291cmNlUm9vdCI6IiJ9
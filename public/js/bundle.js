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
    let groups = this.View.getSelectedGroups();
    let data = await this.Model.getData(groups);
    this.View.renderTable(data);
    this.View.renderInfo();
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
      "emptyTable": "Ни одна из групп не выбрана.",
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
View.prototype.renderInfo = function () {
  let typePractice = document.getElementById("selectTypePracticeTab").value;
  let typePracticeText = "Учебная";
  if (typePractice === "educational") {
    typePracticeText = "Учебная";
  } else if (typePractice === "internship") {
    typePracticeText = "Производственная";
  } else if (typePractice === "prediploma") {
    typePracticeText = "Преддипломная";
  }
  document.getElementById("mainWindowTypePractice").innerHTML = typePracticeText + ' практика';
};
View.prototype.renderTable = function (data) {
  if (data.length === 0) {
    this.myTable.dataTable().fnClearTable();
  } else {
    this.myTable.dataTable().fnClearTable();
    this.myTable.dataTable().fnAddData(data);
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
Model.prototype.getData = async function (selectedGroups) {
  let data = [];
  for (let i = 0, n = 0; i < this.Groups.length; ++i) {
    for (let j = 0; j < selectedGroups.length; ++j) {
      if (this.Groups[i].name === selectedGroups[j]) {
        for (let k = 0; k < this.Groups[i].students.length; ++k, n++) {
          data.push({ group: this.Groups[i].name });
          data[n].student = this.Groups[i].students[k].name;
          data[n].student_UID = this.Groups[i].students[k].uid;
          data[n].organisation = j;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDFkZTVkZjQ2MzQzODgyNDQ5ZGFhIiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9saWJzL0RhdGFUYWJsZXMvZGF0YXRhYmxlcy5taW4uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxZGU1ZGY0NjM0Mzg4MjQ0OWRhYSIsImNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlICgnLi9Db250cm9sbGVyLmpzJyk7XHJcblxyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzJyk7XHJcbnJlcXVpcmUoJy4vbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcycpO1xyXG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgbmV3IENvbnRyb2xsZXIoKTtcclxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9tYWluLmpzIiwiY29uc3QgVmlldyA9ICByZXF1aXJlICgnLi9WaWV3LmpzJyk7XHJcbmNvbnN0IE1vZGVsID0gIHJlcXVpcmUgKCcuL01vZGVsLmpzJyk7XHJcblxyXG4gZnVuY3Rpb24gQ29udHJvbGxlciAoKSB7XHJcbiAgICB0aGlzLlZpZXcgPSBuZXcgVmlldygpO1xyXG4gICAgdGhpcy5Nb2RlbCA9IG5ldyBNb2RlbCgpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbn1cclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmluaXQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja05leHRTdGVwID0gdGhpcy5kaXNwbGF5R3JvdXBzLmJpbmQodGhpcyk7XHJcbiAgIC8vIHRoaXMuVmlldy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQgPSB0aGlzLmdvVG9TdHVkZW50c1NlY3Rpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UgPSB0aGlzLmdvVG9QcmFjdGljZUNyZWF0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0FkZFByYWN0aWNlID0gdGhpcy5jcmVhdGVQcmFjdGljZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tUb09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gdGhpcy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24gPSB0aGlzLmdvVG9TdHVkZW50c1NlY3Rpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrRmluaXNoQnRuID0gdGhpcy5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1NlbGVjdEdyb3VwQnRuT2sgPSB0aGlzLnJlbmRlckRhdGFJblRhYmxlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1llYXJzQXJyYXkgPSB0aGlzLnNldEdyb3Vwc1RyZWVWaWV3LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0dldE9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldE9yZ2FuaXNhdGlvbnMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uID0gdGhpcy5jcmVhdGVOZXdPcmdhbmlzYXRpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5pbml0KCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmluaXQoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24oKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9TdHVkZW50c1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub1N0dWRlbnRzU2VjdGlvbigpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub1ByYWN0aWNlQ3JlYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID0gdGhpcy5Nb2RlbC5nZXRDdXJyZW50WWVhcigpO1xyXG4gICAgYXdhaXQgdGhpcy5yZW5kZXJHcm91cHNUcmVlVmlldygpO1xyXG4gICAgdGhpcy5WaWV3LmNsZWFyUHJhY3RpY2VTZWN0aW9uKCk7XHJcbiAgICBsZXQgdHlwZXNPcmdhbmlzYXRpb249IGF3YWl0IHRoaXMudXBkYXRlVHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvblNlbGVjdCh0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub1ByYWN0aWNlQ3JlYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5zZWxlY3RlZFllYXIgPSB0aGlzLk1vZGVsLmdldEN1cnJlbnRZZWFyKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHlwZXNPcmdhbmlzYXRpb249IGF3YWl0IHRoaXMuTW9kZWwuZ2V0VHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICB0aGlzLlZpZXcuY2xlYXJUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvbih0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgbGV0IG9yZ2FuaXNhdGlvbnM9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xyXG4gIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zSW5UcmVlVmlldyhvcmdhbmlzYXRpb25zLHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICByZXR1cm4gdHlwZXNPcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZGlzcGxheUdyb3VwcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5kaXNwbGF5R3JvdXBzKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmNyZWF0ZU5ld09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgb3JnYW5pc2F0aW9uPSB0aGlzLlZpZXcuZ2V0SW5mb05ld09yZ2FuaXNhdGlvbigpO1xyXG4gIGF3YWl0IHRoaXMuTW9kZWwuY3JlYXRlT3JVcGRhdGVPcmdhbmlzYXRpb24ob3JnYW5pc2F0aW9uKTtcclxuICBhd2FpdCB0aGlzLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5jcmVhdGVQcmFjdGljZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLlZpZXcuV2FpdCgpO1xyXG4gIGxldCBwcmFjdGljZSA9IHRoaXMuVmlldy5QcmFjdGljZTtcclxuICBsZXQgZ3JvdXBzPWF3YWl0IHRoaXMuTW9kZWwuZ2V0RGV0ZXJtaW5lZEdyb3VwcyhwcmFjdGljZS5ncm91cHMpO1xyXG4gIHByYWN0aWNlLmdyb3Vwcz1ncm91cHM7XHJcbiAgYXdhaXQgdGhpcy5Nb2RlbC5jcmVhdGVQcmFjdGljZShwcmFjdGljZSk7XHJcbiAgdGhpcy5WaWV3LlN0b3AoKTtcclxuICB0aGlzLmdvVG9TdHVkZW50c1NlY3Rpb24oKTtcclxufTtcclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZW5kZXJHcm91cHNUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBpZih0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyIT09XCIgKyBcIikge1xyXG4gICAgYXdhaXQgIHRoaXMuTW9kZWwuZGlzdHJpYnV0ZUdyb3Vwc0J5Q291cnNlcyh0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyKTtcclxuICAgIGF3YWl0IHRoaXMuVmlldy5jbGVhckdyb3Vwc1RyZWVWaWV3KCk7XHJcbiAgICBhd2FpdCB0aGlzLlZpZXcudXBkYXRlR3JvdXBzVHJlZVZpZXcodGhpcy5Nb2RlbC5Db3Vyc2VzKTtcclxuICB9XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5zZXRHcm91cHNUcmVlVmlldyA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdGhpcy5WaWV3LnVwZGF0ZVllYXIoZXZlbnQpO1xyXG4gICAgdGhpcy5yZW5kZXJHcm91cHNUcmVlVmlldygpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyRGF0YUluVGFibGUgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZ3JvdXBzID0gdGhpcy5WaWV3LmdldFNlbGVjdGVkR3JvdXBzKCk7XHJcbiAgICBsZXQgZGF0YT0gYXdhaXQgdGhpcy5Nb2RlbC5nZXREYXRhKGdyb3Vwcyk7XHJcbiAgICB0aGlzLlZpZXcucmVuZGVyVGFibGUoZGF0YSk7XHJcbiAgICB0aGlzLlZpZXcucmVuZGVySW5mbygpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLlZpZXcuZ2V0Q29uZmlndXJhdGlvbnMoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbGxlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJjb25zdCBiYWNoZWxvclllYXIgPSA0O1xyXG5jb25zdCBtYXN0ZXJZZWFyID0gNjtcclxubGV0IHNlbGVjdGVkRWxlbSA9IDA7XHJcblxyXG52YXIgVmlldyA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLm9uQ2xpY2tOZXh0U3RlcCA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja0NyZWF0ZVByYWN0aWNlID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tBZGRQcmFjdGljZSA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24gPSBudWxsO1xyXG4gIHRoaXMub25DbGlja0ZpbmlzaEJ0biA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrU2VsZWN0R3JvdXBCdG5PayA9IG51bGw7XHJcbiAgdGhpcy5teVRhYmxlID0gJCgnI3N0dWRlbnRzTGlzdFRhYmxlJyk7XHJcbiAgdGhpcy5vbkNsaWNrWWVhcnNBcnJheSA9IG51bGw7XHJcbiAgdGhpcy5zZWxlY3RlZFllYXIgPSBudWxsO1xyXG4gIHRoaXMuaWRUcmVlVmlld3MgPSBbXHJcbiAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDEtYmFjaGVsb3InLFxyXG4gICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wyLW1hc3RlcicsXHJcbiAgICAnZ3JvdXBzLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uLWJhY2hlbG9yJyxcclxuICAgICdncm91cHMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb24tbWFzdGVyJ1xyXG4gIF07XHJcbiAgdGhpcy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uID0gbnVsbDtcclxuICB0aGlzLlByYWN0aWNlID0gbnVsbDtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1uZXh0XCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrTmV4dFN0ZXApO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGlhbG9nUHJhY3RpY2VDb21wbGV0ZVN1Y2Nlc3NcIikucXVlcnlTZWxlY3RvcihcclxuICAgICAgXCIjcHJhY3RpY2VGaW5pc2hlZE9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlUHJhY3RpY2VCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tDcmVhdGVQcmFjdGljZSk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25zU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24pO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3R1ZGVudHNTZWN0aW9uQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24pO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tZmluaXNoXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrRmluaXNoQnRuKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldEdyb3Vwc0J0bk9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrU2VsZWN0R3JvdXBCdG5Payk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25zQXJyYXlcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5KTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbnNBcnJheTFcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5KTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldE9yZ2FuaXNhdGlvbnNCdG5Pa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja0dldE9yZ2FuaXNhdGlvbnMpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlT3JnYW5pc2F0aW9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByYWN0aWNlRmluaXNoZWRPa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja0FkZFByYWN0aWNlKTtcclxuICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKHtcclxuICAgIGRhdGE6IHRoaXMuR3JvdXBzLFxyXG4gICAgXCJsYW5ndWFnZVwiOiB7XHJcbiAgICAgIFwiemVyb1JlY29yZHNcIjogXCLQotCw0LrQvtC5INC30LDQv9C40YHQuCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiLFxyXG4gICAgICBcImVtcHR5VGFibGVcIjogXCLQndC4INC+0LTQvdCwINC40Lcg0LPRgNGD0L/QvyDQvdC1INCy0YvQsdGA0LDQvdCwLlwiLFxyXG4gICAgICBcInNlYXJjaFwiOiBcItCf0L7QuNGB0Lo6XCIsXHJcbiAgICAgIFwicGFnaW5hdGVcIjoge1xyXG4gICAgICAgIFwiZmlyc3RcIjogXCLQn9C10YDQstGL0LlcIixcclxuICAgICAgICBcImxhc3RcIjogXCLQn9C+0YHQu9C10LTQvdC40LlcIixcclxuICAgICAgICBcIm5leHRcIjogXCLQktC/0LXRgNC10LRcIixcclxuICAgICAgICBcInByZXZpb3VzXCI6IFwi0J3QsNC30LDQtFwiXHJcbiAgICAgIH0sXHJcbiAgICAgIFwiaW5mb0ZpbHRlcmVkXCI6IFwiKNC40LcgX01BWF8g0YHRgtGD0LTQtdC90YLQvtCyKVwiLFxyXG4gICAgICBcImxlbmd0aE1lbnVcIjogXCLQn9C+0LrQsNC30LDRgtGMIF9NRU5VXyDQt9Cw0L/QuNGB0LXQuVwiLFxyXG4gICAgICBcImluZm9cIjogXCLQntCx0YnQtdC1INC60L7Qu9C40YfQtdGB0YLQstC+INGB0YLRg9C00LXQvdGC0L7QsjogX1RPVEFMXyBcIixcclxuICAgICAgXCJpbmZvRW1wdHlcIjogXCLQktGL0LHQtdGA0LjRgtC1INCz0YDRg9C/0L/Rgy5cIlxyXG4gICAgfSxcclxuICAgIFwiY29sdW1uc1wiOiBbXHJcbiAgICAgIHtcImRhdGFcIjogXCJncm91cFwifSxcclxuICAgICAge1wiZGF0YVwiOiBcInN0dWRlbnRcIn0sXHJcbiAgICAgIHtcImRhdGFcIjogXCJvcmdhbmlzYXRpb25cIn1cclxuICAgIF1cclxuICB9KTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9TdHVkZW50c1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvcmdhbmlzYXRpb25zU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gIGxldCB0cmVlVmlld3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwidHJlZXZpZXcgXCIpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB0cmVlVmlld3NbaV0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNvcmdhbmlzYXRpb25zU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub1ByYWN0aWNlQ3JlYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG59O1xyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblZpZXcucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGZpbmlzaEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tZmluaXNoXCIpWzBdO1xyXG4gIGZpbmlzaEJ0bi5zZXRBdHRyaWJ1dGUoXCJvbmNsaWNrXCIsXHJcbiAgICAgIFwibWV0cm9EaWFsb2cub3BlbignI2RpYWxvZ1ByYWN0aWNlQ29tcGxldGVTdWNjZXNzJylcIik7XHJcbiAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVjYXRpb25cIikudmFsdWU7XHJcbiAgbGV0IHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlXCIpLnZhbHVlO1xyXG4gIGxldCBlZHVjYXRpb25MZXZlbFRleHQgPSBcItCR0LDQutCw0LvQsNCy0YDQuNCw0YJcIjtcclxuICBpZiAoZWR1Y2F0aW9uTGV2ZWwgPT09IFwiYmFjaGVsb3JcIikge1xyXG4gICAgZWR1Y2F0aW9uTGV2ZWxUZXh0ID0gXCLQkdCw0LrQsNC70LDQstGA0LjQsNGCXCI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWR1Y2F0aW9uTGV2ZWxUZXh0ID0gXCLQnNCw0LPQuNGB0YLRgNCw0YLRg9GA0LBcIjtcclxuICB9XHJcbiAgbGV0IGxlY051bSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVjTnVtXCIpLnZhbHVlO1xyXG4gIGxldCBmcm9tRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJvbURhdGVJbnB1dFwiKS52YWx1ZTtcclxuICBsZXQgdG9EYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVJbnB1dFwiKS52YWx1ZTtcclxuICBsZXQgZGVhZGxpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYWRsaW5lXCIpLnZhbHVlO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVybXNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSAnYyAnICsgZnJvbURhdGVcclxuICAgICAgKyAnINC/0L4gJyArIHRvRGF0ZTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYWRsaW5lUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gZGVhZGxpbmU7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBmcm9tRGF0ZVxyXG4gICAgICArICcgLSAnICsgdG9EYXRlO1xyXG4gIGlmIChmcm9tRGF0ZSA9PT0gXCJcIikge1xyXG4gICAgZnJvbURhdGUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZyb21EYXRlID0gZnJvbURhdGUuc3Vic3RyKDgsIDQpICsgJy0nICsgZnJvbURhdGUuc3Vic3RyKDQsIDIpICsgJy0nXHJcbiAgICAgICAgKyBmcm9tRGF0ZS5zdWJzdHIoMCwgMikgKyAnICcgKyAnMjE6MDA6MDAuMDAwICswMDowMCc7XHJcbiAgfVxyXG4gIGlmICh0b0RhdGUgPT09IFwiXCIpIHtcclxuICAgIHRvRGF0ZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdG9EYXRlID0gdG9EYXRlLnN1YnN0cig4LCA0KSArICctJyArIHRvRGF0ZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICArIHRvRGF0ZS5zdWJzdHIoMCwgMikgKyAnICcgKyAnMjE6MDA6MDAuMDAwICswMDowMCc7XHJcbiAgfVxyXG4gIGlmIChkZWFkbGluZSA9PT0gXCJcIikge1xyXG4gICAgZGVhZGxpbmUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGRlYWRsaW5lID0gZGVhZGxpbmUuc3Vic3RyKDgsIDQpICsgJy0nICsgZGVhZGxpbmUuc3Vic3RyKDQsIDIpICsgJy0nXHJcbiAgICAgICAgKyBkZWFkbGluZS5zdWJzdHIoMCwgMikgKyAnICcgKyAnMjE6MDA6MDAuMDAwICswMDowMCc7XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZVByYWN0aWNlID09PSBcImVkdWNhdGlvbmFsXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJpbnRlcm5zaGlwXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQvtC40LfQstC+0LTRgdGC0LLQtdC90L3QsNGPXCI7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJwcmVkaXBsb21hXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQtdC00LTQuNC/0LvQvtC80L3QsNGPXCI7XHJcbiAgfVxyXG4gIGxldCB0cmVlVmlldyA9IG51bGw7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwicHJhY3RpY2VcIikgIT09IC0xXHJcbiAgICAgICAgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheVxyXG4gICAgICAgID09PSBcImJsb2NrXCIpIHtcclxuICAgICAgdHJlZVZpZXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKTtcclxuICAgIH1cclxuICB9XHJcbiAgbGV0IGFyckdyb3VwcyA9IHRoaXMuZ2V0U2VsZWN0ZWRHcm91cHModHJlZVZpZXcpO1xyXG4gIGxldCBhcnJPcmdhbmlzYXRpb25zID0gdGhpcy5nZXRTZWxlY3RlZEdyb3VwcyhcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uXCIpKTtcclxuXHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0eXBlUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlVGV4dDtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgXCJlZHVjYXRpb25hbExldmVsRGlhbG9nXCIpLmlubmVySFRNTCA9IGVkdWNhdGlvbkxldmVsVGV4dDtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdyb3Vwc1ByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGFyckdyb3VwcztcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgXCJvcmdhbmlzYXRpb25zUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gYXJyT3JnYW5pc2F0aW9ucztcclxuXHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VHlwZVByYWN0aWNlXCIpLmlubmVySFRNTCA9IHR5cGVQcmFjdGljZVRleHRcclxuICAgICAgKyBcIiDQv9GA0LDQutGC0LjQutCwXCI7XHJcblxyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVjTnVtRGlhbG9nXCIpLmlubmVySFRNTCA9IGxlY051bTtcclxuICB0aGlzLlByYWN0aWNlID0ge1xyXG4gICAgJ3R5cGVQcmFjdGljZSc6IHR5cGVQcmFjdGljZVRleHQsXHJcbiAgICAnc3RhcnREYXRlUHJhY3RpY2UnOiBmcm9tRGF0ZSxcclxuICAgICdlbmREYXRlUHJhY3RpY2UnOiB0b0RhdGUsXHJcbiAgICAnZGVhZGxpbmVQcmFjdGljZSc6IGRlYWRsaW5lLFxyXG4gICAgJ2xlY051bSc6IGxlY051bSxcclxuICAgICdlZHVMZXZlbCc6IGVkdWNhdGlvbkxldmVsVGV4dCxcclxuICAgICdvcmdhbmlzYXRpb25zJzogYXJyT3JnYW5pc2F0aW9ucyxcclxuICAgICdncm91cHMnOiBhcnJHcm91cHMsXHJcbiAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHRoaXMuUHJhY3RpY2U7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5kaXNwbGF5R3JvdXBzID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1Y2F0aW9uXCIpLnZhbHVlO1xyXG4gIGlmIChlZHVjYXRpb25MZXZlbCA9PT0gXCJiYWNoZWxvclwiKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcIm1hc3RlclwiKSAhPT0gLTEpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcImJhY2hlbG9yXCIpICE9PSAtMSkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcImJhY2hlbG9yXCIpICE9PSAtMSkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5jbGVhclByYWN0aWNlU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZyb21EYXRlSW5wdXRcIikudmFsdWUgPSBcIlwiO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9EYXRlSW5wdXRcIikudmFsdWUgPSBcIlwiO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVhZGxpbmVcIikudmFsdWUgPSBcIlwiO1xyXG59O1xyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuVmlldy5wcm90b3R5cGUucmVuZGVySW5mbyA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VUYWJcIikudmFsdWU7XHJcbiAgbGV0IHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJlZHVjYXRpb25hbFwiKSB7XHJcbiAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQo9GH0LXQsdC90LDRj1wiO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiaW50ZXJuc2hpcFwiKSB7XHJcbiAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQn9GA0L7QuNC30LLQvtC00YHRgtCy0LXQvdC90LDRj1wiO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwicHJlZGlwbG9tYVwiKSB7XHJcbiAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQn9GA0LXQtNC00LjQv9C70L7QvNC90LDRj1wiO1xyXG4gIH1cclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlVGV4dFxyXG4gICAgICArICcg0L/RgNCw0LrRgtC40LrQsCc7XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnJlbmRlclRhYmxlID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcclxuICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkNsZWFyVGFibGUoKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5DbGVhclRhYmxlKCk7XHJcbiAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5BZGREYXRhKGRhdGEpO1xyXG4gIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNoYW5nZVllYXIgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gIGlmIChzZWxlY3RlZEVsZW0pIHtcclxuICAgIHNlbGVjdGVkRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdjdXJyZW50Jyk7XHJcbiAgfVxyXG4gIHNlbGVjdGVkRWxlbSA9IG5vZGU7XHJcbiAgc2VsZWN0ZWRFbGVtLmNsYXNzTGlzdC5hZGQoJ2N1cnJlbnQnKTtcclxuICB0aGlzLnNlbGVjdGVkWWVhciA9IHNlbGVjdGVkRWxlbS5pbm5lckhUTUw7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVZZWFyID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICB3aGlsZSAodGFyZ2V0ICE9IGJ1dHRvbnNBcnJheSkge1xyXG4gICAgaWYgKHRhcmdldC5jbGFzc05hbWUgPT0gJ2l0ZW0geWVhcicpIHtcclxuICAgICAgdGhpcy5jaGFuZ2VZZWFyKHRhcmdldCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xyXG4gIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkR3JvdXBzID0gZnVuY3Rpb24gKHRyZWVWaWV3KSB7XHJcbiAgaWYgKHRyZWVWaWV3ID09PSB1bmRlZmluZWQpIHtcclxuICAgIGxldCBmcmFtZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZnJhbWVzXCIpWzBdLmNoaWxkcmVuO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgaWYgKGZyYW1lc1tpXS5zdHlsZS5kaXNwbGF5ID09IFwiYmxvY2tcIikge1xyXG4gICAgICAgIHRyZWVWaWV3ID0gZnJhbWVzW2ldLmNoaWxkcmVuWzBdO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGxldCBHcm91cHMgPSBbXTtcclxuICBsZXQgbGlOdW1iZXIgPSB0cmVlVmlldy5xdWVyeVNlbGVjdG9yQWxsKCdsaScpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlOdW1iZXIubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBncm91cHMgPSBsaU51bWJlcltpXS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dDpjaGVja2VkJyk7XHJcbiAgICBpZiAoZ3JvdXBzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwID0gZ3JvdXBzW2pdLnBhcmVudEVsZW1lbnQubmV4dEVsZW1lbnRTaWJsaW5nLmlubmVySFRNTDtcclxuICAgICAgICBpZiAoZ3JvdXAuaW5kZXhPZihcItC60YPRgNGBXCIpID09PSAtMSkge1xyXG4gICAgICAgICAgR3JvdXBzLnB1c2goZ3JvdXApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gR3JvdXBzO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsIG5hbWVMZWFmKSB7XHJcbiAgdHJlZS5hZGRMZWFmKG5vZGUsIG5hbWVMZWFmLCB7XHJcbiAgICBtb2RlOiAnY2hlY2tib3gnLFxyXG4gICAgY2hlY2tlZDogZmFsc2VcclxuICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW4obm9kZSkge1xyXG4gIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGROb2RlcztcclxuICB3aGlsZSAoY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICBub2RlLnJlbW92ZUNoaWxkKGNoaWxkcmVuWzBdKTtcclxuICB9XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLmNsZWFyR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGlkID0gMDtcclxuICB3aGlsZSAoaWQgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aCkge1xyXG4gICAgdmFyIGxpQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICB0aGlzLmlkVHJlZVZpZXdzW2lkXSkuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgcmVtb3ZlQ2hpbGRyZW4obGlBcnJheVtpXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSk7XHJcbiAgICB9XHJcbiAgICBpZCsrO1xyXG4gIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUudXBkYXRlR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoY291cnNlcykge1xyXG4gIGxldCBpZENvdW50ZXIgPSAwLCBjb3Vyc2VOdW1iZXIgPSBiYWNoZWxvclllYXIsIGNudDtcclxuICBsZXQgY291cnNlc05hbWUgPSBbJ2ZpcnN0JywgJ3NlY29uZCcsICd0aGlyZCcsICdmb3VydGgnXTtcclxuICB2YXIgaSA9IDA7XHJcbiAgd2hpbGUgKGlkQ291bnRlciA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoKSB7XHJcbiAgICB2YXIgdHJlZSA9ICQoXCIjXCIgKyB0aGlzLmlkVHJlZVZpZXdzW2lkQ291bnRlcl0pLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2lkQ291bnRlcl0uaW5kZXhPZihcIm1hc3RlclwiKSAhPT0gLTEpIHtcclxuICAgICAgY291cnNlTnVtYmVyID0gbWFzdGVyWWVhcjtcclxuICAgICAgaSA9IGJhY2hlbG9yWWVhcjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBjb3Vyc2VOdW1iZXIgPSBiYWNoZWxvclllYXI7XHJcbiAgICAgIGkgPSAwO1xyXG4gICAgfVxyXG4gICAgY250ID0gMDtcclxuICAgIGZvciAoaTsgaSA8IGNvdXJzZU51bWJlcjsgaSsrKSB7XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY291cnNlc1tpXS5ncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBsZXQgbm9kZSA9IHRyZWUuZWxlbWVudC5maW5kKCdsaS4nICsgY291cnNlc05hbWVbY250XSk7XHJcbiAgICAgICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsIGNvdXJzZXNbaV0uZ3JvdXBzW2pdKTtcclxuICAgICAgfVxyXG4gICAgICBjbnQrKztcclxuICAgIH1cclxuICAgIGlkQ291bnRlcisrO1xyXG4gIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldENvbmZpZ3VyYXRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgbGV0IGVkdUxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVMZXZlbE9yZ2FuaXNhdGlvblNlY1wiKS52YWx1ZTtcclxuICBsZXQgeWVhcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwieWVhcnNcIik7XHJcbiAgY29uc29sZS5sb2codHlwZVByYWN0aWNlKTtcclxuICBjb25zb2xlLmxvZyhlZHVMZXZlbCk7XHJcbiAgY29uc29sZS5sb2codGhpcy5zZWxlY3RlZFllYXIpO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gdHJlZV9hZGRfbGVhZl9jaGVja2JveCh0cmVlLCBub2RlLCBuYW1lTGVhZiwgaWRUeXBlT3JnYW5pc2F0aW9uKSB7XHJcbiAgdHJlZS5hZGRMZWFmKG5vZGUsIG5hbWVMZWFmLCB7XHJcbiAgICBtb2RlOiAnY2hlY2tib3gnLFxyXG4gICAgY2hlY2tlZDogZmFsc2VcclxuICB9KTtcclxuICBub2RlLmZpbmQoJ3VsJykuZmluZCgnbGknKS5sYXN0KClbMF0uc2V0QXR0cmlidXRlKFwiaWRcIiwgJ3R5cGVfb3JnXydcclxuICAgICAgKyBpZFR5cGVPcmdhbmlzYXRpb24pO1xyXG59XHJcblxyXG5WaWV3LnByb3RvdHlwZS5zZXRUeXBlc09yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uICh0eXBlc09yZ2FuaXNhdGlvbikge1xyXG4gIHZhciB0cmVlVmlld09yZ2FuaXNhdGlvbnMgPSAkKFxyXG4gICAgICBcIiNvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uXCIpLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHR5cGVzT3JnYW5pc2F0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgbm9kZSA9IHRyZWVWaWV3T3JnYW5pc2F0aW9ucy5lbGVtZW50LmZpbmQoJ2xpLm5vZGUnKTtcclxuICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3godHJlZVZpZXdPcmdhbmlzYXRpb25zLCBub2RlLFxyXG4gICAgICAgIHR5cGVzT3JnYW5pc2F0aW9uW2ldLm5hbWUsIHR5cGVzT3JnYW5pc2F0aW9uW2ldLmlkKTtcclxuICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmNsZWFyVHlwZXNPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGxpQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgJ29yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb24nKS5jaGlsZHJlblswXS5jaGlsZHJlbjtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgIHJlbW92ZUNoaWxkcmVuKGxpQXJyYXlbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0pO1xyXG4gIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuc2V0T3JnYW5pc2F0aW9uc0luVHJlZVZpZXcgPSBmdW5jdGlvbiAob3JnYW5pc2F0aW9ucyxcclxuICAgIHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgdmFyIHRyZWUgPSAkKFwiI29yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgb3JnYW5pc2F0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGorKykge1xyXG4gICAgICBpZiAob3JnYW5pc2F0aW9uc1tpXS5pZF90eXBlX29yZ2FuaXNhdGlvbiA9PT0gdHlwZXNPcmdhbmlzYXRpb25bal0uaWQpIHtcclxuICAgICAgICBsZXQgbGlBcnIgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGknKTtcclxuICAgICAgICBsZXQgbm9kZTtcclxuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGxpQXJyLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICBpZiAobGlBcnJba10uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09ICgndHlwZV9vcmdfJ1xyXG4gICAgICAgICAgICAgICAgICArIHR5cGVzT3JnYW5pc2F0aW9uW2pdLmlkKSkge1xyXG4gICAgICAgICAgICBub2RlID0gJChsaUFycltrXSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94X2V4YW1wbGVfY2xpY2sodHJlZSwgbm9kZSxcclxuICAgICAgICAgICAgb3JnYW5pc2F0aW9uc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldEluZm9OZXdPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVDb21wYW55XCIpO1xyXG4gIHZhciB0eXBlT3JnID0gZS5vcHRpb25zW2Uuc2VsZWN0ZWRJbmRleF0udGV4dDtcclxuICBsZXQgb3JnYW5pc2F0aW9uID0ge1xyXG4gICAgJ25hbWUnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgJ3R5cGVPcmcnOiB0eXBlT3JnLFxyXG4gICAgJ2luZm9PcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm9Db21wYW55XCIpLnZhbHVlLFxyXG4gICAgJ2VtYWlsT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbWFpbE9yZ1wiKS52YWx1ZSxcclxuICAgICdwaG9uZU9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGhvbmVPcmdcIikudmFsdWUsXHJcbiAgICAncGxhY2VzT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGFjZXNDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgJ2xvZ2luT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbkNvbXBhbnlcIikudmFsdWUsXHJcbiAgICAncHN3ZE9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHN3ZENvbXBhbnlcIikudmFsdWUsXHJcbiAgICAnYWRkcmVzc09yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWRkcmVzc09yZ1wiKS52YWx1ZVxyXG4gIH07XHJcbiAgcmV0dXJuIG9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0ID0gZnVuY3Rpb24gKHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgbGV0IHR5cGVPcmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVDb21wYW55XCIpO1xyXG4gIHJlbW92ZUNoaWxkcmVuKHR5cGVPcmcpO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdHlwZXNPcmdhbmlzYXRpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgIGxldCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XHJcbiAgICBvcHRpb24uaW5uZXJIVE1MID0gdHlwZXNPcmdhbmlzYXRpb25baV0ubmFtZTtcclxuICAgIHR5cGVPcmcuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5XYWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gIG1ldHJvRGlhbG9nLm9wZW4oJyNkaWFsb2dXYWl0aW5nJyk7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5TdG9wID0gZnVuY3Rpb24gKCkge1xyXG4gIG1ldHJvRGlhbG9nLmNsb3NlKCcjZGlhbG9nV2FpdGluZycpO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvVmlldy5qcyIsImNvbnN0IFNFUFRFTUJFUiA9IDk7XHJcbmNvbnN0IGZpcnN0Q291cnNlID0gMDtcclxuY29uc3Qgc2Vjb25kQ291cnNlID0gMTtcclxuY29uc3QgdGhpcmRDb3Vyc2UgPSAyO1xyXG5jb25zdCBmb3VydGhDb3Vyc2UgPSAzO1xyXG5jb25zdCBtYXN0ZXJGaXJzdENvdXJzZSA9IDQ7XHJcbmNvbnN0IG1hc3RlclNlY29uZENvdXJzZSA9IDU7XHJcblxyXG52YXIgTW9kZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5Hcm91cHMgPSBbXTtcclxuICB0aGlzLlN0dWRlbnRzID0gW107XHJcbiAgdGhpcy5Db3Vyc2VzID0gW107XHJcbiAgdGhpcy50eXBlc09yZ2FuaXNhdGlvbiA9IFtdO1xyXG4gIHRoaXMuT3JnYW5pc2F0aW9ucyA9IFtdO1xyXG59O1xyXG5cclxuY2xhc3MgQ291cnNlIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lQ291cnNlKSB7XHJcbiAgICB0aGlzLm5hbWVDb3Vyc2UgPSBuYW1lQ291cnNlO1xyXG4gICAgdGhpcy5ncm91cHMgPSBbXTtcclxuICB9XHJcblxyXG4gIGFkZEdyb3VwKGdyb3VwKSB7XHJcbiAgICB0aGlzLmdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIEdyb3VwIHtcclxuICBjb25zdHJ1Y3Rvcih1aWRfTERBUCwgbmFtZUdyb3VwKSB7XHJcbiAgICB0aGlzLm5hbWUgPSBuYW1lR3JvdXA7XHJcbiAgICB0aGlzLnVpZF9MREFQID0gdWlkX0xEQVA7XHJcbiAgICB0aGlzLnN0dWRlbnRzID0gW107XHJcbiAgfVxyXG5cclxuICBhZGRTdHVkZW50KHN0dWRlbnQpIHtcclxuICAgIHRoaXMuc3R1ZGVudHMucHVzaChzdHVkZW50KTtcclxuICB9XHJcbn1cclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0RGF0YSA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZEdyb3Vwcykge1xyXG4gIGxldCBkYXRhID0gW107XHJcbiAgZm9yIChsZXQgaSA9IDAsIG4gPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2kpIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7ICsraywgbisrKSB7XHJcbiAgICAgICAgICBkYXRhLnB1c2goe2dyb3VwOiB0aGlzLkdyb3Vwc1tpXS5uYW1lfSk7XHJcbiAgICAgICAgICBkYXRhW25dLnN0dWRlbnQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5uYW1lO1xyXG4gICAgICAgICAgZGF0YVtuXS5zdHVkZW50X1VJRCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLnVpZDtcclxuICAgICAgICAgIGRhdGFbbl0ub3JnYW5pc2F0aW9uID0gajtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGRhdGE7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0R3JvdXBzID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvZ3JvdXBzJyk7XHJcbiAgbGV0IGxpc3QgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gIGxldCBncm91cHMgPSBsaXN0Ll9lbWJlZGRlZC5ncm91cHM7XHJcbiAgcmV0dXJuIGdyb3VwcztcclxufTtcclxuXHJcbi8q0L/QvtC70YPRh9Cw0LXQvCDRgdGC0YPQtNC10L3RgtC+0LIg0LjQtyDRhdGA0LDQvdC40LvQuNGJ0LAgTERBUCDQv9C+IElEINCz0YDRg9C/0L/RiyovXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0J5R3JvdXBJZCA9IGFzeW5jIGZ1bmN0aW9uIChncm91cElEKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJveHkvY29yZS92MS9ncm91cHMvJyArIGdyb3VwSUQpO1xyXG4gIGxldCBsaXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICBsZXQgc3R1ZGVudHNMaXN0ID0gbGlzdC5fZW1iZWRkZWQuc3R1ZGVudHM7XHJcbiAgcmV0dXJuIHN0dWRlbnRzTGlzdDtcclxufTtcclxuXHJcbi8q0L/QvtC70YPRh9Cw0LXQvCDQs9GA0YPQv9C/0Ysg0Lgg0LjRhSDRgdGC0YPQtNC10L3RgtC+0LIg0LjQtyDRhdGA0LDQvdC40LvQuNGJ0LAgTERBUCwg0L7QsdC90L7QstC70Y/QtdC8INGC0LDQsdC70LjRhtGDIFN0dWRlbnRzKi9cclxuTW9kZWwucHJvdG90eXBlLmluaXQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGdyb3VwcyA9IGF3YWl0IHRoaXMuZ2V0R3JvdXBzKCk7XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICB0aGlzLkdyb3Vwcy5wdXNoKG5ldyBHcm91cChncm91cHNbaV0uaWQsIGdyb3Vwc1tpXS5uYW1lKSk7XHJcbiAgfVxyXG5cclxuICBmb3IgKGxldCBpID0gMCwgbiA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgbGV0IHN0dWRlbnRzTGlzdCA9IGF3YWl0IHRoaXMuZ2V0U3R1ZGVudHNCeUdyb3VwSWQodGhpcy5Hcm91cHNbaV0udWlkX0xEQVApO1xyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdHVkZW50c0xpc3QubGVuZ3RoOyArK2osIG4rKykge1xyXG4gICAgICBsZXQgc3R1ZGVudCA9IHtcclxuICAgICAgICAnbmFtZSc6IHN0dWRlbnRzTGlzdFtqXS5kaXNwbGF5TmFtZSxcclxuICAgICAgICAndWlkJzogc3R1ZGVudHNMaXN0W2pdLnVpZFxyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLkdyb3Vwc1tpXS5hZGRTdHVkZW50KHN0dWRlbnQpO1xyXG4gICAgfVxyXG4gICAvL2F3YWl0IHRoaXMuY3JlYXRlT3JVcGRhdGVTdHVkZW50cyh0aGlzLkdyb3Vwc1tpXS5zdHVkZW50cyk7XHJcbiAgfVxyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEN1cnJlbnRZZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICBsZXQgY3VycmVudFllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKTtcclxuICByZXR1cm4gY3VycmVudFllYXI7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZGlzdHJpYnV0ZUdyb3Vwc0J5Q291cnNlcyA9IGFzeW5jIGZ1bmN0aW9uIChjdXJyZW50WWVhcikge1xyXG4gIHRoaXMuQ291cnNlcyA9IFtcclxuICAgIG5ldyBDb3Vyc2UoJzEnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzInKSxcclxuICAgIG5ldyBDb3Vyc2UoJzMnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzQnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzEgKNC80LMpJyksXHJcbiAgICBuZXcgQ291cnNlKCcyICjQvNCzKScpXHJcbiAgXTtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICBpZiAoK2N1cnJlbnRNb250aCA8IFNFUFRFTUJFUikge1xyXG4gICAgY3VycmVudFllYXIgLT0gMTtcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgIT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW21hc3RlckZpcnN0Q291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbZmlyc3RDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSAhPT0gLTEpIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbbWFzdGVyU2Vjb25kQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbc2Vjb25kQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgPT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW3RoaXJkQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgPT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW2ZvdXJ0aENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGN1cnJlbnRZZWFyICs9IDM7XHJcbiAgfVxyXG59O1xyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIENSRUFUSU9OXHJcbiBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0VHlwZXNPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy50eXBlc09yZ2FuaXNhdGlvbiA9IFtdO1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3R5cGVzLW9yZ2FuaXNhdGlvbicpO1xyXG4gIGxldCB0eXBlcyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgdGhpcy50eXBlc09yZ2FuaXNhdGlvbiA9IHR5cGVzO1xyXG4gIHJldHVybiB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9ucycpO1xyXG4gIGxldCBvcmdzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICB0aGlzLk9yZ2FuaXNhdGlvbnMgPSBvcmdzO1xyXG4gIHJldHVybiB0aGlzLk9yZ2FuaXNhdGlvbnM7XHJcbn07XHJcblxyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldERldGVybWluZWRHcm91cHMgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICBsZXQgZGV0ZXJtaW5lZEdyb3VwcyA9IFtdO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgZGV0ZXJtaW5lZEdyb3Vwcy5wdXNoKHRoaXMuR3JvdXBzW2ldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZGV0ZXJtaW5lZEdyb3VwcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVPclVwZGF0ZU9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24nLCB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9yZ2FuaXNhdGlvbilcclxuICB9KVxyXG4gIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQvtGA0LPQsNC90LjQt9Cw0YbQuNC4INCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuY3JlYXRlUHJhY3RpY2UgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZScsIHtcclxuICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICB9LFxyXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkocHJhY3RpY2UpXHJcbiAgfSlcclxuICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0L/RgNCw0LrRgtC40LrQuCDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gIH0pO1xyXG5cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVPclVwZGF0ZVN0dWRlbnRzID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRzKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvc3R1ZGVudHMnLCB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHN0dWRlbnRzKVxyXG4gIH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4IHVpZCDRgdGC0YPQtNC10L3RgtC+0LIg0LIg0JHQlCBcIiArIGVycm9yKTtcclxuICB9KTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9Nb2RlbC5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby5jc3Ncbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWljb25zLmNzc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tc2NoZW1lcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3Mvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQWJBO0FBZUE7QUFqQkE7QUF1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ25iQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBTEE7QUFRQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDek5BOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==
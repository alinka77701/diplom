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

Controller.prototype.init = function () {
    this.View.onClickNextStep = this.displayGroups.bind(this);
    this.View.onClickPracticeCompleted = this.goToStudentsSection.bind(this);
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
};

Controller.prototype.goToOrganisationsSection = function () {
    this.View.goToOrganisationsSection();
};

Controller.prototype.goToStudentsSection = function () {
    this.View.goToStudentsSection();
};
Controller.prototype.goToPracticeCreation = async function () {
    this.View.selectedYear = this.Model.myGetYear();
    this.View.clearGroupsTreeView();
    this.renderGroupsTreeView();
    this.View.clearPracticeSection();
    let typesOrganisation = await this.updateTypesOrganisation();
    this.View.setTypesOrganisationSelect(typesOrganisation);
    this.View.goToPracticeCreation();
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
    let practice = await this.View.dialogPracticeCreatedInit();
    await this.Model.createPractice(practice);
};
/*============================================STUDENTS SECTION=====================================================*/
Controller.prototype.renderGroupsTreeView = function () {
    this.Model.distributeGroupsByCourses(this.View.selectedYear).then(() => {
        this.View.clearGroupsTreeView();
    }).then(() => {
        this.View.updateGroupsTreeView(this.Model.Courses);
    });
};
Controller.prototype.setGroupsTreeView = function (event) {
    this.View.updateYear(event);
    this.renderGroupsTreeView();
};
Controller.prototype.renderDataInTable = async function () {
    let groups = this.View.getSelectedGroups();
    await this.Model.getStudents(groups);
    this.View.renderTable(this.Model.Students);
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
View.prototype.dialogPracticeCreatedInit = async function () {
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
  let practice = {
    'typePractice': typePracticeText,
    'startDatePractice': fromDate,
    'endDatePractice': toDate,
    'deadlinePractice': deadline,
    'lecNum': lecNum,
    'eduLevel': educationLevelText,
    'organisations': arrOrganisations,
    'groups': arrGroups
  };
  return practice;
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
  console.log(Groups);
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

View.prototype.clearGroupsTreeView = function () {
  var id = 0;
  while (id < this.idTreeViews.length) {
    var liArray = document.getElementById(this.idTreeViews[id]).children[0].children;
    for (let i = 0; i < liArray.length; i++) {
      removeChildren(liArray[i].getElementsByTagName('ul')[0]);
    }
    id++;
  }
};
View.prototype.updateGroupsTreeView = function (courses) {
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

/*============================================STUDENTS SECTION=====================================================*/
Model.prototype.getStudents = async function (groups) {
  this.Groups = groups;
  this.Students = [];
  let groupsUIDS = await this.getGroupsUIDS();
  if (groupsUIDS != 0) {
    for (let i = 0, n = 0; i < groupsUIDS.length; ++i) {
      let studentsList = await this.getStudentsByGroupId(groupsUIDS[i]);
      for (let j = 0; j < studentsList.length; ++j, n++) {
        this.Students.push({ group: this.Groups[i] });
        this.Students[n].student = studentsList[j].displayName;
        this.Students[n].organisation = j;
      }
    }
  }
};

Model.prototype.getAllGroups = async function () {
  let groups = [];
  let result = await fetch('/proxy/core/v1/groups').then(async function (response) {
    return await response.json();
  }).then(function (response) {
    groups = response._embedded.groups;
  });
  return groups;
};

Model.prototype.myGetYear = function () {
  let date = new Date();
  let currentYear = date.getFullYear().toString();
  return currentYear;
};

Model.prototype.distributeGroupsByCourses = async function (currentYear) {
  delete this.Courses;
  this.Courses = [new Course('1'), new Course('2'), new Course('3'), new Course('4'), new Course('1 (мг)'), new Course('2 (мг)')];
  console.log(this.Courses);
  let groups = await this.getAllGroups();
  console.log(groups);
  let date = new Date();
  let currentMonth = date.getMonth();
  if (+currentMonth < SEPTEMBER) {
    currentYear -= 1;
  }

  for (let i = 0; i < groups.length; i++) {
    if (groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
      if (groups[i].name.indexOf("мг") !== -1) {

        this.Courses[masterFirstCourse].addGroup(groups[i].name);
      } else {

        this.Courses[firstCourse].addGroup(groups[i].name);
      }
    }
    currentYear--;
    if (groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
      if (groups[i].name.indexOf("мг") !== -1) {
        this.Courses[masterSecondCourse].addGroup(groups[i].name);
      } else {
        this.Courses[secondCourse].addGroup(groups[i].name);
      }
    }
    currentYear--;
    if (groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
      if (groups[i].name.indexOf("мг") === -1) {
        this.Courses[thirdCourse].addGroup(groups[i].name);
      }
    }
    currentYear--;
    if (groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
      if (groups[i].name.indexOf("мг") === -1) {
        this.Courses[fourthCourse].addGroup(groups[i].name);
      }
    }
    currentYear += 3;
  }
};

Model.prototype.getGroupsUIDS = async function () {
  let groupsUIDS = [];
  for (let i = 0; i < this.Groups.length; ++i) {
    let groupName = this.Groups[i];
    let result = await fetch('/proxy/core/v1/groups?name=' + groupName).then(async function (response) {
      return await response.json();
    }).then(function (response) {
      let groups = response;
      let groupID = response._embedded.groups[0].id;
      groupsUIDS.push(groupID);
    }).catch(error => {
      alert("Группа " + groupName + " не существует.");
    });
  }
  return groupsUIDS;
};

Model.prototype.getStudentsByGroupId = async function (groupID) {
  let studentsList = [];
  let result = await fetch('/proxy/core/v1/groups/' + groupID).then(async function (response) {
    return await response.json();
  }).then(function (response) {
    studentsList = response._embedded.students;
  }).catch(error => {
    alert(error);
  });
  return studentsList;
};
/*============================================PRACTICE CREATION
 SECTION=====================================================*/
Model.prototype.getTypesOrganisation = async function () {
  this.typesOrganisation = [];
  let types = [];
  let result = await fetch('/types-organisation').then(async function (response) {
    return await response.json();
  }).then(function (response) {
    types = response;
  });
  this.typesOrganisation = types;
  return this.typesOrganisation;
};
Model.prototype.getOrganisations = async function () {
  let orgs = [];
  let result = await fetch('/organisations').then(async function (response) {
    return await response.json();
  }).then(function (response) {
    orgs = response;
  });
  console.log(orgs);
  this.Organisations = orgs;
  return this.Organisations;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGU1ZWNiNTdkMDdhODgwZjliYTUyIiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9saWJzL0RhdGFUYWJsZXMvZGF0YXRhYmxlcy5taW4uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBlNWVjYjU3ZDA3YTg4MGY5YmE1MiIsImNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlICgnLi9Db250cm9sbGVyLmpzJyk7XHJcblxyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzJyk7XHJcbnJlcXVpcmUoJy4vbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcycpO1xyXG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgbmV3IENvbnRyb2xsZXIoKTtcclxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9tYWluLmpzIiwiY29uc3QgVmlldyA9ICByZXF1aXJlICgnLi9WaWV3LmpzJyk7XHJcbmNvbnN0IE1vZGVsID0gIHJlcXVpcmUgKCcuL01vZGVsLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBDb250cm9sbGVyICgpIHtcclxuICAgIHRoaXMuVmlldyA9IG5ldyBWaWV3KCk7XHJcbiAgICB0aGlzLk1vZGVsID0gbmV3IE1vZGVsKCk7XHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrTmV4dFN0ZXAgPSB0aGlzLmRpc3BsYXlHcm91cHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQgPSB0aGlzLmdvVG9TdHVkZW50c1NlY3Rpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UgPSB0aGlzLmdvVG9QcmFjdGljZUNyZWF0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0FkZFByYWN0aWNlID0gdGhpcy5jcmVhdGVQcmFjdGljZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tUb09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gdGhpcy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24gPSB0aGlzLmdvVG9TdHVkZW50c1NlY3Rpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrRmluaXNoQnRuID0gdGhpcy5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1NlbGVjdEdyb3VwQnRuT2sgPSB0aGlzLnJlbmRlckRhdGFJblRhYmxlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1llYXJzQXJyYXkgPSB0aGlzLnNldEdyb3Vwc1RyZWVWaWV3LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0dldE9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldE9yZ2FuaXNhdGlvbnMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uID0gdGhpcy5jcmVhdGVOZXdPcmdhbmlzYXRpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5pbml0KCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nb1RvU3R1ZGVudHNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmdvVG9TdHVkZW50c1NlY3Rpb24oKTtcclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub1ByYWN0aWNlQ3JlYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID0gdGhpcy5Nb2RlbC5teUdldFllYXIoKTtcclxuICAgIHRoaXMuVmlldy5jbGVhckdyb3Vwc1RyZWVWaWV3KCk7XHJcbiAgICB0aGlzLnJlbmRlckdyb3Vwc1RyZWVWaWV3KCk7XHJcbiAgICB0aGlzLlZpZXcuY2xlYXJQcmFjdGljZVNlY3Rpb24oKTtcclxuICAgIGxldCB0eXBlc09yZ2FuaXNhdGlvbj0gYXdhaXQgdGhpcy51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0KHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5nb1RvUHJhY3RpY2VDcmVhdGlvbigpO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHlwZXNPcmdhbmlzYXRpb249IGF3YWl0IHRoaXMuTW9kZWwuZ2V0VHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICB0aGlzLlZpZXcuY2xlYXJUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvbih0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgbGV0IG9yZ2FuaXNhdGlvbnM9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xyXG4gIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zSW5UcmVlVmlldyhvcmdhbmlzYXRpb25zLHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICByZXR1cm4gdHlwZXNPcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZGlzcGxheUdyb3VwcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5kaXNwbGF5R3JvdXBzKCk7XHJcbn07XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCgpO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5jcmVhdGVOZXdPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IG9yZ2FuaXNhdGlvbj0gdGhpcy5WaWV3LmdldEluZm9OZXdPcmdhbmlzYXRpb24oKTtcclxuICBhd2FpdCB0aGlzLk1vZGVsLmNyZWF0ZU9yVXBkYXRlT3JnYW5pc2F0aW9uKG9yZ2FuaXNhdGlvbik7XHJcbiAgYXdhaXQgdGhpcy51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5jcmVhdGVQcmFjdGljZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgcHJhY3RpY2UgPSBhd2FpdCB0aGlzLlZpZXcuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCgpO1xyXG4gIGF3YWl0IHRoaXMuTW9kZWwuY3JlYXRlUHJhY3RpY2UocHJhY3RpY2UpO1xyXG59O1xyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyR3JvdXBzVHJlZVZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLk1vZGVsLmRpc3RyaWJ1dGVHcm91cHNCeUNvdXJzZXModGhpcy5WaWV3LnNlbGVjdGVkWWVhcilcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuVmlldy5jbGVhckdyb3Vwc1RyZWVWaWV3KCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuVmlldy51cGRhdGVHcm91cHNUcmVlVmlldyh0aGlzLk1vZGVsLkNvdXJzZXMpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5zZXRHcm91cHNUcmVlVmlldyA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdGhpcy5WaWV3LnVwZGF0ZVllYXIoZXZlbnQpO1xyXG4gICAgdGhpcy5yZW5kZXJHcm91cHNUcmVlVmlldygpO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZW5kZXJEYXRhSW5UYWJsZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBncm91cHMgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRHcm91cHMoKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwuZ2V0U3R1ZGVudHMoZ3JvdXBzKTtcclxuICAgIHRoaXMuVmlldy5yZW5kZXJUYWJsZSh0aGlzLk1vZGVsLlN0dWRlbnRzKTtcclxuICAgIHRoaXMuVmlldy5yZW5kZXJJbmZvKCk7XHJcbn07XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25zKCk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9Db250cm9sbGVyLmpzIiwiY29uc3QgYmFjaGVsb3JZZWFyID0gNDtcclxuY29uc3QgbWFzdGVyWWVhciA9IDY7XHJcbmxldCBzZWxlY3RlZEVsZW0gPSAwO1xyXG5cclxudmFyIFZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdGhpcy5vbkNsaWNrTmV4dFN0ZXAgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja1ByYWN0aWNlQ29tcGxldGVkID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tDcmVhdGVQcmFjdGljZSA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrQWRkUHJhY3RpY2UgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBudWxsO1xyXG4gIHRoaXMub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tGaW5pc2hCdG4gPSBudWxsO1xyXG4gIHRoaXMub25DbGlja1NlbGVjdEdyb3VwQnRuT2sgPSBudWxsO1xyXG4gIHRoaXMubXlUYWJsZSA9ICQoJyNzdHVkZW50c0xpc3RUYWJsZScpO1xyXG4gIHRoaXMub25DbGlja1llYXJzQXJyYXkgPSBudWxsO1xyXG4gIHRoaXMuc2VsZWN0ZWRZZWFyID0gbnVsbDtcclxuICB0aGlzLmlkVHJlZVZpZXdzID0gW1xyXG4gICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWJhY2hlbG9yJyxcclxuICAgICdncm91cC10cmVldmlldy10YWJjb250cm9sMi1tYXN0ZXInLFxyXG4gICAgJ2dyb3Vwcy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbi1iYWNoZWxvcicsXHJcbiAgICAnZ3JvdXBzLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uLW1hc3RlcidcclxuICBdO1xyXG4gIHRoaXMub25DbGlja0dldE9yZ2FuaXNhdGlvbnMgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbiA9IG51bGw7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tbmV4dFwiKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja05leHRTdGVwKTtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2RpYWxvZ1ByYWN0aWNlQ29tcGxldGVTdWNjZXNzXCIpLnF1ZXJ5U2VsZWN0b3IoXHJcbiAgICAgIFwiI3ByYWN0aWNlRmluaXNoZWRPa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja1ByYWN0aWNlQ29tcGxldGVkKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVByYWN0aWNlQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnYW5pc2F0aW9uc1NlY3Rpb25CdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tUb09yZ2FuaXNhdGlvbnNTZWN0aW9uKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0dWRlbnRzU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLWZpbmlzaFwiKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja0ZpbmlzaEJ0bik7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZXRHcm91cHNCdG5Pa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja1NlbGVjdEdyb3VwQnRuT2spO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrWWVhcnNBcnJheSk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25zQXJyYXkxXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrWWVhcnNBcnJheSk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZXRPcmdhbmlzYXRpb25zQnRuT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tHZXRPcmdhbmlzYXRpb25zKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZU9yZ2FuaXNhdGlvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbik7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcmFjdGljZUZpbmlzaGVkT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tBZGRQcmFjdGljZSk7XHJcbiAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSh7XHJcbiAgICBkYXRhOiB0aGlzLkdyb3VwcyxcclxuICAgIFwibGFuZ3VhZ2VcIjoge1xyXG4gICAgICBcInplcm9SZWNvcmRzXCI6IFwi0KLQsNC60L7QuSDQt9Cw0L/QuNGB0Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIixcclxuICAgICAgXCJlbXB0eVRhYmxlXCI6IFwi0J3QuCDQvtC00L3QsCDQuNC3INCz0YDRg9C/0L8g0L3QtSDQstGL0LHRgNCw0L3QsC5cIixcclxuICAgICAgXCJzZWFyY2hcIjogXCLQn9C+0LjRgdC6OlwiLFxyXG4gICAgICBcInBhZ2luYXRlXCI6IHtcclxuICAgICAgICBcImZpcnN0XCI6IFwi0J/QtdGA0LLRi9C5XCIsXHJcbiAgICAgICAgXCJsYXN0XCI6IFwi0J/QvtGB0LvQtdC00L3QuNC5XCIsXHJcbiAgICAgICAgXCJuZXh0XCI6IFwi0JLQv9C10YDQtdC0XCIsXHJcbiAgICAgICAgXCJwcmV2aW91c1wiOiBcItCd0LDQt9Cw0LRcIlxyXG4gICAgICB9LFxyXG4gICAgICBcImluZm9GaWx0ZXJlZFwiOiBcIijQuNC3IF9NQVhfINGB0YLRg9C00LXQvdGC0L7QsilcIixcclxuICAgICAgXCJsZW5ndGhNZW51XCI6IFwi0J/QvtC60LDQt9Cw0YLRjCBfTUVOVV8g0LfQsNC/0LjRgdC10LlcIixcclxuICAgICAgXCJpbmZvXCI6IFwi0J7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgdGC0YPQtNC10L3RgtC+0LI6IF9UT1RBTF8gXCIsXHJcbiAgICAgIFwiaW5mb0VtcHR5XCI6IFwi0JLRi9Cx0LXRgNC40YLQtSDQs9GA0YPQv9C/0YMuXCJcclxuICAgIH0sXHJcbiAgICBcImNvbHVtbnNcIjogW1xyXG4gICAgICB7XCJkYXRhXCI6IFwiZ3JvdXBcIn0sXHJcbiAgICAgIHtcImRhdGFcIjogXCJzdHVkZW50XCJ9LFxyXG4gICAgICB7XCJkYXRhXCI6IFwib3JnYW5pc2F0aW9uXCJ9XHJcbiAgICBdXHJcbiAgfSk7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvU3R1ZGVudHNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3JnYW5pc2F0aW9uc1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICBsZXQgdHJlZVZpZXdzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInRyZWV2aWV3IFwiKTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgdHJlZVZpZXdzW2ldLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3JnYW5pc2F0aW9uc1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9QcmFjdGljZUNyZWF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxufTtcclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09UFJBQ1RJQ0UgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5WaWV3LnByb3RvdHlwZS5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCBmaW5pc2hCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLWZpbmlzaFwiKVswXTtcclxuICBmaW5pc2hCdG4uc2V0QXR0cmlidXRlKFwib25jbGlja1wiLFxyXG4gICAgICBcIm1ldHJvRGlhbG9nLm9wZW4oJyNkaWFsb2dQcmFjdGljZUNvbXBsZXRlU3VjY2VzcycpXCIpO1xyXG4gIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1Y2F0aW9uXCIpLnZhbHVlO1xyXG4gIGxldCB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQo9GH0LXQsdC90LDRj1wiO1xyXG4gIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVQcmFjdGljZVwiKS52YWx1ZTtcclxuICBsZXQgZWR1Y2F0aW9uTGV2ZWxUZXh0ID0gXCLQkdCw0LrQsNC70LDQstGA0LjQsNGCXCI7XHJcbiAgaWYgKGVkdWNhdGlvbkxldmVsID09PSBcImJhY2hlbG9yXCIpIHtcclxuICAgIGVkdWNhdGlvbkxldmVsVGV4dCA9IFwi0JHQsNC60LDQu9Cw0LLRgNC40LDRglwiO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGVkdWNhdGlvbkxldmVsVGV4dCA9IFwi0JzQsNCz0LjRgdGC0YDQsNGC0YPRgNCwXCI7XHJcbiAgfVxyXG4gIGxldCBsZWNOdW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY051bVwiKS52YWx1ZTtcclxuICBsZXQgZnJvbURhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZyb21EYXRlSW5wdXRcIikudmFsdWU7XHJcbiAgbGV0IHRvRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9EYXRlSW5wdXRcIikudmFsdWU7XHJcbiAgbGV0IGRlYWRsaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRlcm1zUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gJ2MgJyArIGZyb21EYXRlXHJcbiAgICAgICsgJyDQv9C+ICcgKyB0b0RhdGU7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGRlYWRsaW5lO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1Rlcm1zUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gZnJvbURhdGVcclxuICAgICAgKyAnIC0gJyArIHRvRGF0ZTtcclxuICBpZiAoZnJvbURhdGUgPT09IFwiXCIpIHtcclxuICAgIGZyb21EYXRlID0gXCIyMDAwLTAxLTAxIDIxOjAwOjAwLjAwMCArMDA6MDBcIjtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBmcm9tRGF0ZT1mcm9tRGF0ZS5zdWJzdHIoOCw0KSsnLScrIGZyb21EYXRlLnN1YnN0cig0LDIpKyctJytmcm9tRGF0ZS5zdWJzdHIoMCwyKSsnICcgKyAnMjE6MDA6MDAuMDAwICswMDowMCc7XHJcbiAgfVxyXG4gIGlmICh0b0RhdGUgPT09IFwiXCIpIHtcclxuICAgIHRvRGF0ZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgfVxyXG4gIGVsc2V7XHJcbiAgICB0b0RhdGU9dG9EYXRlLnN1YnN0cig4LDQpKyctJysgdG9EYXRlLnN1YnN0cig0LDIpKyctJyt0b0RhdGUuc3Vic3RyKDAsMikrJyAnICsgJzIxOjAwOjAwLjAwMCArMDA6MDAnO1xyXG4gIH1cclxuICBpZiAoZGVhZGxpbmUgPT09IFwiXCIpIHtcclxuICAgIGRlYWRsaW5lID0gXCIyMDAwLTAxLTAxIDIxOjAwOjAwLjAwMCArMDA6MDBcIjtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBkZWFkbGluZT1kZWFkbGluZS5zdWJzdHIoOCw0KSsnLScrIGRlYWRsaW5lLnN1YnN0cig0LDIpKyctJytkZWFkbGluZS5zdWJzdHIoMCwyKSsnICcgKyAnMjE6MDA6MDAuMDAwICswMDowMCc7XHJcbiAgfVxyXG5cclxuICBpZiAodHlwZVByYWN0aWNlID09PSBcImVkdWNhdGlvbmFsXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJpbnRlcm5zaGlwXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQvtC40LfQstC+0LTRgdGC0LLQtdC90L3QsNGPXCI7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJwcmVkaXBsb21hXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQtdC00LTQuNC/0LvQvtC80L3QsNGPXCI7XHJcbiAgfVxyXG4gIGxldCB0cmVlVmlldyA9IG51bGw7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwicHJhY3RpY2VcIikgIT09IC0xXHJcbiAgICAgICAgJiYgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheVxyXG4gICAgICAgID09PVwiYmxvY2tcIikge1xyXG4gICAgICB0cmVlVmlldyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBsZXQgYXJyR3JvdXBzID0gdGhpcy5nZXRTZWxlY3RlZEdyb3Vwcyh0cmVlVmlldyk7XHJcbiAgbGV0IGFyck9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldFNlbGVjdGVkR3JvdXBzKFxyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikpO1xyXG5cclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR5cGVQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2VUZXh0O1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImVkdWNhdGlvbmFsTGV2ZWxEaWFsb2dcIikuaW5uZXJIVE1MID0gZWR1Y2F0aW9uTGV2ZWxUZXh0O1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JvdXBzUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gYXJyR3JvdXBzO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcIm9yZ2FuaXNhdGlvbnNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJPcmdhbmlzYXRpb25zO1xyXG5cclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlVGV4dFxyXG4gICAgICArIFwiINC/0YDQsNC60YLQuNC60LBcIjtcclxuXHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWNOdW1EaWFsb2dcIikuaW5uZXJIVE1MID0gbGVjTnVtO1xyXG4gIGxldCBwcmFjdGljZSA9IHtcclxuICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2VUZXh0LFxyXG4gICAgJ3N0YXJ0RGF0ZVByYWN0aWNlJzpmcm9tRGF0ZSxcclxuICAgICdlbmREYXRlUHJhY3RpY2UnOnRvRGF0ZSxcclxuICAgICdkZWFkbGluZVByYWN0aWNlJzpkZWFkbGluZSxcclxuICAgICdsZWNOdW0nOmxlY051bSxcclxuICAgICdlZHVMZXZlbCc6ZWR1Y2F0aW9uTGV2ZWxUZXh0LFxyXG4gICAgICAnb3JnYW5pc2F0aW9ucyc6IGFyck9yZ2FuaXNhdGlvbnMsXHJcbiAgICAgICdncm91cHMnOiBhcnJHcm91cHNcclxuICB9O1xyXG4gIHJldHVybiBwcmFjdGljZTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmRpc3BsYXlHcm91cHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVjYXRpb25cIikudmFsdWU7XHJcbiAgaWYgKGVkdWNhdGlvbkxldmVsID09PSBcImJhY2hlbG9yXCIpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn07XHJcblZpZXcucHJvdG90eXBlLmNsZWFyUHJhY3RpY2VTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJvbURhdGVJbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVJbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZSA9IFwiXCI7XHJcbn07XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJJbmZvID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVQcmFjdGljZVRhYlwiKS52YWx1ZTtcclxuICBsZXQgdHlwZVByYWN0aWNlVGV4dCA9IFwi0KPRh9C10LHQvdCw0Y9cIjtcclxuICBpZiAodHlwZVByYWN0aWNlID09PSBcImVkdWNhdGlvbmFsXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJpbnRlcm5zaGlwXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQvtC40LfQstC+0LTRgdGC0LLQtdC90L3QsNGPXCI7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJwcmVkaXBsb21hXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQtdC00LTQuNC/0LvQvtC80L3QsNGPXCI7XHJcbiAgfVxyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2VUZXh0XHJcbiAgICAgICsgJyDQv9GA0LDQutGC0LjQutCwJztcclxufTtcclxuVmlldy5wcm90b3R5cGUucmVuZGVyVGFibGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuQ2xlYXJUYWJsZSgpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkNsZWFyVGFibGUoKTtcclxuICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkFkZERhdGEoZGF0YSk7XHJcbiAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuY2hhbmdlWWVhciA9IGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgaWYgKHNlbGVjdGVkRWxlbSkge1xyXG4gICAgc2VsZWN0ZWRFbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2N1cnJlbnQnKTtcclxuICB9XHJcbiAgc2VsZWN0ZWRFbGVtID0gbm9kZTtcclxuICBzZWxlY3RlZEVsZW0uY2xhc3NMaXN0LmFkZCgnY3VycmVudCcpO1xyXG4gIHRoaXMuc2VsZWN0ZWRZZWFyID0gc2VsZWN0ZWRFbGVtLmlubmVySFRNTDtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZVllYXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gIHdoaWxlICh0YXJnZXQgIT0gYnV0dG9uc0FycmF5KSB7XHJcbiAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZSA9PSAnaXRlbSB5ZWFyJykge1xyXG4gICAgICB0aGlzLmNoYW5nZVllYXIodGFyZ2V0KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XHJcbiAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRHcm91cHMgPSBmdW5jdGlvbiAodHJlZVZpZXcpIHtcclxuICBpZiAodHJlZVZpZXcgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgbGV0IGZyYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmcmFtZXNcIilbMF0uY2hpbGRyZW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoZnJhbWVzW2ldLnN0eWxlLmRpc3BsYXkgPT0gXCJibG9ja1wiKSB7XHJcbiAgICAgICAgdHJlZVZpZXcgPSBmcmFtZXNbaV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgbGV0IEdyb3VwcyA9IFtdO1xyXG4gIGxldCBsaU51bWJlciA9IHRyZWVWaWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaU51bWJlci5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IGdyb3VwcyA9IGxpTnVtYmVyW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0OmNoZWNrZWQnKTtcclxuICAgIGlmIChncm91cHMubGVuZ3RoID09IDEpIHtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBsZXQgZ3JvdXAgPSBncm91cHNbal0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MO1xyXG4gICAgICAgIGlmIChncm91cC5pbmRleE9mKFwi0LrRg9GA0YFcIikgPT09IC0xKSB7XHJcbiAgICAgICAgICBHcm91cHMucHVzaChncm91cCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGNvbnNvbGUubG9nKEdyb3Vwcyk7XHJcbiAgcmV0dXJuIEdyb3VwcztcclxufTtcclxuXHJcbmZ1bmN0aW9uIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLCBuYW1lTGVhZikge1xyXG4gIHRyZWUuYWRkTGVhZihub2RlLCBuYW1lTGVhZiwge1xyXG4gICAgbW9kZTogJ2NoZWNrYm94JyxcclxuICAgIGNoZWNrZWQ6IGZhbHNlXHJcbiAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUNoaWxkcmVuKG5vZGUpIHtcclxuICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkTm9kZXM7XHJcbiAgd2hpbGUgKGNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZHJlblswXSk7XHJcbiAgfVxyXG59XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jbGVhckdyb3Vwc1RyZWVWaWV3ID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBpZCA9IDA7XHJcbiAgd2hpbGUgKGlkIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcclxuICAgIHZhciBsaUFycmF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgdGhpcy5pZFRyZWVWaWV3c1tpZF0pLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHJlbW92ZUNoaWxkcmVuKGxpQXJyYXlbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0pO1xyXG4gICAgfVxyXG4gICAgaWQrKztcclxuICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZUdyb3Vwc1RyZWVWaWV3ID0gZnVuY3Rpb24gKGNvdXJzZXMpIHtcclxuICBsZXQgaWRDb3VudGVyID0gMCwgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyLCBjbnQ7XHJcbiAgbGV0IGNvdXJzZXNOYW1lID0gWydmaXJzdCcsICdzZWNvbmQnLCAndGhpcmQnLCAnZm91cnRoJ107XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHdoaWxlIChpZENvdW50ZXIgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aCkge1xyXG4gICAgdmFyIHRyZWUgPSAkKFwiI1wiICsgdGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdKS5kYXRhKFwidHJlZXZpZXdcIik7XHJcbiAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgIGNvdXJzZU51bWJlciA9IG1hc3RlclllYXI7XHJcbiAgICAgIGkgPSBiYWNoZWxvclllYXI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgICBpID0gMDtcclxuICAgIH1cclxuICAgIGNudCA9IDA7XHJcbiAgICBmb3IgKGk7IGkgPCBjb3Vyc2VOdW1iZXI7IGkrKykge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdXJzZXNbaV0uZ3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgbGV0IG5vZGUgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGkuJyArIGNvdXJzZXNOYW1lW2NudF0pO1xyXG4gICAgICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLCBjb3Vyc2VzW2ldLmdyb3Vwc1tqXSk7XHJcbiAgICAgIH1cclxuICAgICAgY250Kys7XHJcbiAgICB9XHJcbiAgICBpZENvdW50ZXIrKztcclxuICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRDb25maWd1cmF0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIFwic2VsZWN0VHlwZVByYWN0aWNlT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gIGxldCBlZHVMZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1TGV2ZWxPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgbGV0IHllYXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInllYXJzXCIpO1xyXG4gIGNvbnNvbGUubG9nKHR5cGVQcmFjdGljZSk7XHJcbiAgY29uc29sZS5sb2coZWR1TGV2ZWwpO1xyXG4gIGNvbnNvbGUubG9nKHRoaXMuc2VsZWN0ZWRZZWFyKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHRyZWVfYWRkX2xlYWZfY2hlY2tib3godHJlZSwgbm9kZSwgbmFtZUxlYWYsIGlkVHlwZU9yZ2FuaXNhdGlvbikge1xyXG4gIHRyZWUuYWRkTGVhZihub2RlLCBuYW1lTGVhZiwge1xyXG4gICAgbW9kZTogJ2NoZWNrYm94JyxcclxuICAgIGNoZWNrZWQ6IGZhbHNlXHJcbiAgfSk7XHJcbiAgbm9kZS5maW5kKCd1bCcpLmZpbmQoJ2xpJykubGFzdCgpWzBdLnNldEF0dHJpYnV0ZShcImlkXCIsICd0eXBlX29yZ18nXHJcbiAgICAgICsgaWRUeXBlT3JnYW5pc2F0aW9uKTtcclxufVxyXG5cclxuVmlldy5wcm90b3R5cGUuc2V0VHlwZXNPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAodHlwZXNPcmdhbmlzYXRpb24pIHtcclxuICB2YXIgdHJlZVZpZXdPcmdhbmlzYXRpb25zID0gJChcclxuICAgICAgXCIjb3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKS5kYXRhKFwidHJlZXZpZXdcIik7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eXBlc09yZ2FuaXNhdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IG5vZGUgPSB0cmVlVmlld09yZ2FuaXNhdGlvbnMuZWxlbWVudC5maW5kKCdsaS5ub2RlJyk7XHJcbiAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94KHRyZWVWaWV3T3JnYW5pc2F0aW9ucywgbm9kZSxcclxuICAgICAgICB0eXBlc09yZ2FuaXNhdGlvbltpXS5uYW1lLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XHJcbiAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5jbGVhclR5cGVzT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBsaUFycmF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICdvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uJykuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICByZW1vdmVDaGlsZHJlbihsaUFycmF5W2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1bCcpWzBdKTtcclxuICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnNldE9yZ2FuaXNhdGlvbnNJblRyZWVWaWV3ID0gZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbnMsXHJcbiAgICB0eXBlc09yZ2FuaXNhdGlvbikge1xyXG4gIHZhciB0cmVlID0gJChcIiNvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uXCIpLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZ2FuaXNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgdHlwZXNPcmdhbmlzYXRpb24ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgaWYgKG9yZ2FuaXNhdGlvbnNbaV0uaWRfdHlwZV9vcmdhbmlzYXRpb24gPT09IHR5cGVzT3JnYW5pc2F0aW9uW2pdLmlkKSB7XHJcbiAgICAgICAgbGV0IGxpQXJyID0gdHJlZS5lbGVtZW50LmZpbmQoJ2xpJyk7XHJcbiAgICAgICAgbGV0IG5vZGU7XHJcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBsaUFyci5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgaWYgKGxpQXJyW2tdLmdldEF0dHJpYnV0ZShcImlkXCIpID09PSAoJ3R5cGVfb3JnXydcclxuICAgICAgICAgICAgICAgICAgKyB0eXBlc09yZ2FuaXNhdGlvbltqXS5pZCkpIHtcclxuICAgICAgICAgICAgbm9kZSA9ICQobGlBcnJba10pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsXHJcbiAgICAgICAgICAgIG9yZ2FuaXNhdGlvbnNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRJbmZvTmV3T3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlQ29tcGFueVwiKTtcclxuICB2YXIgdHlwZU9yZyA9IGUub3B0aW9uc1tlLnNlbGVjdGVkSW5kZXhdLnRleHQ7XHJcbiAgbGV0IG9yZ2FuaXNhdGlvbiA9IHtcclxuICAgICduYW1lJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuYW1lQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICd0eXBlT3JnJzogdHlwZU9yZyxcclxuICAgICdpbmZvT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICdlbWFpbE9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1haWxPcmdcIikudmFsdWUsXHJcbiAgICAncGhvbmVPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBob25lT3JnXCIpLnZhbHVlLFxyXG4gICAgJ3BsYWNlc09yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxhY2VzQ29tcGFueVwiKS52YWx1ZSxcclxuICAgICdsb2dpbk9yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW5Db21wYW55XCIpLnZhbHVlLFxyXG4gICAgJ3Bzd2RPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBzd2RDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgJ2FkZHJlc3NPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZHJlc3NPcmdcIikudmFsdWVcclxuICB9O1xyXG4gIHJldHVybiBvcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5zZXRUeXBlc09yZ2FuaXNhdGlvblNlbGVjdCA9IGZ1bmN0aW9uICh0eXBlc09yZ2FuaXNhdGlvbikge1xyXG4gIGxldCB0eXBlT3JnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlQ29tcGFueVwiKTtcclxuICByZW1vdmVDaGlsZHJlbih0eXBlT3JnKTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHR5cGVzT3JnYW5pc2F0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICBvcHRpb24uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdHlwZXNPcmdhbmlzYXRpb25baV0uaWQpO1xyXG4gICAgb3B0aW9uLmlubmVySFRNTCA9IHR5cGVzT3JnYW5pc2F0aW9uW2ldLm5hbWU7XHJcbiAgICB0eXBlT3JnLmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgfVxyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvVmlldy5qcyIsImNvbnN0IFNFUFRFTUJFUiA9IDk7XHJcbmNvbnN0IGZpcnN0Q291cnNlPTA7XHJcbmNvbnN0IHNlY29uZENvdXJzZSA9IDE7XHJcbmNvbnN0IHRoaXJkQ291cnNlPTI7XHJcbmNvbnN0IGZvdXJ0aENvdXJzZSA9IDM7XHJcbmNvbnN0IG1hc3RlckZpcnN0Q291cnNlPTQ7XHJcbmNvbnN0IG1hc3RlclNlY29uZENvdXJzZT01O1xyXG5cclxudmFyIE1vZGVsID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuR3JvdXBzID0gW107XHJcbiAgdGhpcy5TdHVkZW50cyA9IFtdO1xyXG4gIHRoaXMuQ291cnNlcyA9IFtdO1xyXG4gIHRoaXMudHlwZXNPcmdhbmlzYXRpb249W107XHJcbiAgdGhpcy5PcmdhbmlzYXRpb25zID0gW107XHJcbn07XHJcblxyXG5jbGFzcyBDb3Vyc2Uge1xyXG4gIGNvbnN0cnVjdG9yKG5hbWVDb3Vyc2UpIHtcclxuICAgIHRoaXMubmFtZUNvdXJzZSA9IG5hbWVDb3Vyc2U7XHJcbiAgICB0aGlzLmdyb3VwcyA9IFtdO1xyXG4gIH1cclxuXHJcbiAgYWRkR3JvdXAoZ3JvdXApIHtcclxuICAgIHRoaXMuZ3JvdXBzLnB1c2goZ3JvdXApO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0U3R1ZGVudHMgPSBhc3luYyBmdW5jdGlvbiAoZ3JvdXBzKSB7XHJcbiAgdGhpcy5Hcm91cHMgPSBncm91cHM7XHJcbiAgdGhpcy5TdHVkZW50cyA9IFtdO1xyXG4gIGxldCBncm91cHNVSURTID0gYXdhaXQgdGhpcy5nZXRHcm91cHNVSURTKCk7XHJcbiAgaWYgKGdyb3Vwc1VJRFMgIT0gMCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDAsIG4gPSAwOyBpIDwgZ3JvdXBzVUlEUy5sZW5ndGg7ICsraSkge1xyXG4gICAgICBsZXQgc3R1ZGVudHNMaXN0ID0gYXdhaXQgdGhpcy5nZXRTdHVkZW50c0J5R3JvdXBJZChncm91cHNVSURTW2ldKTtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdHVkZW50c0xpc3QubGVuZ3RoOyArK2osIG4rKykge1xyXG4gICAgICAgIHRoaXMuU3R1ZGVudHMucHVzaCh7Z3JvdXA6IHRoaXMuR3JvdXBzW2ldfSk7XHJcbiAgICAgICAgdGhpcy5TdHVkZW50c1tuXS5zdHVkZW50ID0gc3R1ZGVudHNMaXN0W2pdLmRpc3BsYXlOYW1lO1xyXG4gICAgICAgIHRoaXMuU3R1ZGVudHNbbl0ub3JnYW5pc2F0aW9uID0gajtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRBbGxHcm91cHMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGdyb3VwcyA9IFtdO1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvZ3JvdXBzJylcclxuICAudGhlbihhc3luYyBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgfSlcclxuICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgIGdyb3VwcyA9IHJlc3BvbnNlLl9lbWJlZGRlZC5ncm91cHM7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGdyb3VwcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5teUdldFllYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gIGxldCBjdXJyZW50WWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpO1xyXG4gIHJldHVybiBjdXJyZW50WWVhcjtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5kaXN0cmlidXRlR3JvdXBzQnlDb3Vyc2VzID0gYXN5bmMgZnVuY3Rpb24gKGN1cnJlbnRZZWFyKSB7XHJcbiBkZWxldGUgdGhpcy5Db3Vyc2VzO1xyXG4gIHRoaXMuQ291cnNlcyA9IFtcclxuICAgIG5ldyBDb3Vyc2UoJzEnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzInKSxcclxuICAgIG5ldyBDb3Vyc2UoJzMnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzQnKSxcclxuICAgIG5ldyBDb3Vyc2UoJzEgKNC80LMpJyksXHJcbiAgICBuZXcgQ291cnNlKCcyICjQvNCzKScpXHJcbiAgXTtcclxuY29uc29sZS5sb2codGhpcy5Db3Vyc2VzICk7XHJcbiAgbGV0IGdyb3VwcyA9IGF3YWl0IHRoaXMuZ2V0QWxsR3JvdXBzKCk7XHJcbiAgY29uc29sZS5sb2coZ3JvdXBzKTtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICBpZiAoK2N1cnJlbnRNb250aCA8IFNFUFRFTUJFUikge1xyXG4gICAgY3VycmVudFllYXIgLT0gMTtcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoZ3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICBpZiAoZ3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgIT09IC0xKSB7XHJcblxyXG4gICAgICAgIHRoaXMuQ291cnNlc1ttYXN0ZXJGaXJzdENvdXJzZV0uYWRkR3JvdXAoZ3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICB0aGlzLkNvdXJzZXNbZmlyc3RDb3Vyc2VdLmFkZEdyb3VwKGdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmIChncm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgIGlmIChncm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSAhPT0gLTEpIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbbWFzdGVyU2Vjb25kQ291cnNlXS5hZGRHcm91cChncm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW3NlY29uZENvdXJzZV0uYWRkR3JvdXAoZ3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgaWYgKGdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKGdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpID09PSAtMSkge1xyXG4gICAgICAgIHRoaXMuQ291cnNlc1t0aGlyZENvdXJzZV0uYWRkR3JvdXAoZ3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmIChncm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgIGlmIChncm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSA9PT0gLTEpIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbZm91cnRoQ291cnNlXS5hZGRHcm91cChncm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGN1cnJlbnRZZWFyICs9IDM7XHJcbiAgfVxyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEdyb3Vwc1VJRFMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGdyb3Vwc1VJRFMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBsZXQgZ3JvdXBOYW1lID0gdGhpcy5Hcm91cHNbaV07XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcm94eS9jb3JlL3YxL2dyb3Vwcz9uYW1lPScgKyBncm91cE5hbWUpXHJcbiAgICAudGhlbihhc3luYyBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIH0pXHJcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgbGV0IGdyb3VwcyA9IHJlc3BvbnNlO1xyXG4gICAgICBsZXQgZ3JvdXBJRCA9IHJlc3BvbnNlLl9lbWJlZGRlZC5ncm91cHNbMF0uaWQ7XHJcbiAgICAgIGdyb3Vwc1VJRFMucHVzaChncm91cElEKTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBhbGVydChcItCT0YDRg9C/0L/QsCBcIiArIGdyb3VwTmFtZSArIFwiINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCIpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHJldHVybiBncm91cHNVSURTO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFN0dWRlbnRzQnlHcm91cElkID0gYXN5bmMgZnVuY3Rpb24gKGdyb3VwSUQpIHtcclxuICBsZXQgc3R1ZGVudHNMaXN0ID0gW107XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJveHkvY29yZS92MS9ncm91cHMvJyArIGdyb3VwSUQpXHJcbiAgLnRoZW4oYXN5bmMgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICByZXR1cm4gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gIH0pXHJcbiAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICBzdHVkZW50c0xpc3QgPSByZXNwb25zZS5fZW1iZWRkZWQuc3R1ZGVudHM7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgYWxlcnQoZXJyb3IpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBzdHVkZW50c0xpc3Q7XHJcbn07XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBDUkVBVElPTlxyXG4gU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuTW9kZWwucHJvdG90eXBlLmdldFR5cGVzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSBbXTtcclxuICBsZXQgdHlwZXM9W107XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvdHlwZXMtb3JnYW5pc2F0aW9uJylcclxuICAudGhlbihhc3luYyBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgfSlcclxuICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgIHR5cGVzPXJlc3BvbnNlO1xyXG4gIH0pO1xyXG4gIHRoaXMudHlwZXNPcmdhbmlzYXRpb249dHlwZXM7XHJcbiAgcmV0dXJuIHRoaXMudHlwZXNPcmdhbmlzYXRpb247XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gIGxldCBvcmdzPVtdO1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbnMnKVxyXG4gIC50aGVuKGFzeW5jIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICB9KVxyXG4gIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgb3Jncz1yZXNwb25zZTtcclxuICB9KTtcclxuICBjb25zb2xlLmxvZyhvcmdzKTtcclxuICB0aGlzLk9yZ2FuaXNhdGlvbnM9b3JncztcclxuICByZXR1cm4gdGhpcy5PcmdhbmlzYXRpb25zO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZU9yVXBkYXRlT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbikge1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbicsIHtcclxuICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgaGVhZGVyczoge1xyXG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICB9LFxyXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkob3JnYW5pc2F0aW9uKVxyXG4gIH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INC+0YDQs9Cw0L3QuNC30LDRhtC40Lgg0LIg0JHQlCBcIisgZXJyb3IpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZVByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJhY3RpY2UnLCB7XHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIGhlYWRlcnM6IHtcclxuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgfSxcclxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByYWN0aWNlKVxyXG4gIH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4INC/0YDQsNC60YLQuNC60Lgg0LIg0JHQlCBcIisgZXJyb3IpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9Nb2RlbC5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby5jc3Ncbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWljb25zLmNzc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tc2NoZW1lcy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvanMvbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3Mvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFiQTtBQWVBO0FBakJBO0FBdUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVEE7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUN0YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDaE5BOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==
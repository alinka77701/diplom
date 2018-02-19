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
    this.View.onClickToOrganisationsSection = this.goToOrganisationsSection.bind(this);
    this.View.onClickToStudentsSection = this.goToStudentsSection.bind(this);
    this.View.onClickFinishBtn = this.dialogPracticeCreatedInit.bind(this);
    this.View.onClickSelectGroupBtnOk = this.renderDataInTable.bind(this);
    this.View.onClickYearsArray = this.setGroupsTreeView.bind(this);
    this.View.onClickGetOrganisations = this.getOrganisations.bind(this);
    this.View.init();
};

Controller.prototype.goToOrganisationsSection = function () {
    this.View.goToOrganisationsSection();
};

Controller.prototype.goToStudentsSection = function () {
    this.View.goToStudentsSection();
};
Controller.prototype.goToPracticeCreation = function () {
    this.View.selectedYear = this.Model.myGetYear();
    this.renderGroupsTreeView();
    this.View.clearPracticeSection();
    this.Model.getTypesOrganisation();
    this.View.goToPracticeCreation();
};

/*========================================PRACTICE SECTION================================================*/
Controller.prototype.displayGroups = function () {
    this.View.displayGroups();
};
Controller.prototype.dialogPracticeCreatedInit = function () {
    this.View.dialogPracticeCreatedInit();
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
  this.onClickToOrganisationsSection = null;
  this.onClickToStudentsSection = null;
  this.onClickFinishBtn = null;
  this.onClickSelectGroupBtnOk = null;
  this.myTable = $('#studentsListTable');
  this.onClickYearsArray = null;
  this.selectedYear = null;
  this.idTreeViews = ['group-treeview-tabcontrol1-bachelor', 'group-treeview-tabcontrol2-master', 'groups-treeview-practice-creation-bachelor', 'groups-treeview-practice-creation-master'];
  this.onClickGetOrganisations = null;
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

  let fromDate = document.getElementById("fromDateInput").value;
  let toDate = document.getElementById("toDateInput").value;
  let deadline = document.getElementById("deadline").value;
  if (fromDate === "") {
    fromDate = "01. 01. 2000";
  }
  if (toDate === "") {
    toDate = "01. 01. 2000";
  }
  if (deadline === "") {
    deadline = "01. 01. 2000";
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
    if (this.idTreeViews[i].indexOf("practice") !== -1 && document.getElementById(this.idTreeViews[i]).style.display == "block") {
      treeView = document.getElementById(this.idTreeViews[i]);
    }
  }
  let arrGroups = this.getSelectedGroups(treeView);
  let arrOrganisations = this.getSelectedGroups(document.getElementById("organisations-treeview-practice-creation"));

  document.getElementById("typePracticeDialog").innerHTML = typePracticeText;
  document.getElementById("educationalLevelDialog").innerHTML = educationLevelText;
  document.getElementById("termsPracticeDialog").innerHTML = 'c ' + fromDate + ' по ' + toDate;
  document.getElementById("deadlinePracticeDialog").innerHTML = deadline;
  document.getElementById("groupsPracticeDialog").innerHTML = arrGroups;
  document.getElementById("organisationsPracticeDialog").innerHTML = arrOrganisations;

  document.getElementById("mainWindowTypePractice").innerHTML = typePracticeText + " практика";
  document.getElementById("mainWindowTermsPractice").innerHTML = fromDate + ' - ' + toDate;
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
  debugger;
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
  console.log(courses);
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
};

class Course {
  constructor(nameCourse) {
    this.nameCourse = nameCourse;
    this.groups = [];
  }

  addGroup(group) {
    this.groups.push(group);
  }
};

Model.prototype.getTypesOrganisation = async function () {
  let result = await fetch('/data').then(async function (response) {

    return await response.json();
  }).then(function (response) {
    console.log(response);
  });
};
/*============================================STUDENTS SECTION=====================================================*/
Model.prototype.getStudents = async function (groups) {
  debugger;
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
  this.Courses = [new Course('1'), new Course('2'), new Course('3'), new Course('4'), new Course('1 (мг)'), new Course('2 (мг)')];

  let groups = await this.getAllGroups();
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
      if (groups[i].name.indexOf("мг") == -1) {
        this.Courses[thirdCourse].addGroup(groups[i].name);
        console.log(groups[i].name, i);
      }
    }
    currentYear--;
    if (groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
      if (groups[i].name.indexOf("мг") == -1) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDAyYjhlOGZlOGNlYTlhNTVjOTE5Iiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9zdHlsZS5jc3MiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMDJiOGU4ZmU4Y2VhOWE1NWM5MTkiLCJjb25zdCBDb250cm9sbGVyID0gcmVxdWlyZSAoJy4vQ29udHJvbGxlci5qcycpO1xyXG5cclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1jb2xvcnMuY3NzJyk7XHJcbnJlcXVpcmUoJy4uL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzJyk7XHJcbnJlcXVpcmUoJy4uL2Fzc2V0cy9jc3MvbWV0cm8tc2NoZW1lcy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1yZXNwb25zaXZlLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcycpO1xyXG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgbmV3IENvbnRyb2xsZXIoKTtcclxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9tYWluLmpzIiwiY29uc3QgVmlldyA9ICByZXF1aXJlICgnLi9WaWV3LmpzJyk7XHJcbmNvbnN0IE1vZGVsID0gIHJlcXVpcmUgKCcuL01vZGVsLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBDb250cm9sbGVyICgpIHtcclxuICAgIHRoaXMuVmlldyA9IG5ldyBWaWV3KCk7XHJcbiAgICB0aGlzLk1vZGVsID0gbmV3IE1vZGVsKCk7XHJcblxyXG4gICAgdGhpcy5pbml0KCk7XHJcbn1cclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja05leHRTdGVwID0gdGhpcy5kaXNwbGF5R3JvdXBzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1ByYWN0aWNlQ29tcGxldGVkID0gdGhpcy5nb1RvU3R1ZGVudHNTZWN0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZVByYWN0aWNlID0gdGhpcy5nb1RvUHJhY3RpY2VDcmVhdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tUb09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gdGhpcy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24gPSB0aGlzLmdvVG9TdHVkZW50c1NlY3Rpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrRmluaXNoQnRuID0gdGhpcy5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1NlbGVjdEdyb3VwQnRuT2sgPSB0aGlzLnJlbmRlckRhdGFJblRhYmxlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1llYXJzQXJyYXkgPSB0aGlzLnNldEdyb3Vwc1RyZWVWaWV3LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0dldE9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldE9yZ2FuaXNhdGlvbnMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5pbml0KCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uKCk7XHJcbn1cclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9TdHVkZW50c1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub1N0dWRlbnRzU2VjdGlvbigpO1xyXG59XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9QcmFjdGljZUNyZWF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwubXlHZXRZZWFyKCk7XHJcbiAgICB0aGlzLnJlbmRlckdyb3Vwc1RyZWVWaWV3KCk7XHJcbiAgICB0aGlzLlZpZXcuY2xlYXJQcmFjdGljZVNlY3Rpb24oKTtcclxuICAgIHRoaXMuTW9kZWwuZ2V0VHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5nb1RvUHJhY3RpY2VDcmVhdGlvbigpO1xyXG59XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZGlzcGxheUdyb3VwcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5kaXNwbGF5R3JvdXBzKCk7XHJcbn07XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCgpO1xyXG59XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyR3JvdXBzVHJlZVZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLk1vZGVsLmRpc3RyaWJ1dGVHcm91cHNCeUNvdXJzZXModGhpcy5WaWV3LnNlbGVjdGVkWWVhcilcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuVmlldy5jbGVhckdyb3Vwc1RyZWVWaWV3KCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuVmlldy51cGRhdGVHcm91cHNUcmVlVmlldyh0aGlzLk1vZGVsLkNvdXJzZXMpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5zZXRHcm91cHNUcmVlVmlldyA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdGhpcy5WaWV3LnVwZGF0ZVllYXIoZXZlbnQpO1xyXG4gICAgdGhpcy5yZW5kZXJHcm91cHNUcmVlVmlldygpO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZW5kZXJEYXRhSW5UYWJsZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBncm91cHMgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRHcm91cHMoKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwuZ2V0U3R1ZGVudHMoZ3JvdXBzKTtcclxuICAgIHRoaXMuVmlldy5yZW5kZXJUYWJsZSh0aGlzLk1vZGVsLlN0dWRlbnRzKTtcclxuICAgIHRoaXMuVmlldy5yZW5kZXJJbmZvKCk7XHJcblxyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuVmlldy5nZXRDb25maWd1cmF0aW9ucygpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvQ29udHJvbGxlci5qcyIsImNvbnN0IGJhY2hlbG9yWWVhciA9IDQ7XHJcbmNvbnN0IG1hc3RlclllYXIgPSA2O1xyXG5sZXQgc2VsZWN0ZWRFbGVtID0gMDtcclxuXHJcbnZhciBWaWV3ID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMub25DbGlja05leHRTdGVwID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tQcmFjdGljZUNvbXBsZXRlZCA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSBudWxsO1xyXG4gIHRoaXMub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tGaW5pc2hCdG4gPSBudWxsO1xyXG4gIHRoaXMub25DbGlja1NlbGVjdEdyb3VwQnRuT2sgPSBudWxsO1xyXG4gIHRoaXMubXlUYWJsZSA9ICQoJyNzdHVkZW50c0xpc3RUYWJsZScpO1xyXG4gIHRoaXMub25DbGlja1llYXJzQXJyYXkgPSBudWxsO1xyXG4gIHRoaXMuc2VsZWN0ZWRZZWFyID0gbnVsbDtcclxuICB0aGlzLmlkVHJlZVZpZXdzID0gW1xyXG4gICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wxLWJhY2hlbG9yJyxcclxuICAgICdncm91cC10cmVldmlldy10YWJjb250cm9sMi1tYXN0ZXInLFxyXG4gICAgJ2dyb3Vwcy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbi1iYWNoZWxvcicsXHJcbiAgICAnZ3JvdXBzLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uLW1hc3RlcidcclxuICBdO1xyXG4gIHRoaXMub25DbGlja0dldE9yZ2FuaXNhdGlvbnMgPSBudWxsO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLW5leHRcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tOZXh0U3RlcCk7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkaWFsb2dQcmFjdGljZUNvbXBsZXRlU3VjY2Vzc1wiKS5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICBcIiNwcmFjdGljZUZpbmlzaGVkT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tQcmFjdGljZUNvbXBsZXRlZCk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVQcmFjdGljZUJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja0NyZWF0ZVByYWN0aWNlKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ2FuaXNhdGlvbnNTZWN0aW9uQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbik7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkZW50c1NlY3Rpb25CdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbik7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1maW5pc2hcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tGaW5pc2hCdG4pO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2V0R3JvdXBzQnRuT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbnNBcnJheVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja1llYXJzQXJyYXkpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5MVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja1llYXJzQXJyYXkpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2V0T3JnYW5pc2F0aW9uc0J0bk9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyk7XHJcbiAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSh7XHJcbiAgICBkYXRhOiB0aGlzLkdyb3VwcyxcclxuICAgIFwibGFuZ3VhZ2VcIjoge1xyXG4gICAgICBcInplcm9SZWNvcmRzXCI6IFwi0KLQsNC60L7QuSDQt9Cw0L/QuNGB0Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIixcclxuICAgICAgXCJlbXB0eVRhYmxlXCI6IFwi0J3QuCDQvtC00L3QsCDQuNC3INCz0YDRg9C/0L8g0L3QtSDQstGL0LHRgNCw0L3QsC5cIixcclxuICAgICAgXCJzZWFyY2hcIjogXCLQn9C+0LjRgdC6OlwiLFxyXG4gICAgICBcInBhZ2luYXRlXCI6IHtcclxuICAgICAgICBcImZpcnN0XCI6IFwi0J/QtdGA0LLRi9C5XCIsXHJcbiAgICAgICAgXCJsYXN0XCI6IFwi0J/QvtGB0LvQtdC00L3QuNC5XCIsXHJcbiAgICAgICAgXCJuZXh0XCI6IFwi0JLQv9C10YDQtdC0XCIsXHJcbiAgICAgICAgXCJwcmV2aW91c1wiOiBcItCd0LDQt9Cw0LRcIlxyXG4gICAgICB9LFxyXG4gICAgICBcImluZm9GaWx0ZXJlZFwiOiBcIijQuNC3IF9NQVhfINGB0YLRg9C00LXQvdGC0L7QsilcIixcclxuICAgICAgXCJsZW5ndGhNZW51XCI6IFwi0J/QvtC60LDQt9Cw0YLRjCBfTUVOVV8g0LfQsNC/0LjRgdC10LlcIixcclxuICAgICAgXCJpbmZvXCI6IFwi0J7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgdGC0YPQtNC10L3RgtC+0LI6IF9UT1RBTF8gXCIsXHJcbiAgICAgIFwiaW5mb0VtcHR5XCI6IFwi0JLRi9Cx0LXRgNC40YLQtSDQs9GA0YPQv9C/0YMuXCJcclxuICAgIH0sXHJcbiAgICBcImNvbHVtbnNcIjogW1xyXG4gICAgICB7XCJkYXRhXCI6IFwiZ3JvdXBcIn0sXHJcbiAgICAgIHtcImRhdGFcIjogXCJzdHVkZW50XCJ9LFxyXG4gICAgICB7XCJkYXRhXCI6IFwib3JnYW5pc2F0aW9uXCJ9XHJcbiAgICBdXHJcbiAgfSk7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nb1RvU3R1ZGVudHNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3JnYW5pc2F0aW9uc1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufVxyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3JnYW5pc2F0aW9uc1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufVxyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub1ByYWN0aWNlQ3JlYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWFpbldpbmRvd1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG59XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuVmlldy5wcm90b3R5cGUuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZmluaXNoQnRuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1maW5pc2hcIilbMF07XHJcbiAgZmluaXNoQnRuLnNldEF0dHJpYnV0ZShcIm9uY2xpY2tcIixcclxuICAgICAgXCJtZXRyb0RpYWxvZy5vcGVuKCcjZGlhbG9nUHJhY3RpY2VDb21wbGV0ZVN1Y2Nlc3MnKVwiKTtcclxuICBsZXQgZWR1Y2F0aW9uTGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdWNhdGlvblwiKS52YWx1ZTtcclxuICBsZXQgdHlwZVByYWN0aWNlVGV4dCA9IFwi0KPRh9C10LHQvdCw0Y9cIjtcclxuICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VcIikudmFsdWU7XHJcbiAgbGV0IGVkdWNhdGlvbkxldmVsVGV4dCA9IFwi0JHQsNC60LDQu9Cw0LLRgNC40LDRglwiO1xyXG4gIGlmIChlZHVjYXRpb25MZXZlbCA9PT0gXCJiYWNoZWxvclwiKSB7XHJcbiAgICBlZHVjYXRpb25MZXZlbFRleHQgPSBcItCR0LDQutCw0LvQsNCy0YDQuNCw0YJcIjtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICBlZHVjYXRpb25MZXZlbFRleHQgPSBcItCc0LDQs9C40YHRgtGA0LDRgtGD0YDQsFwiO1xyXG4gIH1cclxuXHJcbiAgbGV0IGZyb21EYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcm9tRGF0ZUlucHV0XCIpLnZhbHVlO1xyXG4gIGxldCB0b0RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvRGF0ZUlucHV0XCIpLnZhbHVlO1xyXG4gIGxldCBkZWFkbGluZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVhZGxpbmVcIikudmFsdWU7XHJcbiAgaWYgKGZyb21EYXRlID09PSBcIlwiKSB7XHJcbiAgICBmcm9tRGF0ZSA9IFwiMDEuIDAxLiAyMDAwXCI7XHJcbiAgfVxyXG4gIGlmICh0b0RhdGUgPT09IFwiXCIpIHtcclxuICAgIHRvRGF0ZSA9IFwiMDEuIDAxLiAyMDAwXCI7XHJcbiAgfVxyXG4gIGlmIChkZWFkbGluZSA9PT0gXCJcIikge1xyXG4gICAgZGVhZGxpbmUgPSBcIjAxLiAwMS4gMjAwMFwiO1xyXG4gIH1cclxuICBpZiAodHlwZVByYWN0aWNlID09PSBcImVkdWNhdGlvbmFsXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJpbnRlcm5zaGlwXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQvtC40LfQstC+0LTRgdGC0LLQtdC90L3QsNGPXCI7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJwcmVkaXBsb21hXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQtdC00LTQuNC/0LvQvtC80L3QsNGPXCI7XHJcbiAgfVxyXG4gIGxldCB0cmVlVmlldz1udWxsO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcInByYWN0aWNlXCIpICE9PSAtMSAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID09IFwiYmxvY2tcIikge1xyXG4gICAgIHRyZWVWaWV3PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBsZXQgYXJyR3JvdXBzID0gdGhpcy5nZXRTZWxlY3RlZEdyb3Vwcyh0cmVlVmlldyk7XHJcbiAgbGV0IGFyck9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldFNlbGVjdGVkR3JvdXBzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKSk7XHJcblxyXG5cclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR5cGVQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2VUZXh0O1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImVkdWNhdGlvbmFsTGV2ZWxEaWFsb2dcIikuaW5uZXJIVE1MID0gZWR1Y2F0aW9uTGV2ZWxUZXh0O1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVybXNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSAnYyAnICsgZnJvbURhdGVcclxuICAgICAgKyAnINC/0L4gJyArIHRvRGF0ZTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYWRsaW5lUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gZGVhZGxpbmU7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncm91cHNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJHcm91cHM7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIFwib3JnYW5pc2F0aW9uc1ByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGFyck9yZ2FuaXNhdGlvbnM7XHJcblxyXG5cclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlVGV4dFxyXG4gICAgICArIFwiINC/0YDQsNC60YLQuNC60LBcIjtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUZXJtc1ByYWN0aWNlXCIpLmlubmVySFRNTCA9IGZyb21EYXRlXHJcbiAgICAgICsgJyAtICcgKyB0b0RhdGU7XHJcblxyXG59XHJcblZpZXcucHJvdG90eXBlLmRpc3BsYXlHcm91cHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVjYXRpb25cIikudmFsdWU7XHJcbiAgaWYgKGVkdWNhdGlvbkxldmVsID09PSBcImJhY2hlbG9yXCIpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuVmlldy5wcm90b3R5cGUuY2xlYXJQcmFjdGljZVNlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmcm9tRGF0ZUlucHV0XCIpLnZhbHVlPVwiXCI7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVJbnB1dFwiKS52YWx1ZT1cIlwiO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVhZGxpbmVcIikudmFsdWU9XCJcIjtcclxufVxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuVmlldy5wcm90b3R5cGUucmVuZGVySW5mbyA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VUYWJcIikudmFsdWU7XHJcbiAgbGV0IHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJlZHVjYXRpb25hbFwiKSB7XHJcbiAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQo9GH0LXQsdC90LDRj1wiO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiaW50ZXJuc2hpcFwiKSB7XHJcbiAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQn9GA0L7QuNC30LLQvtC00YHRgtCy0LXQvdC90LDRj1wiO1xyXG4gIH1cclxuICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwicHJlZGlwbG9tYVwiKSB7XHJcbiAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQn9GA0LXQtNC00LjQv9C70L7QvNC90LDRj1wiO1xyXG4gIH1cclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlVGV4dFxyXG4gICAgICArICcg0L/RgNCw0LrRgtC40LrQsCc7XHJcbn1cclxuVmlldy5wcm90b3R5cGUucmVuZGVyVGFibGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gIGlmIChkYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuQ2xlYXJUYWJsZSgpO1xyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkNsZWFyVGFibGUoKTtcclxuICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkFkZERhdGEoZGF0YSk7XHJcbiAgfVxyXG59XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jaGFuZ2VZZWFyID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICBpZiAoc2VsZWN0ZWRFbGVtKSB7XHJcbiAgICBzZWxlY3RlZEVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnY3VycmVudCcpO1xyXG4gIH1cclxuICBzZWxlY3RlZEVsZW0gPSBub2RlO1xyXG4gIHNlbGVjdGVkRWxlbS5jbGFzc0xpc3QuYWRkKCdjdXJyZW50Jyk7XHJcbiAgdGhpcy5zZWxlY3RlZFllYXIgPSBzZWxlY3RlZEVsZW0uaW5uZXJIVE1MO1xyXG59XHJcblxyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVZZWFyID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgdmFyIHRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICBkZWJ1Z2dlcjtcclxuICB3aGlsZSAodGFyZ2V0ICE9IGJ1dHRvbnNBcnJheSkge1xyXG4gICAgaWYgKHRhcmdldC5jbGFzc05hbWUgPT0gJ2l0ZW0geWVhcicpIHtcclxuICAgICAgdGhpcy5jaGFuZ2VZZWFyKHRhcmdldCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xyXG4gIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdldFNlbGVjdGVkR3JvdXBzID0gZnVuY3Rpb24gKHRyZWVWaWV3KSB7XHJcbiAgaWYodHJlZVZpZXc9PT11bmRlZmluZWQpXHJcbiAge1xyXG4gICAgbGV0IGZyYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmcmFtZXNcIilbMF0uY2hpbGRyZW47XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoZnJhbWVzW2ldLnN0eWxlLmRpc3BsYXkgPT0gXCJibG9ja1wiKSB7XHJcbiAgICAgICAgdHJlZVZpZXcgPSBmcmFtZXNbaV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgbGV0IEdyb3VwcyA9IFtdO1xyXG4gIGxldCBsaU51bWJlciA9IHRyZWVWaWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XHJcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaU51bWJlci5sZW5ndGg7IGkrKykge1xyXG4gICAgbGV0IGdyb3VwcyA9IGxpTnVtYmVyW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0OmNoZWNrZWQnKTtcclxuICAgIGlmIChncm91cHMubGVuZ3RoPT0gMSkge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGxldCBncm91cCA9IGdyb3Vwc1tqXS5wYXJlbnRFbGVtZW50Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUw7XHJcbiAgICAgICAgaWYgKGdyb3VwLmluZGV4T2YoXCLQutGD0YDRgVwiKSA9PT0gLTEpIHtcclxuICAgICAgICAgIEdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgY29uc29sZS5sb2coR3JvdXBzKTtcclxuICByZXR1cm4gR3JvdXBzO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsIG5hbWVMZWFmKSB7XHJcbiAgdHJlZS5hZGRMZWFmKG5vZGUsIG5hbWVMZWFmLCB7XHJcbiAgICBtb2RlOiAnY2hlY2tib3gnLFxyXG4gICAgY2hlY2tlZDogZmFsc2VcclxuICB9KTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUNoaWxkcmVuKG5vZGUpIHtcclxuICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkTm9kZXM7XHJcbiAgd2hpbGUgKGNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZHJlblswXSk7XHJcbiAgfVxyXG59XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jbGVhckdyb3Vwc1RyZWVWaWV3ID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBpZCA9IDA7XHJcbiAgd2hpbGUgKGlkIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcclxuICAgIHZhciBsaUFycmF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgdGhpcy5pZFRyZWVWaWV3c1tpZF0pLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHJlbW92ZUNoaWxkcmVuKGxpQXJyYXlbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0pO1xyXG4gICAgfVxyXG4gICAgaWQrKztcclxuICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZUdyb3Vwc1RyZWVWaWV3ID0gZnVuY3Rpb24gKGNvdXJzZXMpIHtcclxuICBjb25zb2xlLmxvZyhjb3Vyc2VzKTtcclxuICBsZXQgaWRDb3VudGVyID0gMCwgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyLCBjbnQ7XHJcbiAgbGV0IGNvdXJzZXNOYW1lID0gWydmaXJzdCcsICdzZWNvbmQnLCAndGhpcmQnLCAnZm91cnRoJ107XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHdoaWxlIChpZENvdW50ZXIgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aCkge1xyXG4gICAgdmFyIHRyZWUgPSAkKFwiI1wiICsgdGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdKS5kYXRhKFwidHJlZXZpZXdcIik7XHJcbiAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgIGNvdXJzZU51bWJlciA9IG1hc3RlclllYXI7XHJcbiAgICAgIGkgPSBiYWNoZWxvclllYXI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgICBpID0gMDtcclxuICAgIH1cclxuICAgIGNudCA9IDA7XHJcbiAgICBmb3IgKGk7IGkgPCBjb3Vyc2VOdW1iZXI7IGkrKykge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdXJzZXNbaV0uZ3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgbGV0IG5vZGUgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGkuJyArIGNvdXJzZXNOYW1lW2NudF0pO1xyXG4gICAgICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLCBjb3Vyc2VzW2ldLmdyb3Vwc1tqXSk7XHJcbiAgICAgIH1cclxuICAgICAgY250Kys7XHJcbiAgICB9XHJcbiAgICBpZENvdW50ZXIrKztcclxuICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRDb25maWd1cmF0aW9ucz0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0eXBlUHJhY3RpY2U9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgbGV0IGVkdUxldmVsPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1TGV2ZWxPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgbGV0IHllYXJzPWRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ5ZWFyc1wiKTtcclxuICBjb25zb2xlLmxvZyh0eXBlUHJhY3RpY2UpO1xyXG4gIGNvbnNvbGUubG9nKGVkdUxldmVsKTtcclxuICBjb25zb2xlLmxvZyh0aGlzLnNlbGVjdGVkWWVhcik7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvVmlldy5qcyIsImNvbnN0IFNFUFRFTUJFUiA9IDk7XHJcbmNvbnN0IGZpcnN0Q291cnNlPTA7XHJcbmNvbnN0IHNlY29uZENvdXJzZSA9IDE7XHJcbmNvbnN0IHRoaXJkQ291cnNlPTI7XHJcbmNvbnN0IGZvdXJ0aENvdXJzZSA9IDM7XHJcbmNvbnN0IG1hc3RlckZpcnN0Q291cnNlPTQ7XHJcbmNvbnN0IG1hc3RlclNlY29uZENvdXJzZT01O1xyXG5cclxudmFyIE1vZGVsID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuR3JvdXBzID0gW107XHJcbiAgdGhpcy5TdHVkZW50cyA9IFtdO1xyXG4gIHRoaXMuQ291cnNlcyA9IFtdO1xyXG59O1xyXG5cclxuY2xhc3MgQ291cnNlIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lQ291cnNlKSB7XHJcbiAgICB0aGlzLm5hbWVDb3Vyc2UgPSBuYW1lQ291cnNlO1xyXG4gICAgdGhpcy5ncm91cHMgPSBbXTtcclxuICB9XHJcblxyXG4gIGFkZEdyb3VwKGdyb3VwKSB7XHJcbiAgICB0aGlzLmdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICB9XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0VHlwZXNPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvZGF0YScpXHJcbiAgLnRoZW4oYXN5bmMgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblxyXG4gICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICB9KVxyXG4gIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gIH0pO1xyXG59XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0U3R1ZGVudHMgPSBhc3luYyBmdW5jdGlvbiAoZ3JvdXBzKSB7XHJcbiAgZGVidWdnZXI7XHJcbiAgdGhpcy5Hcm91cHMgPSBncm91cHM7XHJcbiAgdGhpcy5TdHVkZW50cyA9IFtdO1xyXG4gIGxldCBncm91cHNVSURTID0gYXdhaXQgdGhpcy5nZXRHcm91cHNVSURTKCk7XHJcbiAgaWYgKGdyb3Vwc1VJRFMgIT0gMCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDAsIG4gPSAwOyBpIDwgZ3JvdXBzVUlEUy5sZW5ndGg7ICsraSkge1xyXG4gICAgICBsZXQgc3R1ZGVudHNMaXN0ID0gYXdhaXQgdGhpcy5nZXRTdHVkZW50c0J5R3JvdXBJZChncm91cHNVSURTW2ldKTtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdHVkZW50c0xpc3QubGVuZ3RoOyArK2osIG4rKykge1xyXG4gICAgICAgIHRoaXMuU3R1ZGVudHMucHVzaCh7Z3JvdXA6IHRoaXMuR3JvdXBzW2ldfSk7XHJcbiAgICAgICAgdGhpcy5TdHVkZW50c1tuXS5zdHVkZW50ID0gc3R1ZGVudHNMaXN0W2pdLmRpc3BsYXlOYW1lO1xyXG4gICAgICAgIHRoaXMuU3R1ZGVudHNbbl0ub3JnYW5pc2F0aW9uID0gajtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRBbGxHcm91cHMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGdyb3VwcyA9IFtdO1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvZ3JvdXBzJylcclxuICAudGhlbihhc3luYyBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgfSlcclxuICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgIGdyb3VwcyA9IHJlc3BvbnNlLl9lbWJlZGRlZC5ncm91cHM7XHJcbiAgfSk7XHJcbiAgcmV0dXJuIGdyb3VwcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5teUdldFllYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gIGxldCBjdXJyZW50WWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpO1xyXG4gIHJldHVybiBjdXJyZW50WWVhcjtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5kaXN0cmlidXRlR3JvdXBzQnlDb3Vyc2VzID0gYXN5bmMgZnVuY3Rpb24gKGN1cnJlbnRZZWFyKSB7XHJcbiAgdGhpcy5Db3Vyc2VzID0gW1xyXG4gICAgbmV3IENvdXJzZSgnMScpLFxyXG4gICAgbmV3IENvdXJzZSgnMicpLFxyXG4gICAgbmV3IENvdXJzZSgnMycpLFxyXG4gICAgbmV3IENvdXJzZSgnNCcpLFxyXG4gICAgbmV3IENvdXJzZSgnMSAo0LzQsyknKSxcclxuICAgIG5ldyBDb3Vyc2UoJzIgKNC80LMpJylcclxuICBdO1xyXG5cclxuICBsZXQgZ3JvdXBzID0gYXdhaXQgdGhpcy5nZXRBbGxHcm91cHMoKTtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICBpZiAoK2N1cnJlbnRNb250aCA8IFNFUFRFTUJFUikge1xyXG4gICAgY3VycmVudFllYXIgLT0gMTtcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoZ3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICBpZiAoZ3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgIT09IC0xKSB7XHJcblxyXG4gICAgICAgIHRoaXMuQ291cnNlc1ttYXN0ZXJGaXJzdENvdXJzZV0uYWRkR3JvdXAoZ3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICB0aGlzLkNvdXJzZXNbZmlyc3RDb3Vyc2VdLmFkZEdyb3VwKGdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmIChncm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgIGlmIChncm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSAhPT0gLTEpIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbbWFzdGVyU2Vjb25kQ291cnNlXS5hZGRHcm91cChncm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW3NlY29uZENvdXJzZV0uYWRkR3JvdXAoZ3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgaWYgKGdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKGdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpID09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW3RoaXJkQ291cnNlXS5hZGRHcm91cChncm91cHNbaV0ubmFtZSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coZ3JvdXBzW2ldLm5hbWUsIGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmIChncm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgIGlmIChncm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSA9PSAtMSkge1xyXG4gICAgICAgIHRoaXMuQ291cnNlc1tmb3VydGhDb3Vyc2VdLmFkZEdyb3VwKGdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGN1cnJlbnRZZWFyICs9IDM7XHJcbiAgfVxyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEdyb3Vwc1VJRFMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGdyb3Vwc1VJRFMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBsZXQgZ3JvdXBOYW1lID0gdGhpcy5Hcm91cHNbaV07XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcm94eS9jb3JlL3YxL2dyb3Vwcz9uYW1lPScgKyBncm91cE5hbWUpXHJcbiAgICAudGhlbihhc3luYyBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIH0pXHJcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgbGV0IGdyb3VwcyA9IHJlc3BvbnNlO1xyXG4gICAgICBsZXQgZ3JvdXBJRCA9IHJlc3BvbnNlLl9lbWJlZGRlZC5ncm91cHNbMF0uaWQ7XHJcbiAgICAgIGdyb3Vwc1VJRFMucHVzaChncm91cElEKTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBhbGVydChcItCT0YDRg9C/0L/QsCBcIiArIGdyb3VwTmFtZSArIFwiINC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCIpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHJldHVybiBncm91cHNVSURTO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFN0dWRlbnRzQnlHcm91cElkID0gYXN5bmMgZnVuY3Rpb24gKGdyb3VwSUQpIHtcclxuICBsZXQgc3R1ZGVudHNMaXN0ID0gW107XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJveHkvY29yZS92MS9ncm91cHMvJyArIGdyb3VwSUQpXHJcbiAgLnRoZW4oYXN5bmMgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICByZXR1cm4gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gIH0pXHJcbiAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICBzdHVkZW50c0xpc3QgPSByZXNwb25zZS5fZW1iZWRkZWQuc3R1ZGVudHM7XHJcbiAgfSlcclxuICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgYWxlcnQoZXJyb3IpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBzdHVkZW50c0xpc3Q7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL01vZGVsLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLmNzc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tY29sb3JzLmNzc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8tcmVzcG9uc2l2ZS5jc3Ncbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3Mvc3R5bGUuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQWJBO0FBZUE7QUFqQkE7QUF1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUVBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQzdUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFDQTtBQVVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNsS0E7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7OztBIiwic291cmNlUm9vdCI6IiJ9
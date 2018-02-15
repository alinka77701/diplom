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
  debugger;
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
}
// async function getDataFromTable(table) {
//   let answer = await table.findAll({
//     attributes: [
//       'id_type_practice',
//       'name_type_practice'
//     ]
//   });
//   let data = [];
//   for (let i = 0; i < answer.length; ++i) {
//     data.push(answer[i].name);
//   }
//   debugger;
//   console.log(data);
// }
/*============================================STUDENTS SECTION=====================================================*/
Model.prototype.getStudents = async function (groups) {

  await getDataFromTable(model.Types_practice);
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
    console.log(groupName);
    let result = await fetch('/proxy/core/v1/groups?name=' + groupName).then(async function (response) {
      return await response.json();
    }).then(function (response) {
      this.groups = response;
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
  ;
  return studentsList;
};

Model.prototype.getTypesOrganisation = async function () {};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIDQ0MDhlN2MxODM2NDcyMTk3YjNhIiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3Mvc3R5bGUuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1jb2xvcnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWljb25zLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1yZXNwb25zaXZlLmNzcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvRGF0YVRhYmxlcy9kYXRhdGFibGVzLm1pbi5jc3MiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNDQwOGU3YzE4MzY0NzIxOTdiM2EiLCJjb25zdCBDb250cm9sbGVyID0gcmVxdWlyZSAoJy4vQ29udHJvbGxlci5qcycpO1xyXG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1jb2xvcnMuY3NzJyk7XHJcbnJlcXVpcmUoJy4uL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzJyk7XHJcbnJlcXVpcmUoJy4uL2Fzc2V0cy9jc3MvbWV0cm8tc2NoZW1lcy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1yZXNwb25zaXZlLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcycpO1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICBuZXcgQ29udHJvbGxlcigpO1xyXG59KTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL21haW4uanMiLCJjb25zdCBWaWV3ID0gIHJlcXVpcmUgKCcuL1ZpZXcuanMnKTtcclxuY29uc3QgTW9kZWwgPSAgcmVxdWlyZSAoJy4vTW9kZWwuanMnKTtcclxuXHJcbmZ1bmN0aW9uIENvbnRyb2xsZXIgKCkge1xyXG4gICAgdGhpcy5WaWV3ID0gbmV3IFZpZXcoKTtcclxuICAgIHRoaXMuTW9kZWwgPSBuZXcgTW9kZWwoKTtcclxuXHJcbiAgICB0aGlzLmluaXQoKTtcclxufVxyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrTmV4dFN0ZXAgPSB0aGlzLmRpc3BsYXlHcm91cHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQgPSB0aGlzLmdvVG9TdHVkZW50c1NlY3Rpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UgPSB0aGlzLmdvVG9QcmFjdGljZUNyZWF0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24gPSB0aGlzLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbiA9IHRoaXMuZ29Ub1N0dWRlbnRzU2VjdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tGaW5pc2hCdG4gPSB0aGlzLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrU2VsZWN0R3JvdXBCdG5PayA9IHRoaXMucmVuZGVyRGF0YUluVGFibGUuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrWWVhcnNBcnJheSA9IHRoaXMuc2V0R3JvdXBzVHJlZVZpZXcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyA9IHRoaXMuZ2V0T3JnYW5pc2F0aW9ucy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3LmluaXQoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24oKTtcclxufVxyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub1N0dWRlbnRzU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5nb1RvU3R1ZGVudHNTZWN0aW9uKCk7XHJcbn1cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub1ByYWN0aWNlQ3JlYXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID0gdGhpcy5Nb2RlbC5teUdldFllYXIoKTtcclxuICAgIHRoaXMucmVuZGVyR3JvdXBzVHJlZVZpZXcoKTtcclxuICAgIHRoaXMuVmlldy5nb1RvUHJhY3RpY2VDcmVhdGlvbigpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZGlzcGxheUdyb3VwcyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5kaXNwbGF5R3JvdXBzKCk7XHJcbn07XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCgpO1xyXG59XHJcblxyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNUVURFTlRTIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlckdyb3Vwc1RyZWVWaWV3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5Nb2RlbC5kaXN0cmlidXRlR3JvdXBzQnlDb3Vyc2VzKHRoaXMuVmlldy5zZWxlY3RlZFllYXIpXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLlZpZXcuY2xlYXJHcm91cHNUcmVlVmlldygpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLlZpZXcudXBkYXRlR3JvdXBzVHJlZVZpZXcodGhpcy5Nb2RlbC5Db3Vyc2VzKTtcclxuICAgICAgICB9KTtcclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUuc2V0R3JvdXBzVHJlZVZpZXcgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHRoaXMuVmlldy51cGRhdGVZZWFyKGV2ZW50KTtcclxuICAgIHRoaXMucmVuZGVyR3JvdXBzVHJlZVZpZXcoKTtcclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyRGF0YUluVGFibGUgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZ3JvdXBzID0gdGhpcy5WaWV3LmdldFNlbGVjdGVkR3JvdXBzKCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmdldFN0dWRlbnRzKGdyb3Vwcyk7XHJcbiAgICB0aGlzLlZpZXcucmVuZGVyVGFibGUodGhpcy5Nb2RlbC5TdHVkZW50cyk7XHJcbiAgICB0aGlzLlZpZXcucmVuZGVySW5mbygpO1xyXG5cclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9ucyA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLlZpZXcuZ2V0Q29uZmlndXJhdGlvbnMoKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29udHJvbGxlcjtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJjb25zdCBiYWNoZWxvclllYXIgPSA0O1xyXG5jb25zdCBtYXN0ZXJZZWFyID0gNjtcclxubGV0IHNlbGVjdGVkRWxlbSA9IDA7XHJcblxyXG52YXIgVmlldyA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLm9uQ2xpY2tOZXh0U3RlcCA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQgPSBudWxsO1xyXG4gIHRoaXMub25DbGlja0NyZWF0ZVByYWN0aWNlID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tUb09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbiA9IG51bGw7XHJcbiAgdGhpcy5vbkNsaWNrRmluaXNoQnRuID0gbnVsbDtcclxuICB0aGlzLm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rID0gbnVsbDtcclxuICB0aGlzLm15VGFibGUgPSAkKCcjc3R1ZGVudHNMaXN0VGFibGUnKTtcclxuICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5ID0gbnVsbDtcclxuICB0aGlzLnNlbGVjdGVkWWVhciA9IG51bGw7XHJcbiAgdGhpcy5pZFRyZWVWaWV3cyA9IFtcclxuICAgICdncm91cC10cmVldmlldy10YWJjb250cm9sMS1iYWNoZWxvcicsXHJcbiAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDItbWFzdGVyJyxcclxuICAgICdncm91cHMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb24tYmFjaGVsb3InLFxyXG4gICAgJ2dyb3Vwcy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbi1tYXN0ZXInXHJcbiAgXTtcclxuICB0aGlzLm9uQ2xpY2tHZXRPcmdhbmlzYXRpb25zID0gbnVsbDtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1uZXh0XCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrTmV4dFN0ZXApO1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGlhbG9nUHJhY3RpY2VDb21wbGV0ZVN1Y2Nlc3NcIikucXVlcnlTZWxlY3RvcihcclxuICAgICAgXCIjcHJhY3RpY2VGaW5pc2hlZE9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlUHJhY3RpY2VCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tDcmVhdGVQcmFjdGljZSk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25zU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24pO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3R1ZGVudHNTZWN0aW9uQnRuXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24pO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tZmluaXNoXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrRmluaXNoQnRuKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldEdyb3Vwc0J0bk9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgdGhpcy5vbkNsaWNrU2VsZWN0R3JvdXBCdG5Payk7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25zQXJyYXlcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5KTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbnNBcnJheTFcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5KTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldE9yZ2FuaXNhdGlvbnNCdG5Pa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgIHRoaXMub25DbGlja0dldE9yZ2FuaXNhdGlvbnMpO1xyXG4gIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoe1xyXG4gICAgZGF0YTogdGhpcy5Hcm91cHMsXHJcbiAgICBcImxhbmd1YWdlXCI6IHtcclxuICAgICAgXCJ6ZXJvUmVjb3Jkc1wiOiBcItCi0LDQutC+0Lkg0LfQsNC/0LjRgdC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCIsXHJcbiAgICAgIFwiZW1wdHlUYWJsZVwiOiBcItCd0Lgg0L7QtNC90LAg0LjQtyDQs9GA0YPQv9C/INC90LUg0LLRi9Cx0YDQsNC90LAuXCIsXHJcbiAgICAgIFwic2VhcmNoXCI6IFwi0J/QvtC40YHQujpcIixcclxuICAgICAgXCJwYWdpbmF0ZVwiOiB7XHJcbiAgICAgICAgXCJmaXJzdFwiOiBcItCf0LXRgNCy0YvQuVwiLFxyXG4gICAgICAgIFwibGFzdFwiOiBcItCf0L7RgdC70LXQtNC90LjQuVwiLFxyXG4gICAgICAgIFwibmV4dFwiOiBcItCS0L/QtdGA0LXQtFwiLFxyXG4gICAgICAgIFwicHJldmlvdXNcIjogXCLQndCw0LfQsNC0XCJcclxuICAgICAgfSxcclxuICAgICAgXCJpbmZvRmlsdGVyZWRcIjogXCIo0LjQtyBfTUFYXyDRgdGC0YPQtNC10L3RgtC+0LIpXCIsXHJcbiAgICAgIFwibGVuZ3RoTWVudVwiOiBcItCf0L7QutCw0LfQsNGC0YwgX01FTlVfINC30LDQv9C40YHQtdC5XCIsXHJcbiAgICAgIFwiaW5mb1wiOiBcItCe0LHRidC10LUg0LrQvtC70LjRh9C10YHRgtCy0L4g0YHRgtGD0LTQtdC90YLQvtCyOiBfVE9UQUxfIFwiLFxyXG4gICAgICBcImluZm9FbXB0eVwiOiBcItCS0YvQsdC10YDQuNGC0LUg0LPRgNGD0L/Qv9GDLlwiXHJcbiAgICB9LFxyXG4gICAgXCJjb2x1bW5zXCI6IFtcclxuICAgICAge1wiZGF0YVwiOiBcImdyb3VwXCJ9LFxyXG4gICAgICB7XCJkYXRhXCI6IFwic3R1ZGVudFwifSxcclxuICAgICAge1wiZGF0YVwiOiBcIm9yZ2FuaXNhdGlvblwifVxyXG4gICAgXVxyXG4gIH0pO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub1N0dWRlbnRzU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI29yZ2FuaXNhdGlvbnNTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ByYWN0aWNlQ3JlYXRpb25TZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3ByYWN0aWNlQ3JlYXRpb25TZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI29yZ2FuaXNhdGlvbnNTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9QcmFjdGljZUNyZWF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxufVxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblZpZXcucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGZpbmlzaEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tZmluaXNoXCIpWzBdO1xyXG4gIGZpbmlzaEJ0bi5zZXRBdHRyaWJ1dGUoXCJvbmNsaWNrXCIsXHJcbiAgICAgIFwibWV0cm9EaWFsb2cub3BlbignI2RpYWxvZ1ByYWN0aWNlQ29tcGxldGVTdWNjZXNzJylcIik7XHJcbiAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVjYXRpb25cIikudmFsdWU7XHJcbiAgbGV0IHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlXCIpLnZhbHVlO1xyXG4gIGxldCBlZHVjYXRpb25MZXZlbFRleHQgPSBcItCR0LDQutCw0LvQsNCy0YDQuNCw0YJcIjtcclxuICBpZiAoZWR1Y2F0aW9uTGV2ZWwgPT09IFwiYmFjaGVsb3JcIikge1xyXG4gICAgZWR1Y2F0aW9uTGV2ZWxUZXh0ID0gXCLQkdCw0LrQsNC70LDQstGA0LjQsNGCXCI7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgZWR1Y2F0aW9uTGV2ZWxUZXh0ID0gXCLQnNCw0LPQuNGB0YLRgNCw0YLRg9GA0LBcIjtcclxuICB9XHJcblxyXG4gIGxldCBmcm9tRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJvbURhdGVJbnB1dFwiKS52YWx1ZTtcclxuICBsZXQgdG9EYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVJbnB1dFwiKS52YWx1ZTtcclxuICBsZXQgZGVhZGxpbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYWRsaW5lXCIpLnZhbHVlO1xyXG5cclxuICBpZiAodHlwZVByYWN0aWNlID09PSBcImVkdWNhdGlvbmFsXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJpbnRlcm5zaGlwXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQvtC40LfQstC+0LTRgdGC0LLQtdC90L3QsNGPXCI7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJwcmVkaXBsb21hXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQtdC00LTQuNC/0LvQvtC80L3QsNGPXCI7XHJcbiAgfVxyXG4gIGxldCB0cmVlVmlldz1udWxsO1xyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcInByYWN0aWNlXCIpICE9PSAtMSAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID09IFwiYmxvY2tcIikge1xyXG4gICAgIHRyZWVWaWV3PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pO1xyXG4gICAgfVxyXG4gIH1cclxuICBsZXQgYXJyR3JvdXBzID0gdGhpcy5nZXRTZWxlY3RlZEdyb3Vwcyh0cmVlVmlldyk7XHJcbiAgbGV0IGFyck9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldFNlbGVjdGVkR3JvdXBzKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKSk7XHJcblxyXG5cclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR5cGVQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2VUZXh0O1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICBcImVkdWNhdGlvbmFsTGV2ZWxEaWFsb2dcIikuaW5uZXJIVE1MID0gZWR1Y2F0aW9uTGV2ZWxUZXh0O1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVybXNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSAnYyAnICsgZnJvbURhdGVcclxuICAgICAgKyAnINC/0L4gJyArIHRvRGF0ZTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYWRsaW5lUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gZGVhZGxpbmU7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJncm91cHNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBhcnJHcm91cHM7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgIFwib3JnYW5pc2F0aW9uc1ByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGFyck9yZ2FuaXNhdGlvbnM7XHJcblxyXG5cclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlVGV4dFxyXG4gICAgICArIFwiINC/0YDQsNC60YLQuNC60LBcIjtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUZXJtc1ByYWN0aWNlXCIpLmlubmVySFRNTCA9IGZyb21EYXRlXHJcbiAgICAgICsgJyAtICcgKyB0b0RhdGU7XHJcblxyXG59XHJcblZpZXcucHJvdG90eXBlLmRpc3BsYXlHcm91cHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVjYXRpb25cIikudmFsdWU7XHJcbiAgaWYgKGVkdWNhdGlvbkxldmVsID09PSBcImJhY2hlbG9yXCIpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBlbHNlIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwiYmFjaGVsb3JcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJJbmZvID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVQcmFjdGljZVRhYlwiKS52YWx1ZTtcclxuICBsZXQgdHlwZVByYWN0aWNlVGV4dCA9IFwi0KPRh9C10LHQvdCw0Y9cIjtcclxuICBpZiAodHlwZVByYWN0aWNlID09PSBcImVkdWNhdGlvbmFsXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJpbnRlcm5zaGlwXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQvtC40LfQstC+0LTRgdGC0LLQtdC90L3QsNGPXCI7XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJwcmVkaXBsb21hXCIpIHtcclxuICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQtdC00LTQuNC/0LvQvtC80L3QsNGPXCI7XHJcbiAgfVxyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2VUZXh0XHJcbiAgICAgICsgJyDQv9GA0LDQutGC0LjQutCwJztcclxufVxyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJUYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XHJcbiAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5DbGVhclRhYmxlKCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuQ2xlYXJUYWJsZSgpO1xyXG4gICAgdGhpcy5teVRhYmxlLmRhdGFUYWJsZSgpLmZuQWRkRGF0YShkYXRhKTtcclxuICB9XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLmNoYW5nZVllYXIgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gIGlmIChzZWxlY3RlZEVsZW0pIHtcclxuICAgIHNlbGVjdGVkRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdjdXJyZW50Jyk7XHJcbiAgfVxyXG4gIHNlbGVjdGVkRWxlbSA9IG5vZGU7XHJcbiAgc2VsZWN0ZWRFbGVtLmNsYXNzTGlzdC5hZGQoJ2N1cnJlbnQnKTtcclxuICB0aGlzLnNlbGVjdGVkWWVhciA9IHNlbGVjdGVkRWxlbS5pbm5lckhUTUw7XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZVllYXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gIGRlYnVnZ2VyO1xyXG4gIHdoaWxlICh0YXJnZXQgIT0gYnV0dG9uc0FycmF5KSB7XHJcbiAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZSA9PSAnaXRlbSB5ZWFyJykge1xyXG4gICAgICB0aGlzLmNoYW5nZVllYXIodGFyZ2V0KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XHJcbiAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRHcm91cHMgPSBmdW5jdGlvbiAodHJlZVZpZXcpIHtcclxuICBpZih0cmVlVmlldz09PXVuZGVmaW5lZClcclxuICB7XHJcbiAgICBsZXQgZnJhbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZyYW1lc1wiKVswXS5jaGlsZHJlbjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlmIChmcmFtZXNbaV0uc3R5bGUuZGlzcGxheSA9PSBcImJsb2NrXCIpIHtcclxuICAgICAgICB0cmVlVmlldyA9IGZyYW1lc1tpXS5jaGlsZHJlblswXTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBsZXQgR3JvdXBzID0gW107XHJcbiAgbGV0IGxpTnVtYmVyID0gdHJlZVZpZXcucXVlcnlTZWxlY3RvckFsbCgnbGknKTtcclxuICBkZWJ1Z2dlcjtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxpTnVtYmVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBsZXQgZ3JvdXBzID0gbGlOdW1iZXJbaV0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6Y2hlY2tlZCcpO1xyXG4gICAgaWYgKGdyb3Vwcy5sZW5ndGggPT0gMSkge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGxldCBncm91cCA9IGdyb3Vwc1tqXS5wYXJlbnRFbGVtZW50Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUw7XHJcbiAgICAgICAgaWYgKGdyb3VwLmluZGV4T2YoXCLQutGD0YDRgVwiKSA9PT0gLTEpIHtcclxuICAgICAgICAgIEdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgY29uc29sZS5sb2coR3JvdXBzKTtcclxuICByZXR1cm4gR3JvdXBzO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsIG5hbWVMZWFmKSB7XHJcbiAgdHJlZS5hZGRMZWFmKG5vZGUsIG5hbWVMZWFmLCB7XHJcbiAgICBtb2RlOiAnY2hlY2tib3gnLFxyXG4gICAgY2hlY2tlZDogZmFsc2VcclxuICB9KTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUNoaWxkcmVuKG5vZGUpIHtcclxuICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkTm9kZXM7XHJcbiAgd2hpbGUgKGNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZHJlblswXSk7XHJcbiAgfVxyXG59XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jbGVhckdyb3Vwc1RyZWVWaWV3ID0gZnVuY3Rpb24gKCkge1xyXG4gIHZhciBpZCA9IDA7XHJcbiAgd2hpbGUgKGlkIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcclxuICAgIHZhciBsaUFycmF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgdGhpcy5pZFRyZWVWaWV3c1tpZF0pLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHJlbW92ZUNoaWxkcmVuKGxpQXJyYXlbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0pO1xyXG4gICAgfVxyXG4gICAgaWQrKztcclxuICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZUdyb3Vwc1RyZWVWaWV3ID0gZnVuY3Rpb24gKGNvdXJzZXMpIHtcclxuICBjb25zb2xlLmxvZyhjb3Vyc2VzKTtcclxuICBsZXQgaWRDb3VudGVyID0gMCwgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyLCBjbnQ7XHJcbiAgbGV0IGNvdXJzZXNOYW1lID0gWydmaXJzdCcsICdzZWNvbmQnLCAndGhpcmQnLCAnZm91cnRoJ107XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHdoaWxlIChpZENvdW50ZXIgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aCkge1xyXG4gICAgdmFyIHRyZWUgPSAkKFwiI1wiICsgdGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdKS5kYXRhKFwidHJlZXZpZXdcIik7XHJcbiAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgIGNvdXJzZU51bWJlciA9IG1hc3RlclllYXI7XHJcbiAgICAgIGkgPSBiYWNoZWxvclllYXI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyO1xyXG4gICAgICBpID0gMDtcclxuICAgIH1cclxuICAgIGNudCA9IDA7XHJcbiAgICBmb3IgKGk7IGkgPCBjb3Vyc2VOdW1iZXI7IGkrKykge1xyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvdXJzZXNbaV0uZ3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgbGV0IG5vZGUgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGkuJyArIGNvdXJzZXNOYW1lW2NudF0pO1xyXG4gICAgICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLCBjb3Vyc2VzW2ldLmdyb3Vwc1tqXSk7XHJcbiAgICAgIH1cclxuICAgICAgY250Kys7XHJcbiAgICB9XHJcbiAgICBpZENvdW50ZXIrKztcclxuICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRDb25maWd1cmF0aW9ucz0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCB0eXBlUHJhY3RpY2U9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgbGV0IGVkdUxldmVsPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1TGV2ZWxPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgbGV0IHllYXJzPWRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ5ZWFyc1wiKTtcclxuICBjb25zb2xlLmxvZyh0eXBlUHJhY3RpY2UpO1xyXG4gIGNvbnNvbGUubG9nKGVkdUxldmVsKTtcclxuICBjb25zb2xlLmxvZyh0aGlzLnNlbGVjdGVkWWVhcik7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvVmlldy5qcyIsImNvbnN0IFNFUFRFTUJFUiA9IDk7XHJcbmNvbnN0IGZpcnN0Q291cnNlPTA7XHJcbmNvbnN0IHNlY29uZENvdXJzZSA9IDE7XHJcbmNvbnN0IHRoaXJkQ291cnNlPTI7XHJcbmNvbnN0IGZvdXJ0aENvdXJzZSA9IDM7XHJcbmNvbnN0IG1hc3RlckZpcnN0Q291cnNlPTQ7XHJcbmNvbnN0IG1hc3RlclNlY29uZENvdXJzZT01O1xyXG5cclxudmFyIE1vZGVsID0gZnVuY3Rpb24gKCkge1xyXG4gIHRoaXMuR3JvdXBzID0gW107XHJcbiAgdGhpcy5TdHVkZW50cyA9IFtdO1xyXG4gIHRoaXMuQ291cnNlcyA9IFtdO1xyXG59O1xyXG5cclxuY2xhc3MgQ291cnNlIHtcclxuICBjb25zdHJ1Y3RvcihuYW1lQ291cnNlKSB7XHJcbiAgICB0aGlzLm5hbWVDb3Vyc2UgPSBuYW1lQ291cnNlO1xyXG4gICAgdGhpcy5ncm91cHMgPSBbXTtcclxuICB9XHJcblxyXG4gIGFkZEdyb3VwKGdyb3VwKSB7XHJcbiAgICB0aGlzLmdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICB9XHJcbn1cclxuLy8gYXN5bmMgZnVuY3Rpb24gZ2V0RGF0YUZyb21UYWJsZSh0YWJsZSkge1xyXG4vLyAgIGxldCBhbnN3ZXIgPSBhd2FpdCB0YWJsZS5maW5kQWxsKHtcclxuLy8gICAgIGF0dHJpYnV0ZXM6IFtcclxuLy8gICAgICAgJ2lkX3R5cGVfcHJhY3RpY2UnLFxyXG4vLyAgICAgICAnbmFtZV90eXBlX3ByYWN0aWNlJ1xyXG4vLyAgICAgXVxyXG4vLyAgIH0pO1xyXG4vLyAgIGxldCBkYXRhID0gW107XHJcbi8vICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbnN3ZXIubGVuZ3RoOyArK2kpIHtcclxuLy8gICAgIGRhdGEucHVzaChhbnN3ZXJbaV0ubmFtZSk7XHJcbi8vICAgfVxyXG4vLyAgIGRlYnVnZ2VyO1xyXG4vLyAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4vLyB9XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0U3R1ZGVudHMgPSBhc3luYyBmdW5jdGlvbiAoZ3JvdXBzKSB7XHJcblxyXG4gYXdhaXQgZ2V0RGF0YUZyb21UYWJsZShtb2RlbC5UeXBlc19wcmFjdGljZSk7XHJcbiAgZGVidWdnZXI7XHJcbiAgdGhpcy5Hcm91cHMgPSBncm91cHM7XHJcbiAgdGhpcy5TdHVkZW50cyA9IFtdO1xyXG4gIGxldCBncm91cHNVSURTID0gYXdhaXQgdGhpcy5nZXRHcm91cHNVSURTKCk7XHJcbiAgaWYgKGdyb3Vwc1VJRFMgIT0gMCkge1xyXG4gICAgZm9yIChsZXQgaSA9IDAsIG4gPSAwOyBpIDwgZ3JvdXBzVUlEUy5sZW5ndGg7ICsraSkge1xyXG4gICAgICBsZXQgc3R1ZGVudHNMaXN0ID0gYXdhaXQgdGhpcy5nZXRTdHVkZW50c0J5R3JvdXBJZChncm91cHNVSURTW2ldKTtcclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdHVkZW50c0xpc3QubGVuZ3RoOyArK2osIG4rKykge1xyXG4gICAgICAgIHRoaXMuU3R1ZGVudHMucHVzaCh7Z3JvdXA6IHRoaXMuR3JvdXBzW2ldfSk7XHJcbiAgICAgICAgdGhpcy5TdHVkZW50c1tuXS5zdHVkZW50ID0gc3R1ZGVudHNMaXN0W2pdLmRpc3BsYXlOYW1lO1xyXG4gICAgICAgIHRoaXMuU3R1ZGVudHNbbl0ub3JnYW5pc2F0aW9uID0gajtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufTtcclxuTW9kZWwucHJvdG90eXBlLmdldEFsbEdyb3VwcyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZ3JvdXBzID0gW107XHJcbiAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJveHkvY29yZS92MS9ncm91cHMnKVxyXG4gIC50aGVuKGFzeW5jIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICB9KVxyXG4gIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgZ3JvdXBzID0gcmVzcG9uc2UuX2VtYmVkZGVkLmdyb3VwcztcclxuICB9KTtcclxuICByZXR1cm4gZ3JvdXBzO1xyXG59XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUubXlHZXRZZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICBsZXQgY3VycmVudFllYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCkudG9TdHJpbmcoKTtcclxuICByZXR1cm4gY3VycmVudFllYXI7XHJcbn1cclxuXHJcbk1vZGVsLnByb3RvdHlwZS5kaXN0cmlidXRlR3JvdXBzQnlDb3Vyc2VzID0gYXN5bmMgZnVuY3Rpb24gKGN1cnJlbnRZZWFyKSB7XHJcbiAgdGhpcy5Db3Vyc2VzID0gW1xyXG4gICAgbmV3IENvdXJzZSgnMScpLFxyXG4gICAgbmV3IENvdXJzZSgnMicpLFxyXG4gICAgbmV3IENvdXJzZSgnMycpLFxyXG4gICAgbmV3IENvdXJzZSgnNCcpLFxyXG4gICAgbmV3IENvdXJzZSgnMSAo0LzQsyknKSxcclxuICAgIG5ldyBDb3Vyc2UoJzIgKNC80LMpJylcclxuICBdO1xyXG5cclxuICBsZXQgZ3JvdXBzID0gYXdhaXQgdGhpcy5nZXRBbGxHcm91cHMoKTtcclxuICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICBpZiAoK2N1cnJlbnRNb250aCA8IFNFUFRFTUJFUikge1xyXG4gICAgY3VycmVudFllYXIgLT0gMTtcclxuICB9XHJcblxyXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBpZiAoZ3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICBpZiAoZ3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgIT09IC0xKSB7XHJcblxyXG4gICAgICAgIHRoaXMuQ291cnNlc1ttYXN0ZXJGaXJzdENvdXJzZV0uYWRkR3JvdXAoZ3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICB0aGlzLkNvdXJzZXNbZmlyc3RDb3Vyc2VdLmFkZEdyb3VwKGdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3VycmVudFllYXItLTtcclxuICAgIGlmIChncm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgIGlmIChncm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSAhPT0gLTEpIHtcclxuICAgICAgICB0aGlzLkNvdXJzZXNbbWFzdGVyU2Vjb25kQ291cnNlXS5hZGRHcm91cChncm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW3NlY29uZENvdXJzZV0uYWRkR3JvdXAoZ3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgaWYgKGdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKGdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpID09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW3RoaXJkQ291cnNlXS5hZGRHcm91cChncm91cHNbaV0ubmFtZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgaWYgKGdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgaWYgKGdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpID09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5Db3Vyc2VzW2ZvdXJ0aENvdXJzZV0uYWRkR3JvdXAoZ3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjdXJyZW50WWVhciArPSAzO1xyXG4gIH1cclxufVxyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEdyb3Vwc1VJRFMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgbGV0IGdyb3Vwc1VJRFMgPSBbXTtcclxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBsZXQgZ3JvdXBOYW1lID0gdGhpcy5Hcm91cHNbaV07XHJcbiAgICBjb25zb2xlLmxvZyhncm91cE5hbWUpO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJveHkvY29yZS92MS9ncm91cHM/bmFtZT0nICsgZ3JvdXBOYW1lKVxyXG4gICAgLnRoZW4oYXN5bmMgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgIHJldHVybiBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgIHRoaXMuZ3JvdXBzID0gcmVzcG9uc2U7XHJcbiAgICAgIGxldCBncm91cElEID0gcmVzcG9uc2UuX2VtYmVkZGVkLmdyb3Vwc1swXS5pZDtcclxuICAgICAgZ3JvdXBzVUlEUy5wdXNoKGdyb3VwSUQpO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgIGFsZXJ0KFwi0JPRgNGD0L/Qv9CwIFwiICsgZ3JvdXBOYW1lICsgXCIg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIik7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmV0dXJuIGdyb3Vwc1VJRFM7XHJcbn1cclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRTdHVkZW50c0J5R3JvdXBJZCA9IGFzeW5jIGZ1bmN0aW9uIChncm91cElEKSB7XHJcbiAgbGV0IHN0dWRlbnRzTGlzdCA9IFtdO1xyXG4gIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvZ3JvdXBzLycgKyBncm91cElEKVxyXG4gIC50aGVuKGFzeW5jIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICB9KVxyXG4gIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgc3R1ZGVudHNMaXN0ID0gcmVzcG9uc2UuX2VtYmVkZGVkLnN0dWRlbnRzO1xyXG4gIH0pXHJcbiAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgIGFsZXJ0KGVycm9yKTtcclxuICB9KTtcclxuICA7XHJcbiAgcmV0dXJuIHN0dWRlbnRzTGlzdDtcclxufVxyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFR5cGVzT3JnYW5pc2F0aW9uPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL01vZGVsLmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1jb2xvcnMuY3NzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1yZXNwb25zaXZlLmNzc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL0RhdGFUYWJsZXMvZGF0YXRhYmxlcy5taW4uY3NzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQWJBO0FBZUE7QUFqQkE7QUF1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBRUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDbFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBOzs7Ozs7QUMxS0E7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7OztBIiwic291cmNlUm9vdCI6IiJ9
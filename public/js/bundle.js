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
    this.View.OpenOrCloseLoadImage();
    this.setYears();
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
    this.View.onClickApproveStudent = this.approveStudent.bind(this);
    this.View.onClickRejectStudent = this.rejectStudent.bind(this);
    this.View.init();
    await this.Model.init();
    this.View.OpenOrCloseLoadImage();
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
    //await this.renderGroupsTreeView();
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
Controller.prototype.updateOrganisation = async function (event) {
    let idOrganisation = this.View.getIdOrganisation(event);
    let organisation = await this.Model.getOrganisationById(idOrganisation);
    organisation = this.View.getInfoNewOrganisation();
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
    await this.View.updateGroupsTreeView(this.Model.Courses);
};

Controller.prototype.setGroupsTreeView = async function (event) {
    this.View.updateYear(event);
    if (this.View.selectedYear === "+") this.View.selectedYear = this.Model.getCurrentYear();
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
        for (let i = 0; i < this.Model.Groups.length; i++) {
            for (let j = 0; j < selectedGroups.length; j++) {
                if (this.Model.Groups[i].name === selectedGroups[j]) {
                    groupsObjects.push(this.Model.Groups[i]);
                }
            }
        }
        practice = await this.Model.getPractice(info_about_practice);
        let requests_organisations;
        if (practice.length !== 0) {
            let requests = await this.Model.getRequests(practice, groupsObjects);
            await this.Model.assosiateRequestToStudent(requests, selectedGroups);
            requests_organisations = await this.Model.getRequestsOrganisations(selectedGroups);
            data = await this.Model.getData(selectedGroups, requests_organisations);
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
Controller.prototype.getApprovedAndNonApprovedStudents = async function (nameOrganisation) {
    this.View.OpenOrCloseLoadImage();
    let info_about_practice = this.View.getConfigurationPractice();
    let practice = await this.Model.getPractice(info_about_practice);
    let approved_student_count = 0,
        non_approved_student_count = 0;
    if (practice.length !== 0) {
        approved_student_count = await this.renderApprovedStudentList(nameOrganisation, practice);
        non_approved_student_count = await this.renderNonApprovedStudentList(nameOrganisation, practice);
    }
    this.View.updateOrganisationTitle(nameOrganisation, approved_student_count, non_approved_student_count);
    this.View.OpenOrCloseLoadImage();
};

Controller.prototype.displayInfoAboutOrg = async function (event) {
    let nameOrganisation = this.View.getSelectedOrganisation(event);
    await this.getApprovedAndNonApprovedStudents(nameOrganisation);
};

Controller.prototype.renderApprovedStudentList = async function (nameOrganisation, practice) {
    let approved_students_info = await this.Model.getApprovedStudents(nameOrganisation, practice);
    let approved_students = await this.Model.getStudentsByUID(approved_students_info);
    this.View.updateStudentsListView(approved_students, "approvedStudents");
    return approved_students.length;
};

Controller.prototype.renderNonApprovedStudentList = async function (nameOrganisation, practice) {
    let students_info = await this.Model.getRequestsByOrganisationName(nameOrganisation, practice);
    let non_approved_students = await this.Model.getStudentsByUID(students_info);
    this.View.updateStudentsListView(non_approved_students, "nonApprovedStudents");
    return non_approved_students.length;
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

Controller.prototype.approveStudent = async function (event) {
    let studentThatShouldBeApproved = this.View.getSelectedStudent(event);
    await this.Model.approveRequestOrganisation(studentThatShouldBeApproved);
    await this.Model.updateRequest(studentThatShouldBeApproved, false);
    let nameOrganisation = this.View.getNameOrganisationByTitle();
    await this.getApprovedAndNonApprovedStudents(nameOrganisation);
};

Controller.prototype.rejectStudent = async function () {
    let studentThatShouldBeApproved = this.View.getSelectedStudent(event);
    await this.Model.rejectRequestOrganisation(studentThatShouldBeApproved);
    await this.Model.updateRequest(studentThatShouldBeApproved, true);
    let nameOrganisation = this.View.getNameOrganisationByTitle();
    await this.getApprovedAndNonApprovedStudents(nameOrganisation);
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
    this.onClickDisplayInfoAboutOrg = null;
    this.onClickDisplayOrganisations = null;
    this.onClickEditOrganisation = null;
    this.onClickApproveStudent = null;
    this.onClickRejectStudent = null;
    this.onClickUpdateOrganisation = null;
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
    /*  document.getElementById("organisationList").addEventListener('click',
          this.onClickDisplayInfoAboutOrg);*/
    document.getElementById("showAllOrganisations").addEventListener('click', this.onClickDisplayOrganisations);
    document.getElementById("updateOrganisation").addEventListener('click', this.onClickUpdateOrganisation);
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
    document.getElementById("studentsRequests").style.display = "none";
    document.getElementById("allOrganisationsListBlock").style.display = "block";
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

        let span_user_plus = document.createElement('span');
        span_user_plus.setAttribute("class", "mif-user-plus mif-lg fg-gray add-student-organisation");
        //span_user_plus.addEventListener("click", this.addStudentToOrganisation());
        div_settings_organisation.appendChild(span_user_plus);

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

View.prototype.updateOrganisationTitle = function (nameOrganisation, approved_student_count, non_approved_student_count) {
    if (approved_student_count === 0) {
        document.getElementById("nonApprovedStudentListTitle").innerHTML = ", пуст";
    } else {
        document.getElementById("nonApprovedStudentListTitle").innerHTML = "";
    }
    document.getElementById("orgName").innerHTML = nameOrganisation;

    if (non_approved_student_count === 0) {
        document.getElementById("approvedStudentListTitle").innerHTML = "Список утвержденных студентов пуст.";
    } else {
        document.getElementById("approvedStudentListTitle").innerHTML = "Список утвержденных студентов.";
    }
};

View.prototype.getSelectedOrganisation = function (event) {
    let element = event.target;
    while (true) {
        if (element.className == "list-content inline-block") {
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
    let student = {
        'id_request': event.target.parentElement.parentElement.children[0].children[0].getAttribute("request"),
        'uid_student': event.target.parentElement.parentElement.children[0].children[0].getAttribute("uid"),
        'id_organisation': event.target.parentElement.parentElement.children[0].children[0].getAttribute("org"),
        'name_organisation': event.target.parentElement.parentElement.children[0].children[0].getAttribute("name-org")
    };
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

/*получаем студентов из хранилища LDAP по UID */
Model.prototype.getStudentsByUID = async function (students_info) {
    let students = [];
    for (let i = 0, n = 0; i < students_info.length; ++i) {
        let result = await fetch('/proxy/core/v1/people/' + students_info[i].uid_student);
        let list = await result.json();
        students.push({
            displayName: list.displayName,
            group_name: list._links.groups[0].name,
            group_UID: list._links.groups[0].id,
            date_creation_request: students_info[i].date_creation,
            id_request: students_info[i].id_request,
            uid_student: students_info[i].uid_student,
            id_organisation: students_info[i].id_organisation
        });
    }
    return students;
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

Model.prototype.getRequestsByOrganisationName = async function (nameOrganisation, practice) {
    let organisation = await this.getOrganisationByName(nameOrganisation);
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = "?id_practice=" + practice.id_practice;
    let result = await fetch('/requests-by-practice' + info, params);
    let requests = await result.json();
    let students = [];
    for (let i = 0; i < requests.length; i++) {
        let info = "?id_request=" + requests[i].id_request + "&id_organisation=" + organisation.id;
        let result = await fetch('/exist-request' + info, params);
        if (result.status !== 404) {
            ///ОШИБКА В КОНОСЛИ NOT FOUND
            let data = await result.json();
            if (data.id_status === 0) {
                students.push({
                    id_request: data.id_request,
                    id_organisation: data.id_organisation,
                    id_status: data.id_status,
                    uid_student: requests[i].uid_student,
                    id_practice: requests[i].id_practice,
                    id_review: requests[i].id_review,
                    date_creation: data.date_creation
                });
            }
        }
    }
    return students;
};

Model.prototype.getApprovedStudents = async function (nameOrganisation, practice) {
    let organisation = await this.getOrganisationByName(nameOrganisation);
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = "?id_practice=" + practice.id_practice;
    let result = await fetch('/requests-by-practice' + info, params);
    let requests = await result.json();
    let students = [];
    for (let i = 0; i < requests.length; i++) {
        if (requests[i].id_organisation == organisation.id) {
            students.push({
                id_request: requests[i].id_request,
                id_organisation: requests[i].id_organisation,
                uid_student: requests[i].uid_student,
                id_practice: requests[i].id_practice,
                id_review: requests[i].id_review
            });
        }
    }
    for (let i = 0; i < students.length; i++) {
        info = "?id_request=" + students[i].id_request + "&id_organisation=" + students[i].id_organisation;
        result = await fetch('/exist-request' + info, params);
        if (result.status !== 404) {
            let data = await result.json();
            students[i].date_creation = data.date_creation;
        }
    }
    return students;
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

Model.prototype.rejectRequestOrganisation = async function (studentThatShouldBeApproved) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = '?id_request=' + studentThatShouldBeApproved.id_request + "&id_organisation=" + studentThatShouldBeApproved.id_organisation;
    await fetch('/update-request-organisation-reject' + info, params);
};

Model.prototype.approveRequestOrganisation = async function (studentThatShouldBeApproved) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = '?id_request=' + studentThatShouldBeApproved.id_request + "&id_organisation=" + studentThatShouldBeApproved.id_organisation;
    await fetch('/update-request-organisation-approve' + info, params);
};

Model.prototype.updateRequest = async function (studentThatShouldBeApproved, reject) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = 0;
    if (reject) {
        info = '?id_request=' + studentThatShouldBeApproved.id_request + "&id_organisation=null";
    } else {
        info = '?id_request=' + studentThatShouldBeApproved.id_request + "&id_organisation=" + studentThatShouldBeApproved.id_organisation;
    }
    await fetch('/update-request' + info, params);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGRlYjNlZDdmZTA1NjQzNmI2YmU4Iiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9saWJzL0RhdGFUYWJsZXMvZGF0YXRhYmxlcy5taW4uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkZWIzZWQ3ZmUwNTY0MzZiNmJlOCIsImNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlICgnLi9Db250cm9sbGVyLmpzJyk7XHJcblxyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzJyk7XHJcbnJlcXVpcmUoJy4vbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcycpO1xyXG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgbmV3IENvbnRyb2xsZXIoKTtcclxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9tYWluLmpzIiwiY29uc3QgVmlldyA9IHJlcXVpcmUoJy4vVmlldy5qcycpO1xyXG5jb25zdCBNb2RlbCA9IHJlcXVpcmUoJy4vTW9kZWwuanMnKTtcclxuXHJcbmZ1bmN0aW9uIENvbnRyb2xsZXIoKSB7XHJcbiAgICB0aGlzLlZpZXcgPSBuZXcgVmlldygpO1xyXG4gICAgdGhpcy5Nb2RlbCA9IG5ldyBNb2RlbCgpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbn1cclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmluaXQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkSW1hZ2UoKTtcclxuICAgIHRoaXMuc2V0WWVhcnMoKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrTmV4dFN0ZXAgPSB0aGlzLmRpc3BsYXlHcm91cHMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UgPSB0aGlzLmdvVG9QcmFjdGljZUNyZWF0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0FkZFByYWN0aWNlID0gdGhpcy5jcmVhdGVQcmFjdGljZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tUb09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gdGhpcy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24uYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24gPSB0aGlzLmdvVG9TdHVkZW50c1NlY3Rpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrRmluaXNoQnRuID0gdGhpcy5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1NlbGVjdEdyb3VwQnRuT2sgPSB0aGlzLnJlbmRlckRhdGFJblRhYmxlLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1llYXJzQXJyYXkgPSB0aGlzLnNldEdyb3Vwc1RyZWVWaWV3LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0dldE9yZ2FuaXNhdGlvbnMgPSB0aGlzLmdldE9yZ2FuaXNhdGlvbnMuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uID0gdGhpcy51cGRhdGVUcmVlVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tEaXNwbGF5SW5mb0Fib3V0T3JnID0gdGhpcy5kaXNwbGF5SW5mb0Fib3V0T3JnLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0Rpc3BsYXlPcmdhbmlzYXRpb25zID0gdGhpcy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24uYmluZChcclxuICAgICAgICB0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrRWRpdE9yZ2FuaXNhdGlvbiA9IHRoaXMuc2hvd0RpYWxvZ0VkaXRPcmdhbmlzYXRpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrVXBkYXRlT3JnYW5pc2F0aW9uID0gdGhpcy51cGRhdGVPcmdhbmlzYXRpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrQXBwcm92ZVN0dWRlbnQgPSB0aGlzLmFwcHJvdmVTdHVkZW50LmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1JlamVjdFN0dWRlbnQgPSB0aGlzLnJlamVjdFN0dWRlbnQuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5pbml0KCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmluaXQoKTtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuc2V0WWVhcnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgeWVhcnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFByYWN0aWNlWWVhcnMoKTtcclxuICAgIHRoaXMuVmlldy5zZXRZZWFyc0FycmF5KHllYXJzKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldE9yZ2FuaXNhdGlvbnMoKTtcclxuICAgIGxldCB0eXBlc09yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0VHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvblNlbGVjdCh0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgICB0aGlzLlZpZXcuc2V0T3JnYW5pc2F0aW9uc0xpc3Qob3JnYW5pc2F0aW9ucywgXCJhbGxPcmdhbmlzYXRpb25zTGlzdFwiKTtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgdGhpcy5WaWV3LmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbigpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub1N0dWRlbnRzU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5nb1RvU3R1ZGVudHNTZWN0aW9uKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nb1RvUHJhY3RpY2VDcmVhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5zZWxlY3RlZFllYXIgPSB0aGlzLk1vZGVsLmdldEN1cnJlbnRZZWFyKCk7XHJcbiAgICAvL2F3YWl0IHRoaXMucmVuZGVyR3JvdXBzVHJlZVZpZXcoKTtcclxuICAgIHRoaXMuVmlldy5jbGVhclByYWN0aWNlU2VjdGlvbigpO1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy51cGRhdGVUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0KHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMuVmlldy5nb1RvUHJhY3RpY2VDcmVhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNlbGVjdGVkWWVhciA9IHRoaXMuTW9kZWwuZ2V0Q3VycmVudFllYXIoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHR5cGVzT3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LmNsZWFyVHlwZXNPcmdhbmlzYXRpb24oKTtcclxuICAgIHRoaXMuVmlldy5zZXRUeXBlc09yZ2FuaXNhdGlvbih0eXBlc09yZ2FuaXNhdGlvbik7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9ucygpO1xyXG4gICAgdGhpcy5WaWV3LnNldE9yZ2FuaXNhdGlvbnNJblRyZWVWaWV3KG9yZ2FuaXNhdGlvbnMsIHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIHJldHVybiB0eXBlc09yZ2FuaXNhdGlvbjtcclxufTtcclxuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgaWRPcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0SWRPcmdhbmlzYXRpb24oZXZlbnQpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlJZChpZE9yZ2FuaXNhdGlvbik7XHJcbiAgICAgb3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldEluZm9OZXdPcmdhbmlzYXRpb24oKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlT3JnYW5pc2F0aW9uKG9yZ2FuaXNhdGlvbik7XHJcbn07XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnNob3dEaWFsb2dFZGl0T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgaWRPcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0SWRPcmdhbmlzYXRpb24oZXZlbnQpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uQnlJZChpZE9yZ2FuaXNhdGlvbik7XHJcbiAgICB0aGlzLlZpZXcuc2hvd0RpYWxvZ09yZ2FuaXNhdGlvbihvcmdhbmlzYXRpb24pO1xyXG59O1xyXG5cclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09UFJBQ1RJQ0UgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpc3BsYXlHcm91cHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZGlzcGxheUdyb3VwcygpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5kaWFsb2dQcmFjdGljZUNyZWF0ZWRJbml0KCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5jcmVhdGVOZXdPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldEluZm9OZXdPcmdhbmlzYXRpb24oKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwuY3JlYXRlT3JnYW5pc2F0aW9uKG9yZ2FuaXNhdGlvbik7XHJcblxyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS51cGRhdGVUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGF3YWl0IHRoaXMuY3JlYXRlTmV3T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uKCk7XHJcbn07XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmNyZWF0ZVByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSB0aGlzLlZpZXcuUHJhY3RpY2U7XHJcbiAgICBsZXQgZ3JvdXBzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXREZXRlcm1pbmVkR3JvdXBzKHByYWN0aWNlLmdyb3Vwcyk7XHJcbiAgICBwcmFjdGljZS5ncm91cHMgPSBncm91cHM7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmNyZWF0ZVByYWN0aWNlKHByYWN0aWNlKTtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgdGhpcy5nb1RvU3R1ZGVudHNTZWN0aW9uKCk7XHJcbn07XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBhd2FpdCAgdGhpcy5Nb2RlbC5kaXN0cmlidXRlR3JvdXBzQnlDb3Vyc2VzKHRoaXMuVmlldy5zZWxlY3RlZFllYXIpO1xyXG4gICAgYXdhaXQgdGhpcy5WaWV3LmNsZWFyR3JvdXBzVHJlZVZpZXcoKTtcclxuICAgIGF3YWl0IHRoaXMuVmlldy51cGRhdGVHcm91cHNUcmVlVmlldyh0aGlzLk1vZGVsLkNvdXJzZXMpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuc2V0R3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHRoaXMuVmlldy51cGRhdGVZZWFyKGV2ZW50KTtcclxuICAgIGlmICh0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID09PSBcIitcIilcclxuICAgICAgICB0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID0gdGhpcy5Nb2RlbC5nZXRDdXJyZW50WWVhcigpO1xyXG4gICAgYXdhaXQgdGhpcy5yZW5kZXJHcm91cHNUcmVlVmlldygpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyRGF0YUluVGFibGUgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkSW1hZ2UoKTtcclxuICAgIGxldCBzZWxlY3RlZEdyb3VwcyA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZEdyb3VwcygpO1xyXG4gICAgbGV0IGdyb3Vwc09iamVjdHMgPSBbXTtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gW10sIGRhdGEgPSAwO1xyXG4gICAgaWYgKHNlbGVjdGVkR3JvdXBzLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Nb2RlbC5Hcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuTW9kZWwuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBzT2JqZWN0cy5wdXNoKHRoaXMuTW9kZWwuR3JvdXBzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XHJcbiAgICAgICAgbGV0IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnM7XHJcbiAgICAgICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgICAgICBsZXQgcmVxdWVzdHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzKHByYWN0aWNlLCBncm91cHNPYmplY3RzKTtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5Nb2RlbC5hc3Nvc2lhdGVSZXF1ZXN0VG9TdHVkZW50KHJlcXVlc3RzLCBzZWxlY3RlZEdyb3Vwcyk7XHJcbiAgICAgICAgICAgIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzT3JnYW5pc2F0aW9ucyhcclxuICAgICAgICAgICAgICAgIHNlbGVjdGVkR3JvdXBzKTtcclxuICAgICAgICAgICAgZGF0YSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0RGF0YShzZWxlY3RlZEdyb3VwcywgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGRhdGEubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgZGF0YSA9IDA7XHJcbiAgICAgICAgdGhpcy5WaWV3LnJlbmRlclRhYmxlKGRhdGEpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5WaWV3LnJlbmRlclRhYmxlKGRhdGEpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5WaWV3LmNvbG9yVGFibGUoZGF0YSk7XHJcbiAgICB0aGlzLlZpZXcucmVuZGVySW5mbyhwcmFjdGljZSk7XHJcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkSW1hZ2UoKTtcclxufTtcclxuXHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1PUkdBTklTQVRJT05TIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5nZXRBcHByb3ZlZEFuZE5vbkFwcHJvdmVkU3R1ZGVudHMgPSBhc3luYyBmdW5jdGlvbiAobmFtZU9yZ2FuaXNhdGlvbikge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UoKTtcclxuICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XHJcbiAgICBsZXQgYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9IDAsIG5vbl9hcHByb3ZlZF9zdHVkZW50X2NvdW50ID0gMDtcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBhcHByb3ZlZF9zdHVkZW50X2NvdW50ID0gYXdhaXQgdGhpcy5yZW5kZXJBcHByb3ZlZFN0dWRlbnRMaXN0KG5hbWVPcmdhbmlzYXRpb24sIHByYWN0aWNlKTtcclxuICAgICAgICBub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9IGF3YWl0IHRoaXMucmVuZGVyTm9uQXBwcm92ZWRTdHVkZW50TGlzdChuYW1lT3JnYW5pc2F0aW9uLCBwcmFjdGljZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLlZpZXcudXBkYXRlT3JnYW5pc2F0aW9uVGl0bGUobmFtZU9yZ2FuaXNhdGlvbiwgYXBwcm92ZWRfc3R1ZGVudF9jb3VudCwgbm9uX2FwcHJvdmVkX3N0dWRlbnRfY291bnQpO1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5kaXNwbGF5SW5mb0Fib3V0T3JnID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZE9yZ2FuaXNhdGlvbihldmVudCk7XHJcbiAgICBhd2FpdCB0aGlzLmdldEFwcHJvdmVkQW5kTm9uQXBwcm92ZWRTdHVkZW50cyhuYW1lT3JnYW5pc2F0aW9uKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlbmRlckFwcHJvdmVkU3R1ZGVudExpc3QgPSBhc3luYyBmdW5jdGlvbiAobmFtZU9yZ2FuaXNhdGlvbiwgcHJhY3RpY2UpIHtcclxuICAgIGxldCBhcHByb3ZlZF9zdHVkZW50c19pbmZvID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRBcHByb3ZlZFN0dWRlbnRzKG5hbWVPcmdhbmlzYXRpb24sIHByYWN0aWNlKTtcclxuICAgIGxldCBhcHByb3ZlZF9zdHVkZW50cyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0U3R1ZGVudHNCeVVJRChhcHByb3ZlZF9zdHVkZW50c19pbmZvKTtcclxuICAgIHRoaXMuVmlldy51cGRhdGVTdHVkZW50c0xpc3RWaWV3KGFwcHJvdmVkX3N0dWRlbnRzLCBcImFwcHJvdmVkU3R1ZGVudHNcIik7XHJcbiAgICByZXR1cm4gYXBwcm92ZWRfc3R1ZGVudHMubGVuZ3RoO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyTm9uQXBwcm92ZWRTdHVkZW50TGlzdCA9IGFzeW5jIGZ1bmN0aW9uIChuYW1lT3JnYW5pc2F0aW9uLCBwcmFjdGljZSkge1xyXG4gICAgbGV0IHN0dWRlbnRzX2luZm8gPSBhd2FpdCB0aGlzLk1vZGVsLmdldFJlcXVlc3RzQnlPcmdhbmlzYXRpb25OYW1lKG5hbWVPcmdhbmlzYXRpb24sIHByYWN0aWNlKTtcclxuICAgIGxldCBub25fYXBwcm92ZWRfc3R1ZGVudHMgPSBhd2FpdCB0aGlzLk1vZGVsLmdldFN0dWRlbnRzQnlVSUQoc3R1ZGVudHNfaW5mbyk7XHJcbiAgICB0aGlzLlZpZXcudXBkYXRlU3R1ZGVudHNMaXN0Vmlldyhub25fYXBwcm92ZWRfc3R1ZGVudHMsIFwibm9uQXBwcm92ZWRTdHVkZW50c1wiKTtcclxuICAgIHJldHVybiBub25fYXBwcm92ZWRfc3R1ZGVudHMubGVuZ3RoO1xyXG59O1xyXG5cclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UoKTtcclxuICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IDA7XHJcbiAgICBpZiAocHJhY3RpY2UubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0T3JnYW5pc2F0aW9uc0J5UHJhY3RpY2VJZChwcmFjdGljZSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLlZpZXcuc2V0T3JnYW5pc2F0aW9uc0xpc3Qob3JnYW5pc2F0aW9ucywgXCJvcmdhbmlzYXRpb25MaXN0XCIpO1xyXG4gICAgdGhpcy5WaWV3LnJlbmRlck9yZ2FuaXNhdGlvblNlY3Rpb24ocHJhY3RpY2UpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuYXBwcm92ZVN0dWRlbnQgPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBzdHVkZW50VGhhdFNob3VsZEJlQXBwcm92ZWQgPSB0aGlzLlZpZXcuZ2V0U2VsZWN0ZWRTdHVkZW50KGV2ZW50KTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwuYXBwcm92ZVJlcXVlc3RPcmdhbmlzYXRpb24oc3R1ZGVudFRoYXRTaG91bGRCZUFwcHJvdmVkKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlUmVxdWVzdChzdHVkZW50VGhhdFNob3VsZEJlQXBwcm92ZWQsIGZhbHNlKTtcclxuICAgIGxldCBuYW1lT3JnYW5pc2F0aW9uID0gdGhpcy5WaWV3LmdldE5hbWVPcmdhbmlzYXRpb25CeVRpdGxlKCk7XHJcbiAgICBhd2FpdCB0aGlzLmdldEFwcHJvdmVkQW5kTm9uQXBwcm92ZWRTdHVkZW50cyhuYW1lT3JnYW5pc2F0aW9uKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnJlamVjdFN0dWRlbnQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgc3R1ZGVudFRoYXRTaG91bGRCZUFwcHJvdmVkID0gdGhpcy5WaWV3LmdldFNlbGVjdGVkU3R1ZGVudChldmVudCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLnJlamVjdFJlcXVlc3RPcmdhbmlzYXRpb24oc3R1ZGVudFRoYXRTaG91bGRCZUFwcHJvdmVkKTtcclxuICAgIGF3YWl0IHRoaXMuTW9kZWwudXBkYXRlUmVxdWVzdChzdHVkZW50VGhhdFNob3VsZEJlQXBwcm92ZWQsIHRydWUpO1xyXG4gICAgbGV0IG5hbWVPcmdhbmlzYXRpb24gPSB0aGlzLlZpZXcuZ2V0TmFtZU9yZ2FuaXNhdGlvbkJ5VGl0bGUoKTtcclxuICAgIGF3YWl0IHRoaXMuZ2V0QXBwcm92ZWRBbmROb25BcHByb3ZlZFN0dWRlbnRzKG5hbWVPcmdhbmlzYXRpb24pO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRyb2xsZXI7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9Db250cm9sbGVyLmpzIiwiY29uc3QgYmFjaGVsb3JZZWFyID0gNDtcclxuY29uc3QgbWFzdGVyWWVhciA9IDY7XHJcbmxldCBzZWxlY3RlZEVsZW0gPSAwO1xyXG5cclxudmFyIFZpZXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLm9uQ2xpY2tOZXh0U3RlcCA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tQcmFjdGljZUNvbXBsZXRlZCA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tDcmVhdGVQcmFjdGljZSA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tBZGRQcmFjdGljZSA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tUb09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0ZpbmlzaEJ0biA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rID0gbnVsbDtcclxuICAgIHRoaXMubXlUYWJsZSA9ICQoJyNzdHVkZW50c0xpc3RUYWJsZScpO1xyXG4gICAgdGhpcy5vbkNsaWNrWWVhcnNBcnJheSA9IG51bGw7XHJcbiAgICB0aGlzLnNlbGVjdGVkWWVhciA9IG51bGw7XHJcbiAgICB0aGlzLmlkVHJlZVZpZXdzID0gW1xyXG4gICAgICAgICdncm91cC10cmVldmlldy10YWJjb250cm9sMS1iYWNoZWxvcicsXHJcbiAgICAgICAgJ2dyb3VwLXRyZWV2aWV3LXRhYmNvbnRyb2wyLW1hc3RlcicsXHJcbiAgICAgICAgJ2dyb3Vwcy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbi1iYWNoZWxvcicsXHJcbiAgICAgICAgJ2dyb3Vwcy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbi1tYXN0ZXInXHJcbiAgICBdO1xyXG4gICAgdGhpcy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tDcmVhdGVPcmdhbmlzYXRpb24gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrRGlzcGxheUluZm9BYm91dE9yZyA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5T3JnYW5pc2F0aW9ucyA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tFZGl0T3JnYW5pc2F0aW9uID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0FwcHJvdmVTdHVkZW50ID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja1JlamVjdFN0dWRlbnQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrVXBkYXRlT3JnYW5pc2F0aW9uID0gbnVsbDtcclxuICAgIHRoaXMuUHJhY3RpY2UgPSBudWxsO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tbmV4dFwiKVswXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrTmV4dFN0ZXApO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkaWFsb2dQcmFjdGljZUNvbXBsZXRlU3VjY2Vzc1wiKS5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgIFwiI3ByYWN0aWNlRmluaXNoZWRPa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25zU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0dWRlbnRzU2VjdGlvbkJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrVG9TdHVkZW50c1NlY3Rpb24pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJ0bi1maW5pc2hcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0ZpbmlzaEJ0bik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldEdyb3Vwc0J0bk9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tZZWFyc0FycmF5KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0dG9uc0FycmF5MVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrWWVhcnNBcnJheSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdldE9yZ2FuaXNhdGlvbnNCdG5Pa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrR2V0T3JnYW5pc2F0aW9ucyk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZU9yZ2FuaXNhdGlvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJhY3RpY2VGaW5pc2hlZE9rXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tBZGRQcmFjdGljZSk7XHJcbiAgICAvKiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25MaXN0XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICAgIHRoaXMub25DbGlja0Rpc3BsYXlJbmZvQWJvdXRPcmcpOyovXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNob3dBbGxPcmdhbmlzYXRpb25zXCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5T3JnYW5pc2F0aW9ucyk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVwZGF0ZU9yZ2FuaXNhdGlvblwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrVXBkYXRlT3JnYW5pc2F0aW9uKTtcclxuICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoe1xyXG4gICAgICAgIGRhdGE6IHRoaXMuR3JvdXBzLFxyXG4gICAgICAgIFwibGFuZ3VhZ2VcIjoge1xyXG4gICAgICAgICAgICBcInplcm9SZWNvcmRzXCI6IFwi0KLQsNC60L7QuSDQt9Cw0L/QuNGB0Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIixcclxuICAgICAgICAgICAgXCJlbXB0eVRhYmxlXCI6IFwi0J3QuCDQvtC00L3QsCDQuNC3INCz0YDRg9C/0L8g0L3QtSDQstGL0LHRgNCw0L3QsCDQu9C40LHQviDQv9GA0LDQutGC0LjQutC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCIsXHJcbiAgICAgICAgICAgIFwic2VhcmNoXCI6IFwi0J/QvtC40YHQujpcIixcclxuICAgICAgICAgICAgXCJwYWdpbmF0ZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImZpcnN0XCI6IFwi0J/QtdGA0LLRi9C5XCIsXHJcbiAgICAgICAgICAgICAgICBcImxhc3RcIjogXCLQn9C+0YHQu9C10LTQvdC40LlcIixcclxuICAgICAgICAgICAgICAgIFwibmV4dFwiOiBcItCS0L/QtdGA0LXQtFwiLFxyXG4gICAgICAgICAgICAgICAgXCJwcmV2aW91c1wiOiBcItCd0LDQt9Cw0LRcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImluZm9GaWx0ZXJlZFwiOiBcIijQuNC3IF9NQVhfINGB0YLRg9C00LXQvdGC0L7QsilcIixcclxuICAgICAgICAgICAgXCJsZW5ndGhNZW51XCI6IFwi0J/QvtC60LDQt9Cw0YLRjCBfTUVOVV8g0LfQsNC/0LjRgdC10LlcIixcclxuICAgICAgICAgICAgXCJpbmZvXCI6IFwi0J7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgdGC0YPQtNC10L3RgtC+0LI6IF9UT1RBTF8gXCIsXHJcbiAgICAgICAgICAgIFwiaW5mb0VtcHR5XCI6IFwi0JLRi9Cx0LXRgNC40YLQtSDQs9GA0YPQv9C/0YMuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiY29sdW1uc1wiOiBbXHJcbiAgICAgICAgICAgIHtcImRhdGFcIjogXCJncm91cFwifSxcclxuICAgICAgICAgICAge1wiZGF0YVwiOiBcInN0dWRlbnRcIn0sXHJcbiAgICAgICAgICAgIHtcImRhdGFcIjogXCJvcmdhbmlzYXRpb25cIn1cclxuICAgICAgICBdXHJcbiAgICB9KTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9TdHVkZW50c1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI29yZ2FuaXNhdGlvbnNTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgbGV0IHRyZWVWaWV3cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmVldmlldyBcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRyZWVWaWV3c1tpXS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3JnYW5pc2F0aW9uc1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3R1ZGVudHNSZXF1ZXN0c1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsbE9yZ2FuaXNhdGlvbnNMaXN0QmxvY2tcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9QcmFjdGljZUNyZWF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbn07XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuVmlldy5wcm90b3R5cGUuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBmaW5pc2hCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLWZpbmlzaFwiKVswXTtcclxuICAgIGZpbmlzaEJ0bi5zZXRBdHRyaWJ1dGUoXCJvbmNsaWNrXCIsXHJcbiAgICAgICAgXCJtZXRyb0RpYWxvZy5vcGVuKCcjZGlhbG9nUHJhY3RpY2VDb21wbGV0ZVN1Y2Nlc3MnKVwiKTtcclxuICAgIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1Y2F0aW9uXCIpLnZhbHVlO1xyXG5cclxuICAgIGxldCB0eXBlUHJhY3RpY2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVQcmFjdGljZVwiKS52YWx1ZTtcclxuXHJcbiAgICBsZXQgbGVjTnVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWNOdW1cIikudmFsdWU7XHJcbiAgICBsZXQgZnJvbURhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZyb21EYXRlSW5wdXRcIikudmFsdWU7XHJcbiAgICBsZXQgdG9EYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVJbnB1dFwiKS52YWx1ZTtcclxuICAgIGxldCBkZWFkbGluZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVhZGxpbmVcIikudmFsdWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRlcm1zUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gJ2MgJyArIGZyb21EYXRlXHJcbiAgICAgICAgKyAnINC/0L4gJyArIHRvRGF0ZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVhZGxpbmVQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSBkZWFkbGluZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1Rlcm1zUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gZnJvbURhdGVcclxuICAgICAgICArICcgLSAnICsgdG9EYXRlO1xyXG4gICAgaWYgKGZyb21EYXRlID09PSBcIlwiKSB7XHJcbiAgICAgICAgZnJvbURhdGUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZnJvbURhdGUgPSBmcm9tRGF0ZS5zdWJzdHIoOCwgNCkgKyAnLScgKyBmcm9tRGF0ZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICAgICAgKyBmcm9tRGF0ZS5zdWJzdHIoMCwgMikgKyAnICcgKyAnMjE6MDA6MDAuMDAwICswMDowMCc7XHJcbiAgICB9XHJcbiAgICBpZiAodG9EYXRlID09PSBcIlwiKSB7XHJcbiAgICAgICAgdG9EYXRlID0gXCIyMDAwLTAxLTAxIDIxOjAwOjAwLjAwMCArMDA6MDBcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRvRGF0ZSA9IHRvRGF0ZS5zdWJzdHIoOCwgNCkgKyAnLScgKyB0b0RhdGUuc3Vic3RyKDQsIDIpICsgJy0nXHJcbiAgICAgICAgICAgICsgdG9EYXRlLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICAgIH1cclxuICAgIGlmIChkZWFkbGluZSA9PT0gXCJcIikge1xyXG4gICAgICAgIGRlYWRsaW5lID0gXCIyMDAwLTAxLTAxIDIxOjAwOjAwLjAwMCArMDA6MDBcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRlYWRsaW5lID0gZGVhZGxpbmUuc3Vic3RyKDgsIDQpICsgJy0nICsgZGVhZGxpbmUuc3Vic3RyKDQsIDIpICsgJy0nXHJcbiAgICAgICAgICAgICsgZGVhZGxpbmUuc3Vic3RyKDAsIDIpICsgJyAnICsgJzIxOjAwOjAwLjAwMCArMDA6MDAnO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0cmVlVmlldyA9IG51bGw7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwicHJhY3RpY2VcIikgIT09IC0xXHJcbiAgICAgICAgICAgICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXlcclxuICAgICAgICAgICAgPT09IFwiYmxvY2tcIikge1xyXG4gICAgICAgICAgICB0cmVlVmlldyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBhcnJHcm91cHMgPSB0aGlzLmdldFNlbGVjdGVkR3JvdXBzKHRyZWVWaWV3KTtcclxuICAgIGxldCBhcnJPcmdhbmlzYXRpb25zID0gdGhpcy5nZXRTZWxlY3RlZEdyb3VwcyhcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ2FuaXNhdGlvbnMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb25cIikpO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHlwZVByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IHR5cGVQcmFjdGljZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgIFwiZWR1Y2F0aW9uYWxMZXZlbERpYWxvZ1wiKS5pbm5lckhUTUwgPSBlZHVjYXRpb25MZXZlbDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JvdXBzUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gYXJyR3JvdXBzO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJvcmdhbmlzYXRpb25zUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gYXJyT3JnYW5pc2F0aW9ucztcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlXHJcbiAgICAgICAgKyBcIiDQv9GA0LDQutGC0LjQutCwXCI7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWNOdW1EaWFsb2dcIikuaW5uZXJIVE1MID0gbGVjTnVtO1xyXG4gICAgdGhpcy5QcmFjdGljZSA9IHtcclxuICAgICAgICAndHlwZVByYWN0aWNlJzogdHlwZVByYWN0aWNlLFxyXG4gICAgICAgICdzdGFydERhdGVQcmFjdGljZSc6IGZyb21EYXRlLFxyXG4gICAgICAgICdlbmREYXRlUHJhY3RpY2UnOiB0b0RhdGUsXHJcbiAgICAgICAgJ2RlYWRsaW5lUHJhY3RpY2UnOiBkZWFkbGluZSxcclxuICAgICAgICAnbGVjTnVtJzogbGVjTnVtLFxyXG4gICAgICAgICdlZHVMZXZlbCc6IGVkdWNhdGlvbkxldmVsLFxyXG4gICAgICAgICdvcmdhbmlzYXRpb25zJzogYXJyT3JnYW5pc2F0aW9ucyxcclxuICAgICAgICAnZ3JvdXBzJzogYXJyR3JvdXBzLFxyXG4gICAgICAgICd5ZWFyJzogdGhpcy5zZWxlY3RlZFllYXJcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuUHJhY3RpY2U7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5kaXNwbGF5R3JvdXBzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVjYXRpb25cIikudmFsdWU7XHJcbiAgICBpZiAoZWR1Y2F0aW9uTGV2ZWwgPT09IFwiYmFjaGVsb3JcIikge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJiYWNoZWxvclwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcImJhY2hlbG9yXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufTtcclxuVmlldy5wcm90b3R5cGUuY2xlYXJQcmFjdGljZVNlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZyb21EYXRlSW5wdXRcIikudmFsdWUgPSBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVJbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYWRsaW5lXCIpLnZhbHVlID0gXCJcIjtcclxufTtcclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNUVURFTlRTIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblZpZXcucHJvdG90eXBlLnJlbmRlckluZm8gPSBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBsZXQgc3RhcnRfeWVhciA9IHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDAsIDQpLFxyXG4gICAgICAgICAgICBzdGFydF9tb250aCA9IHByYWN0aWNlLnN0YXJ0X2RhdGVfcHJhY3RpY2Uuc3Vic3RyKDUsIDIpLFxyXG4gICAgICAgICAgICBzdGFydF9kYXkgPSBwcmFjdGljZS5zdGFydF9kYXRlX3ByYWN0aWNlLnN1YnN0cig4LCAyKSxcclxuICAgICAgICAgICAgZW5kX3llYXIgPSBwcmFjdGljZS5lbmRfZGF0ZV9wcmFjdGljZS5zdWJzdHIoMCwgNCksXHJcbiAgICAgICAgICAgIGVuZF9tb250aCA9IHByYWN0aWNlLmVuZF9kYXRlX3ByYWN0aWNlLnN1YnN0cig1LCAyKSxcclxuICAgICAgICAgICAgZW5kX2RheSA9IHByYWN0aWNlLmVuZF9kYXRlX3ByYWN0aWNlLnN1YnN0cig4LCAyKTtcclxuICAgICAgICBsZXQgc3RhcnRfZGF0ZSA9IHN0YXJ0X2RheSArICctJyArIHN0YXJ0X21vbnRoICsgJy0nICsgc3RhcnRfeWVhcjtcclxuICAgICAgICBsZXQgZW5kX2RhdGUgPSBlbmRfZGF5ICsgJy0nICsgZW5kX21vbnRoICsgJy0nICsgZW5kX3llYXI7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1Rlcm1zUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gJ9GBICdcclxuICAgICAgICAgICAgKyBzdGFydF9kYXRlICsgJyDQv9C+ICcgKyBlbmRfZGF0ZTtcclxuICAgICAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlKCk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgIFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBpbmZvX2Fib3V0X3ByYWN0aWNlLnR5cGVQcmFjdGljZVxyXG4gICAgICAgICAgICArICcg0L/RgNCw0LrRgtC40LrQsCc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gXCLQn9GA0LDQutGC0LjQutC4XCJcclxuICAgICAgICAgICAgKyBcIiDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1Rlcm1zUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gXCIgXCI7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXHJcbiAgICAgICAgXCJ0YWJjb250cm9sMlwiKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYWN0aXZlXCIpWzBdLmNoaWxkcmVuWzBdLnRleHQ7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VUYWJcIikudmFsdWU7XHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHtcclxuICAgICAgICAndHlwZVByYWN0aWNlJzogdHlwZVByYWN0aWNlLFxyXG4gICAgICAgICd5ZWFyJzogdGhpcy5zZWxlY3RlZFllYXIsXHJcbiAgICAgICAgJ2VkdV9sZXZlbCc6IGVkdWNhdGlvbkxldmVsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGluZm9fYWJvdXRfcHJhY3RpY2U7XHJcbn07XHJcblxyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0VXNlckluZm9BYm91dFByYWN0aWNlT3JnU2VjdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1TGV2ZWxPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlVGV4dCA9IFwi0KPRh9C10LHQvdCw0Y9cIjtcclxuICAgIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiZWR1Y2F0aW9uYWxcIikge1xyXG4gICAgICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiaW50ZXJuc2hpcFwiKSB7XHJcbiAgICAgICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0J/RgNC+0LjQt9Cy0L7QtNGB0YLQstC10L3QvdCw0Y9cIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJwcmVkaXBsb21hXCIpIHtcclxuICAgICAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQn9GA0LXQtNC00LjQv9C70L7QvNC90LDRj1wiO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0ge1xyXG4gICAgICAgICd0eXBlUHJhY3RpY2UnOiB0eXBlUHJhY3RpY2VUZXh0LFxyXG4gICAgICAgICd5ZWFyJzogdGhpcy5zZWxlY3RlZFllYXIsXHJcbiAgICAgICAgJ2VkdV9sZXZlbCc6IGVkdWNhdGlvbkxldmVsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGluZm9fYWJvdXRfcHJhY3RpY2U7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJUYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBpZiAoZGF0YSA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkNsZWFyVGFibGUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkNsZWFyVGFibGUoKTtcclxuICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5BZGREYXRhKGRhdGEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuY29sb3JUYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoZGF0YVtpXS5zdGF0dXMpIHtcclxuICAgICAgICAgICAgJCh0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKSkuYWRkQ2xhc3MoXCJhcHByb3ZlZF9zdHVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICAgICAgXCJzb3J0aW5nXzEgYXBwcm92ZWRfc3R1ZFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jaGFuZ2VZZWFyID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgIGlmIChzZWxlY3RlZEVsZW0pIHtcclxuICAgICAgICBzZWxlY3RlZEVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnY3VycmVudCcpO1xyXG4gICAgfVxyXG4gICAgc2VsZWN0ZWRFbGVtID0gbm9kZTtcclxuICAgIHNlbGVjdGVkRWxlbS5jbGFzc0xpc3QuYWRkKCdjdXJyZW50Jyk7XHJcbiAgICB0aGlzLnNlbGVjdGVkWWVhciA9IHNlbGVjdGVkRWxlbS5pbm5lckhUTUw7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVZZWFyID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgd2hpbGUgKHRhcmdldCAhPSBidXR0b25zQXJyYXkpIHtcclxuICAgICAgICBpZiAodGFyZ2V0LmNsYXNzTmFtZSA9PSAnaXRlbSB5ZWFyJykge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZVllYXIodGFyZ2V0KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRTZWxlY3RlZEdyb3VwcyA9IGZ1bmN0aW9uICh0cmVlVmlldykge1xyXG4gICAgaWYgKHRyZWVWaWV3ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBsZXQgZnJhbWVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImZyYW1lc1wiKVswXS5jaGlsZHJlbjtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZnJhbWVzW2ldLnN0eWxlLmRpc3BsYXkgPT0gXCJibG9ja1wiKSB7XHJcbiAgICAgICAgICAgICAgICB0cmVlVmlldyA9IGZyYW1lc1tpXS5jaGlsZHJlblswXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IEdyb3VwcyA9IFtdO1xyXG4gICAgbGV0IGxpTnVtYmVyID0gdHJlZVZpZXcucXVlcnlTZWxlY3RvckFsbCgnbGknKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlOdW1iZXIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZ3JvdXBzID0gbGlOdW1iZXJbaV0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXQ6Y2hlY2tlZCcpO1xyXG4gICAgICAgIGlmIChncm91cHMubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBncm91cCA9IGdyb3Vwc1tqXS5wYXJlbnRFbGVtZW50Lm5leHRFbGVtZW50U2libGluZy5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAuaW5kZXhPZihcItC60YPRgNGBXCIpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEdyb3Vwcy5wdXNoKGdyb3VwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBHcm91cHM7XHJcbn07XHJcblxyXG5mdW5jdGlvbiB0cmVlX2FkZF9sZWFmX2NoZWNrYm94X2V4YW1wbGVfY2xpY2sodHJlZSwgbm9kZSwgbmFtZUxlYWYpIHtcclxuICAgIHRyZWUuYWRkTGVhZihub2RlLCBuYW1lTGVhZiwge1xyXG4gICAgICAgIG1vZGU6ICdjaGVja2JveCcsXHJcbiAgICAgICAgY2hlY2tlZDogZmFsc2VcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlKSB7XHJcbiAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkTm9kZXM7XHJcbiAgICB3aGlsZSAoY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgICAgbm9kZS5yZW1vdmVDaGlsZChjaGlsZHJlblswXSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLmNsZWFyR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaWQgPSAwO1xyXG4gICAgd2hpbGUgKGlkIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgbGlBcnJheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICB0aGlzLmlkVHJlZVZpZXdzW2lkXSkuY2hpbGRyZW5bMF0uY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlbW92ZUNoaWxkcmVuKGxpQXJyYXlbaV0uZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3VsJylbMF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZCsrO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVHcm91cHNUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uIChjb3Vyc2VzKSB7XHJcbiAgICBsZXQgaWRDb3VudGVyID0gMCwgY291cnNlTnVtYmVyID0gYmFjaGVsb3JZZWFyLCBjbnQ7XHJcbiAgICBsZXQgY291cnNlc05hbWUgPSBbJ2ZpcnN0JywgJ3NlY29uZCcsICd0aGlyZCcsICdmb3VydGgnXTtcclxuICAgIHZhciBpID0gMDtcclxuICAgIHdoaWxlIChpZENvdW50ZXIgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aCkge1xyXG4gICAgICAgIHZhciB0cmVlID0gJChcIiNcIiArIHRoaXMuaWRUcmVlVmlld3NbaWRDb3VudGVyXSkuZGF0YShcInRyZWV2aWV3XCIpO1xyXG4gICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2lkQ291bnRlcl0uaW5kZXhPZihcIm1hc3RlclwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgY291cnNlTnVtYmVyID0gbWFzdGVyWWVhcjtcclxuICAgICAgICAgICAgaSA9IGJhY2hlbG9yWWVhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvdXJzZU51bWJlciA9IGJhY2hlbG9yWWVhcjtcclxuICAgICAgICAgICAgaSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNudCA9IDA7XHJcbiAgICAgICAgZm9yIChpOyBpIDwgY291cnNlTnVtYmVyOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb3Vyc2VzW2ldLmdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5vZGUgPSB0cmVlLmVsZW1lbnQuZmluZCgnbGkuJyArIGNvdXJzZXNOYW1lW2NudF0pO1xyXG4gICAgICAgICAgICAgICAgdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsIGNvdXJzZXNbaV0uZ3JvdXBzW2pdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjbnQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWRDb3VudGVyKys7XHJcbiAgICB9XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5nZXRDb25maWd1cmF0aW9uUHJhY3RpY2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJzZWxlY3RUeXBlUHJhY3RpY2VPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgICBsZXQgZWR1TGV2ZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdEVkdUxldmVsT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB7XHJcbiAgICAgICAgJ3R5cGVQcmFjdGljZSc6IHR5cGVQcmFjdGljZSxcclxuICAgICAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyLFxyXG4gICAgICAgICdlZHVfbGV2ZWwnOiBlZHVMZXZlbFxyXG4gICAgfTtcclxuICAgIHJldHVybiBpbmZvX2Fib3V0X3ByYWN0aWNlO1xyXG59O1xyXG5cclxuXHJcbmZ1bmN0aW9uIHRyZWVfYWRkX2xlYWZfY2hlY2tib3godHJlZSwgbm9kZSwgbmFtZUxlYWYsIGlkVHlwZU9yZ2FuaXNhdGlvbikge1xyXG4gICAgdHJlZS5hZGRMZWFmKG5vZGUsIG5hbWVMZWFmLCB7XHJcbiAgICAgICAgbW9kZTogJ2NoZWNrYm94JyxcclxuICAgICAgICBjaGVja2VkOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICBub2RlLmZpbmQoJ3VsJykuZmluZCgnbGknKS5sYXN0KClbMF0uc2V0QXR0cmlidXRlKFwiaWRcIiwgJ3R5cGVfb3JnXydcclxuICAgICAgICArIGlkVHlwZU9yZ2FuaXNhdGlvbik7XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLnNldFR5cGVzT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgICB2YXIgdHJlZVZpZXdPcmdhbmlzYXRpb25zID0gJChcclxuICAgICAgICBcIiNvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uXCIpLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHlwZXNPcmdhbmlzYXRpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgbm9kZSA9IHRyZWVWaWV3T3JnYW5pc2F0aW9ucy5lbGVtZW50LmZpbmQoJ2xpLm5vZGUnKTtcclxuICAgICAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94KHRyZWVWaWV3T3JnYW5pc2F0aW9ucywgbm9kZSxcclxuICAgICAgICAgICAgdHlwZXNPcmdhbmlzYXRpb25baV0ubmFtZSwgdHlwZXNPcmdhbmlzYXRpb25baV0uaWQpO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5jbGVhclR5cGVzT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGxpQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAnb3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbicpLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgcmVtb3ZlQ2hpbGRyZW4obGlBcnJheVtpXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSk7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnNldE9yZ2FuaXNhdGlvbnNJblRyZWVWaWV3ID0gZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgICB2YXIgdHJlZSA9ICQoXCIjb3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKS5kYXRhKFwidHJlZXZpZXdcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZ2FuaXNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHR5cGVzT3JnYW5pc2F0aW9uLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChvcmdhbmlzYXRpb25zW2ldLmlkX3R5cGVfb3JnYW5pc2F0aW9uID09PSB0eXBlc09yZ2FuaXNhdGlvbltqXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpQXJyID0gdHJlZS5lbGVtZW50LmZpbmQoJ2xpJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbGlBcnIubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGlBcnJba10uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09ICgndHlwZV9vcmdfJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyB0eXBlc09yZ2FuaXNhdGlvbltqXS5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9ICQobGlBcnJba10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94X2V4YW1wbGVfY2xpY2sodHJlZSwgbm9kZSxcclxuICAgICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0SW5mb05ld09yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlQ29tcGFueVwiKTtcclxuICAgIHZhciB0eXBlT3JnID0gZS5vcHRpb25zW2Uuc2VsZWN0ZWRJbmRleF0udGV4dDtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSB7XHJcbiAgICAgICAgJ25hbWUnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICd0eXBlT3JnJzogdHlwZU9yZyxcclxuICAgICAgICAnaW5mb09yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mb0NvbXBhbnlcIikudmFsdWUsXHJcbiAgICAgICAgJ2VtYWlsT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbWFpbE9yZ1wiKS52YWx1ZSxcclxuICAgICAgICAncGhvbmVPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBob25lT3JnXCIpLnZhbHVlLFxyXG4gICAgICAgICdwbGFjZXNPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYWNlc0NvbXBhbnlcIikudmFsdWUsXHJcbiAgICAgICAgJ2xvZ2luT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbkNvbXBhbnlcIikudmFsdWUsXHJcbiAgICAgICAgJ3Bzd2RPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBzd2RDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICdhZGRyZXNzT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGRyZXNzT3JnXCIpLnZhbHVlLFxyXG4gICAgICAgICdpZCc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRDb21wYW55XCIpLmlubmVySFRNTFxyXG4gICAgfTtcclxuICAgIHJldHVybiBvcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5zZXRUeXBlc09yZ2FuaXNhdGlvblNlbGVjdCA9IGZ1bmN0aW9uICh0eXBlc09yZ2FuaXNhdGlvbikge1xyXG4gICAgbGV0IHR5cGVPcmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlbGVjdFR5cGVDb21wYW55XCIpO1xyXG4gICAgcmVtb3ZlQ2hpbGRyZW4odHlwZU9yZyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHR5cGVzT3JnYW5pc2F0aW9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIG9wdGlvbi5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCB0eXBlc09yZ2FuaXNhdGlvbltpXS5pZCk7XHJcbiAgICAgICAgb3B0aW9uLmlubmVySFRNTCA9IHR5cGVzT3JnYW5pc2F0aW9uW2ldLm5hbWU7XHJcbiAgICAgICAgdHlwZU9yZy5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5zZXRPcmdhbmlzYXRpb25zTGlzdCA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb25zLCBpZExpc3QpIHtcclxuICAgIGxldCBsaXN0T3JnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWRMaXN0KTtcclxuICAgIHJlbW92ZUNoaWxkcmVuKGxpc3RPcmcpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcmdhbmlzYXRpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGRpdl9saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X2xpc3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0XCIpO1xyXG5cclxuICAgICAgICBsZXQgZGl2X2xpc3RfY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LWNvbnRlbnQgaW5saW5lLWJsb2NrXCIpO1xyXG4gICAgICAgIGlmIChpZExpc3QgPT09IFwib3JnYW5pc2F0aW9uTGlzdFwiKSB7XHJcbiAgICAgICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25DbGlja0Rpc3BsYXlJbmZvQWJvdXRPcmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHNwYW5fbGlzdF90aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXRpdGxlXCIpO1xyXG4gICAgICAgIHNwYW5fbGlzdF90aXRsZS5zZXRBdHRyaWJ1dGUoXCJpZF9vcmdhbmlzYXRpb25cIiwgb3JnYW5pc2F0aW9uc1tpXS5pZCk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLmlubmVySFRNTCA9IG9yZ2FuaXNhdGlvbnNbaV0ubmFtZTtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF90aXRsZSk7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3Rfc3VidGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3N1YnRpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1zdWJ0aXRsZVwiKTtcclxuICAgICAgICBzcGFuX2xpc3Rfc3VidGl0bGUuaW5uZXJIVE1MID0gJ9CS0YHQtdCz0L4g0LzQtdGB0YI6ICdcclxuICAgICAgICAgICAgKyBvcmdhbmlzYXRpb25zW2ldLm1heF9zdHVkZW50c19udW1iZXI7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5hcHBlbmRDaGlsZChzcGFuX2xpc3Rfc3VidGl0bGUpO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl9saXN0X3JlbWFyayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3RfcmVtYXJrLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC1yZW1hcmtcIik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3JlbWFyay5pbm5lckhUTUwgPSAn0J7RgdGC0LDQu9C+0YHRjDogJ1xyXG4gICAgICAgICAgICArIG9yZ2FuaXNhdGlvbnNbaV0ubWF4X3N0dWRlbnRzX251bWJlcjtcclxuICAgICAgICAvKtCe0JHQr9CX0JDQotCV0JvQrNCd0J4g0JjQodCf0KDQkNCS0JjQotCsINCd0JAg0JrQntCb0JjQp9CV0KHQotCS0J4g0J7QodCi0JDQktCo0JjQpdCh0K8g0JzQldCh0KIuISEhISEhISEhISEhISEhISEhISEhISEhISEhKi9cclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9yZW1hcmspO1xyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfbGlzdF9jb250ZW50KTtcclxuXHJcbiAgICAgICAgbGV0IGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICAgIFwiaW5saW5lLWJsb2NrIGxpc3QtY29udGVudCBzZXR0aW5nc09yZ2FuaXNhdGlvblwiKTtcclxuXHJcbiAgICAgICAgbGV0IHNwYW5fdXNlcl9wbHVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fdXNlcl9wbHVzLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsXHJcbiAgICAgICAgICAgIFwibWlmLXVzZXItcGx1cyBtaWYtbGcgZmctZ3JheSBhZGQtc3R1ZGVudC1vcmdhbmlzYXRpb25cIik7XHJcbiAgICAgICAgLy9zcGFuX3VzZXJfcGx1cy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5hZGRTdHVkZW50VG9PcmdhbmlzYXRpb24oKSk7XHJcbiAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX3VzZXJfcGx1cyk7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX3BlbmNpbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX3BlbmNpbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLFxyXG4gICAgICAgICAgICBcIm1pZi1wZW5jaWwgbWlmLWxnIGZnLWdyYXkgZWRpdC1vcmdhbmlzYXRpb25cIik7XHJcbiAgICAgICAgc3Bhbl9wZW5jaWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMub25DbGlja0VkaXRPcmdhbmlzYXRpb24pO1xyXG4gICAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uYXBwZW5kQ2hpbGQoc3Bhbl9wZW5jaWwpO1xyXG5cclxuICAgICAgICAvKiBsZXQgc3Bhbl9jYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgIHNwYW5fY2FuY2VsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibWlmLWNhbmNlbCBtaWYtbGcgZmcteWVsbG93XCIpO1xyXG4gICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fY2FuY2VsKTsqL1xyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uKTtcclxuXHJcbiAgICAgICAgbGlzdE9yZy5hcHBlbmRDaGlsZChkaXZfbGlzdCk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5nZXRJZE9yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IGlkT3JnYW5pc2F0aW9uPTA7XHJcbiAgICBpZihldmVudC50YXJnZXQuaWQ9PT1cInVwZGF0ZU9yZ2FuaXNhdGlvblwiKXtcclxuICAgICAgICBpZE9yZ2FuaXNhdGlvbj0gICArZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0uY2hpbGRyZW5bMl0uaW5uZXJIVE1MO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICBpZE9yZ2FuaXNhdGlvbiA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uZ2V0QXR0cmlidXRlKFwiaWRfb3JnYW5pc2F0aW9uXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlkT3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuc2hvd0RpYWxvZ09yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmFtZUNvbXBhbnlcIikudmFsdWUgPSBvcmdhbmlzYXRpb24ubmFtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaWRDb21wYW55XCIpLmlubmVySFRNTCA9IG9yZ2FuaXNhdGlvbi5pZDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mb0NvbXBhbnlcIikudmFsdWUgPSBvcmdhbmlzYXRpb24uaW5mb19vcmdhbmlzYXRpb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBob25lT3JnXCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLnBob25lX29yZ2FuaXNhdGlvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1haWxPcmdcIikudmFsdWUgPSBvcmdhbmlzYXRpb24uZW1haWxfb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGRyZXNzT3JnXCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLmFkZHJlc3Nfb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGFjZXNDb21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLm1heF9zdHVkZW50c19udW1iZXI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luQ29tcGFueVwiKS52YWx1ZSA9IG9yZ2FuaXNhdGlvbi5sb2dpbl9vcmdhbmlzYXRpb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBzd2RDb21wYW55XCIpLnZhbHVlID0gb3JnYW5pc2F0aW9uLnBzd2Rfb3JnYW5pc2F0aW9uO1xyXG4gICAgbWV0cm9EaWFsb2cub3BlbignI2RpYWxvZ0NyZWF0ZUNvbXBhbnknKTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZU9yZ2FuaXNhdGlvblRpdGxlID0gZnVuY3Rpb24gKG5hbWVPcmdhbmlzYXRpb24sIGFwcHJvdmVkX3N0dWRlbnRfY291bnQsIG5vbl9hcHByb3ZlZF9zdHVkZW50X2NvdW50KSB7XHJcbiAgICBpZiAoYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9PT0gMCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibm9uQXBwcm92ZWRTdHVkZW50TGlzdFRpdGxlXCIpLmlubmVySFRNTCA9IFwiLCDQv9GD0YHRglwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJub25BcHByb3ZlZFN0dWRlbnRMaXN0VGl0bGVcIikuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnTmFtZVwiKS5pbm5lckhUTUwgPSBuYW1lT3JnYW5pc2F0aW9uO1xyXG5cclxuICAgIGlmIChub25fYXBwcm92ZWRfc3R1ZGVudF9jb3VudCA9PT0gMCkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXBwcm92ZWRTdHVkZW50TGlzdFRpdGxlXCIpLmlubmVySFRNTCA9IFwi0KHQv9C40YHQvtC6INGD0YLQstC10YDQttC00LXQvdC90YvRhSDRgdGC0YPQtNC10L3RgtC+0LIg0L/Rg9GB0YIuXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFwcHJvdmVkU3R1ZGVudExpc3RUaXRsZVwiKS5pbm5lckhUTUwgPSBcItCh0L/QuNGB0L7QuiDRg9GC0LLQtdGA0LbQtNC10L3QvdGL0YUg0YHRgtGD0LTQtdC90YLQvtCyLlwiO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRPcmdhbmlzYXRpb24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGxldCBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUgPT0gXCJsaXN0LWNvbnRlbnQgaW5saW5lLWJsb2NrXCIpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICBsZXQgbmFtZU9yZ2FuaXNhdGlvbkNsaWNrID0gZWxlbWVudC5jaGlsZHJlblswXS5pbm5lckhUTUw7XHJcbiAgICByZXR1cm4gbmFtZU9yZ2FuaXNhdGlvbkNsaWNrO1xyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5nZXROYW1lT3JnYW5pc2F0aW9uQnlUaXRsZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ05hbWVcIikuaW5uZXJIVE1MO1xyXG59O1xyXG5WaWV3LnByb3RvdHlwZS51cGRhdGVTdHVkZW50c0xpc3RWaWV3ID0gZnVuY3Rpb24gKHN0dWRlbnRzLCBpZExpc3QpIHtcclxuICAgIGxldCBsaXN0U3R1ZGVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZExpc3QpO1xyXG4gICAgcmVtb3ZlQ2hpbGRyZW4obGlzdFN0dWRlbnRzKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZGl2X2xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfbGlzdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3RcIik7XHJcblxyXG4gICAgICAgIGxldCBkaXZfbGlzdF9jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtY29udGVudCBpbmxpbmUtYmxvY2tcIik7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3RfdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC10aXRsZVwiKTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwicmVxdWVzdFwiLCBzdHVkZW50c1tpXS5pZF9yZXF1ZXN0KTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwidWlkXCIsIHN0dWRlbnRzW2ldLnVpZF9zdHVkZW50KTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuc2V0QXR0cmlidXRlKFwib3JnXCIsIHN0dWRlbnRzW2ldLmlkX29yZ2FuaXNhdGlvbik7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLmlubmVySFRNTCA9IHN0dWRlbnRzW2ldLmRpc3BsYXlOYW1lO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3RpdGxlKTtcclxuXHJcbiAgICAgICAgbGV0IHNwYW5fbGlzdF9zdWJ0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3Rfc3VidGl0bGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXN1YnRpdGxlXCIpO1xyXG4gICAgICAgIHNwYW5fbGlzdF9zdWJ0aXRsZS5pbm5lckhUTUwgPSBzdHVkZW50c1tpXS5ncm91cF9uYW1lO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3N1YnRpdGxlKTtcclxuXHJcbiAgICAgICAgbGV0IHllYXIgPSBzdHVkZW50c1tpXS5kYXRlX2NyZWF0aW9uX3JlcXVlc3Quc3Vic3RyKDAsIDQpLFxyXG4gICAgICAgICAgICBtb250aCA9IHN0dWRlbnRzW2ldLmRhdGVfY3JlYXRpb25fcmVxdWVzdC5zdWJzdHIoNSwgMiksXHJcbiAgICAgICAgICAgIGRheSA9IHN0dWRlbnRzW2ldLmRhdGVfY3JlYXRpb25fcmVxdWVzdC5zdWJzdHIoOCwgMik7XHJcbiAgICAgICAgbGV0IGRhdGUgPSBkYXkgKyAnLScgKyBtb250aCArICctJyArIHllYXI7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3RfcmVtYXJrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fbGlzdF9yZW1hcmsuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXJlbWFya1wiKTtcclxuICAgICAgICBzcGFuX2xpc3RfcmVtYXJrLmlubmVySFRNTCA9ICfQlNCw0YLQsCDQt9Cw0L/QuNGB0Lg6ICcgKyBkYXRlO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3JlbWFyayk7XHJcblxyXG5cclxuICAgICAgICBkaXZfbGlzdC5hcHBlbmRDaGlsZChkaXZfbGlzdF9jb250ZW50KTtcclxuXHJcbiAgICAgICAgbGV0IGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaW5saW5lLWJsb2NrIGxpc3QtY29udGVudCBzZXR0aW5nc09yZ2FuaXNhdGlvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKGlkTGlzdCAhPT0gXCJhcHByb3ZlZFN0dWRlbnRzXCIpIHtcclxuICAgICAgICAgICAgbGV0IHNwYW5fc3R1ZGVudF9hcHByb3ZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICBzcGFuX3N0dWRlbnRfYXBwcm92ZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1pZi1jaGVja21hcmsgbWlmLWxnIGZnLWdyZWVuXCIpO1xyXG4gICAgICAgICAgICBzcGFuX3N0dWRlbnRfYXBwcm92ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkNsaWNrQXBwcm92ZVN0dWRlbnQpO1xyXG4gICAgICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fc3R1ZGVudF9hcHByb3ZlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBzcGFuX3N0dWRlbnRfcmVqZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fc3R1ZGVudF9yZWplY3Quc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtaWYtY2FuY2VsIG1pZi1sZyBmZy1yZWRcIik7XHJcbiAgICAgICAgc3Bhbl9zdHVkZW50X3JlamVjdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkNsaWNrUmVqZWN0U3R1ZGVudCk7XHJcbiAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX3N0dWRlbnRfcmVqZWN0KTtcclxuXHJcbiAgICAgICAgZGl2X2xpc3QuYXBwZW5kQ2hpbGQoZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbik7XHJcblxyXG4gICAgICAgIGxpc3RTdHVkZW50cy5hcHBlbmRDaGlsZChkaXZfbGlzdCk7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsbE9yZ2FuaXNhdGlvbnNMaXN0QmxvY2tcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkZW50c1JlcXVlc3RzXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn07XHJcblxyXG5cclxuVmlldy5wcm90b3R5cGUucmVuZGVyT3JnYW5pc2F0aW9uU2VjdGlvbiA9IGZ1bmN0aW9uIChwcmFjdGljZSkge1xyXG4gICAgbGV0IHRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9yZ2FuaXNhdGlvbkxpc3RDdXJyZW50UHJhY3RpY2VUZXh0XCIpO1xyXG4gICAgaWYgKHByYWN0aWNlLmxlbmd0aCAhPT0gMCkge1xyXG4gICAgICAgIHRleHQuaW5uZXJIVE1MID0gXCLQodC/0LjRgdC+0Log0L7RgNCz0LDQvdC40LfQsNGG0LjQuSDQsiDQv9GA0LDQutGC0LjQutC1XCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0ZXh0LmlubmVySFRNTCA9IFwi0J/RgNCw0LrRgtC40LrQuCDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuT3Blbk9yQ2xvc2VMb2FkSW1hZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgZGlzcGxheSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZFwiKS5zdHlsZS5kaXNwbGF5O1xyXG4gICAgaWYgKGRpc3BsYXkgPT09IFwiYmxvY2tcIikge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRTdHVkZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBsZXQgc3R1ZGVudCA9IHtcclxuICAgICAgICAnaWRfcmVxdWVzdCc6IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uY2hpbGRyZW5bMF0uZ2V0QXR0cmlidXRlKFwicmVxdWVzdFwiKSxcclxuICAgICAgICAndWlkX3N0dWRlbnQnOiBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmdldEF0dHJpYnV0ZShcInVpZFwiKSxcclxuICAgICAgICAnaWRfb3JnYW5pc2F0aW9uJzogZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5jaGlsZHJlblswXS5nZXRBdHRyaWJ1dGUoXCJvcmdcIiksXHJcbiAgICAgICAgJ25hbWVfb3JnYW5pc2F0aW9uJzogZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5jaGlsZHJlblswXS5nZXRBdHRyaWJ1dGUoXCJuYW1lLW9yZ1wiKSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gc3R1ZGVudDtcclxufTtcclxuVmlldy5wcm90b3R5cGUuc2V0WWVhcnNBcnJheSA9IGZ1bmN0aW9uICh5ZWFycykge1xyXG4gICAgbGV0IGJ1dHRvbkFycmF5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidXR0b25zQXJyYXlcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHllYXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIml0ZW0geWVhclwiKTtcclxuICAgICAgICBzcGFuLmlubmVySFRNTCA9IHllYXJzW2ldO1xyXG4gICAgICAgIGJ1dHRvbkFycmF5LmFwcGVuZENoaWxkKHNwYW4pO1xyXG4gICAgfVxyXG4gICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICBzcGFuLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiaXRlbSB5ZWFyXCIpO1xyXG4gICAgc3Bhbi5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImNyZWF0ZVByYWN0aWNlQnRuXCIpO1xyXG4gICAgc3Bhbi5pbm5lckhUTUwgPSBcIitcIjtcclxuICAgIGJ1dHRvbkFycmF5LmFwcGVuZENoaWxkKHNwYW4pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVQcmFjdGljZUJ0blwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UpO1xyXG59O1xyXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXc7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvVmlldy5qcyIsImNvbnN0IFNFUFRFTUJFUiA9IDk7XHJcbmNvbnN0IGZpcnN0Q291cnNlID0gMDtcclxuY29uc3Qgc2Vjb25kQ291cnNlID0gMTtcclxuY29uc3QgdGhpcmRDb3Vyc2UgPSAyO1xyXG5jb25zdCBmb3VydGhDb3Vyc2UgPSAzO1xyXG5jb25zdCBtYXN0ZXJGaXJzdENvdXJzZSA9IDQ7XHJcbmNvbnN0IG1hc3RlclNlY29uZENvdXJzZSA9IDU7XHJcblxyXG52YXIgTW9kZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLkdyb3VwcyA9IFtdO1xyXG4gICAgdGhpcy5TdHVkZW50cyA9IFtdO1xyXG4gICAgdGhpcy5Db3Vyc2VzID0gW107XHJcbiAgICB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uID0gW107XHJcbiAgICB0aGlzLk9yZ2FuaXNhdGlvbnMgPSBbXTtcclxufTtcclxuXHJcbmNsYXNzIENvdXJzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lQ291cnNlKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lQ291cnNlID0gbmFtZUNvdXJzZTtcclxuICAgICAgICB0aGlzLmdyb3VwcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEdyb3VwKGdyb3VwKSB7XHJcbiAgICAgICAgdGhpcy5ncm91cHMucHVzaChncm91cCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEdyb3VwIHtcclxuICAgIGNvbnN0cnVjdG9yKHVpZF9MREFQLCBuYW1lR3JvdXApIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lR3JvdXA7XHJcbiAgICAgICAgdGhpcy51aWRfTERBUCA9IHVpZF9MREFQO1xyXG4gICAgICAgIHRoaXMuc3R1ZGVudHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRTdHVkZW50KHN0dWRlbnQpIHtcclxuICAgICAgICB0aGlzLnN0dWRlbnRzLnB1c2goc3R1ZGVudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1TVFVERU5UUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0RGF0YSA9IGFzeW5jIGZ1bmN0aW9uIChzZWxlY3RlZEdyb3VwcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucykge1xyXG4gICAgbGV0IGRhdGEgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7ICsraikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyArK2ssICsrbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpc1N0dWRlbnRBcHBseSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEucHVzaCh7Z3JvdXA6IHRoaXMuR3JvdXBzW2ldLm5hbWV9KTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLm9yZ2FuaXNhdGlvbiA9ICcgJztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB3ID0gMDsgdyA8IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMubGVuZ3RoOyArK3cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbiA9IDA7IG4gPCByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddLmxlbmd0aDsgKytuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfcmVxdWVzdCA9PT0gK3JlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0uaWRfcmVxdWVzdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50X1VJRCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLnVpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5pZF9zdGF0dXMgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdGF0dXMgPSByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLmlkX3N0YXR1cztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gPSByZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLm5hbWVfb3JnYW5pc2F0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1N0dWRlbnRBcHBseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gKz0gcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5uYW1lX29yZ2FuaXNhdGlvbiArICcsICc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU3R1ZGVudEFwcGx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc1N0dWRlbnRBcHBseSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnRfVUlEID0gdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10udWlkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLm9yZ2FuaXNhdGlvbiA9IFwi0J3QtSDQt9Cw0L/QuNGB0LDQu9GB0Y9cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRHcm91cHMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcm94eS9jb3JlL3YxL2dyb3VwcycpO1xyXG4gICAgbGV0IGxpc3QgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgbGV0IGdyb3VwcyA9IGxpc3QuX2VtYmVkZGVkLmdyb3VwcztcclxuICAgIHJldHVybiBncm91cHM7XHJcbn07XHJcblxyXG4vKtC/0L7Qu9GD0YfQsNC10Lwg0YHRgtGD0LTQtdC90YLQvtCyINC40Lcg0YXRgNCw0L3QuNC70LjRidCwIExEQVAg0L/QviBJRCDQs9GA0YPQv9C/0YsqL1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0U3R1ZGVudHNCeUdyb3VwSWQgPSBhc3luYyBmdW5jdGlvbiAoZ3JvdXBJRCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJveHkvY29yZS92MS9ncm91cHMvJyArIGdyb3VwSUQpO1xyXG4gICAgbGV0IGxpc3QgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgbGV0IHN0dWRlbnRzTGlzdCA9IGxpc3QuX2VtYmVkZGVkLnN0dWRlbnRzO1xyXG4gICAgcmV0dXJuIHN0dWRlbnRzTGlzdDtcclxufTtcclxuXHJcbi8q0L/QvtC70YPRh9Cw0LXQvCDRgdGC0YPQtNC10L3RgtC+0LIg0LjQtyDRhdGA0LDQvdC40LvQuNGJ0LAgTERBUCDQv9C+IFVJRCAqL1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0U3R1ZGVudHNCeVVJRCA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50c19pbmZvKSB7XHJcbiAgICBsZXQgc3R1ZGVudHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwLCBuID0gMDsgaSA8IHN0dWRlbnRzX2luZm8ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcm94eS9jb3JlL3YxL3Blb3BsZS8nICsgc3R1ZGVudHNfaW5mb1tpXS51aWRfc3R1ZGVudCk7XHJcbiAgICAgICAgbGV0IGxpc3QgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgICAgIHN0dWRlbnRzLnB1c2goe1xyXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogbGlzdC5kaXNwbGF5TmFtZSxcclxuICAgICAgICAgICAgZ3JvdXBfbmFtZTogbGlzdC5fbGlua3MuZ3JvdXBzWzBdLm5hbWUsXHJcbiAgICAgICAgICAgIGdyb3VwX1VJRDogbGlzdC5fbGlua3MuZ3JvdXBzWzBdLmlkLFxyXG4gICAgICAgICAgICBkYXRlX2NyZWF0aW9uX3JlcXVlc3Q6IHN0dWRlbnRzX2luZm9baV0uZGF0ZV9jcmVhdGlvbixcclxuICAgICAgICAgICAgaWRfcmVxdWVzdDogc3R1ZGVudHNfaW5mb1tpXS5pZF9yZXF1ZXN0LFxyXG4gICAgICAgICAgICB1aWRfc3R1ZGVudDogc3R1ZGVudHNfaW5mb1tpXS51aWRfc3R1ZGVudCxcclxuICAgICAgICAgICAgaWRfb3JnYW5pc2F0aW9uOiBzdHVkZW50c19pbmZvW2ldLmlkX29yZ2FuaXNhdGlvblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0dWRlbnRzO1xyXG59O1xyXG5cclxuLyrQv9C+0LvRg9GH0LDQtdC8INCz0YDRg9C/0L/RiyDQuCDQuNGFINGB0YLRg9C00LXQvdGC0L7QsiDQuNC3INGF0YDQsNC90LjQu9C40YnQsCBMREFQLCDQvtCx0L3QvtCy0LvRj9C10Lwg0YLQsNCx0LvQuNGG0YMgU3R1ZGVudHMqL1xyXG5Nb2RlbC5wcm90b3R5cGUuaW5pdCA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBncm91cHMgPSBhd2FpdCB0aGlzLmdldEdyb3VwcygpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5Hcm91cHMucHVzaChuZXcgR3JvdXAoZ3JvdXBzW2ldLmlkLCBncm91cHNbaV0ubmFtZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwLCBuID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgbGV0IHN0dWRlbnRzTGlzdCA9IGF3YWl0IHRoaXMuZ2V0U3R1ZGVudHNCeUdyb3VwSWQodGhpcy5Hcm91cHNbaV0udWlkX0xEQVApO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc3R1ZGVudHNMaXN0Lmxlbmd0aDsgKytqLCBuKyspIHtcclxuICAgICAgICAgICAgbGV0IHN0dWRlbnQgPSB7XHJcbiAgICAgICAgICAgICAgICAnbmFtZSc6IHN0dWRlbnRzTGlzdFtqXS5kaXNwbGF5TmFtZSxcclxuICAgICAgICAgICAgICAgICd1aWQnOiBzdHVkZW50c0xpc3Rbal0udWlkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuR3JvdXBzW2ldLmFkZFN0dWRlbnQoc3R1ZGVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vYXdhaXQgdGhpcy5jcmVhdGVPclVwZGF0ZVN0dWRlbnRzKHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzKTtcclxuICAgIH1cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRDdXJyZW50WWVhciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBkYXRlID0gbmV3IERhdGUoKTtcclxuICAgIGxldCBjdXJyZW50WWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKS50b1N0cmluZygpO1xyXG4gICAgcmV0dXJuIGN1cnJlbnRZZWFyO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmRpc3RyaWJ1dGVHcm91cHNCeUNvdXJzZXMgPSBhc3luYyBmdW5jdGlvbiAoY3VycmVudFllYXIpIHtcclxuICAgIHRoaXMuQ291cnNlcyA9IFtcclxuICAgICAgICBuZXcgQ291cnNlKCcxJyksXHJcbiAgICAgICAgbmV3IENvdXJzZSgnMicpLFxyXG4gICAgICAgIG5ldyBDb3Vyc2UoJzMnKSxcclxuICAgICAgICBuZXcgQ291cnNlKCc0JyksXHJcbiAgICAgICAgbmV3IENvdXJzZSgnMSAo0LzQsyknKSxcclxuICAgICAgICBuZXcgQ291cnNlKCcyICjQvNCzKScpXHJcbiAgICBdO1xyXG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IGN1cnJlbnRNb250aCA9IGRhdGUuZ2V0TW9udGgoKTtcclxuICAgIGlmICgrY3VycmVudE1vbnRoIDwgU0VQVEVNQkVSKSB7XHJcbiAgICAgICAgY3VycmVudFllYXIgLT0gMTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ291cnNlc1ttYXN0ZXJGaXJzdENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNvdXJzZXNbZmlyc3RDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRZZWFyLS07XHJcbiAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ291cnNlc1ttYXN0ZXJTZWNvbmRDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Db3Vyc2VzW3NlY29uZENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudFllYXItLTtcclxuICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Db3Vyc2VzW3RoaXJkQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNvdXJzZXNbZm91cnRoQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50WWVhciArPSAzO1xyXG4gICAgfVxyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UHJhY3RpY2UgPSBhc3luYyBmdW5jdGlvbiAoaW5mb19hYm91dF9wcmFjdGljZSkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGluZm9fYWJvdXRfcHJhY3RpY2UgPSBcIj95ZWFyPVwiICsgaW5mb19hYm91dF9wcmFjdGljZS55ZWFyICsgXCImZWR1X2xldmVsPVwiXHJcbiAgICAgICAgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLmVkdV9sZXZlbCArIFwiJnR5cGVQcmFjdGljZT1cIlxyXG4gICAgICAgICsgaW5mb19hYm91dF9wcmFjdGljZS50eXBlUHJhY3RpY2U7XHJcbiAgICBsZXQgaW5mbyA9IDA7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZScgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLCBwYXJhbXMpXHJcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGluZm8gPSByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIHJldHVybiBpbmZvO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldFJlcXVlc3RzID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlLCBncm91cHMpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgcmVxdWVzdHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgbGV0IGluZm8gPSAnP2lkX3N0dWRlbnQ9JyArIGdyb3Vwc1tpXS5zdHVkZW50c1tqXS51aWQgKyBcIiZpZF9wcmFjdGljZT1cIlxyXG4gICAgICAgICAgICAgICAgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvZmlsdGVyLXJlcXVzdHMnICsgaW5mbywgcGFyYW1zKTtcclxuICAgICAgICAgICAgaW5mbyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3RzLnB1c2goaW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcXVlc3RzOy8v0L/QvtC70YPRh9C40LvQuCBhbGwg0LfQsNGP0LLQvtC6INGB0YLRg9C00LXQvdGC0L7QsiDQstGL0LHRgNCw0L3QvdGL0YUg0LPRgNGD0L/Qv1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmFzc29zaWF0ZVJlcXVlc3RUb1N0dWRlbnQgPSBhc3luYyBmdW5jdGlvbiAocmVxdWVzdHMsIGdyb3Vwcykge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzLmxlbmd0aDsgKytqKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lID09PSBncm91cHNbal0pIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyArK2spIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBuID0gMDsgbiA8IHJlcXVlc3RzLmxlbmd0aDsgKytuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS51aWQgPT09IHJlcXVlc3RzW25dLnVpZF9zdHVkZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9yZXF1ZXN0ID0gcmVxdWVzdHNbbl0uaWRfcmVxdWVzdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0c1tuXS5pZF9vcmdhbmlzYXRpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5pZF9vcmdhbmlzYXRpb24gPSByZXF1ZXN0c1tuXS5pZF9vcmdhbmlzYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdHNPcmdhbmlzYXRpb25zID0gYXN5bmMgZnVuY3Rpb24gKHNlbGVjdGVkR3JvdXBzKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbnNfYnlfcmVxdWVzdCA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLmxlbmd0aDsgKytrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZm8gPSAnP2lkX3JlcXVlc3Q9JyArIHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLmlkX3JlcXVlc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9ucy1ieS1yZXF1ZXN0JyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mbyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pc2F0aW9uc19ieV9yZXF1ZXN0LnB1c2goaW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uc19ieV9yZXF1ZXN0O1xyXG59O1xyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UHJhY3RpY2VZZWFycyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3llYXJzLXByYWN0aWNlJyk7XHJcbiAgICBsZXQgeWVhcnMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgcmV0dXJuIHllYXJzO1xyXG59O1xyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09UFJBQ1RJQ0UgQ1JFQVRJT05cclxuIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRUeXBlc09yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSBbXTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3R5cGVzLW9yZ2FuaXNhdGlvbicpO1xyXG4gICAgbGV0IHR5cGVzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHRoaXMudHlwZXNPcmdhbmlzYXRpb24gPSB0eXBlcztcclxuICAgIHJldHVybiB0aGlzLnR5cGVzT3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb25zJyk7XHJcbiAgICBsZXQgb3JncyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICB0aGlzLk9yZ2FuaXNhdGlvbnMgPSBvcmdzO1xyXG4gICAgcmV0dXJuIHRoaXMuT3JnYW5pc2F0aW9ucztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25zQnlQcmFjdGljZUlkID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAnP2lkX3ByYWN0aWNlPScgKyBwcmFjdGljZS5pZF9wcmFjdGljZTtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbnMtYnktcHJhY3RpY2UnICsgaW5mbywgcGFyYW1zKTtcclxuICAgIGxldCBvcmdhbmlzYXRpb25zID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHJldHVybiBvcmdhbmlzYXRpb25zO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbkJ5SWQgPSBhc3luYyBmdW5jdGlvbiAoaWQpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9ICc/aWQ9JyArIGlkO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9uLWJ5LWlkJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHJldHVybiBvcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdHNCeU9yZ2FuaXNhdGlvbk5hbWUgPSBhc3luYyBmdW5jdGlvbiAobmFtZU9yZ2FuaXNhdGlvbiwgcHJhY3RpY2UpIHtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLmdldE9yZ2FuaXNhdGlvbkJ5TmFtZShuYW1lT3JnYW5pc2F0aW9uKTtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9IFwiP2lkX3ByYWN0aWNlPVwiICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9yZXF1ZXN0cy1ieS1wcmFjdGljZScgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgbGV0IHJlcXVlc3RzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIGxldCBzdHVkZW50cyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZXF1ZXN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBpbmZvID0gXCI/aWRfcmVxdWVzdD1cIiArIHJlcXVlc3RzW2ldLmlkX3JlcXVlc3QgKyBcIiZpZF9vcmdhbmlzYXRpb249XCJcclxuICAgICAgICAgICAgKyBvcmdhbmlzYXRpb24uaWQ7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvZXhpc3QtcmVxdWVzdCcgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgICAgIGlmIChyZXN1bHQuc3RhdHVzICE9PSA0MDQpIHsvLy/QntCo0JjQkdCa0JAg0JIg0JrQntCd0J7QodCb0JggTk9UIEZPVU5EXHJcbiAgICAgICAgICAgIGxldCBkYXRhID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgICAgICAgICAgaWYgKGRhdGEuaWRfc3RhdHVzID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBzdHVkZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBpZF9yZXF1ZXN0OiBkYXRhLmlkX3JlcXVlc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgaWRfb3JnYW5pc2F0aW9uOiBkYXRhLmlkX29yZ2FuaXNhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBpZF9zdGF0dXM6IGRhdGEuaWRfc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgIHVpZF9zdHVkZW50OiByZXF1ZXN0c1tpXS51aWRfc3R1ZGVudCxcclxuICAgICAgICAgICAgICAgICAgICBpZF9wcmFjdGljZTogcmVxdWVzdHNbaV0uaWRfcHJhY3RpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaWRfcmV2aWV3OiByZXF1ZXN0c1tpXS5pZF9yZXZpZXcsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZV9jcmVhdGlvbjogZGF0YS5kYXRlX2NyZWF0aW9uXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBzdHVkZW50cztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRBcHByb3ZlZFN0dWRlbnRzID0gYXN5bmMgZnVuY3Rpb24gKG5hbWVPcmdhbmlzYXRpb24sIHByYWN0aWNlKSB7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uID0gYXdhaXQgdGhpcy5nZXRPcmdhbmlzYXRpb25CeU5hbWUobmFtZU9yZ2FuaXNhdGlvbik7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSBcIj9pZF9wcmFjdGljZT1cIiArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcmVxdWVzdHMtYnktcHJhY3RpY2UnICsgaW5mbywgcGFyYW1zKTtcclxuICAgIGxldCByZXF1ZXN0cyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICBsZXQgc3R1ZGVudHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVxdWVzdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAocmVxdWVzdHNbaV0uaWRfb3JnYW5pc2F0aW9uID09IG9yZ2FuaXNhdGlvbi5pZCkge1xyXG4gICAgICAgICAgICBzdHVkZW50cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkX3JlcXVlc3Q6IHJlcXVlc3RzW2ldLmlkX3JlcXVlc3QsXHJcbiAgICAgICAgICAgICAgICBpZF9vcmdhbmlzYXRpb246IHJlcXVlc3RzW2ldLmlkX29yZ2FuaXNhdGlvbixcclxuICAgICAgICAgICAgICAgIHVpZF9zdHVkZW50OiByZXF1ZXN0c1tpXS51aWRfc3R1ZGVudCxcclxuICAgICAgICAgICAgICAgIGlkX3ByYWN0aWNlOiByZXF1ZXN0c1tpXS5pZF9wcmFjdGljZSxcclxuICAgICAgICAgICAgICAgIGlkX3JldmlldzogcmVxdWVzdHNbaV0uaWRfcmV2aWV3XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R1ZGVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpbmZvID0gXCI/aWRfcmVxdWVzdD1cIiArIHN0dWRlbnRzW2ldLmlkX3JlcXVlc3QgKyBcIiZpZF9vcmdhbmlzYXRpb249XCIgKyBzdHVkZW50c1tpXS5pZF9vcmdhbmlzYXRpb247XHJcbiAgICAgICAgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9leGlzdC1yZXF1ZXN0JyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgIT09IDQwNCkge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICAgICAgICAgIHN0dWRlbnRzW2ldLmRhdGVfY3JlYXRpb24gPSBkYXRhLmRhdGVfY3JlYXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0dWRlbnRzO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldERldGVybWluZWRHcm91cHMgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICAgIGxldCBkZXRlcm1pbmVkR3JvdXBzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICAgICAgICAgIGRldGVybWluZWRHcm91cHMucHVzaCh0aGlzLkdyb3Vwc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGV0ZXJtaW5lZEdyb3VwcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAob3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tY3JlYXRlJywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkob3JnYW5pc2F0aW9uKVxyXG4gICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQvtGA0LPQsNC90LjQt9Cw0YbQuNC4INCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUudXBkYXRlT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbikge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvb3JnYW5pc2F0aW9uLXVwZGF0ZScsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9yZ2FuaXNhdGlvbilcclxuICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0L7RgNCz0LDQvdC40LfQsNGG0LjQuCDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZVByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZScsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByYWN0aWNlKVxyXG4gICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQv9GA0LDQutGC0LjQutC4INCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZU9yVXBkYXRlU3R1ZGVudHMgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudHMpIHtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3N0dWRlbnRzJywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoc3R1ZGVudHMpXHJcbiAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4IHVpZCDRgdGC0YPQtNC10L3RgtC+0LIg0LIg0JHQlCBcIiArIGVycm9yKTtcclxuICAgICAgICB9KTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5yZWplY3RSZXF1ZXN0T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKHN0dWRlbnRUaGF0U2hvdWxkQmVBcHByb3ZlZCkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBpbmZvID0gJz9pZF9yZXF1ZXN0PScgKyBzdHVkZW50VGhhdFNob3VsZEJlQXBwcm92ZWQuaWRfcmVxdWVzdCtcIiZpZF9vcmdhbmlzYXRpb249XCIgK3N0dWRlbnRUaGF0U2hvdWxkQmVBcHByb3ZlZC5pZF9vcmdhbmlzYXRpb247XHJcbiAgICBhd2FpdCBmZXRjaCgnL3VwZGF0ZS1yZXF1ZXN0LW9yZ2FuaXNhdGlvbi1yZWplY3QnICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5hcHByb3ZlUmVxdWVzdE9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChzdHVkZW50VGhhdFNob3VsZEJlQXBwcm92ZWQpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgc3R1ZGVudFRoYXRTaG91bGRCZUFwcHJvdmVkLmlkX3JlcXVlc3QrXCImaWRfb3JnYW5pc2F0aW9uPVwiICtzdHVkZW50VGhhdFNob3VsZEJlQXBwcm92ZWQuaWRfb3JnYW5pc2F0aW9uO1xyXG4gICAgYXdhaXQgZmV0Y2goJy91cGRhdGUtcmVxdWVzdC1vcmdhbmlzYXRpb24tYXBwcm92ZScgKyBpbmZvLCBwYXJhbXMpO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLnVwZGF0ZVJlcXVlc3QgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudFRoYXRTaG91bGRCZUFwcHJvdmVkLCByZWplY3QpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgaW5mbz0wO1xyXG4gICAgaWYocmVqZWN0KXtcclxuICAgICAgICBpbmZvPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnRUaGF0U2hvdWxkQmVBcHByb3ZlZC5pZF9yZXF1ZXN0K1wiJmlkX29yZ2FuaXNhdGlvbj1udWxsXCIgO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgICBpbmZvPSAnP2lkX3JlcXVlc3Q9JyArIHN0dWRlbnRUaGF0U2hvdWxkQmVBcHByb3ZlZC5pZF9yZXF1ZXN0K1wiJmlkX29yZ2FuaXNhdGlvbj1cIiArc3R1ZGVudFRoYXRTaG91bGRCZUFwcHJvdmVkLmlkX29yZ2FuaXNhdGlvbjtcclxuICAgIH1cclxuICAgIGF3YWl0IGZldGNoKCcvdXBkYXRlLXJlcXVlc3QnICsgaW5mbywgcGFyYW1zKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvTW9kZWwuanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1jb2xvcnMuY3NzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1yZXNwb25zaXZlLmNzc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2xpYnMvRGF0YVRhYmxlcy9kYXRhdGFibGVzLm1pbi5jc3Ncbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDL05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBR0E7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBYkE7QUFlQTtBQWpCQTtBQXVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFWQTtBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTs7Ozs7Ozs7O0FDOXJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVJBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFXQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzNlQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7O0EiLCJzb3VyY2VSb290IjoiIn0=
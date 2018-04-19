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
    this.View.onClickEditOrganisation = this.editOrganisation.bind(this);
    this.View.init();
    await this.Model.init();
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
Controller.prototype.editOrganisation = async function (event) {
    let nameOrganisation = this.View.getNameOrganisation(event);
    let organisation = await this.Model.getOrganisationByName(nameOrganisation);
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
    await this.Model.createOrUpdateOrganisation(organisation);
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
/*========================================ORGANISATIONS SECTION================================================*/
Controller.prototype.displayInfoAboutOrg = function () {
    this.View.displayInfoAboutOrg();
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
    document.getElementById("organisationList").addEventListener('click', this.onClickDisplayInfoAboutOrg);
    document.getElementById("showAllOrganisations").addEventListener('click', this.onClickDisplayOrganisations);
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

View.prototype.getConfigurationPractice = function () {
    let typePractice = document.getElementById("selectTypePracticeOrganisationSec").value;
    let typePracticeText = "Учебная";
    if (typePractice === "educational") {
        typePracticeText = "Учебная";
    } else if (typePractice === "internship") {
        typePracticeText = "Производственная";
    } else if (typePractice === "prediploma") {
        typePracticeText = "Преддипломная";
    }
    let eduLevel = document.getElementById("selectEduLevelOrganisationSec").value;
    let educationLevelText = "Бакалавриат";
    if (eduLevel === "bachelor") {
        educationLevelText = "Бакалавриат";
    } else {
        educationLevelText = "Магистратура";
    }

    let info_about_practice = {
        'typePractice': typePracticeText,
        'year': this.selectedYear,
        'edu_level': educationLevelText
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
View.prototype.setOrganisationsList = function (organisations, idList) {
    let listOrg = document.getElementById(idList);
    removeChildren(listOrg);
    for (let i = 0; i < organisations.length; i++) {
        let div_list = document.createElement('div');
        div_list.setAttribute("class", "list");

        let div_list_content = document.createElement('div');
        div_list_content.setAttribute("class", "list-content inline-block");

        let span_list_title = document.createElement('span');
        span_list_title.setAttribute("class", "list-title");
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
View.prototype.getNameOrganisation = function (event) {
    let nameOrganisation = event.target.parentElement.parentElement.children[0].children[0].innerHTML;
    return nameOrganisation;
};

View.prototype.showDialogOrganisation = function (organisation) {
    document.getElementById("nameCompany").innerHTML = organisation.name;
    document.getElementById("infoCompany").innerHTML = organisation.info_organisation;
    document.getElementById("phoneOrg").innerHTML = organisation.phone_organisation;
    document.getElementById("emailOrg").innerHTML = organisation.email_organisation;
    document.getElementById("addressOrg").innerHTML = organisation.address_organisation;
    document.getElementById("placesCompany").innerHTML = organisation.max_students_number;
    document.getElementById("loginCompany").innerHTML = organisation.login_organisation;
    document.getElementById("pswdCompany").innerHTML = organisation.pswd_organisation;
    /////УСТАНОВИТЬ В ДИАЛОГ ИНФУ ОБЯЗАТЕЛЬНО!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    metroDialog.open('#dialogCreateCompany');
};

View.prototype.displayInfoAboutOrg = function () {
    document.getElementById("allOrganisationsListBlock").style.display = "none";
    document.getElementById("studentsRequests").style.display = "block";
};

View.prototype.renderOrganisationSection = function (practice) {
    let text = document.getElementById("organisationListCurrentPracticeText");
    if (practice.length !== 0) {
        text.innerHTML = "Список организаций в практике";
    } else text.innerHTML = "Практики не существует.";
};

View.prototype.OpenOrCloseLoadImage = function () {
    let display = document.getElementById("load").style.display;
    if (display === "block") {
        document.getElementById("load").style.display = "none";
    } else {
        document.getElementById("load").style.display = "block";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIGZiNmNlMGVjMGYwMWQ3OGVjMzJhIiwid2VicGFjazovLy9wdWJsaWMvanMvbWFpbi5qcyIsIndlYnBhY2s6Ly8vcHVibGljL2pzL0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vL3B1YmxpYy9qcy9WaWV3LmpzIiwid2VicGFjazovLy9wdWJsaWMvanMvTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8taWNvbnMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9qcy9saWJzL0RhdGFUYWJsZXMvZGF0YXRhYmxlcy5taW4uY3NzIiwid2VicGFjazovLy8uL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBmYjZjZTBlYzBmMDFkNzhlYzMyYSIsImNvbnN0IENvbnRyb2xsZXIgPSByZXF1aXJlICgnLi9Db250cm9sbGVyLmpzJyk7XHJcblxyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLWNvbG9ycy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3MnKTtcclxucmVxdWlyZSgnLi4vYXNzZXRzL2Nzcy9tZXRyby1zY2hlbWVzLmNzcycpO1xyXG5yZXF1aXJlKCcuLi9hc3NldHMvY3NzL21ldHJvLXJlc3BvbnNpdmUuY3NzJyk7XHJcbnJlcXVpcmUoJy4vbGlicy9EYXRhVGFibGVzL2RhdGF0YWJsZXMubWluLmNzcycpO1xyXG5yZXF1aXJlICgnLi4vYXNzZXRzL2Nzcy9zdHlsZS5jc3MnKTtcclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcbiAgbmV3IENvbnRyb2xsZXIoKTtcclxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHB1YmxpYy9qcy9tYWluLmpzIiwiY29uc3QgVmlldyA9IHJlcXVpcmUoJy4vVmlldy5qcycpO1xyXG5jb25zdCBNb2RlbCA9IHJlcXVpcmUoJy4vTW9kZWwuanMnKTtcclxuXHJcbmZ1bmN0aW9uIENvbnRyb2xsZXIoKSB7XHJcbiAgICB0aGlzLlZpZXcgPSBuZXcgVmlldygpO1xyXG4gICAgdGhpcy5Nb2RlbCA9IG5ldyBNb2RlbCgpO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbn1cclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmluaXQgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja05leHRTdGVwID0gdGhpcy5kaXNwbGF5R3JvdXBzLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZVByYWN0aWNlID0gdGhpcy5nb1RvUHJhY3RpY2VDcmVhdGlvbi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tBZGRQcmFjdGljZSA9IHRoaXMuY3JlYXRlUHJhY3RpY2UuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IHRoaXMuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uID0gdGhpcy5nb1RvU3R1ZGVudHNTZWN0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0ZpbmlzaEJ0biA9IHRoaXMuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdC5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tTZWxlY3RHcm91cEJ0bk9rID0gdGhpcy5yZW5kZXJEYXRhSW5UYWJsZS5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tZZWFyc0FycmF5ID0gdGhpcy5zZXRHcm91cHNUcmVlVmlldy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tHZXRPcmdhbmlzYXRpb25zID0gdGhpcy5nZXRPcmdhbmlzYXRpb25zLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbiA9IHRoaXMudXBkYXRlVHJlZVZpZXcuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5vbkNsaWNrRGlzcGxheUluZm9BYm91dE9yZyA9IHRoaXMuZGlzcGxheUluZm9BYm91dE9yZy5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5WaWV3Lm9uQ2xpY2tEaXNwbGF5T3JnYW5pc2F0aW9ucyA9IHRoaXMuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uLmJpbmQodGhpcyk7XHJcbiAgICB0aGlzLlZpZXcub25DbGlja0VkaXRPcmdhbmlzYXRpb24gPSB0aGlzLmVkaXRPcmdhbmlzYXRpb24uYmluZCh0aGlzKTtcclxuICAgIHRoaXMuVmlldy5pbml0KCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmluaXQoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbnM9YXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25zKCk7XHJcbiAgICBsZXQgdHlwZXNPcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLk1vZGVsLmdldFR5cGVzT3JnYW5pc2F0aW9uKCk7XHJcbiAgICB0aGlzLlZpZXcuc2V0VHlwZXNPcmdhbmlzYXRpb25TZWxlY3QodHlwZXNPcmdhbmlzYXRpb24pO1xyXG4gICAgdGhpcy5WaWV3LnNldE9yZ2FuaXNhdGlvbnNMaXN0KG9yZ2FuaXNhdGlvbnMsIFwiYWxsT3JnYW5pc2F0aW9uc0xpc3RcIik7XHJcbiAgICB0aGlzLlZpZXcuT3Blbk9yQ2xvc2VMb2FkSW1hZ2UoKTtcclxuICAgIHRoaXMuVmlldy5nb1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24oKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmdvVG9TdHVkZW50c1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZ29Ub1N0dWRlbnRzU2VjdGlvbigpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ29Ub1ByYWN0aWNlQ3JlYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID0gdGhpcy5Nb2RlbC5nZXRDdXJyZW50WWVhcigpO1xyXG4gICAgYXdhaXQgdGhpcy5yZW5kZXJHcm91cHNUcmVlVmlldygpO1xyXG4gICAgdGhpcy5WaWV3LmNsZWFyUHJhY3RpY2VTZWN0aW9uKCk7XHJcbiAgICBsZXQgdHlwZXNPcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uKCk7XHJcbiAgICB0aGlzLlZpZXcuc2V0VHlwZXNPcmdhbmlzYXRpb25TZWxlY3QodHlwZXNPcmdhbmlzYXRpb24pO1xyXG4gICAgdGhpcy5WaWV3LmdvVG9QcmFjdGljZUNyZWF0aW9uKCk7XHJcbiAgICB0aGlzLlZpZXcuc2VsZWN0ZWRZZWFyID0gdGhpcy5Nb2RlbC5nZXRDdXJyZW50WWVhcigpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUudXBkYXRlVHlwZXNPcmdhbmlzYXRpb24gPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgdHlwZXNPcmdhbmlzYXRpb24gPSBhd2FpdCB0aGlzLk1vZGVsLmdldFR5cGVzT3JnYW5pc2F0aW9uKCk7XHJcbiAgICB0aGlzLlZpZXcuY2xlYXJUeXBlc09yZ2FuaXNhdGlvbigpO1xyXG4gICAgdGhpcy5WaWV3LnNldFR5cGVzT3JnYW5pc2F0aW9uKHR5cGVzT3JnYW5pc2F0aW9uKTtcclxuICAgIGxldCBvcmdhbmlzYXRpb25zID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25zKCk7XHJcbiAgICB0aGlzLlZpZXcuc2V0T3JnYW5pc2F0aW9uc0luVHJlZVZpZXcob3JnYW5pc2F0aW9ucywgdHlwZXNPcmdhbmlzYXRpb24pO1xyXG4gICAgcmV0dXJuIHR5cGVzT3JnYW5pc2F0aW9uO1xyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5lZGl0T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgIGxldCBuYW1lT3JnYW5pc2F0aW9uPSB0aGlzLlZpZXcuZ2V0TmFtZU9yZ2FuaXNhdGlvbihldmVudCk7XHJcbiAgIGxldCBvcmdhbmlzYXRpb249YXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25CeU5hbWUobmFtZU9yZ2FuaXNhdGlvbik7XHJcbiAgIHRoaXMuVmlldy5zaG93RGlhbG9nT3JnYW5pc2F0aW9uKG9yZ2FuaXNhdGlvbik7XHJcbn07XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS5kaXNwbGF5R3JvdXBzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3LmRpc3BsYXlHcm91cHMoKTtcclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmRpYWxvZ1ByYWN0aWNlQ3JlYXRlZEluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLlZpZXcuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCgpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuY3JlYXRlTmV3T3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IHRoaXMuVmlldy5nZXRJbmZvTmV3T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmNyZWF0ZU9yVXBkYXRlT3JnYW5pc2F0aW9uKG9yZ2FuaXNhdGlvbik7XHJcblxyXG59O1xyXG5Db250cm9sbGVyLnByb3RvdHlwZS51cGRhdGVUcmVlVmlldyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGF3YWl0IHRoaXMuY3JlYXRlTmV3T3JnYW5pc2F0aW9uKCk7XHJcbiAgICBhd2FpdCB0aGlzLnVwZGF0ZVR5cGVzT3JnYW5pc2F0aW9uKCk7XHJcbn07XHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLmNyZWF0ZVByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5WaWV3Lk9wZW5PckNsb3NlTG9hZEltYWdlKCk7XHJcbiAgICBsZXQgcHJhY3RpY2UgPSB0aGlzLlZpZXcuUHJhY3RpY2U7XHJcbiAgICBsZXQgZ3JvdXBzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXREZXRlcm1pbmVkR3JvdXBzKHByYWN0aWNlLmdyb3Vwcyk7XHJcbiAgICBwcmFjdGljZS5ncm91cHMgPSBncm91cHM7XHJcbiAgICBhd2FpdCB0aGlzLk1vZGVsLmNyZWF0ZVByYWN0aWNlKHByYWN0aWNlKTtcclxuICAgIHRoaXMuVmlldy5PcGVuT3JDbG9zZUxvYWRJbWFnZSgpO1xyXG4gICAgdGhpcy5nb1RvU3R1ZGVudHNTZWN0aW9uKCk7XHJcbn07XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUucmVuZGVyR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5WaWV3LnNlbGVjdGVkWWVhciAhPT0gXCIgKyBcIikge1xyXG4gICAgICAgIGF3YWl0ICB0aGlzLk1vZGVsLmRpc3RyaWJ1dGVHcm91cHNCeUNvdXJzZXModGhpcy5WaWV3LnNlbGVjdGVkWWVhcik7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5WaWV3LmNsZWFyR3JvdXBzVHJlZVZpZXcoKTtcclxuICAgICAgICBhd2FpdCB0aGlzLlZpZXcudXBkYXRlR3JvdXBzVHJlZVZpZXcodGhpcy5Nb2RlbC5Db3Vyc2VzKTtcclxuICAgIH1cclxufTtcclxuXHJcbkNvbnRyb2xsZXIucHJvdG90eXBlLnNldEdyb3Vwc1RyZWVWaWV3ID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB0aGlzLlZpZXcudXBkYXRlWWVhcihldmVudCk7XHJcbiAgICB0aGlzLnJlbmRlckdyb3Vwc1RyZWVWaWV3KCk7XHJcbn07XHJcblxyXG5Db250cm9sbGVyLnByb3RvdHlwZS5yZW5kZXJEYXRhSW5UYWJsZSA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBzZWxlY3RlZEdyb3VwcyA9IHRoaXMuVmlldy5nZXRTZWxlY3RlZEdyb3VwcygpO1xyXG4gICAgbGV0IGdyb3Vwc09iamVjdHMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Nb2RlbC5Hcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNlbGVjdGVkR3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLk1vZGVsLkdyb3Vwc1tpXS5uYW1lID09PSBzZWxlY3RlZEdyb3Vwc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBzT2JqZWN0cy5wdXNoKHRoaXMuTW9kZWwuR3JvdXBzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHRoaXMuVmlldy5nZXRVc2VySW5mb0Fib3V0UHJhY3RpY2UoKTtcclxuICAgIGxldCBwcmFjdGljZSA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UHJhY3RpY2UoaW5mb19hYm91dF9wcmFjdGljZSk7XHJcbiAgICBsZXQgZGF0YSA9IDAsIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnM7XHJcbiAgICBpZiAocHJhY3RpY2UubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgbGV0IHJlcXVlc3RzID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRSZXF1ZXN0cyhwcmFjdGljZSwgZ3JvdXBzT2JqZWN0cyk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5Nb2RlbC5hc3Nvc2lhdGVSZXF1ZXN0VG9TdHVkZW50KHJlcXVlc3RzLCBzZWxlY3RlZEdyb3Vwcyk7XHJcbiAgICAgICAgcmVxdWVzdHNfb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHRoaXMuTW9kZWwuZ2V0UmVxdWVzdHNPcmdhbmlzYXRpb25zKHNlbGVjdGVkR3JvdXBzKTtcclxuICAgICAgICBkYXRhID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXREYXRhKHNlbGVjdGVkR3JvdXBzLCByZXF1ZXN0c19vcmdhbmlzYXRpb25zKTtcclxuICAgICAgICBpZiAoZGF0YS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZGF0YSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuVmlldy5yZW5kZXJUYWJsZShkYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLlZpZXcucmVuZGVyVGFibGUoZGF0YSk7XHJcbiAgICAgICAgdGhpcy5WaWV3LmNvbG9yVGFibGUoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5WaWV3LnJlbmRlckluZm8ocHJhY3RpY2UpO1xyXG59O1xyXG5cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBpbmZvX2Fib3V0X3ByYWN0aWNlID0gdGhpcy5WaWV3LmdldENvbmZpZ3VyYXRpb25QcmFjdGljZSgpO1xyXG4gICAgbGV0IHByYWN0aWNlID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRQcmFjdGljZShpbmZvX2Fib3V0X3ByYWN0aWNlKTtcclxuICAgIGxldCBvcmdhbmlzYXRpb25zID0gMDtcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBvcmdhbmlzYXRpb25zID0gYXdhaXQgdGhpcy5Nb2RlbC5nZXRPcmdhbmlzYXRpb25zQnlQcmFjdGljZUlkKHByYWN0aWNlKTtcclxuICAgIH1cclxuICAgIHRoaXMuVmlldy5zZXRPcmdhbmlzYXRpb25zTGlzdChvcmdhbmlzYXRpb25zLFwib3JnYW5pc2F0aW9uTGlzdFwiKTtcclxuICAgIHRoaXMuVmlldy5yZW5kZXJPcmdhbmlzYXRpb25TZWN0aW9uKHByYWN0aWNlKTtcclxufTtcclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09T1JHQU5JU0FUSU9OUyBTRUNUSU9OPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuQ29udHJvbGxlci5wcm90b3R5cGUuZGlzcGxheUluZm9BYm91dE9yZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuVmlldy5kaXNwbGF5SW5mb0Fib3V0T3JnKCk7XHJcbn07XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvQ29udHJvbGxlci5qcyIsImNvbnN0IGJhY2hlbG9yWWVhciA9IDQ7XHJcbmNvbnN0IG1hc3RlclllYXIgPSA2O1xyXG5sZXQgc2VsZWN0ZWRFbGVtID0gMDtcclxuXHJcbnZhciBWaWV3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5vbkNsaWNrTmV4dFN0ZXAgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrUHJhY3RpY2VDb21wbGV0ZWQgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQ3JlYXRlUHJhY3RpY2UgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQWRkUHJhY3RpY2UgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrVG9PcmdhbmlzYXRpb25zU2VjdGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tUb1N0dWRlbnRzU2VjdGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLm9uQ2xpY2tGaW5pc2hCdG4gPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrU2VsZWN0R3JvdXBCdG5PayA9IG51bGw7XHJcbiAgICB0aGlzLm15VGFibGUgPSAkKCcjc3R1ZGVudHNMaXN0VGFibGUnKTtcclxuICAgIHRoaXMub25DbGlja1llYXJzQXJyYXkgPSBudWxsO1xyXG4gICAgdGhpcy5zZWxlY3RlZFllYXIgPSBudWxsO1xyXG4gICAgdGhpcy5pZFRyZWVWaWV3cyA9IFtcclxuICAgICAgICAnZ3JvdXAtdHJlZXZpZXctdGFiY29udHJvbDEtYmFjaGVsb3InLFxyXG4gICAgICAgICdncm91cC10cmVldmlldy10YWJjb250cm9sMi1tYXN0ZXInLFxyXG4gICAgICAgICdncm91cHMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb24tYmFjaGVsb3InLFxyXG4gICAgICAgICdncm91cHMtdHJlZXZpZXctcHJhY3RpY2UtY3JlYXRpb24tbWFzdGVyJ1xyXG4gICAgXTtcclxuICAgIHRoaXMub25DbGlja0dldE9yZ2FuaXNhdGlvbnMgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrQ3JlYXRlT3JnYW5pc2F0aW9uID0gbnVsbDtcclxuICAgIHRoaXMub25DbGlja0Rpc3BsYXlJbmZvQWJvdXRPcmcgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrRGlzcGxheU9yZ2FuaXNhdGlvbnMgPSBudWxsO1xyXG4gICAgdGhpcy5vbkNsaWNrRWRpdE9yZ2FuaXNhdGlvbiA9IG51bGw7XHJcbiAgICB0aGlzLlByYWN0aWNlID0gbnVsbDtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLW5leHRcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja05leHRTdGVwKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGlhbG9nUHJhY3RpY2VDb21wbGV0ZVN1Y2Nlc3NcIikucXVlcnlTZWxlY3RvcihcclxuICAgICAgICBcIiNwcmFjdGljZUZpbmlzaGVkT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1ByYWN0aWNlQ29tcGxldGVkKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlUHJhY3RpY2VCdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0NyZWF0ZVByYWN0aWNlKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnYW5pc2F0aW9uc1NlY3Rpb25CdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1RvT3JnYW5pc2F0aW9uc1NlY3Rpb24pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkZW50c1NlY3Rpb25CdG5cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1RvU3R1ZGVudHNTZWN0aW9uKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJidG4tZmluaXNoXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tGaW5pc2hCdG4pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZXRHcm91cHNCdG5Pa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrU2VsZWN0R3JvdXBCdG5Payk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbnNBcnJheVwiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrWWVhcnNBcnJheSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dHRvbnNBcnJheTFcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja1llYXJzQXJyYXkpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnZXRPcmdhbmlzYXRpb25zQnRuT2tcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0dldE9yZ2FuaXNhdGlvbnMpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVPcmdhbmlzYXRpb25cIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0NyZWF0ZU9yZ2FuaXNhdGlvbik7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByYWN0aWNlRmluaXNoZWRPa1wiKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsXHJcbiAgICAgICAgdGhpcy5vbkNsaWNrQWRkUHJhY3RpY2UpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25MaXN0XCIpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxcclxuICAgICAgICB0aGlzLm9uQ2xpY2tEaXNwbGF5SW5mb0Fib3V0T3JnKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2hvd0FsbE9yZ2FuaXNhdGlvbnNcIikuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLFxyXG4gICAgICAgIHRoaXMub25DbGlja0Rpc3BsYXlPcmdhbmlzYXRpb25zKTtcclxuICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoe1xyXG4gICAgICAgIGRhdGE6IHRoaXMuR3JvdXBzLFxyXG4gICAgICAgIFwibGFuZ3VhZ2VcIjoge1xyXG4gICAgICAgICAgICBcInplcm9SZWNvcmRzXCI6IFwi0KLQsNC60L7QuSDQt9Cw0L/QuNGB0Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIixcclxuICAgICAgICAgICAgXCJlbXB0eVRhYmxlXCI6IFwi0J3QuCDQvtC00L3QsCDQuNC3INCz0YDRg9C/0L8g0L3QtSDQstGL0LHRgNCw0L3QsCDQu9C40LHQviDQv9GA0LDQutGC0LjQutC4INC90LUg0YHRg9GJ0LXRgdGC0LLRg9C10YIuXCIsXHJcbiAgICAgICAgICAgIFwic2VhcmNoXCI6IFwi0J/QvtC40YHQujpcIixcclxuICAgICAgICAgICAgXCJwYWdpbmF0ZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBcImZpcnN0XCI6IFwi0J/QtdGA0LLRi9C5XCIsXHJcbiAgICAgICAgICAgICAgICBcImxhc3RcIjogXCLQn9C+0YHQu9C10LTQvdC40LlcIixcclxuICAgICAgICAgICAgICAgIFwibmV4dFwiOiBcItCS0L/QtdGA0LXQtFwiLFxyXG4gICAgICAgICAgICAgICAgXCJwcmV2aW91c1wiOiBcItCd0LDQt9Cw0LRcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcImluZm9GaWx0ZXJlZFwiOiBcIijQuNC3IF9NQVhfINGB0YLRg9C00LXQvdGC0L7QsilcIixcclxuICAgICAgICAgICAgXCJsZW5ndGhNZW51XCI6IFwi0J/QvtC60LDQt9Cw0YLRjCBfTUVOVV8g0LfQsNC/0LjRgdC10LlcIixcclxuICAgICAgICAgICAgXCJpbmZvXCI6IFwi0J7QsdGJ0LXQtSDQutC+0LvQuNGH0LXRgdGC0LLQviDRgdGC0YPQtNC10L3RgtC+0LI6IF9UT1RBTF8gXCIsXHJcbiAgICAgICAgICAgIFwiaW5mb0VtcHR5XCI6IFwi0JLRi9Cx0LXRgNC40YLQtSDQs9GA0YPQv9C/0YMuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiY29sdW1uc1wiOiBbXHJcbiAgICAgICAgICAgIHtcImRhdGFcIjogXCJncm91cFwifSxcclxuICAgICAgICAgICAge1wiZGF0YVwiOiBcInN0dWRlbnRcIn0sXHJcbiAgICAgICAgICAgIHtcImRhdGFcIjogXCJvcmdhbmlzYXRpb25cIn1cclxuICAgICAgICBdXHJcbiAgICB9KTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9TdHVkZW50c1NlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI29yZ2FuaXNhdGlvbnNTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJhY3RpY2VDcmVhdGlvblNlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgbGV0IHRyZWVWaWV3cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0cmVldmlldyBcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRyZWVWaWV3c1tpXS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ29Ub09yZ2FuaXNhdGlvbnNTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21haW5XaW5kb3dTZWN0aW9uXCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjb3JnYW5pc2F0aW9uc1NlY3Rpb25cIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3R1ZGVudHNSZXF1ZXN0c1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsbE9yZ2FuaXNhdGlvbnNMaXN0QmxvY2tcIikuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmdvVG9QcmFjdGljZUNyZWF0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNwcmFjdGljZUNyZWF0aW9uU2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtYWluV2luZG93U2VjdGlvblwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbn07XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVBSQUNUSUNFIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuVmlldy5wcm90b3R5cGUuZGlhbG9nUHJhY3RpY2VDcmVhdGVkSW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBmaW5pc2hCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuLWZpbmlzaFwiKVswXTtcclxuICAgIGZpbmlzaEJ0bi5zZXRBdHRyaWJ1dGUoXCJvbmNsaWNrXCIsXHJcbiAgICAgICAgXCJtZXRyb0RpYWxvZy5vcGVuKCcjZGlhbG9nUHJhY3RpY2VDb21wbGV0ZVN1Y2Nlc3MnKVwiKTtcclxuICAgIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1Y2F0aW9uXCIpLnZhbHVlO1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VcIikudmFsdWU7XHJcbiAgICBsZXQgZWR1Y2F0aW9uTGV2ZWxUZXh0ID0gXCLQkdCw0LrQsNC70LDQstGA0LjQsNGCXCI7XHJcbiAgICBpZiAoZWR1Y2F0aW9uTGV2ZWwgPT09IFwiYmFjaGVsb3JcIikge1xyXG4gICAgICAgIGVkdWNhdGlvbkxldmVsVGV4dCA9IFwi0JHQsNC60LDQu9Cw0LLRgNC40LDRglwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZWR1Y2F0aW9uTGV2ZWxUZXh0ID0gXCLQnNCw0LPQuNGB0YLRgNCw0YLRg9GA0LBcIjtcclxuICAgIH1cclxuICAgIGxldCBsZWNOdW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY051bVwiKS52YWx1ZTtcclxuICAgIGxldCBmcm9tRGF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZnJvbURhdGVJbnB1dFwiKS52YWx1ZTtcclxuICAgIGxldCB0b0RhdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvRGF0ZUlucHV0XCIpLnZhbHVlO1xyXG4gICAgbGV0IGRlYWRsaW5lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVwiKS52YWx1ZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGVybXNQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSAnYyAnICsgZnJvbURhdGVcclxuICAgICAgICArICcg0L/QviAnICsgdG9EYXRlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWFkbGluZVByYWN0aWNlRGlhbG9nXCIpLmlubmVySFRNTCA9IGRlYWRsaW5lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluV2luZG93VGVybXNQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBmcm9tRGF0ZVxyXG4gICAgICAgICsgJyAtICcgKyB0b0RhdGU7XHJcbiAgICBpZiAoZnJvbURhdGUgPT09IFwiXCIpIHtcclxuICAgICAgICBmcm9tRGF0ZSA9IFwiMjAwMC0wMS0wMSAyMTowMDowMC4wMDAgKzAwOjAwXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmcm9tRGF0ZSA9IGZyb21EYXRlLnN1YnN0cig4LCA0KSArICctJyArIGZyb21EYXRlLnN1YnN0cig0LCAyKSArICctJ1xyXG4gICAgICAgICAgICArIGZyb21EYXRlLnN1YnN0cigwLCAyKSArICcgJyArICcyMTowMDowMC4wMDAgKzAwOjAwJztcclxuICAgIH1cclxuICAgIGlmICh0b0RhdGUgPT09IFwiXCIpIHtcclxuICAgICAgICB0b0RhdGUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdG9EYXRlID0gdG9EYXRlLnN1YnN0cig4LCA0KSArICctJyArIHRvRGF0ZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICAgICAgKyB0b0RhdGUuc3Vic3RyKDAsIDIpICsgJyAnICsgJzIxOjAwOjAwLjAwMCArMDA6MDAnO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlYWRsaW5lID09PSBcIlwiKSB7XHJcbiAgICAgICAgZGVhZGxpbmUgPSBcIjIwMDAtMDEtMDEgMjE6MDA6MDAuMDAwICswMDowMFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZGVhZGxpbmUgPSBkZWFkbGluZS5zdWJzdHIoOCwgNCkgKyAnLScgKyBkZWFkbGluZS5zdWJzdHIoNCwgMikgKyAnLSdcclxuICAgICAgICAgICAgKyBkZWFkbGluZS5zdWJzdHIoMCwgMikgKyAnICcgKyAnMjE6MDA6MDAuMDAwICswMDowMCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJlZHVjYXRpb25hbFwiKSB7XHJcbiAgICAgICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0KPRh9C10LHQvdCw0Y9cIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJpbnRlcm5zaGlwXCIpIHtcclxuICAgICAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQn9GA0L7QuNC30LLQvtC00YHRgtCy0LXQvdC90LDRj1wiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZVByYWN0aWNlID09PSBcInByZWRpcGxvbWFcIikge1xyXG4gICAgICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQtdC00LTQuNC/0LvQvtC80L3QsNGPXCI7XHJcbiAgICB9XHJcbiAgICBsZXQgdHJlZVZpZXcgPSBudWxsO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmlkVHJlZVZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcInByYWN0aWNlXCIpICE9PSAtMVxyXG4gICAgICAgICAgICAmJiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5XHJcbiAgICAgICAgICAgID09PSBcImJsb2NrXCIpIHtcclxuICAgICAgICAgICAgdHJlZVZpZXcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgYXJyR3JvdXBzID0gdGhpcy5nZXRTZWxlY3RlZEdyb3Vwcyh0cmVlVmlldyk7XHJcbiAgICBsZXQgYXJyT3JnYW5pc2F0aW9ucyA9IHRoaXMuZ2V0U2VsZWN0ZWRHcm91cHMoXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uXCIpKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR5cGVQcmFjdGljZURpYWxvZ1wiKS5pbm5lckhUTUwgPSB0eXBlUHJhY3RpY2VUZXh0O1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJlZHVjYXRpb25hbExldmVsRGlhbG9nXCIpLmlubmVySFRNTCA9IGVkdWNhdGlvbkxldmVsVGV4dDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ3JvdXBzUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gYXJyR3JvdXBzO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgXCJvcmdhbmlzYXRpb25zUHJhY3RpY2VEaWFsb2dcIikuaW5uZXJIVE1MID0gYXJyT3JnYW5pc2F0aW9ucztcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gdHlwZVByYWN0aWNlVGV4dFxyXG4gICAgICAgICsgXCIg0L/RgNCw0LrRgtC40LrQsFwiO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVjTnVtRGlhbG9nXCIpLmlubmVySFRNTCA9IGxlY051bTtcclxuICAgIHRoaXMuUHJhY3RpY2UgPSB7XHJcbiAgICAgICAgJ3R5cGVQcmFjdGljZSc6IHR5cGVQcmFjdGljZVRleHQsXHJcbiAgICAgICAgJ3N0YXJ0RGF0ZVByYWN0aWNlJzogZnJvbURhdGUsXHJcbiAgICAgICAgJ2VuZERhdGVQcmFjdGljZSc6IHRvRGF0ZSxcclxuICAgICAgICAnZGVhZGxpbmVQcmFjdGljZSc6IGRlYWRsaW5lLFxyXG4gICAgICAgICdsZWNOdW0nOiBsZWNOdW0sXHJcbiAgICAgICAgJ2VkdUxldmVsJzogZWR1Y2F0aW9uTGV2ZWxUZXh0LFxyXG4gICAgICAgICdvcmdhbmlzYXRpb25zJzogYXJyT3JnYW5pc2F0aW9ucyxcclxuICAgICAgICAnZ3JvdXBzJzogYXJyR3JvdXBzLFxyXG4gICAgICAgICd5ZWFyJzogdGhpcy5zZWxlY3RlZFllYXJcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuUHJhY3RpY2U7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5kaXNwbGF5R3JvdXBzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGVkdWNhdGlvbkxldmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RFZHVjYXRpb25cIikudmFsdWU7XHJcbiAgICBpZiAoZWR1Y2F0aW9uTGV2ZWwgPT09IFwiYmFjaGVsb3JcIikge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpXS5pbmRleE9mKFwibWFzdGVyXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJiYWNoZWxvclwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWRUcmVlVmlld3NbaV0pLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaWRUcmVlVmlld3NbaV0uaW5kZXhPZihcImJhY2hlbG9yXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZFRyZWVWaWV3c1tpXSkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlkVHJlZVZpZXdzW2ldLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkVHJlZVZpZXdzW2ldKS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufTtcclxuVmlldy5wcm90b3R5cGUuY2xlYXJQcmFjdGljZVNlY3Rpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZyb21EYXRlSW5wdXRcIikudmFsdWUgPSBcIlwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b0RhdGVJbnB1dFwiKS52YWx1ZSA9IFwiXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYWRsaW5lXCIpLnZhbHVlID0gXCJcIjtcclxufTtcclxuLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVNUVURFTlRTIFNFQ1RJT049PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcblZpZXcucHJvdG90eXBlLnJlbmRlckluZm8gPSBmdW5jdGlvbiAocHJhY3RpY2UpIHtcclxuICAgIGlmIChwcmFjdGljZS5sZW5ndGggIT09IDApIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUZXJtc1ByYWN0aWNlXCIpLmlubmVySFRNTCA9ICfRgSAnICsgcHJhY3RpY2Uuc3RhcnRfZGF0ZV9wcmFjdGljZSArICcg0L/QviAnICsgcHJhY3RpY2UuZW5kX2RhdGVfcHJhY3RpY2U7XHJcbiAgICAgICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB0aGlzLmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSgpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1R5cGVQcmFjdGljZVwiKS5pbm5lckhUTUwgPSBpbmZvX2Fib3V0X3ByYWN0aWNlLnR5cGVQcmFjdGljZVxyXG4gICAgICAgICAgICArICcg0L/RgNCw0LrRgtC40LrQsCc7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5XaW5kb3dUeXBlUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gXCLQn9GA0LDQutGC0LjQutC4XCJcclxuICAgICAgICAgICAgKyBcIiDQvdC1INGB0YPRidC10YHRgtCy0YPQtdGCLlwiO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbldpbmRvd1Rlcm1zUHJhY3RpY2VcIikuaW5uZXJIVE1MID0gXCIgXCI7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLmdldFVzZXJJbmZvQWJvdXRQcmFjdGljZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBlZHVjYXRpb25MZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ0YWJjb250cm9sMlwiKVswXS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYWN0aXZlXCIpWzBdLmNoaWxkcmVuWzBdLnRleHQ7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlUHJhY3RpY2VUYWJcIikudmFsdWU7XHJcbiAgICBsZXQgdHlwZVByYWN0aWNlVGV4dCA9IFwi0KPRh9C10LHQvdCw0Y9cIjtcclxuICAgIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiZWR1Y2F0aW9uYWxcIikge1xyXG4gICAgICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwiaW50ZXJuc2hpcFwiKSB7XHJcbiAgICAgICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0J/RgNC+0LjQt9Cy0L7QtNGB0YLQstC10L3QvdCw0Y9cIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVQcmFjdGljZSA9PT0gXCJwcmVkaXBsb21hXCIpIHtcclxuICAgICAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQn9GA0LXQtNC00LjQv9C70L7QvNC90LDRj1wiO1xyXG4gICAgfVxyXG4gICAgbGV0IGluZm9fYWJvdXRfcHJhY3RpY2UgPSB7XHJcbiAgICAgICAgJ3R5cGVQcmFjdGljZSc6IHR5cGVQcmFjdGljZVRleHQsXHJcbiAgICAgICAgJ3llYXInOiB0aGlzLnNlbGVjdGVkWWVhcixcclxuICAgICAgICAnZWR1X2xldmVsJzogZWR1Y2F0aW9uTGV2ZWxcclxuICAgIH07XHJcbiAgICByZXR1cm4gaW5mb19hYm91dF9wcmFjdGljZTtcclxufTtcclxuXHJcblxyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJUYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBpZiAoZGF0YSA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkNsZWFyVGFibGUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRoaXMubXlUYWJsZS5kYXRhVGFibGUoKS5mbkNsZWFyVGFibGUoKTtcclxuICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5BZGREYXRhKGRhdGEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuY29sb3JUYWJsZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoZGF0YVtpXS5zdGF0dXMpIHtcclxuICAgICAgICAgICAgJCh0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKSkuYWRkQ2xhc3MoXCJhcHByb3ZlZF9zdHVkXCIpO1xyXG4gICAgICAgICAgICB0aGlzLm15VGFibGUuZGF0YVRhYmxlKCkuZm5HZXROb2RlcyhpKS5jaGlsZHJlblswXS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInNvcnRpbmdfMSBhcHByb3ZlZF9zdHVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmNoYW5nZVllYXIgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgaWYgKHNlbGVjdGVkRWxlbSkge1xyXG4gICAgICAgIHNlbGVjdGVkRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdjdXJyZW50Jyk7XHJcbiAgICB9XHJcbiAgICBzZWxlY3RlZEVsZW0gPSBub2RlO1xyXG4gICAgc2VsZWN0ZWRFbGVtLmNsYXNzTGlzdC5hZGQoJ2N1cnJlbnQnKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRZZWFyID0gc2VsZWN0ZWRFbGVtLmlubmVySFRNTDtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnVwZGF0ZVllYXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICB3aGlsZSAodGFyZ2V0ICE9IGJ1dHRvbnNBcnJheSkge1xyXG4gICAgICAgIGlmICh0YXJnZXQuY2xhc3NOYW1lID09ICdpdGVtIHllYXInKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlWWVhcih0YXJnZXQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0U2VsZWN0ZWRHcm91cHMgPSBmdW5jdGlvbiAodHJlZVZpZXcpIHtcclxuICAgIGlmICh0cmVlVmlldyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbGV0IGZyYW1lcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJmcmFtZXNcIilbMF0uY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGZyYW1lc1tpXS5zdHlsZS5kaXNwbGF5ID09IFwiYmxvY2tcIikge1xyXG4gICAgICAgICAgICAgICAgdHJlZVZpZXcgPSBmcmFtZXNbaV0uY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBHcm91cHMgPSBbXTtcclxuICAgIGxldCBsaU51bWJlciA9IHRyZWVWaWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpTnVtYmVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwcyA9IGxpTnVtYmVyW2ldLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0OmNoZWNrZWQnKTtcclxuICAgICAgICBpZiAoZ3JvdXBzLmxlbmd0aCA9PSAxKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZ3JvdXBzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgZ3JvdXAgPSBncm91cHNbal0ucGFyZW50RWxlbWVudC5uZXh0RWxlbWVudFNpYmxpbmcuaW5uZXJIVE1MO1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwLmluZGV4T2YoXCLQutGD0YDRgVwiKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBHcm91cHMucHVzaChncm91cCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gR3JvdXBzO1xyXG59O1xyXG5cclxuZnVuY3Rpb24gdHJlZV9hZGRfbGVhZl9jaGVja2JveF9leGFtcGxlX2NsaWNrKHRyZWUsIG5vZGUsIG5hbWVMZWFmKSB7XHJcbiAgICB0cmVlLmFkZExlYWYobm9kZSwgbmFtZUxlYWYsIHtcclxuICAgICAgICBtb2RlOiAnY2hlY2tib3gnLFxyXG4gICAgICAgIGNoZWNrZWQ6IGZhbHNlXHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlQ2hpbGRyZW4obm9kZSkge1xyXG4gICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZE5vZGVzO1xyXG4gICAgd2hpbGUgKGNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICAgIG5vZGUucmVtb3ZlQ2hpbGQoY2hpbGRyZW5bMF0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5WaWV3LnByb3RvdHlwZS5jbGVhckdyb3Vwc1RyZWVWaWV3ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGlkID0gMDtcclxuICAgIHdoaWxlIChpZCA8IHRoaXMuaWRUcmVlVmlld3MubGVuZ3RoKSB7XHJcbiAgICAgICAgdmFyIGxpQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgdGhpcy5pZFRyZWVWaWV3c1tpZF0pLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByZW1vdmVDaGlsZHJlbihsaUFycmF5W2ldLmdldEVsZW1lbnRzQnlUYWdOYW1lKCd1bCcpWzBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWQrKztcclxuICAgIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUudXBkYXRlR3JvdXBzVHJlZVZpZXcgPSBhc3luYyBmdW5jdGlvbiAoY291cnNlcykge1xyXG4gICAgbGV0IGlkQ291bnRlciA9IDAsIGNvdXJzZU51bWJlciA9IGJhY2hlbG9yWWVhciwgY250O1xyXG4gICAgbGV0IGNvdXJzZXNOYW1lID0gWydmaXJzdCcsICdzZWNvbmQnLCAndGhpcmQnLCAnZm91cnRoJ107XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICB3aGlsZSAoaWRDb3VudGVyIDwgdGhpcy5pZFRyZWVWaWV3cy5sZW5ndGgpIHtcclxuICAgICAgICB2YXIgdHJlZSA9ICQoXCIjXCIgKyB0aGlzLmlkVHJlZVZpZXdzW2lkQ291bnRlcl0pLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgICAgICBpZiAodGhpcy5pZFRyZWVWaWV3c1tpZENvdW50ZXJdLmluZGV4T2YoXCJtYXN0ZXJcIikgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGNvdXJzZU51bWJlciA9IG1hc3RlclllYXI7XHJcbiAgICAgICAgICAgIGkgPSBiYWNoZWxvclllYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb3Vyc2VOdW1iZXIgPSBiYWNoZWxvclllYXI7XHJcbiAgICAgICAgICAgIGkgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjbnQgPSAwO1xyXG4gICAgICAgIGZvciAoaTsgaSA8IGNvdXJzZU51bWJlcjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY291cnNlc1tpXS5ncm91cHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBub2RlID0gdHJlZS5lbGVtZW50LmZpbmQoJ2xpLicgKyBjb3Vyc2VzTmFtZVtjbnRdKTtcclxuICAgICAgICAgICAgICAgIHRyZWVfYWRkX2xlYWZfY2hlY2tib3hfZXhhbXBsZV9jbGljayh0cmVlLCBub2RlLCBjb3Vyc2VzW2ldLmdyb3Vwc1tqXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY250Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlkQ291bnRlcisrO1xyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0Q29uZmlndXJhdGlvblByYWN0aWNlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZVByYWN0aWNlT3JnYW5pc2F0aW9uU2VjXCIpLnZhbHVlO1xyXG4gICAgbGV0IHR5cGVQcmFjdGljZVRleHQgPSBcItCj0YfQtdCx0L3QsNGPXCI7XHJcbiAgICBpZiAodHlwZVByYWN0aWNlID09PSBcImVkdWNhdGlvbmFsXCIpIHtcclxuICAgICAgICB0eXBlUHJhY3RpY2VUZXh0ID0gXCLQo9GH0LXQsdC90LDRj1wiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZVByYWN0aWNlID09PSBcImludGVybnNoaXBcIikge1xyXG4gICAgICAgIHR5cGVQcmFjdGljZVRleHQgPSBcItCf0YDQvtC40LfQstC+0LTRgdGC0LLQtdC90L3QsNGPXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlUHJhY3RpY2UgPT09IFwicHJlZGlwbG9tYVwiKSB7XHJcbiAgICAgICAgdHlwZVByYWN0aWNlVGV4dCA9IFwi0J/RgNC10LTQtNC40L/Qu9C+0LzQvdCw0Y9cIjtcclxuICAgIH1cclxuICAgIGxldCBlZHVMZXZlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0RWR1TGV2ZWxPcmdhbmlzYXRpb25TZWNcIikudmFsdWU7XHJcbiAgICBsZXQgZWR1Y2F0aW9uTGV2ZWxUZXh0ID0gXCLQkdCw0LrQsNC70LDQstGA0LjQsNGCXCI7XHJcbiAgICBpZiAoZWR1TGV2ZWwgPT09IFwiYmFjaGVsb3JcIikge1xyXG4gICAgICAgIGVkdWNhdGlvbkxldmVsVGV4dCA9IFwi0JHQsNC60LDQu9Cw0LLRgNC40LDRglwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZWR1Y2F0aW9uTGV2ZWxUZXh0ID0gXCLQnNCw0LPQuNGB0YLRgNCw0YLRg9GA0LBcIjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgaW5mb19hYm91dF9wcmFjdGljZSA9IHtcclxuICAgICAgICAndHlwZVByYWN0aWNlJzogdHlwZVByYWN0aWNlVGV4dCxcclxuICAgICAgICAneWVhcic6IHRoaXMuc2VsZWN0ZWRZZWFyLFxyXG4gICAgICAgICdlZHVfbGV2ZWwnOiBlZHVjYXRpb25MZXZlbFRleHRcclxuICAgIH07XHJcbiAgICByZXR1cm4gaW5mb19hYm91dF9wcmFjdGljZTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIHRyZWVfYWRkX2xlYWZfY2hlY2tib3godHJlZSwgbm9kZSwgbmFtZUxlYWYsIGlkVHlwZU9yZ2FuaXNhdGlvbikge1xyXG4gICAgdHJlZS5hZGRMZWFmKG5vZGUsIG5hbWVMZWFmLCB7XHJcbiAgICAgICAgbW9kZTogJ2NoZWNrYm94JyxcclxuICAgICAgICBjaGVja2VkOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgICBub2RlLmZpbmQoJ3VsJykuZmluZCgnbGknKS5sYXN0KClbMF0uc2V0QXR0cmlidXRlKFwiaWRcIiwgJ3R5cGVfb3JnXydcclxuICAgICAgICArIGlkVHlwZU9yZ2FuaXNhdGlvbik7XHJcbn1cclxuXHJcblZpZXcucHJvdG90eXBlLnNldFR5cGVzT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgICB2YXIgdHJlZVZpZXdPcmdhbmlzYXRpb25zID0gJChcclxuICAgICAgICBcIiNvcmdhbmlzYXRpb25zLXRyZWV2aWV3LXByYWN0aWNlLWNyZWF0aW9uXCIpLmRhdGEoXCJ0cmVldmlld1wiKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHlwZXNPcmdhbmlzYXRpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgbm9kZSA9IHRyZWVWaWV3T3JnYW5pc2F0aW9ucy5lbGVtZW50LmZpbmQoJ2xpLm5vZGUnKTtcclxuICAgICAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94KHRyZWVWaWV3T3JnYW5pc2F0aW9ucywgbm9kZSxcclxuICAgICAgICAgICAgdHlwZXNPcmdhbmlzYXRpb25baV0ubmFtZSwgdHlwZXNPcmdhbmlzYXRpb25baV0uaWQpO1xyXG4gICAgfVxyXG59O1xyXG5WaWV3LnByb3RvdHlwZS5jbGVhclR5cGVzT3JnYW5pc2F0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGxpQXJyYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAnb3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvbicpLmNoaWxkcmVuWzBdLmNoaWxkcmVuO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgcmVtb3ZlQ2hpbGRyZW4obGlBcnJheVtpXS5nZXRFbGVtZW50c0J5VGFnTmFtZSgndWwnKVswXSk7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnNldE9yZ2FuaXNhdGlvbnNJblRyZWVWaWV3ID0gZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgICB2YXIgdHJlZSA9ICQoXCIjb3JnYW5pc2F0aW9ucy10cmVldmlldy1wcmFjdGljZS1jcmVhdGlvblwiKS5kYXRhKFwidHJlZXZpZXdcIik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZ2FuaXNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHR5cGVzT3JnYW5pc2F0aW9uLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChvcmdhbmlzYXRpb25zW2ldLmlkX3R5cGVfb3JnYW5pc2F0aW9uID09PSB0eXBlc09yZ2FuaXNhdGlvbltqXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpQXJyID0gdHJlZS5lbGVtZW50LmZpbmQoJ2xpJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbm9kZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbGlBcnIubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGlBcnJba10uZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09ICgndHlwZV9vcmdfJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyB0eXBlc09yZ2FuaXNhdGlvbltqXS5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9ICQobGlBcnJba10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0cmVlX2FkZF9sZWFmX2NoZWNrYm94X2V4YW1wbGVfY2xpY2sodHJlZSwgbm9kZSxcclxuICAgICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuZ2V0SW5mb05ld09yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWxlY3RUeXBlQ29tcGFueVwiKTtcclxuICAgIHZhciB0eXBlT3JnID0gZS5vcHRpb25zW2Uuc2VsZWN0ZWRJbmRleF0udGV4dDtcclxuICAgIGxldCBvcmdhbmlzYXRpb24gPSB7XHJcbiAgICAgICAgJ25hbWUnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5hbWVDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICd0eXBlT3JnJzogdHlwZU9yZyxcclxuICAgICAgICAnaW5mb09yZyc6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mb0NvbXBhbnlcIikudmFsdWUsXHJcbiAgICAgICAgJ2VtYWlsT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbWFpbE9yZ1wiKS52YWx1ZSxcclxuICAgICAgICAncGhvbmVPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBob25lT3JnXCIpLnZhbHVlLFxyXG4gICAgICAgICdwbGFjZXNPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYWNlc0NvbXBhbnlcIikudmFsdWUsXHJcbiAgICAgICAgJ2xvZ2luT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbkNvbXBhbnlcIikudmFsdWUsXHJcbiAgICAgICAgJ3Bzd2RPcmcnOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBzd2RDb21wYW55XCIpLnZhbHVlLFxyXG4gICAgICAgICdhZGRyZXNzT3JnJzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhZGRyZXNzT3JnXCIpLnZhbHVlXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIG9yZ2FuaXNhdGlvbjtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLnNldFR5cGVzT3JnYW5pc2F0aW9uU2VsZWN0ID0gZnVuY3Rpb24gKHR5cGVzT3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgdHlwZU9yZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VsZWN0VHlwZUNvbXBhbnlcIik7XHJcbiAgICByZW1vdmVDaGlsZHJlbih0eXBlT3JnKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHlwZXNPcmdhbmlzYXRpb24ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgb3B0aW9uLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHR5cGVzT3JnYW5pc2F0aW9uW2ldLmlkKTtcclxuICAgICAgICBvcHRpb24uaW5uZXJIVE1MID0gdHlwZXNPcmdhbmlzYXRpb25baV0ubmFtZTtcclxuICAgICAgICB0eXBlT3JnLmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICB9XHJcbn07XHJcblZpZXcucHJvdG90eXBlLnNldE9yZ2FuaXNhdGlvbnNMaXN0ID0gZnVuY3Rpb24gKG9yZ2FuaXNhdGlvbnMsIGlkTGlzdCkge1xyXG4gICAgbGV0IGxpc3RPcmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZExpc3QpO1xyXG4gICAgcmVtb3ZlQ2hpbGRyZW4obGlzdE9yZyk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9yZ2FuaXNhdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsZXQgZGl2X2xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBkaXZfbGlzdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3RcIik7XHJcblxyXG4gICAgICAgIGxldCBkaXZfbGlzdF9jb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgZGl2X2xpc3RfY29udGVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3QtY29udGVudCBpbmxpbmUtYmxvY2tcIik7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3RfdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl9saXN0X3RpdGxlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdC10aXRsZVwiKTtcclxuICAgICAgICBzcGFuX2xpc3RfdGl0bGUuaW5uZXJIVE1MID0gb3JnYW5pc2F0aW9uc1tpXS5uYW1lO1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3RpdGxlKTtcclxuXHJcbiAgICAgICAgbGV0IHNwYW5fbGlzdF9zdWJ0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICBzcGFuX2xpc3Rfc3VidGl0bGUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXN1YnRpdGxlXCIpO1xyXG4gICAgICAgIHNwYW5fbGlzdF9zdWJ0aXRsZS5pbm5lckhUTUwgPSAn0JLRgdC10LPQviDQvNC10YHRgjogJyArIG9yZ2FuaXNhdGlvbnNbaV0ubWF4X3N0dWRlbnRzX251bWJlcjtcclxuICAgICAgICBkaXZfbGlzdF9jb250ZW50LmFwcGVuZENoaWxkKHNwYW5fbGlzdF9zdWJ0aXRsZSk7XHJcblxyXG4gICAgICAgIGxldCBzcGFuX2xpc3RfcmVtYXJrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fbGlzdF9yZW1hcmsuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJsaXN0LXJlbWFya1wiKTtcclxuICAgICAgICBzcGFuX2xpc3RfcmVtYXJrLmlubmVySFRNTCA9ICfQntGB0YLQsNC70L7RgdGMOiAnICsgb3JnYW5pc2F0aW9uc1tpXS5tYXhfc3R1ZGVudHNfbnVtYmVyO1xyXG4gICAgICAgIC8q0J7QkdCv0JfQkNCi0JXQm9Cs0J3QniDQmNCh0J/QoNCQ0JLQmNCi0Kwg0J3QkCDQmtCe0JvQmNCn0JXQodCi0JLQniDQntCh0KLQkNCS0KjQmNCl0KHQryDQnNCV0KHQoi4hISEhISEhISEhISEhISEhISEhISEhISEhISEqL1xyXG4gICAgICAgIGRpdl9saXN0X2NvbnRlbnQuYXBwZW5kQ2hpbGQoc3Bhbl9saXN0X3JlbWFyayk7XHJcblxyXG4gICAgICAgIGRpdl9saXN0LmFwcGVuZENoaWxkKGRpdl9saXN0X2NvbnRlbnQpO1xyXG5cclxuICAgICAgICBsZXQgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbmxpbmUtYmxvY2sgbGlzdC1jb250ZW50IHNldHRpbmdzT3JnYW5pc2F0aW9uXCIpO1xyXG5cclxuICAgICAgICBsZXQgc3Bhbl91c2VyX3BsdXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgc3Bhbl91c2VyX3BsdXMuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtaWYtdXNlci1wbHVzIG1pZi1sZyBmZy1ncmF5IGFkZC1zdHVkZW50LW9yZ2FuaXNhdGlvblwiKTtcclxuICAgICAgICAvL3NwYW5fdXNlcl9wbHVzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmFkZFN0dWRlbnRUb09yZ2FuaXNhdGlvbigpKTtcclxuICAgICAgICBkaXZfc2V0dGluZ3Nfb3JnYW5pc2F0aW9uLmFwcGVuZENoaWxkKHNwYW5fdXNlcl9wbHVzKTtcclxuXHJcbiAgICAgICAgbGV0IHNwYW5fcGVuY2lsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHNwYW5fcGVuY2lsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibWlmLXBlbmNpbCBtaWYtbGcgZmctZ3JheSBlZGl0LW9yZ2FuaXNhdGlvblwiKTtcclxuICAgICAgICBzcGFuX3BlbmNpbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgdGhpcy5vbkNsaWNrRWRpdE9yZ2FuaXNhdGlvbik7XHJcbiAgICAgICAgZGl2X3NldHRpbmdzX29yZ2FuaXNhdGlvbi5hcHBlbmRDaGlsZChzcGFuX3BlbmNpbCk7XHJcblxyXG4gICAgICAgIC8qIGxldCBzcGFuX2NhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgc3Bhbl9jYW5jZWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtaWYtY2FuY2VsIG1pZi1sZyBmZy15ZWxsb3dcIik7XHJcbiAgICAgICAgIGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24uYXBwZW5kQ2hpbGQoc3Bhbl9jYW5jZWwpOyovXHJcblxyXG4gICAgICAgIGRpdl9saXN0LmFwcGVuZENoaWxkKGRpdl9zZXR0aW5nc19vcmdhbmlzYXRpb24pO1xyXG5cclxuICAgICAgICBsaXN0T3JnLmFwcGVuZENoaWxkKGRpdl9saXN0KTtcclxuICAgIH1cclxufTtcclxuVmlldy5wcm90b3R5cGUuZ2V0TmFtZU9yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgbGV0IG5hbWVPcmdhbmlzYXRpb24gPSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLmNoaWxkcmVuWzBdLmlubmVySFRNTDtcclxuICAgIHJldHVybiBuYW1lT3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuVmlldy5wcm90b3R5cGUuc2hvd0RpYWxvZ09yZ2FuaXNhdGlvbiA9IGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmFtZUNvbXBhbnlcIikuaW5uZXJIVE1MPW9yZ2FuaXNhdGlvbi5uYW1lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvQ29tcGFueVwiKS5pbm5lckhUTUw9b3JnYW5pc2F0aW9uLmluZm9fb3JnYW5pc2F0aW9uO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwaG9uZU9yZ1wiKS5pbm5lckhUTUw9b3JnYW5pc2F0aW9uLnBob25lX29yZ2FuaXNhdGlvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1haWxPcmdcIikuaW5uZXJIVE1MPW9yZ2FuaXNhdGlvbi5lbWFpbF9vcmdhbmlzYXRpb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFkZHJlc3NPcmdcIikuaW5uZXJIVE1MPW9yZ2FuaXNhdGlvbi5hZGRyZXNzX29yZ2FuaXNhdGlvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGxhY2VzQ29tcGFueVwiKS5pbm5lckhUTUw9b3JnYW5pc2F0aW9uLm1heF9zdHVkZW50c19udW1iZXI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvZ2luQ29tcGFueVwiKS5pbm5lckhUTUw9b3JnYW5pc2F0aW9uLmxvZ2luX29yZ2FuaXNhdGlvbjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHN3ZENvbXBhbnlcIikuaW5uZXJIVE1MPW9yZ2FuaXNhdGlvbi5wc3dkX29yZ2FuaXNhdGlvbjtcclxuICAgIC8vLy8v0KPQodCi0JDQndCe0JLQmNCi0Kwg0JIg0JTQmNCQ0JvQntCTINCY0J3QpNCjINCe0JHQr9CX0JDQotCV0JvQrNCd0J4hISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhIVxyXG4gICAgbWV0cm9EaWFsb2cub3BlbignI2RpYWxvZ0NyZWF0ZUNvbXBhbnknKTtcclxufTtcclxuXHJcblZpZXcucHJvdG90eXBlLmRpc3BsYXlJbmZvQWJvdXRPcmcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsbE9yZ2FuaXNhdGlvbnNMaXN0QmxvY2tcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdHVkZW50c1JlcXVlc3RzXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5yZW5kZXJPcmdhbmlzYXRpb25TZWN0aW9uID0gZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JnYW5pc2F0aW9uTGlzdEN1cnJlbnRQcmFjdGljZVRleHRcIik7XHJcbiAgICBpZiAocHJhY3RpY2UubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgICAgdGV4dC5pbm5lckhUTUwgPSBcItCh0L/QuNGB0L7QuiDQvtGA0LPQsNC90LjQt9Cw0YbQuNC5INCyINC/0YDQsNC60YLQuNC60LVcIjtcclxuICAgIH1cclxuICAgIGVsc2UgdGV4dC5pbm5lckhUTUwgPSBcItCf0YDQsNC60YLQuNC60Lgg0L3QtSDRgdGD0YnQtdGB0YLQstGD0LXRgi5cIjtcclxuXHJcbn07XHJcblxyXG5WaWV3LnByb3RvdHlwZS5PcGVuT3JDbG9zZUxvYWRJbWFnZSA9IGZ1bmN0aW9uICgpIHtcclxuICBsZXQgZGlzcGxheT1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRcIikuc3R5bGUuZGlzcGxheTtcclxuICBpZihkaXNwbGF5PT09XCJibG9ja1wiKXtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZFwiKS5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO1xyXG4gIH1cclxuICBlbHNle1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkXCIpLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xyXG4gIH1cclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBWaWV3O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gcHVibGljL2pzL1ZpZXcuanMiLCJjb25zdCBTRVBURU1CRVIgPSA5O1xyXG5jb25zdCBmaXJzdENvdXJzZSA9IDA7XHJcbmNvbnN0IHNlY29uZENvdXJzZSA9IDE7XHJcbmNvbnN0IHRoaXJkQ291cnNlID0gMjtcclxuY29uc3QgZm91cnRoQ291cnNlID0gMztcclxuY29uc3QgbWFzdGVyRmlyc3RDb3Vyc2UgPSA0O1xyXG5jb25zdCBtYXN0ZXJTZWNvbmRDb3Vyc2UgPSA1O1xyXG5cclxudmFyIE1vZGVsID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5Hcm91cHMgPSBbXTtcclxuICAgIHRoaXMuU3R1ZGVudHMgPSBbXTtcclxuICAgIHRoaXMuQ291cnNlcyA9IFtdO1xyXG4gICAgdGhpcy50eXBlc09yZ2FuaXNhdGlvbiA9IFtdO1xyXG4gICAgdGhpcy5PcmdhbmlzYXRpb25zID0gW107XHJcbn07XHJcblxyXG5jbGFzcyBDb3Vyc2Uge1xyXG4gICAgY29uc3RydWN0b3IobmFtZUNvdXJzZSkge1xyXG4gICAgICAgIHRoaXMubmFtZUNvdXJzZSA9IG5hbWVDb3Vyc2U7XHJcbiAgICAgICAgdGhpcy5ncm91cHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRHcm91cChncm91cCkge1xyXG4gICAgICAgIHRoaXMuZ3JvdXBzLnB1c2goZ3JvdXApO1xyXG4gICAgfVxyXG59XHJcblxyXG5jbGFzcyBHcm91cCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1aWRfTERBUCwgbmFtZUdyb3VwKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZUdyb3VwO1xyXG4gICAgICAgIHRoaXMudWlkX0xEQVAgPSB1aWRfTERBUDtcclxuICAgICAgICB0aGlzLnN0dWRlbnRzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgYWRkU3R1ZGVudChzdHVkZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdHVkZW50cy5wdXNoKHN0dWRlbnQpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09U1RVREVOVFMgU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuTW9kZWwucHJvdG90eXBlLmdldERhdGEgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RzX29yZ2FuaXNhdGlvbnMpIHtcclxuICAgIGxldCBkYXRhID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IDA7IGkgPCB0aGlzLkdyb3Vwcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2VsZWN0ZWRHcm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IHNlbGVjdGVkR3JvdXBzW2pdKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzLmxlbmd0aDsgKytrLCArK2wpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNTdHVkZW50QXBwbHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnB1c2goe2dyb3VwOiB0aGlzLkdyb3Vwc1tpXS5uYW1lfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gPSAnICc7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgdyA9IDA7IHcgPCByZXF1ZXN0c19vcmdhbmlzYXRpb25zLmxlbmd0aDsgKyt3KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XS5sZW5ndGg7ICsrbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLmlkX3JlcXVlc3QgPT09ICtyZXF1ZXN0c19vcmdhbmlzYXRpb25zW3ddW25dLmlkX3JlcXVlc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2xdLnN0dWRlbnQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0uc3R1ZGVudF9VSUQgPSB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50c1trXS51aWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0uaWRfc3RhdHVzID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0uc3RhdHVzID0gcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5pZF9zdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uID0gcmVxdWVzdHNfb3JnYW5pc2F0aW9uc1t3XVtuXS5uYW1lX29yZ2FuaXNhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTdHVkZW50QXBwbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbbF0ub3JnYW5pc2F0aW9uICs9IHJlcXVlc3RzX29yZ2FuaXNhdGlvbnNbd11bbl0ubmFtZV9vcmdhbmlzYXRpb24gKyAnLCAnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1N0dWRlbnRBcHBseSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNTdHVkZW50QXBwbHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50ID0gdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10ubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5zdHVkZW50X1VJRCA9IHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLnVpZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtsXS5vcmdhbmlzYXRpb24gPSBcItCd0LUg0LfQsNC/0LjRgdCw0LvRgdGPXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGRhdGE7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0R3JvdXBzID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvcHJveHkvY29yZS92MS9ncm91cHMnKTtcclxuICAgIGxldCBsaXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIGxldCBncm91cHMgPSBsaXN0Ll9lbWJlZGRlZC5ncm91cHM7XHJcbiAgICByZXR1cm4gZ3JvdXBzO1xyXG59O1xyXG5cclxuLyrQv9C+0LvRg9GH0LDQtdC8INGB0YLRg9C00LXQvdGC0L7QsiDQuNC3INGF0YDQsNC90LjQu9C40YnQsCBMREFQINC/0L4gSUQg0LPRgNGD0L/Qv9GLKi9cclxuTW9kZWwucHJvdG90eXBlLmdldFN0dWRlbnRzQnlHcm91cElkID0gYXN5bmMgZnVuY3Rpb24gKGdyb3VwSUQpIHtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3Byb3h5L2NvcmUvdjEvZ3JvdXBzLycgKyBncm91cElEKTtcclxuICAgIGxldCBsaXN0ID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIGxldCBzdHVkZW50c0xpc3QgPSBsaXN0Ll9lbWJlZGRlZC5zdHVkZW50cztcclxuICAgIHJldHVybiBzdHVkZW50c0xpc3Q7XHJcbn07XHJcblxyXG4vKtC/0L7Qu9GD0YfQsNC10Lwg0LPRgNGD0L/Qv9GLINC4INC40YUg0YHRgtGD0LTQtdC90YLQvtCyINC40Lcg0YXRgNCw0L3QuNC70LjRidCwIExEQVAsINC+0LHQvdC+0LLQu9GP0LXQvCDRgtCw0LHQu9C40YbRgyBTdHVkZW50cyovXHJcbk1vZGVsLnByb3RvdHlwZS5pbml0ID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGdyb3VwcyA9IGF3YWl0IHRoaXMuZ2V0R3JvdXBzKCk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0aGlzLkdyb3Vwcy5wdXNoKG5ldyBHcm91cChncm91cHNbaV0uaWQsIGdyb3Vwc1tpXS5uYW1lKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDAsIG4gPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBsZXQgc3R1ZGVudHNMaXN0ID0gYXdhaXQgdGhpcy5nZXRTdHVkZW50c0J5R3JvdXBJZCh0aGlzLkdyb3Vwc1tpXS51aWRfTERBUCk7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzdHVkZW50c0xpc3QubGVuZ3RoOyArK2osIG4rKykge1xyXG4gICAgICAgICAgICBsZXQgc3R1ZGVudCA9IHtcclxuICAgICAgICAgICAgICAgICduYW1lJzogc3R1ZGVudHNMaXN0W2pdLmRpc3BsYXlOYW1lLFxyXG4gICAgICAgICAgICAgICAgJ3VpZCc6IHN0dWRlbnRzTGlzdFtqXS51aWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5Hcm91cHNbaV0uYWRkU3R1ZGVudChzdHVkZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9hd2FpdCB0aGlzLmNyZWF0ZU9yVXBkYXRlU3R1ZGVudHModGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldEN1cnJlbnRZZWFyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IGN1cnJlbnRZZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XHJcbiAgICByZXR1cm4gY3VycmVudFllYXI7XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZGlzdHJpYnV0ZUdyb3Vwc0J5Q291cnNlcyA9IGFzeW5jIGZ1bmN0aW9uIChjdXJyZW50WWVhcikge1xyXG4gICAgdGhpcy5Db3Vyc2VzID0gW1xyXG4gICAgICAgIG5ldyBDb3Vyc2UoJzEnKSxcclxuICAgICAgICBuZXcgQ291cnNlKCcyJyksXHJcbiAgICAgICAgbmV3IENvdXJzZSgnMycpLFxyXG4gICAgICAgIG5ldyBDb3Vyc2UoJzQnKSxcclxuICAgICAgICBuZXcgQ291cnNlKCcxICjQvNCzKScpLFxyXG4gICAgICAgIG5ldyBDb3Vyc2UoJzIgKNC80LMpJylcclxuICAgIF07XHJcbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBsZXQgY3VycmVudE1vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xyXG4gICAgaWYgKCtjdXJyZW50TW9udGggPCBTRVBURU1CRVIpIHtcclxuICAgICAgICBjdXJyZW50WWVhciAtPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5Hcm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Db3Vyc2VzW21hc3RlckZpcnN0Q291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ291cnNlc1tmaXJzdENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY3VycmVudFllYXItLTtcclxuICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKGN1cnJlbnRZZWFyLnRvU3RyaW5nKCkuc3Vic3RyKC0yKSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoXCLQvNCzXCIpICE9PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5Db3Vyc2VzW21hc3RlclNlY29uZENvdXJzZV0uYWRkR3JvdXAodGhpcy5Hcm91cHNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNvdXJzZXNbc2Vjb25kQ291cnNlXS5hZGRHcm91cCh0aGlzLkdyb3Vwc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50WWVhci0tO1xyXG4gICAgICAgIGlmICh0aGlzLkdyb3Vwc1tpXS5uYW1lLmluZGV4T2YoY3VycmVudFllYXIudG9TdHJpbmcoKS5zdWJzdHIoLTIpKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihcItC80LNcIikgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkNvdXJzZXNbdGhpcmRDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRZZWFyLS07XHJcbiAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUuaW5kZXhPZihjdXJyZW50WWVhci50b1N0cmluZygpLnN1YnN0cigtMikpICE9PSAtMSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZS5pbmRleE9mKFwi0LzQs1wiKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuQ291cnNlc1tmb3VydGhDb3Vyc2VdLmFkZEdyb3VwKHRoaXMuR3JvdXBzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN1cnJlbnRZZWFyICs9IDM7XHJcbiAgICB9XHJcbn07XHJcbk1vZGVsLnByb3RvdHlwZS5nZXRQcmFjdGljZSA9IGFzeW5jIGZ1bmN0aW9uIChpbmZvX2Fib3V0X3ByYWN0aWNlKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgaW5mb19hYm91dF9wcmFjdGljZSA9IFwiP3llYXI9XCIgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLnllYXIgKyBcIiZlZHVfbGV2ZWw9XCJcclxuICAgICAgICArIGluZm9fYWJvdXRfcHJhY3RpY2UuZWR1X2xldmVsICsgXCImdHlwZVByYWN0aWNlPVwiXHJcbiAgICAgICAgKyBpbmZvX2Fib3V0X3ByYWN0aWNlLnR5cGVQcmFjdGljZTtcclxuICAgIGxldCBpbmZvID0gMDtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3ByYWN0aWNlJyArIGluZm9fYWJvdXRfcHJhY3RpY2UsIHBhcmFtcylcclxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaW5mbyA9IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgcmV0dXJuIGluZm87XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0UmVxdWVzdHMgPSBhc3luYyBmdW5jdGlvbiAocHJhY3RpY2UsIGdyb3Vwcykge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCByZXF1ZXN0cyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBncm91cHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBsZXQgaW5mbyA9ICc/aWRfc3R1ZGVudD0nICsgZ3JvdXBzW2ldLnN0dWRlbnRzW2pdLnVpZCArIFwiJmlkX3ByYWN0aWNlPVwiXHJcbiAgICAgICAgICAgICAgICArIHByYWN0aWNlLmlkX3ByYWN0aWNlO1xyXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9maWx0ZXItcmVxdXN0cycgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICBpbmZvID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgICAgICAgICAgcmVxdWVzdHMucHVzaChpbmZvKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVxdWVzdHM7Ly/Qv9C+0LvRg9GH0LjQu9C4IGFsbCDQt9Cw0Y/QstC+0Log0YHRgtGD0LTQtdC90YLQvtCyINCy0YvQsdGA0LDQvdC90YvRhSDQs9GA0YPQv9C/XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuYXNzb3NpYXRlUmVxdWVzdFRvU3R1ZGVudCA9IGFzeW5jIGZ1bmN0aW9uIChyZXF1ZXN0cywgZ3JvdXBzKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBncm91cHMubGVuZ3RoOyArK2opIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLm5hbWUgPT09IGdyb3Vwc1tqXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLkdyb3Vwc1tpXS5zdHVkZW50cy5sZW5ndGg7ICsraykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG4gPSAwOyBuIDwgcmVxdWVzdHMubGVuZ3RoOyArK24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLnVpZCA9PT0gcmVxdWVzdHNbbl0udWlkX3N0dWRlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLmlkX3JlcXVlc3QgPSByZXF1ZXN0c1tuXS5pZF9yZXF1ZXN0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3RzW25dLmlkX29yZ2FuaXNhdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuR3JvdXBzW2ldLnN0dWRlbnRzW2tdLmlkX29yZ2FuaXNhdGlvbiA9IHJlcXVlc3RzW25dLmlkX29yZ2FuaXNhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRSZXF1ZXN0c09yZ2FuaXNhdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBtb2RlOiAnY29ycycsXHJcbiAgICAgICAgY2FjaGU6ICduby1jYWNoZScsXHJcbiAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbidcclxuICAgIH07XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9uc19ieV9yZXF1ZXN0ID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7ICsraikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHMubGVuZ3RoOyArK2spIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5mbyA9ICc/aWRfcmVxdWVzdD0nICsgdGhpcy5Hcm91cHNbaV0uc3R1ZGVudHNba10uaWRfcmVxdWVzdDtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb25zLWJ5LXJlcXVlc3QnICsgaW5mbywgcGFyYW1zKTtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBvcmdhbmlzYXRpb25zX2J5X3JlcXVlc3QucHVzaChpbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvcmdhbmlzYXRpb25zX2J5X3JlcXVlc3Q7XHJcbn07XHJcbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1QUkFDVElDRSBDUkVBVElPTlxyXG4gU0VDVElPTj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuTW9kZWwucHJvdG90eXBlLmdldFR5cGVzT3JnYW5pc2F0aW9uID0gYXN5bmMgZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy50eXBlc09yZ2FuaXNhdGlvbiA9IFtdO1xyXG4gICAgbGV0IHJlc3VsdCA9IGF3YWl0IGZldGNoKCcvdHlwZXMtb3JnYW5pc2F0aW9uJyk7XHJcbiAgICBsZXQgdHlwZXMgPSBhd2FpdCByZXN1bHQuanNvbigpO1xyXG4gICAgdGhpcy50eXBlc09yZ2FuaXNhdGlvbiA9IHR5cGVzO1xyXG4gICAgcmV0dXJuIHRoaXMudHlwZXNPcmdhbmlzYXRpb247XHJcbn07XHJcblxyXG5Nb2RlbC5wcm90b3R5cGUuZ2V0T3JnYW5pc2F0aW9ucyA9IGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbnMnKTtcclxuICAgIGxldCBvcmdzID0gYXdhaXQgcmVzdWx0Lmpzb24oKTtcclxuICAgIHRoaXMuT3JnYW5pc2F0aW9ucyA9IG9yZ3M7XHJcbiAgICByZXR1cm4gdGhpcy5PcmdhbmlzYXRpb25zO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldE9yZ2FuaXNhdGlvbnNCeVByYWN0aWNlSWQ9IGFzeW5jIGZ1bmN0aW9uIChwcmFjdGljZSkge1xyXG4gICAgbGV0IHBhcmFtcyA9IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcclxuICAgICAgICBjYWNoZTogJ25vLWNhY2hlJyxcclxuICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJ1xyXG4gICAgfTtcclxuICAgIGxldCBpbmZvID0gJz9pZF9wcmFjdGljZT0nICsgcHJhY3RpY2UuaWRfcHJhY3RpY2U7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb25zLWJ5LXByYWN0aWNlJyArIGluZm8sIHBhcmFtcyk7XHJcbiAgICBsZXQgb3JnYW5pc2F0aW9ucyA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9ucztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5nZXRPcmdhbmlzYXRpb25CeU5hbWU9IGFzeW5jIGZ1bmN0aW9uIChuYW1lT3JnYW5pc2F0aW9uKSB7XHJcbiAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnbm8tY2FjaGUnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnc2FtZS1vcmlnaW4nXHJcbiAgICB9O1xyXG4gICAgbGV0IGluZm8gPSAnP25hbWU9JyArIG5hbWVPcmdhbmlzYXRpb247XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9vcmdhbmlzYXRpb24tYnktbmFtZScgKyBpbmZvLCBwYXJhbXMpO1xyXG4gICAgbGV0IG9yZ2FuaXNhdGlvbiA9IGF3YWl0IHJlc3VsdC5qc29uKCk7XHJcbiAgICByZXR1cm4gb3JnYW5pc2F0aW9uO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmdldERldGVybWluZWRHcm91cHMgPSBhc3luYyBmdW5jdGlvbiAoc2VsZWN0ZWRHcm91cHMpIHtcclxuICAgIGxldCBkZXRlcm1pbmVkR3JvdXBzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuR3JvdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzZWxlY3RlZEdyb3Vwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5Hcm91cHNbaV0ubmFtZSA9PT0gc2VsZWN0ZWRHcm91cHNbal0pIHtcclxuICAgICAgICAgICAgICAgIGRldGVybWluZWRHcm91cHMucHVzaCh0aGlzLkdyb3Vwc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGV0ZXJtaW5lZEdyb3VwcztcclxufTtcclxuXHJcbk1vZGVsLnByb3RvdHlwZS5jcmVhdGVPclVwZGF0ZU9yZ2FuaXNhdGlvbiA9IGFzeW5jIGZ1bmN0aW9uIChvcmdhbmlzYXRpb24pIHtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL29yZ2FuaXNhdGlvbicsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KG9yZ2FuaXNhdGlvbilcclxuICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICBhbGVydChcItCe0YjQuNCx0LrQsCDQv9GA0Lgg0LTQvtCx0LDQstC70LXQvdC40Lgg0L7RgNCz0LDQvdC40LfQsNGG0LjQuCDQsiDQkdCUIFwiICsgZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZVByYWN0aWNlID0gYXN5bmMgZnVuY3Rpb24gKHByYWN0aWNlKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goJy9wcmFjdGljZScsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByYWN0aWNlKVxyXG4gICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwi0J7RiNC40LHQutCwINC/0YDQuCDQtNC+0LHQsNCy0LvQtdC90LjQuCDQv9GA0LDQutGC0LjQutC4INCyINCR0JQgXCIgKyBlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG59O1xyXG5cclxuTW9kZWwucHJvdG90eXBlLmNyZWF0ZU9yVXBkYXRlU3R1ZGVudHMgPSBhc3luYyBmdW5jdGlvbiAoc3R1ZGVudHMpIHtcclxuICAgIGxldCByZXN1bHQgPSBhd2FpdCBmZXRjaCgnL3N0dWRlbnRzJywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoc3R1ZGVudHMpXHJcbiAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgYWxlcnQoXCLQntGI0LjQsdC60LAg0L/RgNC4INC00L7QsdCw0LLQu9C10L3QuNC4IHVpZCDRgdGC0YPQtNC10L3RgtC+0LIg0LIg0JHQlCBcIiArIGVycm9yKTtcclxuICAgICAgICB9KTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBwdWJsaWMvanMvTW9kZWwuanMiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2Fzc2V0cy9jc3MvbWV0cm8uY3NzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1jb2xvcnMuY3NzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1pY29ucy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL21ldHJvLXNjaGVtZXMuY3NzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wdWJsaWMvYXNzZXRzL2Nzcy9tZXRyby1yZXNwb25zaXZlLmNzc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyByZW1vdmVkIGJ5IGV4dHJhY3QtdGV4dC13ZWJwYWNrLXBsdWdpblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcHVibGljL2pzL2xpYnMvRGF0YVRhYmxlcy9kYXRhdGFibGVzLm1pbi5jc3Ncbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3B1YmxpYy9hc3NldHMvY3NzL3N0eWxlLmNzc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7Ozs7OztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUdBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBYkE7QUFlQTtBQWpCQTtBQXVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBQ0E7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVEE7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7OztBQy9qQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFSQTtBQUNBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFUQTtBQUNBO0FBV0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUdBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUxBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDM1ZBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7Ozs7QUNBQTs7Ozs7O0FDQUE7Ozs7OztBQ0FBOzs7QSIsInNvdXJjZVJvb3QiOiIifQ==
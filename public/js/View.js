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
  this.idTreeViews = [
    'group-treeview-tabcontrol1-bachelor',
    'group-treeview-tabcontrol2-master',
    'groups-treeview-practice-creation-bachelor',
    'groups-treeview-practice-creation-master',
    'group-treeview-tabcontrol1-dialogAdd-bachelor',
    'group-treeview-tabcontrol2-dialogAdd-master'
  ];
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
  document.getElementsByClassName("btn-next")[0].addEventListener('click',
      this.onClickNextStepDisplayGroupsTreeView);
  document.querySelector("#dialogPracticeCompleteSuccess").querySelector(
      "#practiceFinishedOk").addEventListener('click',
      this.onClickPracticeCompleted);
  document.getElementById("organisationsSectionBtn").addEventListener('click',
      this.onClickToOrganisationsSection);
  document.getElementById("studentsSectionBtn").addEventListener('click',
      this.onClickToStudentsSection);
  document.getElementsByClassName("btn-finish")[0].addEventListener('click',
      this.onClickFinishBtn);
  document.getElementById("getGroupsBtnOk").addEventListener('click',
      this.onClickSelectGroupBtnOk);
  document.getElementById("buttonsArray").addEventListener('click',
      this.onClickYearsArray);
  document.getElementById("buttonsArray1").addEventListener('click',
      this.onClickYearsArray);
  document.getElementById("getOrganisationsBtnOk").addEventListener('click',
      this.onClickGetOrganisations);
  document.getElementById("createOrganisation").addEventListener('click',
      this.onClickCreateOrganisation);
  document.getElementById("practiceFinishedOk").addEventListener('click',
      this.onClickAddPractice);
  document.getElementById("showAllOrganisations").addEventListener('click',
      this.onClickDisplayOrganisations);
  document.getElementById("updateOrganisation").addEventListener('click',
      this.onClickUpdateOrganisation);
  document.getElementById("addStudentBtn").addEventListener('click',
      this.onClickAddStudentToOrganisation);
  document.getElementById("showDialogGenerateDocumentBtn").addEventListener(
      'click',
      this.onClickShowDialogGenerateDocument);
  document.getElementById("generateDocumentBtn").addEventListener('click',
      this.onClickGenerateDocument);
  document.getElementById("gdtypeDocument").addEventListener('change',
      this.onChangeTypeDocument);

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
    "columns": [
      {"data": "group"},
      {"data": "student"},
      {"data": "organisation"}
    ]
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
  document.getElementById("updateOrganisation").setAttribute("disabled",
      "true");
};

/*========================================PRACTICE SECTION==============================================*/
View.prototype.dialogPracticeCreatedInit = function () {
  let finishBtn = document.getElementsByClassName("btn-finish")[0];
  finishBtn.setAttribute("onclick",
      "metroDialog.open('#dialogPracticeCompleteSuccess')");
  let educationLevel = document.getElementById("selectEducation").value;
  if (educationLevel === "bachelor") {
    educationLevel = "Бакалавриат";
  }
  else {
    educationLevel = "Магистратура";
  }
  let typePractice = document.getElementById("selectTypePractice").value;

  let lecNum = document.getElementById("lecNum").value;
  let fromDate = document.getElementById("fromDateInput").value;
  let numWeeks = document.getElementById("textWeeks").innerHTML;
  let toDate = document.getElementById("toDateInput").value + ' ' + numWeeks;
  let deadline = document.getElementById("deadline").value;
  document.getElementById("termsPracticeDialog").innerHTML = 'c ' + fromDate
      + ' по ' + toDate;
  document.getElementById("deadlinePracticeDialog").innerHTML = deadline;
  document.getElementById("mainWindowTermsPractice").innerHTML = fromDate
      + ' - ' + toDate;
  if (fromDate === "") {
    fromDate = "2000-01-01 21:00:00.000 +00:00";
  }
  else {
    fromDate = fromDate.substr(8, 4) + '-' + fromDate.substr(4, 2) + '-'
        + fromDate.substr(0, 2) + ' ' + '21:00:00.000 +00:00';
  }
  if (toDate === "") {
    toDate = "2000-01-01 21:00:00.000 +00:00";
  }
  else {
    toDate = toDate.substr(8, 4) + '-' + toDate.substr(4, 2) + '-'
        + toDate.substr(0, 2) + ' ' + '21:00:00.000 +00:00';
  }
  if (deadline === "") {
    deadline = "2000-01-01 21:00:00.000 +00:00";
  }
  else {
    deadline = deadline.substr(8, 4) + '-' + deadline.substr(4, 2) + '-'
        + deadline.substr(0, 2) + ' ' + '21:00:00.000 +00:00';
  }

  let treeView = null;
  for (let i = 0; i < this.idTreeViews.length; i++) {
    if (this.idTreeViews[i].indexOf("practice") !== -1
        && document.getElementById(this.idTreeViews[i]).style.display
        === "block") {
      treeView = document.getElementById(this.idTreeViews[i]);
    }
  }
  let arrGroups = this.getSelectedGroups(treeView);
  let arrOrganisations = this.getSelectedGroups(
      document.getElementById("organisations-treeview-practice-creation"));

  document.getElementById("typePracticeDialog").innerHTML = typePractice;
  document.getElementById(
      "educationalLevelDialog").innerHTML = educationLevel;
  document.getElementById("groupsPracticeDialog").innerHTML = arrGroups;
  document.getElementById(
      "organisationsPracticeDialog").innerHTML = arrOrganisations;

  document.getElementById("mainWindowTypePractice").innerHTML = typePractice
      + " практика";

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

function roundPlus(x, n) { //x - число, n - количество знаков
  if (isNaN(x) || isNaN(n)) {
    return false;
  }
  var m = Math.pow(10, n);
  return Math.round(x * m) / m;
}

function getWeeks(first_date, second_date) {
  let first_array = first_date.match(
      /(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/);
  let second_array = second_date.match(
      /(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/);
  let first = Date.UTC(first_array[3], first_array[2] - 1, first_array[1]);
  let second = Date.UTC(second_array[3], second_array[2] - 1, second_array[1]);
  let weeks = (Math.ceil((second - first) / (1000 * 60 * 60 * 24))) / 7;
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
    let weeks = getWeeks(fromDate.value.replace(/\s+/g, '')
        + " 00:00", toDate.value.replace(/\s+/g, '') + " 00:00");
    text.style.display = "block";
    weeks = roundPlus(weeks, 1);
    text.innerHTML = "Количество недель: " + weeks;
    if (isInteger(weeks)) {
      text.setAttribute("class", "margin20 green");
    }
    else {
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
  }
  else {
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
    let inputs = document.getElementById(this.idTreeViews[i]).querySelectorAll(
        'input');
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

    document.getElementById("mainWindowTermsPractice").innerHTML = 'с '
        + start_date + ' по ' + end_date;
    let info_about_practice = this.getUserInfoAboutPractice();
    document.getElementById(
        "mainWindowTypePractice").innerHTML = info_about_practice.typePractice
        + ' практика';
  }
  else {
    document.getElementById("mainWindowTypePractice").innerHTML = "Практики"
        + " не существует.";
    document.getElementById("mainWindowTermsPractice").innerHTML = " ";
  }
};
View.prototype.getUserInfoAboutPractice = function () {
  let educationLevel = document.getElementsByClassName(
      "tabcontrol2")[0].getElementsByClassName("active")[0].children[0].text;
  let typePractice = document.getElementById("selectTypePracticeTab").value;
  let info_about_practice = {
    'typePractice': typePractice,
    'year': this.selectedYear,
    'edu_level': educationLevel
  };
  return info_about_practice;
};

View.prototype.getUserInfoAboutPracticeOrgSection = function () {
  let educationLevel = document.getElementById(
      "selectEduLevelOrganisationSec").value;
  let typePractice = document.getElementById(
      "selectTypePracticeOrganisationSec").value;
  let typePracticeText = "Учебная";
  if (typePractice === "educational") {
    typePracticeText = "Учебная";
  }
  else if (typePractice === "internship") {
    typePracticeText = "Производственная";
  }
  else if (typePractice === "prediploma") {
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
  }
  else {
    this.myTable.dataTable().fnClearTable();
    this.myTable.dataTable().fnAddData(data);
  }
};

View.prototype.colorTable = function (data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i].status === 1) {
      $(this.myTable.dataTable().fnGetNodes(i)).addClass("approved_stud");
      this.myTable.dataTable().fnGetNodes(i).children[0].setAttribute("class",
          "sorting_1 approved_stud");
    }
    if (data[i].status === 0) {
      $(this.myTable.dataTable().fnGetNodes(i)).addClass("applied_stud");
      this.myTable.dataTable().fnGetNodes(i).children[0].setAttribute("class",
          "sorting_1 applied_stud");
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
    if (target.className === 'item year' || target.className
        === 'item year current') {
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
    var liArray = document.getElementById(
        this.idTreeViews[id]).children[0].children;
    for (let i = 0; i < liArray.length; i++) {
      this.removeChildren(liArray[i].getElementsByTagName('ul')[0]);
    }
    id++;
  }
};
View.prototype.updateGroupsTreeView = async function (courses, groups) {
  let idCounter = 0, courseNumber = bachelorYear, cnt;
  let coursesName = ['first', 'second', 'third', 'fourth'];
  var i = 0;
  while (idCounter < this.idTreeViews.length) {
    var tree = $("#" + this.idTreeViews[idCounter]).data("treeview");
    if (this.idTreeViews[idCounter].indexOf("master") !== -1) {
      courseNumber = masterYear;
      i = bachelorYear;
    }
    else {
      courseNumber = bachelorYear;
      i = 0;
    }
    cnt = 0;
    for (i; i < courseNumber; i++) {
      for (let j = 0; j < courses[i].groups.length; j++) {
        let node = tree.element.find('li.' + coursesName[cnt]);

        if (this.idTreeViews[idCounter]
            === "group-treeview-tabcontrol1-dialogAdd-bachelor"
            || this.idTreeViews[idCounter]
            === "group-treeview-tabcontrol2-dialogAdd-master") {
          node[0].getElementsByTagName("input")[0].setAttribute("disabled",
              "disabled");
          await  tree_add_leaf_checkbox_example_click(tree, node,
              courses[i].groups[j]);
          let elem = node.find('ul')[0].children[node.find(
              'ul')[0].children.length - 1];
          $(elem).addClass("collapsed");
          elem.getElementsByTagName("input")[0].setAttribute("disabled",
              "disabled");
          let students = 0;
          for (let k = 0; k < groups.length; k++) {
            if (courses[i].groups[j] === groups[k].name) {
              students = groups[k].students;
              break;
            }
          }
          for (let k = 0; k < students.length; k++) {
            await tree_add_leaf_checkbox_example_click(tree, $(elem),
                students[k].name, students[k].uid);
          }
          let inputs = elem.querySelectorAll('[data-uid]');
          for (let k = 0; k < inputs.length; k++) {
            inputs[k].getElementsByTagName("input")[0].setAttribute("disabled",
                "disabled");
          }
        }
        else {
          await tree_add_leaf_checkbox_example_click(tree, node,
              courses[i].groups[j]);
        }
      }
      cnt++;
    }
    idCounter++;
  }
};
View.prototype.myUpdateTreeView = async function (courses, id) {
  let courseNumber = bachelorYear, n;
  let coursesName = ['first', 'second', 'third', 'fourth'];
  var i = 0;

  var tree = $("#" + id).data("treeview");
  if (id.indexOf("master") !== -1) {
    courseNumber = masterYear;
    i = bachelorYear;
  }
  else {
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
  let typePractice = document.getElementById(
      "selectTypePracticeOrganisationSec").value;
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
  node.find('ul').find('li').last()[0].setAttribute("id", 'type_org_'
      + idTypeOrganisation);
}

View.prototype.setTypesOrganisation = function (typesOrganisation) {
  var treeViewOrganisations = $(
      "#organisations-treeview-practice-creation").data("treeview");
  for (let i = 0; i < typesOrganisation.length; i++) {
    let node = treeViewOrganisations.element.find('li.node');
    tree_add_leaf_checkbox(treeViewOrganisations, node,
        typesOrganisation[i].name, typesOrganisation[i].id);
  }
};
View.prototype.clearTypesOrganisation = function () {
  var liArray = document.getElementById(
      'organisations-treeview-practice-creation').children[0].children;
  for (let i = 0; i < liArray.length; i++) {
    this.removeChildren(liArray[i].getElementsByTagName('ul')[0]);
  }
};
View.prototype.setOrganisationsInTreeView = function (organisations,
    typesOrganisation) {
  var tree = $("#organisations-treeview-practice-creation").data("treeview");
  for (let i = 0; i < organisations.length; i++) {
    for (let j = 0; j < typesOrganisation.length; j++) {
      if (organisations[i].id_type_organisation === typesOrganisation[j].id) {
        let liArr = tree.element.find('li');
        let node;
        for (let k = 0; k < liArr.length; k++) {
          if (liArr[k].getAttribute("id") === ('type_org_'
                  + typesOrganisation[j].id)) {
            node = $(liArr[k]);
            break;
          }
        }
        tree_add_leaf_checkbox_example_click(tree, node,
            organisations[i].name);
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
      div_list_content.addEventListener("click",
          this.onClickDisplayInfoAboutOrg);
    }

    let span_list_title = document.createElement('span');
    span_list_title.setAttribute("class", "list-title");
    span_list_title.setAttribute("id_organisation", organisations[i].id);
    span_list_title.innerHTML = organisations[i].name;
    div_list_content.appendChild(span_list_title);

    let span_list_subtitle = document.createElement('span');
    span_list_subtitle.setAttribute("class", "list-subtitle");
    span_list_subtitle.innerHTML = 'Всего мест: '
        + organisations[i].max_students_number;
    div_list_content.appendChild(span_list_subtitle);

    let span_list_remark = document.createElement('span');
    span_list_remark.setAttribute("class", "list-remark");
    span_list_remark.innerHTML = 'Осталось: '
        + organisations[i].max_students_number;
    /*ОБЯЗАТЕЛЬНО ИСПРАВИТЬ НА КОЛИЧЕСТВО ОСТАВШИХСЯ МЕСТ.!!!!!!!!!!!!!!!!!!!!!!!!!!!*/
    div_list_content.appendChild(span_list_remark);

    div_list.appendChild(div_list_content);

    let div_settings_organisation = document.createElement('div');
    div_settings_organisation.setAttribute("class",
        "inline-block list-content settingsOrganisation");
    if (idList === "organisationList") {
      let span_user_plus = document.createElement('span');
      span_user_plus.setAttribute("class",
          "mif-user-plus mif-lg fg-gray add-student-organisation");
      span_user_plus.addEventListener("click",
          this.onClickAddStudentToOrganisationShowDialog);
      div_settings_organisation.appendChild(span_user_plus);
    }

    let span_pencil = document.createElement('span');
    span_pencil.setAttribute("class",
        "mif-pencil mif-lg fg-gray edit-organisation");
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
  }
  else {
    idOrganisation = event.target.parentElement.parentElement.children[0].children[0].getAttribute(
        "id_organisation");
  }
  return idOrganisation;
};

View.prototype.getNameOrganisationInTreeview = function (idTreeview) {
  let parent = document.getElementById(idTreeview);
  let nameOrganisation = parent.getElementsByClassName(
      "active")[0].querySelector('[id_organisation').innerHTML;
  return nameOrganisation;
};

View.prototype.showDialogOrganisation = function (organisation) {
  document.getElementById("nameCompany").value = organisation.name;
  document.getElementById("idCompany").innerHTML = organisation.id;
  document.getElementById("infoCompany").value = organisation.info_organisation;
  document.getElementById("phoneOrg").value = organisation.phone_organisation;
  document.getElementById("emailOrg").value = organisation.email_organisation;
  document.getElementById(
      "addressOrg").value = organisation.address_organisation;
  document.getElementById(
      "placesCompany").value = organisation.max_students_number;
  document.getElementById(
      "loginCompany").value = organisation.login_organisation;
  document.getElementById("pswdCompany").value = organisation.pswd_organisation;
  metroDialog.open('#dialogCreateCompany');
};
View.prototype.dialogOpen = function (id) {
  metroDialog.open(id);
};
View.prototype.updateOrganisationTitle = function (nameOrganisation,
    approved_student_count, non_approved_student_count) {
  if (non_approved_student_count === 0) {
    document.getElementById("nonApprovedStudentListTitle").innerHTML = ", пуст";
  }
  else {
    document.getElementById("nonApprovedStudentListTitle").innerHTML = "";
  }
  document.getElementById("orgName").innerHTML = nameOrganisation;

  if (approved_student_count === 0) {
    document.getElementById(
        "approvedStudentListTitle").innerHTML = "Список утвержденных студентов пуст.";
  }
  else {
    document.getElementById(
        "approvedStudentListTitle").innerHTML = "Список утвержденных студентов.";
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
    div_settings_organisation.setAttribute("class",
        "inline-block list-content settingsOrganisation");

    if (idList !== "approvedStudents") {
      let span_student_approve = document.createElement('span');
      span_student_approve.setAttribute("class",
          "mif-checkmark mif-lg fg-green");
      span_student_approve.addEventListener("click",
          this.onClickApproveStudent);
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
  }
  else {
    text.innerHTML = "Практики не существует.";
  }
};

View.prototype.OpenOrCloseLoader = function () {
  let display = document.getElementById("load").style.display;
  if (display === "block") {
    document.getElementById("load").style.display = "none";
  }
  else {
    document.getElementById("load").style.display = "block";
  }
};
View.prototype.getSelectedStudent = function (event) {
  let node = event.target.parentElement.parentElement.querySelector(
      '[request]');
  let student = {
    'id_request': node.getAttribute("request"),
    'uid_student': node.getAttribute("uid"),
    'id_organisation': node.getAttribute("org")
  };

  if (event.target.getAttribute("class").indexOf("mif-cancel") === 0) {
    student['id_status'] = 2;
  }
  else {
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
  document.getElementById("createPracticeBtn").addEventListener('click',
      this.onClickCreatePractice);
};

View.prototype.getSelectedStudents = function (event) {
  let Students = [];
  let nodes = event.target.parentElement.querySelectorAll('input:checked');
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].parentElement.nextSibling.innerHTML.indexOf("курс") === -1
        && isNaN(+nodes[i].parentElement.nextElementSibling.innerHTML.substr(0,
            2))) {
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
        if (course.getAttribute("data-mode") === "checkbox"
            && course.getAttribute("class").indexOf("active-course") === -1) {
          $(course).addClass("active-course");
        }
        inputs[i].removeAttribute("disabled");
        let studentsCheckboxes = inputs[i].parentElement.parentElement.querySelectorAll(
            '[data-uid]');
        for (let n = 0; n < studentsCheckboxes.length; n++) {
          studentsCheckboxes[n].querySelector('input').removeAttribute(
              "disabled");
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
  return (day + '.' + month + '.' + year);
};

View.prototype.getInformationForDocumentOrder = function (practice,
    selectedGroups, allGroups, data, organisations) {
  let groupsForDocument = [];
  let educational_level = this.getEducationalLevel();
  let blockTeachers = document.getElementById(
      "order-block").getElementsByTagName('div');
  let teachers = [];
  for (let i = 0; i < blockTeachers.length; i++) {
    let groupName = blockTeachers[i].children[0].innerHTML;
    let teacher = blockTeachers[i].children[1].value;
    for (let j = 0; j < selectedGroups.length; j++) {
      if (selectedGroups[j] === groupName) {
        teachers.push(
            {
              "teacher": teacher,
              "groupName": groupName
            }
        );
      }
    }
  }
  for (let i = 0; i < selectedGroups.length; i++) {
    for (let j = 0; j < this.infoGroups.length; j++) {
      if (selectedGroups[i].indexOf(this.infoGroups[j].name) !== -1
          && this.infoGroups[j].type === educational_level) {
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
  let type_document = document.getElementById(
      "gdtypeDocument").options[document.getElementById(
      "gdtypeDocument").selectedIndex].value;
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
  }
  else if (typePractice === "производственной") {
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
                  organisations[n].students.push({"name": student});
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
          let str = JSON.stringify(organisations[j],
              ["organization_name", "teacher"]);
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
  else {
    alert(
        "Возможность генерации документов для преддипломной практики в стадии разработки. Приносим свои извинения за предоставленные неудобства")
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
  }
  else {
    return "master";
  }
};
View.prototype.getInformationForDocumentReport = function (practice,
    selectedGroups, allGroups) {
  let educational_level = this.getEducationalLevel();
  let groupsForDocument = [];
  let blockGroups = document.getElementById(
      "groups-report-block").getElementsByClassName('group');
  let additional_info = [];
  for (let i = 0; i < blockGroups.length; i++) {
    let groupName = blockGroups[i].getElementsByTagName('h4')[0].innerHTML;
    let supervisor = blockGroups[i].getElementsByClassName(
        "supervisor")[0].value;
    let good_students_number = blockGroups[i].getElementsByClassName(
        "good_students")[0].value;
    let teacher_number = blockGroups[i].getElementsByClassName(
        "teacher_number")[0].value;
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
      if (selectedGroups[i].indexOf(this.infoGroups[j].name) !== -1
          && this.infoGroups[j].type === educational_level) {
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
  let value = document.getElementById(id).options[document.getElementById(
      id).selectedIndex].value;
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
  return this.substr(0, index) + replacement + this.substr(index
      + replacement.length);
};

module.exports = View;

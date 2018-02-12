const NUM_OF_COURSES = 4;
const masterYear = 6;
var selectedElem = 0;

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
    this.groupNamesArr = ["ПРИ", "МОА", "ИВТ1", "ИВТ2", "ИВТ3"];
    this.idTreeViews = [
        'group-treeview-tabcontrol1',
        'group-treeview-tabcontrol2',
        'groups-treeview-practice-creation'
    ];
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
    ;
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
}

View.prototype.goToOrganisationsSection = function () {
    document.querySelector("#practiceCreationSection").style.display = "none";
    document.querySelector("#mainWindowSection").style.display = "none";
    document.querySelector("#organisationsSection").style.display = "block";
}

View.prototype.goToPracticeCreation = function () {
    document.querySelector("#practiceCreationSection").style.display = "block";
    document.querySelector("#mainWindowSection").style.display = "none";
}
/*========================================PRACTICE CREATION SECTION==============================================*/
View.prototype.dialogPracticeCreatedInit = function () {
    let finishBtn = document.getElementsByClassName("btn-finish")[0];
    finishBtn.setAttribute("onclick", "metroDialog.open('#dialogPracticeCompleteSuccess')");

    let educationLevel = document.getElementById("selectEducation").value;
    let typePracticeText = "Учебная";
    let typePractice = document.getElementById("selectTypePractice").value;
    let educationLevelText = "Бакалавриат";
    if (educationLevel === "bachelor") {
        educationLevelText = "Бакалавриат";
    }
    else {
        educationLevelText = "Магистратура";
    }

    let fromDate = document.getElementById("fromDateInput").value;
    let toDate = document.getElementById("toDateInput").value;
    let deadline = document.getElementById("deadline").value;

    if (typePractice === "educational") {
        typePracticeText = "Учебная";
    }
    else if (typePractice === "internship") {
        typePracticeText = "Производственная";
    }
    else if (typePractice === "prediploma") {
        typePracticeText = "Преддипломная";
    }

    let arrGroups = [];
    for (let i = 1; i < NUM_OF_COURSES + 1; i++) {
        let groups = document.querySelectorAll('li[data-name="c' + i + '"')[0].querySelectorAll('input:checked');
        if (groups.length != 0) {
            for (let j = 0; j < groups.length; j++) {
                let group = groups[j].parentElement.nextElementSibling.innerHTML;
                if (group.indexOf("курс") === -1)
                    arrGroups.push(group);
            }
        }
    }
    let arrOrganisations = [];
    for (let i = 6; i < 8 + 1; i++) {
        let liOrganisations = document.querySelectorAll('li[data-name="c' + i + '"')[0];
        let organisations = liOrganisations.querySelectorAll('input:checked');

        if (organisations.length != 0) {
            for (let j = 0; j < organisations.length; j++) {
                if (organisations[j].className != "indeterminate") {
                    let organisation = organisations[j].parentElement.nextElementSibling.innerHTML;
                    arrOrganisations.push(organisation);
                }
            }
        }
    }
    /*----------------------------INIT DIALOG-------------------------------*/
    document.getElementById("typePracticeDialog").innerHTML = typePracticeText;
    document.getElementById("educationalLevelDialog").innerHTML = educationLevelText;
    document.getElementById("termsPracticeDialog").innerHTML = 'c ' + fromDate + ' по ' + toDate;
    document.getElementById("deadlinePracticeDialog").innerHTML = deadline;
    document.getElementById("groupsPracticeDialog").innerHTML = arrGroups;
    document.getElementById("organisationsPracticeDialog").innerHTML = arrOrganisations;

    /*----------------------------INIT MAINWINDOW-------------------------------*/
    document.getElementById("mainWindowTypePractice").innerHTML = typePracticeText + " практика";
    document.getElementById("mainWindowTermsPractice").innerHTML = fromDate + ' - ' + toDate;

}
View.prototype.renderEduLevel = function () {
    let stepTextValue = document.getElementById("stepText").innerHTML;
    let treeViewGroups = document.getElementById("groups-treeview-practice-creation");
    let liArrayGroups = treeViewGroups.getElementsByClassName("course");
    let educationLevel = document.getElementById("selectEducation").value;
    switch (+stepTextValue) {
        case 1:
            break;
        case 2:
            if (educationLevel === "bachelor") {
                for (let i = 0; i < 4; i++) {
                    liArrayGroups[i].style.display = "block";
                }
            }
            else {
                liArrayGroups[2].style.display = "none";
                liArrayGroups[3].style.display = "none";
            }
            break;
    }
}
/*============================================STUDENTS SECTION=====================================================*/
View.prototype.renderInfo = function () {
    let typePractice = document.getElementById("selectTypePracticeTab").value;
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
    document.getElementById("mainWindowTypePractice").innerHTML = typePracticeText + ' практика';
}
View.prototype.renderTable = function (data) {
    if (data.length === 0) {
        this.myTable.dataTable().fnClearTable();
    }
    else {
        this.myTable.dataTable().fnClearTable();
        this.myTable.dataTable().fnAddData(data);
    }
}

View.prototype.changeYear = function (node) {
    if (selectedElem) {
        selectedElem.classList.remove('current');
    }
    selectedElem = node;
    selectedElem.classList.add('current');
    this.selectedYear = selectedElem.innerHTML;
}

View.prototype.updateYear = function (event) {
    var target = event.target;
    while (target != buttonsArray) {
        if (target.className == 'item year') {
            this.changeYear(target);
            return;
        }
        target = target.parentNode;
    }
}

View.prototype.getSelectedGroups = function () {
    let frames = document.getElementsByClassName("frames")[0].children, treeView;
    for (let i = 0; i < frames.length; i++) {
        if (frames[i].style.display == "block") {
            treeView = frames[i].children[0];
            break;
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
}

function tree_add_leaf_checkbox_example_click(tree, node, nameLeaf) {
    tree.addLeaf(node, nameLeaf, {
        mode: 'checkbox',
        checked: (Math.round(Math.random()) === 0 ? false : true)
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
}
View.prototype.updateGroupsTreeView = function (courses) {
    console.log(courses);
    let idsTreeview = ["#groups-treeview-practice-creation", "#group-treeview-tabcontrol1", "#group-treeview-tabcontrol2"],
        idCounter = 0, courseNumber = 4, cnt;
    let coursesName = ['first', 'second', 'third', 'fourth'];
    var i = 0;
    while (idCounter < idsTreeview.length) {
        cnt = 0;
        var tree = $(idsTreeview[idCounter]).data("treeview");
        for (i; i < courseNumber; i++) {
            for (let j = 0; j < courses[i].groups.length; j++) {
                console.log(courses[i].groups[j]);
                let node = tree.element.find('li.' + coursesName[cnt]);
                tree_add_leaf_checkbox_example_click(tree, node, courses[i].groups[j]);
            }
            cnt++;
        }
        idCounter++;
        if (idCounter > 1) {
            courseNumber = masterYear;
            i = masterYear - 2;
        }
        else {
            i = 0;
        }
    }

}
var View = new View();

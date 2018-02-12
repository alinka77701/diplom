const SEPTEMBER = 9;
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
/*============================================STUDENTS SECTION=====================================================*/
Model.prototype.getStudents = async function (groups) {
    this.Groups = groups;
    this.Students = [];
    let groupsUIDS = await this.getGroupsUIDS();
    if (groupsUIDS != 0) {
        for (let i = 0, n = 0; i < groupsUIDS.length; ++i) {
            let studentsList = await this.getStudentsByGroupId(groupsUIDS[i]);
            for (let j = 0; j < studentsList.length; ++j, n++) {
                this.Students.push({group: this.Groups[i]});
                this.Students[n].student = studentsList[j].displayName;
                this.Students[n].organisation = j;
            }
        }
    }
};
Model.prototype.getAllGroups = async function () {
    let groups = [];
    let result = await fetch('/proxy/core/v1/groups')
        .then(async function (response) {
            return await response.json();
        })
        .then(function (response) {
            groups = response._embedded.groups;
        });
    return groups;
}

Model.prototype.myGetYear = function () {
    let date = new Date();
    let currentYear = date.getFullYear().toString();
    return currentYear;
}

Model.prototype.getGroups = async function (currentYear) {
    this.Courses = [
        new Course('1'),
        new Course('2'),
        new Course('3'),
        new Course('4'),
        new Course('1 (мг)'),
        new Course('2 (мг)')
    ];

    let groups = await this.getAllGroups();
    let currentGroups = [];
    for (let i = 0; i < groups.length; i++) {
        if (groups[i].finishedEducation === false) {
            currentGroups.push(groups[i]);
        }
    }
    let date = new Date();
    let currentMonth = date.getMonth();
    if (+currentMonth < SEPTEMBER) {
        currentYear -= 1;
    }

    for (let i = 0; i < currentGroups.length; i++) {
        if (currentGroups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
            if (currentGroups[i].name.indexOf("мг") !== -1) {
                this.Courses[4].addGroup(currentGroups[i].name);
            }
            else {
                this.Courses[0].addGroup(currentGroups[i].name);
            }
        }
        currentYear--;
        if (currentGroups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
            if (currentGroups[i].name.indexOf("мг") !== -1) {
                this.Courses[5].addGroup(currentGroups[i].name);
            }
            else {
                this.Courses[1].addGroup(currentGroups[i].name);
            }
        }
        currentYear--;
        if (currentGroups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
            this.Courses[2].addGroup(currentGroups[i].name);
        }
        currentYear--;
        if (currentGroups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
            this.Courses[3].addGroup(currentGroups[i].name);
        }
        currentYear += 3;
    }
}

Model.prototype.getGroupsUIDS = async function () {
    let groupsUIDS = [];
    for (let i = 0; i < this.Groups.length; ++i) {
        let groupName = this.Groups[i];
        console.log(groupName);
        let result = await fetch('/proxy/core/v1/groups?name=' + groupName)
            .then(async function (response) {
                return await response.json();
            })
            .then(function (response) {
                this.groups = response;
                let groupID = response._embedded.groups[0].id;
                groupsUIDS.push(groupID);
            })
            .catch(error => {
                alert("Группа " + groupName + " не существует.");
            });
    }
    return groupsUIDS;
}

Model.prototype.getStudentsByGroupId = async function (groupID) {
    let studentsList = [];
    let result = await fetch('/proxy/core/v1/groups/' + groupID)
        .then(async function (response) {
            return await response.json();
        })
        .then(function (response) {
            studentsList = response._embedded.students;
        })
        .catch(error => {
            alert(error);
        });
    ;
    return studentsList;
}
/*============================================ORGANISATION SECTION=====================================================*/

var Model = new Model();

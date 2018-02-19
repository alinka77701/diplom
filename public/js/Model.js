const SEPTEMBER = 9;
const firstCourse=0;
const secondCourse = 1;
const thirdCourse=2;
const fourthCourse = 3;
const masterFirstCourse=4;
const masterSecondCourse=5;

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

/*============================================STUDENTS SECTION=====================================================*/
Model.prototype.getStudents = async function (groups) {

 //await query.getDataFromTable(model.Types_practice);
  debugger;
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

Model.prototype.distributeGroupsByCourses = async function (currentYear) {
  this.Courses = [
    new Course('1'),
    new Course('2'),
    new Course('3'),
    new Course('4'),
    new Course('1 (мг)'),
    new Course('2 (мг)')
  ];

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
      }
      else {

        this.Courses[firstCourse].addGroup(groups[i].name);
      }
    }
    currentYear--;
    if (groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
      if (groups[i].name.indexOf("мг") !== -1) {
        this.Courses[masterSecondCourse].addGroup(groups[i].name);
      }
      else {
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
}

Model.prototype.getGroupsUIDS = async function () {
  let groupsUIDS = [];
  for (let i = 0; i < this.Groups.length; ++i) {
    let groupName = this.Groups[i];
    let result = await fetch('/proxy/core/v1/groups?name=' + groupName)
    .then(async function (response) {
      return await response.json();
    })
    .then(function (response) {
      let groups = response;
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

Model.prototype.getTypesOrganisation= async function () {

}

module.exports = Model;
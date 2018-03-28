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
  this.typesOrganisation=[];
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
};

Model.prototype.myGetYear = function () {
  let date = new Date();
  let currentYear = date.getFullYear().toString();
  return currentYear;
};

Model.prototype.distributeGroupsByCourses = async function (currentYear) {
 delete this.Courses;
  this.Courses = [
    new Course('1'),
    new Course('2'),
    new Course('3'),
    new Course('4'),
    new Course('1 (мг)'),
    new Course('2 (мг)')
  ];
console.log(this.Courses );
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
};

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
  return studentsList;
};
/*============================================PRACTICE CREATION
 SECTION=====================================================*/
Model.prototype.getTypesOrganisation = async function () {
  this.typesOrganisation = [];
  let types=[];
  let result = await fetch('/types-organisation')
  .then(async function (response) {
    return await response.json();
  })
  .then(function (response) {
    types=response;
  });
  this.typesOrganisation=types;
  return this.typesOrganisation;
};
Model.prototype.getOrganisations = async function () {
  let orgs=[];
  let result = await fetch('/organisations')
  .then(async function (response) {
    return await response.json();
  })
  .then(function (response) {
    orgs=response;
  });
  console.log(orgs);
  this.Organisations=orgs;
  return this.Organisations;
};

Model.prototype.createOrUpdateOrganisation = async function (organisation) {
  let result = await fetch('/organisation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(organisation)
  })
  .catch(function (error) {
    alert("Ошибка при добавлении организации в БД "+ error);
  });
};

Model.prototype.createPractice = async function (practice) {
  let result = await fetch('/practice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(practice)
  })
  .catch(function (error) {
    alert("Ошибка при добавлении практики в БД "+ error);
  });
};

module.exports = Model;

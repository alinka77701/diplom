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
Model.prototype.getData = async function (selectedGroups,
                                          requests_organisations) {
    let data = [];
    for (let i = 0, l = 0; i < this.Groups.length; ++i) {
        for (let j = 0; j < selectedGroups.length; ++j) {
            if (this.Groups[i].name === selectedGroups[j]) {
                for (let k = 0; k < this.Groups[i].students.length; ++k, ++l) {
                    let isStudentApply = false;
                    data.push({group: this.Groups[i].name});
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
                                }
                                else {
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
    this.Courses = [
        new Course('1'),
        new Course('2'),
        new Course('3'),
        new Course('4'),
        new Course('1 (мг)'),
        new Course('2 (мг)')
    ];
    let date = new Date();
    let currentMonth = date.getMonth();
    if (+currentMonth < SEPTEMBER) {
        currentYear -= 1;
    }

    for (let i = 0; i < this.Groups.length; i++) {
        if (this.Groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
            if (this.Groups[i].name.indexOf("мг") !== -1) {
                this.Courses[masterFirstCourse].addGroup(this.Groups[i].name);
            }
            else {
                this.Courses[firstCourse].addGroup(this.Groups[i].name);
            }
        }
        currentYear--;
        if (this.Groups[i].name.indexOf(currentYear.toString().substr(-2)) !== -1) {
            if (this.Groups[i].name.indexOf("мг") !== -1) {
                this.Courses[masterSecondCourse].addGroup(this.Groups[i].name);
            }
            else {
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
    info_about_practice = "?year=" + info_about_practice.year + "&edu_level="
        + info_about_practice.edu_level + "&typePractice="
        + info_about_practice.typePractice;
    let info = 0;
    let result = await fetch('/practice' + info_about_practice, params)
        .then((response) => {
            info = response.json();
        })
        .catch((response) => {
            console.log(response);
        });
    return info;
};
Model.prototype.getRequestByStudentUID = async function (practice, student) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = '?uid=' + student.uid + "&id_practice="
        + practice.id_practice;
    let result = await fetch('/requst-by-student-uid' + info, params);
    let request = await result.json();
    return request;
};

Model.prototype.updateIdOrganisationInRequest = async function (student) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let info = '?id_request=' + student.id_request+ "&id_organisation="
        + student.id_organisation;
    let result = await fetch('/update-request' + info, params);
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
            let info = '?id_student=' + groups[i].students[j].uid + "&id_practice="
                + practice.id_practice;
            let result = await fetch('/filter-requsts' + info, params);
            info = await result.json();
            requests.push(info);
        }
    }
    return requests;//получили all заявок студентов выбранных групп
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
        let info = "?id_request=" + requests[i].id_request + "&id_organisation="
            + organisation.id;
        let result = await fetch('/exist-request' + info, params);
        if (result.status !== 404) {///ОШИБКА В КОНОСЛИ NOT FOUND
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
    })
        .catch(function (error) {
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
    })
        .catch(function (error) {
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
    })
        .catch(function (error) {
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
    })
        .catch(function (error) {
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

Model.prototype.insertRequestOrganisation = async function (student) {
    let params = {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin'
    };
    let date= new Date();
    var currentDate = date.format("yyyy-mm-dd");
    let info = '?id_request=' + student.id_request + "&id_organisation=" + student.id_organisation+"&id_status=1"+"&date_creation="+currentDate;
    await fetch('/insert-request-organisation' + info, params);
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
    }
    else {
        info = '?id_request=' + studentThatShouldBeApproved.id_request + "&id_organisation=" + studentThatShouldBeApproved.id_organisation;
    }
    await fetch('/update-request' + info, params);
};

module.exports = Model;

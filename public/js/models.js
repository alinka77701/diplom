const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'postgres://practdist:972979ss@82.179.88.27:5432/practdistdb');

const Document = sequelize.define('Document', {
  id_document: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name_document: {
    type: sequelize.Sequelize.TEXT,
    allowNull: false
  },
  id_status: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false
  },
  date_transfer: {
    type: sequelize.Sequelize.DATE,
    allowNull: true
  },
  name_person: {
    type: sequelize.Sequelize.TEXT,
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'Documents'
});

const Organisation = sequelize.define('Organisation', {
  id_organisation: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name_organisation: {
    type: sequelize.Sequelize.STRING,
    allowNull: false
  },
  email_organisation: {
    type: sequelize.Sequelize.STRING,
    allowNull: true
  },
  phone_organisation: {
    type: sequelize.Sequelize.STRING,
    allowNull: true
  },
  info_organisation: {
    type: sequelize.Sequelize.TEXT,
    allowNull: true
  },
  address_organisation: {
    type: sequelize.Sequelize.TEXT,
    allowNull: true
  },
  id_type_organisation: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false
  },
  max_students_number: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: true
  }

}, {
  timestamps: false,
  tableName: 'Organisations'
});

const Practice = sequelize.define('Practice', {
  id_practice: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  id_type_practice: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false
  },
  start_date_practice: {
    type: sequelize.Sequelize.DATE,
    allowNull: false
  },
  end_date_practice: {
    type: sequelize.Sequelize.DATE,
    allowNull: false
  },
  deadline_practice: {
    type: sequelize.Sequelize.DATE,
    allowNull: false
  },
  lections_number: {
    type: sequelize.Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Practices'
});

const Practice_Organisation = sequelize.define('Practice_Organisation', {
  id_practice: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_organisation: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  }
}, {
  timestamps: false,
  tableName: 'Practices_Organisations'
});

const Request = sequelize.define('Request', {
  id_request: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  id_student: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false
  },
  id_practice: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false
  },
  id_review: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: true
  },
  id_organisation: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Requests'
});

const Request_Organisation = sequelize.define('Request_Organisation', {
  id_request: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_organisation: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_status: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false
  },
  date_creation: {
    type: sequelize.Sequelize.DATE,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Requests_Organisations'
});

const Review = sequelize.define('Review', {
  id_review: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  comment_student: {
    type: sequelize.Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Reviews'
});

const Status = sequelize.define('Status', {
  id_status: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name_status: {
    type: sequelize.Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Statuses'
});

const Student = sequelize.define('Student', {
  id_student: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  uid_student_LDAP: {
    type: sequelize.Sequelize.TEXT,
    allowNull: false
  },
  email_student: {
    type: sequelize.Sequelize.TEXT,
    allowNull: true
  },
  phone_student: {
    type: sequelize.Sequelize.TEXT,
    allowNull: true
  },
  id_teacher: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: true
  }
}, {
  timestamps: false,
  tableName: 'Students'
});

const Teacher = sequelize.define('Teacher', {
  id_teacher: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  email_teacher: {
    type: sequelize.Sequelize.TEXT,
    allowNull: true
  },
  phone_teacher: {
    type: sequelize.Sequelize.TEXT,
    allowNull: true
  },
  uid_teacher_LDAP: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Teachers'
});

const Type_organisation = sequelize.define('Type_organisation', {
  id: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: sequelize.Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Types_organisation'
});

const Type_practice = sequelize.define('Type_practice', {
  id_type_practice: {
    type: sequelize.Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name_type_practice: {
    type: sequelize.Sequelize.Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'Types_practice'
});

Type_organisation.schema("public");
Document.schema("public");
Organisation.schema("public");
Practice.schema("public");
Practice_Organisation.schema("public");
Request.schema("public");
Request_Organisation.schema("public");
Review.schema("public");
Status.schema("public");
Student.schema("public");
Teacher.schema("public");
Type_practice.schema("public");

module.exports = {
  Document: Document,
  Organisation: Organisation,
  Practice: Practice,
  Practice_Organisation: Practice_Organisation,
  Request: Request,
  Request_Organisation: Request_Organisation,
  Review: Review,
  Status: Status,
  Student: Student,
  Teacher: Teacher,
  Type_organisation: Type_organisation,
  Type_practice: Type_practice
};
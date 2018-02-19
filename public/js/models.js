const sequelize = require('sequelize');
const Sequelize = new sequelize(
    'postgres://practdist:972979ss@82.179.88.27:5432/practdistdb');
const Documents = Sequelize.define('Documents', {
  id_document: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name_document: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  id_status: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  date_transfer: {
    type: Sequelize.DATE,
    allowNull: true
  },
  name_person: {
    type: Sequelize.TEXT,
    allowNull: true
  }
}, { timestamps: false });

const Organisations = Sequelize.define('Organisations', {
  id_organisation: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name_organisation: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email_organisation: {
    type: Sequelize.STRING,
    allowNull: true
  },
  phone_organisation: {
    type: Sequelize.STRING,
    allowNull: true
  },
  info_organisation: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  address_organisation: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  id_type_organisation: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  max_students_number: {
    type: Sequelize.INTEGER,
    allowNull: true
  }

}, { timestamps: false });

const Practices = Sequelize.define('Practices', {
  id_practice: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  id_type_practice: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  start_date_practice: {
    type: Sequelize.DATE,
    allowNull: false
  },
  end_date_practice: {
    type: Sequelize.DATE,
    allowNull: false
  },
  deadline_practice: {
    type: Sequelize.DATE,
    allowNull: false
  },
  lections_number: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, { timestamps: false });

const Practices_Organisations = Sequelize.define('Practices_Organisations', {
  id_practice: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_organisation: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  }
}, { timestamps: false });

const Requests = Sequelize.define('Requests', {
  id_request: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  id_student: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  id_practice: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  id_review: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  id_organisation: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, { timestamps: false });

const Requests_Organisations = Sequelize.define('Requests_Organisations', {
  id_request: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_organisation: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  id_status: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  date_creation: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, { timestamps: false });

const Reviews = Sequelize.define('Reviews', {
  id_review: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  comment_student: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, { timestamps: false });

const Statuses = Sequelize.define('Statuses', {
  id_status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name_status: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, { timestamps: false });

const Students = Sequelize.define('Students', {
  id_student: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  uid_student_LDAP: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  email_student: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  phone_student: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  id_teacher: {
    type: Sequelize.INTEGER,
    allowNull: true
  }
}, { timestamps: false });

const Teachers = Sequelize.define('Teachers', {
  id_teacher: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  email_teacher: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  phone_teacher: {
    type: Sequelize.TEXT,
    allowNull: true
  },
  uid_teacher_LDAP: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, { timestamps: false });

const Types_organisation = Sequelize.define('Types_organisation', {
  id_type_organisation: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name_type_organisation: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, { timestamps: false });

const Types_practice = Sequelize.define('Types_practice', {
  id_type_practice: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name_type_practice: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, { timestamps: false });




module.exports = {
  Documents: Documents,
  Organisations: Organisations,
  Practices: Practices,
  Practices_Organisations: Practices_Organisations,
  Requests: Requests,
  Requests_Organisations: Requests_Organisations,
  Reviews: Reviews,
  Statuses: Statuses,
  Students: Students,
  Teachers: Teachers,
  Types_organisation: Types_organisation,
  Types_practice: Types_practice
};
const { BelongsTo } = require("sequelize");
const Sequelize = require("sequelize");
const {configuration} = require("../config/db.config.js")

const sequelize = new Sequelize(

  configuration.DB,
  configuration.USER,
  configuration.PASSWORD,

  {
  host: configuration.HOST,
  dialect: "mysql",
  operatorsAliases: false,

pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
 
}

);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model")(sequelize, Sequelize);
db.book = require("../models/books.model")(sequelize,Sequelize);
db.file = require("./file.model")(sequelize,Sequelize);



db.file.belongsTo(db.book);
db.book.hasMany(db.file);


module.exports = db;
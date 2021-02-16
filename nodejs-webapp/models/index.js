const { BelongsTo } = require("sequelize");
const Sequelize = require("sequelize");
const {configuration} = require("../config/db.config.js")

const sequelize = new Sequelize(

  configuration.DB,
  configuration.USER,
  configuration.PASSWORD,
  
  {
  host: configuration.DB_ENDPOINT,
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


// db.user.belongsToMany(db.book,
//   {
//     as:'books',
//   through:'books_user', 
//   foreignKey: 'userid',
//   otherKey:'bookid'
// });

// db.book.belongsToMany(db.user,
//   {as:'users',
//   through:'books_user',
//   foreignKey:'bookid',
//   otherKey:'userid'
// });

db.book.belongsTo(db.user);

module.exports = db;

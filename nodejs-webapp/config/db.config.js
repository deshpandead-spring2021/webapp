const dotenv= require("dotenv");

dotenv.config();

var mysql = require('mysql');

configuration= {

  HOST:process.env.DB_ENDPOINT,
  USER:process.env.DB_USERNAME,
  PASSWORD:process.env.DB_PASSWORD,
  DB:process.env.DB_NAME,
  dialect: "mysql",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }

}


var connection = mysql.createConnection({

  host:process.env.DB_ENDPOINT,
  user:process.env.DB_USERNAME,
  password:process.env.DB_PASSWORD,
  database:process.env.DB_NAME,

})


module.exports ={

      connection,
     configuration
}

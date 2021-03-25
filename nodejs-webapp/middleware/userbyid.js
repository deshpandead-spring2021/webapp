const db = require("../models");
const User = db.user;
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC(); 


exports.findById = (userid) => {
  var db_user_findbyid_start_time = Date.now();
    return User.findByPk(userid, {
        attributes: ["id","username", "first_name","last_name","account_created","account_updated"]
      })
      .then((user) => {
    var db_user_findbyid_stop_time = Date.now();
    client.timing('timing_db_findbyid_user',db_user_findbyid_stop_time-db_user_findbyid_start_time)
        return user;
      })
      .catch((err) => {

        var user_create_end_time = Date.now();
        var db_user_findbyid_stop_time = Date.now();
        client.timing('db_user_findbyid_stop_time',db_user_findbyid_stop_time-db_user_findbyid_start_time)
        client.timing('timing_user_create', user_create_end_time - user_create_start_time );
        // console.log(">> Error while finding Question: ", err);
        logger.warn("Bad request check if data is entered correctly.")
         res.status(400).send("Cannot register user. Please check if you have entered correct data")
      });
  };

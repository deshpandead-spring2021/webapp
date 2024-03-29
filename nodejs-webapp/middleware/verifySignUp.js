const db = require("../models");
const User = db.user;
const logger = require('../config/logger')
var SDC = require('statsd-client');
const { cli } = require("winston/lib/winston/config");
client = new SDC();

checkDuplicateUsernameOrEmail = (req, res, next) => {

  logger.info("Creating a new user")
  client.increment('counter_post_new_user')
  var user_create_start_time = Date.now();
  var db_create_user_create_start_time= Date.now();
  var db_findone_user_start_time= Date.now();

  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  })
  .then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      var user_create_end_time= Date.now();
      var db_create_user_create_end_time = Date.now();
      var db_findone_user_end_time=Date.now();
      client.timing('timing_db_findone_user',db_findone_user_end_time-db_findone_user_start_time);
      client.timing('timing_user_create',user_create_end_time-user_create_start_time);
      client.timing('timing_db_create_user', db_create_user_create_end_time - db_create_user_create_start_time);
      logger.warn('Bad Request username is already in use');
      return;
    }

      next();
    
  })
  .catch((err) => {
    console.log(">> Error while registering user: ", err);
    logger.warn(">>Error while registering the user",err)
    var user_create_end_time= Date.now();
    var db_findone_user_end_time=Date.now();
    client.timing('timing_db_findone_user',db_findone_user_end_time-db_findone_user_start_time);
    client.timing('timing_user_create',user_create_end_time-user_create_start_time);
    logger.warn("Bad request, please check the body sent to the api.")
    res.status(400).send("Cannot register user. Please check if you have entered correct data. Enter the user data in JSON format as follows :-  username,first_name,last_name,password")
  });


  
};


const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;


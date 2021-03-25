const db = require("../models");
const User = db.user;
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();

checkDuplicateUsernameOrEmail = (req, res, next) => {
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
      logger.warn('Bad Request');
      var user_create_end_time = Date.now();
      client.timing('timing_user_create', user_create_end_time - user_create_start_time );
      return;
    }

      next();
    
  })
  .catch((err) => {
    console.log(">> Error while registering user: ", err);
    res.status(400).send("Cannot register user. Please check if you have entered correct data. Enter the user data in JSON format as follows :-  username,first_name,last_name,password")
  });


  
};


const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;


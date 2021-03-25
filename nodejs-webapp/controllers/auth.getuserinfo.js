const db = require("../models");
const User = db.user;
const tokenauth = require("../middleware/basicauthentication");
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();

 
  // Username

  exports.senduserinfo = async (req,res)=>{

  client.increment('counter_get_user')
  var get_user_info_start_time= Date.now()
    
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [loginname, userpassword] = credentials.split(':');
    console.log("loginname "+loginname)
    console.log("userpassword "+userpassword)
    
/**
 * Fetch user data from username and password
 */

var db_find_one_user_start_time=Date.now();

    const userinfo= User.findOne({
        where: {
          username: loginname
        }
        ,
        attributes:["id","first_name","username","last_name","account_created","account_updated"]
      })
      .then(user => {
        if (user) {
          var db_find_one_user_stop_time= Date.now();
          var get_user_info_stop_time= Date.now();
          client.timing('timing_get_user_info',get_user_info_stop_time-get_user_info_start_time);
          client.timing('timing_db_user_findone',db_find_one_user_stop_time-db_find_one_user_start_time);
          logger.info('User data sent')
          res.status(200).send(user);
        }
    
        else{
          logger.warn("Error while finding user data>>")
          var get_user_info_stop_time= Date.now();
          client.timing('timing_get_user_info',get_user_info_stop_time-get_user_info_start_time);
          var db_find_one_user_stop_time= Date.now();
          client.timing('timing_db_user_findone',db_find_one_user_stop_time-db_find_one_user_start_time);
          console.log("Error here in fetching user data>>>>>")
            res.status(400).json("Error while fetching user data");
        }
        
      });
        

  }
  

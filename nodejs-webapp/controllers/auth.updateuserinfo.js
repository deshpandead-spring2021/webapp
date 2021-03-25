const db = require("../models");
const User = db.user;
const sleep = ms => new Promise(res => setTimeout(res, ms));
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();

exports.updateuserinfo = async (req,res)=>{
  var update_user_info_start_time= Date.now() 
  client.increment('counter_update_user')

  logger.info("Started updating userinfo")
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [loginname, userpassword] = credentials.split(':');
    console.log("loginname "+loginname)
    console.log("userpassword "+userpassword)

const sentusername = req.body.username
const account_created = req.body.account_created
const account_updated = req.body.account_updated

// console.log("Printing uddate password here>>>>>>>>>>>>>");
// console.log(req.body.password)


console.log(loginname)
if(sentusername || account_created|| account_updated){
   var update_user_info_stop_time= Date.now()
   client.timing('timing_update_user_info',update_user_info_stop_time-update_user_info_start_time)

    res.status(400).json("Cannot update username or account_created or account_updated field ")
}


else{

  console.log(req.body.password);

   sleep(100);


   console.log("Printing user passwor>>>>>>>>>>>>>>>>>>>>>>>");
   console.log(req.body.password);

   /**
    * Update user info like firstname, lastname and password
    */

   var db_update_user_start_time= Date.now();

  const updateUser= await User.update({
      
      first_name:req.body.first_name,
      last_name:req.body.last_name,
      password:req.body.password
    
    },
    { 
      where: {username: loginname},
    },
    
   
    )
  
    .then(user => {

      var db_update_user_stop_time= Date.now();
      var update_user_info_stop_time= Date.now()
      client.timing('timing_update_user_info',update_user_info_stop_time-update_user_info_start_time)
      client.timing('timing_db_update_time',db_update_user_stop_time-db_update_user_start_time)
      logger.info("User updated succesfully")
    
      res.status(204).json("User updated successfully")

    })

    .catch(err=>{
      console.log(err.message)
      var update_user_info_stop_time= Date.now()
      client.timing('timing_update_user_info',update_user_info_stop_time-update_user_info_start_time)
      var db_update_user_stop_time= Date.now();
      client.timing('timing_db_update_time',db_update_user_stop_time-db_update_user_start_time)
      logger.warn("Error while updating user")
      res.status(500).send({message :err.message })
    })
}

  

  }
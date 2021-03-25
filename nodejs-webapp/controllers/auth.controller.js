const db = require("../models");
const User = db.user;
const findById =  require("../middleware/userbyid")

const sleep = ms => new Promise(res => setTimeout(res, ms));
const logger = require('../config/logger')
var SDC = require('statsd-client');
const { format } = require("express/lib/response");
client = new SDC();



exports.signup = async (req, res) => {
  logger.info("User creation method called")

  var user_create_start_time =Date.now();
  var db_user_create_start_time= Date.now();

  // Save User to Database

 const enteruser = await User.create({
    username: req.body.username,
    password:req.body.password,
    first_name:req.body.first_name,
    last_name:req.body.last_name
  })

  
  .catch(err=>{
    logger.warn('Bad Request');
    var user_create_end_time = Date.now();
    var db_user_create_stop_time=Date.now();
    
    client.timing('timing_user_create', user_create_end_time - user_create_start_time );
    client.timing('timing_db_user_create',db_user_create_stop_time-db_user_create_start_time)
    logger.warn("Bad request")
    res.status(400).send({message :err.message })
  })
  

await sleep(100);



const _user = await findById.findById(enteruser.id);

var user_create_end_time = Date.now();

logger.info("User creation request was successful")
var db_user_create_stop_time = Date.now();
client.timing('timing_db_user_create',db_user_create_stop_time-db_user_create_start_time);
client.timing('timing_user_create', user_create_end_time - user_create_start_time );

res.status(201).send(_user);

};

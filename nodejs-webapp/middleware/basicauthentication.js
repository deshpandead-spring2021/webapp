const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");
const logger = require ('../config/logger.js');
var StatsD = require('node-statsd'),
client = new StatsD();



basictokenauthentication = (req, res, next) => {
    
  client.increment('counter_get_user_data')


    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        logger.warn('Bad Request');
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }


// verify auth credentials
const base64Credentials =  req.headers.authorization.split(' ')[1];
const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
const [loginname, userpassword] = credentials.split(':');
// username = loginname
// console.log("loginname "+loginname)
// console.log("userpassword "+userpassword)


if(loginname==="" || userpassword===""){
    logger.warn('Bad Request');

    res.status(400).send("Username or password fields are not filled.")
    }

    
else{
    var db_find_user_email_start_time= Date.now();

    User.findOne({
        where:{
            username:loginname
        },
        attributes:[
            "password"
        ]
    })
  .then(user=>{
    // console.log("Printing user.password>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    // console.log(user.password)
    var db_find_user_email_stop_time= Date.now();
    client.timing('timing_db_find_user_byemail',db_find_user_email_stop_time-db_find_user_email_start_time)

    var result = bcrypt.compareSync(userpassword,user.password)

    console.log("Printing result>>>>>>>>>>>>>>>")
    console.log(result)
    if(result){
        console.log(result)
        console.log("Password is correct")
        // res.send("User is authenticated")
        
        next();
        // return loginname;
        }

    else{
        logger.warn('Bad Request');
        var db_find_user_email_stop_time= Date.now();
        client.timing('timing_db_find_user_byemail',db_find_user_email_stop_time-db_find_user_email_start_time)
        res.status(400).send("Username or password is incorrect. Please make sure you have signed up for this service")

    }
    return;
    
  })
  .catch((err) => {
    var db_find_user_email_stop_time= Date.now();
    client.timing('timing_db_find_user_byemail',db_find_user_email_stop_time-db_find_user_email_start_time)
    logger.warn('Bad Request');
    res.status(400).send("Cannot register user. Please check if you have entered correct data")
  });
   
    }
};


const tokenauth = {
  basictokenauthentication:basictokenauthentication
};

module.exports = tokenauth;


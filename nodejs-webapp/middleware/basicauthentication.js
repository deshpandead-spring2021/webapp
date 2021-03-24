const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");
const logger = require ('../config/logger.js');
var StatsD = require('node-statsd'),
client = new StatsD();


basictokenauthentication = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        logger.warn('Bad Request');
        var user_create_end_time = Date.now();
        client.timing('timing_user_create', user_create_end_time - user_create_start_time );

        return res.status(401).json({ message: 'Missing Authorization Header' });
    }


// verify auth credentials
const base64Credentials =  req.headers.authorization.split(' ')[1];
const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
const [loginname, userpassword] = credentials.split(':');
// console.log("loginname "+loginname)
// console.log("userpassword "+userpassword)


if(loginname==="" || userpassword===""){
    logger.warn('Bad Request');
    var user_create_end_time = Date.now();
    client.timing('timing_user_create', user_create_end_time - user_create_start_time );

    res.status(400).send("Username or password fields are not filled.")
    }

    
else{
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
        var user_create_end_time = Date.now();
        client.timing('timing_user_create', user_create_end_time - user_create_start_time );
        res.status(400).send("Username or password is incorrect. Please make sure you have signed up for this service")

    }
    return;
    
  })
  .catch((err) => {
    logger.warn('Bad Request');
    var user_create_end_time = Date.now();
    client.timing('timing_user_create', user_create_end_time - user_create_start_time );
    console.log(">> Error while registering User: ", err);
    res.status(400).send("Cannot register user. Please check if you have entered correct data")
  });
   
    }
};


const tokenauth = {
  basictokenauthentication:basictokenauthentication
};

module.exports = tokenauth;


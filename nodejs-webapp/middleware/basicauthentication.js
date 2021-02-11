const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");


basictokenauthentication = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }


// verify auth credentials
const base64Credentials =  req.headers.authorization.split(' ')[1];
const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
const [loginname, userpassword] = credentials.split(':');
console.log("loginname "+loginname)
console.log("userpassword "+userpassword)


if(loginname==="" || userpassword===""){
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
        res.status(400).send("Username or password is incorrect. Please make sure you have signed up for this service")
    }
    return;
    
  })
  .catch((err) => {
    console.log(">> Error while finding User: ", err);
    res.status(400).send("Cannot register user. Please check if you have entered correct data")
  });
   
    }
};


const tokenauth = {
  basictokenauthentication:basictokenauthentication
};

module.exports = tokenauth;


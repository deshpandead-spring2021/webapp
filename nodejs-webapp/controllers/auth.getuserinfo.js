const db = require("../models");
const User = db.user;
const tokenauth = require("../middleware/basicauthentication");
 
  // Username

  exports.senduserinfo = async (req,res)=>{
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [loginname, userpassword] = credentials.split(':');
    console.log("loginname "+loginname)
    console.log("userpassword "+userpassword)
    
/**
 * Fetch user data from username and password
 */
    const userinfo= User.findOne({
        where: {
          username: loginname
        }
        ,
        attributes:["id","first_name","username","last_name","account_created","account_updated"]
      })
      .then(user => {
        if (user) {
          res.status(200).send(user);
        }
    
        else{
          console.log("Error here in fetching user data>>>>>")
            res.status(400).json("Error while fetching user data");
        }
        
      });
        

  }
  

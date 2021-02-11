const db = require("../models");
const User = db.user;
const sleep = ms => new Promise(res => setTimeout(res, ms));

   exports.updateuserinfo = async (req,res)=>{
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

    res.status(400).json("Cannot update username or account_created or account_updated field ")
}


else{

   sleep(100);

   /**
    * Update user info like firstname, lastname and password
    */
  const updateUser= await User.update({
      
      first_name:req.body.first_name,
      last_name:req.body.last_name,
      password:req.body.password,
    },
    { 
      where: {username: loginname},
  
    individualHooks: true,
  
  },
   
    )
  
    .then(user => {
    
      res.status(204).json("User updated successfully")

    })

    .catch(err=>{
      console.log(err.message)
      res.status(500).send({message :err.message })
    })
}

  

  }
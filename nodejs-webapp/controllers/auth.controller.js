const db = require("../models");
const User = db.user;
const findById =  require("../middleware/userbyid")
var bcrypt = require("bcryptjs");

const sleep = ms => new Promise(res => setTimeout(res, ms));
const saltrounds =8;


exports.signup = async (req, res) => {

  // Save User to Database

 const enteruser = await User.create({
    username: req.body.username,
    password:req.body.password,
    first_name:req.body.first_name,
    last_name:req.body.last_name
  })

  
  .catch(err=>{
    res.status(400).send({message :err.message })
  })
  

await sleep(100);


const _user = await findById.findById(enteruser.id);

res.status(201).send(_user);

};

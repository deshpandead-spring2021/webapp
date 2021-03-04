const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");
const userinfocontroller = require("../controllers/auth.getuserinfo")
const updateuserinfo = require("../controllers/auth.updateuserinfo")
const {tokenauth} = require("../middleware");
const postbook= require("../controllers/auth.newbook")
const getbookid = require("../controllers/auth.bookbyid")
const deletebookid = require("../controllers/auth.deletebookid")
const allbooks = require("../controllers/auth.allbooks")
const multer = require('multer');
const upload = multer({dest:'uploads/'});
const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");
const Book =db.book;
const bookbyid =  require("../middleware/bookbyid");
const { user, file } = require("../models");
const File = db.file;
let express = require('express');
const app =express();
const sleep = ms => new Promise(res => setTimeout(res, ms));
const filebyid =  require("../middleware/filebyid") 
const justfileid= require("../middleware/filejusid")

const fs = require('fs');
const AWS = require('aws-sdk');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Post new user
  app.post("/v1/user",

    [
      verifySignUp.checkDuplicateUsernameOrEmail
    
    ],
    controller.signup
  );

  // Change user info

app.put("/v1/user/self",

[
  tokenauth.basictokenauthentication

],
updateuserinfo.updateuserinfo


);

//Get user info
app.get("/v1/user/self",

[
  tokenauth.basictokenauthentication

],
userinfocontroller.senduserinfo


);

//Post a new book 


app.post("/books",

[
  tokenauth.basictokenauthentication
],

postbook.postbook


);
//Get book info from bookid

app.get("/books/:id",
getbookid.getbookid

)

//Delete book from database using bookid

app.delete("/books/:id",
[
  tokenauth.basictokenauthentication
],
deletebookid.deletebook

)


//Get all the books from the database without authentication.
app.get("/books",

allbooks.getallbooks

)

//Post a new image for a book

app.post("/books/:book_id/image",[tokenauth.basictokenauthentication], upload.single('fileImage'),async function (req, res, next){



  console.log(req.file.originalname)
  const originalName =req.file.originalname



// verify auth credentials
const base64Credentials =  req.headers.authorization.split(' ')[1];
const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
const [loginname, userpassword] = credentials.split(':');
// console.log("loginname "+loginname)
// console.log("userpassword "+userpassword)


const bookidfromparam = req.params.book_id

const userinfo= await User.findOne({
    where: {
      username: loginname
    }
    ,
    attributes:["id"]
  })
  .then(user => {
    if (user) {
      // console.log("Printing user>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
      // console.log(user)
      return user;
    }

    else{
      console.log("Error here in fetching user data>>>>>")
        res.status(400).json("Error while fetching user data. Please check if the user is registered for posting new book");
    }
    
  });


  const bookinfo= await Book.findOne({
    where: {
      id: bookidfromparam
    }
    ,
    attributes:["user_id"]
  })
  .then(user => {
    if (user) {

      return user;
    }

    else{
      console.log("Error here in fetching user data>>>>>")
        res.status(404).json("Error while fetching book. Please check if the book is posted.");
    }
    
  });

  console.log("Printing existing userid>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+bookinfo.user_id)
  console.log("Printing new userid >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+ userinfo.id)
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
console.log((req.file));


  const existinguserid =bookinfo.user_id
  const enteruserid = userinfo.id

  if(existinguserid==enteruserid){

    const file = await File.create({
      file_name:req.file.originalname,
      user_id:userinfo.id,
      book_id:bookidfromparam
    })  
    
    .catch(err=>{
      res.status(401).send({message :err.message })
    })
  

    sleep(100);
     _file =await filebyid.findByFileid(file.file_id)
     console.log(_file)
  
    res.status(201).send(_file);

  }


  else{
      res.status(401).json("Error make sure that you have authority to perform this action.")
  }


const s3 = new AWS.S3();

const fileName = req.file.path;

const uploadFile = () => {
  fs.readFile(fileName, (err, data) => {
     if (err) throw err;
     const params = {
         Bucket: 'webapp.aditya.deshpande', // pass your bucket name
         Key: _file.s3_object_name, // file will be saved as testBucket/contacts.csv
         Body: data

     };
     s3.upload(params, function(s3Err, data) {
         if (s3Err) throw s3Err
         console.log(`File uploaded successfully at ${data.Location}`)
     });
  });
};

uploadFile();


 
});


app.delete("/books/:book_id/image/:image_id",[tokenauth.basictokenauthentication], upload.single('fileImage'),async function (req, res, next){

  var AWS = require('aws-sdk');

  // AWS.config.loadFromPath('');
  
  var s3 = new AWS.S3();


  const result = await justfileid.findByjustid(req.params.image_id)
  console.log(result)


  var params = {  Bucket: 'webapp.aditya.deshpande', Key: req.params.book_id +"/" + req.params.image_id+ "/" + result.file_name };
  console.log(params.Key)
  
  s3.deleteObject(params, function(err, data) {
    if (err) console.log(err, err.stack);  // error
    else     console.log("deleted",data);  // deleted
  });

  res.status(204).json("Image deleted successfully")


})


 

}
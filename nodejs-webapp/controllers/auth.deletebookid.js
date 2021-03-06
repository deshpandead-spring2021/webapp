const db = require("../models");
const User = db.user;
const Book =db.book;
const bookbyid =  require("../middleware/bookbyid");
const { user } = require("../models");
const fileid = require("../middleware/fileidforbookid")
const sleep = ms => new Promise(res => setTimeout(res, ms));

var AWS = require('aws-sdk');
const { json } = require("express/lib/response");


exports.deletebook = async (req, res) => {

  const base64Credentials =  req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [loginname, userpassword] = credentials.split(':');
  // console.log("loginname >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+loginname)
  // console.log("userpassword "+userpassword)
  
  const bookidfromparam = req.params.id
  
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
        // console.log("Printing user>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        // console.log(user)
        return user;
      }
  
      else{
        console.log("Error here in fetching user data>>>>>")
          res.status(404).json("Error while fetching book. Please check if the book is posted.");
      }
      
    });
  
    console.log("Printing existing userid>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+bookinfo.user_id)
    console.log("Printing new userid >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+ userinfo.id)
  
    const existinguserid =bookinfo.user_id
    const enteruserid = userinfo.id
  
    if(existinguserid==enteruserid){

   // AWS.config.loadFromPath('');
    
   var s3 = new AWS.S3();

  const bookid= req.params.id
  const fileids = await fileid.filebyuserid(bookid)

  // console.log("Here<><><><<<<<<<<<<<<<<<<<<<<<<<>>>????")
  console.log(fileids)

  for (var key in fileids) {
    if (fileids.hasOwnProperty(key)) {
      // console.log(fileids[key].file_id);
      // console.log(fileids[key].file_name);
      const obj = bookidfromparam+ "/"+ fileids[key].file_id +"/" + fileids[key].file_name
      // console.log(obj)
     
     
      var params = { Bucket: process.env.S3_BUCKET_NAME, Key: obj };
      console.log(params.Key)
      
      s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);  // error
        else     console.log("deleted",data);  // deleted
      });
}

else{
  res.status(404).json("Book not found")
}

    }
      
    
    const book = await Book.destroy({
      where: {
        id:bookidfromparam
      }
  })

  .then(book => {
        
      res.status(204).json("Book deleted successfully")
  
    })
    
    .catch(err=>{
      res.status(401).send({message :err.message })
    })
  
        res.status(204).json("No content found.")

  }

  else{
    res.status(401).json("Error make sure that you have authority to perform this action.")
}


 


};
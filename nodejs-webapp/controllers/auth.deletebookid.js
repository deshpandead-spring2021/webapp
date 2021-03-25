const db = require("../models");
const User = db.user;
const Book =db.book;
const bookbyid =  require("../middleware/bookbyid");
const { user } = require("../models");
const fileid = require("../middleware/fileidforbookid")
const sleep = ms => new Promise(res => setTimeout(res, ms));
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();


var AWS = require('aws-sdk');
const { json } = require("express/lib/response");
const { cli } = require("winston/lib/winston/config");


exports.deletebook = async (req, res) => {

  var delete_book_byid_start_time=Date.now()
  client.increment('counter_deletebook')

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
        logger.warn("Error while deleteing book")
        console.log("Error deleting the book ")
          res.status(400).json("Error while deleting data. Please check if the user is registered for posting new book");
      }
      
    });
  
    
    var db_find_book_start_time= Date.now()
    const bookinfo= await Book.findOne({
      where: {
        id: bookidfromparam
      }
      ,
      attributes:["user_id"]
    })
    .then(user => {
      if (user) {
        var db_find_book_stop_time= Date.now();
        client.timing('timing_db_find_book_byid',db_find_book_stop_time-db_find_book_start_time)
        // console.log("Printing user>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        // console.log(user)
        return user;
      }
  
      else{
        console.log("Error here in fetching user data>>>>>")
        client.timing('timing_db_find_book_byid',db_find_book_stop_time-db_find_book_start_time)
        logger.warn("Error while fetching the book")
          res.status(404).json("Error while fetching book. Please check if the book is posted.");
      }
      
    });
  
    console.log("Printing existing userid>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+bookinfo.user_id)
    console.log("Printing new userid >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> "+ userinfo.id)
  
    const existinguserid =bookinfo.user_id
    const enteruserid = userinfo.id
  
    if(existinguserid==enteruserid){

   // AWS.config.loadFromPath('');
   var s3_delete_object_start_time= Date.now()
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

      var s3_delete_object_stop_time= Date.now()
      client.timing('timing_db_delete_object',s3_delete_object_stop_time-s3_delete_object_start_time)
      
}

else{

  var s3_delete_object_stop_time= Date.now()
  client.timing('timing_db_delete_object',s3_delete_object_stop_time-s3_delete_object_start_time)
  logger.warn("Book not found and error")
  res.status(404).json("Book not found")
}

    }
      
    var db_delte_book_start_time= Date.now()
    
    const book = await Book.destroy({
      where: {
        id:bookidfromparam
      }
  })

  .then(book => {
    var db_delte_book_stop_time= Date.now()
    var delete_book_byid_start_time=Date.now()
    client.timing('timings_delete_bookbyid',delete_book_byid_start_time-delete_book_byid_start_time)
    client.timing('timing_db_delete_boook',db_delte_book_stop_time-db_delte_book_start_time)
 
    logger.info("Book deleted successfully")

      res.status(204).json("Book deleted successfully")
  
    })
    
    .catch(err=>{
       var db_delte_book_stop_time= Date.now()
       var delete_book_byid_start_time=Date.now()
       client.timing('timings_delete_bookbyid',delete_book_byid_start_time-delete_book_byid_start_time)
      client.timing('timing_db_delete_boook',db_delte_book_stop_time-db_delte_book_start_time)
      logger.warn("error deleteing book")
      res.status(401).send({message :err.message })
    })

        res.status(204).json("No content found.")

  }

  else{
    var db_delte_book_stop_time= Date.now()
    var delete_book_byid_start_time=Date.now()
    client.timing('timings_delete_bookbyid',delete_book_byid_start_time-delete_book_byid_start_time)
    client.timing('timing_db_delete_boook',db_delte_book_stop_time-db_delte_book_start_time)
    res.status(401).json("Error make sure that you have authority to perform this action.")
}


 


};
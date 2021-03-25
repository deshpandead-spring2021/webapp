const db = require("../models");
const User = db.user;
const Book =db.book;
const bookbyid =  require("../middleware/bookbyid")
const sleep = ms => new Promise(res => setTimeout(res, ms));
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();



exports.postbook = async (req, res) => {

  client.increment('counter_post_new_book')
  var post_book_start_time= Date.now()

const base64Credentials =  req.headers.authorization.split(' ')[1];
const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
const [loginname, userpassword] = credentials.split(':');
// console.log("loginname >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+loginname)
// console.log("userpassword "+userpassword)


var db_finduser_byloginname_start_time = Date.now();
const userinfo= await User.findOne({
    where: {
      username: loginname
    }
    ,
    attributes:["id"]
  })
  .then(user => {
    if (user) {
    
      var db_finduser_byloginname_stop_time=Date.now()
      client.timing('timing_db_find_user_logginname',db_finduser_byloginname_stop_time-db_finduser_byloginname_start_time)
      // console.log("Printing user>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
      // console.log(user)
      return user;
    }

    else{
      var db_finduser_byloginname_stop_time=Date.now()
      logger.info("Error here in fetching user data>>>>>>>>>>")
      console.log("Error here in fetching user data>>>>>")
      client.timing('timing_db_find_user_logginname',db_finduser_byloginname_stop_time-db_finduser_byloginname_start_time)
        res.status(400).json("Error while fetching user data. Please check if the user is registered for posting new book");
    }
    
  });




  // Save Book to Database

  var db_create_new_book_start_time= Date.now();

 const book = await Book.create({
    title: req.body.title,
    author:req.body.author,
    isbn:req.body.isbn,
    published_date:req.body.published_date,
    user_id:userinfo.id,
  })

  
  .catch(err=>{

    var db_create_new_book_stop_time= Date.now();
    client.timing('timing_db_create_book',db_create_new_book_stop_time-db_create_new_book_start_time)
    res.status(400).send({message :err.message })
  })
  

await sleep(100);


var db_create_new_book_stop_time= Date.now();

var post_book_stop_time= Date.now()
client.timing('timing_post_new_book',post_book_stop_time-post_book_start_time)
client.timing('timing_db_create_book',db_create_new_book_stop_time-db_create_new_book_start_time)

const _book = await bookbyid.findBybookid(book.id)

res.status(201).send(_book);

};
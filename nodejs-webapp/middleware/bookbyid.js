const sequelize = require("sequelize");
const db = require("../models"); 
const Book = db.book;
const File =db.file
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();


exports.findBybookid = (bookid) => {
  var db_find_book_byid_start_time= Date.now();
    return Book.findByPk(bookid, {
      include:[
        {
            model:File,
            as:"files",
            attributes:["file_name","s3_object_name","file_id","createdAt","user_id"]
        }
    ],
        attributes: ["id","title", "author","isbn","published_date","book_created","user_id",[sequelize.fn('date_format', sequelize.col('published_date'), '%M, %Y'), 'published_date']]
        
      })
      .then((book) => {
        var db_find_book_byid_stop_time= Date.now();
        client.timing('timing_db_find_bookbyid',db_find_book_byid_stop_time-db_find_book_byid_start_time)
        return book;
      })
      .catch((err) => {
        var db_find_book_byid_stop_time= Date.now();
         console.log(">> Error while finding Question: ", err);
         client.timing('timing_db_find_bookbyid',db_find_book_byid_stop_time-db_find_book_byid_start_time)
         logger.info("Bad request cannot fetch book by id.")
         res.status(400).send("Cannot fetch the book. Make sure this book has posted.")
      });
  };
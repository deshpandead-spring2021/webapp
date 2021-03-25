const db = require("../models");
const sequelize = require("sequelize");
const User = db.user;
const Book =db.book;
const File = db.file
const bookbyid =  require("../middleware/bookbyid");
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();


exports.getallbooks = async (req, res) => {
    client.increment('counter_getallbooks')
    var db_get_allbooks_start_time=Date.now()
    var get_allbooks_start_time= Date.now()

const allbooks = Book.findAll({

    include:[
        {
            model:File,
            as:"files",
            attributes:["file_name","s3_object_name","file_id","createdAt","user_id"]
        }
    ],
    attributes: ["id","title", "author","isbn","published_date","book_created","user_id",[sequelize.fn('date_format', sequelize.col('published_date'), '%M, %Y'), 'published_date']]
})
.then(book=>{
    var db_get_allbooks_stop_time= Date.now();
    var get_allbooks_stop_time= Date.now();
    client.timing('timing_getallbooks',get_allbooks_stop_time-get_allbooks_start_time)

    client.timing('timing_db_get_allbooks',db_get_allbooks_stop_time-db_get_allbooks_start_time)
    res.status(200).json(book)
})
.catch((err) => {
    var db_get_allbooks_stop_time= Date.now();
    var get_allbooks_stop_time= Date.now();
    client.timing('timing_getallbooks',get_allbooks_stop_time-get_allbooks_start_time)
    client.timing('timing_db_get_allbooks',db_get_allbooks_stop_time-db_get_allbooks_start_time)
    console.log(">> Error while finding the requested book ", err);
    res.status(400).send("Cannot find the books. Make sure the data entered is correct.")
 });


};
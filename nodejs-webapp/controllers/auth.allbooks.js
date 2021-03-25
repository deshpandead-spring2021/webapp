
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
    res.status(200).json(book)
})
.catch((err) => {
    console.log(">> Error while finding the requested book ", err);
    res.status(400).send("Cannot find the books. Make sure the data entered is correct.")
 });


};
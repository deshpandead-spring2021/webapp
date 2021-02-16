const db = require("../models");
const sequelize = require("sequelize");
const User = db.user;
const Book =db.book;
const bookbyid =  require("../middleware/bookbyid");
const { book } = require("../models");
const sleep = ms => new Promise(res => setTimeout(res, ms));


exports.getallbooks = async (req, res) => {

const allbooks = Book.findAll({
    attributes: ["id","title", "author","isbn","published_date","book_created","user_id",[sequelize.fn('date_format', sequelize.col('published_date'), '%M, %Y'), 'published_date']]
})
.then(book=>{
    res.status(200).json(book)
})

};

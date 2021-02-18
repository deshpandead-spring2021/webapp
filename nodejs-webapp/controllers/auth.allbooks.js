const db = require("../models");
const sequelize = require("sequelize");
const User = db.user;
const Book =db.book;
const bookbyid =  require("../middleware/bookbyid");

exports.getallbooks = async (req, res) => {

const allbooks = Book.findAll({
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

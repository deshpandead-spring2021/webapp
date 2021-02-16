const sequelize = require("sequelize");
const db = require("../models"); 
const Book = db.book;

exports.findBybookid = (bookid) => {
    return Book.findByPk(bookid, {
        attributes: ["id","title", "author","isbn","published_date","book_created","user_id",[sequelize.fn('date_format', sequelize.col('published_date'), '%M, %Y'), 'published_date']]
        
      })
      .then((book) => {
        return book;
      })
      .catch((err) => {
         console.log(">> Error while finding Question: ", err);
         res.status(400).send("Cannot fetch the book. Make sure this book has posted.")
      });
  };

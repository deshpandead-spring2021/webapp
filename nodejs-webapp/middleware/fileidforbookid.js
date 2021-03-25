var Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);
const sequelize = require("sequelize");
const db = require("../models"); 
const Book = db.book;
const File =db.file
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();



exports.filebyuserid = (bookId) => {
    console.log("Herere?????????????????????????????????")
  return File.findAll({
       raw:true,
        where: {
            bookId: bookId
        },
        attributes:['file_id','file_name']
      })
    //   .then((fid) => {
    //       console.log("Printing fileids hererererer>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+fid.)
    //     return fid.toJSON();
    //   })

    .then((fid => {
        fid.map(fid => fid.file_id)
        console.log(fid)
        return fid
    }
    )
    )
      .catch((err) => {
         console.log(">> Error while finding Question: ", err);
        //  res.status(400).send("Cannot fetch the book. Make sure this book has posted.")
      });
  };
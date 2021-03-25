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
var db_file_user_id_start_time= Date.now();
    // console.log("Herere?????????????????????????????????")
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
      var db_file_user_id_stop_time= Date.now()
      client.timing('timing_db_find_file_user_id',db_file_user_id_stop_time-db_file_user_id_start_time)
        fid.map(fid => fid.file_id)
        console.log(fid)
        return fid
    }
    )
    )
      .catch((err) => {
        var db_file_user_id_stop_time= Date.now()
        client.timing('timing_db_find_file_user_id',db_file_user_id_stop_time-db_file_user_id_start_time)
         console.log(">> Error while finding Question: ", err);
         logger.warn("Bad request ")
        //  res.status(400).send("Cannot fetch the book. Make sure this book has posted.")
      });
  };
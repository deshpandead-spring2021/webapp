
const sequelize = require("sequelize");
const db = require("../models"); 
const File = db.file;
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();


exports.findByFileid = (file_id) => {
  var db_find_file_byid_start_time = Date.now();
    return File.findByPk(file_id, {
        attributes: ["file_id","s3_object_name","file_name","createdAt","user_id",]
        
      })
      .then((file_id) => {
      var db_find_file_byid_stop_time = Date.now();
      client.timing('timing_db_find_file_byid',db_find_file_byid_stop_time-db_find_file_byid_start_time)
        return file_id;
      })
      .catch((err) => {
        var db_find_file_byid_stop_time = Date.now();
         console.log(">> Error while finding File: ", err);
         client.timing('timing_db_find_file_byid',db_find_file_byid_stop_time-db_find_file_byid_start_time)
         res.status(400).send("Cannot fetch the file. Make sure this book has file.")
      });
  };
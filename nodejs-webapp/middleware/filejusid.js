const sequelize = require("sequelize");
const db = require("../models"); 
const File = db.file;
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();


exports.findByjustid = (file_id) => {
  var db_find_file_byid_start_time = Date.now();
    return File.findByPk(file_id, {
        attributes: ["file_name"]
        
      })
      .then((file_id) => {
        var db_find_file_byid_stop_time = Date.now();
        client.timing('timing_db_file_findbyid',db_find_file_byid_stop_time- db_find_file_byid_start_time)
        console.log(file_id)
        return file_id;
      })
      .catch((err) => {
        var db_find_file_byid_stop_time = Date.now();
         console.log(">> Error while finding File: ", err);
         client.timing('timing_db_file_findbyid',db_find_file_byid_stop_time- db_find_file_byid_start_time)
         logger.warn("Bad request cannot fetch the file.")
         res.status(400).send("Cannot fetch the file. Make sure this book has file.")
      });
  };
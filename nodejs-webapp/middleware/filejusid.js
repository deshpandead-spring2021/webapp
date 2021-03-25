const sequelize = require("sequelize");
const db = require("../models"); 
const File = db.file;
const logger = require('../config/logger')
var SDC = require('statsd-client');
client = new SDC();


exports.findByjustid = (file_id) => {
    return File.findByPk(file_id, {
        attributes: ["file_name"]
        
      })
      .then((file_id) => {
        console.log(file_id)
        return file_id;
      })
      .catch((err) => {
         console.log(">> Error while finding File: ", err);
         res.status(400).send("Cannot fetch the file. Make sure this book has file.")
      });
  };